---
name: "Chapter 3 — PlaceCombobox"
overview: "Combobox + geolocate target; LocationPicker uses PlaceCombobox."
todos:
  - id: combobox
    content: "PlaceCombobox directory + LocationPicker rewrite"
    status: pending
isProject: false
---

# Chapter 3 — Ort Combobox + target

**Branch:** `feat/eggs-minimal-place-combobox` · **Depends on:** ch.2

---

## Goal

Single Ort field: target button + Chakra Combobox fed by `useSearchCandidates`. Remove manual pin from buyer/seller picker.

## Files

| Path | Layer |
| --- | --- |
| `src/features/location/components/PlaceCombobox/` | component |
| `src/features/location/components/LocationPicker/LocationPicker.tsx` | component |
| `src/features/location/components/LocationPicker/LocationPicker.test.tsx` | test |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** selecting combobox item calls onConfirm with lat/lng | |
| **Negative:** no manual lat/lng fields rendered | |

## Refactor gate

PlaceCombobox directory with barrel — report outcome.
