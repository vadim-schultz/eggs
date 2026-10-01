---
name: "Chapter 4 — Listing read services"
overview: "Introduce listingsApi read helpers (fetchListing, fetchListingContact) and unit-test them; wire ContactReveal and ListingDetail hooks to call services instead of inline supabase."
todos:
  - id: read-api
    content: "fetchListing + fetchListingContact in services/listingsApi.ts"
    status: pending
isProject: false
---

# Chapter 4 — Listing read services

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-listing-read-services` · **Status:** planned

**Depends on:** [3](03-listing-types-utils.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Centralize read-only Supabase access for a single listing row and `listing_contact` so components and hooks
stop embedding `.from(…).select(…)` calls.

## Design decisions

**Service functions return discriminated results**, not thrown errors — match today’s “null listing” and
“empty contact” UI:

- `fetchListing(id)` → `{ listing: Listing | null }` (same as current `.single()` null handling)
- `fetchListingContact(listingId)` → `{ contact: { contact_note: string } | null }`

**Hooks may still live in component files until chapters 7 and 9** extract them — this chapter adds the
service and switches the inline queries to call it.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/features/listings/services/listingsApi.ts` | read helpers |
| `src/features/listings/services/listingsApi.test.ts` | mocked supabase |

**Edit:**

| Path | Change |
| --- | --- |
| `src/components/ContactReveal.tsx` | call `fetchListingContact` |
| `src/routes/ListingDetail.tsx` | `useListing` calls `fetchListing` |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `listingsApi · fetchListing returns row when supabase resolves data` | Mapped `Listing` returned |
| **Negative:** `listingsApi · fetchListing returns null when supabase returns no row` | No throw; null listing |

Existing `ListingDetail · shows the not-found message when the listing can't be loaded` remains the
integration regression after wiring.

## Green

1. Implement `listingsApi.ts` with mocked tests.
2. Replace inline queries in ContactReveal and ListingDetail `useListing`.
3. Full suite green.

## Refactor gate

Service file stays a thin wrapper — no branching explosion. Report outcome.

## Verification

```bash
npm run test -- --run src/features/listings/services
npm run test -- --run src/routes/ListingDetail.test.tsx src/components/ContactReveal.test.tsx
./ci.sh
```

## Out of scope

Extracting `useListing` / `useListingContact` to `hooks/` — chapters 7 and 9.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-listing-read-services
```

```text
test(web): listingsApi read helpers with mocked supabase

refactor(web): route listing reads through listingsApi
```
