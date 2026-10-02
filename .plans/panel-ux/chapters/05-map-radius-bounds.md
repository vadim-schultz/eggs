---
name: "Chapter 5 — Map radius bounds"
overview: "fitBounds 2×radius square when located; Germany otherwise."
todos:
  - id: map
    content: "lib/geo bounds + Recenter + context wiring"
    status: pending
isProject: false
---

# Chapter 5 — Map radius bounds

**Branch:** `feat/eggs-panel-map-bounds` · **Depends on:** ch.4

---

## Goal

Map viewport: **Germany** when no user/manual location; else **square bounds** with half-width = `radiusM` (10×10 km at default 5 km).

## Files

| Path | Layer |
| --- | --- |
| `src/lib/geo/boundsForRadius.ts` | lib |
| `src/lib/geo/boundsForRadius.test.ts` | test |
| `src/features/browse/components/MapView/Recenter.tsx` | component |
| `src/features/browse/components/MapView/MapView.tsx` | component |
| `src/features/shell/context/backgroundMap.tsx` | context |
| `src/features/browse/containers/BuyerTab.tsx` | container |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `boundsForRadius(center, 5000)` returns SW/NE ~10 km apart | |
| **Negative:** when `fitGermany`, Recenter does not use radius bounds | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`Recenter` + geo helper — report outcome.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-panel-map-bounds
```

```text
feat(web): map fit bounds to search radius or Germany
```
