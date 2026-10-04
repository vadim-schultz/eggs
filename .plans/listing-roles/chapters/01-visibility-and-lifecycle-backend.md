---
name: "Chapter 1 — Visibility and lifecycle backend"
overview: "Server enforces visibility (active, eggs left, not expired); reserve rejects expired listings; seller mark-sold/withdraw/expiry-bound removed."
todos:
  - id: migration
    content: "Migration: listings_near filter, reserve guards, drop mark_listing_sold/cancelled and listing_expires_at_bound"
    status: done
  - id: seed
    content: "seed.sql: fully reserved and expired fixtures"
    status: done
  - id: smoke
    content: "rls-smoke: hidden when fully reserved/expired, reappears on cancel, reserve on expired fails"
    status: done
isProject: false
---

# Chapter 1 — Visibility and lifecycle backend

**Repo:** `eggs` · **Branch:** `feat/listing-roles-backend` · **Status:** shipped

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

"Fully reserved or older than 24h means not visible" holds in the database, not in the UI. Today [`listings_near`](../../../supabase/migrations/20261004100000_price_per_egg.sql) has no filter, `listing_select_public` is `using (true)`, and expiry relies on the daily [`expire_listings()`](../../../supabase/migrations/20260929110000_expiry.sql) cron (up to ~24h late).

## Design decisions

**New migration** `supabase/migrations/<ts>_listing_visibility.sql`:

- `create or replace` `listings_near` (same signature and columns) adding `where status = 'active' and egg_count > 0 and expires_at > now()` to the distance predicate.
- `reserve_listing(uuid, int)` / `lock_listing_for_reserve` ([`20261002100000_partial_reserve.sql`](../../../supabase/migrations/20261002100000_partial_reserve.sql)): raise when `expires_at <= now()` or `status <> 'active'`. Read the current bodies first; change only the guard.
- Drop `mark_listing_sold`, `mark_listing_cancelled`, and the `listing_expires_at_bound` check (all from the expiry migration). Keep `expire_listings()` and its cron ([D7](../gaps-and-decisions.md)).
- `listing_select_public` stays (the owner and the buyer's own reservation still read the row by id); only the map query hides listings.
- Leave `sold` / `cancelled` in the status check constraint (unused; see deferred items).

**Do not** edit applied migrations.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `supabase/migrations/<ts>_listing_visibility.sql` | supabase | New |
| `supabase/seed.sql` | supabase | Add fully reserved and expired listings |
| `scripts/rls-smoke.ts` | scripts | New cases; remove mark-sold / cancel / expiry-bound cases |

## Red tests (rls-smoke, run against local Supabase)

| Test | Asserts |
| --- | --- |
| **Happy:** active listing with eggs, expires in the future → returned by `listings_near` | |
| **Happy:** buyer cancels a reservation on a fully reserved listing → listing returns in `listings_near` | |
| **Negative:** listing with `egg_count = 0` (fully reserved) is not returned | |
| **Negative:** listing with `expires_at` in the past is not returned even while `status = 'active'` | |
| **Negative:** `reserve_listing` on an expired listing raises | |
| **Negative:** `mark_listing_sold`, `mark_listing_cancelled` no longer exist | |

## Green

`supabase db reset`; run rls-smoke; `./ci.sh`.

## Refactor gate

Migration only redefines what it changes; no duplicated function bodies beyond the replaced ones — report outcome.

## Git workflow

```bash
git checkout feat/plans-listing-roles && git pull
git checkout -b feat/listing-roles-backend
```

```text
feat(supabase): enforce listing visibility and drop seller lifecycle rpcs
```
