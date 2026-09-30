---
name: "Chapter 3 — Farmer/buyer tabs"
overview: "A RoleTabs component inside the floating panel's body: Chakra Tabs, variant enclosed, left tab 🧑‍🌾 farmer / right tab 👨🏻‍💼 buyer, each with placeholder content wired up for real in chapters 4 and 5."
todos:
  - id: role-tabs
    content: "RoleTabs component with enclosed Tabs.Root and two triggers"
    status: done
  - id: i18n-labels
    content: "Tab label strings through t(key)"
    status: done
isProject: false
---

# Chapter 3 — Farmer/buyer tabs

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-farmer-buyer-tabs` · **Status:** in review

**Depends on:** [1](01-floating-panel-shell.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4, §7 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Put the farmer/buyer split the whole redesign is organized around into the panel, so chapters 4 and
5 each have exactly one place to render their content into.

## Design decisions

**`RoleTabs` is a dumb container in this chapter.** `Tabs.Root variant="enclosed"` with two
`Tabs.Trigger`s (🧑‍🌾 + `t("tabs.farmer")`, 👨🏻‍💼 + `t("tabs.buyer")`) and two `Tabs.Content`
panes, each rendering a placeholder (`<Text>{t("common.comingSoon")}</Text>` — an existing key,
`src/i18n/strings.de.ts`) until chapters 4 and 5 fill them in. This keeps chapter 3 verifiable and
shippable on its own (invariant 4 in [../01-rollout.md](../01-rollout.md)) without needing the
search/grid or posting logic to exist yet.

**Emoji + text label, not emoji alone** — see
[../gaps-and-decisions.md](../gaps-and-decisions.md) D4.

**Default tab is the buyer tab.** Browsing is what an anonymous visitor does first (same "browsing
needs no login" principle as `.plans/mvp/00-architecture.md` §7) — posting requires being signed in
as a farmer, so it shouldn't be the first thing a new visitor sees.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/components/RoleTabs.tsx` | `Tabs.Root` with farmer/buyer triggers and content panes |
| `src/components/RoleTabs.test.tsx` | Tests below |

**Edit:**

| Path | Change |
| --- | --- |
| `src/components/AppShell.tsx` | Render `RoleTabs` (instead of raw `children`) inside `Popover.Body` — see Implementation notes for why this is `Popover.Body` and not `FloatingPanel.Body` |
| `src/i18n/strings.de.ts` | Add `tabs.farmer`, `tabs.buyer` keys |

**Edit (not originally planned, see Implementation notes):**

| Path | Change |
| --- | --- |
| `src/App.tsx` | Each route mounts `AppShell` directly instead of threading page content through it as `children` |
| `src/App.test.tsx` | Assert the farmer/buyer tabs render at each route, not the old per-route page content |
| `src/components/AppShell.test.tsx` | Drop the two tests asserting on `children`; add coverage for the tabs rendering in the popover body |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| `RoleTabs · renders a farmer tab and a buyer tab trigger` | Structure |
| `RoleTabs · defaults to the buyer tab's content visible` | Default state |
| `RoleTabs · clicking the farmer tab shows farmer content and hides buyer content` | Interaction |

## Green

1. `strings.de.ts` — add the two tab-label keys.
2. `RoleTabs` with `Tabs.Root variant="enclosed"`, two triggers, two content panes; tests 1–3.
3. Wire `RoleTabs` into `AppShell`.

## Refactor gate

`RoleTabs` stays presentation-only — no data fetching, no auth checks; those belong to chapters 4
and 5's content.

**Outcome:** `RoleTabs` is ~20 LOC, one `Tabs.Root` with two triggers and two placeholder
`Tabs.Content` panes, no branching, no state of its own beyond what `Tabs.Root`'s `defaultValue`
already gives it for free. No refactor needed.

## Implementation notes

**`Popover.Body`, not `FloatingPanel.Body`.** The architecture doc and this chapter's own design
section were written against chapter 1's original `FloatingPanel` shell, but a later,
out-of-plan chapter (`feat/eggs-ui-popover-menu-button`, merged before this one) replaced the
always-open `FloatingPanel` with a burger-style `Popover` triggered by the round 🪺 button —
`AppShell.tsx`'s actual body slot by the time this chapter started was `Popover.Body`. `RoleTabs`
itself doesn't care which shell it sits in, so this chapter just targets the shell that actually
exists on `main` today instead of the one originally planned.

**`AppShell` stops rendering `children`, so `App.tsx`'s routes no longer thread page content
through it.** The design decision above is explicit that opening the panel shows *only* the two
placeholder tab panes — manual verification asks for exactly that ("switching tabs swaps the
(placeholder) content", nothing else). That's incompatible with `AppShell` continuing to render
whatever `Routes` element `App.tsx` passes it as `children`, which is what let `Home`'s live search
and `PostListing`'s form show up inside the panel before this chapter. Keeping `children` around
unused (to avoid touching `App.tsx`) would leave dead scaffolding sitting in `AppShellProps`, so
`AppShell` dropped the prop entirely: `App.tsx` now mounts `AppShell` directly on each of `/`,
`/post`, and `/listings/:id`, so all three keep resolving as valid routes (no 404, satisfying the
"kept, not removed" half of `../00-architecture.md` §8 / D2), but none of them shows page-specific
content yet — that arrives when chapters 4 and 5 wire real content into the tabs, and chapter 6
gives `AppShell` a way to read the current route and open a dialog. `Home.tsx`, `PostListing.tsx`,
`ListingDetail.tsx`, and `RequireAuth.tsx` are untouched and keep their own test coverage; they're
just not wired into anything reachable from the UI until those later chapters. This was confirmed
with the user before implementing, since it breaks three existing `App.test.tsx` assertions and one
`AppShell.test.tsx` assertion that depended on the old pass-through behavior — those tests were
updated to assert the new (intended) behavior rather than removed.

**Interaction assertions need `findByRole`/`waitFor`, not a synchronous `getByRole` after
`fireEvent.click`.** Both Ark UI's `Tabs` (selecting a tab) and its `Popover` (opening) update their
underlying Zag.js machine state asynchronously under React 18 in this test environment — the DOM
update lands a microtask after the click, so a query that's sensitive to computed visibility
(`getByRole`, which excludes inaccessible elements) can run before that update commits and report
the state as unchanged, even though a visibility-insensitive query like `getByText` on the same
render would already succeed. `RoleTabs.test.tsx`'s click test and both `AppShell.test.tsx`/
`App.test.tsx` tests that query a `tab` role after opening the menu now `await` that update instead
of asserting immediately.

## Verification

```bash
npm run test -- --run
./ci.sh
npm run dev
# manual: open localhost, confirm the panel shows two enclosed tabs with the farmer/buyer emoji,
# defaulting to the buyer tab, and switching tabs swaps the (placeholder) content
```

## Out of scope

Real farmer/buyer tab content (chapters 4, 5), dialogs (chapter 6).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-ui-farmer-buyer-tabs
```

```text
test(web): describe the RoleTabs farmer/buyer switch

feat(web): add the enclosed farmer/buyer tabs inside the floating panel
```
