---
name: "Chapter 1 — Floating panel shell"
overview: "Replace App.tsx's header Flex with an AppShell: MapView as a full-page background, a Chakra FloatingPanel anchored top-right and sized to wrap its contents, titled 'Eierbauer' at 4xl, centered. index.html's <title> updated to match."
todos:
  - id: title
    content: "index.html <title> and rendered 'Eierbauer' heading"
    status: done
  - id: map-background
    content: "MapView repositioned as a full-page background layer"
    status: done
  - id: shell
    content: "AppShell component wrapping FloatingPanel.Root/Positioner/Content"
    status: done
isProject: false
---

# Chapter 1 — Floating panel shell

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-floating-panel-shell` · **Status:** in review

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §4, §6, §10 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Give the app its shell before anything gets placed inside it: a full-page map background and a
small, top-right, content-sized floating panel titled "Eierbauer" — the two structural pieces every
later chapter's UI lands inside.

## Design decisions

**`AppShell` owns the map + panel layering, `App.tsx` stays routing-only.** A new
`src/components/AppShell.tsx` renders `MapView` as a full-viewport background (`position: fixed`,
`inset: 0`, `zIndex` below the panel) and `FloatingPanel.Root`/`Positioner`/`Content` on top of it.
`App.tsx` keeps its `Routes`, but each route renders children inside `AppShell` instead of a bare
`Flex` header — this keeps route wiring and shell layout as separate concerns, matching how
`RequireAuth` already wraps route content without owning layout.

**The panel is sized to content, not the viewport.** `FloatingPanel.Content` gets an explicit
`maxW` (e.g. `sm`/`md` token) rather than being left to stretch — this is the direct fix for "the
whole viewport is 100% of the screen, this doesn't look neat" from the brief. No drag/resize
triggers are wired up in this chapter (`FloatingPanel.DragTrigger`/`ResizeTrigger` exist but aren't
part of the ask); the panel is fixed-position, not user-movable, for now.

**The map keeps its own props/behavior unchanged, and there is exactly one of it.** `MapView`'s
`center`/`listings`/`selectedId`/`onSelect` props (`src/components/MapView.tsx:43-48`) aren't
touched — but the single `MapView` instance now renders as `AppShell`'s full-page background,
**not** inside `Home.tsx` any more (see Implementation notes: the first version of this chapter got
this wrong — a placeholder background map plus `Home`'s own real map produced two maps, one dead).
`Home.tsx` still owns the real geolocation/radius/listings/selection state (unchanged), but instead
of rendering `MapView` itself, it publishes that state to `AppShell` through a small
`BackgroundMap` context (`src/components/BackgroundMap.tsx`) so `AppShell` can render the one real,
active map without owning search state itself — wiring `MapView` and the results grid into the
*buyer tab specifically* (as opposed to whichever route happens to be mounted) is still chapter 4's
job.

**"Eierbauer" is static chrome, not a `t(key)` string** — see
[../00-architecture.md §10](../00-architecture.md#10-typography-and-i18n-conventions).

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/components/AppShell.tsx` | Full-page map background + `FloatingPanel` shell, `children` render into `FloatingPanel.Body` |
| `src/components/AppShell.test.tsx` | Tests below |
| `src/components/BackgroundMap.tsx` *(not originally planned, see Implementation notes)* | `BackgroundMapProvider`/`useBackgroundMapState`/`usePublishBackgroundMap` — lets a route publish the live center/listings/selection `AppShell`'s single background `MapView` should render |

**Edit:**

| Path | Change |
| --- | --- |
| `index.html` | `<title>eggs</title>` → `<title>Eierbauer</title>` |
| `src/App.tsx` | Replace the header `Flex` + bare `Routes` with `AppShell` wrapping the routed content |
| `src/components/MapView.tsx` | Wrapper `Box` now just fills its parent (`w="full" h="full"`) instead of a hardcoded `h="400px"` — each caller owns its own container/positioning |
| `src/routes/Home.tsx` *(not originally planned, see Implementation notes)* | No longer renders `MapView` itself; calls `usePublishBackgroundMap({ center, listings, selectedId, onSelect })` instead |
| `src/routes/Home.test.tsx` *(not originally planned)* | The map-selection test now asserts against the published `BackgroundMap` context instead of a `MapView` mock rendered by `Home` |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| `AppShell · renders "Eierbauer" as the panel title` | Text content |
| `AppShell · renders its children inside the floating panel body` | Composition |
| `AppShell · renders MapView as a background element` | Structure (e.g. a `data-testid` or role-based query, not pixel layout) |

