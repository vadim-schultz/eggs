---
name: "Chapter 1 — Default map center"
overview: "Single DEFAULT_MAP_CENTER constant shared by BuyerTab and BackgroundMap fallback state."
todos:
  - id: constant
    content: "lib/geo/constants.ts + wire imports"
    status: pending
isProject: false
---

# Chapter 1 — Default map center

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-dry-default-map-center` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §4 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

One source of truth for the Berlin fallback `{ lat: 52.52, lng: 13.405 }` used when geolocation is unavailable
and for the background map’s initial provider state.

## Design decisions

Export `DEFAULT_MAP_CENTER` and type it as `GeoPoint` (import type from `useGeolocation` or define in
`constants.ts` and re-export from hook module in a later cleanup).

Do not change test fixture literals unless a test asserts the constant re-export.

## Files

**Add:** `src/lib/geo/constants.ts`

**Edit:**

| Path | Change |
| --- | --- |
| `src/components/BuyerTab.tsx` | `FALLBACK_CENTER` → import constant |
| `src/components/BackgroundMap.tsx` | `FALLBACK_STATE.center` → constant |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `constants · DEFAULT_MAP_CENTER matches Berlin coordinates` | New unit test: lat/lng values |
| **Negative:** `BuyerTab ·` existing tests still pass with mocked geo — map publish still uses same center when manual pin unset | No regression in `BuyerTab.test.tsx` |

## Green

1. Add constant + test.
2. Wire BuyerTab and BackgroundMap.
3. `./ci.sh`.

## Refactor gate

Single constant file — **no refactor needed**. Report outcome.

## Verification

```bash
npm run test -- --run src/lib/geo
npm run test -- --run src/components/BuyerTab.test.tsx
./ci.sh
```

## Out of scope

Moving constant into `features/browse/` — optional after frontend-structure ch. 12.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-dry-default-map-center
```

```text
test(web): DEFAULT_MAP_CENTER constant

refactor(web): share map fallback center between BuyerTab and BackgroundMap
```
