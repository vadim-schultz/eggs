---
name: "Chapter 1 — Shell burger, open panel, cleanup"
overview: "Burger menu trigger, popover open on load, remove unused browse/listing dead code."
todos:
  - id: shell
    content: "AppShell + trigger + tests + deletions"
    status: pending
isProject: false
---

# Chapter 1 — Shell burger, open panel, cleanup

**Repo:** `eggs` · **Branch:** `feat/eggs-panel-shell` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Replace invisible / egg menu trigger with a **burger** icon; keep panel **open on load** so Käufer search is visible; delete unused modules per D10.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/shell/components/AppShell/AppShellMenuTrigger.tsx` | component | `TbMenu2` (or equivalent) instead of `TbEggs`; visible styling |
| `src/features/shell/containers/AppShell.tsx` | container | `Popover.Root` `defaultOpen` (or controlled `open`) |
| `src/features/shell/containers/AppShell.test.tsx` | test | panel content visible on first paint |
| Delete `src/features/browse/components/BuyerTab/RadiusSelect.tsx` | — | unused |
| Delete `src/features/listings/components/ListingSummaryLine.tsx` + test | — | no prod imports |
| Delete `src/features/location/components/LocationPicker/ManualPinFallback.tsx` | — | if unreferenced |
| Move `Unit` type from `UnitSelect.tsx` to `src/features/listings/types/`; delete `UnitSelect.tsx` if only type export | types | D10 |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `AppShell` / menu trigger has accessible burger label; buyer tab search visible without opening menu | |
| **Negative:** document does not import deleted `RadiusSelect` | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`AppShell` container and menu trigger — report outcome.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-panel-shell
```

```text
feat(web): burger menu and open panel on load
```
