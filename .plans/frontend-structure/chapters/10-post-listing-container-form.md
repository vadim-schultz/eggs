---
name: "Chapter 10 — Post listing container and form"
overview: "Move PostListing to listings/containers; extract PostListingForm, FieldError, and postListingMappers utils; move UnitSelect; wire location picker import (pre-ch11 path ok temporarily)."
todos:
  - id: post-split
    content: "container + form folder + mappers"
    status: pending
isProject: false
---

# Chapter 10 — Post listing container and form

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-post-listing-container-form` · **Status:** planned

**Depends on:** [3](03-listing-types-utils.md), [5](05-listing-write-services.md), [11](11-location-feature.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3, D8 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Separate post form presentation from submit orchestration; move mappers out of the route file; colocate
`UnitSelect` under listings.

## Design decisions

**Container** `containers/PostListing.tsx` — form state, validation, `createListing`, `onCreated` callback.

**View** `components/PostListing/PostListingForm.tsx` — fields + `UnitSelect` + `LocationPicker` as props-driven or imported presentational pieces.

**Extract** `FieldError.tsx` to its own file in the same folder.

**Utils** `utils/postListingMappers.ts` — `toListingInput`, `toCreateListingArgs` from current [PostListing.tsx](../../../src/routes/PostListing.tsx).

**Do not** replace raw `<label>` with Chakra Field in this chapter (D8).

**LocationPicker:** if chapter 11 not merged yet, import from legacy `src/components/LocationPicker`; if 11 merged, import `@/features/location/…`. Prefer implementing after 11 or updating import in same PR as 11.

## Files

**Add/move:**

| Path | Purpose |
| --- | --- |
| `src/features/listings/containers/PostListing.tsx` | container |
| `src/features/listings/components/PostListing/PostListingForm.tsx`, `FieldError.tsx`, `index.ts` | form |
| `src/features/listings/utils/postListingMappers.ts` | mappers |
| `src/features/listings/components/UnitSelect.tsx` | moved from `src/components/` |
| `src/features/listings/containers/PostListing.test.tsx` | moved from routes |

**Delete:** `src/routes/PostListing.tsx`, `src/components/UnitSelect.tsx` (+ tests at old paths).

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `PostListing · calls supabase.rpc("create_listing", ...) with the confirmed fields and opens the detail dialog for the new listing` | Success path (mocked RPC via service) |
| **Negative:** `PostListing · shows the field validation message from validateListingInput` | RPC not called when invalid |

## Green

1. Extract form + mappers; move container.
2. Move UnitSelect + PostListing tests.
3. Wire shell dialog import; delete routes file.

## Refactor gate

`FieldError` extracted; **no shared label/input factory** (out of scope). PostListingForm may still exceed
~100 LOC — report LOC and confirm no extra nested components left inline. Report outcome.

## Verification

```bash
npm run test -- --run src/features/listings/containers/PostListing.test.tsx
./ci.sh
```

## Out of scope

Chakra-only labels — ui-overhaul ch. 2.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-post-listing-container-form
```

```text
test(web): post listing container tests under features/listings

refactor(web): split PostListing into container, form, and mappers
```
