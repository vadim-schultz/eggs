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
| [chapters/](mvp/chapters/) | One executable plan per chapter (not yet written) |

Status: planned — architecture and rollout written; no chapter doc or code yet. First step: write
[chapters/01-project-scaffold.md](mvp/chapters/01-project-scaffold.md).

## Conventions

- **Frontmatter.** Each plan opens with YAML: `name`, `overview`, an optional `todos` list, and `isProject`.
- **Links.** Relative, from the plan's own folder.
- **Status.** Recorded in the plan meta line (`**Status:** planned` until shipped).
- **CI.** `./ci.sh` from the repo root is the gate once chapter 1 lands: lint, typecheck, vitest, build.
