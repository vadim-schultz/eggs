---
name: "Chapter 8 — Seller expiry Chakra fields"
overview: "Wrap seller expires_at date input in Field.Root/Label/ErrorText; align mark-sold error display with Field.ErrorText where applicable."
todos:
  - id: seller-chakra
    content: "ExpiryEditor Chakra Field markup"
    status: pending
isProject: false
---

# Chapter 8 — Seller expiry Chakra fields

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-chakra-seller-expiry` · **Status:** planned

**Depends on:** [5](05-mutation-migration.md) optional · **Architecture:** [../00-architecture.md](../00-architecture.md) §5 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Seller-facing expiry editor uses the same Chakra `Field.*` pattern as the post form; RPC error and bound error
render through `Field.ErrorText` / `Text color="fg.error"` consistently (prefer `Field.ErrorText` under
`Field.Root`).

## Design decisions

**ExpiryEditor** (`src/features/listings/components/SellerActions/ExpiryEditor.tsx`):

```tsx
<Field.Root invalid={error !== null}>
  <Field.Label>{t("seller.expiresAt.label")}</Field.Label>
  <HStack>
    <Input type="date" … />
    <Button … />
  </HStack>
  {error === "bound" && <Field.ErrorText>{t("seller.expiresAt.error")}</Field.ErrorText>}
  {error === "rpc" && <Field.ErrorText>{t("seller.error")}</Field.ErrorText>}
</Field.Root>
```

**MarkStatusActions:** optional pass — if errors still use bare `Text color="fg.error"`, wrap in `Field.Root`
only if it improves a11y without layout change; minimum scope is **ExpiryEditor** only.

Reuse `PostFormField` only if props fit date input + side button — otherwise keep ExpiryEditor explicit (avoid
forced abstraction).

## Files

**Edit:** `src/features/listings/components/SellerActions/ExpiryEditor.tsx`

**Edit tests:** `src/features/listings/components/SellerActions.test.tsx` — expiry bound test still finds error text

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `SellerActions · mark sold calls mark_listing_sold` | Unchanged |
| **Negative:** `SellerActions · expires_at editor rejects a date beyond the allowed bound` | Bound error visible (role/text) |

Add assertion: no raw `<label>` in SellerActions tree — `label:not([data-scope="field"])` count 0 (same as post form / LocationPicker).

## Green

1. Update ExpiryEditor markup.
2. Run SellerActions tests.

## Refactor gate

SellerActions is already split into sub-components — this chapter is **ExpiryEditor markup only**. Report outcome.

## Verification

```bash
npm run test -- --run src/features/listings/components/SellerActions.test.tsx
./ci.sh
```

## Out of scope

Mark sold/cancel button styling changes.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-chakra-seller-expiry
```

```text
test(web): seller expiry field uses Chakra Field error text

feat(web): Chakra Field layout for seller expires_at editor
```
