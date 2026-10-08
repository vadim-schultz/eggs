# Plans

Design and implementation plans for `eggs`. One folder per body of work; plans stay in the repo so
they version alongside the code they describe. Structure and conventions follow the
[redtape](../../redtape/.plans/README.md) project.

## Folders

### [mvp/](mvp/) — Sell and reserve excess eggs

A hyperlocal marketplace: sellers post egg count, price and rough location; buyers browse a public
map/list and reserve a whole listing; contact is revealed once reserved so pickup gets arranged
outside the app. No payments, no backend server — Supabase (Postgres + Auth + PostGIS + `pg_cron`)
direct from the browser, RLS as the authorization layer. Eight chapters.

| Doc | What it is |
| --- | --- |
| [00-architecture.md](mvp/00-architecture.md) | Stack, data model, RLS sketch, auth scope, lifecycle |
| [01-rollout.md](mvp/01-rollout.md) | Eight chapters, dependency graph, invariants, per-chapter gate |
| [gaps-and-decisions.md](mvp/gaps-and-decisions.md) | Settled decisions and deferred features |
| [chapters/](mvp/chapters/) | One executable plan per chapter |

Status: in progress — chapters 1–7 shipped; chapter 8 (deploy and docs sync) has its runbook merged
(see [docs/operations/deploy.md](../docs/operations/deploy.md)) but the hosted Supabase/Google/Cloudflare
configuration and production smoke test are still manual steps for the maintainer to run. Flips to
shipped once those are done.

### [ui-overhaul/](ui-overhaul/) — Eierbauer UI/UX redesign

A frontend-only redesign of the deployed app: a full-page map background with a small floating
panel (top-right) holding farmer/buyer tabs, a compact results grid, in-panel dialogs for posting
and listing detail instead of page navigation, a Chakra-only component pass, and a fix for the
Google OAuth redirect landing on `localhost` instead of the production domain. No schema or backend
changes. Seven chapters.

| Doc | What it is |
| --- | --- |
| [00-architecture.md](ui-overhaul/00-architecture.md) | Why, non-goals, stack, screen/component map, shell/tabs/dialog design |
| [01-rollout.md](ui-overhaul/01-rollout.md) | Seven chapters, dependency graph, invariants, per-chapter gate |
| [gaps-and-decisions.md](ui-overhaul/gaps-and-decisions.md) | Settled decisions and deferred features |
| [chapters/](ui-overhaul/chapters/) | One executable plan per chapter |

Status: planned — all seven chapter docs are written; no code has shipped yet.

### [frontend-structure/](frontend-structure/) — Feature folders and layer hygiene

A structural pass on `src/` only: align eggs with the rsb-test-storage **feature-folder** frontend
(`features/<name>/{containers,components,hooks,services,types,utils}`), extract inline sub-components
into hierarchical directories with barrels, and introduce a `@/` import alias. No schema, RLS, or
user-visible behavior change — moves and extractions only. Fifteen chapters.

| Doc | What it is |
| --- | --- |
| [00-architecture.md](frontend-structure/00-architecture.md) | Audit summary, target tree, layer roles, nested-component rule, file map |
| [01-rollout.md](frontend-structure/01-rollout.md) | Fifteen chapters, dependency graph, invariants, per-chapter gate |
| [gaps-and-decisions.md](frontend-structure/gaps-and-decisions.md) | Settled structural decisions and deferred lint enforcement |
| [chapters/](frontend-structure/chapters/) | One executable plan per chapter |

Status: shipped — chapters 1–15 are on main. `src/` matches the feature-folder tree
(`features/{auth,location,listings,browse,shell}`, `app/App.tsx`, `components/ui/toaster.tsx`,
`lib/env.ts`, `lib/supabaseClient.ts`). Vacated `src/routes`, `src/auth`, and `src/hooks` are gone.

### [frontend-dry/](frontend-dry/) — DRY helpers and Chakra form hygiene

Shared Supabase read/mutation lifecycle hooks, a default map center constant, `ListingSummaryLine`, and
Chakra `Field.*` markup for post listing and seller expiry — behavior-preserving, no schema changes. Eight
chapters; can ship on today’s flat `src/` or after [frontend-structure/](frontend-structure/) paths land.

| Doc | What it is |
| --- | --- |
| [00-architecture.md](frontend-dry/00-architecture.md) | DRY targets, Chakra conventions, prerequisites vs structure |
| [01-rollout.md](frontend-dry/01-rollout.md) | Eight chapters, dependency graph, invariants, gate |
| [gaps-and-decisions.md](frontend-dry/gaps-and-decisions.md) | useSupabaseQuery / useAsyncAction decisions; ui-overhaul overlap |
| [chapters/](frontend-dry/chapters/) | One executable plan per chapter |

