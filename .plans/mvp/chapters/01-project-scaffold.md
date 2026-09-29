---
name: "Chapter 1 — Project scaffold + i18n dictionary"
overview: "Vite + React + TypeScript + Chakra UI app shell with three stub routes, the flat German i18n dictionary and t(key) helper, a validated Supabase client, and the CI gate (ci.sh + GitHub Actions) every later chapter runs against."
todos:
  - id: shell
    content: "Vite/React/TS scaffold, ChakraProvider, router with three stub routes"
    status: done
  - id: i18n
    content: "strings.de.ts + t(key) helper"
    status: done
  - id: supabase-client
    content: "env validation + supabaseClient.ts"
    status: done
  - id: ci
    content: "ci.sh + GitHub Actions workflow"
    status: done
isProject: false
---

# Chapter 1 — Project scaffold + i18n dictionary

**Repo:** `eggs` (root) · **Branch:** `feat/eggs-project-scaffold` · **Status:** shipped

**Depends on:** none · **Architecture:** [../00-architecture.md](../00-architecture.md) §3, §11 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

Every later chapter adds a route, a component or a migration to something that already builds, lints,
type-checks and deploys. This chapter creates that something: an empty-but-working app, the i18n
convention (D10) from the first component, and a Supabase client that fails loudly instead of silently
hitting `undefined.supabase.co` when configuration is missing.

## Design decisions

**Chakra UI + React Router, nothing else yet.** `leaflet`/`react-leaflet` are added in chapter 5 when
the map first exists — no dependency is added before the chapter that uses it.

**Three stub routes**, not zero: `/` (Home — browse, chapter 5), `/listings/:id` (ListingDetail, chapters
5–6), `/post` (PostListing, chapter 4). Routing is infrastructure every feature chapter needs, so it
belongs in the scaffold; each stub renders a placeholder heading only (`"Coming in a later chapter"`, via
`t()`) so the route table itself is exercised by a test today, and later chapters replace the placeholder
body without touching `App.tsx`.

**`t(key)` is type-checked, not runtime-validated.** `strings.de.ts` is a `const` object literal;
`t(key: keyof typeof strings)` means an unknown key is a TypeScript error at the call site, not a
missing-string bug discovered in the browser. No ICU/pluralization support — v1 copy doesn't need it, and
`react-i18next` is explicitly deferred (D10) until a second locale is real.

**`getSupabaseEnv` is a pure function, not a side effect in `supabaseClient.ts`.** It takes an env-shaped
record and either returns `{ url, anonKey }` or throws with a message naming the missing variable; this
makes the missing-config path unit-testable without mocking `import.meta.env`. `supabaseClient.ts` calls
it once at module load with `import.meta.env` and exports the created client.

**`ci.sh` is the single gate**, mirroring [redtape's script](../../../../redtape/ci.sh) in spirit: lint,
typecheck, test, build, run in that order so the fastest checks fail first. GitHub Actions runs the same
script — no separate CI-only logic to drift out of sync.

## Files

**Add:**

| Path | Purpose |
| --- | --- |
| `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html` | Vite + React + TS scaffold |
| `src/main.tsx` | Mounts `ChakraProvider` + `BrowserRouter` + `App` |
| `src/App.tsx` | Route table: `/`, `/listings/:id`, `/post` |
| `src/routes/Home.tsx`, `src/routes/ListingDetail.tsx`, `src/routes/PostListing.tsx` | Placeholder pages |
| `src/i18n/strings.de.ts` | Flat dictionary, first keys: `app.title`, `nav.postListing`, `common.comingSoon` |
| `src/i18n/t.ts` | `t(key)` lookup |
| `src/lib/env.ts` | `getSupabaseEnv(env)` |
| `src/lib/supabaseClient.ts` | `createClient` using `getSupabaseEnv(import.meta.env)` |
| `src/test/setup.ts` | `@testing-library/jest-dom` matchers |
| `.env.example` | `VITE_SUPABASE_URL=`, `VITE_SUPABASE_ANON_KEY=` (empty, documented) |
| `.gitignore` | `.env.local`, `node_modules`, `dist` |
| `eslint.config.js`, `.prettierrc` | Lint/format config |
| `ci.sh` | `npm run lint && npm run typecheck && npm run test -- --run && npm run build` |
| `.github/workflows/ci.yml` | Runs `./ci.sh` on push and PR |
| `src/App.test.tsx`, `src/i18n/t.test.ts`, `src/lib/env.test.ts` | Tests below |

**Edit:** `README.md` — add a short "Local development" section (`npm install`, `npm run dev`, pointer to
this chapter's [Manual configuration](#manual-configuration) for the one-time Supabase project step).

## Manual configuration

**Supabase dashboard** (one-time, before this chapter's tests can hit a real project — local dev in this
chapter only needs the *shape* of the env vars, not a live project, so this step can happen any time before
chapter 3):

1. [supabase.com/dashboard](https://supabase.com/dashboard) → New project. Name: `eggs`; pick a region
   close to the target users; generate and store the database password in a password manager (not needed
   day-to-day — RLS is the app's access layer, not direct DB connections).
2. Once provisioned, Project Settings → API: copy the **Project URL** and the **anon public** key (never
   the `service_role` key — that one is local-dev-only tooling, see chapter 2's smoke script and D1/D9 in
   [gaps-and-decisions.md](../gaps-and-decisions.md)).
3. Create `.env.local` (gitignored) from `.env.example` and paste both values in.

Nothing else in this chapter touches the dashboard — schema, extensions and RLS are chapter 2.

## Red tests

| Test | Asserts |
| --- | --- |
| `getSupabaseEnv · throws when VITE_SUPABASE_URL is missing` | Error names the missing variable |
| `getSupabaseEnv · throws when VITE_SUPABASE_ANON_KEY is missing` | Error names the missing variable |
| `getSupabaseEnv · returns both values when present` | Happy path |
| `t · returns the German string for a known key` | `t("app.title")` |
| `App · renders Home at "/"` | Router smoke test |
| `App · renders the PostListing placeholder at "/post"` | Route table wiring |

## Green

1. Vite/React/TS scaffold, Chakra provider, router with three stub routes; tests 5–6.
2. `strings.de.ts` + `t.ts`; test 4.
3. `env.ts` + `supabaseClient.ts`; tests 1–3.
4. `ci.sh` + GitHub Actions workflow; no test, verified by running it.

## Refactor gate

Each stub route stays a single-purpose component under ~20 LOC; `t.ts` and `env.ts` stay one exported
function each. Report the outcome.

**Outcome:** held as designed — `t.ts` and `env.ts` each stay a single exported function (5 and 24
lines respectively), no split needed.

## Verification

```bash
npm run lint && npm run typecheck && npm run test -- --run && npm run build
./ci.sh
```

## Out of scope

Real route content (chapters 4–6), Supabase schema and RLS (chapter 2), auth (chapter 3), Leaflet/map
dependency (chapter 5).

## Git workflow

```bash
git checkout main && git pull
git checkout -b feat/eggs-project-scaffold
```

```text
test(web): describe env validation, t(key) and the route table

feat(web): scaffold Vite/React/Chakra app with i18n and Supabase client
```
