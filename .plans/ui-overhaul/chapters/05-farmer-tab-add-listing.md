---
name: "Chapter 5 — Farmer tab: add listing"
overview: "The farmer tab's real content: AuthButton plus an 'add listing' trigger button. The form itself is chapter 6's dialog — this chapter only builds the tab surface and the trigger it opens from."
todos:
  - id: farmer-tab-content
    content: "FarmerTab component: AuthButton + add-listing trigger"
    status: done
isProject: false
---

# Chapter 5 — Farmer tab: add listing

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-farmer-tab-add-listing` · **Status:** in review

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

**Not edited (see Implementation notes):** `src/routes/Home.tsx` — already removed by chapter 4.

**Also edited (not originally planned, see Implementation notes):** `src/components/RoleTabs.test.tsx`,
`src/components/AppShell.test.tsx`, `src/App.test.tsx` — each now mocks `FarmerTab`.

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

**Outcome:** `FarmerTab.tsx` is 28 lines total. The default export is 9 lines and delegates to
`AuthButton` and a small `AddListingTrigger` presentational helper (mirroring `Home.tsx`'s old
`PostCta`, which this component's signed-in/signed-out branch is a direct port of). One
conditional branch, no nesting beyond one level. No refactor needed.

## Implementation notes

**`src/routes/Home.tsx` was already gone by the time this chapter started.** Chapter 4 removed it
outright (its buyer-facing content became `BuyerTab`), so the "remove `PostCta`" file-table entry
this chapter's plan called for was already satisfied — there was nothing left in `Home.tsx` to
edit. `FarmerTab`'s `AddListingTrigger` helper ports `PostCta`'s signed-in/signed-out branch
(`Button asChild` + `RouterLink to="/post"` reusing `nav.postListing`, vs. the existing
`auth.signInRequired` text) from `Home.tsx`'s last version in git history, keeping the same
"route to `/post`, rewired to the chapter 6 dialog later" behavior the design section called for.

**Mounting a real `FarmerTab` (which calls `useNavigate`'s underlying router context via
`RouterLink`) inside `RoleTabs` required mocking it in the same three test files chapter 4 mocked
`BuyerTab` in.** `RoleTabs.test.tsx` and `AppShell.test.tsx` render `RoleTabs`/`AppShell` without a
`MemoryRouter` wrapper, so a real `FarmerTab` would throw for lacking router context; `App.test.tsx`
does wrap `MemoryRouter` but was already isolating tab content via mocks. Each now mocks
`./FarmerTab` (or `./components/FarmerTab`), the same pattern already applied to `BuyerTab` —
`FarmerTab`'s own behavior is covered by `FarmerTab.test.tsx` instead.

## Verification

```bash
npm run test -- --run
./ci.sh
npm run dev
# manual: open the farmer tab signed out, confirm the sign-in prompt; sign in, confirm an
# "add listing" trigger appears
```

Manually verified in a running `npm run dev` session: opening the menu and switching to the farmer
tab, signed out, shows the auth button and the `auth.signInRequired` copy ("Bitte melde dich an, um
ein Angebot einzustellen."). The signed-in path needs a real Google OAuth round-trip that isn't
practical to drive manually in this environment, so it's covered by
`FarmerTab.test.tsx`'s `shows an "add listing" trigger when signed in` test instead — same tradeoff
chapter 4 made for its populated-grid path.

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
