---
name: "Chapter 6 — Detail and post dialogs"
overview: "Convert PostListing and ListingDetail into Chakra Dialog content, opened from the farmer tab's add-listing trigger and from buyer-tab grid card clicks. /post and /listings/:id keep working as deep links by opening the same dialog on load."
todos:
  - id: post-dialog
    content: "PostListing content inside a Dialog, opened from FarmerTab"
    status: pending
  - id: detail-dialog
    content: "ListingDetail content inside a Dialog, opened from a grid card click"
    status: pending
  - id: deep-link-open
    content: "/post and /listings/:id open the matching dialog on load"
    status: pending
isProject: false
---

# Chapter 6 — Detail and post dialogs

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-detail-and-post-dialogs` · **Status:** planned

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

**Edit:**

| Path | Change |
| --- | --- |
| `src/routes/PostListing.tsx` | Outer wrapper → dialog content; submit closes the dialog and opens the detail dialog for the new listing instead of `navigate` |
| `src/routes/ListingDetail.tsx` | Outer wrapper → dialog content |
| `src/App.tsx` | `/post`/`/listings/:id` routes drive dialog-open state instead of rendering a standalone page |
| `src/components/AppShell.tsx` | Hosts the open `AppDialog` (post or detail), on top of the floating panel |
| `src/components/BuyerTab.tsx` | Grid card click opens the detail dialog (in addition to/instead of the existing map-pin `onSelect`) |
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

## Verification

```bash
npm run test -- --run
./ci.sh
npm run dev
# manual: click a grid card, confirm the detail dialog opens over the panel; copy its URL, reload
# it directly, confirm the same dialog opens; post a new listing, confirm it lands on that
# listing's detail dialog; close it, confirm the URL returns to "/"
```

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