## Green

1. `AppShell` with `FloatingPanel.Root`/`Positioner`/`Content`/`Header`/`Title`/`Body`, rendering
   `MapView` behind it and `children` inside; tests 1–3.
2. Wire `App.tsx` to render each route's element through `AppShell`.
3. Update `index.html`'s `<title>`.

## Refactor gate

`AppShell` stays layout-only — no tab state, no data fetching; those arrive in chapter 3 onward.

**Outcome:** `AppShell` itself does no fetching or state computation (see Implementation notes) —
it's ~35 LOC across two small components (`AppShell`, `BackgroundMap`), no branching. The new
`src/components/BackgroundMap.tsx` is ~50 LOC: two contexts and three one-purpose functions, each
well under the Sandi Metz thresholds. No refactor needed.

## Implementation notes

Two rounds of manual-verification fixes, on top of what the plan's Files table originally scoped:

**Round 1 — stacking-order bug.** Making `MapView`'s own wrapper `position: fixed; inset: 0`
unconditionally (as originally scoped) affects *every* call site, including `Home.tsx`'s existing
`<MapView>` call — which renders **inside** `AppShell`'s floating panel (`Home` is one of
`AppShell`'s `children`). A `position: fixed` descendant with an explicit `z-index` always paints
above plain in-flow siblings in its containing stacking context (CSS2.1 §E.5–E.8), so Home's map
covered the panel's own header/title — present in the DOM (and the accessibility tree) but not
visible on screen. Fix: `MapView`'s wrapper `Box` just fills its parent (`w="full" h="full"`)
instead of self-positioning; each caller owns its own container/positioning.

**Round 2 — two maps, one of them dead.** Round 1's fix left `AppShell` rendering its *own*,
separate `MapView` instance as a placeholder background (static center, empty listings, no
selection) while `Home.tsx` kept rendering *its own* real, working `MapView` (live geolocation,
real listings, click-to-select) inside the panel — reported by the user: two maps, the visible
"active" one behind the panel unusable, the real one small and boxed inside it. The correct reading
of the architecture doc (§4: "`MapView` — full-page background (*was*: 400px box in `Home.tsx`)")
is that it's the *same* map that relocates, not a second one.

Since `AppShell` has no way to reach into a specific routed child's state (it only receives an
opaque `children: ReactNode` from `App.tsx`'s `<Routes>`), and `Home.tsx`'s existing
"click a card, highlight the marker" behavior (already covered by a test) requires `Home` and the
map to share `selectedId`, the fix is a small `BackgroundMap` context
(`src/components/BackgroundMap.tsx`): `Home` keeps its own geolocation/radius/listings/selection
state exactly as before, but instead of rendering `MapView` itself, calls
`usePublishBackgroundMap({ center, listings, selectedId, onSelect })`; `AppShell` renders the one
real `MapView` from whatever the current route last published (falling back to a static center with
no listings for routes — `/listings/:id`, `/post` — that don't publish anything). `AppShell` still
doesn't compute or fetch anything itself; it only displays what it's handed, so it stays
presentation-only even though it's no longer literally stateless.

`FloatingPanel.Content` also gained `maxH="calc(100vh - 3rem)"` (not in the original design
decisions) so the panel's body scrolls internally instead of the whole panel overflowing the
viewport — needed because, for this chapter, all of `Home`'s existing content (unwired into a
buyer tab until chapters 3–4) renders inside the panel body.

## Verification

```bash
npm run test -- --run
./ci.sh
npm run dev
# manual: open localhost, confirm a small "Eierbauer" panel sits top-right over a full-page map,
# and the browser tab title reads "Eierbauer"
```

## Out of scope

Tabs (chapter 3), search/grid content (chapter 4), farmer content (chapter 5), dialogs (chapter 6),
panel drag/resize (not requested — open seam only if asked for later).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-ui-floating-panel-shell
```

```text
test(web): describe the AppShell floating panel and title

feat(web): add AppShell with a full-page map and floating panel
```
