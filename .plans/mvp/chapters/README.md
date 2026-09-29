# MVP — chapters

One executable plan per chapter. Order, dependencies and gates: [../01-rollout.md](../01-rollout.md).

| # | File | Layer | Status |
| --- | --- | --- | --- |
| 1 | [01-project-scaffold.md](01-project-scaffold.md) | frontend | shipped |
| 2 | [02-schema-and-rls.md](02-schema-and-rls.md) | schema | shipped |
| 3 | [03-auth.md](03-auth.md) | frontend + schema | shipped |
| 4 | [04-post-a-listing.md](04-post-a-listing.md) | frontend + schema | shipped |
| 5 | [05-browse-and-map.md](05-browse-and-map.md) | frontend | shipped |
| 6 | [06-reserve-a-listing.md](06-reserve-a-listing.md) | frontend + schema | shipped |
| 7 | [07-lifecycle-and-expiry.md](07-lifecycle-and-expiry.md) | schema + frontend | shipped |
| 8 | [08-deploy-and-docs-sync.md](08-deploy-and-docs-sync.md) | ops + docs | in progress |

Each chapter has: Goal, Design decisions, Files, **Manual configuration** (Supabase dashboard / Google
Cloud Console / Cloudflare Pages steps that are not code — empty where a chapter needs none), Red tests
(paired), Green, Refactor gate, Verification, Out of scope, Git workflow — same template as
[redtape](../../../redtape/.plans/floating-nav/chapters/05-floating-shell.md) uses, with the Manual
configuration section added since this app has no backend server and leans on Supabase project settings
that only exist as dashboard state, not as versioned code (chapters 1, 3 and 8 carry the real content;
the rest note explicitly that none is needed).

All eight chapters are written. Chapters 1–7 are shipped; chapter 8 (deploy and docs sync) has its runbook
merged but is still "in progress" — the hosted Supabase/Google/Cloudflare configuration and the production
smoke test are manual steps that remain (see [../01-rollout.md](../01-rollout.md) and
[docs/operations/deploy.md](../../../docs/operations/deploy.md)).
