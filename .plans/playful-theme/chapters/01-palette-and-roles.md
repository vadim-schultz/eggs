---
name: "Chapter 1 — Palette and roles"
overview: "Full 50–950 ramps for the 12 Easter names, bright pastel anchors, warm neutrals, role palettes, default-palette spike, StatusBadge on roles, AA contrast test."
todos:
  - id: ramps
    content: "tokens/ramp.ts helper + retuned 12 ramps + warm neutrals"
    status: pending
  - id: roles
    content: "semantic-tokens/palettes.ts role aliases + default-palette spike"
    status: pending
  - id: status-badge
    content: "StatusBadge maps to roles"
    status: pending
  - id: contrast
    content: "AA contrast test over role pairs, light and dark"
    status: pending
isProject: false
---

# Chapter 1 — Palette and roles

**Repo:** `eggs` · **Branch:** `feat/eggs-playful-palette` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §5–7, §10 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Make the Easter palette usable as real Chakra `colorPalette`s: full ramps, semantic slots with light/`_dark` pairs, and **role aliases** (`primary`, `secondary`, `success`, `warning`, `danger`, `info`, `accent`) that features reference instead of raw swatches.

## Design decisions

**Ramps:** `ramp(anchor)` in `src/theme/tokens/ramp.ts` is a pure function returning stops `50…950` (lighten towards white, darken towards a warm shade) with the anchor at `500`. Replaces the single-stop `scale()` in [`colors.ts`](../../../src/theme/tokens/colors.ts). Anchors are retuned to bright pastels (burgundy, navy, rust, jade especially); names unchanged ([gaps D2](../gaps-and-decisions.md)).

**Semantic slots:** per swatch, `solid / contrast / fg / muted / subtle / emphasized / focusRing` via `mode()` ([`mode.ts`](../../../src/theme/semantic-tokens/mode.ts)).

**Roles:** `semantic-tokens/palettes.ts` exposes the role map from [gaps D4](../gaps-and-decisions.md) as Chakra colour palettes so `colorPalette="primary"` resolves.

**Default palette spike:** try a `globalCss` default; if it does not take, wrap the shell in `colorPalette="primary"` ([gaps D5](../gaps-and-decisions.md)). Record the outcome in the PR description.

**Warm neutrals:** retint `neutral` (cream light / plum-navy dark).

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/theme/tokens/ramp.ts` | theme | `ramp(anchor)` pure helper |
| `src/theme/tokens/colors.ts` | theme | Use `ramp`; retuned anchors; warm `neutral` |
| `src/theme/semantic-tokens/palettes.ts` | theme | Role palettes + slots |
| `src/theme/semantic-tokens/index.ts` | theme | Register palettes |
| `src/theme/contrast.ts` | theme | WCAG contrast ratio helper |
| `src/theme/theme.test.ts` | test | Ramp stops + role slots registered |
| `src/theme/contrast.test.ts` | test | AA over every role pair, both modes |
| `src/features/listings/components/StatusBadge.tsx` | listings | Map status → role |
| `src/features/shell/containers/AppShell.tsx` | shell | Wrapper `colorPalette` only if the spike falls back |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `system.token("colors.coral.50")` … `950` and `colors.primary.solid` registered | |
| **Negative:** `colors.coral.55` (unregistered stop) is `undefined` | |
| **Happy:** every role `solid`/`contrast` pair is ≥ 4.5:1 in light and `_dark` | |
| **Negative:** contrast helper rejects an injected low-contrast pair (e.g. `#ffffff` on `#f5f5f5`) | |
| **Happy:** `statusColorPalette("active")` returns a role name | |
| **Negative:** unknown status is rejected by the type / lookup (no silent fallback to a default colour) | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`src/theme/` files each ≤~100 LOC; `ramp` and `contrast` stay single-responsibility — report outcome.

## Git workflow

```bash
git checkout feat/plans-playful-theme && git pull
git checkout -b feat/eggs-playful-palette
```

```text
feat(web): full Easter ramps and role palettes
```
