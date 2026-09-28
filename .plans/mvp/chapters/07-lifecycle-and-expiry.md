---
name: "Chapter 7 — Lifecycle and expiry"
overview: "The expire_listings() SECURITY DEFINER function and its daily pg_cron schedule, plus seller-facing mark-as-sold/cancelled controls and an expires_at editor on ListingDetail."
todos:
  - id: cron
    content: "pg_cron extension, expire_listings() function, daily schedule"
    status: pending
  - id: seller-actions
    content: "Mark sold / mark cancelled, edit expires_at (seller only)"
    status: pending
  - id: status-ui
    content: "Status badges reflect expired/sold/cancelled everywhere a listing renders"
    status: pending
isProject: false
---

# Chapter 7 — Lifecycle and expiry

**Repo:** `eggs` (`src/`, `supabase/`) · **Branch:** `feat/eggs-lifecycle-and-expiry` · **Status:** planned

**Depends on:** [2](02-schema-and-rls.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §9 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

A listing nobody touches for three days stops cluttering the browse view on its own, and a seller can say
"this is sold" or "never mind" without waiting for that timer. This closes the loop the rest of the app
opened: chapter 2 gave every listing an `expires_at`; this chapter is what actually acts on it.

## Design decisions

**`expire_listings()` is `SECURITY DEFINER`, the one function in this app that is.** Every other RPC
(chapters 4 and 6) is `SECURITY INVOKER` because a signed-in user is doing something to their own rows;
expiry has no calling user at all — `pg_cron` invokes it on a schedule as the `postgres` role — so it must
run with elevated privilege to update rows across all sellers. It is intentionally narrow: one `UPDATE
listing SET status = 'expired' WHERE status = 'active' AND expires_at < now()`, nothing else, so the
privilege it needs is easy to audit.

**`pg_cron` is enabled and scheduled entirely in SQL**, same as `postgis` in chapter 2 — `create extension
if not exists pg_cron;` plus `select cron.schedule('expire-listings-daily', '0 3 * * *', $$select
expire_listings();$$);` both live in the migration. No dashboard step creates the schedule; the dashboard
is only where you go to *look at* it (see [Manual configuration](#manual-configuration)).

**Seller actions reuse the existing RPC shape.** `mark_listing_sold(p_listing_id)` and
`mark_listing_cancelled(p_listing_id)` are two more small `SECURITY INVOKER` functions (owner-only via RLS
on `listing` UPDATE, §6) rather than a generic "set status" RPC — each name says exactly what it does, and
neither can be misused to set an arbitrary status (e.g. jumping straight to `'reserved'` without a real
reservation).

**`expires_at` is seller-editable, within a bound.** The edit control on `ListingDetail` (seller view
only) lets the seller push the expiry out (e.g. up to 14 days from now) rather than offering a free-form
date picker with no ceiling — enforced by a `CHECK` on the column, not just the UI, matching the app's
existing pattern of defense-in-depth constraints (chapter 2, chapter 4).

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `supabase/migrations/<ts>_expiry.sql` | `pg_cron` extension, `expire_listings()`, the daily `cron.schedule`, `mark_listing_sold`, `mark_listing_cancelled`, `expires_at` bound check |
| `src/components/SellerActions.tsx` | Mark sold / mark cancelled buttons + `expires_at` editor, seller-only |
| `src/components/StatusBadge.tsx` | Renders the listing status consistently on `ListingCard` and `ListingDetail` |
| `src/components/SellerActions.test.tsx`, `src/components/StatusBadge.test.tsx` | Tests below |
| `scripts/rls-smoke.ts` | Extend with the cases below |

**Edit:**

| Path | Change |
| --- | --- |
| `src/routes/ListingDetail.tsx` | Mount `SellerActions` (seller only) and `StatusBadge` |
| `src/components/ListingCard.tsx` | Use `StatusBadge` instead of the inline label from chapter 5 |
| `src/i18n/strings.de.ts` | `status.*`, `seller.*` keys |

## Manual configuration

None to *create* the schedule — see Design decisions above. The one dashboard step tied to this chapter is
a **verification**, and it can only happen against the hosted project, so it is folded into chapter 8's
checklist: after `supabase db push`, confirm Database → Extensions shows `pg_cron` enabled and Database →
Cron Jobs lists `expire-listings-daily`; check Database → Logs the day after the first deploy to confirm it
ran. Locally, the schedule also exists inside the Dockerized Postgres `supabase start` runs, but this plan
verifies expiry by calling `expire_listings()` directly (below) rather than waiting a day for local cron to
fire.

## Red tests

**Vitest:**

| Test | Asserts |
| --- | --- |
| `StatusBadge · renders the correct label and color for each status` | `active`, `reserved`, `sold`, `expired`, `cancelled` |
| `SellerActions · not rendered for a non-owner` | Ownership check mirrors RLS intent |
| `SellerActions · mark sold calls mark_listing_sold and updates the shown status` | Mocked client |
| `SellerActions · mark cancelled calls mark_listing_cancelled and updates the shown status` | Mocked client |
| `SellerActions · expires_at editor rejects a date beyond the allowed bound` | Client-side mirror of the DB check |

**Smoke script addition:**

| Case | Asserts |
| --- | --- |
| `expire_listings()` sets `status = 'expired'` on an `active` listing whose `expires_at` is in the past | Core behavior |
| `expire_listings()` does not touch an `active` listing whose `expires_at` is in the future | Negative |
| `expire_listings()` does not touch a `reserved` listing even if `expires_at` has passed | Scope: only `active` rows |
| `mark_listing_sold` by the owner succeeds; by a non-owner is rejected | RLS ownership |
| Updating `expires_at` beyond the allowed bound violates the `CHECK` constraint | DB-level defense in depth |

## Green

1. `pg_cron` extension, `expire_listings()`, schedule, `expires_at` check; first three + last smoke cases.
2. `mark_listing_sold`/`mark_listing_cancelled`; remaining smoke case; vitest tests 2–4.
3. `StatusBadge`; test 1. Swap into `ListingCard`.
4. `SellerActions` expiry editor; test 5. Wire into `ListingDetail`.

## Refactor gate

`SellerActions` stays three small pieces (mark sold, mark cancelled, edit expiry) composed in one
component, not one function branching on an action string. Report the outcome.

## Verification

```bash
npm run test -- --run
./ci.sh
supabase start && supabase db reset
npx tsx scripts/rls-smoke.ts
npm run dev
# manual: as seller, mark a listing sold and cancelled; edit expires_at past and within the bound;
# call `select expire_listings();` directly in the local SQL console and confirm a past-due listing
# disappears from Home's active view
```

## Out of scope

The hosted project's cron verification (chapter 8), notifications when a listing expires (deferred, open
seam), a seller-facing "my listings" list view beyond what `ListingDetail` already exposes to the owner
(tracked as an open seam alongside editing, chapter 4).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-lifecycle-and-expiry
```

```text
test(schema): describe expire_listings, seller status RPCs and the expires_at bound

feat(schema): add pg_cron expiry job and seller lifecycle actions
```
