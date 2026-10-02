---
name: Panel UX — Gaps and decisions
overview: "Settled UX, Braille table, partial reserve inventory, git invariants."
isProject: false
---

# Panel UX — Gaps and decisions

**Architecture:** [00-architecture.md](00-architecture.md) · **Rollout:** [01-rollout.md](01-rollout.md)

## Settled

| ID | Decision |
| --- | --- |
| D1 | Feature folders per [frontend-structure](../frontend-structure/00-architecture.md). |
| D2 | `tabs.farmer` → **Verkäufer**, `tabs.buyer` → **Käufer**; tab emojis unchanged. |
| D3 | Umkreis **5 / 10 / 15 km** (`5000` / `10000` / `15000` m); default **5 km**. |
| D4 | No location: map fits **Germany**. With location: **`boundsForRadius`** = square **2×radius** around center. |
| D5 | Ort = **`LocationPicker` + `PlaceCombobox`**; seller uses **`embedInRow`** like buyer. |
| D6 | **`KeyValueRow`** grid **1fr : 3fr**; **`alignItems="start"`** unless a chapter says otherwise. |
| D7 | **Braille quantity** — exact totals via `src/lib/braille/eggQuantity/` and **`BRAILLE_BY_DOT_COUNT`**: |

| Dots | Unicode | Char |
| ---: | ------- | :--: |
| 1 | U+2801 | ⠁ |
| 2 | U+2803 | ⠃ |
| 3 | U+2807 | ⠇ |
| 4 | U+280F | ⠏ |
| 5 | U+281F | ⠟ |
| 6 | U+283F | ⠿ |

Render: `floor(total/6)` × `⠿` + optional tail char for `total % 6`. **`BrailleQuantityRow`** in UI; no Tabler for quantity rows.

| ID | Decision |
| --- | --- |
| D8 | Menu = **burger**; panel **open on load**; **no `ResultsGrid`** in panel. |
| D9 | **Partial reserve:** `reservation.egg_count` (+ `unit`); RPC `reserve_listing(p_listing_id, p_egg_count)`; validate `1 <= p_egg_count <= listing.egg_count`. **Listing:** subtract `p_egg_count` from `listing.egg_count`; remain **`active`** if count &gt; 0; **`reserved`** when count hits 0. Update trigger `handle_reservation_status_change` to match. Cancel restores eggs and listing status per ch.9 spec. |
| D10 | Remove dead code when unreferenced: `RadiusSelect.tsx`, `ListingSummaryLine` (+ tests if unused), `ManualPinFallback`, `UnitSelect` component (move `Unit` type to `types/`). Chapter 1 owns deletion. |
| D11 | **Git:** each chapter **`main` → pull → branch → PR → merge `main`**; no stacked multi-chapter branch ([01-rollout.md](01-rollout.md)). |

## Open seams

- **Ellipsis vs shrink** on very large Braille strings — default `textOverflow="ellipsis"` on `BrailleQuantityRow`; max display cells TBD in ch.6 if needed.
- **Deep-link detail** vs map popover — dialog remains for `/listings/:id`; map uses popover only (ch.10).

## Overlap

- [minimal-panel](../minimal-panel/) — not executed; do not merge those chapter paths with this suite.
- [ui-overhaul](../ui-overhaul/) — shared shell files; panel-ux owns Slider/KV/Braille behavior in touched files.
