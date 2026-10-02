---
name: "Chapter 8 — Seller post dialog"
overview: "Center unit chips; price KV; Ort embedInRow; avoid close-button overlap."
todos:
  - id: seller
    content: "PostListingForm + tests"
    status: pending
isProject: false
---

# Chapter 8 — Seller post dialog

**Branch:** `feat/eggs-panel-seller-dialog` · **Depends on:** ch.2, ch.3, ch.6

---

## Goal

Post dialog: **unit chips centered** in value column (clear of dialog close); **Preis** in `KeyValueRow`; **Ort** via `LocationPicker` **`embedInRow`** like buyer; amount slider + Braille from ch.6.

## Files

| Path | Layer |
| --- | --- |
| `src/features/listings/components/PostListing/PostListingForm.tsx` | component |
| `src/features/listings/components/PostListing/EggAmountControl.tsx` | component |
| `src/features/listings/containers/PostListing.test.tsx` | test |
| Remove price via standalone `PostFormField` if replaced by KV | component |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** form renders price in KeyValueRow; Ort row matches buyer pattern | |
| **Negative:** unit chip row does not use absolute positioning under close button | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`PostListingForm` + `EggAmountControl` — report outcome.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-panel-seller-dialog
```

```text
feat(web): align seller post form with panel KV layout
```
