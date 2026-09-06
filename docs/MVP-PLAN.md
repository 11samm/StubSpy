# StubSpy MVP build plan

Status: agreed product requirements; implementation and provider selection pending.
Planning baseline: September 6, 2026. Delivery target: four weeks from implementation kickoff, not a fixed calendar deadline.

## Outcome and scope

Build a recruiting-quality web demo that its creator and a small beta cohort can genuinely use. Personal utility and portfolio value are the leading priorities; eventual revenue should offset operating costs. Solo developer/product owner, with Codex handling implementation and the owner handling decisions, accounts, and realistic testing. Native iOS follows web stability, without a fixed deadline.

Concert-first discovery and marketing, with nationwide event search and concerts/sports wherever the selected marketplace supports them. Candidate acceptance examples: underscores, Camp Flog Gnaw, and Olivia Rodrigo. These are interests, not confirmed available events; select actual event dates and listings during data validation.

Required MVP:
- One ticket marketplace and a validated listing-level data source.
- Event search and event details.
- Venue/map image alongside selectable individual sections, plus presets such as all 100-level sections. Interactive map regions are conditional on reliable event-specific geometry and appropriate reuse rights; they must not delay the working alert flow.
- Quantity and maximum per-ticket price, including mandatory fees. Reserved-seat tickets must be together and purchasable in the requested quantity. Incomplete fees or adjacency information must remain explicitly unverified and must not produce a confirmed qualifying alert.
- Festival matching distinguishes admission tier (GA/VIP/etc.) and pass duration/date (single day/weekend/etc.). Do not compare incompatible pass types or assume GA means standing for all venues.
- Email notifications and an alert dashboard with pause, manual resume, edit, and delete controls.
- Invite-only/capped beta. Exact limits are provisional until provider measurements are available.

Not required for the four-week demo: multiple marketplaces, native iOS, mobile push, payments/subscriptions, predictive pricing, universal interactive venue maps, or affiliate revenue. Basic match history is useful for explaining alerts; a polished historical-price product is deferred.

## Alert lifecycle

1. The user creates an alert for an event, quantity, selected sections/groups or admission product, and price cap. All prices are per ticket; display the total for the requested quantity too. Match a single purchasable listing, not unrelated seats combined from separate listings.
2. Evaluate the latest complete, fresh snapshot against active alerts. A qualifying offer on initial creation may trigger the first email; a prior higher price is not required.
3. Send the first email once per qualifying episode. Include observed time, exact match criteria, price basis, seller link, and the fact that availability can change before purchase.
4. If the user has not followed through, allow one reminder after 24 hours, only after a fresh check confirms a qualifying offer. If the refresh fails or data is stale, defer within event validity rather than send an unverified reminder. Cancel the pending reminder when paused, deleted, or expired.
5. Clicking through intentionally pauses tracking until manual resume. Email opens and background GET/link-preview requests never change alert state. Proposed implementation: email opens a StubSpy match page; an explicit Continue to marketplace action performs a protected POST to pause and then redirects. This avoids treating email scanners as user intent. Show Resume tracking clearly.
6. After the single reminder, do not send daily repeats. A meaningful further price decrease or a genuinely new qualifying episode may create a new notification; define a conservative threshold/cooldown during implementation and test against price oscillation. Resume checks immediately for a fresh match; do not resend the identical recent notification automatically.
7. Stop checks for ended events and inactive watches. Preserve timestamps and notification records needed to explain behavior.

Secure email actions: scoped, expiring, unguessable tokens; no email addresses in URLs; state-changing requests require deliberate user action and appropriate CSRF protection. Keep authentication/account authorization separate from possession of a listing link.

## First gate: prove listing access before committing to the provider

Time box: first two working days. SeatGeek approval is pending. If its accessible API lacks required listing fields, evaluate scraping another marketplace through a measured provider trial. Do not assume API approval includes listing access.

