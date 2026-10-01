---
name: "Chapter 1 — @/ import alias"
overview: "Add Vite and TypeScript path mapping for @/* → src/* and migrate one existing pure module import to prove the alias works. No feature moves."
todos:
  - id: vite-tsconfig
    content: "paths in tsconfig + vite resolve.alias"
    status: pending
  - id: sample-import
    content: "One production + test import via @/"
    status: pending
isProject: false
---

# Chapter 1 — @/ import alias

**Repo:** `eggs` (root) · **Branch:** `feat/eggs-fs-import-alias` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §9 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Later chapters move dozens of files; without a root alias, imports become deep `../../` chains that are
error-prone in review. This chapter wires `@/` once and validates it with a minimal, behavior-neutral
import change.

## Design decisions

**Map `@/*` to `./src/*`** in both [tsconfig.json](../../../tsconfig.json) (`compilerOptions.paths`) and
[vite.config.ts](../../../vite.config.ts) (`resolve.alias`), so Vitest, Vite, and `tsc` agree.

**Pilot import on a pure module** — e.g. change [src/i18n/t.test.ts](../../../src/i18n/t.test.ts) to
`import { t } from "@/i18n/t"` (or change [main.tsx](../../../src/main.tsx) to import `App` via `@/app/App`
only after chapter 14 — for this chapter, limit to `t` or `getSupabaseEnv` in one test file). Do not move
feature folders yet.

**Negative path:** wrong `@/foo/bar` specifiers fail at `npm run typecheck` — no new runtime test; the
existing typecheck step in `./ci.sh` is the negative gate.

## Files

**Edit:**

| Path | Change |
| --- | --- |
| `tsconfig.json` | `"paths": { "@/*": ["./src/*"] }` |
| `vite.config.ts` | `resolve.alias: { "@": path.resolve(__dirname, "src") }` (add `path` import) |
| One of `src/i18n/t.test.ts` or `src/lib/env.test.ts` | Import SUT via `@/…` |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** existing test file runs after switching SUT import to `@/…` | Vitest resolves alias (e.g. `t.test.ts` still passes) |
| **Negative:** `npm run typecheck` with a deliberate typo `@/i18n/missing` in a scratch commit is rejected | Typecheck fails (verify locally, do not merge the typo) |

Before green, the happy-path test may fail with "Cannot find module '@/…'" until alias config lands.

## Green

1. Add tsconfig + Vite alias configuration.
2. Update the pilot test import; run `npm run test -- --run src/i18n/t.test.ts` (or env test).

## Refactor gate

No components touched — **no refactor needed** for UI units. Report outcome in chapter doc on merge.

## Verification

```bash
npm run typecheck
npm run test -- --run
./ci.sh
```

## Out of scope

Bulk `@/` migration of the tree — later chapters convert imports as files move.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-import-alias
```

```text
test(web): import t via @/ in unit test

chore(web): add @/ path alias in vite and tsconfig
```
