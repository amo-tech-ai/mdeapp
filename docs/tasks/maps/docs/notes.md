---
title: Maps implementation notes — strategy & example usage
updated: 2026-05-21
see_also:
  - ./INDEX.md
  - ./maps-prd.md
  - ../copilotkit/INDEX.md
  - ../audit/09-maps-audit.md
---

# Maps notes — how to build & which examples to trust

Living playbook for **Sofía** (implement) and **Lucía** (verify). Task specs stay in `MAP-*.md`; this file is **strategy + CopilotKit/github example routing** only.

---

## Core strategy (one sentence)

**CopilotKit wires chat to Mastra; Mastra calls ADK + Places server-side; pins flow through contracts → MapContext → vis.gl — never the reverse.**

Canonical architecture: [`plan/ADK/maps-adk-prd.md`](../../plan/ADK/maps-adk-prd.md).

```text
User (/) → CopilotKit → /api/copilotkit → Mastra (conciergeAgent, gemini-3.5-flash)
                    ↓                    ↓
            ADK :8000 (MAP-002)    Places New (MAP-004/005)
            Grounding Lite MCP      [server keys + field masks]
                    ↓
        normalize-tool-output → mergePinsByCategory → MapContext
                    ↓
        <Map mapId> + <AdvancedMarker>  [@vis.gl/react-google-maps]
```

---

## Three layers (debug top-down)

| Layer | Question | Owner | If broken |
|-------|----------|-------|-----------|
| **1. Data** | Finite `lat`/`lng`, stable `id`, `placeUri`? | Mastra tools + Supabase listings | Fix tool output / MAP-002 fail-closed |
| **2. State** | Pins in `MapContext` only? | MAP-001 pipeline | No agent `setPins`; check normalizer |
| **3. Render** | `mapId` + APIProvider + markers? | MAP-001 / MAP-008 | `AdvancedMarker` count = 0 → Map ID or key referrer |
| **4. Cluster** | Dense hood readable? | MAP-009 | Optional post-MVP |

---

## Google Maps — two production APIs (do not mix)

| API | Endpoint / tool | mdeai task | Use for |
|-----|-----------------|------------|---------|
| **Grounding Lite** | `https://mapstools.googleapis.com/mcp` · `search_places` | **MAP-002** | Tourist/Camila conversational “find cafés near X” — real places, attribution required |
| **Places API (New)** | `@googlemaps/places` + `X-Goog-FieldMask` | **MAP-004**, **MAP-005** | Autocomplete, Details, Nearby, proxy/cache |
| **Maps JavaScript** | `@vis.gl/react-google-maps` | **MAP-001**, **MAP-008** | Pins on screen — `NEXT_PUBLIC_GOOGLE_MAPS_*` only |

**Not production paths for mdeai Phase 1:**

- Vertex ADK `GoogleMapsGroundingTool` (`ag-ui-adk-grounding-app`)
- Legacy Python `googlemaps` client (`v1/travel` agent)
- Maps Code Assist MCP (`mapscodeassist.googleapis.com`) — dev/docs only
- Leaflet / OSM (`v1/travel` `MapCanvas.tsx`)

---

## CopilotKit examples — what to copy

| Example | Path | MAP | Copy | Do not copy |
|---------|------|-----|------|-------------|
| **Mastra integration** | `CopilotKit/examples/integrations/mastra/` | 001, F48, F49 | `getLocalAgents({ mastra })`, `useCoAgent` | — |
| **Canvas + state** | `CopilotKit/examples/canvas/mastra/` | 001, 007 | Zod co-agent state | — |
| **CK ADK layout** | `CopilotKit/examples/integrations/adk/` | **002A** | `agent/main.py`, Docker, `run-agent.sh` | `route.ts` `HttpAgent` |
| **v1/travel** | `CopilotKit/examples/v1/travel/` | 007 | Progress UI, HITL, split layout | Leaflet, LangGraph, `googlemaps` |
| **ag-ui-adk-grounding** | `github/copilotkit/ag-ui-adk-grounding-app` | 002, F49 | `agent/agent.py`, `page.tsx` renders | `HttpAgent`, no map panel |
| **ADK Maps MCP** | `github/adk/adk-samples/.../travel-planner-google-maps-mcp` | 002A | `travel_planner_agent/agent.py` | travel-concierge monolith |
| **MCP bridge** | `github/adk/mcp-agent-tool-adapter` | 002A | `app_client_adk.py` | — |
| **Grounding Lite** | `github/maps/grounding-lite-mcp-sample-app/` | 002, 011 | `mcpServer.ts`, `groundingLiteService.ts` | Mastra→MCP direct in prod |
| **Places snippets** | `github/maps/js-api-samples/` | 004, 006, 010 | Field masks, Nearby, Autocomplete | — |
| **Places server** | `github/maps/google-maps-services-js/` | 005 | Edge proxy patterns | Browser keys |
| **vis.gl** | `github/maps/react-google-maps/` | 001, 008, 010 | `advanced-marker.mdx`, `autocomplete.mdx` | Vendor into `src/` |
| **Clustering** | `github/maps/codelab-…`, `js-markerclusterer` | 009 | npm `@googlemaps/markerclusterer` | — |

