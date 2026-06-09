---
id: MAP-011A
title: ADK sidecar compute_routes (Grounding Lite MCP)
status: Not Started
priority: P1
phase: Post-MVP — prerequisite for MAP-011
effort: 3-4h
owner: claude
depends_on: [MAP-002B, MAP-002]
blocks: [MAP-011]
skill: [mde-maps, google-agents-cli-adk-code, mastra]
prd_ref: ./MAP-011-route-previews.md §0
related:
  - ../../services/adk-grounding/main.py
  - ../../services/adk-grounding/grounding_mcp.py
  - ../../github/maps/grounding-lite-mcp-sample-app/mcpServer.ts
description: Replace compute_routes_not_implemented stub with Grounding Lite MCP invoke; normalize duration strings.
---

# MAP-011A — ADK `compute_routes`

## Context

**Today:** `POST /v1/grounding/invoke` with `tool: "compute_routes"` returns `metadata.reason = "compute_routes_not_implemented"`.

**MAP-011** commute cards **cannot** Done until this ships.

## Deliverables

| Step | File | Done when |
|------|------|-----------|
| 1 | `grounding_mcp.py` | `compute_routes(origin, destination, travelMode)` via MCP |
| 2 | `main.py` | Stub replaced; normalized `{ routes: [{ durationText, durationSeconds, distanceMeters, distanceText }] }` |
| 3 | Tests | Python unit test with mocked MCP JSON |
| 4 | Deploy | Cloud Run revision after MAP-002B baseline |

## Duration parsing

Grounding Lite returns duration as string `"180s"` — parse to seconds + human `"3 min"` in sidecar before Mastra sees it.

## Acceptance criteria

- [ ] Redacted curl: Medellín origin → destination returns route envelope
- [ ] MCP error → `{ metadata: { reason: "route_unavailable" } }` (fail-closed, no throw)
- [ ] Quota counted (reuse `grounding_quota_log` or document follow-on)
- [ ] **data-033** `route_cache` write-through optional in same PR or MAP-011 follow-on

## Out of scope

- Polyline on map
- Turn-by-turn UI
- Mastra tool + CommuteCard (MAP-011B = main MAP-011 spec)
