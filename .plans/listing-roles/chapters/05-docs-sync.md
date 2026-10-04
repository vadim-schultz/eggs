---
name: "Chapter 5 — Docs sync"
overview: "Update mvp lifecycle docs, deploy runbook and plans index to match the automatic lifecycle."
todos:
  - id: mvp-docs
    content: "mvp architecture/gaps: lifecycle is automatic, no seller handling"
    status: pending
  - id: ops
    content: "docs/operations/deploy.md and plans README reflect the change"
    status: pending
isProject: false
---

# Chapter 5 — Docs sync

**Repo:** `eggs` · **Branch:** `feat/listing-roles-docs` · **Status:** planned

**Depends on:** [4](04-seller-reservations-view.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Documentation matches shipped behaviour; no doc still describes mark sold, withdraw or expiry editing.

## Design decisions

- `grep -rln "mark sold\|mark_listing\|expiry\|Ablaufdatum\|cancelled" .plans/mvp docs README.md` and update only current-behaviour statements; historical plan text in other suites is not edited ([overlap rule](../gaps-and-decisions.md)).
- Add a short "Listing lifecycle" note to [`docs/operations/deploy.md`](../../../docs/operations/deploy.md): visibility is query-time, `expire_listings()` cron is cleanup.
- [`.plans/README.md`](../../README.md): set the listing-roles status to shipped and keep the table accurate.
- Set every chapter's status in this suite to shipped.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `.plans/mvp/*.md` | docs | Lifecycle statements |
| `docs/operations/deploy.md` | docs | Lifecycle note |
| `.plans/README.md`, `.plans/listing-roles/*` | docs | Status |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `./ci.sh` passes | |
| **Negative:** the grep above finds no remaining current-behaviour mention of removed features | |

## Green

Edit docs; `./ci.sh`.

## Refactor gate

No duplicated lifecycle descriptions across docs; link to [00-architecture.md](../00-architecture.md) §3 instead — report outcome.

## Git workflow

```bash
git checkout feat/plans-listing-roles && git pull
git checkout -b feat/listing-roles-docs
```

```text
docs: sync lifecycle docs with automatic listing expiry
```
