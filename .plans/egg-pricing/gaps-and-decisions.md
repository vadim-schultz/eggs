---
name: Egg Pricing — Gaps and decisions
overview: "Settled price model, carton sizes and layout, low-stock rule, dialog consolidation and alignment decisions."
isProject: false
---

# Egg Pricing — Gaps and decisions

**Architecture:** [00-architecture.md](00-architecture.md) · **Rollout:** [01-rollout.md](01-rollout.md)

## Settled

| ID | Decision |
| --- | --- |
| D1 | Suite folder **`.plans/egg-pricing`**; loop branch **`feat/plans-egg-pricing`**; release **`main`** ([01-rollout.md](01-rollout.md)). |
| D2 | **Schema:** new migration renames `listing.price_cents` → `price_per_egg_cents` and backfills `round(price_cents / (egg_count × (12 if dozen else 1)))`, `0` when no eggs remain. `create_listing` and `listings_near` updated. `unit` column kept; new listings are always `each`. |
| D3 | Buyers choose between exactly two cartons: **6** and **10** (`CARTON_SIZES`). |
| D4 | **Layout:** 4-column grid `auto 1fr auto 1fr` — radio, 6-carton, radio, 10-carton. Cartons show eggs in **2 rows** (6 → 2×3, 10 → 2×5). |
| D5 | Carton price = `size × price_per_egg_cents`, shown with `fontSize="xs"` directly under the carton. |
| D6 | Egg icons are the existing `TbEggFilled`, each coloured by `eggColorForSlot(i)` — multi-coloured from theme tokens. |
| D7 | Seller amount input accepts integers **1–100** (matches `clampCount` and the slider); value clamps on blur/Enter. |
| D8 | **Low stock:** a carton larger than remaining `egg_count` is disabled and muted. If neither fits, reserve is disabled with `reserve.noCarton` text. |
| D9 | Carton rule is **client-side only**; `reserve_listing` still accepts any `1…egg_count`. Server enforcement deferred. |
| D10 | Marker click opens the detail `AppDialog` (existing `appDialog.tsx` context); the Leaflet `Popup` path is deleted. |
| D11 | `KeyValueRow` uses `alignItems="center"` everywhere. |
| D12 | **Chapters merge into the loop branch**, never directly to `main`; the release PR is opened by chief of staff. |

## Open seams

- **Textarea row** — a multi-line Kontakthinweis with a vertically centred label is accepted per the brief; revisit only if it looks wrong in the chapter 3 review.
- **Remainders below 6** — a partially reserved listing with fewer than 6 eggs left cannot be reserved further; the seller can mark it sold or cancelled.
- **Dead code** — `ListingCard`, `ResultsGrid`, `BrowseEmptyState` appear unused; chapter 5 deletes them only after a grep confirms no consumers.

## Overlap

- [egg-ux](../egg-ux/) and [panel-ux](../panel-ux/) introduced the slider reserve, popover reserve and decade egg row; this suite supersedes the buyer-side parts. Do not edit their plan files.
