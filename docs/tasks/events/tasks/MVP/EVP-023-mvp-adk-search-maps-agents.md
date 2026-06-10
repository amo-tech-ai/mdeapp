---
id: EVP-023-mvp
linear: SAN-126
legacy_id: EVT-D04
title: ADK SearchAgent + MapsAgent sidecar
status: Not Started
priority: P2
phase: Post-MVP
effort: 3d
depends_on: [EVP-019-mvp-research-official-docs]
parent_pack: EVP-018-mvp-event-web-discovery-task-pack.md
---

# EVP-023-mvp — ADK sidecar agents

## Agents

| Agent | Role |
|-------|------|
| SearchAgent | Google Search Grounding queries |
| MapsAgent | Maps Grounding Lite venue facts |

## Contract

- Strict JSON schema (Zod validate in Mastra after response)
- Timeout 15s; graceful empty on failure
- Citations array required on every search result
- **No** direct DB writes, payments, or user mutations

## Acceptance criteria

- [ ] `verify:grounding` extended or sibling script
- [ ] Error paths return `{ error, code }` not throw to UI
- [ ] Sidecar :8000 health check documented
