---
name: "Chapter 7 — Contact reveal"
overview: "Extract useListingContact to features/listings/hooks; move ContactReveal component; optional thin container wrapper if needed for tests."
todos:
  - id: contact-hook
    content: "useListingContact + move ContactReveal.tsx"
    status: pending
isProject: false
---

# Chapter 7 — Contact reveal

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-fs-contact-reveal` · **Status:** planned

**Depends on:** [4](04-listing-read-services.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Separate contact fetch logic from presentation: hook + presentational `ContactReveal` under listings feature.

## Design decisions

**Two modules:**

- `hooks/useListingContact.ts` — uses `fetchListingContact` from `listingsApi`
- `components/ContactReveal.tsx` — calls hook OR accepts `contactNote` prop from a tiny wrapper

Prefer **container-less** pattern if tests mock hook: keep one default export component that uses the hook
internally (same as today) but hook lives in `hooks/` file.

**View rule:** if split, presentational piece has no `supabase` import.

## Files

**Add/move:**

| Path | Purpose |
| --- | --- |
| `src/features/listings/hooks/useListingContact.ts` | extracted |
| `src/features/listings/components/ContactReveal.tsx` | moved |
| `src/features/listings/components/ContactReveal.test.tsx` | moved |

**Delete:** `src/components/ContactReveal.tsx` (+ old test).

## Manual configuration

None.

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `ContactReveal · renders the contact_note when a row is returned` | Note visible |
| **Negative:** `ContactReveal · renders nothing when the query returns no listing_contact row` | Empty DOM |

## Green

1. Extract hook; move component + test.
2. Update ListingDetail import.
3. Delete old files.

## Refactor gate

Single presentational component — **no folder split** unless a second sub-component appears. Report outcome.

## Verification

```bash
npm run test -- --run src/features/listings/components/ContactReveal.test.tsx
./ci.sh
```

## Out of scope

ListingDetail container/view — chapter 9.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-fs-contact-reveal
```

```text
test(web): contact reveal under features/listings

refactor(web): extract useListingContact and move ContactReveal
```
