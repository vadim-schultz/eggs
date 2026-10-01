---
name: "Chapter 2 — Auth feature"
overview: "Move AuthButton, RequireAuth, and useSession into src/features/auth/ with barrels; update all imports; delete src/auth/."
todos:
  - id: move-auth
    content: "features/auth components + hooks + tests"
    status: pending
isProject: false
---

# Chapter 2 — Auth feature

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-auth-feature` · **Status:** planned

**Depends on:** [1](01-import-alias.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4, §8 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Isolate session and sign-in UI under `features/auth/` so listing, browse, and shell import auth through one
stable path (`@/features/auth/…`).

## Design decisions

**Flat files inside the feature** — auth has no nested sub-component trees yet; three modules plus co-located
tests, optional `index.ts` barrels per subfolder.

**Same behavior** — `useSession` still subscribes via `supabase.auth.onAuthStateChange`; `AuthButton` keeps
OAuth + sign-out; `RequireAuth` redirect unchanged.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/features/auth/components/AuthButton.tsx` | moved from `src/auth/` |
| `src/features/auth/components/RequireAuth.tsx` | moved |
| `src/features/auth/hooks/useSession.ts` | moved |
| `src/features/auth/components/AuthButton.test.tsx`, `RequireAuth.test.tsx`, `hooks/useSession.test.ts` | moved |

**Edit:** every importer (`AppShell`, `BuyerTab`, `FarmerTab`, `ReserveButton`, `SellerActions`, `AppDialogState`, etc.) — switch to `@/features/auth/…`.

**Delete:** `src/auth/` directory.

## Manual configuration

None.

## Red tests

Retarget imports in test files first so Vitest fails with module not found, then move files.

| Test | Asserts |
| --- | --- |
| **Happy:** `AuthButton · shows "Sign in with Google" when signed out` | Signed-out control visible at new path |
| **Negative:** `RequireAuth · redirects to "/" when no session exists` | Unauthenticated users still blocked |

## Green

1. Create `features/auth/` tree; move modules and tests.
2. Update production imports to `@/features/auth/…`.
3. Delete `src/auth/`; run auth-related tests + full suite.

## Refactor gate

Each moved file is already a single component or hook — **no split needed**. Report: no nested-component
violations in auth feature after move.

## Verification

```bash
npm run test -- --run src/features/auth
./ci.sh
```

## Out of scope

Auth context provider extraction — not needed today.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-auth-feature
```

```text
test(web): point auth tests at features/auth paths

refactor(web): move auth modules under features/auth
```
