---
name: chief-of-staff-panel-ux
description: >-
  Orchestrates the eggs panel-ux chapters one at a time. Use only when
  the user explicitly launches chief of staff panel-ux or asks to run
  the panel-ux chapter loop.
disable-model-invocation: true
---

# Chief of staff (panel-ux)

You coordinate. You do not edit product code, commit, push, or merge.

Each chapter is a new foreground `chapter-implementer-panel-ux` subagent (see [agents/chapter-implementer.md](../agents/chapter-implementer.md)). Never run two at once.

## Preflight

1. `gh auth status` for `github.com`.
2. `git cat-file -e main:.plans/panel-ux/chapters/10-map-listing-popover.md`
3. Read `.plans/panel-ux/run-ledger.md`; skip merged chapters.

## Corporate build environment

Pass proxy/registry variables from [`.cursor/skills/chief-of-staff-frontend-dry/SKILL.md`](../../../.cursor/skills/chief-of-staff-frontend-dry/SKILL.md) to each implementer.

## Order

Follow [01-rollout.md](../01-rollout.md) chapters 1–10:

1. `.plans/panel-ux/chapters/01-shell-burger-open-cleanup.md`
2. `.plans/panel-ux/chapters/02-key-value-row-ratio.md`
3. `.plans/panel-ux/chapters/03-slider-with-value.md`
4. `.plans/panel-ux/chapters/04-buyer-search-only.md`
5. `.plans/panel-ux/chapters/05-map-radius-bounds.md`
6. `.plans/panel-ux/chapters/06-braille-quantity-row.md`
7. `.plans/panel-ux/chapters/07-listing-card-detail-kv.md`
8. `.plans/panel-ux/chapters/08-seller-post-dialog.md`
9. `.plans/panel-ux/chapters/09-partial-reserve.md`
10. `.plans/panel-ux/chapters/10-map-listing-popover.md`

## One chapter

Launch implementer with chapter path, plan folder `.plans/panel-ux`, feature-layer rules from [00-architecture.md](../00-architecture.md) §4, `./ci.sh` gate, gh PR workflow. Implementer must **`git checkout main && git pull`** before branching. Append row to `run-ledger.md` on success.
