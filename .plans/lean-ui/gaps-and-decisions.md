---
name: Lean UI — Gaps and Decisions
overview: "Settled decisions and deferred items for the streamlined buyer/seller UI."
isProject: false
---

# Lean UI — Gaps and Decisions

**Architecture:** [00-architecture.md](00-architecture.md) · **Rollout:** [01-rollout.md](01-rollout.md)

## Settled

| # | Decision |
| --- | --- |
| D1 | Buyer dialog = two carton cards + Reserve button + contact hint. No "available", no price per egg, no summary block. The carton price on the card is the computed total. |
| D2 | Carton cards: a 2×1 `Grid`, no radios. The whole card is rounded and takes the highlight colour when selected. An unavailable card (fewer eggs than its size) is disabled and dimmed. Semantics: `role="radiogroup"` with `role="radio"` + `aria-checked` cards. |
| D3 | The contact hint appears only once the viewer has an active reservation. It stays RLS-gated (`listing_contact`); `ContactReveal` keeps its remount-on-change so it refetches after reserve/cancel. |
| D4 | `Status` rows and `StatusBadge` are removed everywhere (seller dialog, buyer dialog, signed-out view). A listing is either visible or not. |
| D5 | Reservation lists (panel and seller dialog): **active only**, non-expired listings, read-only, rows not clickable. Works for fully-reserved listings that are hidden from the map. |
| D6 | Seller row: egg count · place · time. Buyer row: egg count · place · time · contact hint · cancel action. Separate `SellerReservation*` and `BuyerReservation*` components under `features/listings/components/`. Seller list sits under the two buttons in the Verkäufer tab; buyer list sits inside the Käufer tab card. Both only render when signed in. |
| D7 | "Zum Reservieren anmelden" is an enabled button calling the shared `signInWithGoogle()` extracted from `AuthButton` (`features/auth/services/signInWithGoogle.ts`). |
| D8 | Clicking the basket (user-location) marker opens `AppDialog` with a new dialog kind `"here"` rendering "Du bist hier". Marker `title` strings move to `strings.de.ts`. |
| D9 | The cut-off brief item "in line for seller / …" is read as inline seller rows and buyer rows with cancel ([rollout](01-rollout.md)). |
| D10 | Empty states: a list with no active reservations renders nothing in the panel (no heading, no empty text); the seller dialog keeps its title with "Noch keine Reservierungen." |

## Deferred

- Clicking a reservation row to open its listing.
- Seller-side cancel of a reservation; buyer notifications.
- Showing cancelled reservations as history.
- Dropping now-unused `ListingStatus` literals from the TypeScript type (the DB constraint is unchanged).

## Overlap

- [listing-roles](../listing-roles/) created the buyer/seller split and `SellerReservations`; this suite replaces the dialog's inline list with the shared seller list and removes `StatusBadge`.
- [egg-pricing](../egg-pricing/) built the carton picker that chapter 2 rewrites.
- Do not edit those suites' plan files.
