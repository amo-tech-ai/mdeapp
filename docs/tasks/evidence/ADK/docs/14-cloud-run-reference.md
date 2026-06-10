---
doc_id: CLOUD-RUN-REF-MDEAI
title: Cloud Run reference sheet — mdeai ADK grounding
version: 1.0
date: 2026-05-25
status: Active
audience: Sofía, ops, agents deploying `services/adk-grounding`
project: dev-inscriber-445714-k0 (600700470346)
related:
  - ../adk-notes.md
  - ./12-cloud-run-production-plan.md
  - ./sidecar-api-contract.md
  - ../../../services/adk-grounding/RUNBOOK.md
official:
  - https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run
  - https://docs.cloud.google.com/run/docs/integrate/using-gcp-services
  - https://docs.cloud.google.com/run/docs/ai/use-cases
  - https://docs.cloud.google.com/run/docs/functions-with-run
  - https://docs.cloud.google.com/run/docs/setup
  - https://docs.cloud.google.com/run/docs/developing
  - https://docs.cloud.google.com/run/docs/functions/overview
  - https://docs.cloud.google.com/run/docs/apis
  - https://docs.cloud.google.com/run/docs/samples
  - https://adk.dev/deploy/cloud-run/
---

# Cloud Run reference sheet (mdeai)

> **Purpose:** Quick reference for hosting **`mdeai-adk-grounding`** on Cloud Run and connecting it to Google services.  
> **Not a tutorial** — for step-by-step deploy see [`12-cloud-run-production-plan.md`](./12-cloud-run-production-plan.md) and [`../adk-notes.md`](../adk-notes.md).

---

## 1. What Cloud Run is (one paragraph)

[Cloud Run](https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run) runs your **container** on Google’s infra: scales to zero, HTTPS URL, pay per request. You do not manage VMs. For mdeai, it hosts the **Python FastAPI sidecar** that Camila’s Mastra agent calls for real map pins — while **Vercel** still hosts the Next.js + CopilotKit + Mastra chat.

---

## 2. Cloud Run vs “functions” — what mdeai uses

