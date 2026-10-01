---
name: "Chapter 12 — Browse data layer"
overview: "Move useGeolocation and useListingsNear to features/browse; add browseApi listings_near wrapper; delete src/hooks/."
todos:
  - id: browse-data
    content: "hooks + browseApi under features/browse"
    status: pending
isProject: false
---

# Chapter 12 — Browse data layer

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-browse-data` · **Status:** planned

**Depends on:** [3](03-listing-types-utils.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Isolate buyer search data fetching under `features/browse/` before moving BuyerTab and MapView UI in
chapter 13.

## Design decisions

**`services/browseApi.ts`** — `fetchListingsNear(center, radiusM)` wrapping `listings_near` RPC (logic from
[useListingsNear.ts](../../../src/hooks/useListingsNear.ts)).

**Hooks:**

- `hooks/useListingsNear.ts` — calls `browseApi`; same public API `{ listings, loading, error }`
- `hooks/useGeolocation.ts` — moved unchanged

**GeoPoint type:** export from `useGeolocation.ts` or `types/geo.ts` — pick one, document in refactor outcome (D open seam).

## Files

**Add:** `src/features/browse/services/browseApi.ts`, hooks, tests moved from `src/hooks/*.test.ts`.

**Edit:** `BuyerTab.tsx` imports (still at old path until ch. 13 — or update in same chapter if BuyerTab already moved; if BuyerTab still in components, only change hook import paths in BuyerTab).

**Delete:** `src/hooks/useListingsNear.ts`, `useGeolocation.ts`, and tests when nothing else imports them.

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `useListingsNear · calls the listings_near RPC with the given center and radius` | RPC args |
| **Negative:** extend hook test or add `useListingsNear · sets error when RPC fails` | `error: true`, listings not stale-success |

If no RPC failure test exists, add one in this chapter (red first).

## Green

1. Implement `browseApi` + wire hook.
2. Move geolocation hook + tests.
3. Update BuyerTab imports; remove `src/hooks/` if empty.

## Refactor gate

Hooks contain no JSX — **single concern each**. Report outcome.

## Verification

```bash
npm run test -- --run src/features/browse/hooks
./ci.sh
```

## Out of scope

BuyerTab container move — chapter 13.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-browse-data
```

```text
test(web): browse hooks and listings_near service tests

refactor(web): move browse data hooks and browseApi into features/browse
```
