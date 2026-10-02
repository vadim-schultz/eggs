---
name: "Chapter 2 — Shell burger surface"
overview: "floatingSurface semantic styles; AppShellMenuTrigger visible on map."
todos:
  - id: surface
    content: "floatingSurface + AppShellMenuTrigger"
    status: pending
isProject: false
---

# Chapter 2 — Shell burger surface

**Repo:** `eggs` · **Branch:** `feat/eggs-egg-ux-burger` · **Status:** planned

**Depends on:** [01-theme-and-color-mode.md](01-theme-and-color-mode.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §8 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

The menu trigger must show a **recognizable burger icon** on top of the map. Replace hardcoded `bg="white"` / `borderColor="gray.200"` with a shared **`floatingSurface`** using semantic **`nav.bg`**, **`nav.border`**, and icon **`color`** (pattern from [redtape `floatingSurface.ts`](../../../../redtape/apps/web/src/components/layout/floatingSurface.ts) and [redtape `AppMenu.tsx`](../../../../redtape/apps/web/src/components/layout/AppMenu.tsx)).

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/shell/theme/floatingSurface.ts` (or `src/theme/floatingSurface.ts`) | theme | Exported surface props object |
| `src/features/shell/components/AppShell/AppShellMenuTrigger.tsx` | component | Spread `floatingSurface`; keep `TbMenu2` |
| `src/features/shell/containers/AppShell.test.tsx` | test | Trigger visible; icon/button uses semantic colour (not raw `#fff` only) |
| Optional: panel header | component | Mount `ColorModeButton` if not done in ch.1 |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `AppShell` renders burger `aria-label` / role button; trigger is visible (`toBeVisible`) | |
| **Negative:** `AppShellMenuTrigger` source does not set `bg="white"` (grep or style assertion) | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`AppShellMenuTrigger` — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-ux && git pull
git checkout -b feat/eggs-egg-ux-burger
```

```text
feat(web): semantic floating surface for burger menu trigger
```
