---
name: "Chapter 4 — Buyer tab: search and grid"
overview: "Move Home.tsx's radius selector, LocationPicker and AuthButton into the buyer tab content, and replace the vertical Stack of ListingCards with a compact SimpleGrid, wired to the AppShell-level MapView from chapter 1."
todos:
  - id: buyer-tab-content
    content: "BuyerTab component: search controls + AuthButton"
    status: done
  - id: results-grid
    content: "SimpleGrid of ListingCard replacing the results Stack"
    status: done
isProject: false
---

# Chapter 4 — Buyer tab: search and grid

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-buyer-tab-search-and-grid` · **Status:** in review

**Depends on:** [2](02-component-hygiene.md), [3](03-farmer-buyer-tabs.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4, §6 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Give the buyer tab its real content: the existing radius/location search, now living in the panel
instead of the page, and a grid of results instead of a scrolling list — since each result card
carries only a handful of short fields, a screen-height vertical list was never earning the space
it took.

## Design decisions

**Reuse `useGeolocation`/`useListingsNear`/`LocationPicker` unchanged — only their container
changes.** `Home.tsx`'s state and data-fetching logic (`src/routes/Home.tsx:45-54`) moves into a
new `BuyerTab` component nearly as-is; the map itself doesn't move with it, because `MapView`
already lives in `AppShell` as the page background (chapter 1) — `BuyerTab` passes its `listings`/
`selectedId`/`onSelect` up (via a prop or a shared context/hook) to whichever component owns the
background map, rather than rendering a second `MapView` instance. The exact lifting mechanism
(prop-drilling through `AppShell` vs. a small shared hook) is an implementation-time call, not a
front-loaded architecture decision — either is a few lines given how small this component tree is.

**Grid, not list.** The current `Stack` of `ListingCard`s (`src/routes/Home.tsx:96-106`) becomes a
`SimpleGrid` (e.g. `columns={{ base: 1, sm: 2 }}`, `gap="2"`) inside the buyer tab's content pane —
`ListingCard` itself (`src/components/ListingCard.tsx`) is unchanged, since it was already a
self-contained `Card.Root` that tiles fine in a grid cell.

**`AuthButton` renders inside the buyer tab**, replacing the old page-level header instance for
this tab — per [../00-architecture.md §7](../00-architecture.md#7-tabs-and-the-farmer-buyer-split),
each tab is a self-contained mini-app.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/components/BuyerTab.tsx` | Radius + `LocationPicker` + `AuthButton` + results `SimpleGrid` |
| `src/components/BuyerTab.test.tsx` | Tests below |

**Edit:**

| Path | Change |
| --- | --- |
| `src/components/RoleTabs.tsx` | Buyer `Tabs.Content` renders `BuyerTab` instead of the placeholder |
| `src/routes/Home.tsx`, `src/routes/Home.test.tsx` | Removed — see Implementation notes |

**Not edited (see Implementation notes):** `src/components/AppShell.tsx` — the
`listings`/`selectedId`/`onSelect` lifting this row anticipated was already built in chapter 1 as
`BackgroundMapProvider`/`usePublishBackgroundMap` (`src/components/BackgroundMap.tsx`), which
`Home.tsx` was already using. `BuyerTab` calls `usePublishBackgroundMap` exactly as `Home.tsx` did;
`AppShell.tsx` itself needed no change.

**Also edited (not originally planned, see Implementation notes):** `src/App.test.tsx`,
`src/components/AppShell.test.tsx`, `src/components/RoleTabs.test.tsx` — each now mocks `BuyerTab`.

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| `BuyerTab · renders the radius selector and location picker` | Structure |
| `BuyerTab · renders listings in a grid, not a single-column stack` | Layout query (e.g. grid container role/class) |
| `BuyerTab · selecting a listing card calls onSelect with its id` | Interaction, same contract `Home.tsx` had |
| `BuyerTab · shows the empty state when there are no listings in range` | Existing `home.empty` copy, still used |

## Green

1. `BuyerTab` composed from the same hooks `Home.tsx` used, with a `SimpleGrid` instead of `Stack`;
   tests 1, 2, 4.
2. Wire `onSelect`/`selectedId` between `BuyerTab` and the background `MapView` via `AppShell`;
   test 3.
