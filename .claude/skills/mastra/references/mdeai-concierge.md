---
title: mdeAI Concierge — Mastra production patterns
description: Load when editing my-mastra-app concierge agent, SSE transport, or ai_runs logging.
parent: mastra
impact: HIGH
impactDescription: Concierge agent, SSE transport, tool naming, ai_runs logging, deployment
tags: mastra, mdeai, concierge, sse, tools, deployment
---

# mdeAI Concierge — Mastra production patterns

> Load this when working on `my-mastra-app/` in the mdeAI repo.

## Agent structure (don't change without a plan)

One `conciergeAgent` with four tools. Never split into multiple agents.

```
my-mastra-app/src/mastra/agents/concierge.ts
  model: google/gemini-3.1-flash-lite-preview
  tools: searchRentalsTool, searchEventsTool, searchRestaurantsTool, searchAttractionsTool
  inputProcessors: PromptInjectionDetector, TokenLimiter(8192)
  memory: workingMemory (thread-scoped) — lastIntent, lastRentalQuery, lastEventQuery
```

Architecture invariants (never violate):
- Gemini never generates coordinates, prices, or IDs — only tool results do
- Pins come exclusively from tool-output-available output fields with lat/lng
- UI state (cards, pins) is driven by ChatAction objects — never by parsing prose
- Supabase is the inventory source of truth; Maps API is enrichment only

## SSE event transport — critical field mapping

Mastra emits two key SSE event types:

| Event type | Carries | Client action |
|-----------|---------|--------------|
| tool-input-available | { toolCallId, toolName } | Store in Map<string, string> |
| tool-output-available | { toolCallId, output } | Look up toolName from map, build ChatAction |

tool-output-available does NOT carry toolName — correlate via toolCallId.

Tool name to ChatAction mapping:
- searchEventsTool      → OPEN_EVENT_RESULTS
- searchRentalsTool     → OPEN_RENTALS_RESULTS
- searchRestaurantsTool → OPEN_RESTAURANT_RESULTS
- searchAttractionsTool → OPEN_ATTRACTION_RESULTS

## normalizeToolOutput (required before dispatch)

All tool output must pass through normalizeToolOutput(toolName, raw) before becoming a ChatAction (MASTRA-046). Zod safeParse — parse failure returns null, shows prose-only message, no crash.

## ChatAction versioning

Every ChatAction type must have version: 1. Unknown versions are logged and skipped. Schema change rule: bump version, keep old parser branch for one release, then drop.

## Multi-tool pin merge

Use per-category accumulation — never setPins(next) which replaces all categories:
setPins(prev => [...prev.filter(p => p.category !== 'event'), ...newEventPins])

## ai_runs logging (mdeapp / CopilotKit path)

Every chat turn must write a row to `public.ai_runs`: `{ agent_name, agent_type, status, duration_ms, user_id? }`.

**mdeapp (CopilotKit + `@ag-ui/mastra`):** Do not rely on Mastra `server.middleware` alone — middleware runs on the Mastra HTTP server ([docs](https://mastra.ai/docs/server/middleware)), while prod chat uses `POST /api/copilotkit` → `MastraAgent.getLocalAgents({ mastra })` in-process. `@ag-ui/mastra` calls `agent.stream()` without `onFinish`; use `LoggingMastraAgent` (F13) wrapping `run()` completion.

**Legacy `my-mastra-app`:** `ai-runs-middleware.ts` on `POST /chat` + `recordMastraRun()` in `lib/ai-runs.ts`.

**Dual tables:** `ai_runs` = product audit; `mastra_ai_spans` = Mastra observability exporter (F20+).

Smoke: row within 10 minutes of a CopilotKit chat turn; anonymous `user_id` null is OK.

## Deployment checklist

Before deploying my-mastra-app to Vercel: npm run build + mastra build must be clean. Health check: curl .../health must return {"status":"ok"}. Bundle must NOT contain MOCK_EVENTS. Required env vars: DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY.

## Task references

- PLAN-001: tasks/mastra/maps/tasks/plans/001-geo-chat-production-plan.md — master roadmap
- MASTRA-044: 044-mastra-deploy-verification.md — deploy + health check
- MASTRA-045: 045-mastra-smoke-hardening.md — smoke spec hardening
- MASTRA-046: 046-mastra-action-schema-validation.md — normalizeToolOutput
- MASTRA-047: 047-mastra-map-pin-merge-versioning.md — pin merge + versioning
- PLACES-005-010: 020-place-details-enrichment.md — Places enrichment
- GROUNDING-001: 010-grounded-search.md — Maps grounding (Phase 3)
