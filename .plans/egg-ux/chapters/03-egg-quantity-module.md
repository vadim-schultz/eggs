---
name: "Chapter 3 — Egg quantity module"
overview: "lib/eggQuantity slot model; colourful EggQuantityRow (TbEgg / TbEggFilled)."
todos:
  - id: lib
    content: "eggQuantity pure functions + tests"
    status: pending
  - id: ui
    content: "EggQuantityRow component + tests"
    status: pending
isProject: false
---

# Chapter 3 — Egg quantity module

**Repo:** `eggs` · **Branch:** `feat/eggs-egg-ux-egg-qty` · **Status:** planned

**Depends on:** [01-theme-and-color-mode.md](01-theme-and-color-mode.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §5 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Add **`src/lib/eggQuantity/`** (pure decade-slot model for counts **1…100**) and **`EggQuantityRow`** UI using **`TbEgg`** / **`TbEggFilled`** with **Easter palette** colours per slot ([gaps D4](../gaps-and-decisions.md)). Do **not** delete Braille yet (chapter 4).

## Files

| Path | Layer |
| --- | --- |
| `src/lib/eggQuantity/types.ts` | lib — slot kind: `empty` \| `outline` \| `filled` |
| `src/lib/eggQuantity/slotsForCount.ts` | lib — `slotsForCount(n: number): Slot[]` length 10 |
| `src/lib/eggQuantity/slotsForCount.test.ts` | test |
| `src/lib/eggQuantity/index.ts` | lib |
| `src/lib/eggQuantity/clampCount.ts` | lib — clamp 1…100 (optional helper) |
| `src/components/ui/EggQuantityRow.tsx` | ui — `Flex`/`HStack`, `w="full"`, coloured icons |
| `src/components/ui/EggQuantityRow.test.tsx` | test — RTL: correct icon count for 9, 10, 15 |

**Do not edit** Braille modules or wire `EggQuantityRow` into listing/post yet (chapters 4, 7, 8).

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `slotsForCount(9)` → 9 outline slots in indices 0–8; `slotsForCount(10)` → filled at 0 only; `slotsForCount(15)` → 1 filled + 5 outline; `slotsForCount(100)` → 10 filled | |
| **Negative:** `slotsForCount(0)` or `slotsForCount(101)` throws or clamps per D3 open seam — document chosen behaviour in test name | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`slotsForCount` + `EggQuantityRow` — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-ux && git pull
git checkout -b feat/eggs-egg-ux-egg-qty
```

```text
feat(web): egg decade quantity module and EggQuantityRow
```
