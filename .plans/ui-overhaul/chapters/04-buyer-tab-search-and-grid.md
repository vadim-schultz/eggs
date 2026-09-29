---
name: "Chapter 4 — Buyer tab: search and grid"
overview: "Move Home.tsx's radius selector, LocationPicker and AuthButton into the buyer tab content, and replace the vertical Stack of ListingCards with a compact SimpleGrid, wired to the AppShell-level MapView from chapter 1."
todos:
  - id: buyer-tab-content
    content: "BuyerTab component: search controls + AuthButton"
    status: pending
  - id: results-grid
    content: "SimpleGrid of ListingCard replacing the results Stack"
    status: pending
isProject: false
---

# Chapter 4 — Buyer tab: search and grid

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-buyer-tab-search-and-grid` · **Status:** planned

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
| `src/components/AppShell.tsx` | Owns/receives the `listings`/`selectedId`/`onSelect` state `MapView` and `BuyerTab` both need |
| `src/routes/Home.tsx` | Trimmed to whatever remains needed for the `/` route wrapper, or removed if `BuyerTab` fully supersedes it (confirm against chapter 6's routing needs first) |

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

## Verification

```bash
npm run test -- --run
./ci.sh
npm run dev
# manual: open localhost, confirm the buyer tab shows the radius selector, a location search, and
# a grid (not a single column) of nearby listings, and clicking a card highlights its map pin
```

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