Status: planned — all eight chapter docs are written; no code has shipped yet.

### [minimal-panel/](minimal-panel/) — Hyperlocal panel UX

Tighten the floating panel: Verkäufer/Käufer labels, two-column grids, Chakra Slider and Combobox for
Umkreis and Ort, Germany map fallback, Tabler icons, compact listing cards, seller form without Notiz.
Seven chapters; orchestration via user `chief-of-staff` and `chapter-implementer` (`~/.cursor/skills/chief-of-staff/SKILL.md`).

| Doc | What it is |
| --- | --- |
| [00-architecture.md](minimal-panel/00-architecture.md) | Feature layers, geo rules, component map |
| [01-rollout.md](minimal-panel/01-rollout.md) | Seven chapters, dependency graph, invariants |
| [gaps-and-decisions.md](minimal-panel/gaps-and-decisions.md) | Slider bounds, combobox-only Ort, overlaps |
| [run-ledger.md](minimal-panel/run-ledger.md) | Merge ledger |
| [chapters/](minimal-panel/chapters/) | One executable plan per chapter |

Status: in progress — suite and implementation on branch `feat/eggs-minimal-panel`.

### [panel-ux/](panel-ux/) — Panel UX loop (executable)

Floating panel UX: burger menu, open-on-load, KV **1 : 3**, Umkreis **5 / 10 / 15 km**, **Braille** quantity rows, map bounds and marker popovers, **partial reserve** (chapter 9). Ten chapters; each merges to **`main`** before the next. Orchestration: user `chief-of-staff` with plan folder `.plans/panel-ux/`.

| Doc | What it is |
| --- | --- |
| [00-architecture.md](panel-ux/00-architecture.md) | Screen map, Braille module, geo, partial reserve |
| [01-rollout.md](panel-ux/01-rollout.md) | Ten chapters, git invariants, dependency graph |
| [gaps-and-decisions.md](panel-ux/gaps-and-decisions.md) | D1–D11 including Braille table and inventory rule |
| [run-ledger.md](panel-ux/run-ledger.md) | Merge ledger |
| [chapters/](panel-ux/chapters/) | One executable plan per chapter |

Status: planned — docs suite landing via PR; implementation loop runs after merge to `main`.

### [egg-ux/](egg-ux/) — Easter palette and egg quantity UX

Replace Braille with a **decade egg row** (`TbEgg` / `TbEggFilled`, max 100), add **light/dark** Easter theme tokens, fix **burger** and **Ort combobox**, default listings to **24h** expiry, simplify **post listing** (slider 1–100, no Stück/Dutzend), refresh **listing cards**, and restore **reserve + slider** on **map popovers**. Nine chapters; orchestration via user `chief-of-staff` (plan folder `.plans/egg-ux/`).

| Doc | What it is |
| --- | --- |
| [00-architecture.md](egg-ux/00-architecture.md) | Egg row algorithm, colour system, screen map, expiry |
| [01-rollout.md](egg-ux/01-rollout.md) | Nine chapters, dependency graph, execution order |
| [gaps-and-decisions.md](egg-ux/gaps-and-decisions.md) | D1–D14 palette, popover reserve, git |
| [run-ledger.md](egg-ux/run-ledger.md) | Merge ledger |
| [chapters/](egg-ux/chapters/) | One executable plan per chapter |

Status: planned — documentation suite written; implementation loop runs after merge to `main`.

### [playful-theme/](playful-theme/) — Bright playful Easter theme

Promote the 12-colour Easter palette to full theme ramps and **role palettes** (`primary`, `danger`, …), then apply it everywhere: pastel surfaces with sticker shadows, chunky control recipes, and a reduced-motion-safe "silly" layer (egg burst, wiggle, palette-coloured map markers, playful copy). Four chapters; orchestration via user `chief-of-staff` (plan folder `.plans/playful-theme/`).

| Doc | What it is |
| --- | --- |
| [00-architecture.md](playful-theme/00-architecture.md) | Token model, role map, recipes, motion and contrast rules |
| [01-rollout.md](playful-theme/01-rollout.md) | Four chapters, git invariants, dependency graph, execution order |
| [gaps-and-decisions.md](playful-theme/gaps-and-decisions.md) | D1–D11 palette, roles, recipes, motion |
| [run-ledger.md](playful-theme/run-ledger.md) | Merge ledger |
| [chapters/](playful-theme/chapters/) | One executable plan per chapter |

