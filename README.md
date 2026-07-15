# AI Engineer Path

A self-hosted, single-user learning-path tracker. Next.js (App Router) +
Supabase (Postgres + Google auth), deployed on Vercel, styled with a
neobrutalist "Blocks" UI (light/dark).

Track a multi-phase learning roadmap — courses, projects, reading — as
checkable items grouped into sections and phases, with progress bars,
on-track badges, and weekly time logging. Fork it, point it at your own
roadmap, done.

## What you get

- **Phases → sections → items.** A phase (e.g. "Months 1–2: Foundations")
  contains sections (e.g. "Learn", "Courses", "Build", "Exit criteria"),
  each holding checkable items. Items can carry a URL, a provider label
  (auto-detected from the domain — Coursera, YouTube, AWS, Anthropic, etc. —
  see `lib/provider.ts`), and per-item markdown notes.
- **Markdown notes** on both phases and items, with a live edit/preview
  toggle (`components/notes-editor.tsx`).
- **Time logging vs. a weekly goal.** Log hours per phase; the dashboard
  shows this week's total against a 6–8 hour goal band (`WEEKLY_GOAL_MIN` /
  `WEEKLY_GOAL_MAX` in `lib/types.ts`) and which days this week had logged
  time.
- **Dashboard with on-track badges.** Each phase compares completed-item
  percentage against elapsed time between its `target_start` and
  `target_end` dates and labels itself AHEAD / ON TRACK / BEHIND
  (`lib/progress.ts`); the same computation rolls up into an overall status
  tile.
- **Everything editable in the UI** — add/rename/delete/reorder phases,
  sections, and items; no direct database editing required day to day
  (`app/actions.ts` holds every mutation as a Next.js Server Action).
- **Light/dark mode** — follows the OS `prefers-color-scheme` by default,
  with a manual toggle (`components/theme-toggle.tsx`) that persists to
  `localStorage` and applies before first paint (no flash).

## The sample roadmap

The seed data in `supabase/seed.sql` is the author's own sanitized sample:
an 18-month AI-Engineer transition path — 9 phases, built from the narrative
in [`docs/roadmap.md`](docs/roadmap.md). It's provided as a working example
of the data model, not a prescription. Use it as-is if it fits, or treat it
as a template and replace the content with your own roadmap.

## Run your own (fork guide)

1. **Fork this repo.**

