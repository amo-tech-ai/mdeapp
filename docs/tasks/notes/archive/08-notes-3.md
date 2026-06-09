Exact operator runbook — **correct URLs and values** for mdeai AUTH-011. Items marked ✅ are already done; don’t redo unless you’re verifying.

---

## 1. Canonical IDs (use these everywhere)

| Item | Value |
|------|--------|
| Supabase project | `zkwcbyxiwklihegjhuql` |
| Supabase URL | `https://zkwcbyxiwklihegjhuql.supabase.co` |
| Vercel project | `amo100/mdeapp` |
| Production app | `https://www.mdeai.co` |
| Preview app | `https://mdeapp-git-main-amo100.vercel.app` |
| Local dev UI | `http://localhost:3001` |

---

## 2. Supabase Auth (dashboard)

**Open:** https://supabase.com/dashboard/project/zkwcbyxiwklihegjhuql/auth/url-configuration

### Site URL (single line)

```text
https://www.mdeai.co
```

### Redirect URLs (one per line — exact paths)

```text
http://localhost:3001/auth/callback
http://localhost:3000/auth/callback
https://www.mdeai.co/auth/callback
https://mdeai.co/auth/callback
https://mdeapp-git-main-amo100.vercel.app/auth/callback
https://mdeapp.vercel.app/auth/callback
```

✅ Already applied via API; confirm they still appear in the dashboard.

### Providers

**Open:** https://supabase.com/dashboard/project/zkwcbyxiwklihegjhuql/auth/providers

- **Google:** Enabled, Client ID + secret from GCP  
- **Email:** Magic link enabled  

**GCP OAuth client (Web application):**

- **Authorized JavaScript origins:**  
  `http://localhost:3001`  
  `https://www.mdeai.co`  
  `https://mdeai.co`
- **Authorized redirect URI (only this Supabase callback):**  
  `https://zkwcbyxiwklihegjhuql.supabase.co/auth/v1/callback`

### Re-apply from CLI (optional)

```bash
cd /home/sk/mdeai/mdeapp
npm run auth:configure-supabase
```

Uses `PERSONAL_ACCESS_TOKEN` from `/home/sk/mdeai/.env.local` (or set `SUPABASE_ACCESS_TOKEN` yourself).

---

## 3. Vercel env (dashboard — safest for `NEXT_PUBLIC_*`)

**Open:** https://vercel.com/amo100/mdeapp/settings/environment-variables

### ✅ Already set (verify only)

| Name | Production value | Preview value |
|------|------------------|---------------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.mdeai.co` | `https://mdeapp-git-main-amo100.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zkwcbyxiwklihegjhuql.supabase.co` | same |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | your `sb_publishable_…` | same |
| `GOOGLE_GENERATIVE_AI_API_KEY` | set | set |
| `DATABASE_URL` | pooler URL (Mastra) | same |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | set | set |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | set | set |

**Do not** put `SUPABASE_SERVICE_ROLE_KEY` in any `NEXT_PUBLIC_*` variable.

### ❌ Still required — `ADK_GROUNDING_URL`

**Production + Preview** (same value when you have a host):

```text
https://<YOUR-ADK-HOST>
```

Examples (pick what you actually deploy — **not** `http://localhost:8000`):

- VPS: `https://adk.mdeai.co` (after you expose port 8000 behind HTTPS)
- Internal: whatever URL returns `GET /health` → 200

**Dashboard:** Add variable → name `ADK_GROUNDING_URL` → check **Production** and **Preview** → paste HTTPS base **without** trailing slash.

**CLI (use `--value`, not pipe — pipe saved empty strings before):**

```bash
cd /home/sk/mdeai/mdeapp
vercel env add ADK_GROUNDING_URL production --value 'https://YOUR-ADK-HOST' --yes
vercel env add ADK_GROUNDING_URL preview --value 'https://YOUR-ADK-HOST' --yes
```

### Optional — CopilotKit hardening

Only if you use CopilotKit Cloud; same-origin chat works without these:

| Name | Scope | Value |
|------|--------|--------|
| `COPILOTKIT_API_KEY` | Production | `ck_…` (server secret) |
| `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY` | Production | `ck_pub_…` |

**Must unset on Production:** `E2E_BYPASS_AUTH`

---

## 4. Redeploy after env changes

```bash
cd /home/sk/mdeai/mdeapp
vercel --prod --yes
```

Or Vercel → **Deployments** → latest → **⋯** → **Redeploy**.

Preview redeploys on the next push to `main` (or redeploy that deployment manually).

---

## 5. Production smoke (copy-paste)

```bash
# Anonymous routes
curl -sI https://www.mdeai.co/login | head -1          # expect HTTP/2 200
curl -sI https://www.mdeai.co/trips | grep -i location # expect /login?next=%2Ftrips
curl -sI 'https://www.mdeai.co/?code=TEST' | grep -i location  # expect /auth/callback?code=TEST

# CopilotKit up (400 on empty body is OK)
curl -sS -o /dev/null -w '%{http_code}\n' -X POST https://www.mdeai.co/api/copilotkit \
  -H 'Content-Type: application/json' -d '{}'
```

### Browser (manual)

1. Open https://www.mdeai.co/login  
2. **Continue with Google** → must land on `/auth/callback` or `/trips` (or `next=` target), **not** `https://www.mdeai.co/?code=…` stuck on home  
3. Logged out: https://www.mdeai.co/trips → https://www.mdeai.co/login?next=%2Ftrips  
4. Logged in: send one chat message on `/` → in Supabase SQL editor:

```sql
select id, user_id, created_at
from ai_runs
order by created_at desc
limit 5;
```

`user_id` must be non-null for your test user.

---

## 6. Preview URL (if you use it)

**URL:** https://mdeapp-git-main-amo100.vercel.app  

If you get **401** + Vercel login page → **Deployment Protection** is on. Either:

- Log in with Vercel team access, or  
- Vercel → Project → **Settings** → **Deployment Protection** → allow your QA path  

Then repeat §5 smoke on the preview host (replace `www.mdeai.co` with `mdeapp-git-main-amo100.vercel.app`).

---

## 7. Local dev (your machine)

In `mdeapp/.env.local` (not committed):

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://zkwcbyxiwklihegjhuql.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your publishable key>
ADK_GROUNDING_URL=http://localhost:8000
```

Run ADK locally:

```bash
/home/sk/mdeai/services/adk-grounding/run-dev.sh
```

Run app:

```bash
cd /home/sk/mdeai/mdeapp
npm run dev
# UI: http://localhost:3001
```

---

## 8. Local QA gates

```bash
cd /home/sk/mdeai/mdeapp
npm run floor
npm run verify:supabase
npx playwright test e2e/screens/SCREEN-011-saved.spec.ts e2e/screens/SCREEN-012-trips.spec.ts e2e/screens/SCREEN-016-host-wizard.spec.ts --project=chromium
```

---

## 9. What’s left before public login marketing

| Step | Status |
|------|--------|
| Supabase Site URL + redirects | ✅ |
| Vercel `NEXT_PUBLIC_SITE_URL` prod + preview | ✅ |
| Vercel redeploy prod | ✅ |
| `ADK_GROUNDING_URL` HTTPS on Vercel | ❌ **you** |
| Live Google sign-in on www | ❌ **you** |
| `ai_runs.user_id` after chat | ❌ **you** |

---

If you meant “correct” for a **specific** step (ADK host only, GCP only, preview SSO, etc.), say which one and we can narrow to a single checklist.