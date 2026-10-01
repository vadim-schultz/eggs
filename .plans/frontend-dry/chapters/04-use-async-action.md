---
name: "Chapter 4 — useAsyncAction"
overview: "Shared busy/error wrapper for async RPC and update handlers."
todos:
  - id: hook
    content: "lib/async/useAsyncAction.ts + tests"
    status: pending
isProject: false
---

# Chapter 4 — useAsyncAction

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-dry-use-async-action` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) D2 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

One hook for the repeated `setBusy(true)` → async work → `setBusy(false)` → error flag → success callback pattern.

## Design decisions

**Signature (illustrative):**

```ts
function useAsyncAction(): {
  busy: boolean;
  error: boolean;
  run: (action: () => Promise<{ ok: true } | { ok: false }>) => Promise<void>;
  resetError: () => void;
};
```

- `run` sets `error` false at start; on `{ ok: false }` sets `error` true; does not throw to caller.
- Callers map supabase `{ error }` to `{ ok: false }` inside the action closure.

Alternative name `useRpcAction` acceptable if scope stays RPC/update only.

## Files

**Add:** `src/lib/async/useAsyncAction.ts`, `useAsyncAction.test.ts`

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `run` sets busy during promise, clears busy after, leaves error false on ok | |
| **Negative:** `run` sets error true when action returns `{ ok: false }` | |

## Green

1. Implement + unit tests.
2. No production wiring until chapter 5.

## Refactor gate

**No refactor needed** — single small hook. Report outcome.

## Verification

```bash
npm run test -- --run src/lib/async/useAsyncAction.test.ts
./ci.sh
```

## Out of scope

Wiring ReserveButton / SellerActions — chapter 5.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-dry-use-async-action
```

```text
test(web): useAsyncAction busy and error states

feat(web): add useAsyncAction for shared mutation UX
```
