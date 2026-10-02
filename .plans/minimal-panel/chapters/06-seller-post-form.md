---
name: "Chapter 6 — Seller post form"
overview: "EggAmountControl chips + slider; KeyValueRow grid; remove Notiz."
todos:
  - id: seller
    content: "PostListing form + container + tests"
    status: pending
isProject: false
---

# Chapter 6 — Seller post form simplified

**Branch:** `feat/eggs-minimal-seller-form` · **Depends on:** ch.3

---

## Goal

Unit as large radio chips; amount slider 1–12 with egg preview; Ort row; Kontakthinweis only; no Notiz.

## Files

| Path | Layer |
| --- | --- |
| `src/features/listings/components/PostListing/EggAmountControl/` | component |
| `src/features/listings/components/PostListing/PostListingForm.tsx` | component |
| `src/features/listings/containers/PostListing.tsx` | container |
| `src/features/listings/utils/postListingMappers.ts` | util |
| `src/features/listings/containers/PostListing.test.tsx` | test |
| `src/i18n/strings.de.ts` | i18n |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** submit sends p_note null | |
| **Negative:** Notiz field not in document | |
