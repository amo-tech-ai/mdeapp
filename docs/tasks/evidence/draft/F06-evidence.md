# F06 evidence — 2026-05-20 (Done)

## Acceptance test results

| # | Test | Result | Notes |
|---|---|---|---|
| **§10 git/local (7 tests)** | | | |
| T1 | repo init | ✅ OK | `git rev-parse --is-inside-work-tree` = true |
| T2 | ≥1 commit | ✅ OK | 3 commits on main |
| T3 | `.env.local` NOT staged | ✅ OK | gitignored |
| T4 | `.env.example` IS staged | ✅ OK | listed in `git ls-files` |
| T5 | gitignore covers .env.local | ✅ OK | |
| T6 | working tree clean | ✅ OK | |
| T7 | scan-secrets pass on tracked files | ✅ OK | sampled tracked files |
| **§10 GitHub (5 tests)** | | | |
| T8 | repo exists + branch | ✅ OK | `amo-tech-ai/mdeapp` PUBLIC, `main` |
| T8b | description + topics | ✅ OK | 8 topics |
| T8c | homepage URL set | ✅ OK | `https://mdeai.co` |
| T9 | origin pushed | ✅ OK | SHA `471ee69` |
| T10 | commit hash matches | ✅ OK | local = remote |
| **§10 Vercel (6 tests)** | | | |
| T11 | project linked | ✅ OK | `.vercel/repo.json` → `prj_j9euXZqvqqxcZj2kSGqU54VDGTlA` (`amo100/mdeapp`) |
| T12 | `.vercel/` gitignored | ✅ OK | |
| T13 | 6 F06 envs pushed | ✅ OK | Production + Development (×6 each). Preview blocked until Git connected — see below |
| T14 | deploy Ready | ✅ OK | `vercel deploy` → `dpl_DA1bP1vwWacAdv9UN1hMpykbQ9tK` Ready |
| T15 | URL HTTP 200 | ✅ OK | **`https://mdeapp.vercel.app/` → 200** (production). Per-deployment preview URLs return **401** (Vercel Deployment Protection) |
| T16 | parity with F05 | ✅ OK | `POST /api/copilotkit` → **400** `invalid_request` (runtime alive); shell title `mdeai — concierge for Medellín` |

**Net: 16/16 pass** (T15/T16 via production alias; preview SSO is a Vercel dashboard setting, not an app defect).

## Vercel project

- Dashboard: [amo100/mdeapp](https://vercel.com/amo100/mdeapp)
- **Option A confirmed** — separate from `amo100/mdeai` (legacy `www.mdeai.co`)
- Production URL: **https://mdeapp.vercel.app**
- Latest CLI preview: `https://mdeapp-ptldc2fsd-amo100.vercel.app` (auth-gated)

## Env vars (F06 six)

| Variable | Production | Development | Preview |
|----------|:----------:|:-----------:|:-------:|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ⏳ Git branch required |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ⏳ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ | ✅ | ⏳ |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | ✅ | ✅ | ⏳ |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ | ✅ | ⏳ |
| `LOG_LEVEL` | ✅ | ✅ | ⏳ |

Supabase integration also added Postgres/secret vars (Production only) — fine; no `SUPABASE_SERVICE_ROLE_KEY` in client bundle.

## Incident: `vercel env pull` wiped local `.env.local`

User ran `vercel link` → pull with **overwrite yes**, which removed all F04 keys and left only `VERCEL_OIDC_TOKEN`.

**Fix applied:** restored `mdeapp/.env.local` from `/home/sk/mdeai/.env.local` (F04 mapping). **Rule:** never answer **yes** to overwrite `.env.local` on pull; use `vercel env pull .env.vercel` to a separate file instead.

## Smoke (production alias)

```
GET  https://mdeapp.vercel.app/              → 200
POST https://mdeapp.vercel.app/api/copilotkit → 400 (endpoint alive)
```

Manual sidebar "hi" echo on production: **pending Lucía** (browser; disable Deployment Protection on preview URLs if testing branch deploys).

## Decisions (closed)

1. **Vercel project:** `amo100/mdeapp` (new project) ✅
2. **GitHub visibility:** PUBLIC ✅ (intentional)
3. **Env push:** authorized + executed ✅
