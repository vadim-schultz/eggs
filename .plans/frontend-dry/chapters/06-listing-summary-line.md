---
name: "Chapter 6 — ListingSummaryLine"
overview: "Shared presentational line for egg count, unit, and formatted price used by ListingCard and ListingDetail."
todos:
  - id: summary
    content: "ListingSummaryLine component + tests"
    status: pending
isProject: false
---

# Chapter 6 — ListingSummaryLine

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-dry-listing-summary-line` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) D4 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

DRY the count · price line shared between card grid and detail dialog without changing visible copy.

## Design decisions

**Component:** `ListingSummaryLine` in `src/components/ListingSummaryLine.tsx` (or
`features/listings/components/` after structure).

**Props:**

```ts
interface ListingSummaryLineProps {
  eggCount: number;
  unit: ListingUnit;
  priceCents: number;
  currency: string;
  /** Default " · " between count and price; card uses default; detail may pass null and split layout */
  separator?: string | null;
}
```

Uses `t(unitLabelKey(unit))` and `formatPrice` internally — Chakra `Text` only, no `Box` wrapper unless `Text`
asChild needed.

**ListingDetail** may keep separate labeled rows for count vs price — use summary line only where the card’s
single-line format applies, or add prop `variant: "inline" | "labeled"` if detail keeps two `Text` rows (avoid
unless tests require).

Minimum scope: replace card body line; detail keeps headings but can use `formatPrice` block via shared helper
function `formatListingCountPrice` in utils if detail layout differs — prefer **card only** in this chapter if
detail layout must stay labeled.

## Files

**Add:** `ListingSummaryLine.tsx`, `ListingSummaryLine.test.tsx`

**Edit:** `ListingCard.tsx` — use component

**Optional edit:** `ListingDetail.tsx` — only if inline duplicate removed without changing labels

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** renders egg count, translated unit, and formatted EUR price | RTL text content |
| **Negative:** renders zero egg count with validation copy unchanged in parent forms — summary line not used for invalid post state | N/A for component; test `separator=""` does not crash |

## Green

1. Add component + test.
2. Wire ListingCard; run card + detail regression tests.

## Refactor gate

Single presentational component — report outcome.

## Verification

```bash
npm run test -- --run src/components/ListingSummaryLine.test.tsx src/components/BuyerTab.test.tsx src/routes/ListingDetail.test.tsx
./ci.sh
```

## Out of scope

StatusBadge, location label.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-dry-listing-summary-line
```

```text
test(web): ListingSummaryLine formats count and price

refactor(web): share listing count and price line in ListingCard
```
