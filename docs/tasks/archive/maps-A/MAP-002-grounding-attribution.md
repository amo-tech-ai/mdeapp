---
id: MAP-002
title: ADK grounding sidecar + Mastra bridge + attribution (PR-2)
status: Done
priority: P0
phase: MVP — O4 trust
effort: 12-16h
owner: claude
depends_on: [MAP-001, F49]
blocks: [MAP-004, MAP-007, MAP-011]
skill: [mde-maps, mastra, copilotkit-integrations, mde-supabase, testing]
architecture: ADK-first Google intelligence + Mastra-first product OS
prd_ref: ../../../plan/ADK/maps-adk-prd.md · ../../../plan/prd/04-maps-grounding.md · ../../../plan/maps/maps-prd.md §8 steps 2–3
sidecar_contract: ../../../plan/ADK/sidecar-api-contract.md
draft_sources:
  - ../../../drafts/tasks/mastra/maps/tasks/grounding/010-grounded-search.md
  - ../../../drafts/tasks/mastra/maps/tasks/grounding/012-grounding-attribution.md
  - ../../../drafts/tasks/mastra/maps/tasks/grounding/014-grounding-quota-protection.md
  - /home/sk/mdeai/github/maps/grounding-lite-mcp-sample-app/
  - /home/sk/mdeai/github/copilotkit/ag-ui-adk-grounding-app/
  - /home/sk/mdeai/CopilotKit/examples/integrations/adk/
  - /home/sk/mdeai/github/adk/adk-samples/python/agents/travel-planner-google-maps-mcp/
  - /home/sk/mdeai/github/adk/mcp-agent-tool-adapter/
verified_against:
  - https://developers.google.com/maps/ai/grounding-lite
  - https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places
  - https://adk.dev/tools-custom/mcp-tools/
  - https://ai.google.dev/gemini-api/docs/google-search
  - https://github.com/google/adk-samples
target_files:
  - /home/sk/mdeai/services/adk-grounding/README.md
  - /home/sk/mdeai/services/adk-grounding/pyproject.toml
  - /home/sk/mdeai/services/adk-grounding/agent/root_agent.py
  - /home/sk/mdeai/services/adk-grounding/agent/maps_agent.py
  - /home/sk/mdeai/services/adk-grounding/agent/search_agent.py
  - /home/sk/mdeai/services/adk-grounding/main.py
  - /home/sk/mdeai/mdeapp/src/mastra/lib/adk-grounding-client.ts
  - /home/sk/mdeai/mdeapp/src/mastra/lib/adk-grounding-client.test.ts
  - /home/sk/mdeai/mdeapp/src/mastra/lib/grounding-quota.ts
  - /home/sk/mdeai/mdeapp/src/mastra/tools/search-grounded-places.ts
  - /home/sk/mdeai/mdeapp/src/components/maps/GroundingAttribution.tsx
deprecated_do_not_add:
  - mdeapp/src/mastra/lib/maps-grounding-client.ts
---

# MAP-002 — ADK grounding + attribution (+ ex–MAP-003)

## At a glance

**Description:** Ship **Google-native grounding** via an **ADK sidecar** (`services/adk-grounding/`). Mastra stays the CopilotKit runtime and product router; it calls ADK over HTTP and renders pins + attribution in the UI.