For at least a seated concert, a GA event, and a festival:
- Verify event identity, date, timezone, venue, and source IDs.
- Inspect listing identifiers, raw section and row, quantity/split restrictions, adjacency semantics, mandatory fees, currency, listing URL, and festival product attributes.
- Verify pagination/completeness and distinguish no inventory from a failed or partial fetch.
- Repeat retrievals to measure latency, reliability, freshness, request count, and actual billed units including retries/pagination/startup costs.
- Confirm permitted data use, storage, linking, and map/image reuse for the chosen source.
- Produce a cost estimate from measured rates and an explicit supported/unsupported field matrix.

Pass: an affordable source can reliably support the core quantity/section/all-in-price promise and at least one real end-to-end email. If no source passes the time box, present measured alternatives and adjust coverage/provider with the owner. Continue independent interface work with clearly labeled fixtures, but do not claim a live-data MVP is complete.

Research references (capabilities must be reconfirmed against actual access):
- https://github.com/api-evangelist/seatgeek — independent third-party profile supplied by the owner.
- https://seatgeek.github.io/ — older first-party documentation says individual listings are not exposed; not proof of present access entitlements.
- https://developer.seatgeek.com/ — current developer entry point.
- https://support.seatgeek.com/hc/en-us/articles/360033945453-Why-can-t-I-select-the-number-of-tickets-that-I-want — purchasable quantity may differ from inventory quantity.

## Architecture: smallest system that demonstrates real engineering

Keep the existing Next.js App Router site on Vercel. Use Supabase PostgreSQL and Auth, one transactional email provider, and one scheduler/job executor selected after checking current limits and cost. Avoid a separate Express service initially. Browser and later iOS clients use the same server API and database-backed business rules. Keep provider credentials server-side.

Pipeline: due event -> claim job -> provider adapter -> validate/normalize snapshot -> match active alerts -> persist notification outbox -> email worker -> record delivery outcome.

Provider adapter: isolate external schema changes. Preserve raw labels and source identifiers; normalize into a canonical event/listing model. Store money as integer minor units with currency, fee completeness, observed timestamp, quantity choices, adjacency status, and product/pass attributes. Unknown values remain unknown. Never infer contiguous seats solely from matching section/row or assume quantity >= requested means a permitted split.

Venue modeling: section IDs and aliases belong to a venue configuration/event. Level presets select explicit section mappings; a numeric prefix is not a universal venue rule. Keep raw labels and confidence/review status to make mapping errors diagnosable. Event IDs are internal; source identifiers are namespaced.

Suggested records: profiles, events, event_sources, venue_configurations, sections, section_aliases, section_groups, alerts, alert_sections, poll_jobs, snapshots/listings, match_episodes, notification_outbox, notification_attempts, and usage_ledger. Implement only fields required by the first vertical slice before expanding.

Reliability: durable due times and jobs, leases to prevent overlapping fetches, bounded retries/backoff, idempotent snapshot/match processing, unique notification deduplication keys, and a transactional outbox. Record provider failures separately from empty inventory. Handle the ambiguous email-send timeout case using provider idempotency where supported; do not promise mathematically exactly-once delivery. Do not use in-memory timers as the scheduler.

## Monitoring and the ticket-data budget

Ticket-data budget: $50/month. Hosting, database, and email are separate costs to estimate and present before paid upgrades. No paid provider signup or trial purchase is authorized merely by setting this budget.

