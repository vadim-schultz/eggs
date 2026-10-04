---
name: "Chapter 2 — Carton cards"
overview: "Replace the radio grid with two rounded, selectable carton cards (6 and 10) in a 2×1 grid; whole card highlights when selected; contact hint after reservation."
todos:
  - id: card
    content: "CartonCard: rounded, selectable, whole-card highlight, disabled when unavailable"
    status: pending
  - id: picker
    content: "CartonPicker: 2×1 Grid of CartonCards, radiogroup semantics, no RadioGroup"
    status: pending
  - id: contact
    content: "Contact hint only with an active reservation; verify RLS and refetch after reserve"
    status: pending
isProject: false
---

# Chapter 2 — Carton cards

**Repo:** `eggs` · **Branch:** `feat/lean-ui-carton-cards` · **Status:** planned

**Depends on:** [1](01-lean-listing-summary.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

The buyer picks a carton by tapping one of two cards. No radios, no extra fields ([D1, D2](../gaps-and-decisions.md)). The contact hint shows only after a reservation ([D3](../gaps-and-decisions.md)).

## Design decisions

- [`CartonPicker`](../../../src/features/listings/components/CartonPicker/CartonPicker.tsx) renders `role="radiogroup"` (`aria-label={t("carton.legend")}`) with a `Grid templateColumns="1fr 1fr"` and one `CartonCard` per `CARTON_SIZES`. `RadioGroup` is removed. Same props as today.
- New `CartonCard.tsx` replaces `CartonOption.tsx`: a Chakra `chakra.button` (`type="button"`, `role="radio"`, `aria-checked`) with `rounded="xl"` and a border. Content: `CartonEggs` and the carton price (`cartonPriceCents` + `formatPrice`). Selected: whole card background and border use the highlight colour from the theme (the same `colorPalette`/semantic token the primary button uses; no hard-coded hex), text switches to its contrast token. Unavailable ([`isCartonAvailable`](../../../src/features/listings/utils/carton.ts) false): `disabled`, dimmed, `title` and `srOnly` text from `carton.unavailable`.
- Keep [`CartonEggs`](../../../src/features/listings/components/CartonPicker/CartonEggs.tsx), [`useCartonSelection`](../../../src/features/listings/components/ReserveButton/useCartonSelection.ts) and the Reserve button in [`ReserveButton`](../../../src/features/listings/components/ReserveButton/ReserveButton.tsx) unchanged.
- Contact hint: `listing_contact` RLS already limits non-sellers to buyers with an active reservation (`listing_contact_select_seller_or_active_buyer`), so `ContactReveal` renders nothing before reserving. Verify with a test, and make sure the hint appears right after a successful reserve without a reload: after `reserve`, `onChange` refetches the listing; if the listing stays `active` (partial reserve) the `key={listing.status}` remount does not fire, so key `ContactReveal` on the reserved total or bump a counter from `ReserveButton`'s `onChange`. Choose the simplest option that passes the test.
- Delete `CartonOption.tsx` and update the barrel `index.ts`.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/components/CartonPicker/CartonCard.tsx` | listings | New (replaces `CartonOption`) |
| `src/features/listings/components/CartonPicker/{CartonPicker,CartonOption}.tsx` (+ tests) | listings | Rewrite / delete |
| `src/features/listings/containers/BuyerListingDialog.tsx` | listings | Contact refetch key |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** renders | Exactly two cards (6 and 10), each with its carton price; no `input[type=radio]` |
| **Happy:** click | Clicking 10 calls `onChange(10)` and marks that card `aria-checked="true"`, the other `false` |
| **Happy:** contact | After a successful reserve the contact note is shown (mock `useListingContact`/API) |
| **Negative:** stock 8 | The 10 card is disabled and clicking it does not call `onChange` |
| **Negative:** before reserving | No contact hint |
| **Negative:** no "Verfügbar"/price-per-egg text | Cards show only eggs and the carton price |

## Green

Implement; `./ci.sh`. Visual check on the dev server (`run` skill): cards rounded, selected card fully highlighted in light and dark mode.

## Refactor gate

`grep -rn "RadioGroup\|CartonOption" src` returns nothing; `CartonCard` and `CartonPicker` each ≤~100 LOC, methods ≤~5 LOC. Report outcome.

## Git workflow

```bash
git checkout feat/plans-lean-ui && git pull
git checkout -b feat/lean-ui-carton-cards
```

```text
feat(listings): select cartons from two rounded cards instead of radios
```
