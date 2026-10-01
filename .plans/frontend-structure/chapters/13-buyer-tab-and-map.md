---
name: "Chapter 13 — Buyer tab and map"
overview: "Move BuyerTab to browse/containers with RadiusSelect and ResultsGrid subfolders; move MapView/Recenter; move ListingCard and StatusBadge to listings/components if not already there."
todos:
  - id: buyer-map
    content: "BuyerTab folder + MapView folder + card moves"
    status: pending
isProject: false
---

# Chapter 13 — Buyer tab and map

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-buyer-tab-and-map` · **Status:** planned

**Depends on:** [3](03-listing-types-utils.md), [11](11-location-feature.md), [12](12-browse-data.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4, D10 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Apply nested-component rule to buyer UI and map; colocate browse container under `features/browse/`.

## Design decisions

**BuyerTab/** under `features/browse/containers/` or `components/BuyerTab/` with container file at
`containers/BuyerTab.tsx` importing `RadiusSelect` and `ResultsGrid` from `components/BuyerTab/`.

**MapView/** — `MapView.tsx` + `Recenter.tsx`; `pinIcon` stays a module-level helper in MapView file (not a React component file).

**ListingCard.tsx**, **StatusBadge.tsx** → `features/listings/components/` (if still under `src/components/`).

## Files

**Add/move:**

| Path | Purpose |
| --- | --- |
| `src/features/browse/containers/BuyerTab.tsx` | from `src/components/BuyerTab.tsx` |
| `src/features/browse/components/BuyerTab/RadiusSelect.tsx`, `ResultsGrid.tsx`, `index.ts` | split |
| `src/features/browse/components/MapView/MapView.tsx`, `Recenter.tsx`, `index.ts` | split |
| `src/features/listings/components/ListingCard.tsx`, `StatusBadge.tsx` | if needed |
| Tests: `BuyerTab.test.tsx`, `MapView.test.tsx`, `StatusBadge.test.tsx` | moved |

**Edit:** `RoleTabs`, `BackgroundMap` / shell map import paths.

**Delete:** old `src/components/BuyerTab.tsx`, `MapView.tsx`, card/badge if moved.

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `BuyerTab · clicking a grid card opens the detail dialog for that listing` | Dialog opens |
| **Negative:** `BuyerTab · shows the empty state when there are no listings in range` | No grid; empty copy |

## Green

1. Split and move BuyerTab + MapView.
2. Move ListingCard/StatusBadge; update imports.
3. Run buyer + map tests.

## Refactor gate

BuyerTab container orchestrates; **RadiusSelect and ResultsGrid not inline**. MapView **Recenter extracted**.
Report outcome.

## Verification

```bash
npm run test -- --run src/features/browse src/features/listings/components/StatusBadge.test.tsx
./ci.sh
npm run dev
# manual: buyer tab grid, map pins, card click → detail dialog
```

## Out of scope

Shell popover — chapter 14.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-buyer-tab-and-map
```

```text
test(web): buyer tab and map tests under features/browse

refactor(web): split BuyerTab and MapView into nested folders
```
