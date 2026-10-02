---
name: "Chapter 6 — Braille quantity row"
overview: "lib/braille/eggQuantity exact strings; BrailleQuantityRow; wire EggAmountControl."
todos:
  - id: braille
    content: "eggQuantity module + UI row + tests"
    status: pending
isProject: false
---

# Chapter 6 — Braille quantity row

**Branch:** `feat/eggs-panel-braille-qty` · **Depends on:** none (parallel after ch.2 ok)

---

## Goal

Replace Tabler egg icons / `halfDozenIconCount` with **`src/lib/braille/eggQuantity/`** and **`BrailleQuantityRow`**. Exact strings per D7.

## Files

| Path | Layer |
| --- | --- |
| `src/lib/braille/eggQuantity/constants.ts` | lib |
| `src/lib/braille/eggQuantity/partialCell.ts` | lib |
| `src/lib/braille/eggQuantity/totalEggs.ts` | lib |
| `src/lib/braille/eggQuantity/render.ts` | lib |
| `src/lib/braille/eggQuantity/index.ts` | lib |
| `src/lib/braille/eggQuantity/render.test.ts` | test |
| `src/components/ui/BrailleQuantityRow.tsx` | ui |
| `src/components/ui/BrailleQuantityRow.test.tsx` | test |
| Delete `src/features/listings/utils/halfDozenIconCount.ts` + test | util |
| `src/features/listings/components/PostListing/EggAmountControl.tsx` | component |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `renderEggQuantityBraille(7)` === `⠿⠁`; `12` === `⠿⠿`; `1` === `⠁` | |
| **Negative:** `renderEggQuantityBraille(6)` is single `⠿`, not two cells | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`eggQuantity` module + `BrailleQuantityRow` — report outcome.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-panel-braille-qty
```

```text
feat(web): Braille quantity display for egg counts
```
