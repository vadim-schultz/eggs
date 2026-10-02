---
name: "Chapter 1 — Theme and color mode"
overview: "Easter token scales, semantic colours, next-themes ColorModeProvider, theme tests."
todos:
  - id: theme-tokens
    content: "theme/tokens + semantic-tokens + system merge"
    status: pending
  - id: color-mode
    content: "color-mode snippet + main.tsx provider"
    status: pending
isProject: false
---

# Chapter 1 — Theme and color mode

**Repo:** `eggs` · **Branch:** `feat/eggs-egg-ux-theme` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §6 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Introduce an **Easter egg colour system** with **light/dark** semantic tokens (redtape-style) and wire **`next-themes`** through Chakra’s color-mode snippet so typography and UI can use `fg`, `nav.*`, and palette roles instead of hardcoded greys.

## Design decisions

**Reference:** [redtape `apps/web/src/theme/`](../../../../redtape/apps/web/src/theme/) — `mode()`, `tokens/colors.ts`, `semantic-tokens/index.ts`.

**Palette:** Twelve named scales per [gaps D3](../gaps-and-decisions.md); choose accessible hex per name with `_dark` variants.

**Provider order:** `ColorModeProvider` wraps the app tree per [Chakra color mode](https://www.chakra-ui.com/docs/components/concepts/color-mode); keep existing `ChakraProvider` with extended `system` from [`src/theme/index.ts`](../../../src/theme/index.ts).

**Toggle:** Ship `ColorModeButton` from the snippet; mounting in the panel header is optional this chapter (may defer to chapter 2).

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `package.json` | — | Add `next-themes` |
| `src/theme/semantic-tokens/mode.ts` | theme | `mode(base, dark)` helper |
| `src/theme/tokens/colors.ts` | theme | Easter + neutral ramps |
| `src/theme/semantic-tokens/*.ts` | theme | `text`, `surfaces`, `nav`, `brand`, egg palette refs |
| `src/theme/semantic-tokens/index.ts` | theme | Barrel + register in `defineConfig` |
| `src/theme/index.ts` | theme | Merge semantic tokens into `createSystem` |
| `src/theme/theme.test.ts` | test | Token keys exist (e.g. `colors.blush.500`, `colors.nav.bg`) |
| `src/components/ui/color-mode.tsx` | ui | CLI snippet (`ColorModeProvider`, `useColorMode`, `ColorModeButton`) |
| `src/components/ui/color-mode.test.tsx` | test | Hook / forced-theme no-op |
| `src/main.tsx` | app | Wrap with `ColorModeProvider` |
| `src/test/renderWithProviders.tsx` or test helpers | test | Include `ColorModeProvider` where app tree is rendered |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `theme.test.ts` — system includes Easter token name (e.g. `blush`) and semantic `fg` / `nav.bg` | |
| **Negative:** `useColorMode` with mocked `forcedTheme` — `toggleColorMode` does not call `setTheme` | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`src/theme/` layout (split files ~100 LOC) — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-ux && git pull
git checkout -b feat/eggs-egg-ux-theme
```

```text
feat(web): Easter theme tokens and color mode provider
```
