---
name: "Chapter 4 — Post a listing"
overview: "The PostListing form (egg count, unit, price, location text, note, contact note), Nominatim geocoding from free-text location to lat/lng, and a create_listing RPC that inserts listing + listing_contact atomically."
todos:
  - id: rpc
    content: "create_listing(...) SQL function, listing + listing_contact in one transaction"
    status: pending
  - id: geocode
    content: "Nominatim lookup, debounced, with a manual-pin fallback"
    status: pending
  - id: form
    content: "PostListing form + validation + submit"
    status: pending
isProject: false
---

# Chapter 4 — Post a listing

**Repo:** `eggs` (`src/`, `supabase/`) · **Branch:** `feat/eggs-post-a-listing` · **Status:** planned

**Depends on:** [2](02-schema-and-rls.md), [3](03-auth.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §5, §8 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

A signed-in seller can turn "I have 2 dozen eggs, €4, pick up near the market" into a row the rest of the
app can show and reserve — the first write path in the app, and the one every RLS policy in chapter 2 was
designed against.

## Design decisions

**One RPC, not two client-side inserts.** `listing` and `listing_contact` are separate tables (§5, §8), but
a seller experiences "post a listing" as one action. `create_listing(p_egg_count, p_unit, p_price_cents,
p_location, p_location_label, p_note, p_contact_note)` is `SECURITY INVOKER` (still fully subject to RLS —
it runs as the calling `authenticated` user, so it cannot be used to post as someone else) and wraps both
inserts in one transaction: either both rows exist or neither does. This avoids a half-created listing if
the second insert fails.

**Geocoding is free text → a pin, not a full address form.** The seller types a place ("Downtown, near the
market" or a postcode); the form calls OSM Nominatim (`/search?format=json&q=...`, debounced ~500ms) and
shows candidate results on a small preview map for the seller to confirm/adjust before submit — the raw
Nominatim result is never submitted uncomfirmed. `location_label` stores exactly what the seller typed
(free text, shown to buyers); `location` stores the confirmed `geography(Point)`. If geocoding returns
nothing, the seller can drop a pin manually on the preview map — no third-party geocoder with a key is
ever required (invariant 2).

**Validation is a pure function** (`validateListingInput`), not scattered in the form's `onChange`
handlers: `egg_count > 0`, `price_cents >= 0`, `location_label` and `contact_note` non-empty after trim.
Testable without rendering the form.

**Redirect on success, not an inline success state.** After `create_listing` resolves, navigate to
`/listings/:id` for the new row — the seller immediately sees their listing the way a buyer will.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `supabase/migrations/<ts>_create_listing_rpc.sql` | `create_listing(...)` function |
| `src/lib/geocode.ts` | `searchPlace(query)` → Nominatim candidates |
| `src/lib/validateListingInput.ts` | Pure validation |
| `src/routes/PostListing.tsx` | Form: count, unit, price, location search + preview map, note, contact note |
| `src/lib/validateListingInput.test.ts`, `src/lib/geocode.test.ts`, `src/routes/PostListing.test.tsx` | Tests below |
| `scripts/rls-smoke.ts` | Extend with the `create_listing` cases below |

**Edit:** `src/i18n/strings.de.ts` — `post.*` keys (labels, validation messages, submit button).

## Manual configuration

None. `create_listing` ships as a versioned migration, applied the same way as chapter 2's schema.
Nominatim is a public endpoint with no key or account.

## Red tests

**Vitest:**

| Test | Asserts |
| --- | --- |
| `validateListingInput · rejects egg_count <= 0` | Negative |
| `validateListingInput · rejects negative price_cents` | Negative |
| `validateListingInput · rejects an empty location_label or contact_note after trim` | Negative |
| `validateListingInput · accepts a well-formed input` | Positive |
| `searchPlace · maps a Nominatim result to {label, lat, lng}` | Mocked `fetch` |
| `searchPlace · returns an empty array on no results` | Mocked `fetch` |
| `PostListing · disables submit until a location is confirmed` | Form state |
| `PostListing · shows the field validation message from validateListingInput` | Wiring |
| `PostListing · calls supabase.rpc("create_listing", ...) with the confirmed fields and navigates to the new listing` | Mocked client + router |
| `PostListing · redirects to "/" when rendered without a session` | Belt-and-suspenders alongside `RequireAuth` (chapter 3) |

**Smoke script addition:**

| Case | Asserts |
| --- | --- |
| `create_listing` as signed-in user A creates one `listing` row owned by A and one matching `listing_contact` row | Atomic insert |
| `create_listing` with `p_egg_count = 0` is rejected | DB-level check constraint, defense in depth under the form's own validation |

## Green

1. `create_listing` RPC migration; smoke script cases.
2. `validateListingInput`; tests 1–4.
3. `geocode.ts`; tests 5–6.
4. `PostListing` form wired to both; tests 7–10.

## Refactor gate

`PostListing` delegates validation and geocoding to the two pure/async helpers rather than inlining
either; the component itself stays presentation + submit-handler wiring. Report the outcome.

## Verification

```bash
npm run test -- --run
./ci.sh
supabase start && supabase db reset
npx tsx scripts/rls-smoke.ts
npm run dev
# manual: sign in, post a listing with a real place name, confirm the pin, submit, land on its detail page
```

## Out of scope

Showing the listing to other users (chapter 5), editing or cancelling a posted listing (mentioned in §9,
not built until a seller-facing "my listings" view is requested — tracked as an open seam), photo upload
(deferred, D8).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-post-a-listing
```

```text
test(web): describe listing validation, geocoding and the post form

feat(web): add create_listing RPC and the post-a-listing flow
```
