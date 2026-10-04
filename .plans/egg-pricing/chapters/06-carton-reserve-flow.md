---
name: "Chapter 6 — Carton reserve flow"
overview: "Reserve uses CartonPicker (6 or 10) instead of the slider; detail shows per-egg price and availability; low-stock handling."
todos:
  - id: reserve-button
    content: "ReserveButton selects a carton and reserves that many eggs"
    status: pending
  - id: remove-slider
    content: "Delete ReserveAmountControl and isReserveCountValid"
    status: pending
  - id: summary
    content: "Detail summary: availability + per-egg price, no decade row"
    status: pending
  - id: manual-pass
    content: "End-to-end manual pass"
    status: pending
isProject: false
---

# Chapter 6 — Carton reserve flow

**Repo:** `eggs` · **Branch:** `feat/eggs-pricing-reserve` · **Status:** planned

**Depends on:** [4](04-carton-picker.md), [5](05-detail-dialog-consolidation.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §5 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

A buyer opens a listing in the dialog, sees both cartons with their prices, picks one and reserves it.

## Design decisions

**Reserve button:** [`ReserveButton`](../../../src/features/listings/components/ReserveButton/ReserveButton.tsx) replaces `ReserveAmountControl` with `CartonPicker` (`remaining = listing.egg_count`, `pricePerEggCents = listing.price_per_egg_cents`). State is `CartonSize | null`; initial value is the first size where `isCartonAvailable` holds (`null` if none). `reserve()` calls `reserveListing(listing.id, carton)`; `EggBurst` on success is kept. The reserve button is disabled when no carton is selected, and when `null` a muted `reserve.noCarton` text ("Nicht genug Eier für einen Karton") is shown ([gaps D8](../gaps-and-decisions.md)). The server RPC is unchanged ([gaps D9](../gaps-and-decisions.md)). If `egg_count` drops after a refetch so the selected carton is no longer available, reselect the first available one.

**Remove obsolete code:** delete `ReserveAmountControl.tsx` (+ test); replace `isReserveCountValid` in [`reserveCount.ts`](../../../src/features/listings/components/ReserveButton/reserveCount.ts) with a carton-based check built on `isCartonAvailable` (or delete the file if nothing remains).

**Summary:** [`ListingCardSummary`](../../../src/features/listings/components/ListingCardSummary.tsx) and [`ListingDetailView`](../../../src/features/listings/components/ListingDetail/ListingDetailView.tsx) drop the decade `EggQuantityRow` and the count `KeyValueRow` becomes "Verfügbar: N Eier" (`listing.available.label`); the price row reads "Preis pro Ei" with the per-egg price. If `ListingCardSummary` is left with a single consumer, inline it into `ListingDetailView` and delete it.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/components/ReserveButton/ReserveButton.tsx` | listings | Carton state + picker |
| `ReserveButton/ReserveAmountControl.tsx`, `reserveCount.ts` (+ tests) | listings | Delete / replace |
| `src/features/listings/components/ListingCardSummary.tsx` | listings | Availability + per-egg price (or inline) |
| `src/features/listings/components/ListingDetail/ListingDetailView.tsx` | listings | Same |
| `src/i18n/strings.de.ts` | i18n | `reserve.noCarton`, `listing.available.label` |
| `ReserveButton.test.tsx`, `ListingDetail.test.tsx` | test | Updated |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** with 12 eggs, picking the 10-carton and pressing Reserve calls `reserveListing(id, 10)` | |
| **Happy:** default selection is the 6-carton; Reserve calls `reserveListing(id, 6)` | |
| **Happy:** detail shows "Preis pro Ei" and both carton prices | |
| **Negative:** with 8 eggs the 10-carton is disabled and cannot be reserved; 6 can | |
| **Negative:** with 4 eggs neither carton is selectable, Reserve is disabled and `reserve.noCarton` is shown | |
| **Negative:** no slider (`role="slider"`) renders in the reserve area | |
| **Negative:** `reserveListing` is never called with a quantity outside `{6, 10}` | |

## Green

Implement; `./ci.sh`. Manual pass: post a listing at 0,35 € with 12 eggs → open from map → cartons priced 2,10 € / 3,50 € → reserve 10 → listing shows 2 left, cartons disabled.

## Refactor gate

`ReserveButton.tsx` ≤~100 LOC (extract a `useCartonSelection` hook if needed); no leftover references to `ReserveAmountControl` or `isReserveCountValid` — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-pricing && git pull
git checkout -b feat/eggs-pricing-reserve
```

```text
feat(listings): reserve by 6 or 10 egg carton
```
