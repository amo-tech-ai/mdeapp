# ADK Grounding — production readiness audit (mdeapp + Vercel)

**Auditor:** Cursor agent  
**Date:** 2026-05-25  
**App:** `/home/sk/mdeai/mdeapp`  
**Sidecar:** `/home/sk/mdeai/services/adk-grounding`  
**Task spec:** MAP-002 (marked Done in `tasks/maps/`) — **code shipped; production wiring not complete**

**Verdict:** **Local/dev ADK is correct. Production ADK on Vercel is not set up yet.**

> **Update 2026-05-25:** Canonical production path is **Google Cloud Run** — see [`tasks/ADK/docs/12-cloud-run-production-plan.md`](../ADK/docs/12-cloud-run-production-plan.md). VPS+Caddy in §3 target remains a valid fallback but is **superseded** for new work.

---

## 1. Was it completed correctly?

| Layer | Completed? | Evidence |
|-------|------------|----------|
| **Mastra HTTP client + fail-closed** | ✅ Yes | `adk-grounding-client.ts`, unit tests |
| **Grounding tool + quota** | ✅ Yes | `search-grounded-places.ts`, `grounding-quota.ts` |
| **Python sidecar (FastAPI)** | ✅ Yes | `main.py`, `/health`, `/v1/grounding/invoke` |
| **CopilotKit Pattern 1** | ✅ Yes | `getLocalAgentsWithLogging` — Mastra in-process, not HttpAgent→ADK |
| **No client-side ADK URL** | ✅ Yes | Only `ADK_GROUNDING_URL` (server env), no `NEXT_PUBLIC_*` |
| **Vercel `ADK_GROUNDING_URL` (HTTPS)** | ❌ No | `vercel env ls` — variable **absent** |
| **Prod without localhost** | ❌ No | Missing env → defaults to `http://localhost:8000` on Vercel (unreachable) |
| **Sidecar HTTPS + auth** | ❌ No | Contract says “JWT/mTLS TBD”; `/health` open |
| **Retries** | ⚠️ Partial | 30s timeout only; **no retry/backoff** |
| **Monitoring** | ⚠️ Partial | `console.warn` on quota; no structured ADK metrics |

**One-line:** MAP-002 **implementation** is solid for dev; **production deployment** of the sidecar + Vercel env was **not** finished.

---

## 2. Readiness score

| Dimension | Score | Notes |
|-----------|------:|-------|
| Code architecture (Mastra ↔ ADK) | **88** | Correct separation; Zod; fail-closed |
| Local dev | **90** | ADK `:8000` health 200; `.env.local` has `ADK_GROUNDING_URL=http://localhost:8000` |
| Production sidecar hosting | **15** | No public HTTPS service |
| Vercel integration | **20** | No `ADK_GROUNDING_URL`; serverless cannot run Python sidecar in same project |
| Security (auth, network) | **45** | Server-only env OK; sidecar has no auth |
| Quota / cost control | **75** | `grounding_quota_log` + daily cap 200; fail-open on DB errors |
| Observability | **40** | Metadata reasons only |
| CopilotKit / Mastra Pattern 1 | **90** | Unchanged and correct |
| **Overall production ADK** | **42/100** | |
| **Overall after recommended VPS deploy** | **~78/100** (est.) | |

---

## 3. Architecture review (current vs target)

### Current (what you have today)

```text
Browser (www.mdeai.co)
  → POST /api/copilotkit (Next.js on Vercel)
  → Mastra conciergeAgent (in-process, Pattern 1)
  → search-grounded-places tool
       → incrementAndCheckGroundingQuota() [Supabase SR]
       → invokeAdkGrounding()
            → fetch(ADK_GROUNDING_URL || http://localhost:8000)/v1/grounding/invoke
```

**On Vercel today:** `ADK_GROUNDING_URL` unset → fetch hits **localhost:8000** inside the lambda → fails fast → tool returns `{ results: [], metadata: { reason: "adk_unavailable" } }` → **chat does not crash** (good).

**On localhost:** sidecar on `:8000` → grounding works when ADK process is running.

### Target (production-ready)

