---
name: "Chapter 6 — Detail and post dialogs"
overview: "Convert PostListing and ListingDetail into Chakra Dialog content, opened from the farmer tab's add-listing trigger and from buyer-tab grid card clicks. /post and /listings/:id keep working as deep links by opening the same dialog on load."
todos:
  - id: post-dialog
    content: "PostListing content inside a Dialog, opened from FarmerTab"
    status: done
  - id: detail-dialog
    content: "ListingDetail content inside a Dialog, opened from a grid card click"
    status: done
  - id: deep-link-open
    content: "/post and /listings/:id open the matching dialog on load"
    status: done
isProject: false
---

# Chapter 6 — Detail and post dialogs

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-detail-and-post-dialogs` · **Status:** in review

**Depends on:** [4](04-buyer-tab-search-and-grid.md), [5](05-farmer-tab-add-listing.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §8 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Finish the move away from full-page navigation: posting and viewing a listing's detail happen in a
dialog over the floating panel, while a shared `/listings/:id` link or a bookmark of `/post` still
opens the app to the right place — the last structural piece the redesign needs (per
[../gaps-and-decisions.md](../gaps-and-decisions.md) D2).

## Design decisions

**The existing components move, their internals don't.** `PostListing.tsx`'s form fields and
`ListingDetail.tsx`'s composition of `StatusBadge`/`ReserveButton`/`ContactReveal`/`SellerActions`
are unchanged; only their outer element changes from a page-level `<Stack p="4">` wrapper to
`Dialog.Content`/`Dialog.Body`. Submit/close behavior changes from `navigate(...)` to closing the
dialog (and, for a successful post, opening the new listing's detail dialog in its place — the
equivalent of today's `navigate(\`/listings/\${data.id}\`)`).

**Routes stay mounted, but only to open a dialog.** `App.tsx`'s `/post` and `/listings/:id` routes
continue to exist and render `AppShell`, but instead of a full-page component, their route element
sets "this dialog is open" state (e.g. via a small `useParams`-driven effect) so `AppShell` opens
the matching dialog on mount. Closing the dialog calls `navigate("/", { replace: true })` so the
URL returns to `/` — mirroring how `RequireAuth` already uses `<Navigate>` for a similar
"URL reflects a transient state" pattern.

