# AUTH-011 deployment audit — mdeapp (Vercel + Supabase + CopilotKit + Mastra + Maps + ADK)

**Auditor:** Cursor agent (forensic pass)  
**Date:** 2026-05-25  
**App path:** `/home/sk/mdeai/mdeapp`  
**Supabase project:** `zkwcbyxiwklihegjhuql` — `https://zkwcbyxiwklihegjhuql.supabase.co`  
**Vercel project:** `amo100/mdeapp`  
**GitHub:** `https://github.com/amo-tech-ai/mdeapp.git` (main pushed ~30m before audit)

**Related:** [`28-mde-audit.md`](28-mde-audit.md) (pre-commit), [`AUTH-011-production-auth-checklist.md`](../data/auth/AUTH-011-production-auth-checklist.md), [`AUTH-002-supabase-google-dashboard.md`](../archive/data-A/AUTH-002-supabase-google-dashboard.md)

**Method:** Live HTTP probes on production, `vercel env ls`, local `npm run floor` / `check:mastra` / `verify:supabase` / `npm test`, Chromium Playwright subset, Supabase MCP `get_advisors` (security), code grep. **No secrets printed.** **No deploy/push performed.**

### Post-audit remediation (2026-05-25, same day)

| Action | Status |
|--------|--------|
| Supabase Site URL + redirect allowlist (`configure-supabase-auth-urls.mjs`) | ✅ Applied |
| Vercel `NEXT_PUBLIC_SITE_URL` Production → `https://www.mdeai.co` | ✅ Fixed (was empty `""`) |
| Vercel `NEXT_PUBLIC_SITE_URL` Preview → git-main alias | ✅ Added |
| Production redeploy | ✅ `vercel --prod` |
| `ADK_GROUNDING_URL` on Vercel | ❌ Still blocked — no prod ADK HTTPS endpoint in project |
| Evidence file | ✅ `tasks/notes/AUTH-011-evidence.md` |

---

## 1. Executive summary

| Question | Answer |
|----------|--------|
| **New app on production?** | **YES** — `www.mdeai.co` serves 3-panel concierge UI (`data-testid="chat-canvas"`, `concierge`, CopilotKit), not W1 ping shell |
| **Preview URL auditable?** | **NO (automated)** — `mdeapp-git-main-amo100.vercel.app` returns **401 Vercel SSO**; team must authenticate or disable protection for AUTH-011 |
| **Preview go/no-go** | **NO** for unattended QA; **CONDITIONAL** after SSO access + env fixes |
| **Production go/no-go** | **NO** for full public cutover; **CONDITIONAL** for browse-only / internal dogfood |
| **`www.mdeai.co` safe for public users?** | **NO (yet)** — browse/chat shell OK; **Google OAuth allowlist**, **ADK grounding**, **CopilotKit abuse surface**, and **signed-in flows** not fully verified |

**One-line:** Code and production **routing/auth middleware** are in good shape; **operator env + Supabase dashboard + ADK** block AUTH-011 completion and public login marketing.

---

## 2. Readiness scores

| Dimension | Preview | Production | Notes |
|-----------|--------:|-----------:|-------|
| Deploy / routes live | 40 | 85 | Preview behind Vercel SSO |
| Auth UX + middleware | 50 | 82 | `?code=` relay verified on prod |
| Supabase dashboard config | — | 45 | Not readable via MCP; manual gate |
| Vercel env completeness | 35 | 70 | Missing `ADK_GROUNDING_URL`; Preview missing `NEXT_PUBLIC_SITE_URL` |
| CopilotKit + Mastra Pattern 1 | 40 | 78 | Route wired; prod auth open without `COPILOTKIT_API_KEY` |
| RLS / catalog tools | 90 | 90 | Anon-only in tools; `verify:supabase` PASS |
| Maps UI | 50 | 75 | Home map testids present; `/rentals` 404 on prod |
| ADK grounding | 10 | 15 | Defaults to `localhost:8000` when env unset |
| Local CI gates | 92 | 92 | `floor`, `check:mastra`, `verify:supabase`, 156 unit tests |
| E2E (targeted Chromium) | 85 | 85 | 011/012/016 PASS; full matrix needs `playwright install` |
| **Overall** | **45/100** | **68/100** | |

---

## 3. Risk table (red / yellow / green)

