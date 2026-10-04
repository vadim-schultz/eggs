# Run ledger

**Loop branch:** `feat/plans-lean-ui`
**Release branch:** `main`
**Release MR/PR:** _(filled when opened)_

Chapter PRs merge into the loop branch only. The chapter-implementer **does not** edit this file.

| chapter | branch | mr/pr | local ci | remote ci | merged | blocker |
| --- | --- | --- | --- | --- | --- | --- |
| 01-lean-listing-summary | feat/lean-ui-summary | https://github.com/vadim-schultz/eggs/pull/104 | pass | pass | merged | none |
| 02-carton-cards | feat/lean-ui-carton-cards | https://github.com/vadim-schultz/eggs/pull/105 | pass | pass | merged | none (visual light/dark check not done) |
| 03-active-signin | feat/lean-ui-signin | https://github.com/vadim-schultz/eggs/pull/106 | pass | pass | merged | none |
| 04-you-are-here-dialog | feat/lean-ui-you-are-here | https://github.com/vadim-schultz/eggs/pull/107 | pass | pass (rls-smoke passed on rerun after unrelated rate limit) | merged | none |
| 05-reservation-queries | feat/lean-ui-reservation-queries | https://github.com/vadim-schultz/eggs/pull/108 | pass | pass | merged | none (queries in reservationsApi.ts, not listingsApi.ts; hook-error test dropped) |
| 06-seller-reservation-list | feat/lean-ui-seller-list | https://github.com/vadim-schultz/eggs/pull/109 | pass | pass | merged | none |
| 07-buyer-reservation-list | feat/lean-ui-buyer-list | https://github.com/vadim-schultz/eggs/pull/110 | pass | pass | merged | none (manual two-account e2e pass not run) |
| 08-docs-sync | feat/lean-ui-docs | https://github.com/vadim-schultz/eggs/pull/111 | pass | pass | merged | none |
