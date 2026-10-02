---
name: "Chapter 8 — Listing card quantity"
overview: "Egg row heading; available count + price; no status on browse card."
todos:
  - id: card
    content: "ListingCard layout + tests"
    status: pending
isProject: false
---

# Chapter 8 — Listing card quantity

**Repo:** `eggs` · **Branch:** `feat/eggs-egg-ux-listing-card` · **Status:** planned

**Depends on:** [04-retire-braille.md](04-retire-braille.md), [03-egg-quantity-module.md](03-egg-quantity-module.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §7 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

**Listing card** used in browse grid (if any) and **map popover**: **heading** = colourful **`EggQuantityRow`** for display count (`displayEggCount`); show **available amount** (`listing.egg_count` + unit label) and **price**; **remove** `StatusBadge` / status `KeyValueRow` ([gaps D8](../gaps-and-decisions.md)). Card may remain compact (`w="fit-content"` or widen slightly for egg row).

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/listings/components/ListingCard.tsx` | component | `EggQuantityRow` as first child; drop status row |
| `src/features/listings/components/ListingCard.test.tsx` | test | No “Verfügbar” / status label; egg row present |
| `src/i18n/strings.de.ts` | i18n | Optional: `listing.available.label` if clearer than reusing count label |

**Do not** add `ReserveButton` here (chapter 9 — popover wrapper).

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** card shows `EggQuantityRow` and numeric available count matching `listing.egg_count` | |
| **Negative:** card does not render `listing.status.label` or `StatusBadge` | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`ListingCard` — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-ux && git pull
git checkout -b feat/eggs-egg-ux-listing-card
```

```text
feat(web): listing card egg heading without status row
```
