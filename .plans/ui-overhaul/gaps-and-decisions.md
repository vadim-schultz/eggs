---
name: UI overhaul — Gaps and decisions
overview: "Settled UI/UX decisions for the Eierbauer redesign, and the open seams deferred past this pass."
isProject: false
---

# UI overhaul — Gaps and decisions

**Architecture:** [00-architecture.md](00-architecture.md) · **Rollout:** [01-rollout.md](01-rollout.md)

## Settled

| # | Decision |
| --- | --- |
| D1 | The map becomes a full-page background layer, with a Chakra `FloatingPanel` floating over it top-right, sized to wrap its own contents (small/medium). Rejected shrinking `MapView` into a fixed-height box inside the panel (defeats the "small floating card" look the panel is supposed to have — a map big enough to be useful wouldn't fit) and rejected putting the map behind a show/hide toggle (extra state and a click just to see pins that are the buyer's primary way of finding a nearby listing). |
| D2 | `ListingDetail` and `PostListing` become Chakra `Dialog` content opened in-app, but their routes (`/listings/:id`, `/post`) are kept and made to open the same dialog on load. Rejected dropping the routes entirely in favor of dialog-only state: that would break sharing a listing link or bookmarking "post a listing," both of which work today and aren't things this redesign is meant to take away. |
| D3 | The farmer tab stays "post a listing" only for this pass — no new "my listings" list. Removing or editing an existing listing continues through that listing's own detail view (`SellerActions`), just reachable via the chapter 6 dialog instead of the old detail page. Rejected building a "my listings" grid now: it's a real, separable feature (its own query, its own empty state, its own card variant) that would roughly double this folder's scope for a capability the user explicitly said to defer. |
| D4 | The floating panel's tab labels use the 🧑‍🌾 / 👨🏻‍💼 emoji plus a short text label, not emoji alone. Rejected emoji-only tabs: an emoji glyph isn't a reliable accessible name across screen readers and platforms, and Chakra's `Tabs.Trigger` needs real text content for that anyway. |
| D5 | The product name "Eierbauer" is rendered as static UI chrome (a `4xl` centered heading, plus `index.html`'s `<title>`), not routed through `t(key)` into `strings.de.ts` the way other UI copy is. Rejected treating it as a translatable string: a brand name doesn't change with locale the way instructional copy does, and `index.html`'s `<title>` is static markup outside React's render tree regardless. |

## Open seams (deferred past this pass, future `.plans/<feature>/` folders)

- **"My listings" view for the farmer tab** (D3) — a query scoped to `seller_id = auth.uid()`,
  rendered as its own grid inside the farmer tab, each card exposing the existing `SellerActions`
  (mark sold/cancelled, edit `expires_at`) inline instead of requiring a trip through the detail
  dialog. No schema change needed — `listing`'s existing RLS already allows this read for the owner.
- **Mobile / narrow-viewport behavior for the floating panel** — the user's brief (floating panel,
  top-right, wrapping contents) is a desktop-shaped interaction; how `FloatingPanel` should behave
  under ~768px (full-width sheet? bottom drawer? same panel, just repositioned?) wasn't specified
  and needs its own decision before a mobile pass.
- **Collapsible/hideable map** — raised while resolving D1 and explicitly not chosen for this pass,
  but not ruled out either; would matter more once/if the floating panel needs to cover more of the
  screen than it does today (e.g. once the "my listings" seam above is built).
