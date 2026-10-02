---
name: Egg UX — Gaps and decisions
overview: "Settled palette, egg row algorithm, expiry, popover reserve, git invariants."
isProject: false
---

# Egg UX — Gaps and decisions

**Architecture:** [00-architecture.md](00-architecture.md) · **Rollout:** [01-rollout.md](01-rollout.md)

## Settled

| ID | Decision |
| --- | --- |
| D1 | Suite folder **`.plans/egg-ux`**; loop branch **`feat/plans-egg-ux`**; release **`main`** ([01-rollout.md](01-rollout.md), [git-model.md](../../.cursor/skills/chief-of-staff/git-model.md)). |
| D2 | Feature folders per [frontend-structure](../frontend-structure/00-architecture.md). |
| D3 | **Easter palette** (12 names → theme tokens). Implementer picks accessible hex per swatch; light and `_dark` partner required. Names (inspiration: Oh So Beautiful Paper “Color Blocked Easter Egg”): **Blush**, **Coral**, **Rose**, **Burgundy**, **Rust**, **Goldenrod**, **Seafoam**, **Cornflower**, **Mint**, **Jade**, **Emerald**, **Navy**. Egg icons cycle `palette[slotIndex % 12]`. |
| D4 | **Egg row:** one row, 10 slots, counts **1…100**; `TbEgg` = 1, `TbEggFilled` = 10; algorithm in [00-architecture §5](00-architecture.md). Module: **`src/lib/eggQuantity/`**; UI: **`EggQuantityRow`** (`w="full"`). |
| D5 | **Retire Braille** after egg row ships: delete **`src/lib/braille/`** and **`BrailleQuantityRow`** (chapter 4). |
| D6 | **Burger:** semantic **`floatingSurface`** (nav bg/border/icon colour); fix hardcoded `bg="white"` on [`AppShellMenuTrigger`](../../src/features/shell/components/AppShell/AppShellMenuTrigger.tsx). Icon **`TbMenu2`** unless contrast fails in tests. |
| D7 | **Combobox:** on place select, dropdown **closes**; query may remain the selected label ([`PlaceCombobox`](../../src/features/location/components/PlaceCombobox/PlaceCombobox.tsx)). |
| D8 | **Listing card (browse + popover):** heading = **`EggQuantityRow`**; show **available count** + price; **no** status badge / “Verfügbar” row. |
| D9 | **Post listing:** **`unit` always `"each"`**; remove Stück/Dutzend chips; slider **1…100**; egg row **above** all fields, **full width** (not in `KeyValueRow`). |
| D10 | **Reserve slider max** = **`listing.egg_count`** (available amount). |
| D11 | **Map popover** must include **`ReserveButton`** + amount slider (same as detail for active listings). Root cause: popover only mounts [`ListingCard`](../../src/features/listings/components/ListingCard.tsx) inside a button — split layout (chapter 9). |
| D12 | **Expiry default:** **`now() + interval '24 hours'`** on insert (migration ch.6). Seller **extend** UI and **14-day cap** unchanged unless a later chapter says otherwise. |
| D13 | **Color mode:** `next-themes` + [`color-mode` snippet](https://www.chakra-ui.com/docs/components/concepts/color-mode); default **`system`** unless chapter 1 sets `defaultTheme`. **`ColorModeButton`** optional in panel header (chapter 1 or 2). |
| D14 | German copy via [`strings.de.ts`](../../src/i18n/strings.de.ts) only. |

## Open seams

- **`ListingDetailView` / seller flows:** may still show **status** for lifecycle — out of scope for browse card (D8); confirm in ch.8 if detail should drop buyer-facing “Verfügbar” only.
- **Legacy `dozen` rows:** display via `egg_count * 12` capped at 100 for the row until data is migrated; new posts never use dozen (D9).
- **Counts &gt; 100** in DB: clamp display at 100 in `EggQuantityRow` or show ellipsis — default **clamp** in ch.3 tests.

## Overlap

- [panel-ux](../panel-ux/) — Braille and popover behaviour; **egg-ux** replaces Braille and extends popover with reserve. Do not edit panel-ux plan files.
- [frontend-dry](../frontend-dry/) — Chakra field markup; egg-ux may touch same post form files; egg-ux owns quantity UX.