Status: shipped — chapters 1–4 merged into the loop branch `feat/plans-playful-theme`; release PR to `main` pending.

### [egg-pricing/](egg-pricing/) — Price per egg and carton picker

Sellers set an amount (typed input) and the price of **one** egg; buyers choose a **6 or 10 egg carton** from a 4-column grid of radios and multi-coloured eggs with the carton price shown under each. Listing detail moves into the shared `AppDialog` (map popup removed) and key/value rows are vertically centred. Includes a schema migration (`price_cents` → `price_per_egg_cents`). Six chapters; orchestration via [`.claude/skills/chief-of-staff/SKILL.md`](../.claude/skills/chief-of-staff/SKILL.md) (plan folder `.plans/egg-pricing`). *Superseded in part by [lean-ui](lean-ui/): the carton radios are now two rounded selectable cards and the buyer view no longer shows price per egg.*

| Doc | What it is |
| --- | --- |
| [00-architecture.md](egg-pricing/00-architecture.md) | Data model, seller form, carton grid, dialog consolidation, traceability |
| [01-rollout.md](egg-pricing/01-rollout.md) | Six chapters, git invariants, dependency graph, execution order |
| [gaps-and-decisions.md](egg-pricing/gaps-and-decisions.md) | D1–D12 price model, cartons, low stock, dialog |
| [run-ledger.md](egg-pricing/run-ledger.md) | Merge ledger |
| [chapters/](egg-pricing/chapters/) | One executable plan per chapter |

Status: planned — documentation suite written; implementation loop runs after merge to `main`.

### [listing-roles/](listing-roles/) — Separate buyer and seller listing dialogs

The listing dialog is split into a buyer container (carton reserve, contact) and a seller container (summary and reservation list, read-only), chosen by ownership. Manual listing handling (mark sold, withdraw, expiry edit) is removed: a listing disappears once fully reserved and expires 24h after publishing, enforced in the database. Five chapters; orchestration via [`.claude/skills/chief-of-staff/SKILL.md`](../.claude/skills/chief-of-staff/SKILL.md) (plan folder `.plans/listing-roles`).

| Doc | What it is |
| --- | --- |
| [00-architecture.md](listing-roles/00-architecture.md) | Lifecycle, component split, layers, traceability |
| [01-rollout.md](listing-roles/01-rollout.md) | Five chapters, git invariants, dependency graph, execution order |
| [gaps-and-decisions.md](listing-roles/gaps-and-decisions.md) | D1–D9 and deferred items |
| [run-ledger.md](listing-roles/run-ledger.md) | Merge ledger |
| [chapters/](listing-roles/chapters/) | One executable plan per chapter |

Status: shipped — chapters 1–5 merged into the loop branch `feat/plans-listing-roles`; release PR to `main` pending.

### [lean-ui/](lean-ui/) — Streamlined buyer and seller UI

Strip technical detail (available, price per egg, status), replace the carton radios with two rounded selectable cards, make the signed-out reserve button start the login, show active reservations in the Verkäufer and Käufer panels (separate seller and buyer components), and open a "Du bist hier" dialog from the basket marker. No schema changes. Eight chapters; orchestration via [`.claude/skills/chief-of-staff/SKILL.md`](../.claude/skills/chief-of-staff/SKILL.md) (plan folder `.plans/lean-ui`).

| Doc | What it is |
| --- | --- |
| [00-architecture.md](lean-ui/00-architecture.md) | Component map, reservation data, layers, traceability |
| [01-rollout.md](lean-ui/01-rollout.md) | Eight chapters, git invariants, dependency graph, execution order |
| [gaps-and-decisions.md](lean-ui/gaps-and-decisions.md) | D1–D10 cards, lists, sign-in, dialog |
| [run-ledger.md](lean-ui/run-ledger.md) | Merge ledger |
| [chapters/](lean-ui/chapters/) | One executable plan per chapter |

Status: shipped — chapters 1–8 merged into the loop branch `feat/plans-lean-ui`; release PR to `main` pending.

## Conventions

- **Frontmatter.** Each plan opens with YAML: `name`, `overview`, an optional `todos` list, and `isProject`.
- **Links.** Relative, from the plan's own folder.
- **Status.** Recorded in the plan meta line (`**Status:** planned` until shipped).
- **CI.** `./ci.sh` from the repo root is the gate once chapter 1 lands: lint, typecheck, vitest, build.
