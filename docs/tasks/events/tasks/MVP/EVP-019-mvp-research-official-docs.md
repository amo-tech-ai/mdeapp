---
id: EVP-019-mvp
linear: SAN-122
legacy_id: EVT-D01
title: Research official docs (CopilotKit, Mastra, ADK, Grounding, Places)
status: Not Started
priority: P2
phase: Post-MVP
effort: 1d
depends_on: [EVP-017-mvp-event-grounding-architecture]
parent_pack: EVP-018-mvp-event-web-discovery-task-pack.md
---

# EVP-019-mvp — Research + official docs

## Purpose

Verify APIs and constraints via MCP before any EVT-D implementation.

## MCP / docs to probe

| Surface | MCP / URL |
|---------|-----------|
| CopilotKit Mastra integration | copilotkit MCP + local example |
| Mastra workflows/tools | mastra MCP |
| Gemini Google Search Grounding | gemini-api-docs-mcp |
| ADK grounding | adk.dev + sidecar source |
| Maps Grounding Lite | google-maps-code-assist |
| Places API New | google-maps-code-assist + field masks |
| Supabase edge patterns | supabase MCP |

## Deliverable

`tasks/events/notes/EVP-019-mvp-research-notes.md` with:

- Exact API endpoints + auth model
- Rate limits / quotas
- Citation format requirements
- Beta API traps (Mastra `agents` key naming)
- Go/no-go for Phase 2

## Acceptance criteria

- [ ] Every API claim cites MCP probe or official URL dated 2026
- [ ] Blockers list (if ADK not production-ready)
- [ ] No code in mdeapp/src
