---
name: "Chapter 2 — Surfaces and chrome"
overview: "Pastel bg/nav tokens, sticker shadows, tinted page; floatingSurface, panel, burger, dialog and role tabs on semantic tokens."
todos:
  - id: surface-tokens
    content: "bg/nav tokens + sticker shadow token"
    status: pending
  - id: shell-chrome
    content: "floatingSurface, AppShellPanel, AppShellMenuTrigger, AppDialog, RoleTabs"
    status: pending
isProject: false
---

# Chapter 2 — Surfaces and chrome

**Repo:** `eggs` · **Branch:** `feat/eggs-playful-surfaces` · **Status:** planned

**Depends on:** [01-palette-and-roles.md](01-palette-and-roles.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §6, §8 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Make the frame of the app bright and playful: tinted page background, pastel panel/dialog/popover surfaces with coloured borders and "sticker" hard-offset shadows, a vivid burger, and role-coloured tabs — all via semantic tokens, no hardcoded `white` / `gray.*`.

## Design decisions

**Tokens:** retint [`bg`](../../../src/theme/semantic-tokens/surfaces.ts) and [`nav`](../../../src/theme/semantic-tokens/navigation.ts) to the `accent` / `primary` roles; add a `shadows.sticker` token (hard offset, role-coloured) in `theme/`.

**Shell:** [`floatingSurface`](../../../src/features/shell/theme/floatingSurface.ts) gains the sticker shadow and a thicker border; `AppShellPanel`, `AppShellMenuTrigger`, `AppDialog` consume it. [`RoleTabs`](../../../src/features/shell/components/RoleTabs.tsx) uses `colorPalette="secondary"` and a chunkier `enclosed` look.

**Page tint:** `globalCss` body background uses the warm `bg` token; map layer unchanged.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/theme/semantic-tokens/surfaces.ts` | theme | Pastel `bg` |
| `src/theme/semantic-tokens/navigation.ts` | theme | Coloured `nav.border` / `nav.bg` |
| `src/theme/tokens/shadows.ts` | theme | `sticker` shadow |
| `src/theme/index.ts` | theme | Register shadows + body `globalCss` |
| `src/features/shell/theme/floatingSurface.ts` | shell | Sticker shadow, thicker border |
| `src/features/shell/theme/floatingSurface.test.ts` | test | Semantic tokens only |
| `src/features/shell/components/AppShell/AppShellPanel.tsx` | shell | Use `floatingSurface` |
| `src/features/shell/components/AppShell/AppShellMenuTrigger.tsx` | shell | Vivid burger |
| `src/features/shell/components/AppDialog/AppDialog.tsx` | shell | Coloured border + shadow |
| `src/features/shell/components/RoleTabs.tsx` | shell | `colorPalette="secondary"` |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `floatingSurface` values are semantic token paths (`nav.bg`, `nav.border`, `shadows.sticker`) | |
| **Negative:** no shell component file contains hardcoded `white`, `gray.*` or `#hex` colours (source-scan test over `src/features/shell/`) | |
| **Happy:** `system.token("shadows.sticker")` registered | |

## Green

Implement; `./ci.sh`.

## Refactor gate

Shell components stay ≤~100 LOC; shared surface props live only in `floatingSurface` — report outcome.

## Git workflow

```bash
git checkout feat/plans-playful-theme && git pull
git checkout -b feat/eggs-playful-surfaces
```

```text
feat(web): pastel surfaces and sticker chrome
```