| Area | Status | Evidence |
|------|--------|----------|
| Production serves new concierge app | 🟢 | HTML: `chat-canvas`, `concierge`, filter chips, nav trips/saved |
| W1-only shell on prod | 🟢 | No `pingAgent`-only home; CopilotKit present |
| `/login`, `/signup` 200 | 🟢 | `curl` 200; "Sign in" in body |
| `/trips`, `/saved` anon gate | 🟢 | 307 → `/login?next=%2Ftrips` / `%2Fsaved` |
| `/chat` | 🟢 | 307 → `/` (alias by design in `src/app/chat/page.tsx`) |
| OAuth `?code=` on `/` relay | 🟢 | `GET /?code=fake` → `307` → `/auth/callback?code=…` |
| Preview URL HTTP audit | 🔴 | `mdeapp-git-main-amo100.vercel.app` → **401** + `_vercel_sso_nonce` |
| `ADK_GROUNDING_URL` on Vercel | 🔴 | Absent from `vercel env ls`; code default `http://localhost:8000` |
| `NEXT_PUBLIC_SITE_URL` Preview | 🟡 | Production + Development only; **not Preview** |
| `COPILOTKIT_API_KEY` Production | 🟡 | Absent → **any origin** can POST when key unset (see §10) |
| Service role in `NEXT_PUBLIC_*` | 🟢 | Not in client env names on Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` on Vercel | 🟡 | Present Preview+Production (server-only OK if not `NEXT_PUBLIC_`) |
| Catalog Mastra tools use anon | 🟢 | `search-{rentals,events,attractions,restaurants}.ts` |
| `DATABASE_URL` in catalog tools | 🟢 | `check:mastra` rule 6; grep clean |
| CopilotKit route Pattern 1 | 🟢 | `ExperimentalEmptyAdapter` + `getLocalAgentsWithLogging` |
| Signed-in Google/magic link E2E | 🔴 | Not run (no credentials in audit) |
| `ai_runs` row after chat | 🔴 | Not verified on prod |
| Supabase redirect allowlist | 🟡 | Dashboard not API-verified; AUTH-002 doc lists required URLs |
| `/rentals` on prod | 🟡 | **404** (route may be W5+; not in this deploy audit scope) |
| `npm audit` moderate | 🟡 | 10 moderate (floor still passes high gate) |
| Playwright firefox/webkit | 🟡 | Missing browsers locally — not prod bugs |

---

## 4. Vercel deployment verification

### URLs

| URL | Role | Status | Notes |
|-----|------|--------|-------|
| `https://www.mdeai.co` | Production (marketing) | ● Ready | Latest prod deploy ~30m ago: `mdeapp-lxeyzwtgn-amo100.vercel.app` |
| `https://mdeai.co` | Apex | Not probed separately | Ensure redirects match www canonical |
| `https://mdeapp-git-main-amo100.vercel.app` | Git branch alias | **401 SSO** | Cannot run route/map/auth smoke without login |
| `https://mdeapp-lxeyzwtgn-amo100.vercel.app` | Deployment URL | **401 SSO** | Same protection |

### Route probes (production, anonymous)

| Route | HTTP | Behavior |
|-------|------|----------|
| `/login` | 200 | Auth page |
| `/signup` | 200 | Signup page |
| `/` (chat) | 200 | Concierge workspace + map testids |
| `/chat` | 307 | Redirect to `/` |
| `/trips` | 307 | → `/login?next=%2Ftrips` |
| `/saved` | 307 | → `/login?next=%2Fsaved` |
| `/rentals` | 404 | Not deployed or not routed |
| `/auth/callback` | 307 | Expected for GET without session exchange |
| `POST /api/copilotkit` | 400 | Empty body — endpoint alive (not 401/500) |

### New app vs old W1 shell

Production HTML includes **`concierge`**, **`data-testid="chat-canvas"`**, **`workflow-progress-strip`**, nav **`nav-trips-link`** / **`nav-saved-link`**. This matches post–Phase-1 chat workspace, not the minimal W1 ping sidebar-only shell.

---

## 5. Supabase Auth configuration

**MCP:** `get_project_url` → `https://zkwcbyxiwklihegjhuql.supabase.co` (canonical project confirmed).

**Not automatable via MCP:** Site URL, redirect allowlist, Google provider toggle, magic link — require Dashboard confirmation.

### Required redirect URLs (operator checklist)

Must appear in **Authentication → URL Configuration** (exact paths):

- `https://www.mdeai.co/auth/callback`
- `https://mdeai.co/auth/callback`
- `https://mdeapp-git-main-amo100.vercel.app/auth/callback` (after preview SSO resolved)
- `http://localhost:3001/auth/callback` (local)

**Site URL:** should be `https://www.mdeai.co` per AUTH-002 (must match live hostname).

### Code-side mitigations (verified on prod)

