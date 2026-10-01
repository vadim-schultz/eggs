---
name: Frontend structure — Gaps and decisions
overview: "Settled structural decisions for the feature-folder restructure, and open seams deferred until after the moves land."
isProject: false
---

# Frontend structure — Gaps and decisions

**Architecture:** [00-architecture.md](00-architecture.md) · **Rollout:** [01-rollout.md](01-rollout.md)

## Settled

| # | Decision |
| --- | --- |
| D1 | **Follow rsb feature folders**, not the stale arc42 flat `frontend/src/containers` + `components` tree. Each eggs domain gets `src/features/<name>/{containers,components,hooks,services,types,utils}` where needed; shared chrome stays under `src/components/ui/`. |
| D2 | **`location` is its own feature** — shared by buyer search and post listing. Neither `browse` nor `listings` owns the picker or Nominatim client. |
| D3 | **Behavior and schema frozen** for this folder. Moves, renames, extractions, and `@/` only — no new RPCs, no copy changes, no dialog/route behavior changes. |
| D4 | **Leaf components stay single files.** Do not wrap `StatusBadge`, `ListingCard`, or `UnitSelect` in empty one-file directories. Directories are for composition trees with multiple `.tsx` files. |
| D5 | **`@/` is the canonical import root** for cross-feature imports after chapter 1 (`@/*` → `src/*`). |
| D6 | **No compatibility shims.** When a module moves, update all call sites in the same chapter and delete the old path. No long-lived `export { X } from '../new/path'` re-exports. |
| D7 | **Historical plan paths** in `.plans/mvp/` and `.plans/ui-overhaul/` are not rewritten. This folder documents the post-restructure layout; new work cites `features/` paths from here. |
| D8 | **PostListing raw `<label>` markup** remains out of scope — [ui-overhaul chapter 2](../ui-overhaul/chapters/02-component-hygiene.md) owns Chakra field hygiene; structure chapters must not rewrite those labels “while we’re here.” |
| D9 | **Tests move with modules.** Co-located `*.test.tsx` files change import paths in the same PR as the production move; no duplicate tests at old and new paths. |
| D10 | **Listing presentation shared by browse** (`ListingCard`, `StatusBadge`) lives under `features/listings/components/`; browse imports them as presentational dependencies (see [00-architecture.md §5](00-architecture.md#5-dependency-direction)). |

## Open seams (deferred past this folder)

- **ESLint import boundaries** — after chapter 15, add `import/no-restricted-paths` (or equivalent) so features cannot import each other’s containers and `lib/` stays free of domain types. Not enforced mid-migration to avoid fighting half-moved trees.
- **TanStack Query** — rsb uses query hooks heavily; eggs still uses `useEffect` + local state for Supabase. Replacing fetch patterns is a separate initiative, not part of these fifteen chapters (services layer is thin wrappers around today’s calls).
- **Shared `GeoPoint` type** — may live on `useGeolocation` export or `browse/types`; pick one in chapter 12 and document in the chapter outcome — no second duplicate type.
- **Farmer “my listings” grid** — still deferred per [ui-overhaul gaps](../ui-overhaul/gaps-and-decisions.md); the new `listings/` feature folder is the intended home when that plan lands.
