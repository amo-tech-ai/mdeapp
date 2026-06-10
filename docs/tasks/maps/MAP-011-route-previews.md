---
id: MAP-011
title: Route previews + commute cards
status: Not Started
priority: P2
phase: Post-MVP
effort: 3-4h
owner: claude
depends_on: [MAP-011A, MAP-002, MAP-004, data-033]
blocks: []
skill: [mde-maps, mastra, copilotkit-develop]
prd_ref: ../../plan/maps/maps-prd.md
draft_sources:
  - ../../drafts/tasks/mastra/maps/tasks/deferred/062-mastra-wire-route-display.md
  - ../../drafts/tasks/mastra/maps/tasks/grounding/ (compute_routes via Grounding Lite MCP)
verified_docs:
  - .claude/skills/mde-maps/references/google-offline/compute_routes.md
verified_against:
  - /home/sk/mdeai/github/maps/grounding-lite-mcp-sample-app/mcpServer.ts
  - /home/sk/mdeai/github/maps/grounding-lite-mcp-sample-app/components/route-display.ts
  - /home/sk/mdeai/github/maps/react-google-maps/website/src/examples/routes-api.mdx
---

# MAP-011 — Route previews

## At a glance

**Description:** Answer “how long from A to B?” in chat with a small **commute card** (minutes + distance) — using Grounding Lite `compute_routes`, not turn-by-turn navigation.

**Purpose:** **Camila** compares neighborhoods by travel time. The agent should show a parsed “~18 min drive”, not raw `"180s"` JSON.

**Goals:**
- Mastra `computeRouteTool` → **`adk-grounding-client.ts`** → `POST ${ADK_GROUNDING_URL}/v1/grounding/invoke` with tool `compute_routes` (ADK sidecar calls Grounding Lite MCP — **not** inline MCP in Mastra).
- `RouteResultSchema` + `RouteDisplay` card in the results column.
- Normalize durations; fail gracefully to prose if route missing.
- Vitest for `"180s"` → `"3 min"` and error paths.

**Features:**
| Who | What they get |
|-----|----------------|
| **Camila** | “How far is Laureles from El Poblado?” → inline commute summary. |

> **Camila** asks *“how long from Laureles to El Poblado by car?”* → inline **CommuteCard** with parsed minutes — not a wall of JSON.  
> **Draft port:** MASTRA-062 / deferred `062-mastra-wire-route-display.md`.

## 0. Prerequisite — sidecar `compute_routes` (blocked today)

**Today:** `POST /v1/grounding/invoke` with `tool: "compute_routes"` returns `metadata.reason = "compute_routes_not_implemented"` ([`main.py`](../../services/adk-grounding/main.py)). MAP-011 **cannot** Done until ADK implements the MCP call.

### MAP-011A — ADK sidecar (must ship first)

| Step | Deliverable |
|------|-------------|
| 1 | `grounding_mcp.py` — `compute_routes(origin, destination, travelMode)` via Grounding Lite MCP (probe argument casing from [`mcpServer.ts`](../../github/maps/grounding-lite-mcp-sample-app/mcpServer.ts)) |
| 2 | `main.py` — replace stub with MCP invoke; input: `{ origin: {lat,lng}, destination: {lat,lng}, travelMode?: "DRIVE"\|"WALK"\|"TRANSIT" }` |
| 3 | Normalized output on invoke envelope: `{ routes: [{ durationText, durationSeconds, distanceMeters, distanceText }] }` |
| 4 | Fail-closed: MCP error → `{ metadata: { reason: "route_unavailable" } }` — no throw |
| 5 | Python unit test with mocked MCP JSON; redacted curl evidence |

**Quota:** Count toward same Grounding Lite limits as `search_places` — Mastra should reuse `grounding-quota.ts` or add route-specific cap in follow-on.

## 1. Purpose

Wire Grounding Lite / Maps MCP `compute_routes` through a Mastra tool, normalize duration strings (`"180s"` → `"3 min"`), and render `RouteDisplay` / `CommuteCard` on `/` via `OPEN_ROUTE_RESULTS` action — **no** turn-by-turn navigation or polyline map layer in Phase 1.

## 2. Goals

### MAP-011B — Mastra + UI (after 011A)

- `computeRouteTool` in `mdeapp/src/mastra/tools/` — `adkGroundingClient.invoke({ tool: "compute_routes", origin, destination, travelMode })` (same HTTP client as MAP-002B `search-grounded-places`; extend sidecar contract if needed)
- Extend `platform/contracts` with `RouteResultSchema` + `OpenRouteResultsAction`
- `normalize-tool-output` branch: missing duration or `error` → `null` (prose fallback)
- `RouteDisplay.tsx` in center column — duration, distance, label
- Register tool on concierge agent (with MAP-002)
- Vitest: valid route passes; `"180s"` → 3; missing duration → null; strip extra fields

## 3. Out of scope (explicit)

- Live traffic
- Multi-leg itineraries
- Polyline on map (`<MdeRouteLayer>` deferred)
- User geolocation

## 4. Workflows

1. MCP probe `compute_routes` with origin/destination lat/lng (Medellín sample).
2. Port duration parser from legacy `RouteDisplay` if exists under `/home/sk/mde/`.
3. Add `OPEN_ROUTE_RESULTS` to action union consumed by `ChatCanvas`.
4. `useCopilotAction` disabled mirror for generative UI.
5. Smoke query on `/chat` after MAP-007 layout.

## 5. Acceptance criteria

1. Tool returns structured route or empty (never throws to UI).
2. Card shows human-readable minutes + km/mi.
3. No route card when MCP fails (agent text only).
4. `npm run floor` green.
5. ≥3 Vitest cases for normalizer.

## 6. Verification checklist (100% Done gate)

> [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) · Evidence: [`MAP-011-evidence.md`](../notes/MAP-011-evidence.md).

### Shared gates

- [ ] G1–G8 complete

### Unit (≥3 cases)

- [ ] `route-preview-normalizer.test.ts` — happy path minutes + distance
- [ ] MCP/HTTP error → empty structured result (no throw)
- [ ] Malformed MCP payload → empty result + logged reason

### Integration

- [ ] `computeRouteTool` registered on `conciergeAgent` (or documented agent)
- [ ] `useCopilotAction` disabled mirror + `OPEN_ROUTE_RESULTS` in action union
- [ ] Prompt on `/`: *commute from Laureles to El Poblado* → `RouteDisplay` card OR graceful text-only on failure
- [ ] No polyline on map in this task (out of scope — grep confirms)

### MCP probe (evidence)

- [ ] Redacted `compute_routes` sample — argument casing documented

## 7. Rollback

Unregister `computeRouteTool`; remove action type from union.

## 8. Definition of Done

**011A (sidecar):** Stub removed; redacted MCP probe + Python test green; Cloud Run revision deployed.

**011B (Mastra + UI):** §5 acceptance + **§6 verification checklist** + MCP probe note.

Commit: `feat(maps): compute_routes sidecar + commute card (MAP-011)`.
