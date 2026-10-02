---
name: "Chapter 4 — Retire Braille"
overview: "Remove lib/braille and BrailleQuantityRow; wire EggQuantityRow into amount controls."
todos:
  - id: delete-braille
    content: "Remove braille module + BrailleQuantityRow"
    status: pending
  - id: rewire
    content: "EggAmountControl + ReserveAmountControl + detail"
    status: pending
isProject: false
---

# Chapter 4 — Retire Braille

**Repo:** `eggs` · **Branch:** `feat/eggs-egg-ux-no-braille` · **Status:** planned

**Depends on:** [03-egg-quantity-module.md](03-egg-quantity-module.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Delete **`src/lib/braille/`** and **`BrailleQuantityRow`**. Replace all Braille quantity previews with **`EggQuantityRow`**. Display count: literal eggs for `each`; for legacy **`dozen`**, use `egg_count * 12` capped at **100** ([gaps D3 open seam](../gaps-and-decisions.md)).

## Files

| Path | Layer | Change |
| --- | --- | --- |
| Delete `src/lib/braille/**` | — | |
| Delete `src/components/ui/BrailleQuantityRow.tsx` + test | — | |
| `src/features/listings/utils/displayEggCount.ts` | util | `displayEggCount(eggCount, unit)` → 1…100 |
| `src/features/listings/utils/displayEggCount.test.ts` | test | |
| `src/features/listings/components/PostListing/EggAmountControl.tsx` | component | `EggQuantityRow` (slider max still 12 until ch.7) |
| `src/features/listings/components/ReserveButton/ReserveAmountControl.tsx` | component | `EggQuantityRow` + slider |
| `src/features/listings/components/ListingDetail/ListingDetailView.tsx` | component | `EggQuantityRow` |
| `src/features/listings/components/ListingCard.test.tsx` | test | Update assertions (no Braille unicode) |
| `src/features/listings/containers/ListingDetail.test.tsx` | test | Update |
| `src/lib/braille/eggQuantity/render.test.ts` | — | Delete with module |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `ReserveAmountControl` renders `EggQuantityRow` / egg test id for count 3 | |
| **Negative:** repo has no import of `renderEggQuantityBraille` (grep test or static) | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`displayEggCount` + reserve/post controls — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-ux && git pull
git checkout -b feat/eggs-egg-ux-no-braille
```

```text
refactor(web): replace Braille quantity with egg decade row
```
