---
name: "Chapter 3 — SliderWithValue"
overview: "Numeric value left of Chakra slider track; adopt in radius and egg amount."
todos:
  - id: slider
    content: "SliderWithValue + refactors + tests"
    status: pending
isProject: false
---

# Chapter 3 — SliderWithValue

**Branch:** `feat/eggs-panel-slider-value` · **Depends on:** none

---

## Goal

Shared slider layout: **value text left**, track right ([Chakra Slider](https://www.chakra-ui.com/docs/components/slider)).

## Files

| Path | Layer |
| --- | --- |
| `src/components/ui/SliderWithValue.tsx` | ui |
| `src/components/ui/SliderWithValue.test.tsx` | test |
| `src/features/browse/components/BuyerTab/RadiusSlider.tsx` | component |
| `src/features/listings/components/PostListing/EggAmountControl.tsx` | component |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `SliderWithValue` renders value before control in DOM order | |
| **Negative:** value is not only inside thumb / dragging indicator | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`SliderWithValue` + refactored sliders — report outcome.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-panel-slider-value
```

```text
feat(web): slider with value label left of track
```
