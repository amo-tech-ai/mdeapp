Here’s where ADK lives in the repo and what you’d rerun on a **new Google account**.

## What “ADK” means in mdeai

Phase 1 is **not** a full CopilotKit→ADK chat brain. It’s a **FastAPI sidecar** (`services/adk-grounding/`) on **Cloud Run** that calls **Maps Grounding Lite MCP**. **Mastra** on Vercel still owns the conversation.

Plain-English ops: [`tasks/evidence/ADK/adk-notes.md`](tasks/evidence/ADK/adk-notes.md)

---

## Active / blocking tasks (prod)

| ID | Linear | Spec | Status (disk) |
|----|--------|------|----------------|
| **MAP-002B** | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | [`tasks/maps/MAP-002B-prod-adk-deploy.md`](tasks/maps/MAP-002B-prod-adk-deploy.md) | **Not Done** — Cloud Run **503**, server key **“caller does not have permission”** for Grounding Lite |
| **MAP-002** | — | Mastra ↔ sidecar client (code **Done**) | Prerequisite for 002B |
| **MAP-002E** | — | [`services/adk-grounding/RUNBOOK.md`](services/adk-grounding/RUNBOOK.md) | Ops runbook |

Evidence / current failure: [`tasks/notes/1/MAP-002B-evidence.md`](tasks/notes/1/MAP-002B-evidence.md) (2026-06-03, ~35% — env on Vercel OK, GCP broken).

Queue index: [`tasks/INDEX.md`](tasks/INDEX.md) row **091** · maps hub: [`tasks/maps/INDEX.md`](tasks/maps/INDEX.md)

---

## Done playbook (reuse on **new** GCP project)

Archived but this is the step-by-step you want for a fresh Google account:

| Step | Task | Spec / proof |
|------|------|----------------|
| 0 | GCP prereqs | [`tasks/archive/ADK-A/ADK-CR-00-gcp-prereqs.md`](tasks/archive/ADK-A/ADK-CR-00-gcp-prereqs.md) |
| 1 | Dockerfile | [`ADK-CR-01-dockerfile.md`](tasks/archive/ADK-A/ADK-CR-01-dockerfile.md) |
| 2 | Bearer auth | [`ADK-CR-02-bearer-auth.md`](tasks/archive/ADK-A/ADK-CR-02-bearer-auth.md) |
| 3–6 | Secrets, deploy, Vercel, prod E2E | [`tasks/archive/ADK-A/README.md`](tasks/archive/ADK-A/README.md) · [`tasks/evidence/ADK-CR-evidence.md`](tasks/evidence/ADK-CR-evidence.md) |

Full operator plan: [`tasks/evidence/ADK/docs/12-cloud-run-production-plan.md`](tasks/evidence/ADK/docs/12-cloud-run-production-plan.md)

**Current project in docs:** `dev-inscriber-445714-k0` — on a new account you create a **new project**, then replace that ID everywhere (deploy script, secrets, evidence).

---

## New Google account — concrete checklist

### 1. GCP project (billing owner)

```bash
gcloud auth login                    # new Google account
gcloud projects create YOUR_NEW_PROJECT_ID --name=mdeai-adk
gcloud config set project YOUR_NEW_PROJECT_ID
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  generativelanguage.googleapis.com
```

Also enable **[Maps Grounding Lite API](https://console.cloud.google.com/apis/library/mapstools.googleapis.com)** (`mapstools.googleapis.com`) — required for real pins ([MAP-002B § checklist](tasks/maps/MAP-002B-prod-adk-deploy.md)).

### 2. API keys (two Maps keys — don’t mix)

| Key | Where | Purpose |
|-----|--------|---------|
| **Browser** | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Vercel + `mdeapp/.env.local`) | vis.gl map on `/` — HTTP referrer restricted |
| **Server** | Secret `GOOGLE_MAPS_SERVER_API_KEY` on Cloud Run | Grounding Lite MCP — **no** browser referrer; IP/unrestricted for Run |