**One dialog primitive, two contents.** A single reusable wrapper (e.g.
`src/components/AppDialog.tsx`, a thin `Dialog.Root`/`Positioner`/`Content` shell) hosts either
`PostListing` or `ListingDetail` content, rather than two bespoke dialog implementations — keeps
close/backdrop/escape behavior consistent between the two.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/components/AppDialog.tsx` | Shared `Dialog.Root`/`Positioner`/`Content` wrapper |
| `src/components/AppDialog.test.tsx` | Tests below |

**Also added (not originally planned, see Implementation notes):**

| Path | Purpose |
| --- | --- |
| `src/components/AppDialogState.tsx` | Dialog-open context/provider (`open`, `openPostDialog`, `openDetailDialog`, `closeDialog`), including the deep-link-open effect |

**Edit:**

| Path | Change |
| --- | --- |
| `src/routes/PostListing.tsx` | Outer wrapper → dialog content; submit calls `onCreated(id)` instead of `navigate`; dropped its own session guard (moved to where the dialog can actually be opened — see Implementation notes) |
| `src/routes/ListingDetail.tsx` | Outer wrapper → dialog content; takes `id` as a prop instead of reading `useParams` itself |
| `src/App.tsx` | Not edited — see Implementation notes |
| `src/components/AppShell.tsx` | Wraps its tree in `AppDialogProvider` and hosts the open `AppDialog` (post or detail), on top of the floating panel |
| `src/components/BuyerTab.tsx` | Grid card click (and map-pin click, since both already shared one handler) opens the detail dialog |
| `src/components/FarmerTab.tsx` | "Add listing" trigger opens the post dialog instead of routing to `/post` |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| `AppDialog · renders its content when open, nothing when closed` | Base behavior |
| `App · loading /listings/:id opens the detail dialog for that listing` | Deep-link entry |
| `App · loading /post while signed in opens the post dialog` | Deep-link entry |
| `App · closing the detail dialog navigates back to /` | URL reflects closed state |
| `PostListing (dialog) · a successful submit opens the detail dialog for the new listing` | Replaces the old `navigate` assertion from chapter 4 of `.plans/mvp/` |

## Green

1. `AppDialog` wrapper; test 1.
2. Route-driven open state in `App.tsx`/`AppShell`; tests 2–4.
3. Rewire `PostListing`'s submit handler and `BuyerTab`/`FarmerTab`'s triggers; test 5.

## Refactor gate

`AppDialog` stays a thin structural wrapper — no listing-specific logic lives in it; that stays in
`PostListing`/`ListingDetail` exactly as before. Report the outcome.

**Outcome:** `AppDialog.tsx` is 34 lines: `Dialog.Root`/`Backdrop`/`Positioner`/`Content`/
`CloseTrigger`/`Body`, wired to one `open`/`onClose` pair. It owns the entire Chakra `Dialog`
namespace itself (including `Dialog.Body`) rather than leaving `Body` to its content components —
see Implementation notes for why. `AppDialogState.tsx`'s two non-component exports
(`useDeepLinkDialog`, ~10 lines; `AppDialogProvider`, ~15 lines) each stay under the Sandi Metz
method-size guideline, one conditional branch each (or two, for `AppShell.tsx`'s `DialogContent`
dispatcher), no nesting beyond one level. No refactor needed.

## Implementation notes

**A new `AppDialogState.tsx` was added, beyond the plan's file table.** The plan's `Files` list
only names `AppDialog.tsx` (the presentational wrapper) but doesn't say where the "which dialog is
open" state itself should live. `FarmerTab.tsx`/`BuyerTab.tsx` need to trigger it (open) and
`AppShell.tsx` needs to render it, but neither is an ancestor of the other in a way that supports
simple prop-drilling — `RoleTabs.tsx`, which sits between them, isn't in the plan's edit list
either. This codebase already has exactly this shape of problem solved once, for the background
map (`BackgroundMap.tsx`: a provider + a `usePublishBackgroundMap` hook consumed from `BuyerTab`,
consumed for rendering in `AppShell`), so `AppDialogState.tsx` follows the same pattern instead of
inventing a new one or bloating `AppShell.tsx` with context wiring. `App.tsx` needed no code change
at all: it already rendered `AppShell` for all three routes (a prior chapter's groundwork), and
`useParams`/`useLocation` work from any descendant of the matched route, not just the route's
direct element, so `AppDialogState.tsx`'s deep-link effect reads them straight from within the
`AppShell` tree.

**`AppDialog` owns `Dialog.Body`, not `PostListing`/`ListingDetail`.** The plan's design section
describes the outer wrapper changing "to `Dialog.Content`/`Dialog.Body`", which reads as if the
content components themselves would render `Dialog.Body`. That turned out to be impractical:
Chakra's `Dialog.Body` (like every dialog part) reads its styles from a slot-recipe context that
only exists under a real, mounted `Dialog.Root` — calling it standalone throws
("`useDialogStyles` returned 'undefined'. Seems you forgot to wrap the components in `<Dialog.Root
/>`"), which would force every `PostListing`/`ListingDetail` unit test to mount a full `Dialog.Root`
just to satisfy that context. Instead, `AppDialog` wraps whatever `children` it's given in
`Dialog.Body` itself, and `PostListing`/`ListingDetail` keep plain `Stack` roots (dropping their old
page-level `p="4"`/`maxW="md"`, since a dialog already constrains that) — still "outer wrapper
changes, internals don't" at the composed-DOM level, just drawn at a different component boundary
than the plan's wording implied. This is also why `AppDialog`'s own test needed two separate mounts
rather than one `rerender` toggling `open`: the underlying Ark-UI/zag-js dialog machine syncs
prop-driven `open` changes through a `queueMicrotask`-deferred internal `send`, so a rendered
dialog's `open` flips only after a flushed microtask (`await act(async () => {})`), while a fresh
mount's initial `open` value applies synchronously. `App.test.tsx`'s "closing the detail dialog"
test needed the same `await act(async () => {})` after the close-button click for the same reason.

**`PostListing`'s session guard moved out, rather than porting `<Navigate to="/" replace />` as-is.**
A redirect-on-render guard fits a full-page route; it doesn't fit dialog content that a parent
decides whether to mount at all. The signed-out case is now handled at the two places that can
actually open the post dialog: `FarmerTab`'s `AddListingTrigger` only renders the (clickable)
trigger when signed in (already true before this chapter), and `AppDialogState`'s deep-link effect
only opens the post dialog for `/post` when `useSession()` reports a session. `PostListing` itself
dropped `useSession`/`useNavigate` entirely — it no longer has a reason to know about auth state.
One behavioral consequence: visiting `/post` signed out no longer redirects to `/`; it just leaves
the app on `/post` with no dialog open (same as visiting any other unrecognized state) rather than
bouncing the URL. Not covered by a red test in the plan, and not the behavior the removed
`PostListing.test.tsx` redirect test was asserting.

**`BuyerTab`'s grid-card click and its map-pin click share one handler on purpose.** The plan's
wording ("in addition to/instead of the existing map-pin `onSelect`") left this open. Both entry
points already funneled through the same `onSelect`/`setSelectedId` callback before this chapter
(`ResultsGrid`'s `onSelect` and `usePublishBackgroundMap`'s `onSelect` were the same function), so
splitting them would have been the bigger change; unifying them means picking a listing either way
now opens its detail, which reads as the more coherent map+list interaction.

**Test updates beyond the plan's red-test list:** `FarmerTab.test.tsx`'s trigger assertion changed
from `getByRole("link", ...)` to `getByRole("button", ...)` (it's a click handler now, not a
`RouterLink`), plus a new test asserting the click calls `openPostDialog`. `PostListing.test.tsx`
dropped all router/session mocking (no longer needed) and renamed/reworked the old
`navigateMock`-based submit assertion into an `onCreated` assertion. `ListingDetail.test.tsx`
dropped its `MemoryRouter`/`Routes` wrapping (renders `<ListingDetail id="..." />` directly now)
and replaced the stale "renders with no session at all" test (session was never actually read by
this component) with a real "not-found" case. `BuyerTab.test.tsx` gained a test asserting a grid
card click calls `openDetailDialog`.

## Verification

```bash
npm run test -- --run
./ci.sh
npm run dev
# manual: navigate directly to /listings/<a-nonexistent-id>, confirm the dialog opens showing
# "Angebot nicht gefunden."; click the dialog's close (X) button, confirm the URL returns to "/";
# navigate to /post while signed out, confirm no dialog opens
```

Manually verified in a running `npm run dev` session, driven through the Claude Code browser pane:
loading `/listings/<nonexistent-id>` opens the dialog with the not-found message; clicking its
close button closes it and the URL returns to `/` (matching the `App · closing the detail dialog
navigates back to /` test); loading `/post` signed out leaves the app on `/post` with no dialog.
Clicking a real grid card and posting-while-signed-in couldn't be exercised manually in this
environment — there's no seeded listing within the fallback-center radius to click, and no way to
complete a real Google OAuth round-trip here (the same tradeoff chapter 5 made) — so both paths are
covered by `BuyerTab.test.tsx` and `PostListing.test.tsx` instead. Also confirmed, by checking out
`main` in the same running dev server, that the console's "flushSync was called from inside a
lifecycle method" warning (from the popover's Ark-UI/zag-js internals) and two `400` network errors
already exist identically before this chapter's changes — pre-existing, not a regression here.

## Out of scope

A "my listings" entry point into the detail dialog for editing (deferred, see
[../gaps-and-decisions.md](../gaps-and-decisions.md)).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-ui-detail-and-post-dialogs
```

```text
test(web): describe the post and detail dialogs and their deep links

feat(web): move posting and listing detail into in-panel dialogs
```