3. Mount `BuyerTab` in `RoleTabs`' buyer content pane (from chapter 3).

## Refactor gate

`BuyerTab` stays under ~100 LOC by delegating to the existing hooks/components rather than inlining
fetch or geolocation logic — same discipline `Home.tsx` already had. Report the outcome.

**Outcome:** `BuyerTab.tsx` is 117 lines total (imports and the `RADIUS_OPTIONS` table account for
about a third of that), matching `Home.tsx`'s own shape before it was removed. The default export
is ~24 lines and delegates entirely to `useGeolocation`/`useListingsNear`/`usePublishBackgroundMap`/
`LocationPicker`/`AuthButton`; two small presentational helpers (`RadiusSelect`, `ResultsGrid`) stay
in the same file rather than splitting into their own, following the precedent already set by
`Home.tsx`'s `PostCta` and `LocationPicker.tsx`'s own inline helpers. No branch has a third
conditional arm, no nesting beyond one level. No refactor needed.

## Implementation notes

**The "lifting mechanism" this chapter's design section left open was already built in chapter
1.** `BackgroundMap.tsx`'s `BackgroundMapProvider`/`usePublishBackgroundMap`/`useBackgroundMapState`
(added for `Home.tsx`, still live on `main`) is exactly the "small shared hook" the design decisions
section described as an implementation-time call — `AppShell`'s `BackgroundMap` component already
reads `useBackgroundMapState()` to feed `MapView`. `BuyerTab` only had to call
`usePublishBackgroundMap` the same way `Home.tsx` did; no new wiring, and no `AppShell.tsx` change,
was needed.

**`Home.tsx` was dead code by the time this chapter started, not just supersedable.** Chapter 3's
implementation notes record that `App.tsx` stopped threading route content through `AppShell` as
`children` — every route (`/`, `/post`, `/listings/:id`) has mounted `AppShell` directly, with no
route referencing `Home` at all, since that chapter merged. `BuyerTab` fully supersedes `Home.tsx`'s
content per the plan's own Files table, so this chapter removes `Home.tsx` and `Home.test.tsx`
outright rather than trimming — there was nothing reachable left to trim down to.

**Mounting a real, hook-driven `BuyerTab` inside `RoleTabs` required mocking it in three test files
that weren't in this chapter's plan.** `RoleTabs.test.tsx`, `AppShell.test.tsx`, and `App.test.tsx`
all render `RoleTabs` (directly or transitively) without previously needing to mock anything beyond
`MapView`, because the buyer tab's content was static placeholder text. Once it renders `BuyerTab`,
those same tests transitively mount `useSession`, `useGeolocation`, and `useListingsNear` for real —
the last two are harmless, but `useSession` and `AuthButton` reach the real `supabaseClient`, which
makes an actual network call to whatever project `.env.local` points at. That call happened to
resolve fast enough not to fail these tests locally, but it's not something a unit test for tab
switching or panel chrome should depend on. Each of the three files now mocks `./BuyerTab` (or
`./components/BuyerTab` from `App.test.tsx`), the same isolation pattern `AppShell.test.tsx` already
used for `MapView` — `BuyerTab`'s own behavior is covered by `BuyerTab.test.tsx` instead.

## Verification

```bash
npm run test -- --run
./ci.sh
npm run dev
# manual: open localhost, confirm the buyer tab shows the radius selector, a location search, and
# a grid (not a single column) of nearby listings, and clicking a card highlights its map pin
```

Manually verified in a running `npm run dev` session: opening the menu shows the buyer tab with the
auth button, radius selector (5/15/30 km), and location search; with no listings within range the
existing `home.empty` copy renders in place of the grid. (The dev database had no listings within
30 km of the fallback Berlin center at verification time, so the populated-grid path was confirmed
via `BuyerTab.test.tsx` instead of manually — same coverage the automated layout/interaction tests
already give the `SimpleGrid` and card-selection contract.)

## Out of scope

Opening a listing's detail (chapter 6 — grid cards currently only `onSelect` to highlight the map
pin, same as today), the farmer tab (chapter 5).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-ui-buyer-tab-search-and-grid
```

```text
test(web): describe the buyer tab's search controls and results grid

feat(web): add BuyerTab with a compact SimpleGrid of listings
```