- Poll events, not individual users/alerts; reuse one snapshot for every watcher of that event.
- Search can be nationwide while monitoring is bounded. Initial proposal: three active alerts per user, an invite-only cohort, and a cap on distinct monitored events. Set the event cap from measured provider economics.
- Poll only events with active alerts. Deduplicate queued work and enforce per-event cooldowns; user refresh requests share the same quota and cache.
- Prioritize by event proximity, observed volatility, freshness, and relevant price proximity. A cheap aggregate-price signal can accelerate a check, but cannot be the sole trigger: section prices can fall while the event minimum stays constant.
- Proposed cadence bands for evaluation, not a service guarantee: 6-hour checks for distant/quiet events, hourly for nearer events, and 15-minute checks for a tightly capped near-event/high-priority group. Validate and adjust against measured cost and source limits.
- Reserve estimated cost before dispatch. Track billed requests/results, retries, failed fetches, and provider balance where available. Use daily pacing and a safety reserve below $50; reconcile measured usage. Set provider-side limits where supported because internal estimates alone cannot guarantee a hard vendor billing cap.
- Slow low-priority monitoring as projected spend approaches the allowance; suspend paid retrieval before exhausting the reserve. Show users when checks are delayed or paused. Never label stale data live.
- Dispatch notifications promptly after detection; distinguish detection latency (polling interval) from processing/email-delivery latency. Track both. Email arrival time is not fully under our control.

Illustrative load, not a quote: 20 distinct events at a 15-minute interval generate 57,600 event checks per 30-day month before pagination/retries. Costs must be derived from the selected provider's measured billing units.

## Four-week delivery sequence

Week 1 — Data proof and working vertical slice
- Finish provider gate and cost worksheet.
- Set up database/auth and email sender with domain verification.
- Search/select a real event, save an alert, perform a normalized fetch, and deliver one genuine qualifying email.
- Keep a separate deterministic fixture path for demos/tests where prices do not happen to drop live.

Week 2 — Product matching and alert controls
- Complete event details, section/preset selection, quantities, fee/adjacency validation, and festival product matching.
- Build dashboard editing, pause/manual resume, marketplace handoff, and the single reminder.
- Add venue imagery when available without blocking core functionality.

Week 3 — Reliable, bounded monitoring
- Durable scheduling, shared polls, retries, outbox, deduplication, and expiry.
- Usage ledger, cost pacing, caps, stale-data indicators, and an operator health view.
- Run a small real beta and measure false matches, fetch failures, email delays, and spending.

Week 4 — Stabilize and demonstrate
- Resolve failures from beta use; run end-to-end and authorization tests.
- Refine responsive UX, accessibility, empty/error states, and onboarding.
- Add interactive maps only if the core release is already stable and source data makes the work bounded.
- Prepare architecture diagram, measured results, tradeoff notes, and a reproducible demo. No new critical features in the final stabilization days.

## Definition of done

- A real user can search a supported event and save a valid alert.
- Individual sections and groups resolve correctly; festival tiers/durations do not mix.
- Matching respects requested purchasable quantity, reserved-seat adjacency, currency, and complete mandatory fees.
- A verified qualifying snapshot produces an email through the live pipeline; a controlled fixture can reproduce the scenario without claiming fixture data is live.
- Duplicate fetches/retries do not generate uncontrolled repeat emails.
- One reminder is sent only after the required fresh check, then stops for the same episode.
- Deliberate marketplace handoff pauses the alert; scanner GETs do not. Manual resume works.
- Failed/partial retrievals do not masquerade as sold-out inventory or confirmed price drops.
- User data and alert mutations are authorized; secrets stay server-side.
- Monitoring shares work across users, honors configured limits, and stops on ended/inactive events.
- Usage and latency measurements substantiate the advertised freshness and budget expectations.
- The production web app is stable on Vercel, with setup/runbook documentation sufficient to reproduce it.

## Owner learning and decisions

Provide short walkthroughs at each milestone covering: canonical schemas and uncertainty, section aliasing, adaptive scheduling and shared work, cost-per-watched-event, idempotency/outbox design, retries, and observability. Maintain architecture decision notes with the problem, alternatives, selected approach, and measured evidence. The owner decides provider tradeoffs, paid service approvals, actual beta caps, and scope changes; routine implementation choices stay with Codex.

Next action: begin the time-boxed listing-data feasibility spike. No production feature implementation or paid purchases have started as part of this planning document.