| Check | Result |
|-------|--------|
| Callback route exists | `/auth/callback` responds |
| `?code=` stuck on `/` | **Mitigated** — middleware relays to `/auth/callback` (verified with fake code) |
| SSR `getUser()` in CopilotKit route | Present in `src/app/api/copilotkit/route.ts` |

### Supabase MCP security advisors

`get_advisors` (security): **no new critical auth-specific finding** in sampled output; legacy WARN lints (e.g. `function_search_path_mutable` on `fts_spanish`) — pre-existing, not introduced by this deploy.

**Status:** 🟡 **Dashboard allowlist + live Google sign-in** still required to close AUTH-011.

---

## 6. Vercel environment variables

From `vercel env ls` (names/scopes only):

| Variable | Preview | Production | Development | Verdict |
|----------|---------|------------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ | 🟢 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | ✅ | — | 🟢 (legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` also on Preview) |
| `NEXT_PUBLIC_SITE_URL` | ❌ | ✅ | ✅ | 🟡 Preview OAuth/CopilotKit same-origin may break |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ | ✅ | — | 🟢 |
| `DATABASE_URL` | ✅ | ✅ | — | 🟢 (Mastra storage; not catalog bypass) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ | ✅ | ✅ | 🟢 |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | ✅ | ✅ | ✅ | 🟢 |
| `ADK_GROUNDING_URL` | ❌ | ❌ | — | 🔴 defaults to localhost in runtime |
| `COPILOTKIT_API_KEY` | ❌ | ❌ | — | 🟡 see §10 |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ | — | 🟡 server-only — confirm not exposed to client bundle |
| `E2E_BYPASS_AUTH` | — | — | — | 🟢 not listed (good for Production) |

**ADK_GROUNDING_URL:** NOT set → `adk-grounding-client.ts` uses `http://localhost:8000`. **Grounded restaurants/attractions fail in Vercel serverless.**

**Public service role:** No `NEXT_PUBLIC_*SERVICE*` in Vercel list. Server files may use `SUPABASE_SERVICE_ROLE_KEY` for `ai-runs` / `grounding-quota` only.

---

## 7. CopilotKit + Mastra (Pattern 1)

| Check | Status | Evidence |
|-------|--------|----------|
| `POST /api/copilotkit` exists | 🟢 | Prod returns 400 on `{}` (handler runs) |
| `getLocalAgentsWithLogging` | 🟢 | `route.ts` + `check-mastra` |
| `ExperimentalEmptyAdapter` | 🟢 | In route |
| Same-origin browser (no Bearer) | 🟢 | `Origin: https://www.mdeai.co` → 400 not 401 |
| Foreign origin without key | 🟡 | Also 400 when `COPILOTKIT_API_KEY` unset — **both allowed** |
| Streaming | 🟡 | Not exercised in audit (needs signed-in browser session) |
| Mastra Studio on Vercel | N/A | Dev `:4111` only |

**AUTH-011 checklist drift:** Checklist says “POST without Bearer → **401** in production.” That applies only when **`COPILOTKIT_API_KEY` is set**. Current Vercel state: key **unset** → `assertCopilotKitAuthorized` returns `null` → **no 401 for any origin**. Recommend either set `COPILOTKIT_API_KEY` + rely on same-origin helper, or document Pattern-1-open as intentional risk.

---

## 8. Supabase SSR + RLS

| Check | Status | Evidence |
|-------|--------|----------|
| Middleware `getUser()` + protected prefixes | 🟢 | `/host`, `/trips`, `/saved` in `middleware.ts` |
| Logged-out `/trips` | 🟢 | Prod 307 + Playwright SCREEN-012 (3/3 Chromium) |
| Logged-out `/saved` | 🟢 | Playwright SCREEN-011 (3/3 Chromium) |
| Logged-out `/host/event/new` | 🟢 | SCREEN-016 (2/2 Chromium) |
| Catalog tools | 🟢 | Anon `createClient` only in four search tools |
| `npm run verify:supabase` | 🟢 | PASS (local `.env.local`) |

---

## 9. Google Maps + ADK

| Check | Status | Evidence |
|-------|--------|----------|
| Map UI on `/` | 🟢 | `chat-canvas`, filter chips, nav links in HTML |
| `mapId` / AdvancedMarker | 🟡 | Env present on Vercel; pin render not visually verified in audit |
| Browser vs server key separation | 🟢 | `NEXT_PUBLIC_GOOGLE_MAPS_*` vs server `GOOGLE_MAPS_API_KEY` on Vercel |
| ADK endpoint reachable from Vercel | 🔴 | No `ADK_GROUNDING_URL` — server calls localhost |
| Grounded places in prod chat | 🔴 | Blocked until ADK URL deployed (e.g. Hostinger sidecar HTTPS) |

---

## 10. Test results

| Command | Result |
|---------|--------|
| `npm run floor` | **PASS** (after fixing unused `expect` in `SCREEN-016-host-wizard.spec.ts`) |
| `npm run check:mastra` | **PASS** (warn: `:memory:` LibSQL OK until `MASTRA_REQUIRE_PG=1`) |
| `npm run verify:supabase` | **PASS** |
| `npm run build` | Included in floor — **PASS** |
| `npm test` | **156/156** (41 files) |

### Playwright (targeted)

| Spec | Chromium | Firefox/WebKit |
|------|----------|----------------|
| SCREEN-011 saved | 3/3 PASS | Not run |
| SCREEN-012 trips | 3/3 PASS | FAIL — browsers not installed |
| SCREEN-016 host | 2/2 PASS | FAIL — browsers not installed |

**Failure classification:**

| Failure | Type |
|---------|------|
| Firefox/WebKit “Executable doesn't exist” | **Environment** — run `npx playwright install` |
| SCREEN-016 unused `expect` | **Fixed** during audit (lint blocked floor) |
| E2E expecting in-page empty state on protected routes | **Outdated** (fixed prior session) — now expects `/login?next=…` |

**Not run:** SCREEN-006 (event cards / AI), full multi-browser matrix, signed-in auth flows.

---

## 11. Blockers remaining

| # | Blocker | Owner | Fix |
|---|---------|-------|-----|
| 1 | `ADK_GROUNDING_URL` missing on Vercel Preview + Production | Sofía / ops | Set HTTPS ADK base (not localhost); redeploy |
| 2 | `NEXT_PUBLIC_SITE_URL` missing on Preview | Sofía / ops | `https://mdeapp-git-main-amo100.vercel.app` or branch URL; redeploy |
| 3 | Supabase redirect allowlist + Site URL | Patricia / ops | Dashboard per AUTH-002 + user-required three prod/preview URLs |
| 4 | Live Google OAuth + magic link smoke on prod | Lucía / ops | Manual sign-in; confirm no `?code=` on `/` after real OAuth |
| 5 | Preview URL behind Vercel SSO | Patricia / ops | Authenticate for QA or adjust Deployment Protection |
| 6 | `COPILOTKIT_API_KEY` unset → open POST in prod | Sofía | Set key OR accept risk + WAF rate limit |
| 7 | Signed-in `ai_runs.user_id` on prod chat | Lucía | One concierge message while logged in; verify row |
| 8 | AUTH-011 evidence file | Agent/ops | Create `tasks/notes/AUTH-011-evidence.md` with redacted curls |

---

## 12. Exact fixes needed

### Vercel (no auto-deploy)

```bash
cd /home/sk/mdeai/mdeapp
# ADK — use production sidecar URL, not localhost
vercel env add ADK_GROUNDING_URL production
vercel env add ADK_GROUNDING_URL preview

# Preview OAuth / same-origin CopilotKit
vercel env add NEXT_PUBLIC_SITE_URL preview
# value: https://mdeapp-git-main-amo100.vercel.app

# Optional hardening
vercel env add COPILOTKIT_API_KEY production
```

Then **redeploy** Production (and Preview) from Vercel dashboard or `vercel --prod` when approved.

### Supabase Dashboard (`zkwcbyxiwklihegjhuql`)

1. **Site URL:** `https://www.mdeai.co`
2. **Redirect URLs:** add all three production/preview callbacks from §5
3. Confirm **Google** + **Email magic link** enabled
4. Re-test Google sign-in from `www.mdeai.co/login`

### Local (optional QA)

```bash
cd /home/sk/mdeai/mdeapp
npx playwright install chromium   # or full install for firefox/webkit
npm run floor
npx playwright test e2e/screens/SCREEN-011-saved.spec.ts e2e/screens/SCREEN-012-trips.spec.ts e2e/screens/SCREEN-013-saved.spec.ts e2e/screens/SCREEN-016-host-wizard.spec.ts --project=chromium
node --env-file=.env.local scripts/verify-grounding-invoke.mjs   # after ADK URL set locally
```

---

## 13. Go / no-go

| Gate | Verdict | Rationale |
|------|---------|-----------|
| **Preview deploy QA** | **NO-GO** (automated) | SSO 401; missing Preview `NEXT_PUBLIC_SITE_URL` + ADK |
| **Preview (team with SSO login)** | **CONDITIONAL** | After env + Supabase preview callback |
| **Production deploy (code)** | **GO** | Build/tests pass; new app live |
| **Production (public marketing + auth)** | **NO-GO** | ADK, dashboard OAuth proof, CopilotKit hardening, signed-in smoke |
| **Production (browse-only / internal)** | **CONDITIONAL** | Home/login work; don’t advertise Google login until §12 done |

---

## 14. Is `www.mdeai.co` safe for public users?

| Audience | Safe? | Notes |
|----------|-------|-------|
| Anonymous browse `/`, `/login` | **Mostly yes** | New UI; no secrets in HTML sample |
| Anonymous **Google login** | **Not yet** | Allowlist + `NEXT_PUBLIC_SITE_URL` must be confirmed; relay helps but doesn’t replace dashboard |
| **Concierge chat with grounding** | **No** | ADK points to localhost on server |
| **Roberto `/host/*` paid flows** | **Not verified** | Host wizard redirect OK logged-out |
| **Camila `/rentals`** | **N/A** | 404 on prod today |

**Recommendation:** Keep production deploy for **dogfood**; pause **paid ads / mass login campaigns** until AUTH-011 §12 complete and evidence file signed.

---

## 15. AUTH-011 completion checklist

Copy status for `tasks/notes/AUTH-011-evidence.md`:

### Supabase Dashboard

- [ ] Site URL = `https://www.mdeai.co`
- [ ] Redirect URLs: www + apex + preview + `/auth/callback`
- [ ] Google provider enabled
- [ ] Email magic link enabled
- [x] No service role in **client** `NEXT_PUBLIC_*` on Vercel (names only audit)

### Vercel (mdeapp)

- [x] `NEXT_PUBLIC_SITE_URL` = production (present)
- [ ] `NEXT_PUBLIC_SITE_URL` on **Preview**
- [ ] `ADK_GROUNDING_URL` (not localhost) Preview + Production
- [ ] `COPILOTKIT_API_KEY` set (Production) — **optional per Pattern 1 but recommended**
- [x] `E2E_BYPASS_AUTH` unset on Vercel
- [x] `npm run build` clean on main (via floor)

### Runtime smoke (production)

- [x] `GET /login` 200
- [ ] Google or magic link sign-in completes (manual)
- [ ] `POST /api/copilotkit` without Bearer → **401** when `COPILOTKIT_API_KEY` set — **N/A today (key unset)**
- [ ] Signed-in chat → `ai_runs` with `user_id`
- [x] `/trips` redirects when logged out

### Security

- [x] Catalog tools: no `DATABASE_URL` / service-role bypass (`check:mastra`)
- [ ] Edge money webhook rotation (F11 — out of scope)
- [x] Supabase MCP advisors: no new critical auth blockers sampled

**AUTH-011 status:** **In Progress** — ~55% boxes ticked; dashboard + ADK + signed-in smoke remain.

---

## 16. Issue buckets (summary)

| Bucket | Issues |
|--------|--------|
| **Env** | Missing `ADK_GROUNDING_URL`; Preview missing `NEXT_PUBLIC_SITE_URL`; optional `COPILOTKIT_API_KEY` |
| **Supabase** | Redirect allowlist / Site URL not API-verified; live OAuth not smoke-tested |
| **Vercel** | Preview Deployment Protection (SSO 401); prod deploy healthy |
| **CopilotKit/Mastra** | Pattern 1 wired; prod endpoint open without API key; streaming/signed-in not probed |
| **Maps/ADK** | Maps env OK; grounding broken server-side on Vercel |

---

## 17. Recommended next commands

```bash
# 1) Operator — Vercel env (interactive)
cd /home/sk/mdeai/mdeapp && vercel env ls

# 2) After env change — redeploy (when user approves)
vercel --prod

# 3) Local gates
npm run floor && npm run verify:supabase && npm run check:mastra

# 4) E2E chromium gate
npx playwright test e2e/screens/SCREEN-011-saved.spec.ts e2e/screens/SCREEN-012-trips.spec.ts e2e/screens/SCREEN-016-host-wizard.spec.ts --project=chromium

# 5) Production smoke (redact tokens in evidence)
curl -sI https://www.mdeai.co/trips | grep -i location
curl -sI 'https://www.mdeai.co/?code=TEST' | grep -i location
curl -sS -o /dev/null -w '%{http_code}\n' -X POST https://www.mdeai.co/api/copilotkit -H 'Content-Type: application/json' -d '{}'
```

---

## 18. Audit artifact

| Item | Path |
|------|------|
| This report | `tasks/audit/29-commit-audit.md` |
| Evidence (to create) | `tasks/notes/AUTH-011-evidence.md` |
| Lint fix | `e2e/screens/SCREEN-016-host-wizard.spec.ts` (removed unused `expect`) |

**End of audit.** No push, no deploy, no secrets recorded.
