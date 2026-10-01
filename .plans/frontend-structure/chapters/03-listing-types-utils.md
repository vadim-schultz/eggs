---
name: "Chapter 3 — Listing types and pure utils"
overview: "Split src/lib/listing.ts and validateListingInput into features/listings/types and utils; update imports; delete old lib files."
todos:
  - id: split-listing
    content: "types + formatListing utils + validateListingInput"
    status: pending
isProject: false
---

# Chapter 3 — Listing types and pure utils

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-listing-types-utils` · **Status:** planned

**Depends on:** [1](01-import-alias.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Domain types and pure helpers live under `features/listings/` instead of `lib/listing.ts`, separating
TypeScript shapes from Supabase and UI.

## Design decisions

**Split [listing.ts](../../../src/lib/listing.ts):**

- `features/listings/types/listing.ts` — `ListingUnit`, `ListingStatus`, `Listing`, `ListingNear`
- `features/listings/utils/formatListing.ts` — `formatPrice`, `unitLabelKey`, `statusLabelKey`

**Move validator:**

- `features/listings/types/listingInput.ts` — `ListingInput`, `ListingErrorKey`, `ListingInputErrors`
- `features/listings/utils/validateListingInput.ts` — `validateListingInput` function

**Move** [validateListingInput.test.ts](../../../src/lib/validateListingInput.test.ts) beside the util.

## Files

**Add:** paths above + optional `features/listings/types/index.ts` barrel.

**Edit:** all imports from `../lib/listing` and `../lib/validateListingInput` → `@/features/listings/…`.

**Delete:** `src/lib/listing.ts`, `src/lib/validateListingInput.ts`, `src/lib/validateListingInput.test.ts`.

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `formatPrice(250, "EUR")` formats de-DE currency (add unit test in `formatListing.test.ts` if none exists) | Correct formatted string |
| **Negative:** `validateListingInput · rejects egg_count <= 0` | Non-positive egg count still yields `post.errors.eggCount` |

## Green

1. Create types/utils files; copy logic unchanged.
2. Update imports across `src/`; move validator test.
3. Delete old `lib` listing files; run tests touching listings types.

## Refactor gate

Pure modules only — **no component splits**. Report outcome.

## Verification

```bash
npm run test -- --run src/features/listings
npm run test -- --run src/lib/validateListingInput.test.ts  # until deleted
./ci.sh
```

## Out of scope

Services layer — chapters 4–5.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-listing-types-utils
```

```text
test(web): listing format and validate tests under features/listings

refactor(web): split listing types and pure utils into features/listings
```
