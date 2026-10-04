---
name: "Chapter 1 — Price per egg data"
overview: "Migrate listing price to price_per_egg_cents (rename + backfill), update RPCs, seed, smoke script, frontend types/mappers/validation, and add carton helpers."
todos:
  - id: migration
    content: "Migration: rename column, backfill, recreate create_listing and listings_near; seed + rls-smoke"
    status: pending
  - id: types
    content: "Listing, ListingInput, CreateListingArgs, mappers and validation use per-egg price"
    status: pending
  - id: carton-utils
    content: "utils/carton.ts: CARTON_SIZES, cartonPriceCents, isCartonAvailable"
    status: pending
  - id: strings
    content: "Price labels say 'pro Ei'"
    status: pending
isProject: false
---

# Chapter 1 — Price per egg data

**Repo:** `eggs` · **Branch:** `feat/eggs-pricing-data` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

A listing stores the price of **one egg**. Every layer (SQL, RPC args, types, form mapping, validation) speaks `price_per_egg_cents`, and pure helpers exist for carton maths so later chapters never re-derive it.

## Design decisions

**Migration** `supabase/migrations/<timestamp>_price_per_egg.sql` ([gaps D2](../gaps-and-decisions.md)):

1. `alter table public.listing rename column price_cents to price_per_egg_cents;`
2. Backfill: `round(price_cents / nullif(egg_count × (case unit when 'dozen' then 12 else 1 end), 0))`, `coalesce(…, 0)`. Must run before the rename's meaning changes — do the arithmetic in a single `update` using the old values, then rename (or compute into the renamed column in one statement).
3. `drop function create_listing(...)` and recreate with `p_price_per_egg_cents`; re-grant to `authenticated`.
4. `drop function listings_near(...)` and recreate returning `price_per_egg_cents`; re-grant to `anon, authenticated`.

Existing migrations are never edited. Update [`seed.sql`](../../../supabase/seed.sql) (insert column name and per-egg values) and [`scripts/rls-smoke.ts`](../../../scripts/rls-smoke.ts) (`price_cents` → `price_per_egg_cents`, `p_price_cents` → `p_price_per_egg_cents`).

**Frontend rename:** `Listing.price_cents` → `price_per_egg_cents` ([`listing.ts`](../../../src/features/listings/types/listing.ts)); `ListingInput.priceCents` → `pricePerEggCents`; `CreateListingArgs.p_price_cents` → `p_price_per_egg_cents` ([`listingsApi.ts`](../../../src/features/listings/services/listingsApi.ts)); [`postListingMappers.ts`](../../../src/features/listings/utils/postListingMappers.ts); [`validateListingInput.ts`](../../../src/features/listings/utils/validateListingInput.ts) (error key `post.errors.priceCents` stays but copy says per egg). Display call sites ([`ListingCardSummary`](../../../src/features/listings/components/ListingCardSummary.tsx), [`ListingDetailView`](../../../src/features/listings/components/ListingDetail/ListingDetailView.tsx)) keep calling `formatPrice` with the renamed field; their label becomes "Preis pro Ei".

**Carton helpers** in `src/features/listings/utils/carton.ts`:

```ts
export const CARTON_SIZES = [6, 10] as const;
export type CartonSize = (typeof CARTON_SIZES)[number];
export function cartonPriceCents(perEggCents: number, size: CartonSize): number;
export function isCartonAvailable(remaining: number, size: CartonSize): boolean; // remaining >= size
```

**Strings:** `post.price.label` → "Preis pro Ei (€)"; `listing.price.label` → "Preis pro Ei".

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `supabase/migrations/<ts>_price_per_egg.sql` | db | Rename, backfill, recreate RPCs |
| `supabase/seed.sql` | db | New column name and per-egg values |
| `scripts/rls-smoke.ts` | db | New column / arg names |
| `src/features/listings/types/{listing,listingInput}.ts` | listings | Rename fields |
| `src/features/listings/services/listingsApi.ts` | listings | `CreateListingArgs` |
| `src/features/listings/utils/{postListingMappers,validateListingInput}.ts` | listings | Rename |
| `src/features/listings/utils/carton.ts` (+ test) | listings | Carton helpers |
| `src/i18n/strings.de.ts` | i18n | Labels |
| existing tests / fixtures | test | `price_cents` → `price_per_egg_cents` |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `cartonPriceCents(35, 6)` = 210 and `(35, 10)` = 350 | |
| **Negative:** `cartonPriceCents(-1, 6)` throws (or is rejected by the type contract chosen) | |
| **Happy:** `isCartonAvailable(10, 10)` and `(12, 6)` are `true` | |
| **Negative:** `isCartonAvailable(5, 6)` and `(0, 10)` are `false` | |
| **Happy:** `toListingInput` converts `"0.35"` € → `pricePerEggCents` 35; `toCreateListingArgs` emits `p_price_per_egg_cents` | |
| **Negative:** `validateListingInput` rejects a negative per-egg price with `post.errors.priceCents` | |
| **Happy:** `scripts/rls-smoke.ts` passes after `supabase db reset` | |

## Green

Implement; `supabase db reset` locally; `./ci.sh`.

## Refactor gate

`carton.ts` stays pure and ≤~30 LOC; no call site computes `price × count` inline — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-pricing && git pull
git checkout -b feat/eggs-pricing-data
```

```text
feat(listings): store price per egg and add carton helpers
```
