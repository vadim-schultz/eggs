---
name: "Chapter 5 — Reservation queries"
overview: "API functions and hooks for a seller's and a buyer's active reservations (with listing place; contact note for buyers). No UI."
todos:
  - id: seller-api
    content: "fetchSellerReservations in listingsApi"
    status: pending
  - id: buyer-api
    content: "fetchBuyerReservations in listingsApi (with contact note)"
    status: pending
  - id: hooks
    content: "useSellerReservations and useBuyerReservations on useSupabaseQuery"
    status: pending
isProject: false
---

# Chapter 5 — Reservation queries

**Repo:** `eggs` · **Branch:** `feat/lean-ui-reservation-queries` · **Status:** shipped

**Depends on:** [4](04-you-are-here-dialog.md) (order only) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Data for the panel lists exists and is tested before any UI uses it ([D5](../gaps-and-decisions.md)).

## Design decisions

- In [`listingsApi`](../../../src/features/listings/services/listingsApi.ts) add row types `SellerReservationRow` (`id`, `egg_count`, `created_at`, `listing_id`, `location_label`) and `BuyerReservationRow` (same, plus `contact_note: string | null`).
- `fetchSellerReservations(sellerId)`: `from("reservation").select("id, egg_count, created_at, listing_id, listing!inner(location_label, seller_id, expires_at)")` filtered `status = 'active'`, `listing.seller_id = sellerId`, `listing.expires_at > now`; newest first. Flatten the embed to the row type in a small mapper (`utils/reservationRows.ts`), not inside the query function.
- `fetchBuyerReservations(buyerId)`: same shape filtered by `buyer_id`; additionally embeds `listing_contact(contact_note)` through `listing`. RLS returns the note because the buyer holds an active reservation.
- Hooks `useSellerReservations(sellerId)` / `useBuyerReservations(buyerId)` wrap `useSupabaseQuery` like [`useListingReservations`](../../../src/features/listings/hooks/useListingReservations.ts) and also return `refetch`. A stable empty array is returned while loading.
- Keep `fetchListingReservations`/`useListingReservations` until chapter 6 replaces their only caller.
- No schema changes. If PostgREST cannot embed `listing_contact` through `listing`, fetch notes with a second query in the API function and merge in the mapper; do not add a migration.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/services/listingsApi.ts` | listings | Two queries + types |
| `src/features/listings/utils/reservationRows.ts` | listings | Row mappers |
| `src/features/listings/hooks/{useSellerReservations,useBuyerReservations}.ts` | listings | New |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** seller query | Applies `active`, seller and not-expired filters and maps rows to `location_label`, `egg_count` |
| **Happy:** buyer query | Maps `contact_note` from the embedded contact |
| **Negative:** empty / error response | Returns `[]`, not `null` |
| **Negative:** missing contact | `contact_note` is `null`, row still returned |
| **Hook:** loading | Returns an empty list while pending, rows after resolve, `refetch` re-queries |

## Green

Implement; `./ci.sh`.

## Refactor gate

Query functions ≤~5 LOC each beyond the query chain (mapping in `reservationRows.ts`); `listingsApi.ts` split into `reservationsApi.ts` if it passes ~100 LOC — decide and report.

## Git workflow

```bash
git checkout feat/plans-lean-ui && git pull
git checkout -b feat/lean-ui-reservation-queries
```

```text
feat(listings): query a seller's and a buyer's active reservations
```
