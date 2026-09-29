# UI overhaul — chapters

One executable plan per chapter. Order, dependencies and gates: [../01-rollout.md](../01-rollout.md).

| # | File | Layer | Status |
| --- | --- | --- | --- |
| 1 | [01-floating-panel-shell.md](01-floating-panel-shell.md) | frontend | planned |
| 2 | [02-component-hygiene.md](02-component-hygiene.md) | frontend | planned |
| 3 | [03-farmer-buyer-tabs.md](03-farmer-buyer-tabs.md) | frontend | planned |
| 4 | [04-buyer-tab-search-and-grid.md](04-buyer-tab-search-and-grid.md) | frontend | planned |
| 5 | [05-farmer-tab-add-listing.md](05-farmer-tab-add-listing.md) | frontend | planned |
| 6 | [06-detail-and-post-dialogs.md](06-detail-and-post-dialogs.md) | frontend | planned |
| 7 | [07-google-oauth-redirect-fix.md](07-google-oauth-redirect-fix.md) | frontend + ops | planned |

Each chapter has: Goal, Design decisions, Files, **Manual configuration** (dashboard steps that are
not code — empty where a chapter needs none; only chapter 7 carries real content here), Red tests
(paired), Green, Refactor gate, Verification, Out of scope, Git workflow — the same template
`.plans/mvp/chapters/` uses.

All seven chapters are written and "planned"; none has shipped yet. None touches `supabase/`, so
unlike `.plans/mvp/`, no chapter here needs a database reset or an RLS smoke script — see
[../01-rollout.md](../01-rollout.md) for the shared frontend gate.
