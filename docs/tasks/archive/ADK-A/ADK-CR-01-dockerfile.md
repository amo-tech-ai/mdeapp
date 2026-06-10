---
id: ADK-CR-01
title: Dockerfile for ADK grounding sidecar
status: Done
priority: P0
effort: 1h
owner: claude
depends_on: [ADK-CR-00]
blocks: [ADK-CR-04]
skill: [cloud-run-basics]
evidence: services/adk-grounding/Dockerfile, .dockerignore — docker build verified
---

# ADK-CR-01 — Dockerfile

## Shipped

- `services/adk-grounding/Dockerfile` — Python 3.12-slim, `pip install .`, listens on `$PORT` / 8080
- `services/adk-grounding/.dockerignore` — excludes `.venv`

## Verify

```bash
docker build -t mdeai-adk-grounding:test /home/sk/mdeai/services/adk-grounding
docker run --rm -p 8080:8080 -e GOOGLE_MAPS_SERVER_API_KEY=... mdeai-adk-grounding:test
curl http://localhost:8080/health
```
