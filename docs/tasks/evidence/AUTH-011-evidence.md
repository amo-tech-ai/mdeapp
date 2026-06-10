# AUTH-011 evidence — 2026-06-06 (updated; original 2026-05-25)

Operator + agent pass. **No secrets below.**

---

## Supabase (`zkwcbyxiwklihegjhuql`)

| Check | Status | Method |
|-------|--------|--------|
| Site URL `https://www.mdeai.co` | ✅ | Management API GET after `scripts/configure-supabase-auth-urls.mjs` (2026-05-25) |
| Redirect allowlist (www, apex, preview, localhost) | ✅ | GET — all host patterns present in `uri_allow_list` |
| Google provider | ⏳ | Dashboard — not API-verified; live OAuth smoke required manually |
| Magic link | ⏳ | Dashboard — not API-verified; live inbox test required manually |
| RLS security score | ✅ 95/100 | Full audit 2026-06-06 — see `tasks/data/audit/06-rls-full-audit-2026-06-06.md` |
| No new critical auth advisors | ✅ | `get_advisors` 2026-06-06 — 0 CRITICAL; `spatial_ref_sys` is documented false positive |

---

## Vercel (`amo100/mdeapp`)

| Variable | Production | Preview | Notes |
|----------|------------|---------|-------|
| `NEXT_PUBLIC_SITE_URL` | ✅ `https://www.mdeai.co` | ✅ `https://mdeapp-git-main-amo100.vercel.app` | Fixed via Vercel API (CLI was saving empty string) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | Pre-existing |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | ✅ | Pre-existing |
| `ADK_GROUNDING_URL` | N/A | N/A | Phase 2 only — not needed for MVP |
| `COPILOTKIT_API_KEY` | ❌ | ❌ | **Recommendation:** set on Vercel to gate cross-origin calls with 401; same-origin browser requests still work via referer check. Without it, unauthenticated cross-origin API calls reach the Gemini backend (cost exposure only, not a data breach). |
| `E2E_BYPASS_AUTH` | ✅ not set | ✅ not set | Not in `vercel.json` or any tracked config. Only in `middleware.ts` code path, guarded by `!== "1"`. |

**Production redeploy:** `mdeapp-rmlhbi1a7-amo100.vercel.app` → `www.mdeai.co` (2026-05-25, after SITE_URL fix)

---

## HTTP smoke (production, anonymous) — 2026-06-06

```text
GET /login                            → 200 ✅
GET /trips                            → 307 → /login?next=%2Ftrips ✅
POST /api/copilotkit (empty {})       → 400 (endpoint up; COPILOTKIT_API_KEY not set → no 401 guard)
```

---

## Local gates — 2026-06-06

| Command | Result |
|---------|--------|
| `npm test -- --run` | ✅ 604/604 |
| Playwright `e2e/auth-guard.spec.ts` (chromium + firefox + webkit) | ✅ **30/30** |

### Storage test fix (2026-06-06)

`storage.test.ts` was failing 2/6 with "expected LibSQLStore to be PostgresStore" because `MASTRA_DEV_LIBSQL=1` is injected by Infisical dev env. Tests that expect Postgres behavior now also stub `MASTRA_DEV_LIBSQL` to `""` before asserting. Tests that validate the `MASTRA_DEV_LIBSQL=1` override path are unaffected.

---

## AUTH-005 Playwright auth-guard e2e

| Run | Date | Result | Browsers | Notes |
|-----|------|--------|----------|-------|
| PR #56 initial | 2026-06-03 | 10/10 (chromium) | chromium only | Fresh server on :3007 |
| AUTH-011 close | **2026-06-06** | **30/30** | **chromium + firefox + webkit** | Against :3001 (main dev server) |

Coverage:

| Behavior | Covered | How |
|----------|---------|-----|
| Login UI | ✅ | `/login` renders magic-link + Google + email field |
| Signup UI | ✅ | `/signup` renders magic-link + Google |
| Logout | ✅ | `POST /auth/signout` → 303 → `/` |
| Protected-route redirect | ✅ | `/trips` `/saved` `/host/event/new` `/me/tickets` → `/login?next=` |
| Guest ticket-view exemption | ✅ | `/me/tickets/[id]` stays public (exact-match guard in middleware) |
| Callback error handling | ✅ | no-code → `error=auth_callback_missing_code`; `?error=access_denied` relays to `/login` |
| Session persistence / real OAuth | ⏳ | Needs real inbox or Google consent — **manual prod smoke only** |

---

## Security advisor findings (2026-06-06, re-run post-migration-sync)

Advisor re-run confirmed: **1 ERROR** (`spatial_ref_sys` false positive), **0 new CRITICALs**, `anon_security_definer_function_executable` WARNs dropped from ~43 → 32 (11 revoked by migration `20260606114224`). ✅