```text
Browser
  → Vercel (mdeapp) — ADK_GROUNDING_URL=https://adk.mdeai.co
  → HTTPS only, server-only env
  → optional: X-Internal-Token header (shared secret)

VPS / Cloud Run (services/adk-grounding)
  → Caddy TLS termination
  → FastAPI :8000 (private)
  → Grounding Lite MCP (mapstools.googleapis.com) with GOOGLE_MAPS_SERVER_API_KEY
  → optional Gemini maps fallback (GOOGLE_GENERATIVE_AI_API_KEY on sidecar only)
```

**Invariant (keep):** CopilotKit **never** talks to ADK directly. Only Mastra does.

---

## 4. Code audit (verified on disk)

### `src/mastra/lib/adk-grounding-client.ts`

| Check | Status |
|-------|--------|
| Server-only (`process.env.ADK_GROUNDING_URL`) | ✅ |
| Default `localhost:8000` | ✅ dev; ❌ **dangerous on Vercel if env missing** |
| 30s `AbortController` timeout | ✅ |
| Non-OK HTTP → `metadata.reason: adk_unavailable` | ✅ |
| Network error → same fail-closed | ✅ |
| Retries | ❌ none |
| Auth header | ❌ none |
| Zod parse response | ✅ |

### `src/mastra/tools/search-grounded-places.ts`

| Check | Status |
|-------|--------|
| Quota before ADK call | ✅ |
| Empty results + metadata on ADK failure | ✅ |
| Does not throw to agent | ✅ (agent can still reply) |
| Attribution in output | ✅ |

### `src/mastra/lib/grounding-quota.ts`

| Check | Status |
|-------|--------|
| Uses **service role** (server only) | ✅ |
| Default cap 200/day | ✅ |
| `MAPS_GROUNDING_DAILY_LIMIT=0` disables | ✅ |
| DB read/write failure → **allow** (fail-open) | ⚠️ cost risk; intentional for availability |

### `services/adk-grounding/main.py`

| Check | Status |
|-------|--------|
| `GET /health` | ✅ |
| `POST /v1/grounding/invoke` | ✅ |
| MCP + Gemini fallback on 403 referrer | ✅ dev-friendly |
| `compute_routes` stub | ✅ returns metadata reason |
| No auth on endpoints | ❌ prod gap |

### CopilotKit route

| Check | Status |
|-------|--------|
| `ExperimentalEmptyAdapter` + `getLocalAgentsWithLogging` | ✅ Pattern 1 |
| No `HttpAgent` to ADK | ✅ |

### Client exposure

| Variable | In browser bundle? |
|----------|-------------------|
| `ADK_GROUNDING_URL` | ❌ No `NEXT_PUBLIC_` — **safe** |
| Maps keys | `NEXT_PUBLIC_GOOGLE_MAPS_*` only — correct split |

---

## 5. Blockers (production)

| # | Blocker | Impact |
|---|---------|--------|
| 1 | **No HTTPS ADK host** | Tourist/Camila grounded place search empty on prod |
| 2 | **`ADK_GROUNDING_URL` not on Vercel** | Implicit localhost on every serverless invocation |
| 3 | **No sidecar auth** | Anyone who discovers URL can invoke (cost/abuse) |
| 4 | **`GOOGLE_MAPS_SERVER_API_KEY` on sidecar** | Browser-restricted Maps key → MCP 403; relies on Gemini fallback |
| 5 | **No deploy artifact for sidecar** | No Dockerfile/systemd in repo yet (only `run-dev.sh`) |
| 6 | **No prod smoke in CI** | `verify:grounding` assumes localhost |

---

## 6. Recommended production approach (ranked)

**Recommendation: Docker on existing Hostinger VPS + Caddy HTTPS**

| Option | Reliability | Ops complexity | Cost | Time to prod | Fit for mdeai |
|--------|-------------|----------------|------|--------------|---------------|
| **Hostinger VPS + Docker + Caddy** | High | Low–medium | ~$0 marginal (VPS already paid) | **1–2 days** | **Best** — you already use this VPS for OpenClaw/Hermes |
| **Google Cloud Run** | High | Medium | Pay per request | 1–2 days | Good if you want GCP-native + IAM |
| **Fly.io** | High | Low | ~$5–15/mo | Hours–1 day | Simple; second platform to manage |
| **Railway / Render** | Medium | Low | ~$7–25/mo | Hours–1 day | Fine for MVP; another vendor |
| **Vercel only** | ❌ | — | — | — | **Cannot** run Python ADK sidecar in Next.js project |
| **ADK in same Vercel function** | ❌ | — | — | — | Wrong runtime (Python + long MCP calls) |

