---
name: "Chapter 5 — Farmer tab: add listing"
overview: "The farmer tab's real content: AuthButton plus an 'add listing' trigger button. The form itself is chapter 6's dialog — this chapter only builds the tab surface and the trigger it opens from."
todos:
  - id: farmer-tab-content
    content: "FarmerTab component: AuthButton + add-listing trigger"
    status: pending
isProject: false
---

# Chapter 5 — Farmer tab: add listing

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-farmer-tab-add-listing` · **Status:** planned

**Depends on:** [2](02-component-hygiene.md), [3](03-farmer-buyer-tabs.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4, §7 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Give the farmer tab its real (if minimal) content — sign-in and a clear "post a listing" entry
point — deliberately kept posting-only per
[../gaps-and-decisions.md](../gaps-and-decisions.md) D3, so a signed-out visitor immediately sees
what the farmer tab is for and what to do first.

## Design decisions

**Trigger only, not the form, in this chapter.** The form itself moves into a `Dialog` in chapter
6, which both the farmer tab and (for editing) the future "my listings" seam would open from — so
`FarmerTab` only needs a button and, when signed out, the existing `t("auth.signInRequired")`
messaging (already used by `Home.tsx`'s `PostCta`, `src/routes/Home.tsx:34-43`) in place of the
button. This chapter is deliberately small and independently shippable per invariant 4 — it ships
before chapter 6 exists, rendering a trigger that (until chapter 6 lands) can route to the existing
`/post` page exactly as `Home.tsx`'s `PostCta` does today, then gets rewired to open the dialog
once chapter 6 ships.

**Reuse the existing signed-in/signed-out branching**, don't reinvent it: `FarmerTab` follows the
same `useSession` + conditional pattern as `Home.tsx`'s `PostCta` and `AuthButton.tsx`, just
relocated into the farmer tab's content pane.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/components/FarmerTab.tsx` | `AuthButton` + signed-in "add listing" trigger / signed-out prompt |
| `src/components/FarmerTab.test.tsx` | Tests below |

**Edit:**

| Path | Change |
| --- | --- |
| `src/components/RoleTabs.tsx` | Farmer `Tabs.Content` renders `FarmerTab` instead of the placeholder |
| `src/routes/Home.tsx` | Remove `PostCta` (superseded by `FarmerTab`) once this chapter ships |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| `FarmerTab · shows the sign-in-required message when signed out` | Reuses `auth.signInRequired` |
| `FarmerTab · shows an "add listing" trigger when signed in` | Positive |
| `FarmerTab · renders AuthButton` | Composition |

## Green

1. `FarmerTab` with the `useSession`-gated trigger; tests 1–3.
2. Mount `FarmerTab` in `RoleTabs`' farmer content pane; remove `Home.tsx`'s now-redundant `PostCta`.

## Refactor gate

`FarmerTab` stays presentation-only, same discipline as `RoleTabs` (chapter 3) and `BuyerTab`
(chapter 4). Report the outcome.

## Verification

```bash
npm run test -- --run
./ci.sh
npm run dev
# manual: open the farmer tab signed out, confirm the sign-in prompt; sign in, confirm an
# "add listing" trigger appears
```

## Out of scope

The post-listing form/dialog itself (chapter 6), a "my listings" management view (deferred, see
[../gaps-and-decisions.md](../gaps-and-decisions.md)).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-ui-farmer-tab-add-listing
```

```text
test(web): describe the farmer tab's sign-in and add-listing trigger

feat(web): add FarmerTab with an add-listing entry point
```
