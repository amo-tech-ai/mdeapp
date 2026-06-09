# ADK Cloud Run — production evidence & checklist (2026-05-25)

**Plan:** [`tasks/ADK/docs/12-cloud-run-production-plan.md`](../ADK/docs/12-cloud-run-production-plan.md)  
**Operator notes:** [`tasks/ADK/adk-notes.md`](../ADK/adk-notes.md)

## Verdict

| Scope | Status | Score |
|-------|--------|------:|
| **Infrastructure (Cloud Run + secrets + Vercel env)** | ✅ Shipped | 100% |
| **REST sidecar (direct invoke)** | ✅ Working | 100% |
| **Prod chat E2E (www → pins)** | ✅ **Verified 2026-05-25** | 100% |
| **Phase 1 ADK-CR pack (CR-00–CR-06 required)** | **✅ Done** | **100%** |

**Go/no-go for grounded maps on www:** **YES** — Chrome DevTools browser smoke on `https://www.mdeai.co/` returned **5 grounded cards**, **6 map pins**, **grounding attribution** visible, **0 console errors**.

---

## Task checklist

| ID | Task | Status | Verified |
|----|------|--------|----------|
| ADK-CR-00 | GCP prereqs (`dev-inscriber-445714-k0`, APIs) | **Done** | Cloud Run, Artifact Registry, Secret Manager, Cloud Build enabled |
| ADK-CR-01 | Dockerfile + `.dockerignore` | **Done** | [`ADK-CR-01-02-evidence.md`](./ADK-CR-01-02-evidence.md) |
| ADK-CR-02 | Bearer auth (sidecar + Mastra client) | **Done** | 4 Vitest + `test_invoke_auth.py` (needs `.venv`) |
| ADK-CR-03 | Secret Manager (3 secrets) | **Done** | `GOOGLE_MAPS_SERVER_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `ADK_INTERNAL_TOKEN` (v2 synced 2026-05-25) |
| ADK-CR-04 | Cloud Run deploy + direct smoke | **Done** | Revision `mdeai-adk-grounding-00005-4bf`, region `us-east1` |
| ADK-CR-05 | Vercel env + prod redeploy | **Done** | `ADK_GROUNDING_URL` + `ADK_INTERNAL_TOKEN` on Production + Preview; deploy `dpl_2AwCPZCWMHpRvrrDLB7fiL9jVDzq` |
| ADK-CR-06 | E2E evidence + prod checklist | **Done** | Chrome DevTools · www · grounded cards ✅ (rev 00005) |
| ADK-CR-07 | Custom domain `adk.mdeai.co` | Optional | Not started |
| ADK-CR-08 | Cloud Monitoring alerts | Optional | Not started |

---

## Production URLs & IDs

| Item | Value |
|------|--------|
| Canonical Cloud Run URL | `https://mdeai-adk-grounding-600700470346.us-east1.run.app` |
| GCP project | `dev-inscriber-445714-k0` (number `600700470346`) |
| Service | `mdeai-adk-grounding` · revision `mdeai-adk-grounding-00005-4bf` |
| Vercel prod alias | `https://www.mdeai.co` |
| Vercel deployment | `dpl_2AwCPZCWMHpRvrrDLB7fiL9jVDzq` (2026-05-25) |

---

## Verification run (2026-05-25)

### Cloud Run REST

```bash
# Public health
curl -sS https://mdeai-adk-grounding-600700470346.us-east1.run.app/health
# → {"status":"ok"}  HTTP 200

# Invoke without Bearer → 401 missing_bearer_token ✅

# Invoke with Bearer (matches Secret Manager v2 + Vercel)
curl -sS -X POST https://mdeai-adk-grounding-600700470346.us-east1.run.app/v1/grounding/invoke \
  -H "Authorization: Bearer $ADK_INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tool":"search_grounded_places","query":"quiet cafés Laureles Medellín","pageSize":3}'
# → HTTP 200 · metadata.source=grounding-lite · pins≥1
```

**Recorded result:** `source: grounding-lite`, **5 pins**, Laureles coordinates (~6.24, -75.59).

### Vercel

```bash
cd mdeapp && vercel env ls | rg -i ADK
# ADK_GROUNDING_URL     Production + Preview
# ADK_INTERNAL_TOKEN    Production + Preview
```

### Unit tests

```text
mdeapp: npm test -- src/mastra/lib/adk-grounding-client.test.ts → 4/4 passed
```

### Prod browser E2E (CR-06) — 2026-05-25

**Tool:** `chrome-devtools` CLI (Chrome DevTools MCP profile)  
**URL:** `https://www.mdeai.co/` (anonymous — no sign-in required on home chat)  
**Query:** `Quiet cafés near Laureles`

| Check | Result |
|-------|--------|
| Grounded cards (`data-testid=grounded-card`) | **5** |
| Map pins (`data-testid=map-pin`) | **6** |
| Grounding attribution visible | ✅ |
| Console errors | **0** |
| Screenshot | `mdeapp/tmp/adk-cr06-www-grounding-20260525.png` |

```bash
# Re-run (chrome-devtools CLI)
chrome-devtools navigate_page --type url --url https://www.mdeai.co/
# fill chat → Send → evaluate_script for data-testid counts
```

---

## Remaining (optional / hygiene)

- [ ] **Update `verify-grounding-invoke.mjs`:** Send `Authorization: Bearer` when `ADK_INTERNAL_TOKEN` is set (script 401s against prod sidecar).
- [ ] **Rotate `ADK_INTERNAL_TOKEN`:** Token was pasted in chat logs; add v3 in Secret Manager + Vercel + roll Cloud Run revision.
- [ ] **Pin titles:** MCP returns generic `"Place"` — improve field mapping in `grounding_mcp.py` (cosmetic).
- [ ] **Optional:** ADK-CR-07 custom domain, ADK-CR-08 monitoring.
- [ ] **Refresh audit:** [`tasks/audit/30-adk-grounding-production-audit.md`](../audit/30-adk-grounding-production-audit.md) (stale pre-CR-04).

---

## Incident log (2026-05-25)

1. **First deploy failed** — Cloud Run SA lacked `secretmanager.secretAccessor` on three secrets → fixed IAM bindings.
2. **Vercel `ADK_GROUNDING_URL` mismatch** — Short URL vs canonical; updated to `600700470346.us-east1.run.app`.
3. **Token mismatch** — Secret Manager v1 ≠ `.env.local`/Vercel → invoke `401 invalid_bearer_token` → added secret **v2** + revision `00003-mpg` → invoke 200 + pins.

---

## Quick re-verify (operator)

```bash
gcloud config set project dev-inscriber-445714-k0
gcloud run services describe mdeai-adk-grounding --region=us-east1 --format='value(status.url,status.latestReadyRevisionName)'

URL=https://mdeai-adk-grounding-600700470346.us-east1.run.app
TOKEN=$(gcloud secrets versions access latest --secret=ADK_INTERNAL_TOKEN)
curl -sS "$URL/health"
curl -sS -X POST "$URL/v1/grounding/invoke" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"tool":"search_grounded_places","query":"cafés Laureles","pageSize":2}' \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print(len(d.get('pins',[])),d.get('metadata',{}).get('source'))"
```
