---
name: Panel UX — Architecture
overview: "Floating panel UX: burger menu, open-on-load, KV 1:3, Umkreis 5/10/15 km, Braille quantity rows, map radius bounds, map popover, partial reserve. Feature folders; supabase only in ch.9."
isProject: false
---

# Panel UX — Architecture

**Rollout:** [01-rollout.md](01-rollout.md) · **Decisions:** [gaps-and-decisions.md](gaps-and-decisions.md) · **Chapters:** [chapters/](chapters/) · **Ledger:** [run-ledger.md](run-ledger.md)

---

## 1. Why

The Eierbauer shell works but the panel is cramped and inconsistent: invisible menu trigger, results grid in the menu, tight key–value columns, radius up to 30 km, map zoom not tied to search radius, listing detail on map via full dialog, and whole-listing reserve only. This suite tightens the **hyperlocal** UX: burger menu, panel **open on load**, buyer search **without in-panel cards** (map + popover instead), shared **1 : 3** `KeyValueRow`, **5 / 10 / 15 km** default **5**, **exact Braille** quantity display, seller/reserve sliders with value left of track, and **partial reservation** with inventory on the listing row.

## 2. Non-goals

- No payments or new npm dependencies.
- No manual lat/lng pin UI in buyer/seller flows (combobox + geocode + geolocate only).
- No mobile-specific layout pass.
- **`supabase/` changes only in chapter 9** (partial reserve). Other chapters are frontend-only.
- Do not edit [`.plans/minimal-panel/`](../minimal-panel/) — historical draft.

## 3. Prerequisites

[frontend-structure](../frontend-structure/) is on `main`. Code follows `features/<name>/{containers,components,hooks,utils}` plus `lib/geo`, `lib/braille`, and `components/ui`. See [frontend-structure §3](../frontend-structure/00-architecture.md).

## 4. Feature layers (this suite)

| Layer | Responsibility | New / touched examples |
| --- | --- | --- |
| **containers** | Hooks, map/dialog context, form state | `BuyerTab`, `PostListing`, map popover host |
| **components** | Presentational Chakra UI | `RadiusSlider`, `SliderWithValue`, `BrailleQuantityRow`, `ListingCard`, `EggAmountControl`, `ReserveAmountControl` |
| **hooks** | Geo + search | `useGeolocation` |
| **lib/geo** | Bounds + fallback | `GERMANY_BOUNDS`, `boundsForRadius(center, radiusM)` |
| **lib/braille/eggQuantity** | Pure quantity → string | `renderEggQuantityBraille`, `BRAILLE_BY_DOT_COUNT` |
| **components/ui** | Layout primitives | `KeyValueRow`, `SliderWithValue`, `BrailleQuantityRow` |

## 5. Screen map

```
AppShell (Popover open on load, burger trigger)
  AppShellPanel → RoleTabs (default buyer)
    BuyerTab: Auth + BuyerSearchRows only (no ResultsGrid)
    FarmerTab: Auth + add listing → AppDialog (post)
BackgroundMap → MapView
  fit Germany OR fitBounds(2×radius square)
  listing markers → popover with ListingCard / detail (not AppDialog)
AppDialog: post listing + URL deep-link detail only
```

## 6. Shell and panel

- Menu trigger: recognizable **burger** icon (`TbMenu2` or equivalent from `react-icons/tb`).
- **`Popover.Root` `defaultOpen`** (or controlled open) so Käufer search is visible immediately.
- Remove unused components per [gaps D10](gaps-and-decisions.md).

## 7. KeyValueRow

Single primitive [`KeyValueRow`](../../src/components/ui/KeyValueRow.tsx): `SimpleGrid` **`templateColumns="1fr 3fr"`**, **`alignItems="start"`** (top-left). Use for Umkreis, Ort, Anzahl, Preis, Status, seller price, etc.

## 8. Umkreis and sliders

