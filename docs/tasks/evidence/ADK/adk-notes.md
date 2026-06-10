# ADK + Maps grounding — plain-English notes (mdeai)

> **Who this is for:** you, Sofía, or anyone wiring prod.  
> **Deep docs:** [`docs/12-cloud-run-production-plan.md`](docs/12-cloud-run-production-plan.md) · [`docs/14-cloud-run-reference.md`](docs/14-cloud-run-reference.md) · [`docs/13-copilotkit-adk-vs-mdeai.md`](docs/13-copilotkit-adk-vs-mdeai.md) · [`INDEX.md`](INDEX.md)

---

## One sentence

**Camila’s chat runs on Mastra (Vercel). When she asks for real cafés on the map, Mastra calls a small Python service on Google Cloud Run that talks to Google Maps — not the other way around.**

---

## What “ADK” means here (and what it does *not* mean)

| Term | In mdeai Phase 1 |
|------|------------------|
| **Google ADK** (Agent Development Kit) | Google’s toolkit for building full conversational agents in Python. |
| **Our “ADK grounding” service** | A **thin FastAPI sidecar** in `services/adk-grounding/` — only does **Maps search**, returns JSON pins. It is **not** a full ADK chat agent. |
| **CopilotKit “Google ADK” docs** | Show wiring chat **directly** to a Python ADK brain (`HttpAgent` → port 8000). **We do not use that pattern.** See [`docs/13-copilotkit-adk-vs-mdeai.md`](docs/13-copilotkit-adk-vs-mdeai.md). |

**Rule:** Mastra owns the conversation. The sidecar owns **Google Maps truth** (place IDs, coordinates, Maps links).

---

## Who talks to whom (Camila on `/`)

```text
Browser (CopilotKit sidebar)
    ↓
Vercel — Next.js `/api/copilotkit`
    ↓
Mastra `conciergeAgent` (Gemini, tools, Supabase quota)
    ↓  only when the tool needs real places
HTTP POST → ADK grounding sidecar (Cloud Run)
    ↓
Google Grounding Lite MCP (+ Gemini fallback if MCP key wrong)
    ↓
Pins back to Mastra → map cards in the UI
```

**Roberto** (`/host/event/new`) uses the same stack later for venue search; today the hero path is Camila + concierge.

---

## Where the code lives

| Piece | Folder / file | Job |
|-------|----------------|-----|
| Chat UI | `mdeapp/src/app/page.tsx`, `GeoChatShell` | CopilotKit + map column |
| Runtime bridge | `mdeapp/src/app/api/copilotkit/route.ts` | `getLocalAgentsWithLogging` → **Mastra in-process** |
| Grounding tool | `mdeapp/src/mastra/tools/search-grounded-places.ts` | Calls sidecar, fail-closed if down |
| HTTP client | `mdeapp/src/mastra/lib/adk-grounding-client.ts` | `ADK_GROUNDING_URL` + optional Bearer |
| Python sidecar | `services/adk-grounding/main.py` | `/health`, `/v1/grounding/invoke` |
| Deploy | `services/adk-grounding/scripts/deploy-cloud-run.sh` | Build image → Cloud Run |

---

## Environment variables (simple)

### On Vercel (`mdeapp`)

| Variable | What it does |
|----------|----------------|
| `ADK_GROUNDING_URL` | HTTPS URL of the Cloud Run service (`https://mdeai-adk-grounding-600700470346.us-east1.run.app`). |
| `ADK_INTERNAL_TOKEN` | Shared secret; Mastra sends `Authorization: Bearer …` to the sidecar. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini for **Mastra agents** (chat reasoning). |
| Browser Maps key (`NEXT_PUBLIC_GOOGLE_MAPS_*`) | **Only** for the map widget in the browser — **not** for the sidecar. |

### On Cloud Run (sidecar only)

| Variable | What it does |
|----------|----------------|
| `GOOGLE_MAPS_API_KEY` | Set from secret `GOOGLE_MAPS_SERVER_API_KEY` — **server** key, no browser referrer restriction. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Fallback if MCP returns 403 (wrong key type). |
| `ADK_INTERNAL_TOKEN` | If set, `/v1/grounding/invoke` requires Bearer; `/health` stays public. |
| `PORT` | Cloud Run sets **8080**; container listens on `0.0.0.0`. |

**Local dev:** `ADK_GROUNDING_URL=http://localhost:8000`, leave `ADK_INTERNAL_TOKEN` empty, run sidecar with `services/adk-grounding/run-dev.sh` or uvicorn.

---

## Two API keys for Maps (do not mix them up)

