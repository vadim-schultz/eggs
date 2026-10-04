---
name: "Chapter 3 — Active sign-in"
overview: "Extract signInWithGoogle and make the signed-out reserve button start the login."
todos:
  - id: service
    content: "features/auth/services/signInWithGoogle.ts extracted from AuthButton"
    status: pending
  - id: wire
    content: "AuthButton and ReserveButton signed-out branch call it; button not disabled"
    status: pending
isProject: false
---

# Chapter 3 — Active sign-in

**Repo:** `eggs` · **Branch:** `feat/lean-ui-signin` · **Status:** planned

**Depends on:** [2](02-carton-cards.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §5 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

"Zum Reservieren anmelden" is an enabled button that takes the viewer to the Google login ([D7](../gaps-and-decisions.md)).

## Design decisions

- New `src/features/auth/services/signInWithGoogle.ts` exports `signInWithGoogle()`: `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } })`, moved verbatim from [`AuthButton`](../../../src/features/auth/components/AuthButton.tsx).
- `AuthButton` calls the service. The signed-out branch of [`ReserveButton`](../../../src/features/listings/components/ReserveButton/ReserveButton.tsx) renders `<Button onClick={signInWithGoogle}>` (no `disabled`) with `t("reserve.signInRequired")`.
- Redirect target stays `window.location.origin`; returning to the same listing after login is deferred.

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/auth/services/signInWithGoogle.ts` (+ test) | auth | New |
| `src/features/auth/components/AuthButton.tsx` | auth | Use service |
| `src/features/listings/components/ReserveButton/ReserveButton.tsx` | listings | Active sign-in button |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** signed-out `ReserveButton` | Button "Zum Reservieren anmelden" is enabled; click calls `signInWithOAuth` with provider `google` and `redirectTo` = origin |
| **Happy:** `AuthButton` signed out | Click calls the same service |
| **Negative:** signed in | No sign-in button, carton picker shown |
| **Negative:** session loading | Renders nothing (no flash of the sign-in button) |

## Green

Implement; `./ci.sh`.

## Refactor gate

`grep -rn "signInWithOAuth" src` shows only the service (and tests). Report outcome.

## Git workflow

```bash
git checkout feat/plans-lean-ui && git pull
git checkout -b feat/lean-ui-signin
```

```text
fix(auth): make the reserve sign-in button start the Google login
```