Pre-existing warns (not introduced by 2026-06-06 changes):

| Finding | Severity | Decision |
|---------|----------|----------|
| `spatial_ref_sys` RLS disabled | ERROR | False positive — PostGIS owned by `supabase_admin`; documented in `docs/security/supabase-rls-false-positives.md` |
| `auth_leaked_password_protection` | WARN | HaveIBeenPwned check not enabled — low priority for magic-link-only auth |
| SECURITY DEFINER functions callable by `anon` (`outbox_enqueue`, `handle_new_user`, `get_my_role`, etc.) | WARN | Pre-existing; `handle_new_user` is intentional (profile creation trigger). Outbox functions warrant a targeted REVOKE review before launch — **spawned as separate task** |
| Extensions in public schema (`pg_trgm`, `postgis`, `vector`) | WARN | Standard Supabase setup — no action needed |

---

## Service-role carve-out audit (2026-06-06)

`grep -r "SERVICE_ROLE" mdeapp/src` returns only F13-approved paths:

| File | Justification |
|------|---------------|
| `src/lib/supabase/service-env.ts` | Service client factory — F13 approved |
| `src/mastra/lib/ai-runs.ts` | Mastra lib — F13 approved |
| `src/mastra/lib/search-logs.ts` | Mastra lib — F13 approved |
| `src/mastra/lib/grounding-quota.ts` | Mastra lib — F13 approved |
| `src/mastra/lib/search-grounding-quota.ts` | Mastra lib — F13 approved |
| Test files (`*.test.ts`) | Mocked in tests — no real key |

No service-role key in any client component, page component, or non-F13 API route.

---

## Checklist against AUTH-011 spec

### Supabase Dashboard
- [x] Site URL = `https://www.mdeai.co` ✅
- [x] Redirect URLs: prod + preview + `/auth/callback` ✅
- [ ] Google provider enabled — ⏳ verify manually on dashboard
- [ ] Email magic link enabled — ⏳ verify manually on dashboard
- [x] No service role in client env on Vercel ✅ (F13 carve-out audit above)

### Vercel
- [x] `NEXT_PUBLIC_SITE_URL` = `https://www.mdeai.co` ✅
- [ ] `COPILOTKIT_API_KEY` set (Production) — ⚠️ **not set** — same-origin pattern works; cross-origin calls are unauthenticated (cost exposure only). Recommend setting before marketing launch.
- [x] `E2E_BYPASS_AUTH` unset in Production ✅
- [x] `npm run build` clean on main ✅ (Vercel deploys are green per PR #56 CI)

### Runtime smoke
- [x] `GET /login` → 200 ✅
- [ ] Google or magic link sign-in completes — ⏳ manual only
- [ ] `POST /api/copilotkit` without Bearer → 401 — ⚠️ returns 400 (COPILOTKIT_API_KEY not set; 401 path not activated)
- [ ] Signed-in chat → row in `ai_runs` with `user_id` — ⏳ manual only
- [x] `/trips` redirects when logged out → 307 ✅

### Security
- [x] Service-role hook clean ✅
- [x] Edge webhook secrets isolated per PAY-003 ✅ (SAN-116 Done 2026-06-06)
- [x] Supabase advisors: no new critical auth findings ✅

---

## Manual still required before marketing launch

1. Google sign-in on `https://www.mdeai.co/login` — confirm PKCE exchange + no `?code=` stuck on `/`
2. Magic-link flow on production — confirm email arrives and `/auth/callback` exchanges to session
3. Signed-in concierge message → check `ai_runs.user_id` is populated
4. **Set `COPILOTKIT_API_KEY` on Vercel** before marketing (prevents unauthenticated cross-origin cost drain)

---

## Verdict

| Gate | Status |
|------|--------|
| Supabase + Vercel auth wiring | ✅ **Done** (both URL configs + env vars) |
| Service-role isolation | ✅ **Done** (F13 audit clean) |
| Protected-route guards | ✅ **Done** (30/30 e2e across 3 browsers) |
| Floor (604 tests) | ✅ **Done** (storage tests fixed) |
| RLS security score | ✅ **95/100** |
| Production HTTP smoke | ✅ **/login 200 · /trips 307** |
| Live OAuth smoke | ⏳ **Manual only** (real inbox / Google consent) |
| `COPILOTKIT_API_KEY` gate | ⚠️ **Recommendation** — set before marketing |
| auth advisors | ✅ No new CRITICAL |

**AUTH-011 is done for automated/code checks. Manual production OAuth smoke and `COPILOTKIT_API_KEY` are the two outstanding pre-launch items.**
