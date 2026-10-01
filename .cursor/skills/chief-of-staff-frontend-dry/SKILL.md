---
name: chief-of-staff-frontend-dry
description: >-
  Orchestrates the eggs frontend-dry chapters one at a time. Use only when
  the user explicitly launches chief of staff frontend-dry,
  /chief-of-staff-frontend-dry, or asks to run the frontend-dry chapter loop.
disable-model-invocation: true
---

# Chief of staff (frontend-dry)

You coordinate. You do not edit product code, commit, push, or merge.

Each chapter is a new foreground `chapter-implementer` subagent. Never resume a previous one. Never run two at once. Do not use multitask or parallel workers.

## Preflight

Stop before the first chapter unless all of these hold:

1. `gh auth status` succeeds for `github.com`.
2. `git cat-file -e main:.plans/frontend-dry/chapters/README.md` succeeds. If it fails, the frontend-dry plans are not on `main`. Tell the user to merge the plans branch first. Do not check out `main` yourself.
3. Read `.plans/frontend-dry/run-ledger.md` if it exists. Skip any chapter whose ledger row says `merged`.

## Corporate build environment

Pass these to every `chapter-implementer` prompt (agents cannot see the user’s `.env`). Instruct the implementer to export them before `npm ci` and `./ci.sh`:

- `NPM_CONFIG_REGISTRY`: `https://npm.packages.rsint.net/artifactory/api/npm/rs_npm_virtual/`
- `HTTP_PROXY` / `HTTPS_PROXY`: `http://185.46.212.88:9480/`
- `NO_PROXY`: `localhost,127.0.0.1,.rsint.net,.rsext.net`
- `DOCKER_REGISTRY`: `docker.packages.rsint.net/docker.io`
- `RS_DOCKER_REGISTRY`: `docker.packages.rsint.net`
- `PYPI_INDEX_URL`: `https://pypi.packages.rsint.net/api/pypi/rs_pypi_virtual/simple`
- `PYPI_EXTRA_INDEX_URL`: `https://pypi.packages.rsint.net/api/pypi/rs_common_components/simple`

## Order

Follow [01-rollout.md](.plans/frontend-dry/01-rollout.md) chapters 1–8 in order:

1. `.plans/frontend-dry/chapters/01-default-map-center.md`
2. `.plans/frontend-dry/chapters/02-use-supabase-query.md`
3. `.plans/frontend-dry/chapters/03-read-hooks-migration.md`
4. `.plans/frontend-dry/chapters/04-use-async-action.md`
5. `.plans/frontend-dry/chapters/05-mutation-migration.md`
6. `.plans/frontend-dry/chapters/06-listing-summary-line.md`
7. `.plans/frontend-dry/chapters/07-post-form-chakra.md`
8. `.plans/frontend-dry/chapters/08-seller-expiry-chakra.md`

## One chapter

Launch one foreground `chapter-implementer`. Put this in its prompt (it cannot see this chat):

- Absolute path of the single chapter file.
- Plan folder: `.plans/frontend-dry` — read that chapter, `.plans/frontend-dry/00-architecture.md`, and `.plans/frontend-dry/gaps-and-decisions.md`.
- Do not edit `.plans/frontend-dry/run-ledger.md`.
- Corporate build environment variables (see above); export before any package install or `./ci.sh`.
- `git checkout main && git pull`, then the feature branch named in that chapter.
- Implement only that chapter, including its red/green pairs and refactor gate.
- `./ci.sh` from the repo root must pass before any push.
- Commit with the subjects in that chapter. Push with `git push -u origin HEAD`.
- `gh pr create`. Then `gh pr checks --watch` until both GitHub Actions jobs (`ci` and `rls-smoke`) pass.
- Only then `gh pr merge --merge --delete-branch`, then `git checkout main && git pull`.
- Do not start another chapter.
- Return: chapter, branch, PR URL, local `./ci.sh` result, GitHub check result, merge result, refactor-gate outcome, blockers or "none".

Wait for that subagent. Append one row to `.plans/frontend-dry/run-ledger.md` (create the file with the header row below if missing):

```text
# Frontend-dry run ledger

| chapter | branch | pr | local ci | github | merged | blocker |
| --- | --- | --- | --- | --- | --- | --- |
```

If local CI failed, GitHub checks failed, the merge did not happen, or the report contains a blocker, stop. Leave the remaining chapters unstarted.

If the row says `merged` and the blocker is `none`, launch the next chapter the same way.
