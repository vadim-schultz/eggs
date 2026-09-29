---
name: UI overhaul — Architecture
overview: "A visual and interaction redesign of eggs as 'Eierbauer': a full-page map as the background, a small floating panel (top-right) holding farmer/buyer tabs, a compact results grid, and in-panel dialogs instead of page navigation for posting and listing detail. No schema or backend changes — this is entirely a frontend/component pass, plus one auth config fix."
isProject: false
---

# UI overhaul — Architecture

**Rollout:** [01-rollout.md](01-rollout.md) · **Decisions:** [gaps-and-decisions.md](gaps-and-decisions.md) · **Chapters:** [chapters/](chapters/)

---

## 1. Why

The MVP (`.plans/mvp/`) shipped a working marketplace, but its UI was never designed past
"functional": an unnamed app (`<title>eggs</title>`), a top-left-to-right header, a full-height
boxed map, and a plain vertical list of listings. Now that it's live at eierbauer.cc, it needs to
look like a considered product rather than a scaffold — a name ("Eierbauer"), a clear farmer/buyer
split, and a UI that doesn't read as "a whole screen of forms" for what is, per listing, four or
five short fields.

## 2. Non-goals

- No schema, RLS, or Supabase Edge changes — every table, policy, and RPC from `.plans/mvp/` stays
  as-is. This folder only touches `src/` (plus one Supabase **dashboard** setting, §9).
