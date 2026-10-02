---
name: "Chapter 6 — Listing expiry 24h"
overview: "Default expires_at to 24 hours on new listings."
todos:
  - id: migration
    content: "supabase migration alter default"
    status: pending
  - id: fixtures
    content: "Update tests/docs referencing 3-day default"
    status: pending
isProject: false
---

# Chapter 6 — Listing expiry 24h

**Repo:** `eggs` (`supabase/`) · **Branch:** `feat/eggs-egg-ux-expiry-24h` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §9 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

New listings **automatically expire in 24 hours** by default ([gaps D12](../gaps-and-decisions.md)). Change DB default from `now() + interval '3 days'` ([`initial_schema.sql`](../../../supabase/migrations/20260928083955_initial_schema.sql)) to **`now() + interval '24 hours'`**. Keep **`listing_expires_at_bound`** (max 14 days ahead) and seller extend UI unless explicitly removed.

## Files

| Path | Purpose |
| --- | --- |
| `supabase/migrations/<timestamp>_listing_expiry_24h_default.sql` | `ALTER TABLE listing ALTER COLUMN expires_at SET DEFAULT (now() + interval '24 hours');` |
| `src/features/listings/services/listingsApi.test.ts` | Fixtures if they assert default expiry |
| `src/features/listings/components/ListingCard.test.tsx` | `expires_at` fixtures |
| `docs/` or `.plans/mvp/` | Optional one-line note — only if deploy docs mention 3-day default |

**Do not** change `expire_listings()` schedule or seller RPCs unless tests require it.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** migration file exists and SQL contains `24 hours` default (static test or documented manual check in chapter — prefer vitest reading migration text if project pattern exists) | |
| **Negative:** no remaining comment in code claiming **3 days** as insert default for new listings | grep test |

If no migration smoke test exists, **Red** documents expected default; **Green** adds migration + updates fixtures.

## Green

Apply migration locally; `./ci.sh`.

## Refactor gate

N/A for SQL-only — report **no refactor needed** or note fixture helper extraction.

## Git workflow

```bash
git checkout feat/plans-egg-ux && git pull
git checkout -b feat/eggs-egg-ux-expiry-24h
```

```text
feat(db): default listing expiry to 24 hours
```
