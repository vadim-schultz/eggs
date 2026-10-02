---
name: "Chapter 7 — Tabler icon sweep"
overview: "MapView and remaining browse/listings icons on react-icons/tb."
todos:
  - id: icons
    content: "MapView markers TbBasket/TbEgg"
    status: pending
isProject: false
---

# Chapter 7 — Tabler icon sweep

**Branch:** `feat/eggs-minimal-tb-icons` · **Depends on:** ch.1, ch.5

---

## Goal

Replace non-Tb map/listing icons; align basket/egg markers with Tabler.

## Files

| Path | Layer |
| --- | --- |
| `src/features/browse/components/MapView/MapView.tsx` | component |
| `src/features/browse/components/MapView/MapView.test.tsx` | test |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** user location marker uses basket icon (Tb) | |
| **Negative:** no FaEgg or RiShoppingBasket in MapView source | grep/static |

## Refactor gate

pinIcon helper unchanged structure — report outcome.