- Radius slider: **5000 / 10000 / 15000** m only; default **5000**.
- Shared [`SliderWithValue`](../../src/components/ui/SliderWithValue.tsx): numeric label **left** of track ([Chakra Slider](https://www.chakra-ui.com/docs/components/slider)).
- Used in: `RadiusSlider`, `EggAmountControl`, `ReserveAmountControl`.

## 9. Braille quantity (exact totals)

Module [`src/lib/braille/eggQuantity/`](../../src/lib/braille/eggQuantity/):

| Dots | Unicode | Char |
| ---: | ------- | :--: |
| 1 | U+2801 | ⠁ |
| 2 | U+2803 | ⠃ |
| 3 | U+2807 | ⠇ |
| 4 | U+280F | ⠏ |
| 5 | U+281F | ⠟ |
| 6 | U+283F | ⠿ |

```text
total = totalEggsFromListing(eggCount, unit)
full = floor(total / 6)
rem = total % 6
out = repeat(BRAILLE_BY_DOT_COUNT[6], full) + (rem === 0 ? "" : BRAILLE_BY_DOT_COUNT[rem])
```

UI: [`BrailleQuantityRow`](../../src/components/ui/BrailleQuantityRow.tsx) — monospace, xs, one line (`nowrap`, ellipsis optional). **Map pins** may stay Tabler; quantity rows do not use `react-icons`.

Optional docstring note: same “full blocks + tail cell” shape as htmlrec `block_char` ([reference](https://deepwiki.com/dsplce-co/htmlrec/3.2-braille-progress-bar-renderer#core-rendering-logic)); this app uses **6-dot patterns only**.

## 10. Listings UI

- **ListingCard:** Braille row + `KeyValueRow` for Anzahl, Preis, Status; no place name; width hugs content.
- **ListingDetailView:** same KV + Braille; drop location-only heading where redundant.
- **PostListingForm:** centered unit chips; Preis + Ort in KV (`LocationPicker` `embedInRow`); amount slider + Braille preview.

## 11. Map

1. **No** user/manual location: `fitBounds(GERMANY_BOUNDS)` only.
2. **Location set:** fit square centered on search point, half-width = `radiusM` (default 5 km → 10×10 km).
3. Marker click: **popover** with card/detail; `autoPan` / flip so content stays in viewport. **Do not** open `AppDialog` for map marker clicks. Keep dialog for post flow and `/listings/:id` deep links.

## 12. Partial reserve (chapter 9)

- UI: slider 1…`listing.egg_count` + `BrailleQuantityRow`.
- DB: `reservation.egg_count` (+ `unit` aligned with listing); `reserve_listing(p_listing_id, p_egg_count)`.
- **Inventory rule (D9):** on reserve, **decrement** `listing.egg_count` by `p_egg_count`. Listing stays **`active`** while `egg_count > 0`. Set listing **`reserved`** only when `egg_count` reaches **0** (adjust `handle_reservation_status_change` accordingly). On cancel, restore inventory and reactivate listing when appropriate.

## 13. Verification

```bash
./ci.sh
```

Chapter 9 also requires GitHub **rls-smoke** after migration.

## 14. Execution

Run via the user `chief-of-staff` skill and `chapter-implementer` agent (plan folder `.plans/panel-ux/`). Track merges in [run-ledger.md](run-ledger.md).

**Git:** loop branch for all chapters; each chapter MR merges into the loop branch; one release MR to **`main`** when the suite is done ([01-rollout.md](01-rollout.md)).

## 15. Traceability (original brief → chapter)

| Brief item | Chapter |
| --- | --- |
| Cleanup unused components | 1 |
| Burger menu | 1 |
| Panel open on load | 1 |
| KV 1 : 3, top-left | 2 |
| Umkreis 5/10/15, default 5; no results in panel | 4 |
| Slider value left of track | 3 |
| Braille quantity | 6 |
| Listing card / detail KV, fit width | 7 |
| Seller dialog chips, price KV, Ort picker | 8 |
| Partial reserve | 9 |
| Map bounds | 5 |
| Map marker popover | 10 |