Example routing: [`../copilotkit/INDEX.md`](../copilotkit/INDEX.md) · layout: `CopilotKit/examples/v1/travel/` ([MAP-007B](../archive/maps-A/MAP-007-chat-three-panel-polish.md)).

---

## How CopilotKit + Google Maps work together in mdeapp

1. **Runtime** — same as foundation F01/F02:

   ```ts
   // mdeapp/src/app/api/copilotkit/route.ts
   new CopilotRuntime({ agents: getLocalAgentsWithLogging({ mastra }) });
   ```

2. **Agent tool** (e.g. `searchGroundedPlaces`) — returns structured pins + card payload; validates `MapPinSchema`.

3. **Frontend mirror** — generative UI without double execution:

   ```ts
   useCopilotAction({
     name: "searchGroundedPlaces", // must match tool name
     available: "disabled",
     render: ({ args, result }) => <GroundedResultsCard ... />,
   });
   ```

4. **Map** — `useCoAgent` does **not** draw pins directly; `ChatCanvas` (or equivalent) applies `mergePinsByCategory` → `MapContext.setPins`.

5. **Borrow from travel** — progress while tool runs:

   ```ts
   useCoAgentStateRender({
     name: "pingAgent", // or conciergeAgent
     render: ({ state }) =>
       state.searchProgress?.length ? <SearchProgress ... /> : null,
   });
   ```

   Implement `searchProgress` (or `groundingProgress`) in agent working memory / streamed state — Mastra shape, not LangGraph `copilotkit_emit_state`.

---

## MVP execution order (do not reorder)

1. **MAP-001** — contracts, MapContext, vis.gl shell, `/chat` 200, ≥1 marker  
2. **MAP-002** — Grounding Lite + attribution + quota  
3. **MAP-004** — Places client + field-mask hook  
4. **MAP-007** — layout polish (travel layout only; map stays vis.gl)  

Then events/rentals tasks (F33+, F46) consume MAP-001 contracts.

Post-MVP: MAP-005 → 006 → 008 → 009 → 010 → 011 → 012 — see [`INDEX.md`](./INDEX.md).

---

## Env vars (mdeapp)

| Var | Where | Purpose |
|-----|-------|---------|
| `GOOGLE_MAPS_API_KEY` | Server / Mastra / edge | Grounding Lite MCP, Places (New) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Mastra Gemini | Agents (not Maps JS) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Browser | `APIProvider` only |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | Browser | **Required** for prod `AdvancedMarker` (MAP-008) |

Same key *value* may back server + client; **never** expose server key in `NEXT_PUBLIC_*`.

---

## Persona checkpoints

| Persona | After which MAP | Proof |
|---------|-----------------|-------|
| **Camila** | MAP-001 + MAP-002 | `/chat` query → pins + Google attribution |
| **Tourist** | MAP-002 | Grounded restaurant pins, fail-closed without `placeUri` |
| **Roberto** | MAP-010 (post-MVP) | `/host/event/new` autocomplete → `google_place_id` |
| **Lucía** | MAP-007 | 390×844 sheet + desktop 40/35/25, `npm run floor` |

---

## Common mistakes

- Porting **travel `MapCanvas`** → breaks `mapId` / AdvancedMarker rules.  
- Wiring **ADK `HttpAgent`** → splits stack from Mastra; two runtimes.  
- Calling **Grounding MCP from the browser** → key leak + ToS.  
- **`useCoAgent` name mismatch** with `Mastra({ agents: { ... } })` key → silent 404 on agent.  
- Skipping **`<GroundingAttribution>`** on grounded turns → MAP-002 fail-closed by design.  
- Using **`generativeSummary`** for Medellín hood copy → empty in CO; use MAP-012 offline summaries.

---

## When implementing a MAP task

1. Read the `MAP-*.md` spec + `draft_sources` in frontmatter.  
2. MCP-verify masks/models if touching external API (CLAUDE.md cadence).  
3. Primary code example: **`integrations/mastra`**, not ADK/travel.  
4. Evidence: `tasks/notes/MAP-###-evidence.md` + localhost gate 9 (`npm run dev`, curl `/chat`).
