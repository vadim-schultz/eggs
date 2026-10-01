---
name: "Chapter 15 — Retire vacated directories"
overview: "Remove empty legacy directories and verify no imports reference src/routes, src/auth, src/hooks, or orphaned lib/components paths; optional follow-up note for eslint import boundaries."
todos:
  - id: cleanup
    content: "delete vacated dirs + grep verification"
    status: completed
isProject: false
---

# Chapter 15 — Retire vacated directories

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-retire-vacated-dirs` · **Status:** shipped

**Depends on:** [14](14-shell-and-app-routing.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §8 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Remove structural debris left after chapters 2–14 so `src/` matches the target tree with no empty legacy
folders and no stale import paths.

## Design decisions

**Delete if empty or fully migrated:**

- `src/routes/` (ListingDetail, PostListing should already be gone)
- `src/auth/`
- `src/hooks/`
- Orphaned files under `src/components/` except `components/ui/toaster.tsx`
- Any remaining domain files under `src/lib/` except `env.ts` and `supabaseClient.ts`

**Verification via ripgrep** (document commands in chapter outcome):

```bash
rg 'from ["\']\.\./(\.\./)*(routes|auth|hooks|lib/listing|lib/geocode|components/BuyerTab)' src
rg 'src/auth/|src/routes/|src/hooks/' src .plans/frontend-structure
```

**.plans/mvp** and **ui-overhaul** paths are intentionally stale (D7) — grep is for `src/` only.

**Optional:** file a follow-up issue for `import/no-restricted-paths` (open seam in gaps-and-decisions) — do not block this chapter on eslint plugin work unless already configured.

## Files

**Delete:** vacated directories and any stray re-export files.

**Edit:** none expected — if grep finds stragglers, fix imports in this PR.

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `./ci.sh` exit 0 | Full gate green |
| **Negative:** `test -d src/routes && test -d src/auth` — expect failure (dirs absent) | Legacy dirs removed |

No new Vitest cases required unless a straggler fix needs regression coverage.

## Green

1. Run ripgrep audit; delete empty dirs.
2. `./ci.sh` full run.
3. Record grep output in chapter **Outcome** section.

## Refactor gate

**No production code changes** unless grep finds imports — report: "cleanup only" or list fixed stragglers.

**Outcome:** cleanup only. Grep under `src/` found no stragglers, so no imports were rewritten.

## Verification

```bash
./ci.sh
rg 'from ["\']\\.\\./auth' src || true
# expect no matches
```

Update [.plans/README.md](../../README.md) **frontend-structure** status to note chapters shipped when this merges (maintainer updates per chapter as they land).

## Out of scope

Rewriting `.plans/mvp/` path references; eslint boundary rules.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-retire-vacated-dirs
```

```text
chore(web): remove vacated src directories after feature-folder migration
```

## Outcome

`src/routes/`, `src/auth/`, and `src/hooks/` were already absent (removed in chapters 2, 9–10, and 12).
`src/components/` contains only `ui/toaster.tsx`. `src/lib/` contains only `env.ts`, `env.test.ts`, and
`supabaseClient.ts`. No empty legacy directories and no stray re-export files remained to delete.

Negative check (`test -d src/routes && test -d src/auth`) fails, as required: both directories are absent.

Grep (`src/` only; `.plans/mvp` and `.plans/ui-overhaul` left stale per D7):

```text
rg 'from ["\']/../(../)*(routes|auth|hooks|lib/listing|lib/geocode|components/BuyerTab)' src
# no matches

rg 'src/auth/|src/routes/|src/hooks/' src
# no matches

rg 'from ["\']/../auth' src
# no matches
```

`rg 'src/auth/|src/routes/|src/hooks/' .plans/frontend-structure` still hits the architecture file map and
earlier chapter plans, which describe the pre-move paths. Those are historical plan text, not live imports.

`import/no-restricted-paths` is not configured. The open seam in gaps-and-decisions stays deferred; this
chapter does not add the eslint plugin.

Refactor gate: cleanup only.
