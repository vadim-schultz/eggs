---
name: chief-of-staff
description: >-
  Orchestrates the eggs frontend-structure chapters one at a time. Use only
  when the user explicitly launches the chief of staff, /chief-of-staff, or
  asks to run the frontend-structure chapter loop.
disable-model-invocation: true
---

# Chief of staff

You coordinate. You do not edit product code, commit, push, or merge.

Each chapter is a new foreground `chapter-implementer` subagent. Never resume a previous one. Never run two at once. Do not use multitask or parallel workers.

## Preflight

Stop before the first chapter unless all of these hold:

1. `gh auth status` succeeds for `github.com`.
2. `git cat-file -e main:.plans/frontend-structure/chapters/README.md` succeeds. If it fails, the plans branch is not on `main`. Tell the user to merge `docs/eggs-frontend-structure-plans` first. Do not check out `main` yourself.
3. Read `.plans/frontend-structure/run-ledger.md` if it exists. Skip any chapter whose ledger row says `merged`.

## Order

Follow this order. Chapter 11 is before chapter 10 because location must land before the post-listing form.

1. `.plans/frontend-structure/chapters/01-import-alias.md`
2. `.plans/frontend-structure/chapters/02-auth-feature.md`
3. `.plans/frontend-structure/chapters/03-listing-types-utils.md`
4. `.plans/frontend-structure/chapters/04-listing-read-services.md`
5. `.plans/frontend-structure/chapters/05-listing-write-services.md`
6. `.plans/frontend-structure/chapters/06-reserve-button.md`
7. `.plans/frontend-structure/chapters/07-contact-reveal.md`
8. `.plans/frontend-structure/chapters/08-seller-actions-folder.md`
9. `.plans/frontend-structure/chapters/09-listing-detail-container-view.md`
10. `.plans/frontend-structure/chapters/11-location-feature.md`
11. `.plans/frontend-structure/chapters/10-post-listing-container-form.md`
12. `.plans/frontend-structure/chapters/12-browse-data.md`
13. `.plans/frontend-structure/chapters/13-buyer-tab-and-map.md`
14. `.plans/frontend-structure/chapters/14-shell-and-app-routing.md`
15. `.plans/frontend-structure/chapters/15-retire-vacated-dirs.md`

## One chapter

Launch one foreground `chapter-implementer`. Put this in its prompt (it cannot see this chat):

- Absolute path of the single chapter file.
- Read that file, `.plans/frontend-structure/00-architecture.md`, and `.plans/frontend-structure/gaps-and-decisions.md`.
- `git checkout main && git pull`, then the feature branch named in that chapter.
- Implement only that chapter, including its red/green pairs and refactor gate.
- `./ci.sh` from the repo root must pass before any push.
- Commit with the subjects in that chapter. Push with `git push -u origin HEAD`.
- `gh pr create`. Then `gh pr checks --watch` until both GitHub Actions jobs (`ci` and `rls-smoke`) pass.
- Only then `gh pr merge --merge --delete-branch`, then `git checkout main && git pull`.
- Do not start another chapter. Do not edit `.plans/frontend-structure/run-ledger.md`.
- Return: chapter, branch, PR URL, local `./ci.sh` result, GitHub check result, merge result, refactor-gate outcome, blockers or "none".

Wait for that subagent. Append one row to `.plans/frontend-structure/run-ledger.md`:

```text
| chapter | branch | pr | local ci | github | merged | blocker |
```

If local CI failed, GitHub checks failed, the merge did not happen, or the report contains a blocker, stop. Leave the remaining chapters unstarted.

If the row says `merged` and the blocker is `none`, launch the next chapter the same way.