Google renamed “Cloud Functions (2nd gen)” to **Cloud Run functions** — both end up as **containers on Cloud Run**. See [When should I deploy a function?](https://docs.cloud.google.com/run/docs/functions-with-run) and [functions overview](https://docs.cloud.google.com/run/docs/functions/overview).

| Deploy style | What it is | mdeai? |
|--------------|------------|--------|
| **Cloud Run service (container)** | You ship a `Dockerfile`; `gcloud run deploy --image …` | **Yes** — `services/adk-grounding/` |
| **Cloud Run service (source)** | `gcloud run deploy --source .` — Cloud Build + buildpacks | Optional shortcut (we have explicit Dockerfile) |
| **Cloud Run function** | Function entrypoint + Functions Framework; event triggers (Pub/Sub, GCS) | **No** — we need a **long-lived HTTP API**, not event-only |
| **Full ADK `adk deploy cloud_run`** | Google’s agent folder + `root_agent` | **Phase 2** — different shape than our sidecar |

**mdeai choice:** **Service + custom container** because we need FastAPI, fixed routes (`/health`, `/v1/grounding/invoke`), and Secret Manager env — not a single `functions_framework` handler.

---

## 3. Resource model (vocabulary)

| Resource | Role | mdeai |
|----------|------|-------|
| **Service** | Named app (`mdeai-adk-grounding`), stable URL | One service for grounding |
| **Revision** | Immutable deploy snapshot (image + env + flags) | Each deploy creates a revision |
| **Region** | Where instances run (`us-east1` recommended) | Pick once; URL includes region |
| **Job** | Run-to-completion batch work | Not used Phase 1 |
| **Worker pool** | Always-on pull workers | Not used Phase 1 |

**Runtime contract:** Container must listen on **`0.0.0.0`** and port **`$PORT`** (Cloud Run default **8080**). Our Dockerfile uses `PORT` with fallback — see [`services/adk-grounding/Dockerfile`](../../../services/adk-grounding/Dockerfile).

---

## 4. mdeai on Cloud Run (architecture)

```text
┌─────────────────────────────────────────────────────────────┐
│  Vercel (mdeapp) — NOT on Cloud Run                         │
│  CopilotKit → Mastra conciergeAgent → search-grounded-places  │
│  Env: ADK_GROUNDING_URL, ADK_INTERNAL_TOKEN, Supabase SR      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS POST + Bearer
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Cloud Run: mdeai-adk-grounding (dev-inscriber-445714-k0)   │
│  FastAPI — /health public, /v1/grounding/invoke Bearer      │
│  Service identity: default compute SA (minimal IAM)         │
└───────────────────────────┬─────────────────────────────────┘
                            │ API keys (not ADC for Maps)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Google Maps Grounding Lite MCP (mapstools.googleapis.com)    │
│  Gemini API fallback (generativelanguage.googleapis.com)    │
└─────────────────────────────────────────────────────────────┘
```

**Important:** Vercel → Cloud Run is **internet HTTPS + shared secret**, not Google [service-to-service IAM](https://docs.cloud.google.com/run/docs/authenticating/service-to-service) (that’s Phase 2).

---

## 5. Connecting to Google Cloud services (core doc)

Source: [Connect to Google Cloud services](https://docs.cloud.google.com/run/docs/integrate/using-gcp-services).

### How GCP expects you to connect (in general)

1. Use the **client library** for that product (Python `google-cloud-*`).
2. Grant the **Cloud Run service identity** (service account) the **minimum IAM role** for that API.
3. **Application Default Credentials (ADC)** — at runtime the library picks up the service account automatically; no JSON key file in the container.

```text
Code → google.cloud client library → ADC → service account → IAM → API
```

### How mdeai grounding sidecar connects (Phase 1)

| Google product | Connection method | Why |
|----------------|-------------------|-----|
| **Maps Grounding Lite MCP** | **API key** in `X-Goog-Api-Key` header | Public HTTP MCP endpoint; not a `google-cloud-*` client |
| **Gemini (Generative Language)** | **API key** in HTTP to `generativelanguage.googleapis.com` | Same — `@ai-sdk/google` pattern on Mastra; sidecar uses httpx + key |
| **Secret Manager** | **`--set-secrets`** on deploy → env vars in container | Stores keys + `ADK_INTERNAL_TOKEN`; no ADC needed to *read* if mounted as env |
| **Cloud Build** | gcloud / deploy script | Builds image → Artifact Registry |
| **Artifact Registry** | Image URL in `gcloud run deploy` | Stores `mdeai-adk-grounding` image |
| **Cloud Logging** | Automatic for Cloud Run | Ops: filter by service name |

**Phase 1 does not need** Firestore, Cloud SQL, Pub/Sub, or Vertex AI ADC on the sidecar — quota and inventory stay on **Supabase via Vercel/Mastra**.

### Recommended GCP services table (mdeai subset)

From the [official recommended list](https://docs.cloud.google.com/run/docs/integrate/using-gcp-services#services_and_tools_recommended_for_use):

| Category | Service | mdeai Phase 1 use |
|----------|---------|-------------------|
| **Tools** | Cloud Build | Build container image |
| **Tools** | Artifact Registry | Store image |
| **Tools** | Cloud Logging / Monitoring | Debug deploy + MCP errors |
| **Data / config** | **Secret Manager** | Maps server key, Gemini key, Bearer token |
| **Security** | IAM (service identity) | Default SA; add roles only if you add GCP clients |
| **Orchestration** | Pub/Sub, Scheduler, Tasks | **Defer** — no event-driven grounding |
| **Web** | Firebase Hosting | **No** — UI is Vercel |
| **AI (platform)** | Vertex AI, GPU Cloud Run | **Defer** — Gemini API key path for now |

### Services not used on sidecar (stay on Vercel / Supabase)

| Service | Where it lives |
|---------|----------------|
| Supabase Postgres, Auth, RLS | Vercel `mdeapp` |
| CopilotKit runtime | Vercel `/api/copilotkit` |
| Browser Maps JS | Client `NEXT_PUBLIC_GOOGLE_MAPS_*` |

---

## 6. Authentication patterns (cheat sheet)

| Pattern | When | mdeai example |
|---------|------|----------------|
| **ADC + service account IAM** | Calling GCP APIs with client libraries (BigQuery, GCS, Firestore) | Future if sidecar writes to GCS |
| **Secret Manager → env** | API keys, tokens, config | `GOOGLE_MAPS_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `ADK_INTERNAL_TOKEN` via `--set-secrets` |
| **API key (Google Maps / Gemini)** | HTTP to Google developer APIs | Grounding Lite MCP, Gemini maps fallback |
| **Bearer token (custom)** | Lock down *your* HTTP API | Mastra → `/v1/grounding/invoke` |
| **Allow unauthenticated (Cloud Run)** | Public HTTPS reachability | Enabled for Vercel; invoke still needs Bearer |
| **IAM identity token** | GCP caller → Cloud Run | Vercel WIF later — not MVP |

**Least privilege for default compute SA:** For Phase 1 sidecar, if you only use Secret Manager env injection and external API keys, you may need **no extra IAM roles** beyond what deploy already grants. Add roles when you add client libraries (e.g. `roles/secretmanager.secretAccessor` if not using `--set-secrets` mount).

---

## 7. Secret Manager + deploy wiring

Official pattern: [Secret Manager](https://cloud.google.com/secret-manager) + Cloud Run [secrets config](https://docs.cloud.google.com/run/docs/configuring/services/secrets).

| Secret name (create in console) | Becomes env in container | Purpose |
|--------------------------------|--------------------------|---------|
| `GOOGLE_MAPS_SERVER_API_KEY` | `GOOGLE_MAPS_API_KEY` | MCP `search_places` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | same name | Gemini fallback |
| `ADK_INTERNAL_TOKEN` | same name | Bearer on invoke |

Deploy flag (from our script):

```bash
--set-secrets=GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_SERVER_API_KEY:latest,\
GOOGLE_GENERATIVE_AI_API_KEY=GOOGLE_GENERATIVE_AI_API_KEY:latest,\
ADK_INTERNAL_TOKEN=ADK_INTERNAL_TOKEN:latest
```

Sidecar code reads `GOOGLE_MAPS_SERVER_API_KEY` **or** `GOOGLE_MAPS_API_KEY` in `grounding_mcp.py`.

---

## 8. AI / MCP on Cloud Run (why this fits)

From [AI use cases on Cloud Run](https://docs.cloud.google.com/run/docs/ai/use-cases):

| Google pattern | mdeai mapping |
|----------------|---------------|
| **Host MCP servers** | Grounding Lite is an **external** MCP (`mapstools.googleapis.com`); sidecar is MCP **client**, not host |
| **Host AI agents** | Full ADK agent on Cloud Run is optional later; today = **tool backend** only |
| **HTTP endpoint + scale to zero** | Perfect for bursty chat grounding |
| **Connect Secret Manager** | Keys + Bearer |

Official FastAPI + ADK sample exists under [Deploy Hello World — ADK for Python](https://docs.cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-adk-service) — different from our sidecar; see [`13-copilotkit-adk-vs-mdeai.md`](./13-copilotkit-adk-vs-mdeai.md).

---

## 9. Setup checklist (project `dev-inscriber-445714-k0`)

From [Setting up your environment](https://docs.cloud.google.com/run/docs/setup):

```bash
gcloud config set project dev-inscriber-445714-k0
gcloud config set run/region us-east1   # or europe-west1

gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  generativelanguage.googleapis.com
```

| Role / access | Who needs it |
|---------------|--------------|
| `roles/run.admin` | Deployer (you) |
| Billing enabled | Project |
| Maps APIs enabled | Console (Geocoding, Places New, mapstools, etc.) |

**APIs enabled for Maps (your project):** Grounding Lite / mapstools, Places (New), Routes, Geocoding, Maps JS (browser only), Cloud Run, Artifact Registry, Cloud Build, Secret Manager, Generative Language.

---

## 10. Deploy commands (mdeai)

| Step | Command / doc |
|------|----------------|
| Build + deploy | [`services/adk-grounding/scripts/deploy-cloud-run.sh`](../../../services/adk-grounding/scripts/deploy-cloud-run.sh) |
| Manual image deploy | [`12-cloud-run-production-plan.md`](./12-cloud-run-production-plan.md) §6 |
| ADK-specific deploy | [adk.dev/deploy/cloud-run](https://adk.dev/deploy/cloud-run/) — only if adopting `root_agent` layout |
| Samples | [All Cloud Run code samples](https://docs.cloud.google.com/run/docs/samples) |
| APIs / gcloud ref | [Cloud Run APIs](https://docs.cloud.google.com/run/docs/apis) |

After deploy:

```bash
URL=$(gcloud run services describe mdeai-adk-grounding --region=us-east1 --format='value(status.url)')
curl -sS "${URL}/health"
# invoke: Bearer required when ADK_INTERNAL_TOKEN set on service
```

---

## 11. Developing locally vs Cloud Run

From [Developing your service](https://docs.cloud.google.com/run/docs/developing):

| Topic | Local | Cloud Run |
|-------|-------|-----------|
| Port | `8000` (`ADK_GROUNDING_PORT`) | `8080` (`PORT`) |
| Auth | `ADK_INTERNAL_TOKEN` unset = open invoke | Token required |
| Maps key | `.env.local` server key | Secret Manager |
| Mastra caller | `ADK_GROUNDING_URL=http://localhost:8000` | `https://….run.app` |

---

## 12. Cost & scaling defaults (MVP)

| Setting | Value | Effect |
|---------|-------|--------|
| Billing | Request-based | CPU throttled when idle |
| min instances | 0 | Scale to zero — cold start OK for MVP |
| max instances | 10 | Cap burst |
| memory | 512Mi | MCP + httpx |
| timeout | 60s | Align with Mastra 30s client + buffer |
| concurrency | 20 | I/O bound |

---

## 13. Official doc index (bookmark)

| Topic | URL |
|-------|-----|
| What is Cloud Run | https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run |
| **Connect GCP services** | https://docs.cloud.google.com/run/docs/integrate/using-gcp-services |
| AI use cases | https://docs.cloud.google.com/run/docs/ai/use-cases |
| Functions vs Run | https://docs.cloud.google.com/run/docs/functions-with-run |
| Setup | https://docs.cloud.google.com/run/docs/setup |
| Developing | https://docs.cloud.google.com/run/docs/developing |
| Functions overview | https://docs.cloud.google.com/run/docs/functions/overview |
| APIs reference | https://docs.cloud.google.com/run/docs/apis |
| Code samples | https://docs.cloud.google.com/run/docs/samples |
| Authenticate requests | https://docs.cloud.google.com/run/docs/authenticating/overview |
| Python FastAPI on Run | https://docs.cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-adk-service |

---

## 14. Anti-patterns for mdeai

| Don’t | Do instead |
|-------|------------|
| Put browser Maps key on Cloud Run | Server key in Secret Manager |
| Run Mastra on Cloud Run for Phase 1 | Keep Mastra on Vercel (Pattern 1) |
| Use CopilotKit `HttpAgent` → ADK as chat brain | Mastra + sidecar HTTP |
| Expect ADC to authenticate Maps MCP | API key header |
| Skip Bearer because Cloud Run is “public” | Public = HTTPS reachability; invoke still token-gated |
| Deploy without `ADK_GROUNDING_URL` on Vercel | Empty pins on prod (fail-closed) |

---

**See also:** [`../adk-notes.md`](../adk-notes.md) · [`../INDEX.md`](../INDEX.md)
