---
name: MVP — Gaps and decisions
overview: "Settled architecture decisions for the eggs MVP, and the open seams deferred past v1."
isProject: false
---

# MVP — Gaps and decisions

**Architecture:** [00-architecture.md](00-architecture.md) · **Rollout:** [01-rollout.md](01-rollout.md)

## On Jev

The plan says to route genuine trade-off calls through Jev (TypeSafe). This pass's environment had no
`TYPESAFE_API_KEY` available to the agent (it lives in the macOS Keychain and reading it was blocked by
the sandbox's credential-materialization guard), so **D1–D9 below were made directly**, not via a Jev
call. The ones marked **(Jev candidate)** are genuine judgment calls with real trade-offs worth a second,
typed opinion once the key is wired into the session (e.g. exported to the shell before launch, or
handed to the agent directly) — revisit them before or during chapter 4/6/7 if you want that check.

## Settled

| # | Decision |
| --- | --- |
| D1 | No custom backend server — the browser talks to Supabase directly; Postgres RLS is the only authorization layer. Rejected a Litestar/Express API layer: nothing in this app's logic (CRUD + a radius query + one status trigger) needs a server process. |
| D2 | Browsing requires no login; posting and reserving do. *(Jev candidate — the alternative, letting anyone post with an unguessable edit-link and no account, trades spam risk for lower onboarding friction; worth weighing against expected abuse for a small local app.)* |
| D3 | A listing is reserved as a whole — no partial-quantity claiming in v1. *(Jev candidate — partial reservation is closer to the real seller mental model ("I have 3 dozen, sell 1 at a time") but roughly doubles the reservation chapter's complexity; deferred rather than ruled out.)* |
| D4 | Contact handoff is a one-time reveal of a single seller-written free-text field (`contact_note`) after reservation — no auth email shown, no in-app chat. Kept in its own `listing_contact` table (not a column on `listing`) so it can carry RLS that hides it from public browsing while `listing` itself stays fully public. *(Jev candidate — chat is more self-contained/private but is a standalone real-time feature; a reveal is one table and no new infrastructure.)* |
| D5 | Google is the only OAuth provider in v1. Apple Sign-In excluded — it requires a paid Apple Developer Program membership, which conflicts with "no billed services." GitHub was considered as a second provider but skipped for now: fewer of the target users (chicken keepers, not developers) have a GitHub account, and every extra provider is another OAuth app to register and another button to test. |
| D6 | Geo search uses PostGIS (`ST_DWithin`), not a hand-rolled haversine SQL function. PostGIS ships as a free, one-line `create extension` on Supabase, so the "avoid complexity" argument for haversine doesn't hold — PostGIS is both more correct and no more work to set up. |
| D7 | Expiry runs via `pg_cron` inside Supabase, not a GitHub Actions scheduled workflow or a Supabase Edge Function. It's a single SQL function and a cron entry — zero extra vendor, nothing to deploy separately. |
| D8 | No photo upload in v1. A listing is fully described by count, unit, price, and location; a photo is a nice-to-have, not load-bearing for "can I reserve this," and Supabase Storage + an upload UI is a self-contained follow-up chapter rather than v1 scope. |
| D9 | Single Supabase project split logically into dev/prod by environment variables (`.env.local` vs Cloudflare Pages env), not two separate Supabase projects, to stay inside one free-tier project. Revisit if dev seed data risks colliding with real production listings before go-live. |
| D10 | UI is German only, but every string goes through `t(key)` into a flat `strings.de.ts` dictionary rather than being hardcoded inline — no i18n framework (`react-i18next` etc.) since there's nothing to negotiate with only one locale. Scaffolded in chapter 1 so it's a convention from the first component, not a retrofit. |

## Open seams (deferred past v1, future `.plans/<feature>/` folders)

- **Partial-quantity reservations** (D3) — would need a `remaining_count` on `listing` and a quantity
  column on `reservation`, with the same double-booking guard generalized to "sum of active
  reservations ≤ remaining_count."
- **In-app messaging** (D4) — a `message` table scoped to a `reservation_id`, plus Supabase Realtime
  subscriptions; natural next step if the plain contact reveal proves insufficient.
- **Listing photos** — one Supabase Storage bucket, signed upload URL, and an `image_path` column.
- **Notifications** — email (or push, if a mobile wrapper ever exists) when a listing is reserved,
  cancelled, or about to expire. No provider chosen yet; would need to respect "no billed API key"
  (e.g. Supabase's built-in auth emails only go so far — a transactional email provider likely needs
  a free-tier API key, which is a smaller ask than the app's core dependencies but still a gap).
- **Abuse/moderation** — reporting a listing, blocking a seller/buyer, rate-limiting posts. Nothing
  today beyond RLS ownership checks.
- **Multiple sellers per household / shared listings** — out of scope; one `seller_id` per listing.
- **Additional locales** — adding English (or another language) means a `strings.en.ts` file plus a
  locale picker; because D10 already routes every component through `t(key)`, no component rewrite is
  needed, only new dictionary files and a switcher.
