---
title: ADK grounding sidecar — HTTP contract
status: active
date: 2026-05-20
mvp: true
task: tasks/maps/MAP-002-grounding-attribution.md
---

# ADK grounding sidecar API

> **MVP (MAP-002):** `services/adk-grounding/` is the **Google intelligence layer**. **Mastra** remains the CopilotKit runtime orchestrator (`MastraAgent.getLocalAgents`). Mastra calls this service over HTTP; **never** wire CopilotKit `HttpAgent` → ADK in `mdeapp/src/app/api/copilotkit/route.ts`.

## Transport

- **Base URL:** `ADK_GROUNDING_URL` (default `http://localhost:8000`)
- **Endpoint:** `POST /v1/grounding/invoke`
- **Auth:** `Authorization: Bearer <ADK_INTERNAL_TOKEN>` on invoke in prod ([ADK-CR-02](../ADK-CR-02-bearer-auth.md)); `GET /health` may stay public; localhost open in dev only
- **Production host:** Google Cloud Run — [`12-cloud-run-production-plan.md`](./12-cloud-run-production-plan.md); Vercel `ADK_GROUNDING_URL` → service URL
- **Timeout:** 30s default (Mastra client)
- **Response:** strict JSON — Mastra validates with Zod before merge

## Request (MVP)

```json
{
  "tool": "search_grounded_places",
  "query": "quiet cafés near Laureles",
  "locationBias": { "latitude": 6.2442, "longitude": -75.5812 },
  "pageSize": 5,
  "requestId": "uuid"
}
```

### Request — Search grounding (Phase 2, GS-001)

```json
{
  "tool": "search_grounded_events",
  "query": "rooftop events Poblado this Friday",
  "requestId": "uuid"
}
```

Requires sidecar `ENABLE_SEARCH_GROUNDING=1`. When off: `metadata.reason = "search_disabled"`.

## Response (MVP)

```json
{
  "places": [],
  "pins": [],
  "attribution": [],
  "citations": [],
  "confidence": 0.92,
  "metadata": {
    "source": "grounding-lite",
    "tool": "search_places"
  }
}
```

### Response — Search grounding

```json
{
  "citations": [{ "url": "https://...", "title": "...", "snippet": null }],
  "confidence": 0.75,
  "metadata": {
    "source": "google-search-grounding",
    "reason": null,
    "answer": "...",
    "webSearchQueries": ["..."]
  }
}
```

Zod: `mdeapp/src/mastra/lib/search-grounding-types.ts`.

## `metadata.source` values (MAP-002E)

| `source` | Meaning |
|----------|---------|
| `grounding-lite` | Grounding Lite MCP `search_places` (primary) |
| `gemini-maps-grounding` | Fallback after MCP 403/referrer or zero pins |
| `google-search-grounding` | `search_grounded_events` when flag on |

**429 / quota:** `reason=quota_exceeded`, `source=grounding-lite` — **no** Gemini Maps fallback.

On failure: HTTP 200 with empty arrays + `metadata.reason` (`adk_error`, `quota_exceeded`, `place_url_missing`, `search_disabled`, etc.) — Mastra fail-closed.

## ADK agent layout (MAP-002A)

```text
root_agent
├── MapsAgent → Grounding Lite MCP (search_places MVP)
└── SearchAgent → Google Search Grounding (stub/disabled until MAIC-008)
```

**Places API (New) details** — MAP-004 (Mastra or edge proxy), not required inside ADK for first invoke.

## Tools roadmap

| Tool | Phase | Mastra consumer |
|------|-------|-----------------|
| `search_grounded_places` | **MVP MAP-002** | `conciergeAgent` |
| `search_grounded_events` | Phase 2 (GS-001 stub in sidecar) | Tourist freshness — flag-gated |
| `find_event_venues` | Phase 2 | `hostEventAgent` |
| `explain_neighborhood` | Post-MVP | MAP-012 |
| `nearby_lifestyle_context` | Post-MVP | MAP-006 |
| `build_grounded_itinerary` | Phase 3 | tourist multi-stop |

## Invariants

- ADK **never** writes Supabase (Mastra + edge functions only).
- Mastra owns **quota policy** (`grounding_quota_log`) — check before HTTP call.
- Cache writes (MAIC-014) — Mastra after ADK returns.
- CopilotKit agent name unchanged: `conciergeAgent`.

## Reference implementation

- [`github/maps/grounding-lite-mcp-sample-app`](../../github/maps/grounding-lite-mcp-sample-app)
- [`github/copilotkit/ag-ui-adk-grounding-app`](../../github/copilotkit/ag-ui-adk-grounding-app)
- [`github/adk/adk-samples/python/agents/travel-planner-google-maps-mcp/`](../../github/adk/adk-samples/python/agents/travel-planner-google-maps-mcp/)

See [`adk-roadmap.md`](./adk-roadmap.md) · [`tasks/maps/MAP-002-grounding-attribution.md`](../../tasks/maps/MAP-002-grounding-attribution.md).
