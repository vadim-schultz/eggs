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

## Conventions

- **Frontmatter.** Each plan opens with YAML: `name`, `overview`, an optional `todos` list, and `isProject`.
- **Links.** Relative, from the plan's own folder.
- **Status.** Recorded in the plan meta line (`**Status:** planned` until shipped).
- **CI.** `./ci.sh` from the repo root is the gate once chapter 1 lands: lint, typecheck, vitest, build.
