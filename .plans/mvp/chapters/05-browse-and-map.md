---
name: "Chapter 5 — Browse and map"
overview: "The Home route: a Leaflet map and a synced list of active listings, calling the listings_near RPC from chapter 2, with an optional browser-geolocation center and a manual radius/location fallback. Fully anonymous — no session required."
todos:
  - id: near
    content: "useListingsNear hook wrapping the listings_near RPC"
    status: pending
  - id: map
    content: "Leaflet map + markers, react-leaflet"
    status: pending
  - id: list
    content: "Synced list view + ListingDetail read side"
    status: pending
isProject: false
---

# Chapter 5 — Browse and map

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-browse-and-map` · **Status:** planned

**Depends on:** [1](01-project-scaffold.md), [2](02-schema-and-rls.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §6, §7 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Anyone — signed in or not — can see what's currently for sale nearby, on a map and as a list, and open a
listing's detail page. This is the chapter that proves invariant 3 (browsing needs no login): nothing here
imports `useSession` for a gate, only optionally to decide whether to show a "Post a listing" call to
action versus "Sign in to post."

## Design decisions

**`listings_near` is the only query**, never a raw `select * from listing`. The RPC (chapter 2) already
does the `ST_DWithin` filter and returns rows ordered by distance; the frontend doesn't reimplement geo
math or pull the full public table just to filter client-side (D6 — PostGIS does this correctly, so the
frontend shouldn't second-guess it).

**Center comes from the browser's Geolocation API, opt-in, with a manual fallback.** On first load the
page asks (via the standard permission prompt, not before) for the user's position; if denied, unavailable,
or simply not yet answered, the search center defaults to a fixed fallback point (the app's configured
"home" region) and the seller-facing location search UI from chapter 4 is reused here as a "search a place
instead" input. Radius defaults to a sensible fixed value (e.g. 15 km) with a simple select to widen it —
no elaborate filter UI in v1.

**Map and list are two views of one `listings` array**, not two independent fetches. `useListingsNear(center,
radiusM)` is the single hook both `MapView` and `ListView` consume; hovering/selecting a card highlights the
corresponding marker and vice versa, implemented as lifted `selectedId` state in `Home.tsx`, not inside
either child.

**`ListingDetail` gets its read side here, its write side (reserve, contact reveal) in chapter 6.** This
chapter fetches a single listing by id (public `select`, RLS already allows it) and renders count, unit,
price, location label and status; the "Reserve" button and the contact reveal are added in chapter 6
behind their own conditionals so this chapter's version simply doesn't show them yet.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/hooks/useListingsNear.ts` | Wraps `supabase.rpc("listings_near", ...)`, exposes `{ listings, loading, error }` |
| `src/hooks/useGeolocation.ts` | Wraps `navigator.geolocation.getCurrentPosition`, resolves to a fallback on denial/timeout |
| `src/components/MapView.tsx` | Leaflet map, one marker per listing, click selects |
| `src/components/ListingCard.tsx` | Count/unit, price, location label, status badge |
| `src/hooks/useListingsNear.test.ts`, `src/hooks/useGeolocation.test.ts`, `src/routes/Home.test.tsx`, `src/routes/ListingDetail.test.tsx` | Tests below |

**Edit:**

| Path | Change |
| --- | --- |
| `src/routes/Home.tsx` | Replace the chapter 1 placeholder: `useGeolocation` + `useListingsNear` + `MapView` + list, lifted `selectedId` |
| `src/routes/ListingDetail.tsx` | Replace the placeholder with the read-only detail view |
| `src/i18n/strings.de.ts` | `home.*`, `listing.*` keys (status labels, "ask for location" prompt, radius options) |
| `package.json` | Add `leaflet`, `react-leaflet` and `@types/leaflet` |

## Manual configuration

None. OSM tile URLs are a public endpoint (no key, per invariant 2); Leaflet ships as a normal npm
dependency.

## Red tests

| Test | Asserts |
| --- | --- |
| `useListingsNear · calls the listings_near RPC with the given center and radius` | Mocked client, request shape |
| `useListingsNear · exposes loading then the resolved listings` | State transitions |
| `useGeolocation · resolves to the browser position when granted` | Mocked `navigator.geolocation` |
| `useGeolocation · resolves to the fallback center when denied` | Mocked `navigator.geolocation` |
| `Home · renders one ListingCard per returned listing` | Wiring |
| `Home · selecting a card highlights the matching marker` | Lifted-state behavior |
| `ListingDetail · renders count, unit, price and location_label for an active listing` | Read side |
| `ListingDetail · does not render a Reserve button` (yet) | Explicit boundary with chapter 6 |
| `Home and ListingDetail · render with no session at all` | Proves invariant 3 — no `useSession` gate on this route |

## Green

1. `useListingsNear`; tests 1–2.
2. `useGeolocation`; tests 3–4.
3. `MapView` + `ListingCard` + `Home.tsx` wiring; tests 5–6.
4. `ListingDetail` read side; tests 7–9.

## Refactor gate

`Home.tsx` composes `useGeolocation`, `useListingsNear`, `MapView` and the list; it holds `selectedId`
state and passes it down, nothing else. Report the outcome.

## Verification

```bash
npm run test -- --run
./ci.sh
supabase start && supabase db reset  # apply seed.sql listings from chapter 2
npm run dev
# manual: load Home anonymously, allow/deny geolocation, confirm markers and list stay in sync,
# open a listing's detail page with no session
```

## Out of scope

Reserve button and contact reveal (chapter 6), listing status transitions beyond what chapter 2 seeds
(chapter 7), any server-side full-text or filter search beyond radius (not planned for v1).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-browse-and-map
```

```text
test(web): describe listings_near wiring, geolocation fallback and the browse views

feat(web): add the map/list browse page and read-only listing detail
```
