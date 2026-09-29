---
name: "Chapter 2 — Component hygiene"
overview: "Replace every raw HTML form element (label, select, input) in PostListing.tsx and LocationPicker.tsx with the Chakra equivalents already used elsewhere in the app, and give StatusBadge a compact size — no new UI surface, purely a cleanup pass ahead of chapters 4 and 5 building on these same components."
todos:
  - id: post-listing-select
    content: "PostListing.tsx unit <select> -> NativeSelect"
    status: pending
  - id: location-picker-fields
    content: "LocationPicker.tsx labels/inputs -> Field.Root + Input"
    status: pending
  - id: badge-size
    content: "StatusBadge -> compact size"
    status: pending
isProject: false
---

# Chapter 2 — Component hygiene

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-component-hygiene` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §5 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Close the gap between "always lean on Chakra's own components" and what's actually in the two
forms that mix native HTML elements with Chakra ones today — before chapters 4 and 5 embed these
same components inside the floating panel's tabs, where the inconsistency would be more visible,
not less.

## Design decisions

**Follow the pattern `Home.tsx` already uses, don't invent a new one.** `Home.tsx`'s radius
selector (`Field.Root` + `Field.Label` + `NativeSelect.Root`/`Field`/`Indicator`, `src/routes/Home.tsx:64-79`)
is the correct, already-working example in this codebase. `PostListing.tsx`'s unit `<select>`
(`src/routes/PostListing.tsx:128-138`) and every `<label htmlFor=...>` + `<Input>` pair in
`LocationPicker.tsx` (`src/components/LocationPicker.tsx:79-90, 114-119`) are rewritten to match it
— `Field.Root`/`Field.Label` in place of bare `<label>`, `NativeSelect` in place of `<select>`. No
new validation or interaction behavior — this chapter changes markup, not logic.

**`StatusBadge` needs a size change only, not a rewrite.** It already uses Chakra `Badge` with
`colorPalette` (`src/components/StatusBadge.tsx:23`) — the only gap versus the brief ("available
badges should be small") is the default size. Add `size="sm"` (Chakra `Badge`'s smallest built-in
size) to the existing `<Badge>` call.

## Files

**Edit:**

| Path | Change |
| --- | --- |
| `src/routes/PostListing.tsx` | Unit `<select>`/`<label>` → `Field.Root`/`Field.Label` + `NativeSelect` |
| `src/components/LocationPicker.tsx` | Every `<label>`/`<input>` pair → `Field.Root`/`Field.Label` + `Input` |
| `src/components/StatusBadge.tsx` | `<Badge colorPalette={...}>` → `<Badge colorPalette={...} size="sm">` |
| `src/routes/PostListing.test.tsx`, `src/components/LocationPicker.test.tsx` *(new)*, `src/components/StatusBadge.test.tsx` | Tests below |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| `PostListing · unit field has no native <select> element` | Query by tag, expect none |
| `PostListing · still submits the chosen unit value` | Regression — behavior unchanged after the markup swap |
| `LocationPicker · has no native <label> elements` | Query by tag, expect none |
| `LocationPicker · manual lat/lng inputs still call onConfirm with parsed numbers` | Regression |
| `StatusBadge · renders with the compact size prop` | Snapshot/prop assertion |

## Green

1. `StatusBadge` size prop; test 5.
2. `LocationPicker` Chakra `Field`/`Input` swap; tests 3–4 (existing behavior tests continue passing
   unmodified — this is the regression check that the swap didn't change behavior).
3. `PostListing` Chakra `NativeSelect` swap; tests 1–2 (existing tests continue passing unmodified).

## Refactor gate

No component grows past its current size from this change — it's a like-for-like markup swap.
Report the outcome.

## Verification

```bash
npm run test -- --run
./ci.sh
npm run dev
# manual: open /post signed in, confirm the unit selector and location fields look and behave
# identically to before, just via Chakra's own focus/validation styling
```

## Out of scope

Any new field, validation rule, or visual redesign of these forms beyond the component swap —
their layout inside the farmer tab / post dialog is chapters 5 and 6.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-ui-component-hygiene
```

```text
test(web): describe the Chakra-only PostListing and LocationPicker markup

feat(web): replace native form elements with Chakra Field/NativeSelect/Input
```