**Why not Vercel for ADK:** Vercel runs Next.js/Mastra. The sidecar is **FastAPI + MCP** — must be a **separate always-on or min-instances HTTP service** that Vercel calls over the public internet (or private network if you add VPC later).

**Suggested hostname:** `https://adk.mdeai.co` (or `https://grounding.mdeai.co`)

---

## 7. Deployment plan (no auto-deploy)

### Phase A — Sidecar image + VPS (day 1)

1. Add `services/adk-grounding/Dockerfile` + `docker-compose.yml` (see §10).
2. On VPS: pull repo, set env file with **server** keys only.
3. `docker compose up -d` → listen `127.0.0.1:8000`.
4. Caddy: TLS → reverse_proxy to `:8000`.
5. Smoke: `curl https://adk.mdeai.co/health`.

### Phase B — Secure edge (day 1)

1. Generate `ADK_INTERNAL_TOKEN` (32+ bytes random).
2. Sidecar: require `Authorization: Bearer <token>` on `/v1/grounding/invoke` (not `/health`).
3. Mastra client: send same header when `ADK_INTERNAL_TOKEN` set on Vercel.
4. Firewall: optional allowlist Vercel egress IPs (fragile) — token is minimum.

### Phase C — Vercel env (day 1)

```bash
cd /home/sk/mdeai/mdeapp
vercel env add ADK_GROUNDING_URL production --value 'https://adk.mdeai.co' --yes
vercel env add ADK_GROUNDING_URL preview --value 'https://adk.mdeai.co' --yes
# Sidecar-only (set on VPS, NOT Vercel):
# GOOGLE_MAPS_SERVER_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY (fallback)
vercel --prod --yes   # when operator approves
```

### Phase D — Verify (day 2)

- Prod chat: “quiet cafés near Laureles” → pins + `grounding-attribution` UI.
- Supabase: `grounding_quota_log` row increments.
- Vercel logs: no `ECONNREFUSED localhost:8000`.

---

## 8. Exact env vars

### Vercel (`mdeapp`) — server only

| Variable | Example | Required |
|----------|---------|----------|
| `ADK_GROUNDING_URL` | `https://adk.mdeai.co` | **Yes** — no trailing slash |
| `ADK_INTERNAL_TOKEN` | `<random>` | **Recommended** (must match sidecar) |
| `SUPABASE_URL` | `https://zkwcbyxiwklihegjhuql.supabase.co` | Quota |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_…` | Quota only — never `NEXT_PUBLIC_` |
| `MAPS_GROUNDING_DAILY_LIMIT` | `200` | Optional override |
| `GOOGLE_GENERATIVE_AI_API_KEY` | `AIza…` | Mastra agents (already set) |

**Do not set on Vercel:** `GOOGLE_MAPS_SERVER_API_KEY` (belongs on sidecar only).

### VPS sidecar (`/etc/mdeai/adk-grounding.env`)

| Variable | Purpose |
|----------|---------|
| `GOOGLE_MAPS_SERVER_API_KEY` | Grounding Lite MCP (IP-restricted, Maps Tools API enabled) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Fallback `googleMaps` grounding |
| `GEMINI_GROUNDING_MODEL` | Optional, default `gemini-3.5-flash` |
| `ADK_GROUNDING_PORT` | `8000` |
| `ADK_INTERNAL_TOKEN` | Match Vercel |

### Local (`mdeapp/.env.local`)

```env
ADK_GROUNDING_URL=http://localhost:8000
# optional after Phase B:
# ADK_INTERNAL_TOKEN=dev-only-token
```

---

## 9. Caddy example

```caddyfile
# /etc/caddy/Caddyfile snippet
adk.mdeai.co {
  encode gzip
  reverse_proxy 127.0.0.1:8000
}
```

Reload: `sudo systemctl reload caddy`

---

## 10. Docker / systemd

### `services/adk-grounding/Dockerfile` (to add)

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml grounding_mcp.py gemini_maps_grounding.py main.py ./
RUN pip install --no-cache-dir fastapi uvicorn httpx pydantic python-dotenv google-genai
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### `docker-compose.yml` (VPS)

```yaml
services:
  adk-grounding:
    build: ./services/adk-grounding
    restart: unless-stopped
    env_file: /etc/mdeai/adk-grounding.env
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:8000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```

### systemd (alternative to Docker)

```ini
# /etc/systemd/system/mdeai-adk-grounding.service
[Unit]
Description=mdeai ADK Grounding sidecar
After=network.target

