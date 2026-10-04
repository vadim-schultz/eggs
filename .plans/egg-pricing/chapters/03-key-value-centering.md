---
name: "Chapter 3 — Key/value centring"
overview: "KeyValueRow vertically centres label and value so Ort, Umkreis, Preis etc. align consistently."
todos:
  - id: align
    content: "KeyValueRow alignItems center + test"
    status: pending
  - id: review
    content: "Check form, search and detail rows for regressions"
    status: pending
isProject: false
---

# Chapter 3 — Key/value centring

**Repo:** `eggs` · **Branch:** `feat/eggs-pricing-kv-center` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

In every key/value field (Ort, Umkreis, Preis, Status, …) the key and the value are vertically centred against each other.

## Design decisions

[`KeyValueRow`](../../../src/components/ui/KeyValueRow.tsx) currently sets `alignItems="start"` on its `SimpleGrid`. Change it to `"center"` ([gaps D11](../gaps-and-decisions.md)) — a single source, no per-call-site overrides. Keep the `1fr 3fr` columns and `data-testid`.

Review call sites for regressions: [`PostListingForm`](../../../src/features/listings/components/PostListing/PostListingForm.tsx) (Ort picker with locate button, Kontakthinweis textarea), [`BuyerSearchRows`](../../../src/features/browse/components/BuyerTab/BuyerSearchRows.tsx) (Umkreis slider, Ort), [`ListingCardSummary`](../../../src/features/listings/components/ListingCardSummary.tsx), [`ListingDetailView`](../../../src/features/listings/components/ListingDetail/ListingDetailView.tsx). Field error text rendered inside a row's value cell must not push the label off-centre in a way that looks broken; if it does, move the error below the row (as the Ort error already is).

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/components/ui/KeyValueRow.tsx` | ui | `alignItems="center"` |
| `src/components/ui/KeyValueRow.test.tsx` | test | Asserts centring |
| `PostListingForm.tsx` | listings | Only if error placement needs adjusting |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** the row's grid has `align-items: center` (via computed style or style prop) | |
| **Happy:** label and children both render, 1 : 3 columns unchanged | |
| **Negative:** no row renders with `align-items: start` | |

## Green

Implement; `./ci.sh`; open the seller dialog and buyer panel and eyeball each row.

## Refactor gate

No call site overrides `alignItems` on a `KeyValueRow` — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-pricing && git pull
git checkout -b feat/eggs-pricing-kv-center
```

```text
fix(ui): vertically centre key/value rows
```
