---
name: Egg Pricing — Architecture
overview: "Price per egg for sellers, 6/10 egg-carton picker with per-carton prices for buyers, listing detail in the shared AppDialog, and vertically centred key/value rows."
isProject: false
---

# Egg Pricing — Architecture

**Rollout:** [01-rollout.md](01-rollout.md) · **Decisions:** [gaps-and-decisions.md](gaps-and-decisions.md) · **Chapters:** [chapters/](chapters/) · **Ledger:** [run-ledger.md](run-ledger.md)

**Status:** planned

---

## 1. Why

A listing carries one total `price_cents` ([`listing.ts`](../../src/features/listings/types/listing.ts)) regardless of how many eggs it holds. Sellers cannot state what one egg costs; buyers reserve any 1…N eggs with a slider ([`ReserveAmountControl`](../../src/features/listings/components/ReserveButton/ReserveAmountControl.tsx)) while only seeing that total, so the price of what they order is never visible.

Separately, a map click opens a Leaflet `Popup` wrapping a Chakra `Card` ([`ListingPopoverContent`](../../src/features/browse/components/MapView/ListingPopoverContent.tsx)) — a nested surface unlike [`AppDialog`](../../src/features/shell/components/AppDialog/AppDialog.tsx), which "create listing" uses. And [`KeyValueRow`](../../src/components/ui/KeyValueRow.tsx) top-aligns label and value, which looks uneven beside inputs.

## 2. Non-goals

- No payments, no order totals stored in the database.
- No server-side enforcement of carton sizes (see [D9](gaps-and-decisions.md)).
- No new npm dependencies; no theme/palette changes (existing `egg.*` tokens are reused).
- No new copy outside [`strings.de.ts`](../../src/i18n/strings.de.ts).

## 3. Data model

| Column | Before | After |
| --- | --- | --- |
| `listing.price_cents` | total price for the listing | renamed **`price_per_egg_cents`** — price of one egg |
| `listing.egg_count` | remaining inventory | unchanged (still decremented by partial reserve) |
| `listing.unit` | `dozen` / `each` | unchanged; new listings always `each` |

Migration backfill: `round(price_cents / (egg_count × (12 if unit = 'dozen' else 1)))`; rows with no eggs left get `0`. `create_listing` takes `p_price_per_egg_cents`; `listings_near` returns `price_per_egg_cents`.

Carton price is **derived, never stored**: `cartonPriceCents(perEgg, size) = perEgg × size`.

## 4. Seller form

| Field | Behaviour |
| --- | --- |
| Anzahl | Value label of [`SliderWithValue`](../../src/components/ui/SliderWithValue.tsx) becomes an editable `NumberInput` (opt-in `editable`), integer, clamped 1–100, slider stays in sync |
| Preis pro Ei (€) | `Input type=number step=0.01`; hint shows the 6- and 10-carton price |

## 5. Buyer carton picker

Listing detail (in the dialog) shows a **4-column grid**:

```text
| ◉ | ● ● ●   | ○ | ● ● ● ● ●   |
|   | ● ● ●   |   | ● ● ● ● ●   |
|   | 2,10 €  |   | 3,50 €      |   ← price, fontSize xs, under each carton
```

- Columns: radio (6) · 6-egg carton (2 rows × 3) · radio (10) · 10-egg carton (2 rows × 5).
- Only two options exist: **6** and **10**. Selected carton = the reservation `egg_count`.
- Egg icons are the existing `TbEggFilled`, each coloured with [`eggColorForSlot(i)`](../../src/lib/eggQuantity/eggPalette.ts) (theme palette, multi-coloured).
- A carton larger than the remaining eggs is disabled; if neither fits, reserve is disabled with a note.

## 6. Dialog consolidation

Marker click → `setSelectedId` + `openDetailDialog(id)` from [`appDialog.tsx`](../../src/features/shell/context/appDialog.tsx), rendered by [`AppShellDialogHost`](../../src/features/shell/components/AppShell/AppShellDialogHost.tsx) in `AppDialog`. The Leaflet `Popup`, `ListingMarkerPopover`, `ListingPopoverContent` and the dead `ListingCard` / `ResultsGrid` are removed.

## 7. Layers

| Layer | Touched |
| --- | --- |
| **supabase** | `migrations/<ts>_price_per_egg.sql`, `seed.sql`, `scripts/rls-smoke.ts` |
| **features/listings** | types, `utils/{carton,postListingMappers,validateListingInput}`, `components/{CartonPicker,PostListing,ReserveButton,ListingDetail,ListingCardSummary}`, `services/listingsApi` |
| **features/browse** | `BuyerTab`, `MapView/ListingMapMarker`, removed popover files |
| **components/ui** | `SliderWithValue`, `KeyValueRow` |
| **i18n** | `strings.de.ts` |

## 8. Verification

```bash
./ci.sh
```

Chapter 1 additionally applies the migration locally (`supabase db reset`) and runs `scripts/rls-smoke.ts`. Chapter 6 ends with a manual pass: post a listing with a per-egg price, open it from the map, see both cartons priced, reserve one.

## 9. Execution

Run via [`.claude/skills/chief-of-staff/SKILL.md`](../../.claude/skills/chief-of-staff/SKILL.md) and [`.claude/agents/chapter-implementer.md`](../../.claude/agents/chapter-implementer.md) (plan folder `.plans/egg-pricing`). Track merges in [run-ledger.md](run-ledger.md).

**Git:** loop branch `feat/plans-egg-pricing`; chapter PRs → loop; one release PR **`feat/plans-egg-pricing` → `main`** when done ([01-rollout.md](01-rollout.md), [git-model.md](../../.claude/skills/chief-of-staff/git-model.md)).

## 10. Traceability (brief → chapter)

| Brief item | Chapter |
| --- | --- |
| Seller: price per ONE egg | 1, 2 |
| Seller: amount label becomes an input | 2 |
| Buyer: only 6 and 10 | 1 (constants), 4 |
| Buyer: 4-column grid, radios, 2-row multi-coloured eggs | 4 |
| Buyer: price per carton, xs under carton | 4, 6 |
| Remove nested popover; consolidate with dialogs | 5 |
| Key/value rows vertically centred | 3 |
