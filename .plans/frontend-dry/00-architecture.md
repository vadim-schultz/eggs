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
- Raw `<label htmlFor=…>` in [PostListing.tsx](../../src/routes/PostListing.tsx) while `LocationPicker` already
  uses Chakra `Field.Root`

This folder adds **behavior-preserving** shared helpers and **Chakra-native** form markup. No schema changes.

## 2. Non-goals

- No TanStack Query / React Query adoption (separate initiative; see
  [frontend-structure gaps](../frontend-structure/gaps-and-decisions.md)).
- No custom design system — use `@chakra-ui/react` primitives (`Field`, `Input`, `Textarea`, `NativeSelect`,
  `Button`, `Text`, `Stack`). Do **not** rebuild inputs from `Box` + `as="label"`.
- No new user-facing flows (still no “my listings” grid).
- No changes under `supabase/`.

## 3. Prerequisites

| Chapter block | Works on flat `src/` today | Easier after [frontend-structure](../frontend-structure/) |
| --- | --- | --- |
| 1–2 (constants, `useSupabaseQuery`) | Yes | Paths move to `features/*/hooks` in same PR as migration |
| 3–4 (read hooks, `useAsyncAction`) | Yes | Prefer `listingsApi` / `browseApi` from structure ch. 4–5 |
| 5–6 (mutations, summary line) | Yes | Same |
| 7–8 (Chakra post + seller fields) | Yes | Target `PostListingForm` / `SellerActions` paths post ch. 8–10 |

Chapter docs list **current** paths; after structure lands, update imports in the same implementation PR.

## 4. Shared utilities (target)

```text
src/
  lib/
    geo/constants.ts              # DEFAULT_MAP_CENTER (chapter 1)
    async/useSupabaseQuery.ts     # chapter 2
    async/useAsyncAction.ts       # chapter 4
  components/                     # or features/listings/components after structure
    ListingSummaryLine.tsx        # chapter 6
    PostFormField.tsx             # chapter 7 (Chakra Field wrapper)
```

After [frontend-structure](../frontend-structure/00-architecture.md), prefer `src/lib/async/` for cross-feature
hooks or `src/hooks/` until structure chapter 15 retires it — then `lib/async/` stays as shared infra.

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

[ui-overhaul chapter 2](../ui-overhaul/chapters/02-component-hygiene.md) shipped `UnitSelect`, LocationPicker
`Field`, and `StatusBadge` size. **Raw `<label>` on PostListing egg/price/note/contact fields remain** — chapter
7 here completes that hygiene without re-opening radius `NativeSelect` vs `Select` decisions.

## 7. Verification

Same gate as other plan folders:

```bash
npm run lint && npm run typecheck && npm run test -- --run && npm run build
./ci.sh
```

Each chapter runs the narrowest test glob covering touched modules, then `./ci.sh`.
