---
name: Frontend DRY and Chakra — Architecture
overview: "Reduce repeated Supabase lifecycle, mutation busy/error, and listing copy patterns; finish Chakra-only form markup (Field.Root, no raw label/input). Independently shippable after or alongside frontend-structure."
isProject: false
---

# Frontend DRY and Chakra — Architecture

**Rollout:** [01-rollout.md](01-rollout.md) · **Decisions:** [gaps-and-decisions.md](gaps-and-decisions.md) · **Chapters:** [chapters/](chapters/)

---

## 1. Why

The [frontend-structure](../frontend-structure/00-architecture.md) audit moved files into feature folders but
explicitly deferred DRY abstractions (no form-field factory, no TanStack Query). The codebase still repeats:

- Mount-fetch hooks with `cancelled` guards (`useListing`, `useListingsNear`, `useListingContact`,
  `useActiveReservation`)
- RPC/update handlers with identical `busy` / `error` / `onChange` choreography (`ReserveButton`, `SellerActions`,
  `PostListing`)
- Listing count + unit + price markup in `ListingCard` and `ListingDetail`
- Berlin default center duplicated in `BuyerTab` and `BackgroundMap`
- Raw `<label htmlFor=…>` in [PostListingForm.tsx](../../src/features/listings/components/PostListing/PostListingForm.tsx) while `LocationPicker` already
  uses Chakra `Field.Root`

This folder adds **behavior-preserving** shared helpers and **Chakra-native** form markup. No schema changes.

## 2. Non-goals

- No TanStack Query / React Query adoption (separate initiative; see
  [frontend-structure gaps](../frontend-structure/gaps-and-decisions.md)).
- No custom design system — use `@chakra-ui/react` primitives (`Field`, `Input`, `Textarea`, `Select`,
  `Button`, `Text`, `Stack`). Do **not** rebuild inputs from `Box` + `as="label"`.
- No new user-facing flows (still no “my listings” grid).
- No changes under `supabase/`.

## 3. Prerequisites

[frontend-structure](../frontend-structure/) has landed. Chapter docs use **feature paths** under `src/features/`,
`src/lib/`, and `src/shell/`. Read hooks call `listingsApi` / `browseApi`; do not reintroduce raw Supabase in
components.

## 4. Shared utilities (target)

```text
src/
  lib/
    geo/constants.ts              # DEFAULT_MAP_CENTER (chapter 1)
    async/useSupabaseQuery.ts     # chapter 2
    async/useAsyncAction.ts       # chapter 4
  features/listings/components/
    ListingSummaryLine.tsx        # chapter 6
    PostListing/PostFormField.tsx # chapter 7 (Chakra Field wrapper)
```

## 5. Chakra form convention

Every labeled control uses the pattern already in `LocationPicker` and `BuyerTab`’s radius field:

```tsx
<Field.Root invalid={Boolean(errorKey)}>
  <Field.Label>{t(labelKey)}</Field.Label>
  <Input … />
  {errorKey ? <Field.ErrorText>{t(errorKey)}</Field.ErrorText> : null}
</Field.Root>
```

`PostFormField` parameterizes label key, input type, value, onChange, and optional `ListingErrorKey` — not a
one-off `Box` layout.

## 6. Relationship to ui-overhaul

[ui-overhaul chapter 2](../ui-overhaul/chapters/02-component-hygiene.md) shipped `UnitSelect` (`Select`, not
`NativeSelect`), LocationPicker `Field`, and `StatusBadge` size. **Raw `<label>` on post form egg/price/note/contact
fields remain** — chapter 7 completes that hygiene. Do **not** migrate `RadiusSelect` (`NativeSelect`) in this
folder; any **new** dropdown in these chapters uses Chakra `Select`.

## 7. Verification

Same gate as other plan folders:

```bash
npm run lint && npm run typecheck && npm run test -- --run && npm run build
./ci.sh
```

Each chapter runs the narrowest test glob covering touched modules, then `./ci.sh`.
