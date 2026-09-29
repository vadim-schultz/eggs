---
name: "Chapter 3 — Auth (Google sign-in)"
overview: "Google as the only OAuth provider, wired through Supabase Auth: a useSession hook, sign-in/sign-out UI in the app shell, and a route guard that gates /post (posting) while browsing stays public."
todos:
  - id: google-console
    content: "Google Cloud Console OAuth client for local Supabase auth callback"
    status: done
  - id: config-toml
    content: "supabase/config.toml [auth.external.google]"
    status: done
  - id: session
    content: "useSession hook + AuthButton"
    status: done
  - id: guard
    content: "RequireAuth route guard on /post"
    status: done
isProject: false
---

# Chapter 3 — Auth (Google sign-in)

**Repo:** `eggs` (`src/`, `supabase/config.toml`) · **Branch:** `feat/eggs-auth` · **Status:** shipped

**Depends on:** [1](01-project-scaffold.md), [2](02-schema-and-rls.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §7 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Posting (chapter 4) and reserving (chapter 6) both need `auth.uid()` to be real. This chapter makes
"sign in with Google" work end to end in local dev and gives every later chapter one hook
(`useSession`) and one guard component (`RequireAuth`) to build on — without gating browsing, which stays
public per invariant 3 in [01-rollout.md](../01-rollout.md).

## Design decisions

**Google only, no email/password.** D5 in [gaps-and-decisions.md](../gaps-and-decisions.md): Apple
Sign-In needs a paid developer account (excluded by invariant 2), and a password flow adds a forgot-password
surface this app has no reason to own. Supabase Auth's `signInWithOAuth({ provider: 'google' })` is the
entire client-side surface.

**`useSession` wraps `supabase.auth.getSession()` + `onAuthStateChange`**, exposing
`{ session, loading }`. Every component that needs "am I signed in" or "who am I" reads this hook rather
than calling `supabase.auth.*` directly, so there is exactly one place that subscribes/unsubscribes.

**`RequireAuth` is a route wrapper, not a per-component check.** Wraps `<PostListing>` only; `Home` and
`ListingDetail` stay reachable anonymously (browsing is public — reserving, gated in chapter 6, is a
button inside `ListingDetail` that itself checks `useSession`, not a route guard, since the page must
still render for anonymous visitors).

**Local dev auth config lives in `supabase/config.toml`, not the dashboard.** The Supabase CLI reads
`[auth.external.google]` from `config.toml`, resolving `client_id`/`secret` from environment variables
(`env(GOOGLE_CLIENT_ID)`, `env(GOOGLE_CLIENT_SECRET)`) sourced from `.env.local` — checked into the repo
as config, with the actual secret values gitignored. This is why the Google Cloud Console step below
produces credentials that go into `.env.local`, not into any Supabase dashboard, for local development.
The hosted project's own Google provider toggle is a separate, later step (chapter 8).

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `src/auth/useSession.ts` | Session hook |
| `src/auth/AuthButton.tsx` | Sign in with Google / Sign out, shown in the app shell |
| `src/auth/RequireAuth.tsx` | Route guard, redirects to `/` with a `t()` toast if signed out |
| `src/auth/useSession.test.ts`, `src/auth/RequireAuth.test.tsx` | Tests below |
| `.env.example` | `GOOGLE_CLIENT_ID=`, `GOOGLE_CLIENT_SECRET=` documented (consumed by `supabase/config.toml`, not by the frontend build) |

**Edit:**

| Path | Change |
| --- | --- |
| `supabase/config.toml` | `[auth.external.google]` block |
| `src/App.tsx` | Wrap the `/post` route in `RequireAuth`; mount `AuthButton` in the shell |
| `src/i18n/strings.de.ts` | `auth.signIn`, `auth.signOut`, `auth.signInRequired` keys |

## Manual configuration

**Google Cloud Console** (external, required before this chapter's sign-in flow works even locally):

1. [console.cloud.google.com](https://console.cloud.google.com) → new or existing project → APIs &
   Services → OAuth consent screen: type **External**, app name "eggs", support email, scopes `email`,
   `profile`, `openid`. Leave it in **Testing** with your own Google account added as a test user for now
   — moving it to **Production** (so any Google account can sign in) is chapter 8's job, once there's a
   real domain to show on the consent screen.
2. APIs & Services → Credentials → Create OAuth client ID → **Web application**. Authorized redirect URI:
   `http://127.0.0.1:54321/auth/v1/callback` (the local Supabase Auth callback that `supabase start`
   serves). Note the **Client ID** and **Client secret**.
3. Add both to `.env.local` (gitignored) as `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

**Supabase:** none for local dev — `supabase/config.toml` (checked-in code) is what enables the provider
for the local stack; there is nothing to toggle in a dashboard until chapter 8's hosted project.

## Red tests

| Test | Asserts |
| --- | --- |
| `useSession · starts with loading true and no session` | Initial state |
| `useSession · reflects a session after onAuthStateChange fires SIGNED_IN` | Mocked Supabase client |
| `useSession · clears the session after SIGNED_OUT` | Mocked Supabase client |
| `RequireAuth · renders children when a session exists` | Mocked `useSession` |
| `RequireAuth · redirects to "/" when no session exists` | Mocked `useSession` |
| `AuthButton · shows "Sign in with Google" when signed out` | `t()` copy |
| `AuthButton · shows "Sign out" and calls supabase.auth.signOut on click` | Mocked client |

## Green

1. `useSession`; tests 1–3.
2. `RequireAuth`; tests 4–5.
3. `AuthButton`; tests 6–7. Wire both into `App.tsx` and the shell.
4. Google Cloud Console client + `config.toml` + `.env.local`; manual end-to-end sign-in against
   `supabase start` (not a vitest case — see Verification).

## Refactor gate

`useSession` stays the only place that calls `supabase.auth.getSession`/`onAuthStateChange`; `RequireAuth`
stays a single conditional render, no additional state. Report the outcome.

**Outcome:** held as designed, no additional state introduced. Two follow-up fixes landed after the
initial merge: the local Supabase Auth `site_url` needed pointing at the actual dev server for the OAuth
redirect to land correctly, and CI needed an authenticated GitHub API lookup for `supabase/setup-cli` to
avoid unauthenticated rate limiting.

## Verification

```bash
npm run test -- --run
./ci.sh
supabase start
npm run dev
# manual: sign in with the Google test account, confirm the session persists across reload,
# confirm /post redirects to / when signed out and renders when signed in
```

## Out of scope

Posting a listing (chapter 4, the first thing `RequireAuth` actually protects), reserving (chapter 6),
the hosted project's Google provider and production redirect URLs (chapter 8), any non-Google provider
(not planned — D5).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-auth
```

```text
test(web): describe useSession, RequireAuth and AuthButton

feat(web): add Google sign-in via Supabase Auth
```
