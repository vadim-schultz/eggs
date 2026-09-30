---
name: "Chapter 2 — Component hygiene"
overview: "Replace every raw HTML form element (label, select, input) in PostListing.tsx and LocationPicker.tsx with the Chakra equivalents already used elsewhere in the app, and give StatusBadge a compact size — no new UI surface, purely a cleanup pass ahead of chapters 4 and 5 building on these same components."
todos:
  - id: post-listing-select
    content: "PostListing.tsx unit <select> -> Select (not NativeSelect, see Implementation notes)"
    status: done
  - id: location-picker-fields
    content: "LocationPicker.tsx labels/inputs -> Field.Root + Input"
    status: done
  - id: badge-size
    content: "StatusBadge -> compact size (xs, not sm, see Implementation notes)"
    status: done
isProject: false
---

# Chapter 2 — Component hygiene

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-component-hygiene` · **Status:** in review

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
| `src/routes/PostListing.tsx` | Unit `<select>`/`<label>` → `UnitSelect` (see below) |
| `src/components/UnitSelect.tsx` *(new, not originally planned, see Implementation notes)* | `Select.Root`/`Label`/`Control`/`Trigger`/`ValueText`/`IndicatorGroup`/`Indicator`/`Positioner`/`Content`/`Item`/`ItemText`/`ItemIndicator` — Chakra's from-scratch listbox `Select`, not `NativeSelect` |
| `src/components/LocationPicker.tsx` | Every `<label>`/`<input>` pair → `Field.Root`/`Field.Label` + `Input` |
| `src/components/StatusBadge.tsx` | `<Badge colorPalette={...}>` → `<Badge colorPalette={...} size="xs">` |
| `src/test/setup.ts` *(not originally planned, see Implementation notes)* | `scrollTo`/pointer-capture polyfills `Select` needs under jsdom |
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

**Outcome:** the unit `Select` composition (`Root`/`Label`/`Control`/`Trigger`/`ValueText`/
`IndicatorGroup`/`Indicator`/`Positioner`/`Content`/`Item`/`ItemText`/`ItemIndicator`) is
substantially more markup than a raw `<select>` or `NativeSelect`, so it was extracted into its own
`src/components/UnitSelect.tsx` (~45 LOC, single responsibility, no branching) rather than left
inline — `PostListing.tsx` ends at 174 LOC, a handful shorter than its pre-chapter 180, so it stays
under the refactor gate. `LocationPicker.tsx` is 125 LOC (was 128) — the `Field.Root` wrapper adds a
line per field but dropping the manual `id`/`htmlFor` pair removes one, roughly a wash. `StatusBadge`
is unchanged in shape (27 LOC, one added prop). No method or class crossed the Sandi Metz thresholds.

## Implementation notes

Two corrections to this doc's own design decisions, both caught before writing code:

**`NativeSelect` is not what "no native `<select>` element" needs — full `Select` is.** The design
decision above named `NativeSelect` (matching `Home.tsx`'s radius selector) as the target, and the
red test table asks for "no native `<select>` element." These two are in tension:
`NativeSelect.Field` renders `Field.Select` from `@ark-ui/react`, which is `ark.select` — a real
`<select>` tag, just styled (verified by rendering it and inspecting the DOM: `<select id="_r_0_"
data-scope="field" data-part="select" ...>`). No amount of Chakra styling around a native `<select>`
makes it not a native `<select>`. Chakra's actual from-scratch listbox component is `Select`
(`Select.Root`/`Control`/`Trigger`/`Positioner`/`Content`/`Item`, built on `@ark-ui/react/select`'s
combobox pattern) — this renders zero `<select>` tags as long as `Select.HiddenSelect` (an opt-in
native-select mirror for form autofill) is omitted, which it is here since the field is a plain
controlled value, not relying on native form submission. `PostListing`'s unit field uses `Select`,
not `NativeSelect`; `Home.tsx`'s radius selector is untouched and still uses `NativeSelect` — that
inconsistency is intentional and out of scope for this chapter (Home's selector wasn't named in the
red tests or the Files table).

Testing `Select` needed two additions to `src/test/setup.ts`: `Element.prototype.scrollTo`,
`hasPointerCapture`/`setPointerCapture`/`releasePointerCapture` polyfills, since jsdom doesn't
implement them and the underlying Zag.js state machine calls them while opening/positioning the
listbox. `Select`'s open/select transitions are also asynchronous (confirmed by probing: `aria-expanded`
doesn't flip until a microtask after the trigger click), so tests drive it with
`await act(async () => { await vi.advanceTimersByTimeAsync(0); })` rather than `waitFor` — the test
file already runs under `vi.useFakeTimers()` for `LocationPicker`'s debounce, and RTL's `waitFor`
polls with real timers, which never fire once timers are faked.

**Chakra's `Badge` `size="sm"` is already the default — `xs` is the actually-compact one.** The
design decision called `size="sm"` "Chakra `Badge`'s smallest built-in size," but the recipe
(`badgeRecipe.defaultVariants`) is `{ variant: "subtle", size: "sm" }` and defines `xs` below it —
so adding `size="sm"` explicitly would have been a no-op, not a fix for "available badges should be
small." Confirmed with the user; switched to `size="xs"`.

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
