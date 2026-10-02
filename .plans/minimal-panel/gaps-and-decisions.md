---
name: Minimal panel — Gaps and decisions
overview: "Settled UX and layering decisions; overlap with frontend-dry and ui-overhaul."
isProject: false
---

# Minimal panel — Gaps and decisions

**Architecture:** [00-architecture.md](00-architecture.md) · **Rollout:** [01-rollout.md](01-rollout.md)

## Settled

| # | Decision |
| --- | --- |
| D1 | **Feature folders** — [frontend-structure](../frontend-structure/) on `main`; chapter Files tables tag layer per file. |
| D2 | **Role labels** — `tabs.farmer` → Verkäufer, `tabs.buyer` → Käufer; **keep tab emojis**; internal values `farmer` / `buyer`. |
| D3 | **Umkreis slider** — 5–30 km, step 5 km; default 15 km. |
| D4 | **Germany fallback** — supersedes frontend-dry Berlin-only `DEFAULT_MAP_CENTER` semantics for map/browse when geo denied; export `GERMANY_BOUNDS` + `germanyCenter()`. |
| D5 | **Ort** — Chakra Combobox + geolocate `IconButton`; no `home.location.searchInstead`; no manual pin in buyer/seller. |
| D6 | **Notiz** — removed from UI and form state; `p_note: null` always. |
| D7 | **Egg amount** — slider 1–12; unit chips Stück/Dutzend; icon preview via `halfDozenIconCount`. |
| D8 | **Icons** — `react-icons/tb` for menu, map, empty states. |

## Open seams

- **Manual coordinates** — reintroduce only if geocode coverage is insufficient.
- **Radius beyond 30 km** — product choice; slider max fixed at 30 km for now.

## Overlap

- [frontend-dry](../frontend-dry/) chapter 1 Berlin center — overridden by minimal-panel ch.2.
- [ui-overhaul](../ui-overhaul/) tab/layout chapters — minimal-panel owns Slider/Combobox/chips in the same shell files; read both gaps before editing.
