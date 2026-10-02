---
name: "Chapter 2 — Geo user or Germany"
overview: "useGeolocation retry + GERMANY_BOUNDS fitBounds fallback."
todos:
  - id: geo
    content: "constants, hook, Recenter, tests"
    status: pending
isProject: false
---

# Chapter 2 — Geo user or Germany

**Branch:** `feat/eggs-minimal-geo` · **Depends on:** none

---

## Goal

Browser location when granted; otherwise map fits Germany. Hook exposes `requestLocation` and `geoGranted`.

## Files

| Path | Layer |
| --- | --- |
| `src/lib/geo/constants.ts` | lib |
| `src/lib/geo/constants.test.ts` | test |
| `src/features/browse/hooks/useGeolocation.ts` | hook |
| `src/features/browse/hooks/useGeolocation.test.ts` | test |
| `src/features/browse/components/MapView/Recenter.tsx` | component |
| `src/features/browse/components/MapView/MapView.tsx` | component (pass `showUserMarker`, `fitGermany`) |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** granted geo sets center to browser coords, `geoGranted` true | |
| **Negative:** denied geo uses `germanyCenter()`, `geoGranted` false | |
| **Happy:** `requestLocation` re-invokes getCurrentPosition | |

## Refactor gate

Extract `_readGeolocation` helper if effect grows — report outcome.