| Key type | Example env | Used where | Restriction |
|----------|-------------|------------|-------------|
| **Browser** | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | vis.gl map on `/` | HTTP referrer (localhost, www.mdeai.co) |
| **Server** | `GOOGLE_MAPS_SERVER_API_KEY` | Cloud Run sidecar, MCP | IP unrestricted or server apps — **required for grounding** |

If the server key is missing, the sidecar may fall back to Gemini maps grounding (slower, different path).

---

## Security (MVP)

| Layer | Choice |
|-------|--------|
| Cloud Run | `--allow-unauthenticated` so `/health` works and Vercel can call HTTPS without Google IAM gymnastics |
| Invoke endpoint | **Bearer token** when `ADK_INTERNAL_TOKEN` is set (ADK-CR-02 ✅) |
| Later | Cloud Run IAM / Workload Identity for Vercel — optional hardening |

Generate token: `openssl rand -base64 32` — same value in Secret Manager + Vercel.

---

## GCP project

| Field | Value |
|-------|--------|
| Project ID | `dev-inscriber-445714-k0` |
| Project number | `600700470346` |
| Display name | mdeapp |

```bash
gcloud config set project dev-inscriber-445714-k0
```

**Region:** plan recommends `us-east1` (near Supabase pooler). Console may show `europe-west1` — either works; pick one and stick to it.

---

## What’s done vs what’s left

| Step | Status | You do |
|------|--------|--------|
| MAP-002 code (Mastra ↔ sidecar) | ✅ Done | — |
| Dockerfile + Bearer (CR-01, CR-02) | ✅ Done | [`../notes/ADK-CR-01-02-evidence.md`](../notes/ADK-CR-01-02-evidence.md) |
| Secret Manager (CR-03) | ✅ Done | 3 secrets + token v2 synced 2026-05-25 |
| Cloud Run deploy (CR-04) | ✅ Done | Rev `mdeai-adk-grounding-00003-mpg` · REST smoke OK |
| Vercel env + redeploy (CR-05) | ✅ Done | Both vars on Production + Preview · `dpl_2AwCPZCWMHpRvrrDLB7fiL9jVDzq` |
| Prod chat E2E (CR-06) | ✅ Done | Chrome DevTools · 5 cards · 6 pins · [`ADK-CR-evidence.md`](../notes/ADK-CR-evidence.md) |
| `verify:grounding` script Bearer | ⏳ | Script 401s prod until updated |
| Token rotation (security) | ⏳ | Token was in chat logs — rotate when convenient |
| Optional domain / monitoring (CR-07–08) | — | Not started |

**Prod grounded maps go/no-go:** **YES** — CR-00–CR-06 complete. Optional: CR-07 domain, CR-08 monitoring, token rotation.

---

## Quick checks

```bash
# Local sidecar health
curl http://localhost:8000/health

# Local grounding (no Bearer if ADK_INTERNAL_TOKEN unset)
cd mdeapp && npm run verify:grounding

# Docker image
docker build -t mdeai-adk-grounding:test services/adk-grounding

# Unit tests
cd mdeapp && npm test -- src/mastra/lib/adk-grounding-client.test.ts
cd services/adk-grounding && .venv/bin/python test_invoke_auth.py
```

After deploy:

```bash
curl https://YOUR-RUN-URL/health
# invoke needs Bearer if ADK_INTERNAL_TOKEN set on Cloud Run
```

---

## Common confusion

| Question | Answer |
|----------|--------|
| Should we copy CopilotKit `integrations/adk`? | **No** — that makes ADK the chat brain. We use `integrations/mastra`. |
| Should we use `adk deploy cloud_run` with `root_agent`? | **Later / optional** — different app shape. We deploy our **FastAPI** image with `gcloud run deploy`. |
| Why empty pins on www? | If pins still empty after 2026-05-25 deploy: check Bearer token match, quota, or agent didn't call `search-grounded-places`. |
| Is the architecture wrong? | **No** — CR-00–CR-05 shipped; CR-06 browser proof pending. |

---

## Links

- **Cloud Run reference (GCP services, ADC, secrets):** [`docs/14-cloud-run-reference.md`](docs/14-cloud-run-reference.md)
- [Connect to Google Cloud services](https://docs.cloud.google.com/run/docs/integrate/using-gcp-services)
- [ADK deploy Cloud Run (Google)](https://adk.dev/deploy/cloud-run/)
- [CopilotKit + Google ADK docs](https://docs.copilotkit.ai/google-adk) — UI patterns yes, runtime wiring no
- [Cloud Run create (your project)](https://console.cloud.google.com/run/create?project=dev-inscriber-445714-k0)
