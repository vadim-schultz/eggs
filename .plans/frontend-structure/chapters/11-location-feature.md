---
name: "Chapter 11 — Location feature"
overview: "Create features/location with geocodeApi, types, useSearchCandidates hook, and LocationPicker nested folder (CandidateList, ManualPinFallback); delete src/lib/geocode and src/components/LocationPicker."
todos:
  - id: location-feature
    content: "location services, hooks, LocationPicker folder"
    status: pending
isProject: false
---

# Chapter 11 — Location feature

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-location-feature` · **Status:** planned

**Depends on:** [1](01-import-alias.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §6 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Own geocoding and the location picker under `features/location/` so browse and listings import shared UI
without circular feature dependencies.

## Design decisions

**Services:** `services/geocodeApi.ts` — `searchPlace` from [geocode.ts](../../../src/lib/geocode.ts).

**Types:** `types/place.ts` — `PlaceCandidate`, `ConfirmedPin` (no longer exported from picker component).

**Hooks:** `hooks/useSearchCandidates.ts` — debounced search from current LocationPicker inline hook.

**Components:**

```
LocationPicker/
  LocationPicker.tsx
  CandidateList.tsx
  ManualPinFallback.tsx
  index.ts
```

## Files

**Add:** tree above + `geocodeApi.test.ts` moved from `src/lib/geocode.test.ts`.

**Edit:** BuyerTab, PostListing form — `@/features/location/…`.

**Delete:** `src/lib/geocode.ts`, `src/components/LocationPicker.tsx`, old tests.

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `geocodeApi · maps a Nominatim result to {label, lat, lng}` | Mapped candidates |
| **Negative:** `geocodeApi · returns an empty array on no results` | No fetch throw; empty array |

Plus moved integration tests:

| Test | Asserts |
| --- | --- |
| **Happy:** `LocationPicker · manual lat/lng inputs still call onConfirm with parsed numbers` | Manual pin path |
| **Negative:** `LocationPicker · has no native <label> elements` | Markup regression (ui-overhaul) |

## Green

1. Create feature; move geocode + split picker.
2. Update importers; move tests.
3. Delete legacy files.

## Refactor gate

LocationPicker parent **composes only** — CandidateList and ManualPinFallback in separate files. Report outcome.

## Verification

```bash
npm run test -- --run src/features/location
./ci.sh
```

## Out of scope

Map / buyer tab — chapter 13.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-location-feature
```

```text
test(web): location feature geocode and picker tests

refactor(web): add features/location with nested LocationPicker
```
