---
name: "Chapter 1 — Shell chrome and roles"
overview: "Bree Eierbauer title, TbEggs menu trigger, Verkäufer/Käufer i18n with tab emojis kept."
todos:
  - id: shell
    content: "Shell components + i18n + tests"
    status: pending
isProject: false
---

# Chapter 1 — Shell chrome and roles

**Repo:** `eggs` · **Branch:** `feat/eggs-minimal-shell` · **Status:** planned

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Panel title uses Bree heading font; menu trigger uses `TbEggs`; role tabs show **Verkäufer** / **Käufer** with existing emojis.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/shell/components/AppShell/AppShellPanel.tsx` | component | `fontFamily="heading"` on title |
| `src/features/shell/components/AppShell/AppShellMenuTrigger.tsx` | component | `TbEggs` IconButton |
| `src/i18n/strings.de.ts` | i18n | `tabs.farmer`, `tabs.buyer` strings |
| `src/features/shell/components/RoleTabs.test.tsx` | test | assert Verkäufer/Käufer visible |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** RoleTabs renders Verkäufer and Käufer text with emojis | |
| **Negative:** RoleTabs does not render Landwirt | |

## Green

Implement; `./ci.sh`.

## Refactor gate

Shell files stay small — report outcome.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-minimal-shell
```

```text
feat(web): Verkäufer/Käufer labels and TbEggs menu chrome
```
