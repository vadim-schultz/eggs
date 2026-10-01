---
name: "Chapter 7 — Google OAuth redirect fix"
overview: "Fix the Google sign-in redirect landing on http://localhost:3000 instead of the production domain: pass an explicit redirectTo in AuthButton, and correct the hosted Supabase project's Site URL / Redirect URLs, which drifted from what docs/operations/deploy.md step 3 documents."
todos:
  - id: redirect-to
    content: "AuthButton.tsx passes redirectTo: window.location.origin"
    status: done
  - id: dashboard-fix
    content: "Supabase Authentication -> URL Configuration corrected for the hosted project"
    status: pending
isProject: false
---

# Chapter 7 — Google OAuth redirect fix

**Repo:** `eggs` (`src/`) · **Branch:** `feat/eggs-ui-google-oauth-redirect-fix` · **Status:** in review (code); dashboard fix still manual

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §9 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Sign-in with Google against the live eierbauer.cc deployment currently redirects to
`http://localhost:3000/#access_token=...` instead of back to the app — fix both the code
(so it's correct regardless of dashboard state) and the dashboard setting that's the actual root
cause.

## Design decisions

**Fix the dashboard setting, don't just patch around it in code.** The redirect target Supabase
uses when `signInWithOAuth` is called without an explicit `redirectTo` is the project's
**Authentication → URL Configuration → Site URL**. `docs/operations/deploy.md` step 3 already
documents that this must be set to the Cloudflare Pages production domain — the `localhost:3000`
redirect means the hosted project's Site URL (and/or its Redirect URLs allow-list) still has the
local-dev default, or was never updated for the current `eierbauer.cc` domain. This is a one-time
dashboard correction, not a recurring one — same "manual configuration, no code equivalent" shape
as the deploy runbook's other steps.

**Also pass `redirectTo` explicitly in code**, as defense in depth: `AuthButton.tsx`'s
`signInWithOAuth({ provider: "google" })` call (`src/auth/AuthButton.tsx:12-16`) becomes
`signInWithOAuth({ provider: "google", redirectTo: window.location.origin })`. This makes the
redirect correct for whichever origin actually served the page (production domain, or a
`*.pages.dev` preview deploy) without depending on the dashboard's Site URL matching that origin —
the Redirect URLs allow-list (also covered in deploy.md step 3) still has to include that origin,
but at least the *intended* target is no longer implicit.

## Files

**Edit:**

| Path | Change |
| --- | --- |
| `src/auth/AuthButton.tsx` | `signInWithOAuth({ provider: "google" })` → add `redirectTo: window.location.origin` |
| `src/auth/AuthButton.test.tsx` | Test below |

## Manual configuration

In the hosted Supabase project's dashboard, **Authentication → URL Configuration**:

- **Site URL** → `https://eierbauer.cc` (not `http://localhost:3000`).
- **Redirect URLs** → includes `https://eierbauer.cc` (and the `*.pages.dev` preview pattern, if
  preview deploys should support sign-in — see `docs/operations/deploy.md` step 3, which already
  specifies this but evidently wasn't applied, or was reset, for the current domain).

After saving, re-run the smoke test from `docs/operations/deploy.md` step 5 (sign in with a real
Google account against the production URL) to confirm the redirect lands back on the app rather
than `localhost`.

## Red tests

| Test | Asserts |
| --- | --- |
| `AuthButton · calls signInWithOAuth with redirectTo set to the current origin` | Mocked `supabase.auth.signInWithOAuth`, asserts the call args |

## Green

1. `AuthButton.tsx` — add `redirectTo: window.location.origin`; test 1.
2. Manual: correct the Supabase dashboard Site URL / Redirect URLs as above.

**Outcome:** Step 1 shipped. Step 2 is a dashboard change this environment has no access to
perform — see Manual configuration above and the walkthrough the assistant gave the user in chat;
it's the only remaining item before this chapter is fully done.

## Refactor gate

Single-line change to an existing call — no structural change to report against.

**Outcome:** Confirmed — the diff is one call-site edit plus its test; no method or file crossed a
size/nesting threshold. No refactor needed.

## Implementation notes

**`redirectTo` nests under `options`, not top-level, contrary to this chapter's own Design
decisions section.** The plan's prose (and the Files table) describes
`signInWithOAuth({ provider: "google", redirectTo: window.location.origin })`, but
`@supabase/auth-js`'s `SignInWithOAuthCredentials` type only accepts `provider` and an optional
`options` object at the top level — `redirectTo` lives at `options.redirectTo`. `tsc` caught this
immediately (`TS2353: Object literal may only specify known properties`). Both the test and the
implementation use `{ provider: "google", options: { redirectTo: window.location.origin } }`
instead.

**Opening the PR surfaced two unrelated, pre-existing CI/deploy breakages, fixed in the same PR at
the user's request.** Neither is caused by this chapter's one-line change, but both were blocking
it (and had been silently blocking every merge back through at least chapter 5 — `gh pr checks` on
PRs #23 and #24 shows the same `ci`/Workers-Builds failures, merged anyway with no branch
protection catching it):

- **`ci` (GitHub Actions) failed on `AppShell.test.tsx`, `BuyerTab.test.tsx`, `FarmerTab.test.tsx`**
  with `Missing required environment variable: VITE_SUPABASE_URL`. These three test files render
  components that import `supabaseClient.ts` without mocking it (unlike `AuthButton.test.tsx`),
  so `src/lib/env.ts`'s `requireVar` throws for real. Locally this was masked by `.env.local`
  (gitignored, not present in CI) — Vite's env loading reads `.env.local` in every mode, including
  vitest's `test` mode. Fix: added `.env.test` (committed, non-secret dummy values) — the Vite
  convention for mode-specific env that CI should also see. No secret was invented or exposed: the
  values are placeholders (`http://localhost:54321` / `test-anon-key`), never used for a real
  network call in these tests.
- **Cloudflare's preview build failed** with `Your Wrangler configuration is missing a 'previews'
  block`. The live `eggs` project runs under Cloudflare's Workers Builds product, which runs
  `npx wrangler preview` for every non-production branch/PR; that command hard-requires a
  `previews` block in a Wrangler config file, even an empty one, and the repo had no Wrangler
  config at all. Fix: added `wrangler.jsonc` (`name: "eggs"`, `assets.directory: "./dist"`,
  `previews: {}`) — see `docs/operations/deploy.md` step 4's new note. This also means
  `docs/operations/deploy.md`'s step 4 was describing classic Cloudflare Pages when the live
  project is actually a Workers Builds project; noted there rather than rewritten wholesale, since
  rewriting the deploy runbook's product model is out of scope for this chapter.

## Verification

```bash
npm run test -- --run
./ci.sh
# manual: after the dashboard fix, sign in with Google against https://eierbauer.cc and confirm
# the redirect lands back on the app, signed in — not on localhost
```

`npm run test -- --run` (75 passed) and `./ci.sh` (lint, format, typecheck, test, build) both pass
on this branch. The manual dashboard fix and the real-Google-account smoke test are outside this
environment's reach — no access to the hosted Supabase project's dashboard or a real Google
account/browser round-trip against production — so they're left for the user; see the walkthrough
given in chat.

## Out of scope

Any other auth provider or flow change — this chapter is the redirect fix only.

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-ui-google-oauth-redirect-fix
```

```text
test(web): describe AuthButton's explicit OAuth redirectTo

feat(web): pass redirectTo to signInWithOAuth and fix the Supabase Site URL
```
