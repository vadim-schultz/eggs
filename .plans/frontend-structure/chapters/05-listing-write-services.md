---
name: "Chapter 5 — Listing write services"
overview: "Add createListing, reservation fetch, mark sold/cancelled, and expiry update to listingsApi; PostListing, SellerActions, and ReserveButton call services instead of inline supabase.rpc/update."
todos:
  - id: write-api
    content: "write + mutation helpers in listingsApi"
    status: pending
isProject: false
---

# Chapter 5 — Listing write services

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-listing-write-services` · **Status:** planned

**Depends on:** [3](03-listing-types-utils.md), [4](04-listing-read-services.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

All listing mutations and reservation reads used by the UI go through `listingsApi`, mirroring rsb’s service
layer without changing RPC names or args.

## Design decisions

**Functions (extend `listingsApi.ts`):**

- `createListing(args)` — wraps `create_listing` RPC; returns `{ id: string } | { error: true }`
- `fetchActiveReservation(listingId)` — current `ReserveButton` query
- `markListingSold`, `markListingCancelled` — RPC wrappers
- `updateListingExpiry(listingId, isoDate)` — `.update({ expires_at })`

**Callers check error flag** — same as today’s `if (error) { setSubmitError(true); return; }` without
throwing into views.

## Files

**Edit:**

| Path | Change |
| --- | --- |
| `src/features/listings/services/listingsApi.ts` | add write helpers |
| `src/features/listings/services/listingsApi.test.ts` | happy + negative RPC cases |
| `src/routes/PostListing.tsx` | submit via `createListing` |
| `src/components/SellerActions.tsx` | RPC/update via service |
| `src/components/ReserveButton/ReserveButton.tsx` | reservation fetch + reserve/cancel RPCs via service |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `listingsApi · createListing forwards mapped RPC args` | Mock receives `create_listing` payload |
| **Negative:** `PostListing · shows submit error when create_listing fails` (extend or keep integration test) | `onCreated` not called; error UI shown |

## Green

1. Extend service + unit tests.
2. Rewire PostListing, SellerActions, ReserveButton.
3. Run `PostListing.test.tsx`, `SellerActions.test.tsx`, `ReserveButton.test.tsx`.

## Refactor gate

SellerActions still contains `MarkStatusActions` and `ExpiryEditor` inline — **chapter 8** splits them;
this chapter only swaps I/O to the service. Report: write paths centralized.

## Verification

```bash
npm run test -- --run src/routes/PostListing.test.tsx src/components/SellerActions.test.tsx src/components/ReserveButton
./ci.sh
```

## Out of scope

Splitting SellerActions folder — chapter 8.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-listing-write-services
```

```text
test(web): listingsApi write and reservation helpers

refactor(web): listing mutations through listingsApi
```
