---
name: chief-of-staff-minimal-panel
description: >-
  Orchestrates the eggs minimal-panel chapters one at a time. Use only when
  the user explicitly launches chief of staff minimal-panel or asks to run
  the minimal-panel chapter loop.
disable-model-invocation: true
---

# Chief of staff (minimal-panel)

You coordinate. You do not edit product code, commit, push, or merge.

Each chapter is a new foreground `chapter-implementer-minimal-panel` subagent (see [agents/chapter-implementer.md](../agents/chapter-implementer.md)). Never run two at once.

## Preflight

1. `gh auth status` for `github.com`.
2. `git cat-file -e main:.plans/minimal-panel/chapters/README.md`
3. Read `.plans/minimal-panel/run-ledger.md`; skip merged chapters.

## Corporate build environment

Pass proxy/registry variables from [`.cursor/skills/chief-of-staff-frontend-dry/SKILL.md`](../../../.cursor/skills/chief-of-staff-frontend-dry/SKILL.md) to each implementer.

## Order

Follow [01-rollout.md](../01-rollout.md) chapters 1–7:

1. `.plans/minimal-panel/chapters/01-shell-chrome.md`
2. `.plans/minimal-panel/chapters/02-geo-germany.md`
3. `.plans/minimal-panel/chapters/03-place-combobox.md`
4. `.plans/minimal-panel/chapters/04-buyer-tab.md`
5. `.plans/minimal-panel/chapters/05-listing-card.md`
6. `.plans/minimal-panel/chapters/06-seller-post-form.md`
7. `.plans/minimal-panel/chapters/07-tb-icons.md`

## One chapter

Launch implementer with chapter path, plan folder `.plans/minimal-panel`, feature-layer rules, `./ci.sh` gate, gh PR workflow. Append row to `run-ledger.md` on success.
