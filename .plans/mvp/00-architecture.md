---
name: MVP — Architecture
overview: "A hyperlocal marketplace for excess eggs: sellers post quantity, price and rough location; buyers reserve a whole listing and arrange in-person pickup. No payments, no shipping, no custom backend server — the browser talks to Supabase directly, with Postgres RLS as the authorization layer."
isProject: false
---

# MVP — Architecture

**Rollout:** [01-rollout.md](01-rollout.md) · **Decisions:** [gaps-and-decisions.md](gaps-and-decisions.md) · **Chapters:** [chapters/](chapters/)

---

## 1. Why

People who keep backyard chickens regularly have more eggs than they can use and sell or give away
the surplus informally — a note on a fence, a local Facebook group. There's no lightweight, purpose-built
place to say "I have 2 dozen eggs for €4, pick up in Downtown" and let a neighbour claim them before
someone else does. This is a farm-stand honesty-box, digitized: no checkout, no delivery, no chat —
just "here's what I have, here's roughly where, reserve it if you want it."

## 2. Non-goals (v1)

- No payments or checkout — price is informational; cash/in-person at pickup.
- No delivery/shipping logistics.
- No in-app chat — contact is a one-time reveal after reservation (§8).
- No partial-quantity reservations — a listing is reserved as a whole (§5, §7); splitting one listing
  across multiple buyers is deferred (see [gaps-and-decisions.md](gaps-and-decisions.md)).
- No photo uploads in v1 — a listing is text + location only; adding one optional photo is a later chapter.
- No moderation tooling, no reporting/abuse flow, no rate limiting beyond what RLS gives for free.
- No mobile app. No multi-locale i18n — UI copy is German only (§11), though it's structured as
  translation keys from day one so a second locale is an addition, not a rewrite.

## 3. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | Vite + React + TypeScript | Standard, fast dev loop, static output. |
| UI | Chakra UI | Accessible primitives, fast to build forms and lists with. |
| Backend | **None.** The browser talks to Supabase directly via `@supabase/supabase-js`. | No server to write, deploy, or keep warm; Postgres RLS is the authorization layer (§6). |
| Database | Supabase Postgres, `postgis` extension enabled | Free tier; `ST_DWithin` gives "eggs near me" without a separate geo service. |
| Auth | Supabase Auth, Google as the only OAuth provider in v1 | Free; only the public **anon key** is exposed client-side, no secret key management. See §7 for scope. |
| Maps / tiles | Leaflet + OpenStreetMap tiles | No API key. |
| Geocoding (postcode/place → lat/lng) | OSM Nominatim public endpoint | No API key; usage-policy-compliant volume for a small local app. |
| Scheduled jobs | Postgres `pg_cron` extension, inside the same Supabase project | Expires stale listings (§9); zero extra vendor, no Edge Function needed. |
| Hosting | Cloudflare Pages, connected to the GitHub repo | Free static hosting, deploys on push. |
| CI | GitHub Actions running `./ci.sh` (lint, typecheck, vitest, build) | Same convention as other projects in this workspace. |
| UI text | Flat `strings.de.ts` dictionary + a tiny `t(key)` helper — no i18n framework | Single locale (§11); a real library (e.g. `react-i18next`) is only worth the dependency once a second locale is real. |

**Explicitly excluded** because they need a billed API key or a paid account: Mapbox, Google Maps
JS/Places, Apple Sign-In (requires a paid Apple Developer account), any SMS provider.

## 4. Why no custom API server

Everything the app needs — CRUD on two tables, a radius query, "is this mine," and blocking a second
reservation on an already-reserved listing — is expressible as Postgres RLS policies, check constraints,
and one trigger. There's no cross-cutting business logic (no localization layer, no dependency graph,
no crawler) that would justify a server process. Adding one later (e.g. for email notifications) is a
possible future chapter, not a v1 requirement.

## 5. Data model

