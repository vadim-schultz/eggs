---
name: "Chapter 8 — Deploy and docs sync"
overview: "Push the schema to the hosted Supabase project, enable Google auth and production URLs there, stand up Cloudflare Pages, and record the whole procedure as a runbook plus flip every plan doc to shipped."
todos:
  - id: db-push
    content: "supabase link + supabase db push against the hosted project"
    status: pending
  - id: hosted-auth
    content: "Hosted Google provider, Site URL and Redirect URLs"
    status: pending
  - id: pages
    content: "Cloudflare Pages project, build settings, env vars, first deploy"
    status: pending
  - id: runbook
    content: "docs/operations/deploy.md"
    status: done
  - id: docs-sync
    content: "Flip rollout/chapter statuses and README to shipped"
    status: pending
isProject: false
---

# Chapter 8 — Deploy and docs sync

**Repo:** `eggs` (docs, `.env.example`) · **Branch:** `docs/eggs-deploy-runbook` · **Status:** in progress —
runbook written and merged; `db-push`, `hosted-auth`, `pages` and the production smoke test are manual
dashboard/CLI steps that remain for the maintainer (see [docs/operations/deploy.md](../../../docs/operations/deploy.md)).
Full docs-sync (this chapter and the MVP as a whole flipping to shipped, the live URL landing in
`README.md`) happens once those are done.

**Depends on:** [6](06-reserve-a-listing.md), [7](07-lifecycle-and-expiry.md) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Everything through chapter 7 works against a local Supabase stack. This chapter is the one time the app
touches the real, hosted project and a real public URL — and it leaves behind an exact, repeatable
procedure so a second deploy (or a teammate's first one) isn't a rediscovery exercise. Almost all of this
chapter's content is the manual configuration itself; there is very little code.

## Design decisions

**No IaC for this pass.** Terraform/Pulumi for Supabase + Cloudflare would remove the manual steps below,
but for a single free-tier project it's more machinery than the problem justifies — the runbook is the
mitigation, matching how [redtape's evidence-storage chapter 8](../../../../redtape/.plans/evidence-storage/chapters/08-r2-runbook-and-provisioning.md)
handled the same trade-off for R2.

**`supabase db push` is the only way schema reaches production.** No manual SQL is ever pasted into the
hosted SQL editor — every migration from chapters 2, 4, 6 and 7 already exists as a file, so pushing is a
replay of exactly what local dev and CI already verified.

**Runbook lives in `docs/operations/deploy.md`**, covering both the one-time setup below and the
repeatable "ship a new migration" steps (`supabase db push` on every deploy after this one), so this
chapter's manual work doesn't have to be reconstructed from memory next time.

**Docs-sync is part of this chapter, not a separate one** — the rollout has eight chapters total, and
"deploy" and "record that it happened" are naturally one PR once the app is live.

## Files

**Add:** `docs/operations/deploy.md` (runbook, contents mirror the Manual configuration section below plus
a "subsequent deploys" section: `git push`, Cloudflare Pages auto-builds, `supabase db push` if the PR
added a migration).

**Edit:**

| Path | Change |
| --- | --- |
| `.env.example` | Confirm it still matches every variable actually read (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) |
| `README.md` | Add the live URL |
| `.plans/mvp/01-rollout.md`, `.plans/mvp/chapters/README.md` | Flip all eight chapters to `shipped` |
| `.plans/mvp/00-architecture.md` meta line, `.plans/README.md` | Status → shipped |

## Manual configuration

**Supabase dashboard + CLI** (hosted project created back in chapter 1):

1. `supabase link --project-ref <ref>` (project ref from Project Settings → General).
2. `supabase db push` — applies every migration from chapters 2, 4, 6 and 7 in order.
3. Database → Extensions: confirm `postgis` and `pg_cron` show enabled (chapters 2 and 7's deferred
   verification).
4. Database → Cron Jobs: confirm `expire-listings-daily` is listed; check back the next day in Database →
   Logs to confirm it ran once.
5. Authentication → Providers → Google: enable, paste the **production** Client ID/secret from the Google
   Cloud Console step below (a second OAuth client, not the chapter 3 local one — local and production
   credentials are kept separate so rotating one never breaks the other).
6. Authentication → URL Configuration: Site URL = the Cloudflare Pages production domain (from the
   Cloudflare step below); Redirect URLs = that same domain (add the `*.pages.dev` preview pattern too if
   preview deploys should also support sign-in).

**Google Cloud Console** (same project as chapter 3, a second OAuth client for production):

1. Credentials → Create OAuth client ID → Web application. Authorized redirect URI:
   `https://<project-ref>.supabase.co/auth/v1/callback`. Authorized JavaScript origin: the Cloudflare Pages
   production domain. Note the Client ID/secret for step 5 above.
2. OAuth consent screen → Publish app (moves it out of **Testing**, so any Google account — not just
   the developer's own test users from chapter 3 — can sign in).

**Cloudflare Pages dashboard:**

1. Pages → Create a project → connect the `eggs` GitHub repo.
2. Build command `npm run build`; build output directory `dist`.
3. Environment variables (production): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — the hosted
   project's values from chapter 1, not the local-stack ones.
4. Trigger the first deploy; note the assigned domain (custom domain setup, if any, is a follow-up outside
   this chapter's scope).

## Red tests

| Check | Asserts |
| --- | --- |
| Link check | Every relative link in `docs/operations/deploy.md` and the edited plan docs resolves |
| Secret grep | No real project ref, API key, client secret or password appears anywhere in the diff |
| Production smoke test | Load the Cloudflare Pages URL, sign in with a non-test Google account, post a listing, reserve it from a second account, confirm the contact reveal — end to end against the real stack |

## Green

Write the runbook; perform the manual steps once in order; run the production smoke test; edit the docs
status files; record the outcome (including the live URL) in this chapter's meta line when shipped.

## Refactor gate

Docs and config only; nothing to gate.

## Verification

Link and secret checks (`grep` for the project ref pattern and known key prefixes across the diff); the
production smoke test above; `git diff --stat` shows only docs, `.env.example` and the runbook.

## Out of scope

IaC/automated provisioning (see Design decisions), a custom domain, staging environment beyond Cloudflare
Pages preview deploys, monitoring/alerting (no open seam tracked yet — small app, revisit if traffic
justifies it).

## Git workflow

```bash
git checkout main && git pull
git checkout -b docs/eggs-deploy-runbook
```

```text
docs(operations): add the deploy runbook and flip chapter statuses to shipped
```
