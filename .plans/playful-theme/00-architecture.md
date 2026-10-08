---
name: Playful Theme — Architecture
overview: "Promote the 12-colour Easter palette to full theme ramps and semantic roles, then apply it to shell chrome, controls and a reduced-motion-safe silly layer."
isProject: false
---

# Playful Theme — Architecture

**Rollout:** [01-rollout.md](01-rollout.md) · **Decisions:** [gaps-and-decisions.md](gaps-and-decisions.md) · **Chapters:** [chapters/](chapters/) · **Ledger:** [run-ledger.md](run-ledger.md)

**Status:** shipped

---

## 1. Why

The Easter palette ([`src/theme/tokens/colors.ts`](../../src/theme/tokens/colors.ts)) is defined but only [`eggColorForSlot`](../../src/lib/eggQuantity/eggPalette.ts) consumes it (via [`EggQuantityRow`](../../src/components/ui/EggQuantityRow.tsx)). Buttons, tabs, sliders, badges, cards, popover, dialog and map markers all render in Chakra's default blue/gray. Each swatch is a single-stop `scale()` (only `500`), so none can serve as a Chakra `colorPalette` (needs 50–950 and the `solid / contrast / fg / muted / subtle / emphasized / focusRing` slots), and several (burgundy, navy, rust, jade) are dark rather than pastel.

Goal: a **bright, playful, almost silly** app — the palette promoted to real theme colours and applied to every interface element, in light and dark.

## 2. Non-goals

- No new npm dependencies (CSS keyframes only; no confetti library).
- No layout or information-architecture changes; no schema changes.
- No edits to [`.plans/egg-ux/`](../egg-ux/) or other suites.
- No new copy outside [`strings.de.ts`](../../src/i18n/strings.de.ts).

## 3. Prerequisites

[egg-ux](../egg-ux/) chapter 1 is on `main`: `mode()` helper, `semantic-tokens/*`, `ColorModeProvider`, `egg.*` aliases. This suite builds on them.

## 4. Layers

| Layer | Responsibility | Touched examples |
| --- | --- | --- |
| **theme/tokens** | Full ramps for the 12 names + warm neutrals | `tokens/colors.ts`, `tokens/ramp.ts` (new) |
| **theme/semantic-tokens** | Role palettes, warm `bg` / `nav` / `fg` | `palettes.ts` (new), `surfaces.ts`, `navigation.ts` |
| **theme/recipes** | Per-component look (chunky, sticker shadows, bouncy) | `recipes/{button,tabs,slider,badge,card,combobox}.ts` (new) |
| **theme/keyframes** | Wiggle / bounce / pop | `keyframes.ts` (new) |
| **components/ui** | Presentational primitives | `EggQuantityRow`, `EggBurst` (new), `SliderWithValue` |
| **features/** | Consumers; use role palettes, never raw swatches | `StatusBadge`, shell, listings, browse map markers |

## 5. Token model

- Each of the 12 names (`blush … navy`) becomes a **full 50–950 ramp** built by a pure `ramp(anchor)` helper, plus semantic slots with `mode(light, _dark)` pairs. Anchors are retuned to **bright pastels**; names stay so `EGG_PALETTE_COLOR_NAMES` and `egg.*` keep working.
- `neutral` is warm-tinted (cream in light, plum-navy in dark) instead of cool grey.

## 6. Role map

Components reference **roles**, never raw swatches:

| Role | Swatch | Used for |
| --- | --- | --- |
| `primary` | coral | Main actions, brand mark |
| `secondary` | cornflower | Secondary actions, tabs |
| `success` | mint | Active / reserved-by-me states |
| `warning` | goldenrod | Reserved, expiring |
| `danger` | rose | Errors, cancel |
| `info` | seafoam | Neutral highlights |
| `accent` | blush | Surface tints, hover washes |

[`StatusBadge`](../../src/features/listings/components/StatusBadge.tsx) moves from `green / yellow / blue / gray / red` to these roles.

## 7. Applying a default palette

Chapter 1 spikes whether Chakra v3 accepts a default `colorPalette` through `globalCss`. Fallback (known to work): `colorPalette="primary"` on a wrapper `Box` in [`AppShell`](../../src/features/shell/containers/AppShell.tsx). Explicit `colorPalette` props override per component.

## 8. Recipes

Registered in `defineConfig({ theme: { recipes, slotRecipes } })` in [`src/theme/index.ts`](../../src/theme/index.ts). Shared look: chunky radii (`full` / `2xl`), 2px coloured borders, "sticker" hard-offset shadows, pastel tinted surfaces, bouncy hover/press. Headings stay Bree Serif.

## 9. Motion rules

- Keyframes (`wiggle`, `bounce`, `pop`) live in the theme; components reference them by name.
- Every animation is gated by `prefers-reduced-motion: no-preference`.
- `EggBurst` is CSS-only (positioned egg icons with staggered `animation-delay`); it unmounts itself after one cycle.

## 10. Accessibility guard

A unit test iterates every role's `solid` / `contrast` pair in both modes and asserts WCAG AA (4.5:1 text, 3:1 large text / UI). Bright is capped by readable.

## 11. Verification

```bash
./ci.sh
```

Chapter 4 adds light + dark screenshots of the shell, panel, dialog and map popover.

## 12. Execution

Run via the user `chief-of-staff` skill and `chapter-implementer` agent (plan folder `.plans/playful-theme/`). Track merges in [run-ledger.md](run-ledger.md).

**Git:** loop branch `feat/plans-playful-theme`; chapter PRs → loop; one release PR **`feat/plans-playful-theme` → `main`** when done ([01-rollout.md](01-rollout.md)).

## 13. Traceability (brief → chapter)

| Brief item | Chapter |
| --- | --- |
| Palette becomes real theme colours | 1 |
| Roles replace Chakra default blue/gray | 1 |
| Bright playful shell, panel, dialog, tabs | 2 |
| Controls (button, slider, badge, card, combobox) | 3 |
| Silly layer (motion, burst, markers, copy) | 4 |
