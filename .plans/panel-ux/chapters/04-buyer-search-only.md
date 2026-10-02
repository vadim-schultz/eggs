---
name: "Chapter 4 — Buyer search only"
overview: "Remove ResultsGrid from panel; Umkreis 5/10/15 km default 5."
todos:
  - id: buyer
    content: "BuyerTab + RadiusSlider bounds + tests"
    status: pending
isProject: false
---

# Chapter 4 — Buyer search only

**Branch:** `feat/eggs-panel-buyer-search` · **Depends on:** ch.1 (cleanup), ch.2 (KV), ch.3 (slider) recommended

---

## Goal

Buyer tab shows **Auth + search rows only** — no [`ResultsGrid`](../../../src/features/browse/components/BuyerTab/ResultsGrid.tsx). Radius **5 / 10 / 15 km**, default **5000** m.

## Files

| Path | Layer |
| --- | --- |
| `src/features/browse/containers/BuyerTab.tsx` | container |
| `src/features/browse/containers/BuyerTab.test.tsx` | test |
| `src/features/browse/components/BuyerTab/RadiusSlider.tsx` | component |
| `src/features/browse/components/BuyerTab/index.ts` | barrel — stop exporting `ResultsGrid` if unused |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `BuyerTab` renders Umkreis control; default radius 5 km | |
| **Negative:** `BuyerTab` does not render listing cards / `ResultsGrid` | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`BuyerTab` container — report outcome.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-panel-buyer-search
```

```text
feat(web): buyer panel search only and 5km default radius
```