- No new backend capability. In particular, no "my listings" management view for the farmer tab —
  removing/editing a listing keeps working exactly as it does today (`SellerActions` on the
  listing's own detail view), just reachable through a dialog instead of a page. Tracked as an open
  seam in [gaps-and-decisions.md](gaps-and-decisions.md).
- No new npm dependencies. Chakra UI v3.30 (already installed) ships every component this redesign
  needs — `FloatingPanel`, `Tabs`, `Dialog`, `SimpleGrid`, `Badge` — confirmed present under
  `node_modules/@chakra-ui/react/dist/types/components/`.
- No second locale, no i18n framework change — `strings.de.ts` stays the single flat dictionary
  (§10); this pass only adds/renames keys.
- No mobile-specific layout pass. The floating panel's behavior below ~768px width is out of scope
  here and recorded as an open seam.

## 3. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| App shell | Chakra `FloatingPanel` (`Root/Positioner/Content/Header/Body/Title`) | Already installed (Ark UI under the hood); gives a draggable/sizeable panel for free instead of hand-rolling fixed positioning. |
| Role switch | Chakra `Tabs`, `variant="enclosed"` | Matches the look the user asked for (chakra-ui.com/docs/components/tabs, enclosed style); already a dependency. |
| Detail / post UI | Chakra `Dialog` | Replaces the `/listings/:id` and `/post` full-page routes as the primary in-app path; the routes stay only as deep-link entry points (§8). |
| Results | Chakra `SimpleGrid` + existing `ListingCard` | Swaps the current vertical `Stack` for a grid — listings carry little enough data (location, count, price, one badge) that a screen-height list is unnecessary. |
| Status indicators | Chakra `Badge` (already used in `StatusBadge`) | Just needs a smaller `size`, not a replacement — this component was already done right. |
| Map | Existing Leaflet/`react-leaflet` `MapView`, repositioned | No library change — it moves from a boxed 400px element into a full-page background layer. |

Everything else (Vite, React Router, Supabase client, i18n helper, `ci.sh` gate) is unchanged from
`.plans/mvp/00-architecture.md` §3.

## 4. Screen / component map

There's no data model change in this folder, so in place of a schema section: here is how the
existing pieces (per the exploration behind this plan) are rearranged.

```
AppShell (new, replaces App.tsx's header Flex)
  MapView                         — full-page background (was: 400px box in Home.tsx)
  FloatingPanel (top-right, sized to content — small/medium, never full-viewport)
    Title: "Eierbauer" (4xl, centered)
    Tabs (enclosed)
      Tab 1 🧑‍🌾 farmer  — AuthButton, "add listing" trigger → PostListing dialog (ch. 5, 6)
      Tab 2 👨🏻‍💼 buyer   — AuthButton, radius + LocationPicker, SimpleGrid of ListingCard (ch. 4)
                             → ListingCard click opens ListingDetail dialog (ch. 6)
Routes (unchanged paths, new role): "/" mounts AppShell; "/post" and "/listings/:id" mount
  AppShell too, but open the corresponding dialog on load (deep-link entry, §8) instead of
  rendering a standalone page.
```

## 5. Component-library convention

The standing rule for this codebase, made explicit here because this pass is partly a cleanup of
where it was already broken: **every interactive element is a Chakra component, never a raw HTML
form element.** `Home.tsx`'s radius selector (`Field.Root` + `NativeSelect`) is the example to
follow. `PostListing.tsx`'s unit `<select>` and every `<label>`/`<input>` pair in
`LocationPicker.tsx` are the violations this pass fixes (chapter 2) — not because they're broken,
but because a mixed native/Chakra form is inconsistent focus styling, spacing, and accessibility
behavior for no benefit, and because every chapter after this one keeps building on these same
shared components.

## 6. Floating panel over a full-page map

The buyer's mental model doesn't change — search a radius, see pins and a list, pick one — but the
map stops being "an element on the page" and becomes the page: full viewport, `position: fixed`
(or absolute over a full-height wrapper), with `FloatingPanel` layered on top via its own
positioning (top-right anchor). This directly answers the "the whole viewport is 100% of the
screen, this doesn't look neat" complaint: the *panel* is what gets constrained to small/medium
and wraps its contents; the map is allowed to fill the screen because it's meant to, as a spatial
backdrop rather than competing content. Two alternatives were considered and rejected — see
[gaps-and-decisions.md](gaps-and-decisions.md) D1.

## 7. Tabs and the farmer/buyer split

`Tabs.Root variant="enclosed"` with two `Tabs.Trigger`s, labelled with the 🧑‍🌾 and 👨🏻‍💼 emoji the
user specified (plus a text label for accessibility — emoji alone isn't an accessible tab name).
Each tab's content is self-contained: the farmer tab never renders search/grid UI, the buyer tab
never renders the post form. Both tabs render `AuthButton` independently (same global session
state from `useSession`; there's no per-role auth, just per-role *entry points* to actions that
require auth) rather than hoisting one shared auth control above the tabs, so each tab reads as a
complete mini-app rather than depending on chrome outside itself.

## 8. Dialogs, not pages, for detail and posting

`ListingDetail` and `PostListing`'s *content* (the components they already compose — `StatusBadge`,
`ReserveButton`, `ContactReveal`, `SellerActions` for detail; the form fields for posting) don't
change. What changes is the shell around them: instead of `react-router` navigating to a new page,
a `Dialog.Root` opens over the floating panel (or over the whole app — see chapter 6 for the exact
layering decision) with that same content inside.

The `/listings/:id` and `/post` routes are **kept**, not removed, specifically so a shared link or
a bookmark still works — loading either URL mounts `AppShell` and opens the matching dialog
pre-populated, rather than 404ing or silently losing the deep-link behavior the MVP already has.
Closing the dialog navigates back to `/`. This was a deliberate trade-off against a pure "dialogs
only, drop the routes" approach — see [gaps-and-decisions.md](gaps-and-decisions.md) D2.

## 9. Auth redirect

`AuthButton.tsx` calls `supabase.auth.signInWithOAuth({ provider: "google" })` with no explicit
`redirectTo`. Supabase's default behavior in that case is to send the OAuth callback to whatever
**Site URL** is configured in the hosted project's **Authentication → URL Configuration** — and a
sign-in attempt against the live eierbauer.cc deployment landed on `http://localhost:3000/#...`,
which means that setting is still (or again) pointed at the local-dev default instead of
`https://eierbauer.cc`, contradicting `docs/operations/deploy.md` step 3's own instructions. Two
fixes, both included in chapter 7: fix the dashboard setting (the actual root cause), and also pass
`redirectTo: window.location.origin` explicitly in code, so the app redirects correctly regardless
of dashboard drift in the future.

## 10. Typography and i18n conventions

"Eierbauer" is the product name — rendered once, as a `4xl`, centered `FloatingPanel.Title`
(Chakra's `Heading` under the hood, sized via the `fontSize` token scale already configured in
`src/theme/index.ts`). It is **not** translated through `t(key)` the way UI copy is (per
`.plans/mvp/00-architecture.md` §11) — a product name isn't UI copy to localize, it's a brand
string, same as how `index.html`'s `<title>` is static markup rather than a rendered React string.
Every other piece of new copy this folder introduces (tab labels, "add listing" button, dialog
titles) follows the existing convention exactly: a new key in `src/i18n/strings.de.ts`, looked up
via `t()`, no hardcoded inline strings, no new locale.

## 11. Out of scope, revisited

See [gaps-and-decisions.md](gaps-and-decisions.md) for the full list of deferred seams: a "my
listings" farmer view, mobile/narrow-viewport behavior for the floating panel, and whether the map
should ever be collapsible.
