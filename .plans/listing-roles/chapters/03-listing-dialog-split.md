---
name: "Chapter 3 — Listing dialog split"
overview: "ListingDetail dispatches to BuyerListingDialog or SellerListingDialog by ownership; shared ListingSummary; buyer controls never shown to the owner."
todos:
  - id: summary
    content: "Extract ListingSummary from ListingDetailView"
    status: done
  - id: buyer
    content: "BuyerListingDialog: ListingSummary + ReserveButton + ContactReveal"
    status: done
  - id: seller
    content: "SellerListingDialog: ListingSummary + ContactReveal (own note), no reserve"
    status: done
  - id: dispatcher
    content: "ListingDetail picks container by session.user.id === seller_id; delete ListingDetailView"
    status: done
isProject: false
---

# Chapter 3 — Listing dialog split

**Repo:** `eggs` · **Branch:** `feat/listing-roles-dialog-split` · **Status:** shipped

**Depends on:** [2](02-remove-listing-handling.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Two separate containers. The owner can no longer see or use the buyer's reserve controls; buyers never render seller UI. Ownership is checked once.

## Design decisions

- [`containers/ListingDetail.tsx`](../../../src/features/listings/containers/ListingDetail.tsx) stays the entry for `kind: "detail"` ([`AppShellDialogHost`](../../../src/features/shell/components/AppShell/AppShellDialogHost.tsx) unchanged). It calls `useListing` and `useSession`, then renders `SellerListingDialog` when `session?.user.id === listing.seller_id`, else `BuyerListingDialog` ([D1](../gaps-and-decisions.md)).
- New [`components/ListingSummary/`](../../../src/features/listings/components/ListingDetail/): amount, price per egg, status rows (`KeyValueRow`, `StatusBadge`), taken from `ListingDetailView`.
- `BuyerListingDialog` = `ListingSummary` + `ReserveButton` + `ContactReveal` (keep the `key={listing.status}` remount and its comment).
- `SellerListingDialog` = `ListingSummary` + `ContactReveal` for the owner's own note (chapter 4 adds the reservation list). No `ReserveButton`.
- `ReserveButton` keeps its signed-out branch; it gains no ownership logic.
- A listing hidden by chapter 1 (sold out or expired) yields `useListing` → not found → `listing.notFound` ([D9](../gaps-and-decisions.md)). Verify `fetchListing` behaves that way; fix in this chapter if it still returns hidden rows.
- Delete `ListingDetailView` (+ test); move its test cases to the new components.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/containers/ListingDetail.tsx` | listings | Dispatcher |
| `src/features/listings/containers/{BuyerListingDialog,SellerListingDialog}.tsx` | listings | New |
| `src/features/listings/components/ListingSummary/*` | listings | New (from `ListingDetailView`) |
| `src/features/listings/components/ListingDetail/*` | listings | **Delete** |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** non-owner signed in → `BuyerListingDialog` with carton picker and Reservieren | |
| **Happy:** owner → `SellerListingDialog` with summary and own contact note | |
| **Negative:** owner never sees `ReserveButton` / carton picker | |
| **Negative:** buyer view renders no seller-only content | |
| **Negative:** signed-out viewer gets the buyer dialog (sign-in prompt), not the seller one | |

## Green

Implement; `./ci.sh`.

## Refactor gate

Only `ListingDetail` references `seller_id` for role choice (`grep -rn "seller_id" src/features/listings` shows no other ownership checks) — report outcome.

## Git workflow

```bash
git checkout feat/plans-listing-roles && git pull
git checkout -b feat/listing-roles-dialog-split
```

```text
refactor(listings): split listing dialog into buyer and seller containers
```
