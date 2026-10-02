---
name: "Chapter 2 — KeyValueRow 1:3"
overview: "Global key-value grid 1fr 3fr, top-left alignment."
todos:
  - id: kv
    content: "KeyValueRow + migrate usages + tests"
    status: pending
isProject: false
---

# Chapter 2 — KeyValueRow 1:3

**Branch:** `feat/eggs-panel-kv-row` · **Depends on:** none (parallel with ch.1 ok)

---

## Goal

All panel forms use one **`KeyValueRow`**: label column **1**, value **3**, **`alignItems="start"`**.

## Files

| Path | Layer |
| --- | --- |
| `src/components/ui/KeyValueRow.tsx` | ui |
| `src/components/ui/KeyValueRow.test.tsx` | test |
| Call sites: `BuyerSearchRows`, `LocationPicker` (non-embed), `PostListingForm`, future listing KV | component |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `KeyValueRow` root uses `templateColumns` 1fr / 3fr (or equivalent) | |
| **Negative:** grid does not use equal 1:1 columns | |

## Green

Implement; `./ci.sh`.

## Refactor gate

`KeyValueRow` only — report outcome.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-panel-kv-row
```

```text
refactor(web): KeyValueRow 1:3 ratio and top alignment
```
