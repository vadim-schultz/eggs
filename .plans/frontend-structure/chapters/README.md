# Frontend structure — chapters

One executable plan per chapter. Order, dependencies and gates: [../01-rollout.md](../01-rollout.md).

| # | File | Layer | Status |
| --- | --- | --- | --- |
| 1 | [01-import-alias.md](01-import-alias.md) | frontend tooling | planned |
| 2 | [02-auth-feature.md](02-auth-feature.md) | frontend | planned |
| 3 | [03-listing-types-utils.md](03-listing-types-utils.md) | frontend | planned |
| 4 | [04-listing-read-services.md](04-listing-read-services.md) | frontend | planned |
| 5 | [05-listing-write-services.md](05-listing-write-services.md) | frontend | planned |
| 6 | [06-reserve-button.md](06-reserve-button.md) | frontend | planned |
| 7 | [07-contact-reveal.md](07-contact-reveal.md) | frontend | planned |
| 8 | [08-seller-actions-folder.md](08-seller-actions-folder.md) | frontend | planned |
| 9 | [09-listing-detail-container-view.md](09-listing-detail-container-view.md) | frontend | planned |
| 10 | [10-post-listing-container-form.md](10-post-listing-container-form.md) | frontend | planned |
| 11 | [11-location-feature.md](11-location-feature.md) | frontend | planned |
| 12 | [12-browse-data.md](12-browse-data.md) | frontend | planned |
| 13 | [13-buyer-tab-and-map.md](13-buyer-tab-and-map.md) | frontend | planned |
| 14 | [14-shell-and-app-routing.md](14-shell-and-app-routing.md) | frontend | planned |
| 15 | [15-retire-vacated-dirs.md](15-retire-vacated-dirs.md) | frontend | planned |

Each chapter has: Goal, Design decisions, Files, **Manual configuration**, Red tests (happy + negative
pair minimum), Green, Refactor gate, Verification, Out of scope, Git workflow — same template as
`.plans/mvp/chapters/`.

All fifteen are **planned** until the corresponding restructuring PR merges.

No chapter touches `supabase/` — the gate is `./ci.sh` only.
