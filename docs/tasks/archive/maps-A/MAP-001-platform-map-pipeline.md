---
id: MAP-001
title: Platform contracts + MapContext + vis.gl + map components (PR-1)
status: Done
priority: P0
phase: MVP — blocks O3, O4, O5
effort: 8-12h
owner: claude
depends_on: [F09, F13, F19]
blocks: [MAP-002, MAP-004, MAP-007, F33, F41, F46, F48]
companion_tasks: [F48, F49, F50]
skill: [copilotkit-integrations, mde-maps, mde-task-lifecycle, mermaid-diagrams]
prd_ref: ../../../plan/ADK/maps-adk-prd.md · ../../../plan/prd/07-contracts-schemas.md · ../../../plan/prd/04-maps-grounding.md · ../../../plan/maps/maps-prd.md §8 step 1
diagrams: ../../../plan/maps/diagrams/README.md
index_ref: ../../../index.md §7 PR-1
draft_sources:
  - ../../../drafts/tasks/mastra/maps/tasks/runtime/001-normalize-tool-output.md
  - ../../../drafts/tasks/mastra/maps/tasks/runtime/002-map-pin-merge-versioning.md
  - ../../../drafts/tasks/mastra/maps/tasks/runtime/010-visgl-react-google-maps-migration.md
verified_against:
  - /home/sk/mdeai/CopilotKit/examples/integrations/mastra/
  - /home/sk/mdeai/CopilotKit/examples/canvas/mastra/src/lib/canvas/state.ts
  - /home/sk/mdeai/github/maps/react-google-maps/website/src/examples/advanced-marker.mdx
  - /home/sk/mdeai/github/maps/codelab-maps-platform-101-react-js/solution/
  - /home/sk/mdeai/plan/diagrams/03-camila-chat-flow.md
---

# MAP-001 — Platform contracts + map pipeline + `/` map shell

## At a glance

**Description:** Build the shared “map brain” for mdeapp — typed pin data, one place that owns all map pins, and the first Google map with a real marker on `/`.

**Purpose:** Without this, **Camila** and the **Tourist** only get chat text — no pins on `/`. **Roberto**’s future event map and rental search (F41/F46) also need the same pin contracts. Layout chrome is **F48**; live tool→pin wiring is **F49**.

**Goals:**
- Define `MapPin` / tool response schemas (Zod) so agents cannot invent coordinates.
- Add `MapContext` as the **only** component that may add or merge pins.
- Install `@vis.gl/react-google-maps` and show ≥1 `AdvancedMarker` on a map with `mapId`.
- Ship a mock pin on localhost to prove the map renders before F49 connects search tools.

**Features:**
| Who | What they get |
|-----|----------------|
| **Camila** | Map column on `/` ready for rental pins (F49). |
| **Tourist** | Same shell for restaurant/attraction pins later. |
| **Sofía** | One import path: `@/platform/contracts` + Vitest on merge/schema rules. |

> **Greenfield vis.gl:** Draft RUNTIME-010 describes *migrating legacy Vite app*; **mdeapp** installs `@vis.gl/react-google-maps` fresh in this task — no `VITE_MAPS_VISGL` flag, no `loadGoogleMapsLibrary`, no `react-wrapper`.

## 0. Pre-flight (mde-maps + MCP)

1. Read [`.claude/skills/mde-maps/SKILL.md`](../../.claude/skills/mde-maps/SKILL.md) + `references/maps-js-api.md`.
2. **Maps Code Assist MCP** — Advanced Markers + `mapId` requirement (dev verification only).
3. Grounding Lite MCP → **MAP-002**, not here.

## 1. Purpose

**MVP blocker** for O3 (Camila pins), O4 (`/` concierge + MAP-001–002), O5 (lead). PR-1: Zod contracts, `MapContext`, tool→pins pipeline, vis.gl map components with **≥1** `<AdvancedMarker>` on `<Map mapId={...}>`. **CopilotKit 3-panel shell on `/`** is **[F48](../core/F48-copilotkit-map-canvas-layout.md)**; **generative tool renders** are **[F49](../core/F49-copilotkit-generative-search-ui.md)**. Without MAP-001, Roberto (F33+) and rentals (F41) have no shared map truth.

## 2. Goals

### Contracts + pipeline

- `mdeapp/src/platform/contracts/` — `MapPin`, `ToolResponse`, `MapPinCategory`, `MapPinSchema` ([`plan/prd/07`](../../../plan/prd/07-contracts-schemas.md))
- `mdeapp/src/platform/maps/normalize-tool-output.ts` — port RUNTIME-001
- `mdeapp/src/platform/maps/merge-pins-by-category.ts` — port RUNTIME-002; multi-category turns do not wipe prior pins
- `MapContext` — **sole** writer of `pins` / `selectedPinId` (no agent `setPins`)

**Pin taxonomy** (`MapPinSchema` — must match F49 tool output):

