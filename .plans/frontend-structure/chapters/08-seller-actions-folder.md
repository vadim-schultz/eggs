---
name: "Chapter 8 — Seller actions folder"
overview: "Split SellerActions into SellerActions/MarkStatusActions.tsx, ExpiryEditor.tsx, SellerActions.tsx, and index.ts barrel under features/listings/components."
todos:
  - id: seller-folder
    content: "nested SellerActions directory"
    status: pending
isProject: false
---

# Chapter 8 — Seller actions folder

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-seller-actions-folder` · **Status:** planned

**Depends on:** [2](02-auth-feature.md), [5](05-listing-write-services.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Apply the nested-component rule to [SellerActions.tsx](../../../src/components/SellerActions.tsx): three
React components today in one file become a directory with barrels.

## Design decisions

**Files:**

- `SellerActions/SellerActions.tsx` — owner gate + composes children
- `SellerActions/MarkStatusActions.tsx` — sold/cancelled buttons
- `SellerActions/ExpiryEditor.tsx` — date input + save
- `SellerActions/index.ts` — `export { default } from './SellerActions'`

Logic unchanged; still uses `listingsApi` and `useSession` from chapter 5/2.

## Files

**Add:** `src/features/listings/components/SellerActions/*` (move + split).

**Move test:** `SellerActions.test.tsx` beside folder or keep co-located name `SellerActions.test.tsx` in parent `components/`.

**Delete:** `src/components/SellerActions.tsx`.

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `SellerActions · mark sold calls mark_listing_sold and updates the shown status` | RPC still invoked |
| **Negative:** `SellerActions · is not rendered for a non-owner` | Null render for non-owner |

## Green

1. Extract `MarkStatusActions` and `ExpiryEditor` to files.
2. Move under `features/listings/components/SellerActions/`.
3. Update ListingDetail import; run seller tests.

## Refactor gate

Parent file dispatches only — **no business logic duplicated** in index. Report: three files, one concern each.

## Verification

```bash
npm run test -- --run src/features/listings/components/SellerActions.test.tsx
./ci.sh
```

## Out of scope

ListingDetail view extraction — chapter 9.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-seller-actions-folder
```

```text
test(web): seller actions tests at nested folder path

refactor(web): split SellerActions into nested component folder
```
