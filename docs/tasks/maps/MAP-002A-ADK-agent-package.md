---
id: MAP-002A-ADK
title: ADK LlmAgent + McpToolset package (Phase 2 follow-up)
status: Not started
priority: P2
phase: Phase 2 — maps intelligence hardening
effort: 8-12h
owner: claude
depends_on: [MAP-002]
blocks: []
skill: [mde-maps, google-agents-cli-adk-code, mastra]
prd_ref: ../../plan/ADK/adk-roadmap.md
---

# MAP-002A-ADK — Full Google ADK agent package (optional hardening)

## Context

**MAP-002 Done (Phase 1)** ships grounding via **FastAPI sidecar + httpx Grounding Lite MCP** (`services/adk-grounding/main.py`, `grounding_mcp.py`). This matches [`plan/ADK/adk-roadmap.md`](../../plan/ADK/adk-roadmap.md) MVP: *Mastra → HTTP POST /v1/grounding/invoke*.

MAP-002 original `target_files` listed `agent/maps_agent.py` / `McpToolset` — deferred here.

## Goal

Replace or wrap the thin FastAPI handler with an official **ADK `LlmAgent` + `McpToolset`** layout (per `travel-planner-google-maps-mcp` sample) while keeping the **same JSON contract** in [`plan/ADK/sidecar-api-contract.md`](../../plan/ADK/sidecar-api-contract.md).

## Out of scope

- CopilotKit `HttpAgent` in Next route
- Moving MCP transport into Mastra TS

## Acceptance

1. `POST /v1/grounding/invoke` response shape unchanged (Mastra client tests still pass).
2. `metadata.source=grounding-lite` on golden queries.
3. Gemini fallback fail-closed in production (dev-only or removed).
4. Evidence file + `npm run verify:grounding` + `smoke:grounding-attribution` green.
