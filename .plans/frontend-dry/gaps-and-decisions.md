---
name: Frontend DRY and Chakra — Gaps and decisions
overview: "Settled decisions for shared async helpers and Chakra-only forms; overlap with ui-overhaul and frontend-structure."
isProject: false
---

# Frontend DRY and Chakra — Gaps and decisions

**Architecture:** [00-architecture.md](00-architecture.md) · **Rollout:** [01-rollout.md](01-rollout.md)

## Settled

| # | Decision |
| --- | --- |
| D1 | **`useSupabaseQuery`** wraps mount + cancel + optional refetch token — not a full query cache. Callers pass a `fetcher: () => Promise<T>` (or service function). |
| D2 | **`useAsyncAction`** returns `{ run, busy, error }` for async RPC/update handlers; components pass `onSuccess` (e.g. `onChange`, `onCreated`). |
| D3 | **`DEFAULT_MAP_CENTER`** is a single exported constant (Berlin 52.52 / 13.405); tests may keep literals but production code imports the constant. |
| D4 | **`ListingSummaryLine`** is presentational only — props: `eggCount`, `unit`, `priceCents`, `currency`; optional `separator` between count and price (card uses ` · `, detail may omit). |
| D5 | **`PostFormField`** uses Chakra `Field.*` only — no raw `<label>`, no `Box as="label"`. |
| D6 | **PostListing `<form>`** may stay as native `<form onSubmit>` for submit semantics; fields inside are Chakra. |
| D7 | **ui-overhaul ch. 2** remains historical; chapter 7 here owns remaining PostListing label cleanup. Do not revert `UnitSelect` / LocationPicker work. |
| D8 | **No `@tanstack/react-query`** in this folder. |

## Open seams

- **Promote `lib/async` to a shared package** — not needed for eggs size; revisit if a second app shares Supabase helpers.
- **Styled dropdowns** use Chakra `Select` (listbox; see `UnitSelect`). `NativeSelect` is a styled native `<select>` wrapper — not a target for new fields. **`RadiusSelect` migration** to `Select` stays deferred and out of this folder.
