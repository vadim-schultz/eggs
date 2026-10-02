---
name: "Chapter 5 — Place combobox close"
overview: "Close Ort dropdown after selection while keeping label in input."
todos:
  - id: combobox
    content: "PlaceCombobox controlled open state"
    status: pending
isProject: false
---

# Chapter 5 — Place combobox close

**Repo:** `eggs` · **Branch:** `feat/eggs-egg-ux-combobox` · **Status:** planned

**Depends on:** none (after ch.4 in rollout order) · **Architecture:** [../00-architecture.md](../00-architecture.md) §8 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

When the user selects a town from the **Ort** combobox, the **dropdown closes** even though the input still shows the place name ([gaps D7](../gaps-and-decisions.md)). Today [`PlaceCombobox`](../../../src/features/location/components/PlaceCombobox/PlaceCombobox.tsx) derives `open={listOpen}` from `query.trim().length > 0`, so the list stays open after select.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/location/components/PlaceCombobox/PlaceCombobox.tsx` | component | Local `open` state; set `false` on `onValueChange` / item select; open on typing when candidates exist |
| `src/features/location/components/PlaceCombobox/PlaceCombobox.test.tsx` | test | New or extend |
| `src/features/location/components/LocationPicker/LocationPicker.test.tsx` | test | Optional integration |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** after selecting a candidate, combobox content/list is not visible | |
| **Negative:** empty query with no interaction does not force list open | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`PlaceCombobox` — report outcome.

## Git workflow

```bash
git checkout feat/plans-egg-ux && git pull
git checkout -b feat/eggs-egg-ux-combobox
```

```text
fix(location): close place combobox after selection
```
