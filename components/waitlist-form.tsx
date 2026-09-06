"use client";
import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, LoaderCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WaitlistForm({ configured }: { configured: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    if (!configured) { setState("error"); setMessage("Waitlist signups aren’t open just yet. Please check back soon."); return; }
    const form = new FormData(event.currentTarget);
    setState("loading"); setMessage("");
    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), website: form.get("website") }), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong. Please try again.");
      setState("success");
    } catch (error) {
      setState("error"); setMessage(error instanceof Error && error.name !== "TimeoutError" && error.name !== "TypeError" ? error.message : "We couldn’t connect. Please try again in a moment.");
    }
  }
  return <>
    {state === "success" ? <div className="signup-success" role="status"><CheckCircle2 /><div><strong>You’re on the list!</strong><p>We’ll email you when StubSpy is ready for its first fans.</p></div></div> :
      <form onSubmit={submit} className="signup-form" aria-label="Join the StubSpy waitlist" aria-busy={state === "loading"}>
        <div className="email-control"><Mail aria-hidden="true" /><label htmlFor="email" className="sr-only">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="Your email address" required maxLength={254} disabled={state === "loading"} aria-describedby={state === "error" ? "signup-error signup-note" : "signup-note"} aria-invalid={state === "error" ? true : undefined} /></div>
        <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <Button type="submit" disabled={state === "loading"} className="signup-button">{state === "loading" ? <>Joining <LoaderCircle className="loading-spinner" /></> : <>Join the waitlist <ArrowRight /></>}</Button>
      </form>}
    {state === "error" && <p id="signup-error" role="alert" className="signup-error">{message}</p>}
    <p id="signup-note" className="signup-note">Early access. No spam. Just a heads-up when we launch.</p>
    <details className="privacy-note"><summary>Your email stays yours <ChevronDown aria-hidden="true" /></summary><p>We’ll store your email to send StubSpy early-access and launch updates. We won’t sell it or share it with ticket marketplaces. You can ask to be removed by replying to an update.</p></details>
  </>;
}
