---
name: "Chapter 2 — Database schema and RLS"
overview: "supabase/ CLI project, the postgis extension, the listing/reservation/listing_contact tables with the reservation trigger and RLS policies from the architecture doc, the listings_near geo RPC, and a smoke script proving RLS behaves as documented."
todos:
  - id: init
    content: "supabase init, local stack via supabase start"
    status: done
  - id: schema
    content: "listing/reservation/listing_contact tables, checks, trigger, RLS"
    status: done
  - id: geo
    content: "listings_near(lat, lng, radius_m) RPC using ST_DWithin"
    status: done
  - id: smoke
    content: "scripts/rls-smoke.ts"
    status: done
isProject: false
---

# Chapter 2 — Database schema and RLS

**Repo:** `eggs` (`supabase/`) · **Branch:** `feat/eggs-schema-and-rls` · **Status:** shipped

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §5, §6, §9 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Every later chapter (auth, posting, browsing, reserving, expiry) reads or writes these three tables
through RLS, never through application-level checks. This chapter is where "public can read, only the
owner can write, a listing can have at most one active reservation" becomes enforced by Postgres, not by
trusted client code.

## Design decisions

**One migration, four concerns, in dependency order**: extension → tables/checks → trigger → RLS
policies. Splitting the geo RPC into its own migration in the same PR keeps `git blame` legible without
adding a second chapter (the rollout's chapter 5 is frontend-only and calls this RPC as-is — see
[00-architecture.md §5](../00-architecture.md#5-data-model)).

**Extensions ship as SQL, not a dashboard toggle.** `create extension if not exists postgis;` runs inside
the versioned migration — Supabase's hosted Postgres role has privilege to enable it directly, and doing it
in a migration means `supabase db reset` (local) and `supabase db push` (chapter 8, hosted) produce the
identical, reproducible result. There is no manual dashboard step for this (see
[Manual configuration](#manual-configuration) below for the one thing that *is* manual).

**The reservation-uniqueness trigger, not an application check.** A partial unique index,
`UNIQUE (listing_id) WHERE status = 'active'`, blocks a second concurrent reservation at the database
level (closes the double-booking race). An `AFTER INSERT`/`AFTER UPDATE` trigger on `reservation` flips
the parent `listing.status` between `'active'` and `'reserved'` so the UI never has to reconcile two
tables by hand — see [00-architecture.md §5](../00-architecture.md#5-data-model).

**`listing_contact` is a separate table, not a column**, exactly so it can carry RLS that hides
`contact_note` from public `listing` reads while `listing` itself stays fully public (§5, §8). Its RLS
predicate references `reservation` (buyer with an `active` row) and `listing.seller_id`, so it depends on
both other tables existing first.

**`listings_near(lat, lng, radius_m)` is `SECURITY INVOKER`**, not `DEFINER` — it runs as the calling role
(`anon` or `authenticated`) and returns only what that role's `listing` SELECT policy already allows
(i.e., everything — browsing is public, §7), so no privilege escalation is introduced by wrapping the
`ST_DWithin` query in a function. It exists purely so the frontend (chapter 5) doesn't need `ST_DWithin`
expressed through the JS query builder.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `supabase/config.toml` | From `supabase init`; local ports, auth defaults (chapter 3 edits `[auth.external.google]`) |
| `supabase/migrations/<ts>_initial_schema.sql` | `postgis`; `listing`, `reservation`, `listing_contact`; checks; partial unique index; trigger; RLS policies |
| `supabase/migrations/<ts>_listings_near.sql` | `listings_near(lat float, lng float, radius_m int)` RPC |
| `supabase/seed.sql` | A handful of sample listings for local dev (no PII, fake coordinates) |
| `scripts/rls-smoke.ts` | Smoke script below |
| `package.json` | `tsx`, `@supabase/supabase-js` devDependency for the smoke script (already a runtime dep from chapter 1) |

## Manual configuration

None to enable the schema itself — extension, tables and RLS are all versioned SQL, applied locally via
`supabase db reset` in this chapter and pushed to the hosted project in chapter 8 (`supabase db push`).
The only dashboard step tied to this chapter is a **verification**, deferred to chapter 8's checklist:
after the first `supabase db push`, confirm Database → Extensions shows `postgis` as enabled on the hosted
project.

## Red tests (smoke script, `scripts/rls-smoke.ts`, against `supabase start`)

Two anon-key clients plus two signed-in test users (created with `supabase.auth.admin.createUser` using
the **local-only** service-role key printed by `supabase start` — never the hosted project's key, never
committed).

| Case | Asserts |
| --- | --- |
| Anon can `select` from `listing` | Public read (§6) |
| Anon `insert` into `listing` is rejected | No writes without a session (§6, §7) |
| Signed-in user A can insert a `listing` with `seller_id = A` | Owner insert |
| Signed-in user B cannot insert a `listing` with `seller_id = A` | Ownership predicate on INSERT |
| User B can insert a `reservation` on A's active listing | Buyer insert (§6) |
| The trigger flips that listing's `status` to `'reserved'` | Trigger behavior (§9) |
| A second `reservation` insert on the same listing by user C violates the partial unique index | Double-booking guard |
| Anon `select` on `listing_contact` returns zero rows | Public cannot read contact info (§8) |
| User B (active reservation) can `select` the listing's `listing_contact` row | Reveal on reservation (§8) |
| User C (no reservation) cannot `select` that `listing_contact` row | Negative pair of the previous case |
| `listings_near` returns a listing within `radius_m` and omits one outside it | Geo RPC correctness |

## Green

1. `supabase init`; confirm `supabase start` boots locally (Docker required).
2. Extension + tables + checks; first four smoke cases.
3. Partial unique index + trigger; next three cases.
4. `listing_contact` + its RLS; next three cases.
5. `listings_near` RPC; last case. Seed data; smoke script runs clean end to end.

## Refactor gate

One migration file per concern (schema, geo RPC) rather than one giant file; policy names follow
`<table>_<action>_<role-or-condition>` so `supabase db diff` output stays readable. Report the outcome.

**Outcome:** held as designed — `initial_schema.sql` and `listings_near.sql` shipped as separate
migrations. One follow-up migration (`listings_near_lat_lng.sql`, chapter 5) reshapes the RPC's return
type to plain `double precision` columns instead of a nested geography value, once the frontend needed to
consume lat/lng directly; still one concern per file.

## Verification

```bash
supabase start
supabase db reset
npx tsx scripts/rls-smoke.ts
supabase stop
```

Chapter 2 additionally runs this against `main` in CI once merged (Supabase CLI + Docker service in
GitHub Actions), per [../01-rollout.md](../01-rollout.md)'s per-chapter gate.

## Out of scope

Applying migrations to the hosted project (chapter 8), auth provider config (chapter 3), the
`create_listing`/`reserve_listing`/`cancel_reservation` RPCs (chapters 4 and 6), the expiry function and
`pg_cron` schedule (chapter 7).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-schema-and-rls
```

```text
test(schema): describe listing/reservation/listing_contact RLS and listings_near

feat(schema): add initial schema, reservation trigger, RLS policies and geo RPC
```
