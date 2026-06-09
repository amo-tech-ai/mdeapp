---
title: ADK Cloud Run — archived pack A (Done)
updated: 2026-05-26
active_backlog: ../../ADK/INDEX.md
---

# ADK archive — pack A

**Phase 1 Cloud Run pack (CR-00–CR-06)** archived **2026-05-26** — sidecar live on Cloud Run, Vercel wired, prod E2E grounded cards verified.

**Active:** [`../../ADK/`](../../ADK/INDEX.md) — ops notes, planning docs, optional CR-07/CR-08.

---

## Completion verdict

| ID | Complete? | Spec file | Proof |
|----|:---------:|-----------|-------|
| **ADK-CR-00** | **Yes** | [ADK-CR-00-gcp-prereqs.md](./ADK-CR-00-gcp-prereqs.md) | GCP APIs enabled (`dev-inscriber-445714-k0`) |
| **ADK-CR-01** | **Yes** | [ADK-CR-01-dockerfile.md](./ADK-CR-01-dockerfile.md) | `services/adk-grounding/Dockerfile` |
| **ADK-CR-02** | **Yes** | [ADK-CR-02-bearer-auth.md](./ADK-CR-02-bearer-auth.md) | Bearer auth + 11 Vitest |
| **ADK-CR-03** | **Yes** | *(evidence only)* | Secret Manager — 3 secrets |
| **ADK-CR-04** | **Yes** | *(evidence only)* | Cloud Run deploy + `/health` smoke |
| **ADK-CR-05** | **Yes** | *(evidence only)* | Vercel `ADK_GROUNDING_URL` + token |
| **ADK-CR-06** | **Yes** | *(evidence only)* | www E2E grounded café cards |
| **ADK-CR-07** | No | — | Optional custom domain — **active** |
| **ADK-CR-08** | No | — | Optional monitoring — **active** |

**MAP-002** (Mastra ↔ sidecar client) lives in [`../maps/`](../maps/README.md) archive — not duplicated here.

Evidence: [`../../evidence/ADK-CR-evidence.md`](../../evidence/ADK-CR-evidence.md) · [`../../evidence/ADK-CR-01-02-evidence.md`](../../evidence/ADK-CR-01-02-evidence.md)

**Verify:** `cd mdeapp && npm test -- adk-grounding`

---

## CR-03–CR-06 summary (no standalone spec was filed)

| ID | Work |
|----|------|
| CR-03 | Secret Manager: `GOOGLE_MAPS_SERVER_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `ADK_INTERNAL_TOKEN` |
| CR-04 | Cloud Run service `mdeai-adk-grounding` — revision `00005-4bf`+ · `us-east1` |
| CR-05 | Vercel Production + Preview env vars + redeploy |
| CR-06 | Chrome DevTools prod smoke — 5 cards, 6 pins, attribution, 0 console errors |

Do not re-execute unless regression or new region/project.
