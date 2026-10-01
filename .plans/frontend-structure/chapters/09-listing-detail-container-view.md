---
name: "Chapter 9 — Listing detail container and view"
overview: "Move ListingDetail to features/listings/containers; extract useListing hook and ListingDetailView presentational component; move route test."
todos:
  - id: detail-split
    content: "container + ListingDetailView + useListing"
    status: pending
isProject: false
---

# Chapter 9 — Listing detail container and view

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-listing-detail-container-view` · **Status:** planned

**Depends on:** [4](04-listing-read-services.md), [6](06-reserve-button.md), [7](07-contact-reveal.md), [8](08-seller-actions-folder.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Split [ListingDetail.tsx](../../../src/routes/ListingDetail.tsx) into container (data + refetch) and view
(props only), with `useListing` in `hooks/`.

## Design decisions

**Container** `features/listings/containers/ListingDetail.tsx`:

- Calls `useListing(id)`; handles loading/null; passes props to view
- Keeps `key={listing.status}` on `ContactReveal` remount behavior

**View** `features/listings/components/ListingDetail/ListingDetailView.tsx`:

- Props: `listing`, `onChange` (refetch)
- Composes `StatusBadge`, `ReserveButton`, `ContactReveal`, `SellerActions`
- No supabase import

**Hook** `features/listings/hooks/useListing.ts` — reload token + `fetchListing`

**Barrel** `ListingDetail/index.ts` exporting view if needed.

## Files

**Add:** container, view folder, hook, move [ListingDetail.test.tsx](../../../src/routes/ListingDetail.test.tsx) → `containers/ListingDetail.test.tsx`.

**Edit:** `AppShell` / dialog imports `@/features/listings/containers/ListingDetail`.

**Delete:** `src/routes/ListingDetail.tsx` (+ old test path).

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `ListingDetail · renders count, unit, price and location_label for an active listing` | Loaded listing UI |
| **Negative:** `ListingDetail · shows the not-found message when the listing can't be loaded` | Not-found copy |

## Green

1. Extract hook and view; slim container.
2. Move tests; wire AppShell dialog.
3. Delete `src/routes/ListingDetail.*`.

## Refactor gate

View file has **no hooks besides composition** — audit container for single-level branching. Report outcome.

## Verification

```bash
npm run test -- --run src/features/listings/containers/ListingDetail.test.tsx
./ci.sh
```

## Out of scope

Post listing split — chapter 10.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-listing-detail-container-view
```

```text
test(web): listing detail container tests

refactor(web): split ListingDetail into container, view, and useListing
```