| Field | Rule |
|-------|------|
| `category` | `rental` \| `restaurant` \| `event` \| `attraction` \| `venue` \| `grounded` |
| `source` | `sql` \| `places` \| `grounding` \| `mock` (provenance for Patricia) |
| Dedupe key | `place_id ?? id` in `merge-pins-by-category.ts` |
| Coords | Reject non-finite `lat`/`lng` before render |

**On-disk paths (canonical — not `src/lib/maps/`):**

| Path | Role |
|------|------|
| `mdeapp/src/platform/contracts/map-pin.ts` | Zod + types |
| `mdeapp/src/platform/maps/map-context.tsx` | Provider + hooks |
| `mdeapp/src/platform/maps/normalize-tool-output.ts` | Tool → pins (F49) |
| `mdeapp/src/platform/maps/merge-pins-by-category.ts` | Dedupe / multi-category |
| `mdeapp/src/components/maps/ChatMap.tsx` | `<Map mapId>` + markers |
| `mdeapp/src/components/maps/MapProvider.tsx` | Single `APIProvider` |

**Surface:** `/` only — `/chat` redirects to `/` (do not mount a second map tree).

### vis.gl shell

- `npm install @vis.gl/react-google-maps` in `mdeapp`
- `mdeapp/src/components/maps/MapProvider.tsx` — `<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={['marker']}>` under `/` concierge subtree (F48)
- `ChatMap.tsx` — `<Map mapId={getGoogleMapsMapId()} defaultCenter={MEDELLIN} defaultZoom={13}>` + ≥1 `<AdvancedMarker>`
- `getGoogleMapsMapId()` — minimal version (full prod guard in **MAP-008**); dev may use `DEMO_MAP_ID` with warn
- Env: `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `mdeapp/.env.local` (from repo root `.env.local`)

### CopilotKit surface (split to core tasks)

- **Layout shell:** **[F48](../core/F48-copilotkit-map-canvas-layout.md)** — refactor `/` (`CopilotSidebar` + map column); `/chat` redirect only
- **Generative UI:** **[F49](../core/F49-copilotkit-generative-search-ui.md)** — `useCopilotAction({ available: 'disabled', render })` for `search-rentals|events|restaurants|attractions` on **`conciergeAgent`**
- **Shared state:** **[F50](../core/F50-copilotkit-map-ui-state.md)** — `MapUiState` + `focusMapPin` (optional for MVP pin proof)
- MAP-001 ships **mock pin** on map for layout smoke until F49 wires live tool output

### Quality gates

- Vitest fixtures for schemas + merge behavior
- `npm run floor` exit 0
- Gate 9: `curl -s -o /dev/null -w "%{http_code}" http://localhost:<port>/` → **200** (use port from `[ui]` in `npm run dev`, often 3000 or 3001)
- Every rendered pin: `data-testid="map-pin"` on marker wrapper
- `tasks/notes/MAP-001-evidence.md`

## 3. Pattern sources

| Need | Source |
|------|--------|
| Runtime / CopilotKit | `CopilotKit/examples/integrations/mastra/` |
| Zod / co-agent state | `examples/canvas/mastra/src/lib/canvas/state.ts` |
| Map UI | `github/maps/react-google-maps` → `@vis.gl/react-google-maps` |
| Markers | `github/maps/codelab-maps-platform-101-react-js/solution/` |
| **Avoid** | `v2/*`, `github/maps/react-wrapper`, legacy `google-maps-loader.ts` |

## 4. Workflows

1. Create `platform/contracts/*` + Vitest `MapPinSchema` / `ToolResponseSchema` tests.
2. Port `normalize-tool-output` + `mergePinsByCategory` from `/home/sk/mde/` (read-only) → `platform/maps/`.
3. `MapContext` + provider hook `useMapContext()`.
4. Install vis.gl; wrap chat route with `APIProvider`.
5. `ChatMap` + one test pin from mock tool output.
6. Mock pin on `ChatMap` for vis.gl smoke (live tool→pin wiring in **F49**).
7. Hand off layout to **F48**; polish in **MAP-007**.
8. Evidence file + localhost screenshot.

### vis.gl reference (mdeapp paths)

```tsx
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={['marker']}>
  <Map
    mapId={getGoogleMapsMapId()}
    defaultCenter={{ lat: 6.2442, lng: -75.5812 }}
    defaultZoom={13}
    style={{ width: '100%', height: '100%' }}
  >
    {pins.map((p) => (
      <AdvancedMarker key={p.id} position={{ lat: p.lat, lng: p.lng }} />
    ))}
  </Map>
</APIProvider>
```

## 5. Concierge vertical geo (ex-MAIC-012 — events)

> **Roberto / Tourist** event pins use the **same** `MapPin` pipeline — host wizard is [`tasks/events/`](../events/); geo wiring is here.

