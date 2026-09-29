---
name: "Chapter 1 — Floating panel shell"
overview: "Replace App.tsx's header Flex with an AppShell: MapView as a full-page background, a Chakra FloatingPanel anchored top-right and sized to wrap its contents, titled 'Eierbauer' at 4xl, centered. index.html's <title> updated to match."
todos:
  - id: title
    content: "index.html <title> and rendered 'Eierbauer' heading"
    status: pending
  - id: map-background
    content: "MapView repositioned as a full-page background layer"
    status: pending
  - id: shell
    content: "AppShell component wrapping FloatingPanel.Root/Positioner/Content"
    status: pending
isProject: false
---

# Chapter 1 — Floating panel shell

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-floating-panel-shell` · **Status:** planned

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

**The map keeps its own props/behavior unchanged.** `MapView`'s `center`/`listings`/`selectedId`/
`onSelect` props (`src/components/MapView.tsx:43-48`) aren't touched in this chapter — only its
wrapper changes from a bordered 400px `Box` (`Home.tsx`) to a full-page one. `Home.tsx` itself isn't
touched here either; wiring `MapView` and the results grid into the buyer tab is chapter 4's job.
This chapter only builds the shell and renders a placeholder inside the panel so the shell itself
is independently verifiable.

**"Eierbauer" is static chrome, not a `t(key)` string** — see
[../00-architecture.md §10](../00-architecture.md#10-typography-and-i18n-conventions).

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/components/AppShell.tsx` | Full-page map background + `FloatingPanel` shell, `children` render into `FloatingPanel.Body` |
| `src/components/AppShell.test.tsx` | Tests below |

**Edit:**

| Path | Change |
| --- | --- |
| `index.html` | `<title>eggs</title>` → `<title>Eierbauer</title>` |
| `src/App.tsx` | Replace the header `Flex` + bare `Routes` with `AppShell` wrapping the routed content |
| `src/components/MapView.tsx` | Wrapper `Box` becomes full-viewport-sized instead of `h="400px"` (only when rendered as `AppShell`'s background — prop signature unchanged) |

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
Report the outcome.

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
