# Deploy runbook

How `eggs` gets from a merged PR to the live site: the one-time setup that stands the hosted project up,
and the steps that repeat on every deploy after that. See [chapter 8](../../.plans/mvp/chapters/08-deploy-and-docs-sync.md)
for the design decisions behind this procedure (no IaC, `supabase db push` as the only path schema takes
to production).

## One-time setup

Do this once, in order. Each dashboard step notes what it depends on from an earlier step.

### 1. Supabase — link and push the schema

The hosted Supabase project itself was created back in [chapter 1](../../.plans/mvp/chapters/01-project-scaffold.md#manual-configuration).

```bash
supabase link --project-ref <ref>   # ref: Project Settings → General, in the Supabase dashboard
supabase db push                    # applies every migration in supabase/migrations/, in order
```

`db push` is a replay of exactly what local dev and CI already ran against `supabase db reset` — no SQL
is ever pasted into the hosted SQL editor by hand.

Then in the dashboard, confirm the push did what it should:

- **Database → Extensions:** `postgis` and `pg_cron` both show enabled.
- **Database → Cron Jobs:** `expire-listings-daily` is listed. Check back the next day in
  **Database → Logs** to confirm it ran once.

### 2. Google Cloud Console — production OAuth client

Same Google Cloud project as [chapter 3](../../.plans/mvp/chapters/03-auth.md#manual-configuration), a
**second** OAuth client — production credentials are kept separate from the chapter 3 local ones so
rotating one never breaks the other.

1. **APIs & Services → Credentials → Create OAuth client ID → Web application.**
   - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Authorized JavaScript origin: the Cloudflare Pages production domain (from step 3 below)
   - Note the Client ID and secret for the next step.
2. **OAuth consent screen → Publish app** — moves it out of **Testing**, so any Google account (not just
   the chapter 3 test users) can sign in.

### 3. Supabase — enable Google auth for the hosted project

Back in the Supabase dashboard for the hosted project:

- **Authentication → Providers → Google:** enable, paste the production Client ID/secret from step 2.
- **Authentication → URL Configuration:**
  - Site URL = the Cloudflare Pages production domain (from step 4 below).
  - Redirect URLs = that same domain. Add the `*.pages.dev` preview pattern too if preview deploys
    should also support sign-in.

### 4. Cloudflare Pages — create the project and deploy

1. **Pages → Create a project** → connect the `eggs` GitHub repo.
2. Build command: `npm run build`. Build output directory: `dist`.
3. Environment variables (production): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — the **hosted**
   project's values from chapter 1, not the local-stack ones in `.env.local`.
4. Trigger the first deploy and note the assigned domain. Go back and fill in the Cloudflare domain
   wherever steps 2 and 3 above referenced it (Google's authorized origin, Supabase's Site URL /
   Redirect URLs) if it wasn't known yet.

> The live `eggs` project actually runs under Cloudflare's unified Workers Builds product rather
> than classic Pages, which is why a repo-level `wrangler.jsonc` exists: Workers Builds runs
> `npx wrangler preview` for every non-production branch/PR, and that command refuses to run
> without a (possibly empty) `previews` block in the Wrangler config — see
> [chapter 7's implementation notes](../../.plans/ui-overhaul/chapters/07-google-oauth-redirect-fix.md)
> for how this was discovered. No other step in this runbook changes because of it; `npm run build`
> → `dist` is still what gets deployed, env vars are still set the same way.

### 5. Smoke test

Load the Cloudflare Pages URL, sign in with a non-test Google account, post a listing, reserve it from a
second account, and confirm the contact reveal — end to end against the real stack.

## Subsequent deploys

Once the above is done, shipping a new chapter or fix is:

1. `git push` the merged PR to `main` — Cloudflare Pages auto-builds and deploys on every push.
2. If the PR added a file under `supabase/migrations/`: `supabase db push` against the hosted project
   (the CLI stays linked from the one-time setup above; re-run `supabase link` if working from a fresh
   checkout).

Nothing else in the one-time setup needs repeating — env vars, OAuth clients and URL configuration are
project-level, not per-deploy.
