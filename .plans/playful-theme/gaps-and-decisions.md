---
name: Playful Theme — Gaps and decisions
overview: "Settled palette ramps, role map, default-palette mechanism, recipes, motion and contrast rules."
isProject: false
---

# Playful Theme — Gaps and decisions

**Architecture:** [00-architecture.md](00-architecture.md) · **Rollout:** [01-rollout.md](01-rollout.md)

## Settled

| ID | Decision |
| --- | --- |
| D1 | Suite folder **`.plans/playful-theme`**; loop branch **`feat/plans-playful-theme`**; release **`main`** ([01-rollout.md](01-rollout.md), [git-model.md](../../.cursor/skills/chief-of-staff/git-model.md)). |
| D2 | **Palette:** the 12 names ([egg-ux D3](../egg-ux/gaps-and-decisions.md)) become full 50–950 ramps via a pure `ramp(anchor)` helper plus `solid / contrast / fg / muted / subtle / emphasized / focusRing` slots with `mode()` light/`_dark` pairs. Anchors retuned to bright pastels; **names unchanged** so `EGG_PALETTE_COLOR_NAMES` and `egg.*` keep working. |
| D3 | **Neutrals** warm-tinted: cream in light, plum-navy in dark. |
| D4 | **Role map:** primary=coral, secondary=cornflower, success=mint, warning=goldenrod, danger=rose, info=seafoam, accent=blush. Features use roles, never raw swatches. |
| D5 | **Default palette:** chapter 1 spikes a `globalCss` default; fallback is `colorPalette="primary"` on a wrapper in `AppShell`. Record the outcome in the chapter PR. |
| D6 | **Recipes** in `src/theme/recipes/` (button, tabs, slider, badge, card, combobox): chunky radii, 2px coloured borders, hard-offset "sticker" shadows, bouncy hover/press. |
| D7 | **Silly layer:** `wiggle` / `bounce` / `pop` keyframes; egg hover wiggle; CSS-only `EggBurst` on reserve and post success; map markers coloured from the egg palette; playful emoji micro-copy in `strings.de.ts`. |
| D8 | **Reduced motion:** all animation under `prefers-reduced-motion: no-preference`. |
| D9 | **Contrast:** unit test asserts WCAG AA for every role `solid` / `contrast` pair in both modes. |
| D10 | **No new npm dependencies.** |
| D11 | **Chapters merge into the loop branch**, never directly to `main`; the release PR is opened by chief of staff. |

## Open seams

- **Status badge mapping** — `cancelled` and `expired` both need a role; default `danger` and `info`, confirm in ch.1 review.
- **Map marker colours** — Leaflet `divIcon` markers are static HTML ([`MapView.tsx`](../../src/features/browse/components/MapView/MapView.tsx)); they take resolved hex from the palette, not CSS variables. Chapter 4 decides whether markers follow colour mode.
- **Default-palette spike** may fall back to the wrapper approach (D5); recipes must work either way.

## Overlap

- [egg-ux](../egg-ux/) — owns the Easter palette names, `mode()` and `ColorModeProvider`; this suite extends them. Do not edit egg-ux plan files.
