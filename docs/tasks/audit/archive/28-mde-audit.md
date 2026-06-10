# mdeapp pre-commit / pre-deploy forensic audit

**Auditor:** Cursor agent (forensic pass)  
**Date:** 2026-05-25  
**Path:** `/home/sk/mdeai/mdeapp`  
**Remote:** `https://github.com/amo-tech-ai/mdeapp.git`  
**Supabase project (canonical):** `zkwcbyxiwklihegjhuql` — `https://zkwcbyxiwklihegjhuql.supabase.co`  
**GitHub `origin/main` HEAD:** `d7667ac` — 2026-05-21 00:00:37 -0500 — `fix(supabase): centralize service-role client and add env verify script`  
**Tracked files on GitHub:** 68 (W1-era shell)  
**Working tree:** 24 modified + ~114 untracked paths (~138 `git status` lines); ~224 TS/TSX under `src/`

**Verified against:** [Supabase Auth SSR/Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs), [Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security); [Mastra server auth](https://mastra.ai/docs/server/auth/supabase); [CopilotKit Mastra](https://docs.copilotkit.ai/mastra); Supabase MCP (`tourist_destinations` / `restaurants` anon SELECT policies); `npm run floor` + `check:mastra` + `verify:supabase` (2026-05-25 post-fix).

---

## 0. Remediation log (same day)

| Blocker | Fix | Verified |
|---------|-----|----------|
| `.gitignore` gaps | Patched `mdeapp/.gitignore` §8 patterns | `git check-ignore` on db/tmp/IDE paths |
| Stray `-` scrape file | Deleted `mdeapp/-` | gone |
| `search-attractions` RLS bypass | Replaced `pg`/`DATABASE_URL` with anon Supabase JS | MCP: `tourist_destinations_select_anon`; `check:mastra` rule 6 |
| `search-restaurants` SR fallback | Anon key only | MCP: `anon_can_view_active_restaurants` |
| CopilotKit prod 401 for browser | `isSameOriginBrowserRequest()` in `copilotkit-auth.ts` | 156 tests (+1 same-origin prod case) |
| `verify-supabase-env` drift | Anon count on `tourist_destinations`; DATABASE_URL = Mastra storage only | `PASS` with `.env.local` |

---

## 1. Executive verdict

| Gate | Verdict |
|------|---------|
| **Safe to split into clean Git commits** | **YES** — code blockers fixed; use §10 commands (no `git add .`) |
| **Push-ready to GitHub today** | **YES (code)** — still requires executing 6 commits; GitHub HEAD unchanged until push |
| **Vercel deploy-ready after push** | **CONDITIONAL** — ops: Supabase redirect URLs, `NEXT_PUBLIC_SITE_URL`, `ADK_GROUNDING_URL` prod |

**One-line:** **Code is commit-ready at 88/100**; production still needs dashboard/env (AUTH-011), not more app fixes for RLS/CopilotKit.

---

## 2. Readiness score

| Dimension | Score | Notes |
|-----------|------:|-------|
| Build / test / lint | **95** | `floor` passes: lint, tsc, build, **156** tests, no high audit |
| Secret safety (commit surface) | **90** | `.env*` ignored; no live keys in source |
| `.gitignore` / junk exclusion | **92** | Patched; `-` deleted |
| Auth correctness (code) | **88** | SSR `getUser()`, callback, relay middleware (local; not on GitHub until push) |
| RLS / data access | **90** | All four catalog tools anon-only; `check:mastra` enforces |
| CopilotKit / Mastra wiring | **88** | Pattern 1 + same-origin prod gate |
| Maps / ADK separation | **75** | Unchanged |
| Commit / deploy ops | **55** | GitHub still W1 snapshot until push; Vercel env manual |
| **Overall (commit-ready)** | **88/100** | |
| **Overall (prod deploy)** | **72/100** | Ops checklist §12 |

---

## 3. Risk table (red / yellow / green)

| Area | Status | Evidence |
|------|--------|----------|
| `.env.local` not committed | 🟢 | `.gitignore` `.env*` + `!.env.example` |
| Live API keys in repo TS/MD | 🟢 | Grep: only fake `eyJ…test` in tests; placeholders in `.env.example` |
| Stray file `-` (48KB scrape) | 🟢 | **Deleted** 2026-05-25 |
| `mastra-agent-memory.db*` | 🟢 | Now in `.gitignore` |
| `test-results/`, `tmp/`, IDE dirs | 🟢 | Now in `.gitignore` |
| Auth `?code=` relay middleware | 🟡 | Correct locally; ship in Commit 2 |
| Supabase redirect allowlist (prod) | 🟡 | Dashboard ops (AUTH-002 / F08) |
| `search-attractions` + `DATABASE_URL` | 🟢 | **Fixed** — anon Supabase + RLS policy verified |
| `search-restaurants` SR fallback | 🟢 | **Fixed** — anon only |
| `search-rentals` / `search-events` | 🟢 | Anon Supabase JS only |
| `approval-commit` API | 🟢 | `getUser()` + session token to edge |
| `schedule-viewing` guest leads | 🟢 | No 401 when logged out (AUTH-004 intent) |
| CopilotKit route Pattern 1 | 🟢 | `getLocalAgentsWithLogging` + `ExperimentalEmptyAdapter` |
| CopilotKit prod auth | 🟢 | Same-origin browser allowed when `COPILOTKIT_API_KEY` set; foreign origin 401 |
| Mastra `:4111` public exposure | 🟡 | Dev-only by convention; not in Vercel bundle |
| `next.config` `ignoreBuildErrors: true` | 🟡 | Mastra beta types skipped at build |
| `npm audit` high | 🟢 | 0 high (10 moderate transitive) |
| Tests depth | 🟡 | 41 files / 155 tests — good logic tests; limited E2E in CI until pushed |
| Google Maps `mapId` | 🟢 | `ChatMap` uses `getGoogleMapsMapId()`; prod requires env |
| Places FieldMask in app | 🟡 | No direct Places New client in `src/`; grounding via ADK |

---

## 4. Critical blockers

### Before first push (code) — **RESOLVED 2026-05-25**

1. ~~Patch `.gitignore`~~ ✅  
2. ~~Delete `-`~~ ✅  
3. ~~RLS catalog tools~~ ✅  
4. ~~CopilotKit same-origin prod~~ ✅  

**Remaining before push (process only):**

- Execute §10 six-commit plan; **never** `git add .`
- `git status` clean except ignored paths after commit 6

### Before Vercel production (ops — after push)

1. Supabase Auth URL config: `https://www.mdeai.co/auth/callback` (+ apex); Site URL matches hostname.
2. Vercel `NEXT_PUBLIC_SITE_URL=https://www.mdeai.co`.
3. `ADK_GROUNDING_URL` → production ADK (not `localhost:8000`).
4. `E2E_BYPASS_AUTH` unset in Production.
5. Optional: `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY` if using CopilotKit Cloud instead of same-origin runtime.

---

## 5. Command audit results (2026-05-25)

### 5.1 Git

```text
Branch: main...origin/main (0 ahead / 0 behind on commits)
Modified: 24 files (+900 / -236 vs HEAD)
Untracked: ~114 path entries (138 status lines)
```

**Modified (committed ancestor, dirty working tree):**

- `.env.example`, `docs/ARCHITECTURE.md`, `package.json`, `package-lock.json`
- `scripts/verify-supabase-env.mjs`
- `src/__tests__/smoke.test.ts`
- `src/app/api/copilotkit/route.ts`, `src/app/auth/actions.ts`
- `src/app/globals.css`, `src/app/host/event/new/page.tsx`, `src/app/layout.tsx`
- `src/app/login/page.tsx`, `src/app/page.tsx`, `src/app/signup/page.tsx`
- `src/components/approvals/ApprovalPanel.tsx`, `src/components/auth/auth-email-form.tsx`
- `src/lib/supabase/env.ts`, `src/lib/supabase/middleware.ts`, `src/lib/types.ts`
- `src/mastra/agents/index.ts`, `src/mastra/copilotkit/logging-mastra-agent.ts`
- `src/mastra/index.ts`, `src/mastra/lib/log-agent-run.test.ts`, `src/mastra/tools/index.ts`

### 5.2 Secrets grep (excludes `node_modules`, `.next`, `.git`)

| Pattern | Finding |
|---------|---------|
| `AIza` / `GOCSPX` / `sk-` live literals | **None** in committable TS/MD (lockfile integrity hashes only) |
| `SUPABASE_SERVICE_ROLE` | References in server scripts, `ai-runs`, `grounding-quota`, `.env.example` — **expected** |
| `DATABASE_URL` | `search-attractions.ts`, `storage.ts`, verify scripts — server-only |
| `COPILOTKIT_API_KEY` | `copilotkit-auth.ts` + tests — server gate |

### 5.3 Junk ignore check

| Path | Ignored? |
|------|----------|
| `mastra-agent-memory.db*` | ❌ NOT_IGNORED |
| `test-results/` | ❌ |
| `tmp/` | ❌ |
| `.agents/` `.codex/` `.cursor/` `.gemini/` `.vscode/` `.zed/` | ❌ |
| `workspace/` | ❌ |
| `.vercel/` | ✅ |
| File `-` | ❌ (accidental scrape) |

### 5.4 Quality gates

| Command | Result |
|---------|--------|
| `npm run lint` | ✅ pass |
| `npm run typecheck` | ✅ pass |
| `npm run build` | ✅ pass (17 app routes) |
| `npm run test` | ✅ 155/155 |
| `npm audit --omit=dev --audit-level=high` | ✅ 0 high |
| `npm run floor` | ✅ pass |
| `npm run check:mastra` | ✅ pass (warn: LibSQL allowed until `MASTRA_REQUIRE_PG=1`) |

---

## 6. Files that must NOT be committed

```text
-                          # DELETE — scraped ai.google.dev content
mastra-agent-memory.db
mastra-agent-memory.db-shm
mastra-agent-memory.db-wal
test-results/
tmp/
workspace/
.agents/
.codex/
.cursor/
.gemini/
.vscode/
.zed/
.mcp.json
opencode.json
skills-lock.json
config/mcporter.json      # local agent IDE config
supabase/.temp/           # CLI link metadata (optional; no migrations in mdeapp/supabase)
.vercel/
.env.local
node_modules/
.next/
```

---

## 7. Files that must be committed (minimum viable release)

**All of `src/`** (app, components, lib, mastra, platform), **`public/`**, **`e2e/`**, **`playwright.config.ts`**, production **`scripts/*.mjs`**, **`docs/`** (ARCHITECTURE + runbooks), root config (`package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json`, `.env.example`, `README.md`, `LICENSE`).

**Do not** commit `mdeapp/supabase/.temp/` unless you add real `supabase/migrations` later.

---

## 8. `.gitignore` (Commit 1) — **APPLIED**

Patterns added to `mdeapp/.gitignore` (2026-05-25). Include `.gitignore` in Commit 1.

---

## 9. Best commit split plan (6 commits)

Order preserves bisect-friendly layers: config → auth → UI → Mastra → maps → tests/docs.

| # | Theme | Intent |
|---|--------|--------|
| 1 | Repo safety / config | ignore rules, deps, Next config, Playwright config |
| 2 | Auth foundation | SSR, middleware, relay, login/signup, callback, Google OAuth actions |
| 3 | App UI / features | pages, chat shell, trips, saved, tickets UI, host, events |
| 4 | Mastra agents / tools / workflows | agents, tools, workflows, copilot bridge, storage |
| 5 | Maps / ADK | platform/maps, ChatMap, ADK client, grounding quota |
| 6 | Tests / scripts / docs | vitest, e2e, smoke scripts, ARCHITECTURE, runbooks |

---

## 10. Exact `git add` commands (no `git add .`)

Run from `/home/sk/mdeai/mdeapp`. After each commit: `git status --short` should show only later tranches + ignored junk.

### Pre-flight

```bash
cd /home/sk/mdeai/mdeapp
# .gitignore patched and ./- deleted (2026-05-25)
npm run floor && npm run check:mastra && npm run verify:supabase
```

### Commit 1 — repo safety / config

```bash
git add .gitignore .env.example package.json package-lock.json \
  next.config.ts tsconfig.json eslint.config.mjs postcss.config.mjs \
  components.json playwright.config.ts README.md LICENSE
git commit -m "$(cat <<'EOF'
chore: repo hygiene, deps, and Playwright config for mdeapp

Adds gitignore rules for local Mastra DB, IDE dirs, and test artifacts.
Pins package lock and documents env shape in .env.example.
EOF
)"
```

### Commit 2 — auth foundation

```bash
git add src/middleware.ts \
  src/lib/supabase/env.ts src/lib/supabase/client.ts src/lib/supabase/server.ts \
  src/lib/supabase/middleware.ts src/lib/supabase/edge-functions.ts \
  src/lib/supabase/service-env.ts src/lib/supabase/service.ts \
  src/lib/supabase/user-scoped.ts src/lib/supabase/__tests__/ \
  src/lib/auth/ src/hooks/use-session.ts \
  src/app/auth/ src/app/login/ src/app/signup/ \
  src/components/auth/
git commit -m "$(cat <<'EOF'
feat(auth): Supabase SSR, Google OAuth, callback relay, protected routes

Magic link and Google sign-in redirect to /auth/callback; middleware relays
stray ?code= from Site URL fallback. getUser() gates /trips, /saved, /host.
EOF
)"
```

### Commit 3 — app UI / features

```bash
git add src/app/layout.tsx src/app/page.tsx src/app/globals.css src/app/chat/ \
  src/app/trips/ src/app/saved/ src/app/me/ src/app/events/ \
  src/app/host/ src/app/api/approval-commit/ src/app/api/leads/ src/app/api/tickets/ \
  src/components/chat/ src/components/copilot/ src/components/maps/ \
  src/components/trips/ src/components/saved/ src/components/tickets/ \
  src/components/events/ src/components/host/ src/components/modals/ \
  src/components/sheets/ src/components/empty/ src/components/cards/ \
  src/components/approvals/ src/components/ui/skeleton.tsx \
  src/lib/types.ts src/lib/types/ src/lib/trips/ src/lib/saved/ src/lib/events/ \
  src/lib/tickets/ src/lib/leads/ src/lib/copilotkit-client-props.ts \
  src/lib/normalize-tool-envelope.ts src/lib/tool-render-state.ts \
  src/lib/event-query-classifier.ts src/lib/use-modal-a11y.ts \
  src/lib/__tests__/ public/
git commit -m "$(cat <<'EOF'
feat(ui): chat shell, trips, saved, tickets, host event, and API routes

Geo chat layout, SCREEN flows, and server proxies for tickets and approvals.
EOF
)"
```

### Commit 4 — Mastra agents / tools / workflows

```bash
git add src/mastra/ src/app/api/copilotkit/route.ts \
  src/lib/copilotkit-auth.ts src/lib/copilotkit-auth.test.ts
git commit -m "$(cat <<'EOF'
feat(mastra): agents, search tools, workflows, and CopilotKit Pattern 1 bridge

In-process Mastra via getLocalAgentsWithLogging; concierge, rental, event,
and host agents with audited search tools.
EOF
)"
```

### Commit 5 — maps / ADK

```bash
git add src/platform/maps/ src/platform/contracts/ src/platform/copilot/ \
  src/lib/google-maps-map-id.ts src/mastra/lib/adk-grounding-client.ts \
  src/mastra/lib/adk-grounding-types.ts src/mastra/lib/grounding-quota.ts \
  src/mastra/lib/grounding-quota.test.ts src/mastra/lib/adk-grounding-client.test.ts \
  src/mastra/tools/search-grounded-places.ts
git commit -m "$(cat <<'EOF'
feat(maps): Google Maps UI, pin merge, and ADK grounding integration

Client mapId/key split from server ADK grounding; quota via Supabase log.
EOF
)"
```

### Commit 6 — tests / scripts / docs

```bash
git add src/__tests__/ e2e/ scripts/ docs/ \
  src/lib/normalize-tool-envelope.test.ts
git commit -m "$(cat <<'EOF'
test: vitest suite, Playwright screens, smoke scripts, and architecture docs

155 unit tests, e2e screen specs, localhost QA runbook, and verify scripts.
EOF
)"
```

### Post-commit verification

```bash
git status --short          # should be empty or only ignored paths
npm run floor
npm run check:mastra
```

---

## 11. Tests to run after each commit

| After commit | Commands |
|--------------|----------|
| 1 | `npm run lint && npm run typecheck` |
| 2 | `npm run test -- src/lib/supabase src/app/auth src/components/auth` + manual `curl -I http://localhost:3001/login` |
| 3 | `npm run build` + `npm run test:e2e:screens` (optional long) |
| 4 | `npm run check:mastra && npm run test -- src/mastra` |
| 5 | `npm run verify:maps-env` (needs `.env.local`) + `npm run test -- src/platform/maps` |
| 6 | `npm run floor` |

---

## 12. Production deployment checklist (Vercel + Supabase)

### Supabase (`zkwcbyxiwklihegjhuql`)

- [ ] Site URL = `https://www.mdeai.co` (or canonical)
- [ ] Redirect URLs: `https://www.mdeai.co/auth/callback`, `https://mdeai.co/auth/callback`, preview URLs
- [ ] Google provider enabled ([social login doc](https://supabase.com/docs/guides/auth/social-login/auth-google))
- [ ] Email OTP enabled for magic links
- [ ] No `NEXT_PUBLIC_*` service role on Vercel

### Vercel (import [amo-tech-ai/mdeapp](https://github.com/amo-tech-ai/mdeapp.git))

- [ ] Root directory: `.` (repo root is mdeapp)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, anon/publishable key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_SECRET_KEY` (server)
- [ ] `GOOGLE_GENERATIVE_AI_API_KEY`
- [ ] `DATABASE_URL` (pooler) for Mastra Postgres storage
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.mdeai.co`
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` + `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`
- [ ] `GOOGLE_PLACES_API_KEY` / server maps keys (if used)
- [ ] `ADK_GROUNDING_URL` (production ADK endpoint, not localhost:8000)
- [ ] `COPILOTKIT_API_KEY` — see §12.1
- [ ] `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY` — if using CopilotKit Cloud in prod
- [ ] `E2E_BYPASS_AUTH` **unset** in Production

### §12.1 CopilotKit production modes

| Mode | Env | Browser behavior |
|------|-----|------------------|
| **A — Same-origin (Pattern 1)** | Unset `COPILOTKIT_API_KEY` in prod, or change gate to allow cookie sessions | `<CopilotKit runtimeUrl="/api/copilotkit">` works |
| **B — CopilotKit Cloud** | `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY` set | Cloud reaches your runtime with Bearer |

Current code: if `COPILOTKIT_API_KEY` is set and `NODE_ENV=production`, browser POST without Bearer → **401** (`copilotkit-auth.test.ts`). Align env with mode A or B before promote.

### Build settings

- [ ] `npm run build` (standalone output enabled in `next.config.ts`)
- [ ] Consider CI: `MASTRA_REQUIRE_PG=1 npm run check:mastra` on main

---

## 13. Success criteria by workflow

| Workflow | Success criteria | Pre-deploy code status |
|----------|------------------|------------------------|
| **Google login** | OAuth → `/auth/callback?code=` → session cookie → redirect `next` | 🟡 Relay fixes `/ ?code=`; needs dashboard allowlist + deploy |
| **Magic link** | Email link → same callback → session | 🟢 Code OK; needs `NEXT_PUBLIC_SITE_URL` on Vercel |
| **`/trips`, `/saved` middleware** | Anonymous → 307 `/login?next=…`; authed → 200 | 🟢 `getUser()` in middleware (uncommitted) |
| **`/api/copilotkit` auth** | Dev: open POST; Prod: Cloud Bearer or unset server key | 🟡 See §12.1 |
| **Mastra tools** | Agent streams; tools return cards | 🟢 Pattern 1; rentals/events anon |
| **Rental cards + map pins** | Tool → generative UI → pins on map | 🟢 `search-tool-renders` + map merge tests |
| **Google Maps** | Map loads with `mapId`; referrer-restricted browser key | 🟢 Env-gated; DEMO_MAP_ID dev only |
| **Tickets APIs** | Checkout proxies to edge; wallet route works | 🟢 Proxies exist; Stripe edge ops separate |
| **ADK grounding** | `search-grounded-places` hits `ADK_GROUNDING_URL` | 🟡 Prod must not point to localhost:8000 |
| **Attractions search** | Tourist rows returned | 🟢 Anon + `tourist_destinations_select_anon` |

---

## 14. Deep-dive findings

### 14.1 Auth (Supabase SSR + Google)

| Check | Result |
|-------|--------|
| `createServerClient` + cookies | ✅ `server.ts`, middleware |
| `exchangeCodeForSession` | ✅ `auth/callback/route.ts` |
| `signInWithOAuth` redirectTo | ✅ `/auth/callback?next=` in `auth/actions.ts` |
| `getUser()` not `getSession()` for gates | ✅ middleware, copilotkit, approval-commit |
| `relaySupabaseAuthQuery` | ✅ **local only** — fixes prod Site URL fallback |
| Protected prefixes | ✅ `/host`, `/trips`, `/saved` |
| Service role in `src/components` | ✅ None (`check-mastra` rule 4) |

### 14.2 RLS-safe Supabase usage

| Path | Client | RLS |
|------|--------|-----|
| `search-rentals.ts` | Anon `SUPABASE_ANON_KEY` | ✅ |
| `search-events.ts` | Anon only | ✅ |
| `search-restaurants.ts` | Anon **or** service role fallback | ⚠️ Fix before prod |
| `search-attractions.ts` | `pg` + `DATABASE_URL` | ❌ Bypass |
| `createUserScopedClient` | accessToken callback | ✅ AUTH-006 pattern |
| `ai-runs.ts` / `grounding-quota.ts` | Service role | ✅ Server observability |

### 14.3 CopilotKit + Mastra (Pattern 1)

- `ExperimentalEmptyAdapter` + `getLocalAgentsWithLogging({ mastra })` — matches [CopilotKit Mastra](https://docs.copilotkit.ai/mastra) in-process pattern.
- `MASTRA_RESOURCE_ID_KEY` set from `user.id` when authed.
- Mastra Studio `:4111` — **not** deployed on Vercel; dev-only per `docs/ARCHITECTURE.md`. Do not expose publicly without `@mastra/auth-supabase`.

### 14.4 Tests — meaningful vs shallow

| Tier | Count | Examples |
|------|------:|----------|
| Logic / schema | ~30 files | `search-events-logic`, `itinerary-logic`, `approval-commit-schema` |
| Security / wiring | ~8 | `maps-security`, `copilotkit-auth`, `user-scoped`, `smoke.test.ts` |
| UI component | few | `approval-panel`, `empty-state` |
| E2E | 23 specs under `e2e/` | Not run in `floor`; run post-push in CI |

**Not shallow** for a Phase 1 gate; E2E is the main gap for “100% deploy confidence.”

### 14.5 Dependencies / commands

- CopilotKit pinned **1.55.2** — `check-mastra` enforces.
- `npm run dev` → UI `:3001` + Mastra dev `:4111` — correct per CLAUDE.md.
- `verify:supabase` still mentions `DATABASE_URL` for rentals in comment but rentals tool uses anon — comment drift only.

---

## 15. Blocker summary

### Before commit

| ID | Blocker | Owner |
|----|---------|-------|
| B1 | Patch `.gitignore` §8 | Dev |
| B2 | `rm ./-` | Dev |
| B3 | Staged-file review (no `tmp/`, `.agents/`, `*.db`) | Dev |
| B4 | Run 6-commit plan §10 | Dev |

### After push, before production promote

| ID | Blocker | Owner |
|----|---------|-------|
| D1 | Supabase redirect URLs + Site URL | Ops |
| D2 | Vercel `NEXT_PUBLIC_SITE_URL` | Ops |
| D3 | CopilotKit prod mode A or B §12.1 | Ops |
| D4 | `search-attractions` RLS / migrate to anon | Eng |
| D5 | Remove restaurants service-role fallback | Eng |
| D6 | `ADK_GROUNDING_URL` production endpoint | Ops |
| D7 | Google OAuth client redirect to Supabase callback | Ops |

---

## 16. Final go / no-go

| Action | Recommendation |
|--------|----------------|
| **Commit split (6 commits)** | **GO** — code blockers fixed |
| **Push to `amo-tech-ai/mdeapp`** | **GO** after §10 + `npm run floor` |
| **Vercel production deploy** | **GO preview** after push; **GO prod** after AUTH-011 ops (redirect URLs, SITE_URL, ADK) |

**Forensic conclusion:** Audit findings were **errors in the working tree**, not false positives. They are **fixed before commit** so the six-commit plan ships RLS-safe tools, CopilotKit Pattern 1 prod behavior, and clean git hygiene. Remaining gap is **process** (execute commits + push) and **ops** (Supabase/Vercel dashboard), not more TypeScript blockers.

---

*Next: operator runs §10 commits → push → AUTH-011 on preview → prod promote.*
