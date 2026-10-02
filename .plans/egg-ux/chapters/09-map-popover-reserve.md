---
name: "Chapter 9 — Map popover reserve"
overview: "ListingPopoverContent with ReserveButton; non-button card layout."
todos:
  - id: popover
    content: "ListingMarkerPopover + ReserveButton"
    status: pending
isProject: false
---

# Chapter 9 — Map popover reserve

**Repo:** `eggs` · **Branch:** `feat/eggs-egg-ux-popover-reserve` · **Status:** planned

**Depends on:** [08-listing-card-quantity.md](08-listing-card-quantity.md), [04-retire-braille.md](04-retire-braille.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §7, §10 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Restore **reserve** UX on the **map listing popover**: amount **slider** (max = `listing.egg_count`) and **reserve button**, matching [`ReserveButton`](../../../src/features/listings/components/ReserveButton/ReserveButton.tsx) behaviour on detail ([gaps D10, D11](../gaps-and-decisions.md)). Root cause: [`ListingMarkerPopover`](../../../src/features/browse/components/MapView/ListingMarkerPopover.tsx) only renders [`ListingCard`](../../../src/features/listings/components/ListingCard.tsx), which is a **single `<button>`** — reserve controls cannot live inside it.

## Design

- Add **`ListingPopoverContent`** (or split **`ListingCard`** into **`ListingCardSummary`** presentational + optional actions).
- Popover body: **summary** (egg heading + amount + price) + **`ReserveButton`** with `onChange` to refresh map/listings if needed.
- Map marker click still uses Leaflet **`Popup`** with `autoPan`; do not open `AppDialog` for map clicks (panel-ux ch.10 rule).
- **`ListingCard`** `onSelect` for map: if card stays clickable for focus, use **non-button** layout in popover context only, or separate **select** affordance from reserve stack.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/browse/components/MapView/ListingPopoverContent.tsx` | component | Card summary + `ReserveButton` |
| `src/features/browse/components/MapView/ListingMarkerPopover.tsx` | component | Render `ListingPopoverContent` |
| `src/features/listings/components/ListingCard.tsx` | component | Optional refactor: extract summary for reuse |
| `src/features/browse/components/MapView/MapView.test.tsx` | test | Popover includes reserve control |
| `src/features/browse/components/MapView/ListingMarkerPopover.test.tsx` | test | Optional unit test |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** after opening listing popover (marker click or test harness), **reserve** label / slider is present for active listing | |
| **Negative:** popover content is not wrapped in a single outer `<button>` that contains the reserve slider (query reserve input inside button → 0 or use `role` structure) | |

## Green

Implement; `./ci.sh`.

## Refactor gate

Popover vs card split — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-ux && git pull
git checkout -b feat/eggs-egg-ux-popover-reserve
```

```text
feat(web): reserve flow on map listing popover
```