**Purpose:** **Tourist** and **Camila** get real places on the map. **Patricia** gets quota logging. Architecture matches official Google samples ([ADK](https://adk.dev/), [Grounding Lite MCP](https://developers.google.com/maps/ai/grounding-lite), [adk-samples](https://github.com/google/adk-samples)).

**Split:**

| Sub-task | Owner layer | Deliverable |
|----------|-------------|-------------|
| **MAP-002A** | ADK (Python) | `services/adk-grounding/` — MapsAgent + SearchAgent + `POST /v1/grounding/invoke` |
| **MAP-002B** | Mastra (TS) | Thin HTTP client + `search-grounded-places` tool on `conciergeAgent` |
| **MAP-002C** | UI (TS) | `GroundingAttribution` + `useCopilotAction` mirror (F49 patterns) |

> **Do not** put Grounding Lite MCP transport in Mastra long-term. **Do not** use `HttpAgent` → ADK in `mdeapp/src/app/api/copilotkit/route.ts`. CopilotKit → **Mastra only**.

## Architecture

```text
CopilotKit UI (/, vis.gl)
  ↓
Mastra conciergeAgent (product OS — router, Supabase tools, quota policy)
  ↓ HTTP JSON
services/adk-grounding/ (Google intelligence)
  ├── MapsAgent → Grounding Lite MCP (search_places MVP)
  ├── SearchAgent → Google Search Grounding (MVP: stub or flag off)
  └── Formatter → strict JSON { places, pins, attribution, citations, confidence }
  ↓
Mastra merges pins → MapContext → cards
```

**Reference repos (read-only — never `import` from `github/**` into `mdeapp/src`):**

| Repo | MAP | Study these paths | Do not copy into mdeapp |
|------|-----|-------------------|-------------------------|
| [`CopilotKit/examples/integrations/adk`](../../../CopilotKit/examples/integrations/adk) | 002A | `agent/main.py`, `agent/pyproject.toml`, `docker/Dockerfile.agent`, `scripts/run-agent.sh` | `src/app/api/copilotkit/route.ts` (`HttpAgent`) |
| [`adk-samples/travel-planner-google-maps-mcp`](../../../github/adk/adk-samples/python/agents/travel-planner-google-maps-mcp/) | 002A | `travel_planner_agent/agent.py`, README | Whole travel-concierge monolith |
| [`mcp-agent-tool-adapter`](../../../github/adk/mcp-agent-tool-adapter/) | 002A | `app_client_adk.py`, `mcp_config.json` | — |
| [`grounding-lite-mcp-sample-app`](../../../github/maps/grounding-lite-mcp-sample-app) | 002A | `mcpServer.ts`, `services/groundingLiteService.ts`, `components/source-card.ts` | MCP transport in Mastra long-term |
| [`ag-ui-adk-grounding-app`](../../../github/copilotkit/ag-ui-adk-grounding-app) | 002C / F49 | `agent/agent.py` (sub-agents), `src/app/page.tsx` (`useCopilotAction`) | `src/app/api/copilotkit/route.ts` |
| [`adk-examples/06_improved_travel_rec_agent`](../../../github/adk/adk-examples/06_improved_travel_rec_agent/) | 002A alt | `maps_agent/agent.py` | Community-only if official sample insufficient |

**Duplicate:** `github/maps/ag-ui-adk-grounding-app/` — use **`github/copilotkit/`** only.

**Not production MCP:** Maps Code Assist (`mapscodeassist.googleapis.com`) — dev/docs only.

**Production runtime:** [`CopilotKit/examples/integrations/mastra`](../../../CopilotKit/examples/integrations/mastra/) — `MastraAgent.getLocalAgents` only.

## 0. Pre-flight

1. **F49** generative cards + pin merge working (rental smoke green or accepted manual proof).
2. MCP probe: `POST https://mapstools.googleapis.com/mcp` with server `GOOGLE_MAPS_API_KEY` — record in evidence.
3. Read [`plan/ADK/sidecar-api-contract.md`](../../../plan/ADK/sidecar-api-contract.md).
4. Skills: `mde-maps`, `copilotkit-integrations`. ADK Python patterns: `.agents/skills/google-agents-cli-workflow` (routes to `/google-agents-cli-adk-code` when available).

## MAP-002A — ADK service (Google intelligence)

**Path:** `/home/sk/mdeai/services/adk-grounding/`

### Agent design (MVP — start with 2 sub-agents)

```text
root_agent
├── MapsAgent
│   └── Grounding Lite MCP: search_places only (MVP allowlist)
└── SearchAgent (optional MVP — can return empty + reason=search_disabled)
    └── Google Search Grounding (enable in MAP-002 follow-on — see [`search-grounding-routing.md`](../../../plan/maps/search-grounding-routing.md))
```

Defer **PlacesAgent** (Places API New details) to **MAP-004** — enrichment stays Mastra/edge unless ADK needs it for a single invoke.

### Steps

1. Scaffold from [`CopilotKit/examples/integrations/adk`](../../../CopilotKit/examples/integrations/adk) + [`travel-planner-google-maps-mcp`](../../../github/adk/adk-samples/python/agents/travel-planner-google-maps-mcp/) (`pyproject.toml`, `google-adk`, FastAPI on **:8000**).
2. Wire **Grounding Lite MCP** at `https://mapstools.googleapis.com/mcp` — shapes from [`mcpServer.ts`](../../../github/maps/grounding-lite-mcp-sample-app/mcpServer.ts); optional bridge via [`mcp-agent-tool-adapter`](../../../github/adk/mcp-agent-tool-adapter/).
3. Implement `POST /v1/grounding/invoke`:
   - Input: `{ tool: "search_grounded_places", query, locationBias?, pageSize? }`
   - Output: `{ places, pins, attribution, citations, confidence, metadata }`
4. Default `locationBias`: Medellín (~6.2442, -75.5812).
5. Fail-closed: missing `googleMapsLinks.placeUrl` → drop place, log reason.
6. Local dev: service on **:8000**; document in `services/adk-grounding/README.md`.
7. **No Supabase writes** in ADK.

### Env (ADK service only)

| Var | Purpose |
|-----|---------|
| `GOOGLE_MAPS_API_KEY` | Grounding Lite MCP |
| `GOOGLE_GENERATIVE_AI_API_KEY` or Vertex config | Gemini in ADK |
| `GOOGLE_CLOUD_PROJECT` | If using Vertex Search/Maps tools (optional) |

## MAP-002B — Mastra bridge (product OS)

**Path:** `mdeapp/src/mastra/`

### Steps

1. `adk-grounding-client.ts` — HTTP client to `ADK_GROUNDING_URL` (default `http://localhost:8000`), timeout 30s, Zod response parse.
2. `grounding-quota.ts` — `incrementAndCheckGroundingQuota()` against Supabase **before** HTTP call (Mastra owns quota policy).
3. Migration `grounding_quota_log` + RLS (≥1 policy).
4. `search-grounded-places.ts` — `createTool({ id: "search-grounded-places" })`:
   - Check quota → call ADK → normalize via MAP-001 `normalize-tool-output`
   - `recordMastraRun` / `ai_runs` trace
5. Register on **`conciergeAgent`** (registry key = CopilotKit `useCoAgent` name).
6. Tool: `createTool({ id: "search-grounded-places" })` registered as **`searchGroundedPlacesTool`** on `conciergeAgent` — `useCopilotAction({ name: "searchGroundedPlacesTool" })` per [`mastra-tool-action-names.ts`](../../../mdeapp/src/platform/copilot/mastra-tool-action-names.ts) + F49 (optional duplicate render for kebab `id` if AG-UI streams it).
7. Vitest: mock ADK JSON → passes `MapPinSchema` / `ToolResponseSchema`; ADK down → empty + `metadata.reason`.

**Mastra env:** `ADK_GROUNDING_URL` (default `http://localhost:8000`). Grounding Lite MCP uses **`GOOGLE_MAPS_API_KEY`** on the ADK service — not `GROUNDLITE_MCP_URL` in Mastra.

**Do not add** `maps-grounding-client.ts` (inline MCP in Mastra) — deprecated.

## MAP-002C — UI + CopilotKit

1. `GroundingAttribution.tsx` — `translate="no"`, contrast ≥4.5:1, per [Grounding Lite attribution](https://developers.google.com/maps/ai/grounding-lite/attribution).
2. F49 / 002C: `useCopilotAction({ name: "searchGroundedPlacesTool", available: "disabled", render })` + `GroundingAttribution` — registry key matches F49 table; kebab `search-grounded-places` only if duplicate render registered.
3. Grounded cards merge pins via `mergePinsByCategory('grounded', …)` without wiping rental pins.

## Fail-closed gates

| Gate | Behavior |
|------|----------|
| ADK unreachable | Empty result + `metadata.reason = 'adk_unavailable'` |
| Quota at cap | Early empty (Mastra, before HTTP) |
| Missing attribution payload | No grounded card surface |
| Missing `placeUrl` | Drop pin; log `place_url_missing` |
| Search disabled (MVP) | Maps-only; no fake web citations |

**Google limits (Experimental):** Grounding Lite `search_places` — 100 QPM / 1,000 QPD per project.

## Acceptance criteria

1. ADK service returns strict JSON for *"quiet cafés near Laureles"*.
2. Mastra tool output passes MAP-001 schemas (no invented `place_id`).
3. Attribution visible same turn as grounded cards.
4. Quota incremented per successful invoke (Mastra/Supabase).
5. No ADK/MCP keys in client bundle.
6. `npm run floor` exit 0.
7. localhost: ≥3 grounded pins + attribution screenshot.
8. F49 rental follow-up still shows rental pins.

## Verification checklist

> [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) · Evidence: [`MAP-002-evidence.md`](../notes/MAP-002-evidence.md).

### ADK service (002A)

- [ ] `curl -X POST localhost:8000/v1/grounding/invoke` — redacted success envelope in evidence
- [ ] MapsAgent uses `search_places` only (allowlist documented)
- [ ] Unit test or eval script for probe query

### Mastra bridge (002B)

- [ ] `adk-grounding-client.test.ts` — Zod parse + ADK down handling
- [ ] `grounding_quota_log` migration + RLS
- [ ] Tool registered on `conciergeAgent`

### UI (002C)

- [ ] `GroundingAttribution` on grounded turn
- [ ] `useCopilotAction` name matches registry

### Manual smoke

- [ ] Prompt: *quiet cafés near Parque Lleras* → ≥3 grounded pins + attribution
- [ ] Rental search after → merge not wiped

## Search grounding routing (ex-MAIC-008 — plan only)

**Canonical matrix:** [`plan/maps/search-grounding-routing.md`](../../../plan/maps/search-grounding-routing.md)

| MVP | Phase 2 |
|-----|---------|
| MapsAgent → Grounding Lite MCP | ADK SearchAgent → Google Search Grounding |
| Supabase `events` for ticketed rows | `search_grounded_events` for promos / “this weekend” |
| Disclaimer when SQL partial | Inline web citations + `source` field on merged cards |

**002A stub:** SearchAgent may exist but returns empty + `metadata.reason = 'search_disabled'` until product flag. **No** fake web citations in MVP.

**Citation UI:** Maps/Places → **002C** `GroundingAttribution`. Search (Phase 2) → inline “web” badge per routing doc; never mix into SQL event rows without `source`.

## Generative cards (ex-MAIC-009 — execute in F49)

Pin + card wiring for rentals/events/restaurants is **not** a MAP-### task — execute **[F49](../core/F49-copilotkit-generative-search-ui.md)**. MAP-002 only adds grounded tool render + `GroundingAttribution` in **002C**.

## Post-ship follow-ons (maps-checklist 2026-05-26)

> **Status:** MAP-002 MVP is **Done**. Items below amend scope for the next PRs — **do not** reopen 002A/B/C acceptance without a new evidence file.

### G1 — Dynamic `locationBias` / viewport (not fixed Laureles)

| Today | Target |
|-------|--------|
| ADK defaults to Medellín centroid when `locationBias` omitted | Mastra passes **map viewport center** or **user-selected hood** from `MapContext` / **F50b** viewport sync |

**Workflow:**

1. **F50b** ships `useMapViewport` (or equivalent) → Mastra tool input includes `{ latitude, longitude, radiusMeters? }`.
2. Extend `search-grounded-places` tool schema + `adk-grounding-client.ts` invoke body — forward `locationBias` unchanged to `POST /v1/grounding/invoke`.
3. Sidecar already accepts `locationBias` on invoke — verify with Laureles vs El Poblado probe queries in evidence.
4. **Do not** pass raw browser geolocation in Phase 1 — hood/viewport only.

**Acceptance (follow-on PR):** Prompt *"cafés near me"* with map panned to Laureles → pins cluster Laureles, not city center when viewport differs.

### G4 — Gemini Maps fallback (documented, already in sidecar)

Production path stays **Grounding Lite MCP** → **Places Details enrich**. Gemini `googleMaps` is **fallback only** via [`gemini_maps_grounding.py`](../../../services/adk-grounding/gemini_maps_grounding.py).

| Trigger | Sidecar behavior | `metadata.source` |
|---------|------------------|-------------------|
| MCP HTTP **403** / **referer** restriction | Retry `search_via_gemini_maps()` | `gemini-maps-grounding` |
| MCP returns **0 pins** after successful HTTP | Same Gemini retry | `gemini-maps-grounding` |
| MCP **429** / quota | **Do not** silently fallback — return `adk_error` + quota hint; Mastra quota gate first | `grounding-lite` |
| Gemini also fails | Fail-closed empty + `metadata.reason` | — |

**Env:** `GOOGLE_GENERATIVE_AI_API_KEY` on Cloud Run for fallback; `GEMINI_GROUNDING_MODEL` optional (default `gemini-3.5-flash`).

**Out of scope here:** Using Gemini `googleMaps` on **every** Mastra turn — that belongs in a separate Phase 2 decision (checklist G2). Observability → [**MAP-002E**](./MAP-002E-gemini-maps-fallback-runbook.md). See [`maps-checklist.md`](../../maps-checklist.md) § Gemini G2.

**Patricia ops:** Log `metadata.source` on every invoke; alert if `gemini-maps-grounding` >10% of daily volume (signals MCP key misconfiguration). Full runbook + dashboards → [**MAP-002E**](./MAP-002E-gemini-maps-fallback-runbook.md). Cookbook context (read-only): [01-playbook.md](../../grounding-search/docs/01-playbook.md) `#maps_grounding` via [00-playbook-guide.md](../../grounding-search/docs/00-playbook-guide.md). Search layer → [**MAP-002D**](./MAP-002D-search-grounding-enable.md) + [02-playbook.md](../../grounding-search/docs/02-playbook.md).

## Out of scope

- Places proxy/cache (**MAP-005**) — MAP-004 client first
- Production Search Grounding — [**MAP-002D**](./MAP-002D-search-grounding-enable.md) after MVP stable
- `compute_routes` (**MAP-011**)
- CopilotKit → Python `HttpAgent` in Next route

## Rollback

Remove tool from `conciergeAgent`; stop ADK service. Mastra falls back to Supabase + non-grounded tools only.

## Definition of Done

MAP-002A + 002B + 002C complete, § acceptance + verification, evidence file. Commit: `feat(maps): ADK grounding sidecar + Mastra bridge (MAP-002)`.
