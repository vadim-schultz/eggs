---
name: "Chapter 14 — Shell and app routing"
overview: "Move AppShell, AppDialog, RoleTabs, FarmerTab, dialog/map context to features/shell; split AppShell nested components; move App.tsx to src/app/App.tsx."
todos:
  - id: shell
    content: "shell feature + app/App.tsx route table"
    status: pending
isProject: false
---

# Chapter 14 — Shell and app routing

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-shell-and-app-routing` · **Status:** planned

**Depends on:** [2](02-auth-feature.md), [9](09-listing-detail-container-view.md), [10](10-post-listing-container-form.md), [13](13-buyer-tab-and-map.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Centralize app chrome, dialog deep-link state, and background map context under `features/shell/`; keep
routing in a thin `app/App.tsx`.

## Design decisions

**Context modules:**

- `context/appDialog.tsx` — from [AppDialogState.tsx](../../../src/components/AppDialogState.tsx)
- `context/backgroundMap.tsx` — provider + hooks from [BackgroundMap.tsx](../../../src/components/BackgroundMap.tsx)

**AppShell/** nested files (extract from [AppShell.tsx](../../../src/components/AppShell.tsx)):

- `AppShellMenuTrigger.tsx` (nest icon button)
- `AppShellPanel.tsx` (popover content + RoleTabs)
- `AppShellDialogHost.tsx` (dialog + listing/post containers)
- `BackgroundMapLayer.tsx` (fixed map + MapView)
- `AppShell.tsx` composes providers + pieces
- `index.ts` barrel

**FarmerTab/** — `FarmerTab.tsx` + `AddListingTrigger.tsx` + `index.ts`

**AppDialog/** — move [AppDialog.tsx](../../../src/components/AppDialog.tsx)

**Routes:** `src/app/App.tsx` from [App.tsx](../../../src/App.tsx); [main.tsx](../../../src/main.tsx) imports `@/app/App`.

## Files

**Add:** `features/shell/**`, `src/app/App.tsx`.

**Move tests:** `AppShell.test.tsx`, `AppDialog.test.tsx`, `RoleTabs.test.tsx`, `FarmerTab.test.tsx`, `App.test.tsx` (update paths).

**Delete:** `src/App.tsx`, `src/components/AppShell.tsx`, `AppDialogState.tsx`, `BackgroundMap.tsx`, `AppDialog.tsx`, `RoleTabs.tsx`, `FarmerTab.tsx`.

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `App · loading /listings/:id opens the detail dialog for that listing` | Deep link |
| **Negative:** `App · loading /post while signed in opens the post dialog` paired with unsigned: ensure `/post` without session does **not** open post dialog (extend App.test if only signed-in case exists today) | Deep-link auth guard |

If only signed-in post test exists, add negative test: navigate `/post` without session → dialog closed.

## Green

1. Move context + split AppShell.
2. Move AppDialog, RoleTabs, FarmerTab folders.
3. Move App route table; update main; delete old shell files.

## Refactor gate

AppShell.tsx **dispatches only** — no inline `DialogContent`, `BackgroundMap`, etc. Report outcome with file list.

## Verification

```bash
npm run test -- --run src/app/App.test.tsx src/features/shell
./ci.sh
```

## Out of scope

Deleting empty `src/routes` — chapter 15.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-shell-and-app-routing
```

```text
test(web): app routing and shell tests under features/shell

refactor(web): extract shell feature and app route table
```