```
listing
  id            uuid pk
  seller_id     uuid fk -> auth.users
  egg_count     int            -- e.g. 24
  unit          text           -- 'dozen' | 'each' (display unit for egg_count)
  price_cents   int
  currency      text default 'EUR'
  location      geography(Point, 4326)   -- PostGIS
  location_label text                     -- free text, e.g. "Downtown, near the market"
  note          text null
  status        text check in ('active','reserved','sold','expired','cancelled')
  created_at    timestamptz default now()
  expires_at    timestamptz              -- default created_at + 3 days, seller-editable

reservation
  id            uuid pk
  listing_id    uuid fk -> listing
  buyer_id      uuid fk -> auth.users
  status        text check in ('active','cancelled')
  created_at    timestamptz default now()

listing_contact
  listing_id    uuid pk fk -> listing   -- one-to-one
  contact_note  text                    -- free text the seller wrote, e.g. "text me at ..."
```

One active reservation per listing, enforced by a partial unique index
(`UNIQUE (listing_id) WHERE status = 'active'`) plus a trigger that flips `listing.status` to
`'reserved'` on insert and back to `'active'` on cancel — this is what makes reservation whole-listing
only (§7) and closes the double-booking race at the database level, not in application code.

`listing_contact` is a separate table, not a column on `listing`, purely so it can carry its own RLS:
`listing` stays fully public-readable, while `contact_note` is readable only by the seller and by a
buyer with an active reservation on that listing (§8). Postgres RLS is a per-row, not per-column,
predicate, so hiding one column from an otherwise-public row needs its own table — column-level grants
don't compose with row-level policies for "this column is visible to fewer rows than the rest."

## 6. Authorization (RLS sketch)

| Table | SELECT | INSERT | UPDATE |
| --- | --- | --- | --- |
| `listing` | public (`anon` + `authenticated`), rows with any status | `authenticated`, `seller_id = auth.uid()` | owner only; status transitions constrained by trigger, not free-form |
| `reservation` | buyer or the listing's seller (`auth.uid() in (buyer_id, listing.seller_id)`) | `authenticated`, `buyer_id = auth.uid()`, target listing `status = 'active'` | buyer or seller may cancel |
| `listing_contact` | the listing's seller, or a buyer with an `active` reservation on that listing | `authenticated`, `auth.uid() = ` the listing's `seller_id` | seller only |

No table is ever written to by an anonymous session. Browsing needs no session at all (§7).

## 7. Auth scope

Browsing and search are public — no login. Login (Google via Supabase Auth) is required for exactly
two actions: **posting** a listing and **reserving** one. This keeps the friction where it has to be
(so listings and reservations are attributable and RLS can enforce ownership) and nowhere else.

## 8. Contact handoff

No auth email is ever shown to a buyer. Contact is exactly one free-text field, `contact_note`
(e.g. "text me at …" or "ring the bell at 12 Fenn Road"), which the seller writes when posting a
listing (chapter 4) and can edit later. It's stored in `listing_contact` (§5), invisible to anyone
browsing, and revealed on the listing detail page only once a buyer has an active reservation on that
listing — visible to that buyer and to the seller. No in-app messaging in v1; arranging pickup happens
outside the app, using whatever the seller chose to share.

## 9. Expiry and lifecycle

A daily `pg_cron` job runs a `SECURITY DEFINER` SQL function that sets `status = 'expired'` on any
`listing` where `status = 'active' AND expires_at < now()`. Sellers can also mark a listing `sold` or
`cancelled` directly; buyers/sellers can cancel an `active` reservation, which reopens the listing.

## 10. Out of scope, revisited

See [gaps-and-decisions.md](gaps-and-decisions.md) for the full list of deferred features and open
seams (partial-quantity reservations, in-app messaging, photos, notifications).

## 11. UI language

All user-facing copy is German. Every string a component renders goes through a `t(key)` lookup into
one flat dictionary (`src/i18n/strings.de.ts`) instead of being written inline — not because v1 needs
to switch languages, but so a future second locale is "add `strings.en.ts` and a picker," not a sweep
through every component. Code identifiers, comments and commit messages stay English, as does anything
that isn't shown to a user (log messages, internal error strings). Seller-entered content (`note`,
`location_label`) is free text the seller types in whatever language they choose — no translation
applied to user content, only to the app's own chrome.

Date, number and currency formatting uses `Intl` with the `de-DE` locale (e.g. `1.234,56 €`, not
`1,234.56`). No `Accept-Language` negotiation — there is exactly one locale to serve.