| Item | Detail |
|------|--------|
| Tool on disk | ✅ `mdeapp/src/mastra/tools/search-events.ts` + Vitest logic tests |
| Pattern | **Supabase `events` first** — RLS hides unpublished rows; no service role in `mdeapp/src` |
| Pins | `mdeapp/src/lib/events/event-to-pin.ts` (or normalize in `normalize-tool-output` for `event`) |
| UI | **F49** `EventCard` / `PlaceResultCard` + `searchEventsTool` action mirror |
| Venue | Join `place_id` / lat/lng when present; card-only if no geo |
| Enrichment | Optional nightlife via MAP-006/011 after list — not required for Done |
| Search promos | **MAIC-008** / routing plan — disclaimer in card when stale |
| Depends | **F49** pin proof before Roberto track (**F33+**) |
| Done | ≥1 seeded dev event → card + venue pin on `/` |

## 6. Out of scope

- Grounding Lite (**MAP-002**)
- Places proxy (**MAP-005**)
- Production pin chrome / clustering (**MAP-008**, **MAP-009**)
- `routerAgent` (**F18**)
- `hostEventAgent` (**F34**)
- Layout polish (**MAP-007**)
- `packages/types/` monorepo package

## 7. Acceptance criteria

1. `MapPinSchema.safeParse` passes fixtures; rejects invalid coords.
2. `ToolResponseSchema` rejects LLM-only coords without tool provenance.
3. `/` HTTP 200; map region mounts `ChatMap` (three-region grid completed in **F48**).
4. Mock or test pin → ≥1 `[data-testid="map-pin"]` visible on localhost map inside `<Map mapId={...}>`.
5. Second category merge does not wipe first category pins.
6. No direct `setPins` outside MapContext (grep agents/components).
7. `npm run floor` exit 0.
8. CopilotKit **1.55.2** only — no v2 imports.
9. Evidence under `tasks/notes/MAP-001-evidence.md`.
10. `rg "loadGoogleMapsLibrary|react-wrapper" mdeapp/src` → 0.

## 8. Personas

- **Camila:** first chat + map proof for rentals path (F46 later).
- **Tourist:** shell ready for MAP-002 grounded cards.
- **Sofía:** single import path `@/platform/contracts`.

## 9. Verification checklist (100% Done gate)

> Master index: [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) (shared gates G1–G8).  
> Evidence: [`tasks/notes/MAP-001-evidence.md`](../notes/MAP-001-evidence.md).

### Shared gates

- [ ] G1–G8 from [VERIFICATION-CHECKLIST.md](./VERIFICATION-CHECKLIST.md#shared-gates-required-for-every-map-task)

### Unit (Vitest) — add under `mdeapp/src/platform/`

- [ ] `contracts/__tests__/map-pin.test.ts` — `MapPinSchema` rejects invalid lat/lng and missing provenance
- [ ] `contracts/__tests__/tool-response.test.ts` — rejects LLM-only coords without tool source
- [ ] `maps/__tests__/merge-pins-by-category.test.ts` — second category does not wipe first
- [ ] `maps/__tests__/normalize-tool-output.test.ts` — rental/event/restaurant fixtures parse
- [ ] `npm test -- platform` (or full suite) exit 0

### Integration / manual

- [ ] `npm install @vis.gl/react-google-maps` — lockfile shows pinned version
- [ ] `npm run dev` → `/` loads; `ChatMap` mounts inside F48 canvas (or standalone smoke before F48)
- [ ] ≥1 `[data-testid="map-pin"]` visible on map with `<Map mapId={...}>`
- [ ] `rg "setPins" mdeapp/src` — only `MapContext` / provider may call pin setters
- [ ] `rg "loadGoogleMapsLibrary|react-wrapper" mdeapp/src` → 0
- [ ] `rg "useRenderTool|CopilotKitProvider" mdeapp/src` → 0

### Browser / console (manual)

- [ ] No “AdvancedMarker requires mapId” warning in DevTools
- [ ] Single Maps load path (vis.gl `APIProvider` only)

### Not required for MAP-001 Done (F49 owns)

- [ ] Live `search-rentals` → pins (tracked in F49 + cross-task X2 in VERIFICATION-CHECKLIST)

## 10. Failure points & security

| Risk | Mitigation |
|------|------------|
| Port 3000 squatter | Next falls back to **3001** — relative `/api/copilotkit` is OK |
| Missing `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | Blocks AdvancedMarker — set before MAP-008 |
| Double `APIProvider` | One provider per tree — script load race if duplicated |
| Legacy `@react-google-maps/api` | **Reject** — vis.gl only |
| `NEXT_PUBLIC_*` Places key | **Forbidden** — server Places in MAP-004 only |
| Agent/tool name mismatch | F49 — registry key must match `useCopilotAction` `name` |

## 11. Rollback

Remove map components; contracts remain harmless if unused. `/` reverts to F19 placeholder layout.

## 12. Definition of Done

All §6 acceptance criteria + **§8 verification checklist** (every box checked) + G1–G8 evidence. Commit: `feat(maps): platform contracts + vis.gl chat shell (MAP-001)`.
