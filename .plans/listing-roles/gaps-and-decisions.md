---
name: Listing Roles — Gaps and Decisions
overview: "Settled decisions and deferred items for the buyer/seller split and automatic lifecycle."
isProject: false
---

# Listing Roles — Gaps and Decisions

**Architecture:** [00-architecture.md](00-architecture.md) · **Rollout:** [01-rollout.md](01-rollout.md)

## Settled

| # | Decision |
| --- | --- |
| D1 | Role is derived from ownership (`session.user.id === listing.seller_id`) in one dispatcher, `ListingDetail`. The dialog `kind` stays `"detail"`. |
| D2 | Seller container is read-only: summary, own contact note, reservation list. No actions. |
| D3 | Seller sees reservations as egg count, time and status only. `reservation` has `buyer_id` only, so no buyer contact is shown. |
| D4 | Visibility is enforced in `listings_near` (`status='active' and egg_count>0 and expires_at>now()`), not by cron. |
| D5 | Reserve RPCs reject expired or not-active listings server-side. |
| D6 | Buyer cancel returns eggs; the listing reappears until it expires. |
| D7 | `expire_listings()` cron stays (cleanup only). |
| D8 | Remove `mark_listing_sold`, `mark_listing_cancelled`, `listing_expires_at_bound` and their client wrappers. |
| D9 | A deep link to a hidden listing renders `listing.notFound` for everyone, owner included. Owners reach their own visible listing via the map. |

## Deferred

- Seller notifications (push/email) on reservation.
- Reservation expiry earlier than listing expiry (no-show handling).
- Archival/deletion of old listing rows.
- Dropping `sold`/`cancelled` from the DB status check constraint (left in place; unused).
- A "my listings" entry point in `FarmerTab` (an owner can't open a hidden listing; see D9).

## Overlap

- [egg-pricing](../egg-pricing/) built the carton reserve flow and the shared detail dialog; this suite builds on them. Do not edit their plan files.
