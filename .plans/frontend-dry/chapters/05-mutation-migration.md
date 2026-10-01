---
name: "Chapter 5 — Mutation migration"
overview: "Wire ReserveButton, SellerActions, and PostListing submit through useAsyncAction."
todos:
  - id: mutations
    content: "replace local busy/error state with useAsyncAction"
    status: pending
isProject: false
---

# Chapter 5 — Mutation migration

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-dry-mutation-migration` · **Status:** planned

**Depends on:** [4](04-use-async-action.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Remove duplicated `busy` / `error` state machines from mutation UIs; keep labels, disabled rules, and RPC names
identical.

## Design decisions

**ReserveButton:** replace local `busy`/`error` and `callRpc` with `useAsyncAction().run`; keep `ReserveActionButton`
presentational.

**SellerActions:** one shared `useAsyncAction` per sub-component (`MarkStatusActions`, `ExpiryEditor`) or one per
`SellerActions` tree — prefer **per sub-component** so sold/cancelled and expiry saves don’t share busy state.

**PostListing:** replace `submitting`/`submitError` with `useAsyncAction` (or map `busy` → `submitting` in JSX for
minimal test diff).

Use `listingsApi` helpers when [frontend-structure ch. 5](../frontend-structure/chapters/05-listing-write-services.md)
exists; else inline supabase in action closure.

## Files

**Edit:**

| Path | Change |
| --- | --- |
| `src/components/ReserveButton/ReserveButton.tsx` | `useAsyncAction` |
| `src/components/SellerActions.tsx` (or folder) | `useAsyncAction` |
| `src/routes/PostListing.tsx` | submit via `useAsyncAction` |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `ReserveButton · shows "Reserve" and calls the reserve_listing RPC on click` | Still fires RPC |
| **Negative:** `PostListing · shows the field validation message` — submit with invalid form does not call RPC | Validation gate unchanged |

Existing SellerActions RPC tests remain regression.

## Green

1. Migrate three call sites.
2. Run ReserveButton, PostListing, SellerActions tests.

## Refactor gate

If SellerActions still inline two components, split is **frontend-structure ch. 8** — this chapter only swaps async
state. Report outcome.

## Verification

```bash
npm run test -- --run src/components/ReserveButton src/components/SellerActions.test.tsx src/routes/PostListing.test.tsx
./ci.sh
```

## Out of scope

Read hooks — chapter 3.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-dry-mutation-migration
```

```text
test(web): post listing validation still blocks RPC on invalid input

refactor(web): use useAsyncAction for reserve, seller, and post mutations
```
