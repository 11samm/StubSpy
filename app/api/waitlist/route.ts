const unavailable = "Waitlist signups aren’t open just yet. Please check back soon.";
const failure = "We couldn’t save your email. Please try again in a moment.";
const reply = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return reply({ error: "Please sign up from the StubSpy website." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return reply({ error: "Expected a JSON request." }, 415);
  // Bound the body even when Content-Length is absent or incorrect.
  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "Please enter an email address." }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) { await reader.cancel(); return reply({ error: "Request is too large." }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return reply({ error: "Please enter a valid email address." }, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return reply({ error: "Please enter a valid email address." }, 400);
  const data = body as Record<string, unknown>;
  if (data.website) return reply({ error: "We couldn’t accept this signup. Please try again." }, 400);
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply({ error: "Please enter a valid email address." }, 400);
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return reply({ error: unavailable }, 503);
  try {
    const response = await fetch(new URL("/rest/v1/waitlist?on_conflict=email", url), {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({ email, source: "coming-soon", consent_version: "launch-updates-v1" }),
      signal: AbortSignal.timeout(10000), cache: "no-store",
    });
    if (!response.ok) return reply({ error: failure }, 502);
    // Same result for new and existing signups, without exposing membership.
    return reply({ ok: true });
  } catch { return reply({ error: failure }, 502); }
}
