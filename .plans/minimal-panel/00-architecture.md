---
name: Minimal panel — Architecture
overview: "Tighten Eierbauer panel UX: Verkäufer/Käufer tabs, two-column grids, Slider/Combobox location, Germany map fallback, Tb icons, compact cards, seller form without Notiz. Feature-folder layers only; no schema changes."
isProject: false
---

# Minimal panel — Architecture

**Rollout:** [01-rollout.md](01-rollout.md) · **Decisions:** [gaps-and-decisions.md](gaps-and-decisions.md) · **Chapters:** [chapters/](chapters/) · **Ledger:** [run-ledger.md](run-ledger.md)

---

## 1. Why

The shipped app works but exposes too many controls and verbose copy for a **hyperlocal, non-flexible** product. This suite replaces discrete radius selects and plain location inputs with Chakra **Slider** and **Combobox**, compresses listing cards to egg icons + key–value rows, simplifies seller posting (unit chips + amount slider, no Notiz), aligns icons on **Tabler (`react-icons/tb`)**, and centers the map on the user or on **Germany** when geolocation is denied.

## 2. Non-goals

- No `supabase/` changes — `note` column remains; UI always sends `p_note: null`.
- No new npm dependencies (`react-icons` already installed).
- No manual lat/lng fallback in buyer/seller flows (combobox + geocode only).
- No mobile-specific layout pass.

## 3. Prerequisites

[frontend-structure](../frontend-structure/) is on `main`. All new code follows `features/<name>/{containers,components,hooks,utils}` plus `lib/geo` and `components/ui` for cross-cutting pieces. See [frontend-structure §3](../frontend-structure/00-architecture.md).

## 4. Feature layers (this suite)

| Layer | Responsibility | New / touched examples |
| --- | --- | --- |
| **containers** | Hooks, map/dialog context, form state | `BuyerTab`, `PostListing` |
| **components** | Presentational Chakra UI | `RadiusSlider`, `BuyerSearchRows`, `PlaceCombobox`, `EggAmountControl`, `ListingCard` |
| **hooks** | Geo + search | `useGeolocation` (+ `requestLocation`, `geoGranted`) |
| **utils** | Pure helpers | `halfDozenIconCount` |
| **lib/geo** | Bounds + fallback center | `GERMANY_BOUNDS`, `germanyCenter()` |
| **components/ui** | Layout primitive | `KeyValueRow` |

Nested multi-part UI uses directories + `index.ts` barrels (`PlaceCombobox/`, `EggAmountControl/`).

## 5. Screen map

```
AppShellPanel (Bree title, TbEggs trigger)
  RoleTabs (emoji + Verkäufer / Käufer)
    BuyerTab (container)
      KeyValueRow × Umkreis Slider, Ort (target + Combobox)
      ResultsGrid → ListingCard (egg icons + grid)
    FarmerTab → PostListing (container) → PostListingForm
      EggAmountControl (chips + slider + preview)
      Ort row, Kontakthinweis
BackgroundMap → MapView (Tb pins, Germany fitBounds when no geo)
```

## 6. i18n and icons

- `tabs.farmer` → **Verkäufer**, `tabs.buyer` → **Käufer**; tab emojis unchanged.
- Remove `home.location.searchInstead`.
- Icons: `TbEggs` menu, `TbEgg` / `TbEggOff`, `TbBasket` / `TbBasketOff`, `TbCurrentLocation` (or `TbTarget`) for geolocate.

## 7. Geo rules

1. On load, request browser geolocation once.
2. **Granted:** map centers on user; basket marker at user position.
3. **Denied / unavailable:** `Recenter` fits `GERMANY_BOUNDS`; listings query uses `germanyCenter()` until user picks Ort or retries geolocation.
4. **Manual Ort** (combobox): overrides center; basket marker at pin.
5. **Target button:** calls `requestLocation()` again; on success clears manual override in buyer flow.

## 8. Verification

```bash
./ci.sh
```

## 9. Execution

After this suite is on `main`, run chapters via [`.cursor/skills/chief-of-staff/SKILL.md`](../../.cursor/skills/chief-of-staff/SKILL.md) and [`.cursor/agents/chapter-implementer.md`](../../.cursor/agents/chapter-implementer.md) (plan folder `.plans/minimal-panel`). Track merges in [run-ledger.md](run-ledger.md).
