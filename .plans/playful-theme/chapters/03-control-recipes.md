---
name: "Chapter 3 — Control recipes"
overview: "Theme recipes for Button, Slider, Badge, Card, Combobox; consumers adjusted only where props override."
todos:
  - id: recipes
    content: "recipes/{button,slider,badge,card,combobox}.ts registered in theme"
    status: pending
  - id: consumers
    content: "ListingCard, ListingPopoverContent, SliderWithValue, PlaceCombobox adjusted only where needed"
    status: pending
isProject: false
---

# Chapter 3 — Control recipes

**Repo:** `eggs` · **Branch:** `feat/eggs-playful-controls` · **Status:** planned

**Depends on:** [01-palette-and-roles.md](01-palette-and-roles.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §8 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Give every control the playful look through **theme recipes** (not per-component style props): chunky pill buttons, thick coloured slider track and big round thumb, pastel badges and cards with sticker borders, rounded combobox.

## Design decisions

**Recipes over props:** one file per component in `src/theme/recipes/`, registered in `defineConfig` ([gaps D6](../gaps-and-decisions.md)). Tabs are handled in chapter 2; do not duplicate.

**Palette:** recipes read `colorPalette`, so role palettes apply automatically ([gaps D4](../gaps-and-decisions.md)). Primary actions (Reserve, Post, Auth) default to `primary`; destructive seller actions pass `colorPalette="danger"`.

**Consumers:** touch [`ListingCard`](../../../src/features/listings/components/ListingCard.tsx), [`ListingPopoverContent`](../../../src/features/browse/components/MapView/ListingPopoverContent.tsx), [`SliderWithValue`](../../../src/components/ui/SliderWithValue.tsx), [`PlaceCombobox`](../../../src/features/location/components/PlaceCombobox/PlaceCombobox.tsx) and seller buttons ([`MarkStatusActions`](../../../src/features/listings/components/SellerActions/MarkStatusActions.tsx)) only where a prop must override the recipe.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/theme/recipes/button.ts` | theme | Pill, bold, sticker shadow, bouncy press |
| `src/theme/recipes/slider.ts` | theme | Thick track, round thumb |
| `src/theme/recipes/badge.ts` | theme | Pastel subtle, rounded |
| `src/theme/recipes/card.ts` | theme | Sticker border and shadow |
| `src/theme/recipes/combobox.ts` | theme | Rounded input and menu |
| `src/theme/recipes/index.ts` | theme | Barrel |
| `src/theme/index.ts` | theme | Register `recipes` / `slotRecipes` |
| `src/theme/theme.test.ts` | test | Recipes registered |
| consumers above | features | Minimal prop overrides |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `system._config.theme.recipes` (or `system.getRecipe`) includes `button`, `badge`, `card`; slot recipes include `slider`, `combobox` | |
| **Negative:** looking up an unregistered recipe name returns `undefined` | |
| **Happy:** `render(<Button colorPalette="danger">…)` in the themed provider uses the `danger` role (computed class/css var) | |
| **Negative:** an unknown `colorPalette` value falls back to the unthemed look and does not throw | |

## Green

Implement; `./ci.sh`.

## Refactor gate

Each recipe file ≤~100 LOC; shared sticker values come from the theme tokens, not repeated literals — report outcome.

## Git workflow

```bash
git checkout feat/plans-playful-theme && git pull
git checkout -b feat/eggs-playful-controls
```

```text
feat(web): playful control recipes
```
