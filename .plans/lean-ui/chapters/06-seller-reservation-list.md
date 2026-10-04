---
name: "Chapter 6 — Seller reservation list"
overview: "Inline seller reservation rows shown in the Verkäufer tab under the buttons and in the seller listing dialog; active only."
todos:
  - id: components
    content: "SellerReservationRow and SellerReservationList components"
    status: pending
  - id: tab
    content: "FarmerTab renders the list under AuthButton and AddListingTrigger when signed in"
    status: pending
  - id: dialog
    content: "SellerListingDialog uses the shared list (filtered to its listing); remove SellerReservations and useListingReservations"
    status: pending
isProject: false
---

# Chapter 6 — Seller reservation list

**Repo:** `eggs` · **Branch:** `feat/lean-ui-seller-list` · **Status:** shipped

**Depends on:** [5](05-reservation-queries.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3, §4 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

A seller sees reservations on their eggs in the main panel and, as today, in the listing card ([D5, D6, D10](../gaps-and-decisions.md)).

## Design decisions

- New `components/SellerReservationList/` in `features/listings`: `SellerReservationList.tsx` (heading `sellerView.reservations.title` + rows; props `reservations: SellerReservationRow[]`, `showEmpty?: boolean`) and `SellerReservationRow.tsx` (one inline line: `{egg_count} Eier · {location_label} · {formatDateTime(created_at)}`). Props only; no hooks, no ownership checks. Barrel `index.ts`.
- [`FarmerTab`](../../../src/features/shell/components/FarmerTab/FarmerTab.tsx): when `session` is set, call `useSellerReservations(session.user.id)` and render `<SellerReservationList>` below `AddListingTrigger`; render nothing when the list is empty (`showEmpty` false, [D10](../gaps-and-decisions.md)). Signed out: unchanged.
- [`SellerListingDialog`](../../../src/features/listings/containers/SellerListingDialog.tsx): load `useSellerReservations(listing.seller_id)`, filter rows by `listing_id === listing.id`, pass them to `SellerReservationList` with `showEmpty`. The reserved total comes from the same filtered rows. Remove the old `SellerReservations` component, `useListingReservations`, `fetchListingReservations`, and the `sellerView.reservation.active/cancelled` strings if unused. Keep `sellerView.reserved/remaining/expires` rows.
- Cancelled reservations no longer appear anywhere ([D5](../gaps-and-decisions.md)).

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/components/SellerReservationList/*` | listings | New |
| `src/features/shell/components/FarmerTab/FarmerTab.tsx` | shell | Render list |
| `src/features/listings/containers/SellerListingDialog.tsx` | listings | Use shared list |
| `src/features/listings/components/SellerReservations/*`, `hooks/useListingReservations.ts` | listings | **Delete** |
| `src/i18n/strings.de.ts` | i18n | Prune unused keys |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `SellerReservationList` | One row per reservation showing eggs, place and time |
| **Happy:** `FarmerTab` signed in | Reservation rows appear below "Angebot einstellen" |
| **Happy:** `SellerListingDialog` | Shows only the rows of this listing and the reserved total |
| **Negative:** `FarmerTab` signed out | No list and no reservation query |
| **Negative:** `FarmerTab` with no reservations | No heading rendered |
| **Negative:** cancelled reservation | Not displayed in panel or dialog |

## Green

Implement; `./ci.sh`.

## Refactor gate

`grep -rn "SellerReservations\b\|useListingReservations\|fetchListingReservations" src` returns nothing; `grep -rn "seller_id" src/features` finds ownership checks only in `ListingDetail` (the dialog's `listing.seller_id` read for the query is data, not a role check — report it). Report outcome.

## Git workflow

```bash
git checkout feat/plans-lean-ui && git pull
git checkout -b feat/lean-ui-seller-list
```

```text
feat(listings): show active reservations in the seller panel and listing card
```
