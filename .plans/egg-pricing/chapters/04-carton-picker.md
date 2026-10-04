---
name: "Chapter 4 — Carton picker"
overview: "CartonPicker: 4-column grid with two radios and 6/10-egg cartons (2 rows, theme-coloured eggs), per-carton price in xs under each."
todos:
  - id: eggs
    content: "CartonEggs: 2-row multi-coloured egg grid"
    status: pending
  - id: option
    content: "CartonOption: radio, eggs, xs price, disabled state"
    status: pending
  - id: picker
    content: "CartonPicker: 4-column grid RadioGroup"
    status: pending
  - id: strings
    content: "carton.* strings"
    status: pending
isProject: false
---

# Chapter 4 — Carton picker

**Repo:** `eggs` · **Branch:** `feat/eggs-pricing-carton-picker` · **Status:** planned

**Depends on:** [1](01-price-per-egg-data.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §5 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

A self-contained, presentational component that lets the buyer choose a 6- or 10-egg carton and see what each costs. Not yet wired into reserve (chapter 6).

## Design decisions

Directory `src/features/listings/components/CartonPicker/` with barrel `index.ts`.

**`CartonPicker`** — Chakra `RadioGroup.Root` (value = `String(size)`) containing a `Grid` with `templateColumns="auto 1fr auto 1fr"` and `alignItems="center"`: for each size in `CARTON_SIZES` two cells (radio, carton) ([gaps D3–D4](../gaps-and-decisions.md)). Props:

```ts
interface CartonPickerProps {
  remaining: number;        // listing.egg_count
  pricePerEggCents: number;
  currency: string;
  value: CartonSize | null;
  onChange: (size: CartonSize) => void;
}
```

**`CartonOption`** — radio item in the first cell; a `<label>` in the second cell wrapping `CartonEggs` and the price so clicking the eggs selects the radio. Price is `formatPrice(cartonPriceCents(pricePerEggCents, size), currency)` with `fontSize="xs"` and `color="fg.muted"` **under** the eggs ([gaps D5](../gaps-and-decisions.md)). When `!isCartonAvailable(remaining, size)`: radio `disabled`, cell `opacity` reduced, `cursor="not-allowed"`, and `title`/sr text `carton.unavailable`.

**`CartonEggs`** — `Grid` with `templateRows="repeat(2, auto)"` and `gridAutoFlow="column"` so 6 → 2×3 and 10 → 2×5; one `TbEggFilled` per egg, `size={20}`, `color={eggColorForSlot(i)}` ([`eggPalette.ts`](../../../src/lib/eggQuantity/eggPalette.ts), [gaps D6](../gaps-and-decisions.md)), `aria-hidden`; wrapper `data-testid="carton-eggs-<size>"`. Reuse the hover wiggle already used in [`EggQuantityRow`](../../../src/components/ui/EggQuantityRow.tsx) (`_motionSafe`).

**A11y:** group `aria-label` = `carton.legend` ("Kartongröße"); each radio `aria-label` = `carton.option` with the size ("6 Eier").

**Strings:** `carton.legend`, `carton.option` ("{n} Eier"), `carton.unavailable` ("Nicht genug Eier übrig").

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/components/CartonPicker/CartonPicker.tsx` (+ test) | listings | 4-column grid + radio group |
| `src/features/listings/components/CartonPicker/CartonOption.tsx` (+ test) | listings | Radio + eggs + price |
| `src/features/listings/components/CartonPicker/CartonEggs.tsx` (+ test) | listings | 2-row coloured eggs |
| `src/features/listings/components/CartonPicker/index.ts` | listings | Barrel |
| `src/i18n/strings.de.ts` | i18n | `carton.*` |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** renders two radios and 6 + 10 egg icons (`carton-eggs-6`, `carton-eggs-10`) | |
| **Happy:** price under each carton equals `size × perEgg` formatted (e.g. 2,10 € / 3,50 € at 35 ct) | |
| **Happy:** clicking a radio, and clicking the eggs, calls `onChange(size)` | |
| **Happy:** eggs in a carton do not all share one colour class/token | |
| **Negative:** `remaining=8` → 10-carton radio is disabled and clicking it does not call `onChange`; 6 still works | |
| **Negative:** `remaining=4` → both disabled | |
| **Negative:** `CartonPicker` renders no radio for any size other than 6 and 10 | |

## Green

Implement; `./ci.sh`.

## Refactor gate

Each file ≤~100 LOC; no raw colour values (tokens only); no quantity logic outside `carton.ts` — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-pricing && git pull
git checkout -b feat/eggs-pricing-carton-picker
```

```text
feat(listings): carton picker with priced 6 and 10 egg cartons
```
