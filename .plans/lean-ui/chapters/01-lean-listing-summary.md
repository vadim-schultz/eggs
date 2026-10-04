---
name: "Chapter 1 — Lean listing summary"
overview: "Remove Status, Available and price-per-egg from the buyer dialog and Status from the seller dialog; delete StatusBadge."
todos:
  - id: buyer
    content: "BuyerListingDialog drops ListingSummary (picker, reserve, contact only)"
    status: pending
  - id: seller
    content: "ListingSummary loses the Status row; seller keeps amount and price"
    status: pending
  - id: badge
    content: "Delete StatusBadge, its test and unused listing.status.* strings"
    status: pending
isProject: false
---

# Chapter 1 — Lean listing summary

**Repo:** `eggs` · **Branch:** `feat/lean-ui-summary` · **Status:** planned

**Depends on:** — · **Architecture:** [../00-architecture.md](../00-architecture.md) §1, §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Buyers (signed in or anonymous) see no available count, no price per egg and no status. Sellers see no status. A listing is either visible or not ([D1, D4](../gaps-and-decisions.md)).

## Design decisions

- [`BuyerListingDialog`](../../../src/features/listings/containers/BuyerListingDialog.tsx) stops rendering `ListingSummary`: it is `ReserveButton` + `ContactReveal` (keep the `key={listing.status}` remount and its comment for now; chapter 2 revisits it).
- [`ListingSummary`](../../../src/features/listings/components/ListingSummary/ListingSummary.tsx) keeps the amount and price rows and loses the `Status` row. Only [`SellerListingDialog`](../../../src/features/listings/containers/SellerListingDialog.tsx) uses it after this chapter.
- Delete [`StatusBadge`](../../../src/features/listings/components/StatusBadge.tsx) and its test; remove `listing.status.label` and `listing.status.*` from [`strings.de.ts`](../../../src/i18n/strings.de.ts) once nothing references them (`grep` first; `ListingStatus` stays in the type).
- Update existing tests that assert on status text or the buyer summary rows.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/containers/BuyerListingDialog.tsx` | listings | Drop summary |
| `src/features/listings/components/ListingSummary/*` | listings | Drop status row |
| `src/features/listings/components/StatusBadge.tsx` (+ test) | listings | **Delete** |
| `src/i18n/strings.de.ts` | i18n | Remove unused keys |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** buyer dialog | Shows the carton picker and Reservieren; no "Verfügbar" or "Preis pro Ei" rows |
| **Happy:** seller dialog | Still shows amount, price, reserved/remaining/expiry rows |
| **Negative:** seller dialog | No "Status" label or badge |
| **Negative:** signed-out viewer | Buyer dialog without any "Status" label |

## Green

Implement; `./ci.sh`.

## Refactor gate

`grep -rn "StatusBadge\|listing.status" src` returns nothing. Report outcome.

## Git workflow

```bash
git checkout feat/plans-lean-ui && git pull
git checkout -b feat/lean-ui-summary
```

```text
refactor(listings): drop status and technical rows from listing dialogs
```
