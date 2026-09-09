# StubSpy

**Big nights. Smaller prices.**

StubSpy is building a smarter way to follow resale ticket prices for concerts, sports, and theater. The goal is simple: choose an event, pick your section and target price, and get a heads-up when tickets fit your budget.

This repository contains the **coming-soon website and launch waitlist**, built with Next.js. Ticket tracking and price-drop notifications are planned product features; the price alert displayed on the page is an illustrative demo.

[Visit StubSpy](https://www.stubspy.com)

## What’s included

- **Responsive landing page** with a custom scout mascot, clear product story, and early-access signup.
- **Supabase-backed waitlist** with server-side email validation and duplicate-safe signup handling.
- **Explicit signup states** that confirm success only after storage succeeds and explain when signups are not configured.
- **Separate preview build** for reviewing the design without collecting email addresses.
- **Vercel deployment support** for the full Next.js server application.

## Built with

**Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4**

The interface uses shadcn components and Lucide icons. Supabase stores waitlist entries, Vercel hosts the production site, and Cloudflare manages the domain.

## Getting started

Install Node.js compatible with the version of Next.js in [package.json](package.json), then run:

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). The landing page runs without Supabase configuration; email collection remains unavailable until the backend is connected.

### Enable waitlist signups

1. Create a Supabase project and run [supabase/waitlist.sql](supabase/waitlist.sql) in its SQL editor.
2. Copy [.env.example](.env.example) to `.env.local` and provide:

   ```dotenv
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SECRET_KEY=your_supabase_server_secret_key
   ```

3. Use a server secret key (`sb_secret_...`) and keep it server-only. Do not add a `NEXT_PUBLIC_` prefix.
4. Restart the development server. For production, set both variables in the hosting environment and rebuild/redeploy to update signup availability.
5. Submit a test email and confirm it appears in the `waitlist` table. Submitting it again should succeed without creating a duplicate.

The API normalizes email addresses, limits request-body size, rejects cross-origin browser requests and honeypot submissions, and returns generic errors. The SQL configures Row Level Security and grants to keep the waitlist inaccessible to public Supabase clients.

Before opening signups publicly, configure platform rate limiting for `POST /api/waitlist`; the honeypot provides only basic spam protection. Confirmation and launch emails are not sent automatically. Connect an email sender when ready, support removal requests, and keep the inline email-use notice aligned with the actual process.

See the [Supabase API key guide](https://supabase.com/docs/guides/getting-started/api-keys) for key types.

## Build and preview

```sh
npm run lint
npm run build
npm start
```

The normal build includes `/api/waitlist` and requires a Next.js-compatible server deployment.

For a separate static design preview:

```sh
npm run build:preview
```

This build exports assets to `.next-preview/`, copies them to `out/`, omits API routes, and explicitly disables email collection even when Supabase is configured locally. `.openai/hosting.json` identifies the private Sites preview. Run the normal build again before deploying the server app because Next.js reuses its internal `.next/` build directory.

## Deploy to Vercel

Use the **Next.js** framework preset, `npm run build`, and the default output directory. Configure `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in the production environment before rebuilding to enable signups.

```sh
npx vercel --prod
```

Do not set `STUBSPY_STATIC_PREVIEW` on Vercel; it is reserved for the separate design preview. `.vercelignore` excludes local environment files, build artifacts, and Sites preview metadata. Local Vercel project linking lives in the ignored `.vercel/` directory.

## Project structure

```text
app/               # Landing page, layout, styles, and waitlist API
components/        # Signup form and reusable UI
lib/               # Shared helpers
public/            # Brand assets
supabase/          # Waitlist database setup
scripts/           # Static preview build
docs/              # Supporting project documentation
```

## Product direction

The planned tracker focuses on event discovery, section-level price targets, and price-drop alerts, with ticket purchases completed on the seller’s marketplace. Data-provider access, affiliate terms, and pricing still require validation before a tracker MVP. The landing page makes no marketplace partnership, launch-date, or lowest-price guarantee.
