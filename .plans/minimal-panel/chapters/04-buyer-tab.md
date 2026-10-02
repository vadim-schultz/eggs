---
name: "Chapter 4 — Buyer tab"
overview: "Two-column KeyValueRow, RadiusSlider, BuyerSearchRows, wire PlaceCombobox."
todos:
  - id: buyer
    content: "BuyerTab container + browse components"
    status: pending
isProject: false
---

# Chapter 4 — Buyer tab grid + Umkreis slider

**Branch:** `feat/eggs-minimal-buyer-tab` · **Depends on:** ch.3

---

## Goal

Buyer search as key–value grid: Umkreis slider, Ort row with geolocate + combobox. Remove searchInstead line.

## Files

| Path | Layer |
| --- | --- |
| `src/components/ui/KeyValueRow.tsx` | ui |
| `src/features/browse/components/BuyerTab/RadiusSlider.tsx` | component |
| `src/features/browse/components/BuyerTab/BuyerSearchRows.tsx` | component |
| `src/features/browse/containers/BuyerTab.tsx` | container |
| `src/features/browse/containers/BuyerTab.test.tsx` | test |
| Remove or stop exporting `RadiusSelect.tsx` | component |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** BuyerTab renders slider for Umkreis | |
| **Negative:** does not render searchInstead copy | |