2. **Create a Supabase project** at [supabase.com](https://supabase.com).
   Under Authentication → Sign In / Providers, enable the **Google**
   provider (create a Google OAuth client in Google Cloud Console using the
   callback URL Supabase shows you). Under Authentication → URL
   Configuration, add redirect URLs for both `http://localhost:3000/auth/callback`
   and your future production domain's `/auth/callback`.

3. **Set your allowed email.** This app enforces a single allowed user —
   copy `.env.local.example` to `.env.local` and set `ALLOWED_EMAIL` to
   **your own** Google account email (not `you@example.com`).

4. **Fill in the rest of the env vars** — `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase Project Settings → API.

5. **Apply the schema.** Either run `scripts/migrate.sh` locally against
   your project (see [Database migrations](#database-migrations) below),
   or paste the contents of
   `supabase/migrations/20260715120000_initial_schema.sql` into the
   Supabase SQL editor and run it once.

6. **Sign in to the app once** (`npm install && npm run dev`, then "Sign in with Google")
   so `auth.users` has a row for your account — the seed script below looks
   up that row by email.

7. **Seed your data.** Pick one:
   - **(a) Use the sample roadmap.** Edit `supabase/seed.sql`, replacing
     `you@example.com` in the `auth.users` lookup near the top with your own
     email, then run the file in the Supabase SQL editor.
   - **(b) Start empty.** Skip seeding entirely and build your phases,
     sections, and items directly in the UI.
   - **(c) Author your own `seed.sql`.** Follow the same pattern as the
     provided file — look up your user id once, then insert phases →
     sections → items, capturing generated ids with `returning ... into`.
     Minimal example (one phase, one section, two items):

     ```sql
     do $$
     declare
       uid uuid;
       p uuid;
       s uuid;
     begin
       select id into uid from auth.users where email = 'you@example.com';

       insert into public.phases (user_id, title, sort_order, target_start, target_end)
       values (uid, 'Month 1: Foundations', 0, '2026-01-01', '2026-01-31')
       returning id into p;

       insert into public.sections (user_id, phase_id, title, sort_order)
       values (uid, p, 'Learn', 0) returning id into s;

       insert into public.items (user_id, section_id, title, sort_order) values
         (uid, s, 'First thing to learn', 0),
         (uid, s, 'Second thing to learn', 1);
     end $$;
     ```

8. **Deploy** — see [Deployment](#deployment) below.

## Local development

1. `cp .env.local.example .env.local` and fill in your Supabase project
   URL, anon key, and `ALLOWED_EMAIL`.
2. `npm install && npm run dev` → http://localhost:3000
3. `npm run test` runs the unit test suite (`lib/progress.ts`,
   `lib/provider.ts`).

## Database migrations

Schema changes live in `supabase/migrations/` as timestamped SQL files,
managed with the Supabase CLI (run via `npx`, no global install needed):

1. `npx supabase migration new <name>` creates an empty, timestamped SQL
   file in `supabase/migrations/`.
2. Write the SQL for your change in that file.
3. Apply it either:
   - **Locally**, against your own database: `SUPABASE_DB_URL='postgresql://...' ./scripts/migrate.sh`
     (the connection string is Supabase's "Connect → Direct connection"
     URI); or
   - **On push to `main`** — the CI workflow (`.github/workflows/deploy.yml`)
     applies pending migrations automatically as part of the deploy
     pipeline, see [Deployment](#deployment).

**One-time baseline for a database that predates this migration pipeline**
(i.e. one where `supabase/migrations/20260715120000_initial_schema.sql` was
already applied by hand, such as via the SQL editor during initial setup):
tell the CLI that migration is already applied, without re-running it:

```bash
npx supabase migration repair --status applied 20260715120000 --db-url "$SUPABASE_DB_URL"
```

## Deployment

1. Push your fork to GitHub and import it into Vercel.
2. Set the same three env vars in Vercel: `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ALLOWED_EMAIL`.
3. **Create a Deploy Hook**: Vercel → Project Settings → Git → Deploy Hooks
   → add one for the `main` branch, and copy the generated URL.
4. **Add two GitHub Actions secrets** to your fork (repo Settings → Secrets
   and variables → Actions):

   | Secret | Value |
   |---|---|
   | `SUPABASE_DB_URL` | Supabase → Project Settings → Database → Connect → Direct connection URI |
   | `VERCEL_DEPLOY_HOOK_URL` | The Deploy Hook URL from step 3 |

   This repo ships with `vercel.json` setting
   `git.deploymentEnabled.main: false`, which disables Vercel's automatic
   build-on-push for `main`. Deployments to `main` happen only through the
   Deploy Hook — which the GitHub Actions workflow calls *after* tests pass
   and migrations apply, so a broken test or a failed migration blocks the
   deploy instead of racing it.
5. Push to `main`. The workflow (`.github/workflows/deploy.yml`) runs
   `npm ci && npm run test`, applies pending migrations with
   `supabase db push`, then calls the Deploy Hook — in that order. The
   first push after wiring this up is the proof that the ordering holds:
   watch the Action run test → migrate → hook, each step gating the next.
6. After the first deploy, set Supabase Authentication → URL Configuration
   → Site URL to your production domain, and confirm its `/auth/callback`
   redirect URL is present (added back in step 2 of the fork guide).

## Architecture

- **Routes** (`app/`): `/` — dashboard (`app/page.tsx`); `/phase/[id]` —
  phase detail with sections, items, notes, and time log
  (`app/phase/[id]/page.tsx`); `/login` — sign-in page; `/auth/callback`
  and `/auth/signout` — OAuth callback and sign-out route handlers.
- **Mutations** all go through Next.js Server Actions in `app/actions.ts` —
  there is no separate API layer; forms and buttons call these functions
  directly.
- **Security model**: Google sign-in via Supabase Auth. `proxy.ts` (Next.js
  16's middleware convention) redirects unauthenticated requests to
  `/login`, and signs out any authenticated user whose email isn't
  `ALLOWED_EMAIL`. `app/auth/callback/route.ts` enforces the same allowlist
  check on the OAuth callback itself. Underneath both checks, every table
  (`phases`, `sections`, `items`, `time_logs`) has row-level security
  scoped to `auth.uid()` (`supabase/migrations/20260715120000_initial_schema.sql`),
  so data stays isolated even if an app-layer check were ever bypassed.
- **Computed progress**: `lib/progress.ts` derives completion percentage
  from item statuses and an AHEAD / ON_TRACK / BEHIND label from elapsed
  time vs. a phase's `target_start`/`target_end` window — no stored
  "progress" column, it's always computed from current data.

## License

MIT — see [LICENSE](LICENSE).
