---
name: "Chapter 4 — Silly layer and verify"
overview: "Keyframes, EggBurst, egg wiggle, palette-coloured map markers, playful copy; docs sync and light/dark screenshots."
todos:
  - id: keyframes
    content: "theme/keyframes.ts (wiggle, bounce, pop) gated by reduced motion"
    status: completed
  - id: egg-burst
    content: "EggBurst on reserve and post success"
    status: completed
  - id: markers-copy
    content: "palette-coloured map markers + playful strings.de.ts copy"
    status: completed
  - id: verify
    content: "docs sync, README status, light/dark screenshots"
    status: completed
isProject: false
---

# Chapter 4 — Silly layer and verify

**Repo:** `eggs` · **Branch:** `feat/eggs-playful-silly` · **Status:** shipped

**Depends on:** [02-surfaces-and-chrome.md](02-surfaces-and-chrome.md), [03-control-recipes.md](03-control-recipes.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §9 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Add the "almost silly" layer: eggs that wiggle, buttons that bounce, a burst of eggs on success, map markers in egg colours, and cheeky German micro-copy — then verify the whole suite visually and in docs.

## Design decisions

**Keyframes:** `theme/keyframes.ts` defines `wiggle`, `bounce`, `pop`; applied through recipe/style props and gated by `prefers-reduced-motion: no-preference` ([gaps D8](../gaps-and-decisions.md)).

**EggBurst:** [`components/ui/EggBurst.tsx`](../../../src/components/ui/) renders `n` egg icons (`TbEggFilled`) coloured via [`eggColorForSlot`](../../../src/lib/eggQuantity/eggPalette.ts), staggered `animation-delay`, unmounts after one cycle. Mounted on reserve success ([`ReserveButton`](../../../src/features/listings/components/ReserveButton/ReserveButton.tsx)) and post success ([`PostListingForm`](../../../src/features/listings/components/PostListing/PostListingForm.tsx)). Controlled by a boolean prop; the container owns the trigger state.

**Egg wiggle:** [`EggQuantityRow`](../../../src/components/ui/EggQuantityRow.tsx) icons wiggle on hover.

**Markers:** [`MapView.tsx`](../../../src/features/browse/components/MapView/MapView.tsx) divIcons take background colour from the egg palette (resolved hex; decide in-chapter whether they follow colour mode — [gaps open seam](../gaps-and-decisions.md)).

**Copy:** playful emoji micro-copy for empty states, success toasts and buttons in [`strings.de.ts`](../../../src/i18n/strings.de.ts) only.

**Verify:** run the app (`run` skill), capture light + dark screenshots of shell, panel, dialog and popover; sync [README](../../README.md) status and any `docs/` mentions.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/theme/keyframes.ts` | theme | `wiggle`, `bounce`, `pop` |
| `src/theme/index.ts` | theme | Register keyframes |
| `src/components/ui/EggBurst.tsx` | ui | CSS-only burst |
| `src/components/ui/EggBurst.test.tsx` | test | Renders N eggs; absent when inactive |
| `src/components/ui/EggQuantityRow.tsx` | ui | Hover wiggle |
| `src/features/listings/components/ReserveButton/ReserveButton.tsx` | listings | Burst on success |
| `src/features/listings/components/PostListing/PostListingForm.tsx` | listings | Burst on success |
| `src/features/browse/components/MapView/MapView.tsx` | browse | Palette-coloured markers |
| `src/i18n/strings.de.ts` | i18n | Playful copy |
| `.plans/README.md`, `.plans/playful-theme/*` | docs | Status → shipped |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `<EggBurst active count={5}>` renders 5 egg icons with distinct palette colours | |
| **Negative:** `<EggBurst active={false}>` renders nothing; reserve **error** does not mount a burst | |
| **Happy:** keyframes `wiggle`, `bounce`, `pop` registered in the system | |
| **Negative:** under reduced motion the animation style is absent (mock `matchMedia`) | |
| **Happy:** marker icon HTML uses a palette hex, not hardcoded `#fff` background | |

## Green

Implement; `./ci.sh`; capture screenshots.

## Refactor gate

`EggBurst` ≤~100 LOC with one concern; success-state trigger lives in containers, not presentational components — report outcome.

## Git workflow

```bash
git checkout feat/plans-playful-theme && git pull
git checkout -b feat/eggs-playful-silly
```

```text
feat(web): playful motion, egg burst and coloured markers
```
