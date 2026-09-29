---
name: "Chapter 3 — Farmer/buyer tabs"
overview: "A RoleTabs component inside the floating panel's body: Chakra Tabs, variant enclosed, left tab 🧑‍🌾 farmer / right tab 👨🏻‍💼 buyer, each with placeholder content wired up for real in chapters 4 and 5."
todos:
  - id: role-tabs
    content: "RoleTabs component with enclosed Tabs.Root and two triggers"
    status: pending
  - id: i18n-labels
    content: "Tab label strings through t(key)"
    status: pending
isProject: false
---

# Chapter 3 — Farmer/buyer tabs

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-farmer-buyer-tabs` · **Status:** planned

**Depends on:** [1](01-floating-panel-shell.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §4, §7 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Put the farmer/buyer split the whole redesign is organized around into the panel, so chapters 4 and
5 each have exactly one place to render their content into.

## Design decisions

**`RoleTabs` is a dumb container in this chapter.** `Tabs.Root variant="enclosed"` with two
`Tabs.Trigger`s (🧑‍🌾 + `t("tabs.farmer")`, 👨🏻‍💼 + `t("tabs.buyer")`) and two `Tabs.Content`
panes, each rendering a placeholder (`<Text>{t("common.comingSoon")}</Text>` — an existing key,
`src/i18n/strings.de.ts`) until chapters 4 and 5 fill them in. This keeps chapter 3 verifiable and
shippable on its own (invariant 4 in [../01-rollout.md](../01-rollout.md)) without needing the
search/grid or posting logic to exist yet.

**Emoji + text label, not emoji alone** — see
[../gaps-and-decisions.md](../gaps-and-decisions.md) D4.

**Default tab is the buyer tab.** Browsing is what an anonymous visitor does first (same "browsing
needs no login" principle as `.plans/mvp/00-architecture.md` §7) — posting requires being signed in
as a farmer, so it shouldn't be the first thing a new visitor sees.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/components/RoleTabs.tsx` | `Tabs.Root` with farmer/buyer triggers and content panes |
| `src/components/RoleTabs.test.tsx` | Tests below |

**Edit:**

| Path | Change |
| --- | --- |
| `src/components/AppShell.tsx` | Render `RoleTabs` (instead of raw `children`) inside `FloatingPanel.Body` |
| `src/i18n/strings.de.ts` | Add `tabs.farmer`, `tabs.buyer` keys |

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| `RoleTabs · renders a farmer tab and a buyer tab trigger` | Structure |
| `RoleTabs · defaults to the buyer tab's content visible` | Default state |
| `RoleTabs · clicking the farmer tab shows farmer content and hides buyer content` | Interaction |

## Green

1. `strings.de.ts` — add the two tab-label keys.
2. `RoleTabs` with `Tabs.Root variant="enclosed"`, two triggers, two content panes; tests 1–3.
3. Wire `RoleTabs` into `AppShell`.

## Refactor gate

`RoleTabs` stays presentation-only — no data fetching, no auth checks; those belong to chapters 4
and 5's content. Report the outcome.

## Verification

```bash
npm run test -- --run
./ci.sh
npm run dev
# manual: open localhost, confirm the panel shows two enclosed tabs with the farmer/buyer emoji,
# defaulting to the buyer tab, and switching tabs swaps the (placeholder) content
```

## Out of scope

Real farmer/buyer tab content (chapters 4, 5), dialogs (chapter 6).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-ui-farmer-buyer-tabs
```

```text
test(web): describe the RoleTabs farmer/buyer switch

feat(web): add the enclosed farmer/buyer tabs inside the floating panel
```
