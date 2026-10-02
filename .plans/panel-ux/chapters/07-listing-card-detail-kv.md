---
name: "Chapter 7 — Listing card and detail KV"
overview: "Braille header; KV for Anzahl Preis Status; fit-content card; no place on card."
todos:
  - id: card
    content: "ListingCard + ListingDetailView + tests"
    status: pending
isProject: false
---

# Chapter 7 — Listing card and detail KV

**Branch:** `feat/eggs-panel-listing-kv` · **Depends on:** ch.2, ch.6

---

## Goal

**ListingCard:** Braille row only (no `location_label`); **KeyValueRow** for Anzahl, Preis, Status; card width **fit-content**. **ListingDetailView:** same patterns (reserved/active listings).

## Files

| Path | Layer |
| --- | --- |
| `src/features/listings/components/ListingCard.tsx` | component |
| `src/features/listings/components/ListingDetail/ListingDetailView.tsx` | component |
| `src/features/listings/components/ListingCard.test.tsx` | test (new or extend) |
| `src/features/listings/containers/ListingDetail.test.tsx` | test |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** card shows Braille string from listing count; KV labels for price/status | |
| **Negative:** card does not render listing place name as heading | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`ListingCard` + `ListingDetailView` — report outcome.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-panel-listing-kv
```

```text
feat(web): compact listing card with Braille and KV rows
```
