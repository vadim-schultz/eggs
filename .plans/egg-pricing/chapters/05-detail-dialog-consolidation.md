---
name: "Chapter 5 — Detail dialog consolidation"
overview: "Marker click opens the shared AppDialog detail view; remove the Leaflet popup, nested card and dead listing-card code."
todos:
  - id: open-dialog
    content: "BuyerTab marker select opens detail dialog; selection clears on close"
    status: pending
  - id: remove-popup
    content: "Delete ListingMarkerPopover, ListingPopoverContent, popup effect in ListingMapMarker"
    status: pending
  - id: dead-code
    content: "Delete unused ListingCard, ResultsGrid, BrowseEmptyState after grep"
    status: pending
isProject: false
---

# Chapter 5 — Detail dialog consolidation

**Repo:** `eggs` · **Branch:** `feat/eggs-pricing-detail-dialog` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §6 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Listing detail looks and behaves like the other dialogs (e.g. "create listing"): one `AppDialog` surface, no popup containing a card.

## Design decisions

**Open the dialog:** [`BuyerTab`](../../../src/features/browse/containers/BuyerTab.tsx) `selectListing(id)` calls `setSelectedId(id)` and `useAppDialog().openDetailDialog(id)` ([`appDialog.tsx`](../../../src/features/shell/context/appDialog.tsx)). [`AppShellDialogHost`](../../../src/features/shell/components/AppShell/AppShellDialogHost.tsx) already renders `ListingDetail` for `kind: "detail"`. Clear `selectedId` when `open` returns to `null` (effect on the dialog context's `open`) so the marker returns to its unselected opacity ([gaps D10](../gaps-and-decisions.md)).

**Remove the popup path:** delete `ListingMarkerPopover.tsx` and `ListingPopoverContent.tsx` (and tests); in [`ListingMapMarker`](../../../src/features/browse/components/MapView/ListingMapMarker.tsx) drop the `markerRef`, the open/close-popup effect and the `Popup` child — the marker only keeps its `click` handler and `selected` opacity. Remove any leftover Leaflet popup CSS.

**Dead code:** `ListingCard`, `ResultsGrid`, `BrowseEmptyState` have no consumers at time of writing. `grep -rn "ListingCard\b\|ResultsGrid\|BrowseEmptyState" src` must show only their own files and tests before deleting; if something consumes one, keep it and note it in the PR.

**No nested card:** `ListingDetailView` already renders plain `Stack` content inside `AppDialog.Body` — keep it that way; do not introduce `Card` there.

`ListingCardSummary` stays (used by the detail view until chapter 6 reworks it).

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/browse/containers/BuyerTab.tsx` | browse | Open dialog on select; clear on close |
| `src/features/browse/components/MapView/ListingMapMarker.tsx` | browse | Remove popup |
| `MapView/ListingMarkerPopover.tsx`, `MapView/ListingPopoverContent.tsx` | browse | **Delete** (+ tests) |
| `src/features/listings/components/ListingCard.tsx`, `browse/components/BuyerTab/{ResultsGrid,BrowseEmptyState}.tsx` | listings / browse | **Delete** if unused (+ tests) |
| `MapView.test.tsx`, `BuyerTab.test.tsx` | test | Updated |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** clicking a marker calls `openDetailDialog(listing.id)` | |
| **Happy:** closing the dialog clears the selection (marker opacity back to unselected) | |
| **Negative:** no `.leaflet-popup` / `listing-marker-popover` test id is rendered after a marker click | |
| **Negative:** selecting a marker never renders a `Card` inside the map | |

## Green

Implement; `./ci.sh`; manually click a marker and confirm the dialog matches the "create listing" surface.

## Refactor gate

No unused exports or imports remain (lint); `ListingMapMarker.tsx` shrinks — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-pricing && git pull
git checkout -b feat/eggs-pricing-detail-dialog
```

```text
refactor(browse): open listing detail in AppDialog instead of map popup
```