[Service]
Type=simple
User=mdeai
WorkingDirectory=/home/sk/mdeai/services/adk-grounding
EnvironmentFile=/etc/mdeai/adk-grounding.env
ExecStart=/home/sk/mdeai/services/adk-grounding/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

---

## 11. Production fallback strategy (already in code — keep)

| Failure | Behavior | Chat blocked? |
|---------|----------|---------------|
| ADK down / timeout | `metadata.reason: adk_unavailable`, empty pins | **No** |
| Quota exceeded | `metadata.reason: quota` | **No** |
| MCP 403 referrer | Sidecar tries Gemini maps fallback | **No** |
| All fail | Empty results + metadata | **No** |

**Optional hardening (future):** one retry with 500ms backoff on `adk_unavailable` only (not on quota).

---

## 12. Smoke tests

### Local

```bash
curl -s http://localhost:8000/health
cd /home/sk/mdeai/mdeapp && npm run verify:grounding
cd /home/sk/mdeai/mdeapp && npm run smoke:grounding-attribution
```

### After VPS + Vercel

```bash
curl -sS https://adk.mdeai.co/health
curl -sS -X POST https://adk.mdeai.co/v1/grounding/invoke \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADK_INTERNAL_TOKEN" \
  -d '{"tool":"search_grounded_places","query":"cafés Laureles","pageSize":3}' \
  | head -c 400

# Prod UI: signed-in message on www.mdeai.co → map pins for place query
```

---

## 13. Production checklist

- [ ] `GOOGLE_MAPS_SERVER_API_KEY` created (server/IP, Grounding Lite enabled)
- [ ] Sidecar running on VPS with Docker or systemd
- [ ] HTTPS via Caddy (`adk.mdeai.co`)
- [ ] `ADK_INTERNAL_TOKEN` on VPS + Vercel
- [ ] `ADK_GROUNDING_URL=https://adk.mdeai.co` on Vercel Production + Preview
- [ ] Redeploy mdeapp
- [ ] DNS A/AAAA for `adk.mdeai.co` → VPS
- [ ] Firewall: 443 public; 8000 localhost only
- [ ] Smoke §12 passes
- [ ] `grounding_quota_log` increments on prod query
- [ ] Document in `tasks/notes/MAP-002-prod-evidence.md`

---

## 14. Go / no-go

| Gate | Verdict |
|------|---------|
| **MAP-002 code (dev)** | **GO** |
| **ADK production on Vercel** | **NO-GO** until §7–13 complete |
| **Public marketing “grounded map search”** | **NO-GO** until smoke passes on `www.mdeai.co` |
| **Chat without grounding** | **GO** (fail-closed; rentals/events Supabase tools still work) |

---

## 15. Code changes suggested (post-audit, not applied)

1. `adk-grounding-client.ts` — fail build or warn if `NODE_ENV=production` && `ADK_GROUNDING_URL` includes `localhost`.
2. Sidecar `main.py` — optional Bearer check on invoke.
3. `Dockerfile` + compose in `services/adk-grounding/`.
4. `check:mastra.mjs` — assert `ADK_GROUNDING_URL` not localhost when `CI_PRODUCTION=1`.

---

## 16. References

- `plan/ADK/sidecar-api-contract.md`
- `tasks/maps/MAP-002-grounding-attribution.md`
- `.cursor/MCP-GOOGLE-MAPS.md` (Code Assist ≠ prod runtime)
- [Grounding Lite MCP](https://developers.google.com/maps/ai/grounding-lite)
- [Maps Code Assist](https://developers.google.com/maps/ai/code-assist) (dev/docs only)

**End of audit. No deploy performed.**
