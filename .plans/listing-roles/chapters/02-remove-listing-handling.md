---
name: "Chapter 2 — Remove listing handling"
overview: "Delete SellerActions (mark sold, withdraw, expiry editor), their API wrappers, strings and tests."
todos:
  - id: delete-ui
    content: "Delete SellerActions, MarkStatusActions, ExpiryEditor and tests"
    status: done
  - id: delete-api
    content: "Remove markListingSold, markListingCancelled, updateListingExpiry from listingsApi"
    status: done
  - id: strings-badge
    content: "Remove seller.* strings and sold/cancelled StatusBadge cases"
    status: done
isProject: false
---

# Chapter 2 — Remove listing handling

**Repo:** `eggs` · **Branch:** `feat/listing-roles-remove-handling` · **Status:** shipped

**Depends on:** [1](01-visibility-and-lifecycle-backend.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §1, §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

No "Als verkauft markieren", "Angebot zurückziehen" or "Ablaufdatum / Speichern" anywhere. The listing's lifecycle is automatic.

## Design decisions

- Delete [`SellerActions/`](../../../src/features/listings/components/SellerActions/) (`SellerActions`, `MarkStatusActions`, `ExpiryEditor`, index) and `SellerActions.test.tsx`.
- Remove `markListingSold`, `markListingCancelled`, `updateListingExpiry` from [`listingsApi.ts`](../../../src/features/listings/services/listingsApi.ts) (+ their tests/mocks).
- Remove `seller.*` keys from [`strings.de.ts`](../../../src/i18n/strings.de.ts) after grep shows no consumers.
- [`ListingDetailView`](../../../src/features/listings/components/ListingDetail/ListingDetailView.tsx) stops rendering `SellerActions` (the view itself is replaced in chapter 3).
- [`StatusBadge`](../../../src/features/listings/components/StatusBadge.tsx): drop `sold`/`cancelled` presentation only if the `Listing` status type no longer needs them; otherwise keep and note it.
- Check `useSupabaseQuery` and `types/listing.ts` for stale sold/cancelled references.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/components/SellerActions/*`, `SellerActions.test.tsx` | listings | **Delete** |
| `src/features/listings/services/listingsApi.ts` | listings | Remove 3 functions |
| `src/features/listings/components/ListingDetail/ListingDetailView.tsx` | listings | Drop `SellerActions` |
| `src/i18n/strings.de.ts` | i18n | Remove `seller.*` |
| `src/features/listings/components/StatusBadge.tsx` (+ test) | listings | Trim |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `ListingDetailView` as the owner renders summary and reserve UI without errors | |
| **Negative:** no button/text "Als verkauft markieren", "Angebot zurückziehen" or "Ablaufdatum" is rendered for the owner | |
| **Negative:** `listingsApi` exports no `markListing*` / `updateListingExpiry` | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`grep -rn "SellerActions\|markListing\|updateListingExpiry\|seller\." src scripts` finds nothing stale; lint reports no unused exports — report outcome.

## Git workflow

```bash
git checkout feat/plans-listing-roles && git pull
git checkout -b feat/listing-roles-remove-handling
```

```text
refactor(listings): remove manual sold, withdraw and expiry handling
```
