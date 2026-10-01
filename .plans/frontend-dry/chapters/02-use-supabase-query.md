---
name: "Chapter 2 — useSupabaseQuery"
overview: "Shared hook for mount fetch with cancellation and optional refetch token."
todos:
  - id: hook
    content: "lib/async/useSupabaseQuery.ts + tests"
    status: pending
isProject: false
---

# Chapter 2 — useSupabaseQuery

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-dry-use-supabase-query` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §4, D1 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Replace copy-pasted `useEffect` + `cancelled` + loading state with one tested hook used by read paths in chapter 3.

## Design decisions

**Signature (illustrative):**

```ts
function useSupabaseQuery<T>(
  key: unknown[],
  fetcher: () => Promise<T>,
  options?: { initialData?: T },
): { data: T | null; loading: boolean; error: boolean; refetch: () => void };
```

- On fetch rejection or thrown error, set `error: true` and `data` unchanged or null per caller.
- `refetch` bumps an internal token included in `key` dependency array (same pattern as `useListing`’s
  `reloadToken`).
- Fetcher is responsible for calling Supabase or `listingsApi` — hook does not import `supabaseClient`.

**Not** a cache — each mount refetches; no stale-time.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/lib/async/useSupabaseQuery.ts` | hook |
| `src/lib/async/useSupabaseQuery.test.ts` | unit tests with mocked fetcher |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** resolves data and sets loading false after fetcher resolves | |
| **Negative:** sets error true when fetcher rejects; does not leave loading true forever | |
| **Negative:** after unmount, fetcher resolution does not update state (cancelled) | use `renderHook` + unmount |

## Green

1. Implement hook; tests green.
2. No production callers yet — chapter 3 migrates.

## Refactor gate

Hook body stays one effect + refetch helper — **extract only if > ~40 LOC**. Report outcome.

## Verification

```bash
npm run test -- --run src/lib/async/useSupabaseQuery.test.ts
./ci.sh
```

## Out of scope

Migrating existing hooks — chapter 3.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-dry-use-supabase-query
```

```text
test(web): useSupabaseQuery loading, error, and cancel behavior

feat(web): add useSupabaseQuery for shared mount fetch lifecycle
```
