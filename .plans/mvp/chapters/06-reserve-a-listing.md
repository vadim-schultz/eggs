---
name: "Chapter 6 — Reserve a listing"
overview: "reserve_listing and cancel_reservation RPCs, the Reserve button and its confirmation, and the contact_note reveal on ListingDetail once a buyer has an active reservation."
todos:
  - id: rpcs
    content: "reserve_listing(listing_id) and cancel_reservation(reservation_id) SQL functions"
    status: pending
  - id: reserve-ui
    content: "Reserve button, confirmation, already-reserved state"
    status: pending
  - id: reveal
    content: "Contact reveal for buyer (active reservation) and seller"
    status: pending
isProject: false
---

# Chapter 6 — Reserve a listing

**Repo:** `eggs` (`src/`, `supabase/`) · **Branch:** `feat/eggs-reserve-a-listing` · **Status:** planned

**Depends on:** [4](04-post-a-listing.md), [5](05-browse-and-map.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §5, §8 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

A signed-in buyer can claim a whole listing and immediately see how to arrange pickup; the seller can see
who reserved and the same contact note they wrote. This is the payoff of chapter 2's trigger and RLS —
"reserved" is now something a person can actually do.

## Design decisions

**`reserve_listing`/`cancel_reservation` RPCs wrap plain RLS-governed inserts/updates**, not a
`SECURITY DEFINER` bypass — they exist for a friendlier error than a raw unique-constraint violation
("this listing was just reserved by someone else" instead of a Postgres error code) and so the frontend has
one call instead of an insert-then-check dance. `reserve_listing(p_listing_id)` inserts a `reservation` row
for `auth.uid()`; the chapter 2 trigger flips the listing to `'reserved'`. `cancel_reservation(p_reservation_id)`
sets the reservation `'cancelled'`; the trigger's cancel path reopens the listing to `'active'` — both
functions are `SECURITY INVOKER`, so RLS (buyer or seller may act) still applies underneath them.

**The Reserve button is a component-level check, not a route guard.** `ListingDetail` must still render for
anonymous visitors (browsing stays public, invariant 3); `useSession` inside the button decides between
"Reserve" (signed in, listing active), "Sign in to reserve" (signed out), and "Reserved" (already taken) —
the page itself is never gated.

**Contact reveal is conditional rendering off the query result, not a second fetch triggered by success.**
`ListingDetail` selects `listing_contact` for the current id alongside the listing; RLS (§8, chapter 2)
returns a row only if the caller is the seller or a buyer with an active reservation — an empty result
means "not visible to you yet," which the component renders as nothing (not an error), so the same code
path handles "not reserved," "someone else reserved it," and "I reserved it" correctly without a client-side
role check duplicating what RLS already decided.

**Cancelling is available to both parties.** A buyer can cancel their own reservation (changes their mind);
a seller can cancel a reservation on their own listing (e.g., the buyer never showed up) — both go through
the same `cancel_reservation` RPC, and RLS decides who may act on which row.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `supabase/migrations/<ts>_reservation_rpcs.sql` | `reserve_listing`, `cancel_reservation` |
| `src/components/ReserveButton.tsx` | Three-state button described above |
| `src/components/ContactReveal.tsx` | Renders `listing_contact.contact_note` when the query returns a row |
| `src/components/ReserveButton.test.tsx`, `src/components/ContactReveal.test.tsx`, `src/routes/ListingDetail.test.tsx` | Tests below |
| `scripts/rls-smoke.ts` | Extend with the RPC cases below |

**Edit:**

| Path | Change |
| --- | --- |
| `src/routes/ListingDetail.tsx` | Mount `ReserveButton` and `ContactReveal` |
| `src/i18n/strings.de.ts` | `reserve.*` keys (button states, confirmation, cancel) |

## Manual configuration

None. Both RPCs ship as a versioned migration, applied the same way as chapters 2 and 4.

## Red tests

**Vitest:**

| Test | Asserts |
| --- | --- |
| `ReserveButton · shows "Sign in to reserve" with no session` | Signed-out state |
| `ReserveButton · shows "Reserve" and calls the reserve_listing RPC on click when active and signed in` | Mocked client |
| `ReserveButton · shows a disabled "Reserved" state when the listing status is reserved` | Positive |
| `ReserveButton · shows a Cancel action for the buyer's own active reservation` | Buyer path |
| `ContactReveal · renders nothing when the query returns no listing_contact row` | Not-visible-yet case |
| `ContactReveal · renders the contact_note when a row is returned` | Reveal case |
| `ListingDetail · seller sees the contact reveal for their own listing regardless of reservation` | Seller path |

**Smoke script addition:**

| Case | Asserts |
| --- | --- |
| `reserve_listing` by user B on A's active listing succeeds and the listing's `status` becomes `'reserved'` | RPC + trigger |
| `reserve_listing` by user C on the same (now reserved) listing fails with a friendly error | Guard, wrapping chapter 2's unique-index case |
| `cancel_reservation` by user B reopens the listing to `'active'` | Trigger cancel path |
| `cancel_reservation` by user D (neither buyer nor seller) on B's reservation is rejected | RLS ownership |

## Green

1. `reserve_listing` + `cancel_reservation` RPCs; smoke script cases.
2. `ReserveButton`; tests 1–4.
3. `ContactReveal`; tests 5–7.
4. Wire both into `ListingDetail.tsx`.

## Refactor gate

`ReserveButton`'s three states stay one small conditional, not a state machine library; `ContactReveal`
stays a single query + conditional render, no local caching beyond what the Supabase client already does.
Report the outcome.

## Verification

```bash
npm run test -- --run
./ci.sh
supabase start && supabase db reset
npx tsx scripts/rls-smoke.ts
npm run dev
# manual: as buyer, reserve a listing, confirm the contact note appears; as a third account, confirm
# the same listing shows "Reserved" and no contact note; cancel as buyer, confirm it reopens
```

## Out of scope

Marking a listing `sold` (chapter 7), expiry (chapter 7), in-app messaging beyond the one-time reveal
(deferred, D4), partial-quantity reservations (deferred, D3).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-reserve-a-listing
```

```text
test(web): describe reserve/cancel RPCs and the contact reveal

feat(web): add reserve/cancel flow and conditional contact reveal
```
