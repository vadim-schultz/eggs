---
name: "Chapter 7 — Post listing form"
overview: "Egg bar on top full width; slider 1–100; remove Stück/Dutzend."
todos:
  - id: form-layout
    content: "PostListingForm + EggAmountControl"
    status: pending
  - id: mappers
    content: "postListingMappers unit each only"
    status: pending
isProject: false
---

# Chapter 7 — Post listing form

**Repo:** `eggs` · **Branch:** `feat/eggs-egg-ux-post-form` · **Status:** planned

**Depends on:** [04-retire-braille.md](04-retire-braille.md), [03-egg-quantity-module.md](03-egg-quantity-module.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §7 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

**Create listing** dialog: **`EggQuantityRow` + slider** at the **top**, **`w="full"`**, **not** inside `KeyValueRow` ([gaps D9](../gaps-and-decisions.md)). Slider **1…100**. Remove **Stück / Dutzend** chips from [`EggAmountControl`](../../../src/features/listings/components/PostListing/EggAmountControl.tsx). Other fields (price, Ort, contact note) unchanged. Always submit **`unit: "each"`**.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/components/PostListing/PostListingForm.tsx` | component | Egg block first; remove count `KeyValueRow` wrapper |
| `src/features/listings/components/PostListing/EggAmountControl.tsx` | component | Drop `UnitChip` row; `SliderWithValue` min 1 max 100; `EggQuantityRow` |
| `src/features/listings/components/PostListing/EggAmountControl.test.tsx` | test | No unit chips; slider max 100 |
| `src/features/listings/utils/postListingMappers.ts` | util | Default / force `unit: "each"` |
| `src/features/listings/containers/PostListing.test.tsx` | test | Submit payload uses `each` |
| `src/i18n/strings.de.ts` | i18n | Remove or keep unused `post.unit.*` keys (optional cleanup) |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `PostListingForm` / `EggAmountControl` — egg row test id appears **before** price field in DOM order; slider `max` 100 | |
| **Negative:** no `data-testid="unit-chip-row"` or Stück/Dutzend labels in post form | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`EggAmountControl` + `PostListingForm` — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-ux && git pull
git checkout -b feat/eggs-egg-ux-post-form
```

```text
feat(web): simplify post listing to 1–100 eggs with top egg bar
```