Plus **`GOOGLE_GENERATIVE_AI_API_KEY`** (Gemini) for Mastra + sidecar fallback.

Details: [`adk-notes.md` § env](tasks/evidence/ADK/adk-notes.md) · sidecar README: [`services/adk-grounding/README.md`](services/adk-grounding/README.md)

### 3. Secret Manager (new project)

Create (same names as old pack):

- `GOOGLE_MAPS_SERVER_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `ADK_INTERNAL_TOKEN` (`openssl rand -base64 32`)

### 4. Deploy sidecar

```bash
cd /home/sk/mdeai/services/adk-grounding
export PROJECT_ID=YOUR_NEW_PROJECT_ID
export REGION=us-east1
./scripts/deploy-cloud-run.sh
```

### 5. Vercel (`mdeapp`)

```text
ADK_GROUNDING_URL=https://<new-cloud-run-url>
ADK_INTERNAL_TOKEN=<same as Secret Manager>
```

Never put the token in `NEXT_PUBLIC_*`. Redeploy after env change. Steps in MAP-002B.

### 6. Verify

```bash
cd mdeapp
npm run verify:cloud-run-grounding   # remote health + invoke
npm run verify:grounding
```

Prod UI gate: café query on mdeai.co → `metadata.source=grounding-lite`, not `venue_anchors` fallback.

---

## Planning / Phase 2 (not blocking “wire new account”)

| Area | Doc / task |
|------|------------|
| Canonical PRD | [`docs/plan/ADK/prd-adk.md`](docs/plan/ADK/prd-adk.md) · index [`docs/plan/ADK/INDEX.md`](docs/plan/ADK/INDEX.md) |
| Roadmap | [`tasks/evidence/ADK/docs/adk-roadmap.md`](tasks/evidence/ADK/docs/adk-roadmap.md) |
| Full ADK `LlmAgent` package | [`tasks/maps/MAP-002A-ADK-agent-package.md`](tasks/maps/MAP-002A-ADK-agent-package.md) |
| SearchAgent + MapsAgent sidecar | [`tasks/events/tasks/MVP/EVP-023-mvp-adk-search-maps-agents.md`](tasks/events/tasks/MVP/EVP-023-mvp-adk-search-maps-agents.md) (SAN-126, post-MVP) |
| Venues ADK spike → sidecar | `VEN-GEM-010` / `VEN-GEM-030` in [`tasks/venues/docs/11-gemini-maps-adk-venues-routing.md`](tasks/venues/docs/11-gemini-maps-adk-venues-routing.md) |
| Optional ops | ADK-CR-07 custom domain `adk.mdeai.co`, CR-08 monitoring — [`tasks/evidence/ADK/INDEX.md`](tasks/evidence/ADK/INDEX.md) |

**Dev tooling** (scaffold/eval/deploy ADK Python — not prod runtime): [`docs/plan/ADK/notes.md`](docs/plan/ADK/notes.md) — `uvx google-agents-cli setup`, `google-agents-cli-deploy` skill, optional `adk-docs-mcp` in `.mcp.json`.

---

## Architecture rule (don’t regress)

- **Do:** Mastra → `ADK_GROUNDING_URL` → Cloud Run → Grounding Lite MCP  
- **Don’t:** CopilotKit `HttpAgent` → full ADK chat ([`docs/13-copilotkit-adk-vs-mdeai.md`](tasks/evidence/ADK/docs/13-copilotkit-adk-vs-mdeai.md))

---

## Suggested execution order for you

1. **SAN-368 / MAP-002B** on the **new** GCP project (CR-00→06 checklist above).  
2. Update **all** hardcoded `dev-inscriber-445714-k0` references when you cut over (deploy script, evidence, runbooks).  
3. Only after prod pins are real ADK: optional CR-07/08, then Phase 2 MAP-002A / EVP-023.

If you want, next step can be a single “migration” task spec (`ADK-CR-09-new-gcp-account.md`) with a file grep list of every place the old project ID appears.