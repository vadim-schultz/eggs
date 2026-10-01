---
name: "Chapter 6 — Reserve button"
overview: "Move ReserveButton folder to features/listings/components; extract useActiveReservation to hooks/; update imports; delete old path."
todos:
  - id: reserve-move
    content: "move folder + extract hook"
    status: pending
isProject: false
---

# Chapter 6 — Reserve button

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-reserve-button` · **Status:** planned

**Depends on:** [2](02-auth-feature.md), [3](03-listing-types-utils.md), [5](05-listing-write-services.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Keep the existing nested `ReserveButton/` layout (barrel + `ReserveActionButton`) under the listings feature
and move data fetching into `hooks/useActiveReservation.ts`.

## Design decisions

**Preserve barrel** — `index.ts` re-exports default `ReserveButton` and named parts as today.

**Hook** encapsulates the active reservation query currently inside [ReserveButton.tsx](../../../src/components/ReserveButton/ReserveButton.tsx); button component calls `useActiveReservation(listingId, enabled)` and `listingsApi` for mutations (from chapter 5).

## Files

**Add/move:**

| Path | Purpose |
| --- | --- |
| `src/features/listings/components/ReserveButton/*` | entire folder from `src/components/ReserveButton/` |
| `src/features/listings/hooks/useActiveReservation.ts` | extracted hook |
| `src/features/listings/hooks/useActiveReservation.test.ts` | optional unit test for enabled/disabled fetch |

**Edit:** `ListingDetail` import path.

**Delete:** `src/components/ReserveButton/`.

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `ReserveButton · shows "Reserve" and calls the reserve_listing RPC on click when active and signed in` | Behavior unchanged at new path |
| **Negative:** `ReserveButton · shows "Sign in to reserve" with no session` | Signed-out guard unchanged |

## Green

1. Move folder; extract hook; wire ReserveButton.
2. Update imports; delete old directory.
3. Run `ReserveButton.test.tsx`.

## Refactor gate

ReserveButton file should only compose hook + `ReserveActionButton` — **no inline hook function left**.
Report outcome.

## Verification

```bash
npm run test -- --run src/features/listings/components/ReserveButton
./ci.sh
```

## Out of scope

ListingDetail view split — chapter 9.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-reserve-button
```

```text
test(web): reserve button tests under features/listings

refactor(web): move ReserveButton and extract useActiveReservation
```
