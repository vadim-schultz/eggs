---
name: "Chapter 3 — Read hooks migration"
overview: "Refactor useListingsNear, useListing, useListingContact, and useActiveReservation to use useSupabaseQuery."
todos:
  - id: migrate-reads
    content: "four hooks on useSupabaseQuery"
    status: pending
isProject: false
---

# Chapter 3 — Read hooks migration

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-dry-read-hooks` · **Status:** planned

**Depends on:** [2](02-use-supabase-query.md), [1](01-default-map-center.md) optional · **Architecture:** [../00-architecture.md](../00-architecture.md) · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Delete duplicated cancel/loading `useEffect` blocks; keep public hook APIs unchanged for callers.

## Design decisions

| Hook | Path | Fetcher wraps |
| --- | --- | --- |
| `useListingsNear` | `src/features/browse/hooks/useListingsNear.ts` | `fetchListingsNear` from `browseApi` |
| `useListing` | `src/features/listings/hooks/useListing.ts` | `fetchListing` from `listingsApi` |
| `useListingContact` | `src/features/listings/hooks/useListingContact.ts` | `fetchListingContact` from `listingsApi` |
| `useActiveReservation` | `src/features/listings/hooks/useActiveReservation.ts` | `fetchActiveReservation` from `listingsApi` |

**`useActiveReservation`:** keep the `enabled` short-circuit in the hook wrapper — when `enabled` is false, skip
fetch and clear state. Do not push that branch into `useSupabaseQuery`.

**Do not migrate** `useSearchCandidates` (debounced HTTP, not Supabase) in this chapter.

## Files

**Edit:** the four hook files above; **remove** duplicated `useEffect` + `cancelled` blocks.

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `useListingsNear · exposes loading then the resolved listings` | Unchanged behavior |
| **Negative:** add or keep test: RPC error sets `error: true` on `useListingsNear` | Failure path |

Plus existing `ListingDetail`, `ContactReveal`, `ReserveButton` tests as regression.

## Green

1. Wrap each fetcher with `useSupabaseQuery`.
2. Run hook + integration tests listed in Verification.

## Refactor gate

Each hook file is thin wrapper around fetcher + `useSupabaseQuery` — report LOC per file.

## Verification

```bash
npm run test -- --run src/features/browse/hooks/useListingsNear.test.ts src/features/listings/containers/ListingDetail.test.tsx src/features/listings/components/ContactReveal.test.tsx src/features/listings/components/ReserveButton src/features/listings/hooks/useActiveReservation.test.ts
./ci.sh
```

## Out of scope

`useGeolocation`, `useSession`, debounced geocode search.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-dry-read-hooks
```

```text
test(web): listings near RPC error sets hook error flag

refactor(web): migrate Supabase read hooks to useSupabaseQuery
```
