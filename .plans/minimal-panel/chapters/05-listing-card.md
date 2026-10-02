---
name: "Chapter 5 — Listing card and empty"
overview: "BrowseEmptyState TbBasketOff; compact ListingCard with egg icons."
todos:
  - id: cards
    content: "halfDozenIconCount, ListingCard, BrowseEmptyState"
    status: pending
isProject: false
---

# Chapter 5 — Empty state + compact listing card

**Branch:** `feat/eggs-minimal-listing-card` · **Depends on:** none (parallel after ch.4 ok)

---

## Goal

Empty browse uses EmptyState + `TbBasketOff`. Cards show half-dozen egg icons and two-column Menge/Preis.

## Files

| Path | Layer |
| --- | --- |
| `src/features/listings/utils/halfDozenIconCount.ts` | util |
| `src/features/listings/utils/halfDozenIconCount.test.ts` | test |
| `src/features/listings/components/ListingCard.tsx` | component |
| `src/features/browse/components/BuyerTab/BrowseEmptyState.tsx` | component |
| `src/features/browse/components/BuyerTab/ResultsGrid.tsx` | component |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** halfDozenIconCount returns 2 for 1 dozen | |
| **Negative:** caps at 24 icons (12 dozen) | |
