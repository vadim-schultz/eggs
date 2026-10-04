---
name: "Chapter 7 — Buyer reservation list"
overview: "Buyer reservation rows (eggs, place, time, contact hint, cancel) inside the Käufer tab card; active only."
todos:
  - id: components
    content: "BuyerReservationRow (with cancel) and BuyerReservationList components"
    status: pending
  - id: tab
    content: "BuyerTab renders the list under the search rows when signed in; refetch after cancel"
    status: pending
  - id: manual-pass
    content: "End-to-end manual pass"
    status: pending
isProject: false
---

# Chapter 7 — Buyer reservation list

**Repo:** `eggs` · **Branch:** `feat/lean-ui-buyer-list` · **Status:** shipped

**Depends on:** [6](06-seller-reservation-list.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3, §4 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

A buyer sees what they reserved, where to pick it up, and can cancel, from the top-level Käufer card ([D5, D6, D10](../gaps-and-decisions.md)). This also closes a gap: after a partial reserve the listing stays active, so the dialog offers no cancel; the panel does.

## Design decisions

- New `components/BuyerReservationList/` in `features/listings`: `BuyerReservationList.tsx` (props `reservations`, `onChange`) and `BuyerReservationRow.tsx`: `{egg_count} Eier · {location_label} · {formatDateTime(created_at)}`, the contact hint (`reserve.contactNote.label: contact_note`) when present, and a small cancel button (`reserve.cancel`). Cancel calls [`cancelReservation`](../../../src/features/listings/services/listingsApi.ts) via `useAsyncAction`, then `onChange`; an error shows `reserve.error`. Separate from the seller components; no ownership logic.
- [`BuyerTab`](../../../src/features/browse/containers/BuyerTab.tsx): when signed in, `useBuyerReservations(session.user.id)` and render the list after `BuyerSearchRows`; nothing when empty, nothing when signed out. Keep `BuyerTab` ≤~100 LOC by extracting a `BuyerReservations.tsx` wrapper (hook + list) in `features/browse/components/BuyerTab/` if needed.
- A reserve made in the dialog must show up in the list: refetch the buyer list when the dialog closes (`open` becoming `null`, already observed in `BuyerTab`).
- Rows are not clickable ([D5](../gaps-and-decisions.md)).

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/components/BuyerReservationList/*` | listings | New |
| `src/features/browse/containers/BuyerTab.tsx` (+ optional wrapper) | browse | Render list, refetch on dialog close |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `BuyerReservationList` | Rows with eggs, place, time and contact hint |
| **Happy:** cancel | Click calls `cancelReservation(id)` then `onChange` |
| **Happy:** `BuyerTab` signed in | List appears under the search rows |
| **Negative:** `BuyerTab` signed out | No list, no reservation query |
| **Negative:** no reservations | Nothing rendered |
| **Negative:** cancel fails | Shows `reserve.error`, `onChange` not called |
| **Negative:** row without contact note | No empty "Kontakthinweis:" line |

## Green

Implement; `./ci.sh`.

Manual pass (report in the PR, `run` skill): post as seller; reserve 6 from a second account; both panels show it; reserve the rest (listing leaves the map, buyer row stays); cancel from the buyer panel and watch it leave the seller panel; click the basket marker.

## Refactor gate

Seller and buyer list/row files share no conditional on role; each file ≤~100 LOC. Report outcome.

## Git workflow

```bash
git checkout feat/plans-lean-ui && git pull
git checkout -b feat/lean-ui-buyer-list
```

```text
feat(listings): list and cancel a buyer's reservations in the buyer panel
```
