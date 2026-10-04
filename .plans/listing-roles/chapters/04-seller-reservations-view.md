---
name: "Chapter 4 — Seller reservations view"
overview: "Seller container shows reserved/remaining counts, expiry time and the list of reservations."
todos:
  - id: hook
    content: "useListingReservations(listingId) via useSupabaseQuery"
    status: pending
  - id: list
    content: "SellerReservations component: egg count, time, status"
    status: pending
  - id: wire
    content: "SellerListingDialog shows counts, expiry and list; strings"
    status: pending
  - id: manual-pass
    content: "End-to-end manual pass"
    status: pending
isProject: false
---

# Chapter 4 — Seller reservations view

**Repo:** `eggs` · **Branch:** `feat/listing-roles-seller-reservations` · **Status:** planned

**Depends on:** [3](03-listing-dialog-split.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §5 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

The owner sees what has been reserved and what is left, and when the listing expires, with no actions.

## Design decisions

- `useListingReservations(listingId)` in `src/features/listings/hooks/`, built on [`useSupabaseQuery`](../../../src/lib/async/useSupabaseQuery.ts) like [`useActiveReservation`](../../../src/features/listings/hooks/useActiveReservation.ts); service function in [`listingsApi.ts`](../../../src/features/listings/services/listingsApi.ts) selecting `id, egg_count, status, created_at` for the listing, newest first.
- RLS: `reservation_select_participant` already lets the seller read reservations of their listings (initial schema). Add a migration **only** if rls-smoke shows otherwise; add the smoke case regardless.
- `SellerReservations` component: one row per reservation (egg count, time, active/cancelled), empty state string. No buyer identity ([D3](../gaps-and-decisions.md)).
- Summary additions in `SellerListingDialog`: reserved eggs (sum of active reservations), remaining (`listing.egg_count`), expires at (`expires_at`, de-DE format via existing formatters in [`formatListing`](../../../src/features/listings/utils/formatListing.ts)).
- Strings in [`strings.de.ts`](../../../src/i18n/strings.de.ts) under `sellerView.*`.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/hooks/useListingReservations.ts` | listings | New |
| `src/features/listings/services/listingsApi.ts` | listings | `fetchListingReservations` |
| `src/features/listings/components/SellerReservations/*` | listings | New |
| `src/features/listings/containers/SellerListingDialog.tsx` | listings | Wire |
| `scripts/rls-smoke.ts` | scripts | Seller reads own listing's reservations; other seller cannot |
| `src/i18n/strings.de.ts` | i18n | `sellerView.*` |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** two reservations render two rows with egg counts and statuses | |
| **Happy:** reserved and remaining counts match the data | |
| **Happy:** empty state when there are none | |
| **Negative:** a cancelled reservation is not counted as reserved | |
| **Negative:** no action buttons are rendered in the seller dialog | |
| **Negative (smoke):** a different seller cannot read the reservations | |

## Green

Implement; `./ci.sh`. Manual pass: post a listing, reserve a carton from a second account, see it as the seller; reserve the rest, listing vanishes from the map; cancel, it returns.

## Refactor gate

Row and summary components stay ≤~100 LOC; reuse formatters instead of new ones — report outcome.

## Git workflow

```bash
git checkout feat/plans-listing-roles && git pull
git checkout -b feat/listing-roles-seller-reservations
```

```text
feat(listings): show reservations in seller listing dialog
```
