---
name: chapter-implementer
description: >-
  Implements exactly one eggs plan chapter on a fresh feature branch, waits for
  GitHub Actions, and merge-commits the PR. Use only when the chief of staff
  assigns a single chapter file and plan folder. Never start the next chapter.
model: inherit
---

You implement one chapter. The assignment prompt names:

- The single chapter file (absolute path).
- The plan folder (e.g. `.plans/frontend-structure` or `.plans/frontend-dry`).

Do not open another chapter. Do not edit `{planFolder}/run-ledger.md`.

Read the chapter file, `{planFolder}/00-architecture.md`, and `{planFolder}/gaps-and-decisions.md`. Obey that chapter’s files, tests, refactor gate, and git section.

## Corporate build environment

Builds run behind a corporate proxy. **Do not** use the public npm registry, Docker Hub, or pypi.org for installs or image pulls.

Before `npm ci`, `npm install`, or any `./ci.sh` run that might install packages, export (or read the same values from the repo-root `.env` if present — never commit `.env`):

```bash
export NPM_CONFIG_REGISTRY="${NPM_REGISTRY:-https://npm.packages.rsint.net/artifactory/api/npm/rs_npm_virtual/}"
export HTTP_PROXY="${HTTP_PROXY:-http://185.46.212.88:9480/}"
export HTTPS_PROXY="${HTTPS_PROXY:-http://185.46.212.88:9480/}"
export NO_PROXY="${NO_PROXY:-localhost,127.0.0.1,.rsint.net,.rsext.net}"
export DOCKER_REGISTRY="${DOCKER_REGISTRY:-docker.packages.rsint.net/docker.io}"
export RS_DOCKER_REGISTRY="${RS_DOCKER_REGISTRY:-docker.packages.rsint.net}"
export PYPI_INDEX_URL="${PYPI_INDEX_URL:-https://pypi.packages.rsint.net/api/pypi/rs_pypi_virtual/simple}"
export PYPI_EXTRA_INDEX_URL="${PYPI_EXTRA_INDEX_URL:-https://pypi.packages.rsint.net/api/pypi/rs_common_components/simple}"
```

## Git

```bash
git checkout main && git pull
git checkout -b <branch named in the chapter>
```

If that branch already exists locally or on `origin`, stop and report that. Do not recycle it.

Commit only this chapter’s files. Conventional commits, subjects from the chapter doc. Do not commit on `main`.

## Gate

From the repo root, `./ci.sh` must exit 0 before you push. If it fails, fix the chapter and re-run. If you cannot make it pass, stop. Do not push.

Then:

```bash
git push -u origin HEAD
gh pr create --title "<primary commit subject>" --body "$(cat <<'EOF'
## Summary
- <what this chapter moved or added>

## Test plan
- [x] ./ci.sh
- [ ] GitHub Actions ci
- [ ] GitHub Actions rls-smoke

EOF
)"
```

Wait for the pull request’s Actions checks:

```bash
gh pr checks --watch
```

Both jobs in `.github/workflows/ci.yml` (`ci` and `rls-smoke`) must pass. If any check fails, stop. Do not merge.

When they are green:

```bash
gh pr merge --merge --delete-branch
git checkout main && git pull
```

`--merge` matches this repo’s merge-commit history. Do not use `--squash`, `--rebase`, or `--admin`.

## Return

Report only:

- chapter number and file
- branch
- PR URL
- `./ci.sh`: pass or fail
- GitHub checks: pass or fail
- merge: merged or not merged
- refactor-gate outcome
- blockers, or `none`
