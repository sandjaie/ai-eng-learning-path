<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Learning-path tracker — agent guide

Single-user, self-hosted learning tracker: Next.js 16 (App Router) + Supabase (Postgres + Google OAuth) + Tailwind v4, "Blocks" neobrutalist UI. This is a public template repo — keep every committed file generic: no personal names, emails, or employer references; the example email is always `you@example.com`.

## Commands

- `./scripts/dev.sh` / `npm run dev:local` — start Colima (if needed) + local Supabase + Next on :3000; overrides URL/anon key from `supabase status` and enables `DEV_AUTO_LOGIN` defaults (`you@example.com` / `local-dev-password`). Prefer Colima over Docker Desktop.
- `npm run dev` — Next only, using `.env.local` as written (use for cloud/Google testing)
- `npm run test` — vitest; single file: `npx vitest run lib/progress.test.ts`
- `npm run typecheck` — `tsc --noEmit` (TypeScript 7 native `tsc`)
- `npm run lint` — eslint
- `npm run verify` — lint + typecheck + test (also runs via Husky on every commit)
- `npm run verify:full` — verify + production build (CI / before risky pushes)

Build without local env: `NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder npm run build`

## Git workflow

- **`main`** is the only long-lived branch (default, always deployable). Do not commit directly to it.
- Work on short-lived branches:
  - `feature/<short-name>` — new capability
  - `fix/<short-name>` — bug fix
  - `chore/<short-name>` — deps, tooling, docs, CI
- Open a PR into `main`. Prefer **squash merge**. Delete the branch after merge.
- Local gate: Husky runs `npm run verify` on every commit.
- CI: `.github/workflows/ci.yml` runs `npm run verify:full` on PRs into `main`. No migrate/deploy there.
- Deploy: merge to `main` triggers `.github/workflows/deploy.yml` (verify → migrate → Vercel).


Local auto-login: `lib/dev-auth.ts` + `app/auth/dev-login/route.ts`. Gated on `NODE_ENV === "development"` and `DEV_AUTO_LOGIN=true`. `supabase/seed.sql` creates the matching local Auth user on `supabase start`. Never enable `DEV_*` in Vercel.

## Architecture

- Reads are server components; ALL writes go through server actions in `app/actions.ts` — there are no API routes. Every action ends by revalidating `/` and the affected `/phase/[id]`.
- Data model (`lib/types.ts` mirrors the SQL): phases → sections → items, plus `time_logs` per phase. Progress and on-track status are always computed (`lib/progress.ts`), never stored.
- Auth is three independent layers keyed on `ALLOWED_EMAIL`: `proxy.ts` (Next 16's middleware convention — the file and export are named `proxy`, not `middleware`), `app/auth/callback/route.ts` (rejects wrong Google accounts before the session sticks), and Postgres RLS (`owner_all` policies on `auth.uid()`). Changes to any layer must keep the other two intact. Locally, `proxy.ts` may send unauthenticated traffic to `/auth/dev-login` instead of `/login` when `DEV_AUTO_LOGIN` is on.
- The Supabase clients (`lib/supabase/`) are untyped — no generated `Database` types yet — so the pages cast nested selects (`app/page.tsx`, `app/phase/[id]/page.tsx`). If you change the schema, update `lib/types.ts` by hand and re-check those casts.

## Blocks design system

- Token-based theming in `app/globals.css`: `--paper/--ink/--muted/--card/--on-color`, mapped to Tailwind utilities via `@theme inline` (Tailwind v4 CSS-first config — there is no tailwind.config file).
- Dark mode is a token swap under `prefers-color-scheme` plus a `[data-theme]` override; `components/theme-toggle.tsx` persists the choice, and a no-flash inline script lives in `app/layout.tsx`.
- Never hardcode `#fff`/`#191919` in components: surfaces use `var(--card)` / `bg-card`, text sitting on colored bands or stickers uses `text-on-color`, borders and hard shadows use ink. The `.block-card` / `.block-btn` / `.block-input` / `.sticker` classes carry the 2px-border + hard-shadow look.

## Migrations & deploys

- Schema changes: `npx supabase migration new <name>` → write SQL in `supabase/migrations/` → apply with `scripts/migrate.sh` (needs `SUPABASE_DB_URL`) or just push to main.
- Git pushes do NOT auto-deploy (including PR previews) — `vercel.json` sets `git.deploymentEnabled: false`. `.github/workflows/deploy.yml` on `main` runs `npm run verify:full` → `supabase db push` → Vercel deploy hook, in that order. Do not "fix" either half; the ordering is the point.
- CI gotcha: GitHub runners are IPv4-only. The `SUPABASE_DB_URL` secret must be the **session-pooler** connection string (`…pooler.supabase.com:5432`), never the direct `db.<ref>.supabase.co` host (IPv6-only — connections fail).
- A database that predates the pipeline needs the one-time "DB baseline" workflow (Actions tab) so `db push` doesn't re-apply the initial migration.
- `supabase/seed.sql` is a generic sample roadmap (9 phases / 296 items), idempotent. Locally it runs on `supabase start` and may create template user `you@example.com` only. On cloud, apply manually in the SQL editor after Google sign-in (set `seed_email` to `ALLOWED_EMAIL`) — never via CI, and it will not create password users for non-template emails. Local Colima DB ≠ production DB.
- `supabase/config.toml` keeps `[analytics] enabled = false` so Colima is not broken by the vector container’s `docker.sock` mount.

## Repo conventions

- Dependencies are deliberately minimal (`@supabase/ssr`, `@supabase/supabase-js`, `react-markdown`, plus `vitest`). Don't add one for what a few lines can do.
- `.superpowers/`, `docs/superpowers/`, `.mcp.json`, and vendored agent skills are local working artifacts — gitignored, never committed. Supabase skills install: `npx skills add supabase/agent-skills`.
