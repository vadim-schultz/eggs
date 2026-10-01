---
name: "Chapter 7 — Post form Chakra + PostFormField"
overview: "Replace raw labels in PostListing with PostFormField (Field.Root/Label/Input/ErrorText); remove FieldError duplication."
todos:
  - id: post-chakra
    content: "PostFormField + migrate post listing fields"
    status: pending
isProject: false
---

# Chapter 7 — Post form Chakra + PostFormField

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-chakra-post-form` · **Status:** planned

**Depends on:** [6](06-listing-summary-line.md) optional · **Architecture:** [../00-architecture.md](../00-architecture.md) §5, D5 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Complete Chakra-only markup for the post listing form: no raw `<label htmlFor=…>`; DRY repeated field blocks via
`PostFormField`.

## Design decisions

**PostFormField** (`src/features/listings/components/PostListing/PostFormField.tsx`):

- Props: `labelKey`, `errorKey?: ListingErrorKey`, `children` **or** built-in `Input`/`Textarea` via `multiline?: boolean`
- Uses `Field.Root invalid={Boolean(errorKey)}`, `Field.Label`, `Field.ErrorText` with `t(errorKey)`
- Match [LocationPicker.tsx](../../../src/features/location/components/LocationPicker/LocationPicker.tsx) spacing (`Stack gap`)

**Migrate fields:** egg count (number `Input`), price (number `Input`), note (`Textarea`), contact note
(`Textarea`). Keep `UnitSelect` and `LocationPicker` as-is.

**Remove** [FieldError.tsx](../../../src/features/listings/components/PostListing/FieldError.tsx) when subsumed by `PostFormField`.

**Tests:** add `PostListing · has no native <label> elements` mirroring LocationPicker — assert
`container.querySelectorAll('label:not([data-scope="field"])')` has length 0 (Chakra `Field.Label` renders
`label[data-scope="field"]`).

## Files

**Add:** `PostFormField.tsx`, `PostFormField.test.tsx` under `PostListing/`

**Edit:** `src/features/listings/components/PostListing/PostListingForm.tsx`

**Edit tests:** `src/features/listings/containers/PostListing.test.tsx`

**Delete:** `FieldError.tsx` if fully replaced

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `PostListing · still submits the chosen unit value` + full create_listing test | Behavior unchanged |
| **Negative:** `PostListing · has no native <label> elements` | `label:not([data-scope="field"])` count 0 |
| **Negative:** `PostListing · shows the field validation message from validateListingInput` | Errors via Field.ErrorText |

## Green

1. Implement PostFormField + tests.
2. Replace four label/input/error blocks in `PostListingForm`.
3. `./ci.sh`.

## Refactor gate

PostFormField handles Input vs Textarea with one prop (`multiline?: boolean`) — **max two variants**, no generic
form builder. Report outcome.

## Verification

```bash
npm run test -- --run src/features/listings/containers/PostListing.test.tsx src/features/listings/components/PostListing/PostFormField.test.tsx
./ci.sh
npm run dev
# manual: /post dialog — fields look like LocationPicker focus/error styling
```

## Out of scope

Replacing `<form>` with Chakra-only submission; changing UnitSelect.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-chakra-post-form
```

```text
test(web): post listing has no native label elements

feat(web): PostFormField and Chakra fields on post listing form
```
