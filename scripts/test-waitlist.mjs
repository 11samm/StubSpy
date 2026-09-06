import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const code = ts.transpileModule(readFileSync('app/api/waitlist/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const originalFetch = globalThis.fetch;
const originalUrl = process.env.SUPABASE_URL;
const originalKey = process.env.SUPABASE_SECRET_KEY;
const req = (body, headers = {}) => new Request('https://stubspy.com/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
try {
  delete process.env.SUPABASE_URL; delete process.env.SUPABASE_SECRET_KEY;
  assert.equal((await POST(req({ email: 'fan@example.com' }))).status, 503);
  for (const body of [null, [], {}, { email: 'broken' }, { email: 'x'.repeat(260) + '@example.com' }]) assert.equal((await POST(req(body))).status, 400);
  assert.equal((await POST(req({ email: 'fan@example.com' }, { origin: 'https://other.example' }))).status, 403);
  assert.equal((await POST(req({ email: 'fan@example.com' }, { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal((await POST(req({ email: 'fan@example.com', website: 'bot' }))).status, 400);
  assert.equal((await POST(req({ email: 'x'.repeat(3000) }))).status, 413);
  assert.equal((await POST(new Request('https://stubspy.com/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }))).status, 400);
  process.env.SUPABASE_URL = 'https://test.supabase.co'; process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_only';
  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(String(url), 'https://test.supabase.co/rest/v1/waitlist?on_conflict=email');
    assert.equal(options.headers.apikey, 'sb_secret_test_only');
    assert.equal(options.headers.Prefer, 'resolution=ignore-duplicates,return=minimal');
    assert.equal(JSON.parse(options.body).email, 'fan@example.com');
    return new Response(null, { status: 201 });
  };
  for (let i = 0; i < 2; i++) assert.deepEqual(await (await POST(req({ email: ' FAN@Example.com ' }, { origin: 'https://stubspy.com' }))).json(), { ok: true });
  assert.equal(calls, 2);
  globalThis.fetch = async () => new Response('private upstream error', { status: 500 });
  const failure = await POST(req({ email: 'fan@example.com' }));
  assert.equal(failure.status, 502); assert.ok(!(await failure.text()).includes('private upstream'));
  globalThis.fetch = async () => { throw new Error('network failure'); };
  assert.equal((await POST(req({ email: 'fan@example.com' }))).status, 502);
  console.log('Waitlist API checks passed: validation, body limits, origin, honeypot, missing configuration, normalized insert, duplicate preference, and upstream failures. Supabase responses mocked.');
} finally {
  globalThis.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl;
  if (originalKey === undefined) delete process.env.SUPABASE_SECRET_KEY; else process.env.SUPABASE_SECRET_KEY = originalKey;
}
