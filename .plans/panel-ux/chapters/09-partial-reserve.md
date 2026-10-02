---
name: "Chapter 9 — Partial reserve"
overview: "Migration + reserve_listing quantity; ReserveAmountControl; trigger inventory D9."
todos:
  - id: reserve
    content: "supabase + API + UI + rls-smoke"
    status: pending
isProject: false
---

# Chapter 9 — Partial reserve

**Branch:** `feat/eggs-panel-partial-reserve` · **Depends on:** ch.3, ch.6

---

## Goal

Buyers choose **quantity** (slider 1…listing max) with Braille preview; backend stores partial reserve and **decrements listing `egg_count`** per D9.

## Database (new migration)

| Change | Detail |
| --- | --- |
| `reservation` | Add `egg_count int not null`, `unit` matching listing (check &gt; 0) |
| `reserve_listing` | Replace signature with `(p_listing_id uuid, p_egg_count int)`; validate active listing and count |
| Listing update | Subtract `p_egg_count` from `listing.egg_count` in same transaction as insert |
| Trigger | **`handle_reservation_status_change`:** set listing **`reserved`** only when `listing.egg_count` becomes **0** after reserve; keep **`active`** when remainder &gt; 0. On cancel: restore `egg_count`, set listing **`active`** when appropriate |
| RLS / grants | Update smoke expectations in `supabase/` tests if present |

## Frontend

| Path | Layer |
| --- | --- |
| `src/features/listings/services/listingsApi.ts` | service |
| `src/features/listings/components/ReserveButton/ReserveAmountControl.tsx` | component |
| `src/features/listings/components/ReserveButton/ReserveButton.tsx` | component |
| `src/features/listings/components/ReserveButton/*.test.tsx` | test |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** reserve API called with selected egg count; UI shows slider + Braille | |
| **Negative:** cannot submit reserve with count 0 or above listing max | |

## Green

Implement; `./ci.sh`; PR must pass **rls-smoke**.

## Refactor gate

`ReserveButton` folder + RPC migration — report outcome.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-panel-partial-reserve
```

```text
feat(reserve): partial listing reservation with inventory
```
