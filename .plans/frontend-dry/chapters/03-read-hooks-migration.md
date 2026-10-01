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

| Hook | Location today | Fetcher wraps |
| --- | --- | --- |
| `useListingsNear` | `src/hooks/useListingsNear.ts` | `listings_near` RPC (or `browseApi` after structure) |
| `useListing` | inline in `ListingDetail.tsx` | `.from("listing").select` — extract to hook file if still inline |
| `useListingContact` | inline in `ContactReveal.tsx` | `listing_contact` select |
| `useActiveReservation` | `ReserveButton.tsx` | reservation `maybeSingle` |

If [frontend-structure ch. 4–7](../frontend-structure/chapters/04-listing-read-services.md) already landed,
fetchers call `listingsApi` instead of raw supabase.

**Do not migrate** `useSearchCandidates` (debounced HTTP, not Supabase) in this chapter.

## Files

**Edit:** hook implementations above; **remove** inline `useEffect` duplicates.

**Optional extract:** move `useListing` to `src/hooks/useListing.ts` or `features/listings/hooks/` if still inline.

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
npm run test -- --run src/hooks/useListingsNear.test.ts src/routes/ListingDetail.test.tsx src/components/ContactReveal.test.tsx src/components/ReserveButton
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
