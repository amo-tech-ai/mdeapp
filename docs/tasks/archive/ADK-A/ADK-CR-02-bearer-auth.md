---
id: ADK-CR-02
title: Bearer auth on ADK invoke endpoint
status: Done
priority: P0
evidence: tasks/notes/ADK-CR-01-02-evidence.md
effort: 2–3h
owner: claude
depends_on: [ADK-CR-01]
blocks: [ADK-CR-04, ADK-CR-05]
skill: [karpathy-guidelines]
target_files:
  - services/adk-grounding/main.py
  - mdeapp/src/mastra/lib/adk-grounding-client.ts
  - mdeapp/src/mastra/lib/adk-grounding-client.test.ts
---

# ADK-CR-02 — Bearer auth

## Goal

Protect `POST /v1/grounding/invoke`; keep `GET /health` public for Cloud Run probes.

## Code

1. `main.py` — FastAPI dependency: compare `Authorization: Bearer …` to `os.environ["ADK_INTERNAL_TOKEN"]`; 401 if mismatch.
2. `adk-grounding-client.ts` — send header when env set.
3. Tests — 401 without header; 200 with header (mock fetch).

## Secrets

- Generate token: `openssl rand -base64 32`
- Store in Secret Manager + Vercel (ADK-CR-05)

## Verify

- Local: run sidecar with `ADK_INTERNAL_TOKEN=test` + client call
- `npm test` adk-grounding-client tests pass

## Done when

- [x] Invoke requires Bearer when `ADK_INTERNAL_TOKEN` set
- [x] Health unchanged without Bearer
- [x] Mastra client sends Bearer header
- [x] Vitest + `test_invoke_auth.py` pass
