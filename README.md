# StubSpy

A responsive coming-soon page built with Next.js App Router, Tailwind CSS, the installed shadcn Button, and Lucide icons. Uses the supplied scout mascot and original copy inspired by the spacious, rounded TickPick references.

## Local development

```sh
npm install
npm run dev
```

## Enable real waitlist signups

1. Create a Supabase project, then run `supabase/waitlist.sql` in its SQL editor.
2. Copy `.env.example` to `.env.local`. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` from the project settings. Use the server secret key (`sb_secret_...`); never expose it with a `NEXT_PUBLIC_` prefix.
3. Restart development. For production, set both variables in your hosting environment and rebuild/redeploy so the rendered signup availability is updated.
4. Submit a test address and verify a row appears in the `waitlist` table. Submitting that address again should succeed without adding a duplicate.

The form only confirms success after Supabase accepts the insert. Without configuration, it explains that signups are not open and does not store emails in the browser. The API normalizes emails, bounds request bodies, rejects cross-origin browser requests and a honeypot field, and returns generic errors without exposing keys or addresses. Row Level Security and table grants keep the list inaccessible to public Supabase clients. Before public launch, configure platform rate limiting for `POST /api/waitlist`; the honeypot is only basic spam protection.

No confirmation or launch emails are sent automatically. Connect your preferred email sender when ready, honor removal requests, and keep the inline email-use notice aligned with your actual process.

Supabase reference: https://supabase.com/docs/guides/getting-started/api-keys

## Build and private design preview

```sh
npm run lint
npm run build
npm run build:preview
```

The normal build includes `/api/waitlist` and supports a standard Next.js deployment (for example, Vercel). The preview build exports to `out/` with a separate `.next-preview/` build directory, leaves API routes out, and explicitly disables email collection. It is a design preview, even if Supabase is configured locally. `.openai/hosting.json` identifies that private Sites preview. Publish the normal server build to enable signups.

The purchased Cloudflare domain has not been changed. Connect `stubspy.com` to the final production host when you are ready to launch; keep registrar/DNS management in Cloudflare.

## Product choices

- One primary action: join the launch waitlist.
- The scout mascot, saturated blue buttons, and pastel feature cards establish a distinct identity.
- Section-level tracking is explained as planned functionality. The price-drop card is explicitly a demo, not a live price or savings claim.
- No unverified marketplace partnerships, subscriber counts, launch dates, or lowest-price guarantees.
- The project blueprint is background for this landing page; data-provider selection, scraper access, affiliate terms, and pricing need separate validation before the tracker MVP.
