---
name: "Chapter 10 — Map listing popover"
overview: "Marker click shows popover card; no AppDialog from map; deep link keeps dialog."
todos:
  - id: popover
    content: "Map marker popover + BuyerTab select + tests"
    status: pending
isProject: false
---

# Chapter 10 — Map listing popover

**Branch:** `feat/eggs-panel-map-popover` · **Depends on:** ch.7, ch.9 recommended

---

## Goal

Clicking a **map listing marker** opens a **popover** (or Leaflet popup hosting React) with **ListingCard** / compact detail — **viewport-safe** (`autoPan`, flip). **Do not** call `openDetailDialog` from map click. **`AppDialog`** remains for post flow and URL **`/listings/:id`** deep links.

## Files

| Path | Layer |
| --- | --- |
| `src/features/browse/components/MapView/ListingMarkerPopover.tsx` (or equivalent) | component |
| `src/features/browse/components/MapView/MapView.tsx` | component |
| `src/features/browse/containers/BuyerTab.tsx` | container |
| `src/features/browse/components/MapView/MapView.test.tsx` | test |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** marker click shows listing content in popover layer | |
| **Negative:** marker click does not set AppDialog open for detail kind | |

## Green

Implement; `./ci.sh`.

## Refactor gate

Map selection path — report outcome.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-panel-map-popover
```

```text
feat(web): listing detail popover on map markers
```
