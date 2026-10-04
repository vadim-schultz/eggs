---
name: "Chapter 2 — Seller amount and price"
overview: "Seller form: editable amount input beside the slider, price per egg with carton hint."
todos:
  - id: editable-slider
    content: "SliderWithValue opt-in editable NumberInput label"
    status: pending
  - id: amount-control
    content: "EggAmountControl enables editable"
    status: pending
  - id: price-field
    content: "Price per egg field with 6/10 carton hint"
    status: pending
isProject: false
---

# Chapter 2 — Seller amount and price

**Repo:** `eggs` · **Branch:** `feat/eggs-pricing-seller` · **Status:** planned

**Depends on:** [1](01-price-per-egg-data.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

The seller enters the amount by typing (the label next to the slider becomes an input) and enters the price of **one** egg.

## Design decisions

**Editable value:** [`SliderWithValue`](../../../src/components/ui/SliderWithValue.tsx) gains `editable?: boolean` (default `false`). When set, the value `Text` is replaced by a Chakra `NumberInput` (same `minW`, right-aligned, `size="sm"`). It keeps a local draft string while typing; on blur or Enter it parses to an integer, clamps to `[min, max]`, and calls `onValueChange`; non-numeric or empty input reverts to the current value. The slider keeps working and the input follows its value. Extract the draft/clamp logic into a small hook (`useCommittedNumber`) to keep files ≤~100 LOC. [`RadiusSlider`](../../../src/features/browse/components/BuyerTab/RadiusSlider.tsx) is unchanged ([gaps D7](../gaps-and-decisions.md)).

**Amount control:** [`EggAmountControl`](../../../src/features/listings/components/PostListing/EggAmountControl.tsx) passes `editable`; range stays 1–100.

**Price field:** in [`PostListingForm`](../../../src/features/listings/components/PostListing/PostListingForm.tsx) the field uses the new label (`post.price.label` = "Preis pro Ei (€)") with `step="0.01"` and `min="0"`. Under it, a muted `xs` hint shows the 6- and 10-carton price via `cartonPriceCents` when the entered price is valid (new strings `post.price.cartonHint`).

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/components/ui/SliderWithValue.tsx` | ui | `editable` prop |
| `src/components/ui/useCommittedNumber.ts` (+ test) | ui | Draft / clamp / commit hook |
| `src/features/listings/components/PostListing/EggAmountControl.tsx` | listings | `editable` |
| `src/features/listings/components/PostListing/PostListingForm.tsx` | listings | Step, hint |
| `src/i18n/strings.de.ts` | i18n | `post.price.cartonHint` |
| `*.test.tsx` for the above | test | Updated |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** typing `24` + blur in the amount input calls `onValueChange(24)` and the slider thumb reads 24 | |
| **Happy:** price `0.35` shows hint with 2,10 € and 3,50 € | |
| **Negative:** typing `500` clamps to 100; `0` clamps to 1 | |
| **Negative:** typing `abc` / empty reverts to the previous value, no `onValueChange` call | |
| **Negative:** `SliderWithValue` without `editable` still renders the static label (no input) | |
| **Negative:** invalid / empty price shows no carton hint | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`SliderWithValue.tsx` ≤~100 LOC after the hook extraction; one-level nesting — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-pricing && git pull
git checkout -b feat/eggs-pricing-seller
```

```text
feat(listings): editable egg amount and per-egg price field
```
