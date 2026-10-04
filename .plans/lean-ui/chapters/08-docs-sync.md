---
name: "Chapter 8 — Docs sync"
overview: "Update plan READMEs and any docs that describe status badges, radios or the dialog contents; mark the suite shipped."
todos:
  - id: grep
    content: "Find stale references (status badge, radio, price per egg in buyer view)"
    status: pending
  - id: plans
    content: "lean-ui suite and .plans/README.md status → shipped; chapter statuses"
    status: pending
isProject: false
---

# Chapter 8 — Docs sync

**Repo:** `eggs` · **Branch:** `feat/lean-ui-docs` · **Status:** planned

**Depends on:** [7](07-buyer-reservation-list.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Docs match the shipped UI. Documentation only.

## Design decisions

- `grep -rniE "status badge|radio|price per egg|Verfügbar|You are here|Your location" README.md docs .plans/README.md` and fix descriptions of the buyer/seller dialogs, carton picker and panel. Do **not** edit other suites' chapter files; a short "superseded by lean-ui" note in their architecture is allowed only where the text is now wrong.
- Set `**Status:** shipped` in [00-architecture.md](../00-architecture.md), chapter statuses in [01-rollout.md](../01-rollout.md) and chapter files, and update the `lean-ui` entry in [`.plans/README.md`](../../README.md) (status shipped, loop branch, release PR pending).
- Do not touch `run-ledger.md`.

## Files

| Path | Change |
| --- | --- |
| `README.md`, `docs/**` | Only where stale |
| `.plans/lean-ui/**`, `.plans/README.md` | Status |

## Red tests

Documentation chapter: no new tests. The checks are:

| Check | Asserts |
| --- | --- |
| **Happy** | Every relative link in touched docs resolves (`grep -o "](\.[^)]*)"` and test each path) |
| **Negative** | The `grep` above finds no description of removed UI |

## Green

`./ci.sh` green.

## Refactor gate

No code changes in `src/` (`git diff --stat origin/feat/plans-lean-ui -- src` is empty). Report outcome.

## Git workflow

```bash
git checkout feat/plans-lean-ui && git pull
git checkout -b feat/lean-ui-docs
```

```text
docs: sync docs and plans with the lean UI
```
