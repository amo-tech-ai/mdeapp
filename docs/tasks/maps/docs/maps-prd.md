---
doc_id: MAPS-PRD-V3
title: mdeai — Google Maps V2 Implementation Plan
version: 3.1
date: 2026-05-21
status: Active — execution plan for mdeapp/
stack: CopilotKit 1.55.2 + Mastra + AG-UI + Supabase + Gemini + Google Maps Platform
supersedes: plan/maps/drafts/maps-prd-v2.md (strategy); this file is the single entry point for engineering
sources:
  - plan/maps/drafts/maps-prd-v2.md
  - plan/maps/drafts/maps-plan.md
  - plan/maps/drafts/maps-tools-repos-samples-strategy.md
  - plan/maps/drafts/maps-samples-repos.md
  - plan/maps/drafts/maps-Best Google Maps GitHub repos.md
  - plan/maps/drafts/copilotkit-prd-structured-ai-os.md
  - plan/real-estate/draft/prd-real-estateV2.md
  - plan/real-estate/draft/roadmap.md
  - docs/CHAT-CENTRAL-PLAN.md
  - .claude/skills/mde-maps/SKILL.md
  - plan/maps/docs/prd-maps-doc.md
  - tasks/maps/notes.md (CopilotKit example routing + implementation strategy)
  - tasks/copilotkit/INDEX.md (CK-001–008 gap backlog; example paths in bound specs)
  - /home/sk/mde/src/ (legacy reference — freeze; port patterns only)
---

# mdeai — Google Maps V2 Implementation Plan

> **North star:** Google Maps is **spatial truth**, not the AI brain. **Supabase** owns inventory and commerce rows. **Mastra** orchestrates tools and workflows. **CopilotKit** renders chat, cards, and approvals. **Gemini** explains and ranks — it must never invent geo facts.

**Product proof layer:** When the concierge tells Camila *“this apartment works for remote work,”* the map must **prove** it — coworking pins, café density, commute minutes, and Google-sourced `place_id` / `placeUri`. Maps is the evidence UI, not the decision engine.

**Gemini / LLM must never invent (tools only):**

| Forbidden in model output | Source of truth |
|---------------------------|-----------------|
| `lat` / `lng` | Supabase rows or Places / Grounding tool |
| `place_id` | Places API or Grounding Lite |
| Maps URLs | `googleMapsLinks.placeUri` |
| Opening hours | Place Details (New) |
| Distances / durations | Routes API or `compute_routes` (parse `"180s"` strings) |

**Personas on this surface:** **Camila** (rentals + `/chat`), **Roberto** (event venue on `/host/event/new`), **Tourist** (restaurants/attractions), **Patricia** (quota + moderation).

---

## Repo truth (`mdeapp`, 2026-05-27)

> **Architecture:** [`tasks/ADK/docs/maps-adk-prd.md`](../../ADK/docs/maps-adk-prd.md) · **Execution:** [`tasks/maps/INDEX.md`](../../maps/INDEX.md) · **Audit:** [`maps-audit-plan.md`](./maps-audit-plan.md)

| | |
|--|--|
| **Built (archived)** | **MAP-001–004**, **007B**, **008**, **009**, **013–019**, **018B–F**, **030**, **031** — see [`../archive/maps-A/`](../archive/maps-A/README.md) |
| **Built (mdeapp)** | vis.gl + `ChatMap`, `MapContext` + `mergePinsByCategory`, `searchGroundedPlaces`, `GroundingAttribution`, Places client + `/api/places/*`, ADK sidecar |
| **In progress / open** | **MAP-005** (places-proxy + cache wiring), **006**, **010**, **011**, **012**, **012A**, **023**, **002A** |
| **Blocked** | Cost-safe Places until **MAP-005**; prod grounding until **MAP-002B**; Map ID on Vercel until **MAP-008B** |
| **Proof** | F49 Done = ≥3 cards + ≥3 `[data-testid="map-pin"]` on `/` · `npm run verify:maps` |
| **PR track** | Platform ✅ → **MAP-005** → 006 → 012A → 012 → 010 → 011 — [`../INDEX.md`](../INDEX.md) |
| **Readiness** | **74/100** localhost MVP · **58/100** prod cost-safe (audit 2026-05-27) |

**Agent roster in §6.6:** design reference only — **ship tools on `conciergeAgent`**, not separate map agents, until post-MVP.

---

## Document map

| § | Topic |
|---|--------|
| 1 | Current-state audit |
| 2 | Repo & article review table |
| 3 | Recommended Maps stack |
| 4 | Core features |
| 5 | Advanced features |
| 6 | CopilotKit + Mastra integration (§6.1–6.8; §6.8 = example routing) |
| 7 | Phased roadmap (Core → MVP → Post-MVP → Advanced) |
| 8 | Suggested implementation order |
| 9 | Testing & verification |
| 10 | Final recommendation + Cursor checklist |

**Canonical strategy detail:** [`drafts/maps-prd-v2.md`](./drafts/maps-prd-v2.md) (Colombia corrections, field masks, removed US-only APIs).

**Unified Maps + ADK + Gemini architecture (canonical):** [`plan/ADK/maps-adk-prd.md`](../../plan/ADK/maps-adk-prd.md) — layer model, routing, ADK sidecar, execution order aligned with `tasks/maps/`.

**ADK program (Skills, CLI, Phase 3):** [`plan/ADK/prd-adk.md`](../../plan/ADK/prd-adk.md).

---

## 1. Current-state audit

### 1.1 What already exists

| Area | Location | State |
|------|----------|--------|
| **Planning** | `plan/maps/drafts/*`, `tasks/maps/docs/maps-audit-plan.md` | PRD v3.1 + forensic audit 2026-05-27 |
| **Skills + MCP** | `.claude/skills/mde-maps/`, Grounding Lite MCP, Maps Code Assist | Documented; dev-time verification |
| **Clones** | `github/maps/*` (10 repos) | Local reference; not imported into `mdeapp/` |
| **Map platform** | `mdeapp/src/platform/maps/`, `components/maps/` | **Shipped** — MapContext, merge-by-category, ChatMap, clustering |
| **CopilotKit + map shell** | F48/F49/F50 (archived) | Three-panel `/` chat + map + results |
| **Mastra map tools** | `search-grounded-places.ts`, rental/event search | Grounding ✅; nearby/autocomplete pending MAP-005/006/010 |
| **Places client** | `mdeapp/src/mastra/lib/google-places-client.ts` | Field masks enforced; detail/photo routes wired |
| **ADK sidecar** | `services/adk-grounding/` | Grounding Lite MCP; prod deploy partial |
| **Legacy reference** | `/home/sk/mde/src/components/map/*` | Hard-frozen; patterns ported to mdeapp |
| **Env keys** | `mdeapp/.env.example` | Browser Maps JS + server Places split |
| **Hooks** | `places-api-field-mask.mjs`, `advanced-marker-needs-mapid.mjs` | **Active** PreToolUse |
| **Tests** | `platform/maps/__tests__/`, `e2e/maps-*.spec.ts` | Vitest + Playwright maps coverage |

### 1.2 What is missing (real blockers)

| Gap | Impact |
|-----|--------|
| No `places-proxy` edge + mdeapp cache read-through | Repeat Places queries bill Google (**MAP-005**) |
| `searchNearby` / autocomplete not in product tools | MAP-006, MAP-010 blocked on MAP-005 |
| `route_cache` table | MAP-011 commute cache (**data-033**) |
| Prod ADK URL + token on Vercel | Grounding fails off localhost (**MAP-002B**) |
| Vercel Map ID verification | Advanced Markers absent on preview/prod (**MAP-008B**) |
| Geo inventory gaps on inventory tables | Pin holes for events/restaurants (**data-034**) |
| Advanced marker UX polish | Post-MVP (**MAP-034**) — z-index, price badges, mobile sheet |

### 1.3 What is risky

| Risk | Severity | Note |
|------|----------|------|
| **Dual stack** — re-implement maps only in legacy `/home/sk/mde` | High | All new work lands in **`mdeapp/`** only |
| **LLM-invented geo** — lat/lng/place_id in prompts | High | Zod + tool-only retrieval; reject free-text coords |
| **Places key in browser** | High | Places (New) only via edge/Mastra; browser key = Maps JS only |
| **Missing field masks** | High | Bill shock; hook + registry required per call |
| **`generativeSummary` / `neighborhoodSummary` in CO** | Medium | US-only — use offline Gemini → `ai_summary` column |
| **Hand-built Maps URLs** | Medium | Use `googleMapsLinks.placeUri` only |
| **`compute_routes` duration** | Medium | Duration is string `"180s"` — parse, don’t treat as number |
| **Contextual View / Imagery Grounding** | Medium | Pre-GA or invite-only — **defer** |
| **CopilotKit v1/travel example** | Low | Uses **Leaflet/OSM**, not Google — layout/HITL only |
| **ag-ui-adk-grounding-app** | Low | **ADK + Python** — not Mastra; UX reference only |
| **Second Maps loader (ECL `<gmpx-api-loader>`)** | Medium | One loader via vis.gl `APIProvider` |

### 1.4 Delete · defer · keep

| Item | Verdict |
|------|---------|
| Legacy custom SSE `mdeai_actions` without Zod | **Delete** in new app — AG-UI + typed actions only |
| Leaflet / OSM in product | **Defer** — Google Maps is Phase 1 |
| Maps Imagery Grounding, Contextual View widget | **Defer** until GA |
| `neighborhoodSummary` / Places `generativeSummary` for Medellín | **Delete** from masks |
| Multi-agent map fan-out, Computer-use CLI for maps | **Delete** from active scope |
| `googlemaps-samples` monorepo install into `mdeapp` | **Avoid** — copy patterns only |
| Entire `/home/sk/mde/src/components/map/*` | **Keep as reference**, port surgically to `mdeapp` |
| `github/maps/js-api-samples` | **Keep** — pattern library |
| `grounding-lite-mcp-sample-app` | **Keep** — MCP transport + `pageSize` |
| `CopilotKit/examples/integrations/mastra` | **Keep** — runtime wiring |
| `CHAT-CENTRAL-PLAN` tool envelope | **Keep** — `ToolResponse` + `considered_but_rejected` |
| Draft PRDs under `plan/maps/drafts/` | **Keep** — deep reference; this file is the exec summary |

**Production readiness (today):** Platform **~74/100** localhost MVP · **~58/100** prod cost-safe (audit 2026-05-27). Target **~83/100** after MAP-005 + prod ADK.

---

## 2. Repo & article review table

| # | URL / path | Score | mdeai use case | Action | Study these paths | Phase |
|---|------------|------:|----------------|--------|-------------------|-------|
| 1 | [vis.gl/react-google-maps](https://github.com/visgl/react-google-maps) · `github/maps/react-google-maps` | **98** | Primary React map: `APIProvider`, `Map`, `AdvancedMarker`, hooks | **Install** `@vis.gl/react-google-maps` | `src/components/map/index.tsx`, `website/src/examples/advanced-marker.mdx`, `marker-clustering.mdx`, `autocomplete.mdx`, `routes-api.mdx` | MVP (step 7) |
| 2 | [googlemaps/js-api-samples](https://github.com/googlemaps/js-api-samples) · `github/maps/js-api-samples` | **94** | Official patterns for every API | **Reference only** | `samples/advanced-markers-*`, `place-details-*`, `nearby-search-*`, `marker-clustering-*` | All |
| 3 | [googlemaps/grounding-lite-mcp-sample-app](https://github.com/googlemaps-samples/grounding-lite-mcp-sample-app) · `github/maps/grounding-lite-mcp-sample-app` | **96** | MCP `search_places`, `compute_routes`, `lookup_weather` | **Reference** (ADK MapsAgent in MAP-002) | `mcpServer.ts`, `services/groundingLiteService.ts` | MAP-002 |
| 4 | [googlemaps/js-markerclusterer](https://github.com/googlemaps/js-markerclusterer) · `github/maps/js-markerclusterer` | **92** | Dense rental/event pins | **Install** `@googlemaps/markerclusterer` | `src/markerclusterer.ts`, `examples/custom-renderer.html` | MVP (step 9) |
| 5 | [googlemaps/extended-component-library](https://github.com/googlemaps/extended-component-library) · `github/maps/extended-component-library` | **88** | Place overview, mobile sheet, autocomplete UI | **Install later** — **never** second api-loader | `src/place_overview/`, `src/overlay_layout/`, `examples/react_sample_app/` | Post-MVP |
| 6 | [googlemaps/google-maps-services-js](https://github.com/googlemaps/google-maps-services-js) · `github/maps/google-maps-services-js` | **90** | Server Places/Routes/Geocoding from edge | **Reference** (or thin fetch wrapper) | Client examples for Nearby/Text Search | MVP (step 5–6) |
| 7 | [googlemaps/platform-ai](https://github.com/googlemaps/platform-ai) · `github/maps/platform-ai` | **85** | Maps AI tooling docs/samples | **Reference** | README + sample agents | Advanced |
| 8 | [googlemaps/react-wrapper](https://github.com/googlemaps/react-wrapper) · `github/maps/react-wrapper` | **72** | Older wrapper | **Avoid** — superseded by vis.gl | — | — |
| 9 | [googlemaps/codelab-maps-platform-101-react-js](https://github.com/googlemaps/codelab-maps-platform-101-react-js) · `github/maps/codelab-maps-platform-101-react-js` | **91** | End-to-end React + vis.gl + clusterer | **Copy patterns** | `solution/src/app.tsx` (AdvancedMarker + MarkerClusterer) | MVP |
| 10 | [Greyisheep/ag-ui-adk-grounding-app](https://github.com/Greyisheep/ag-ui-adk-grounding-app) · `github/copilotkit/ag-ui-adk-grounding-app` | **75** | Generative UI + Vertex **ADK** `GoogleMapsGroundingTool` | **Reference only** — `HttpAgent`→Python ADK; **no map panel**; not Grounding Lite MCP | `page.tsx` (`useCopilotAction`+`render`), `agent/agent.py` (sub-agent pattern) | — |
| 11 | [CopilotKit/examples/integrations/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | **99** | Runtime + `useCoAgent` base | **Copy wiring** | `src/app/api/copilotkit/route.ts`, `MastraAgent.getLocalAgents` | Core (F01) |
| 11b | [CopilotKit/examples/canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) | **96** | Zod co-agent / canvas state | **Copy schemas** | `src/lib/canvas/state.ts` | Core (MAP-001) |
| 12 | [CopilotKit/examples/v1/travel](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/travel) | **65** | Progress UI, split layout, HITL | **Layout/HITL only** — map is **Leaflet/OSM**; Places search is **LangGraph Python**, not Mastra | `lib/hooks/use-trips.tsx` (`useCoAgentStateRender`), `SearchProgress.tsx`, `humanInTheLoop/*` — **not** `MapCanvas.tsx` | MAP-007 |
| 13 | [dev.to — CopilotKit travel planner](https://dev.to/copilotkit/build-an-ai-travel-planner-with-copilotkit-langgraph-google-maps-api-32fm) | **65** | LangGraph + Maps narrative | **Avoid stack** — port UX ideas only | Article diagrams | — |
| 14 | [dev.to — ADK Maps grounding](https://dev.to/greyisheepai/understanding-google-maps-grounding-with-adk-part-25-476) | **60** | Grounding concepts | **Reference** | Attribution + tool flow | Core |
| 15 | `CopilotKit/examples` generative-ui, form-filling, banking | **88–94** | `useCopilotAction` cards, HITL | **Reference** | `generative-ui/`, `banking/` | MVP |
| 16 | [google-gemini/cookbook](https://github.com/google-gemini/cookbook) | **82** | Structured output + tool-call patterns | **Reference** | Maps / tool-calling notebooks | Core |
| 17 | [cablate/mcp-google-map](https://github.com/cablate/mcp-google-map) | **70** | Alternate MCP shapes | **Research only** — do not ship | README | — |

*Beginner summary doc:* [`docs/prd-maps-doc.md`](./docs/prd-maps-doc.md) — merged into this file 2026-05-20.

---

## 3. Recommended Maps stack

| Layer | Technology | Role in mdeai |
|-------|------------|---------------|
| **React map** | `@vis.gl/react-google-maps` | `APIProvider`, `Map`, `AdvancedMarker`, `useMap` |
| **Maps JS** | Dynamic Maps API | Tiles, camera, events |
| **Markers** | `AdvancedMarkerElement` via vis.gl | All pin categories |
| **Clustering** | `@googlemaps/markerclusterer` | Rentals/events at scale |
| **Map ID** | Cloud Console Map ID → `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | **Required** for Advanced Markers in prod |
| **Places (New)** | Text Search, Nearby, Details, Photos, Autocomplete | Server-only + field masks |
| **Routes** | Routes API + Grounding Lite `compute_routes` | Commute / “10 min from metro” |
| **Grounding Lite MCP** | `mapstools.googleapis.com/mcp` | Live discovery when DB thin |
| **Gemini Maps grounding** | Optional concierge panel | After Lite path stable |
| **Platform AI / Code Assist** | MCP `google-maps-code-assist` | Pre-PR doc verification — **dev only** |
| **ECL** | `@googlemaps/extended-component-library` | Mobile sheet, place overview — **feature-flag**; no duplicate loader |
| **Server SDK** | `google-maps-services-js` or `fetch` + mask registry | Edge `places-proxy` |
| **Not in stack** | Leaflet, Mapbox, hand-rolled script tags, ADK runtime | — |

**Env split (mandatory):**

```text
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY     → browser (Maps JS only, referrer-restricted)
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID      → browser (Advanced Markers)
GOOGLE_PLACES_API_KEY               → server / edge / Mastra tools only
GOOGLE_MAPS_API_KEY / ROUTES        → edge functions only
```

---

## 4. Core features

### 4.1 Pin taxonomy (`MapPinCategory`)

| Category | Color/icon | Source | Persona |
|----------|------------|--------|---------|
| `rental` | Teal / home | Supabase `apartments` | Camila |
| `event` | Purple / calendar | Supabase `events` | Roberto / Tourist |
| `restaurant` | Orange / fork | Supabase `restaurants` | Tourist |
| `attraction` | Blue / star | Supabase `tourist_destinations` | Tourist |
| `grounded` | Silver / sparkle | Grounding Lite / Places live | All |
| `selected` | Ring + z-index bump | UI state | All |

**Rule:** `MapContext` is the **only** writer of pins. CopilotKit actions call `mergePinsByCategory(category, pins)` — never raw `setPins` replace-all.

### 4.2 MapContext contract (single source of pin truth)

```typescript
// mdeapp/src/context/MapContext.tsx (target)
type MapContextValue = {
  pins: MapPin[];
  selectedPinId: string | null;
  highlightedPinId: string | null;
  viewport: LatLngBounds | null;
  mergePinsByCategory: (category: MapPinCategory, pins: MapPin[]) => void;
  setSelectedPinId: (id: string | null) => void;
  clearCategory: (category: MapPinCategory) => void;
};
```

Expose **read-only** slices to `useCoAgent` state (`mapPins`, `selectedPinId`) — agent proposes pin payloads; **renderer** commits to MapContext.

### 4.3 Feature specs

| Feature | Behavior | Data source |
|---------|----------|-------------|
| **Rental pins** | ≤5 cards + pins; price badge optional | `rental-search-workflow` → Supabase |
| **Event pins** | Venue + nearby dining | `events` + Nearby Search |
| **Restaurant / attraction pins** | DB-first search tools | `restaurants`, `tourist_destinations` |
| **Grounded place pins** | Live query; attribution required | `searchGroundedPlaces` |
| **Selected pin** | Click pin ↔ highlight card; `aria-current` | MapContext |
| **Map card previews** | `MdeInfoWindow` or ECL sheet (mobile) | Pin `meta` |
| **Inline CopilotKit cards** | `RentalCard`, `PlaceInfoCard`, `NeighborhoodCard`, `CommuteCard` | `useCopilotAction({ render })` |
| **Map ↔ chat sync** | Select card → pan/zoom; select pin → scroll card | Shared `selectedPinId` |
| **Show nearby** | Button on rental card → Nearby Search 800m | `places:searchNearby` |
| **Near coworking** | `includedTypes: ['coworking_space']` + rank | Places + nomad score |
| **Near nightlife** | `bar`, `night_club` density | Places types |
| **10 min from metro** | Routes API to nearest `subway_station` | Routes + threshold filter |
| **Quiet cafés nearby** | `cafe` + quietness score from Places + editorial | Neighborhood workflow |

### 4.4 Typed map actions (Zod)

Co-locate schemas in `mdeapp/src/platform/contracts/` (MAP-001):

```typescript
export const MapPinSchema = z.object({
  id: z.string(),
  category: z.enum(['rental','event','restaurant','attraction','grounded']),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  placeId: z.string().optional(),        // Google place id — never LLM-guessed
  placeUri: z.string().url().optional(), // from googleMapsLinks only
  title: z.string(),
  meta: z.record(z.unknown()).optional(),
});

export const GroundedPlaceResultSchema = MapPinSchema.extend({
  category: z.literal('grounded'),
});

export const SetMapPinsActionSchema = z.object({
  type: z.literal('SET_MAP_PINS'),
  category: MapPinSchema.shape.category,
  pins: z.array(MapPinSchema).max(50),
  clearOthers: z.boolean().default(false),
});
```

### 4.5 Rentals map — Camila flow (end-to-end)

**Example prompt:** *“Show me 1BR apartments in Laureles under $1,500 near coworking.”*

```text
CopilotKit chat (/chat)
  → Mastra rental-discovery workflow
  → Supabase apartments (RLS-safe filters)
  → Places Nearby Search (coworking_space, 800m bias)
  → Hermes / rule rerank (≤5)
  → RentalCard[] + rental pins on map
```

**Rental pin chrome (on-map):** price badge (COP), Wi‑Fi score chip, rating, neighborhood label, **selected** ring state, click → card preview (`MdeInfoWindow` or mobile sheet).

### 4.6 Nearby intelligence (per listing)

Triggered by **“Show nearby”** on `RentalCard` or follow-up *“what’s around this one?”*

| Signal | Places / Routes | Cached in |
|--------|-----------------|-----------|
| Cafés nearby | Nearby Search `cafe` | `places_cache` |
| Coworking nearby | `coworking_space` | same |
| Gyms nearby | `gym` | same |
| Metro distance | Routes → nearest `subway_station` | `places_search_cache` |
| Nightlife distance | `bar`, `night_club` density | offline hood profile |
| Quietness score | Editorial + café density inverse | `neighborhood_profiles` |

APIs: **Places Nearby + Details**, **Routes API**, optional Grounding Lite when DB has no anchor listing.

### 4.7 Grounded place search

**Example:** *“quiet cafés near Parque Lleras”*

```text
User prompt
  → Mastra searchGroundedPlaces
  → Maps Grounding Lite MCP (pageSize: 5, locationBias Medellín)
  → Zod GroundedPlaceResult[] (alias of MapPin category=grounded)
  → CopilotKit PlaceInfoCard + GroundingAttribution
  → MapContext.mergePinsByCategory('grounded', pins)
```

---

## 5. Advanced features

| Feature | Description | Phase | Owner |
|---------|-------------|-------|-------|
| **Neighborhood intelligence** | Laureles/Poblado/Envigado profiles + POI density probes | Post-MVP | Mastra `neighborhood-intelligence-workflow` |
| **Commute scoring** | Routes to coworking/metro; parse duration string | Post-MVP | Hermes batch + live Routes |
| **Digital nomad score** | Wi‑Fi + cowork + café density (§5.2 real-estate PRD) | Post-MVP | Supabase + Places |
| **Venue intelligence** | Roberto venue compare, sponsor tier | MVP (events) | Places Details |
| **Route previews** | Polyline on map | Post-MVP | `compute_routes` |
| **Nearby recommendations** | Cross-vertical “after showing” | MVP | Nearby Search |
| **Place photo cards** | Photo media via Place Photos (New) | MVP | Edge `place-photo` |
| **Grounded AI recommendations** | Gemini + Lite fallback | MVP | `searchGroundedPlaces` |
| **Map itinerary planner** | `trips` / `trip_items` | Advanced | Supabase + map |
| **Real estate lifestyle scoring** | Rank explanations on cards | Post-MVP | Hermes offline |
| **Lifestyle match** | “Quiet remote work” vs “nightlife” persona tags on hood cards | Post-MVP | Router + `neighborhood_profiles` |
| **Grounding Lite weather** | Event outdoor / terrace copy | Later | `lookup_weather` (`unitsSystem` camelCase) |

**Colombia constraint:** All neighborhood **copy** from offline Gemini → `ai_summary` / `neighborhood_profiles` — not Places `generativeSummary`.

---

## 6. CopilotKit + Mastra integration

> **Deep routing:** [`tasks/maps/notes.md`](./notes.md) · `CopilotKit/examples/canvas/mastra/` ([F50](../archive/copilot-A/F50-copilotkit-map-ui-state.md)), `CopilotKit/examples/v1/travel/` (layout only — [MAP-007B](../archive/maps-A/MAP-007-chat-three-panel-polish.md)).

### 6.1 Architecture (one page)

**Rule:** CopilotKit connects **chat** to **Mastra**; Google Maps runs in **Mastra tools + vis.gl** — not inside CopilotKit runtime adapters for ADK/LangGraph.

```text
Camila types in CopilotSidebar
  → POST /api/copilotkit (CopilotRuntime + MastraAgent.getLocalAgents({ mastra }))
  → pingAgent | conciergeAgent | rentalAgent (router — names must match useCoAgent)
  → Mastra tool (Grounding Lite MCP / Places New) — server keys only
  → Zod ToolResponse → normalize-tool-output → mergePinsByCategory
  → useCopilotAction({ available: "disabled", render }) mirrors tool cards
  → MapContext (sole pin writer)
  → <APIProvider><Map mapId={...}><AdvancedMarker /></Map>
```

**Do not wire:** `HttpAgent` → ADK (`ag-ui-adk-grounding-app`) or `LangGraphHttpAgent` → travel Python — wrong orchestrators for `mdeapp`.

### 6.2 `useCoAgent` shared map state

```typescript
// Schemas: mdeapp/src/platform/contracts/ (MAP-001) — keep in sync with agent Zod working memory
const MapUiStateSchema = z.object({
  selectedPinId: z.string().nullable(),
  activeCategories: z.array(z.string()),
  lastSearchBounds: z.object({ north: z.number(), south: z.number(), east: z.number(), west: z.number() }).optional(),
});

useCoAgent<MapUiState>({
  name: 'pingAgent', // Phase 1; → conciergeAgent after F18 — key must match Mastra({ agents: { ... } })
  initialState: { selectedPinId: null, activeCategories: [] },
});
```

**Pattern:** Agent **reads** map context; **writes** pins only via tool → `normalize-tool-output` → `MapContext` — never `setPins` from chat hooks.

**From `v1/travel` (layout/progress only):** `useCoAgentStateRender` while `search_progress` / `groundingProgress` streams — see `SearchProgress.tsx`; implement with Mastra-emitted state, not LangGraph `copilotkit_emit_state`.

### 6.3 `useCopilotAction` — render cards

| Action name | render | Tool mirror |
|-------------|--------|-------------|
| `showRentalResults` | `RentalCard` list | `search_rentals` |
| `showGroundedPlaces` | `PlaceInfoCard` + `GroundingAttribution` | `search_grounded_places` |
| `showNeighborhood` | `NeighborhoodCard` | `neighborhood_intel` |
| `showCommute` | `CommuteCard` | `compute_commute` |

Register with `available: "disabled"` on the tool side; UI action owns `render`.

### 6.4 `renderAndWaitForResponse` (HITL)

Use for: **showing time confirm**, **landlord forward**, **publish venue** — not for pin display.

```typescript
useCopilotAction({
  name: 'confirmShowingSlot',
  renderAndWaitForResponse: ({ args, respond }) => (
    <ShowingConfirmCard slots={args.slots} onConfirm={(t) => respond({ approved: true, slot: t })} />
  ),
});
```

### 6.5 Mastra tools & workflows

| Unit | File (target) | Purpose |
|------|---------------|---------|
| `searchGroundedPlaces` | `mdeapp/src/mastra/tools/search-grounded-places.ts` | Wrap Grounding Lite MCP; `pageSize: 5`; locationBias Medellín |
| `searchRentals` | `mdeapp/src/mastra/tools/search-rentals.ts` | Supabase + vector; emit `MapPin[]` |
| `rentalDiscoveryWorkflow` | `mdeapp/src/mastra/workflows/rental-search.ts` | Filter → enrich top 8 (Places mask) → rerank ≤5 |
| `venueDiscoveryWorkflow` | `mdeapp/src/mastra/workflows/venue-discovery.ts` | Roberto venue + Nearby restaurants |
| `nearbyIntelligenceWorkflow` | `mdeapp/src/mastra/workflows/nearby-intel.ts` | “Show nearby” / coworking / metro commute |

**Grounding client:** ADK sidecar (MAP-002) uses shapes from `github/maps/grounding-lite-mcp-sample-app/mcpServer.ts` + `services/groundingLiteService.ts` — server env key only.

**Places client:** `mdeapp/src/mastra/lib/google-places-client.ts` (MAP-004) — mask registry in `tasks/maps/places-mask-checklist.md`.

### 6.6 Mastra agent roster (target — not eight orchestrators day 1)

Ship as **tools + workflows** on one concierge router first; split agents when eval harness demands it.

| Agent / role | Job | Phase |
|--------------|-----|-------|
| **Maps Router** | Classify `rental_search` \| `grounded_places` \| `nearby` \| `venue` \| `route` \| `neighborhood` | MVP |
| **Rental Discovery** | Listings + map pins + nomad rank | MVP |
| **Grounded Places** | Grounding Lite MCP only | Core |
| **Neighborhood** | Compare Laureles / Poblado / Envigado | Post-MVP |
| **Venue** | Roberto event venue + approval | MVP |
| **Nearby** | Cafés, gyms, coworking around a pin | MVP |
| **Route** | Commute + `compute_routes` parse | Post-MVP |
| **Evaluation** | NDCG / pin-count / attribution smoke | MVP (batch) |

### 6.7 Core workflows (canonical four)

**WF1 — Rental search**  
Parse budget/neighborhood → Supabase `apartments` → enrich top N with Places nearby → Hermes rerank → cards + `rental` pins.

**WF2 — Show nearby**  
User clicks **Show nearby** → read listing `lat/lng` → Nearby Search (typed mask) → write `places_cache` → `grounded`/`restaurant` pins + small cards (do not wipe `rental` pins).

**WF3 — Grounded AI search**  
Open-ended place question → `searchGroundedPlaces` → MCP → Zod validate → attribution → `mergePinsByCategory('grounded')`.

**WF4 — Venue discovery (Roberto)**  
Host describes event → Autocomplete / Text Search → venue cards + `event` pins → **`renderAndWaitForResponse`** approve → persist `google_place_id` + `placeUri` on `events` row.

### 6.8 CopilotKit example routing (2026-05-21)

Three vendored patterns — **only the Mastra column is production**:

| Concern | **mdeapp (ship)** | `integrations/mastra` | `v1/travel` | `ag-ui-adk-grounding-app` |
|---------|-------------------|----------------------|-------------|---------------------------|
| Runtime bridge | `getLocalAgentsWithLogging({ mastra })` | Same | `LangGraphHttpAgent` | `HttpAgent` → ADK :8000 |
| Google “maps” in agent | Grounding Lite MCP + Places (New) in **TS Mastra** | N/A in example | Legacy `googlemaps` Python in `search.py` | Vertex `GoogleMapsGroundingTool` (ADK) |
| Map on screen | vis.gl + `mapId` + `AdvancedMarker` | No map | **Leaflet OSM** `MapCanvas` | **No map UI** — chat/cards only |
| Copy from example | — | Runtime, `useCoAgent`, sidebar | `useCoAgentStateRender`, HITL `renderAndWait`, 40/35/25 layout | `useCopilotAction` + `render`, sub-agent-as-tool *idea* |
| Bound MAP tasks | MAP-001–012 | F01, MAP-001 | MAP-007 | — (do not integrate) |

**Why travel README says “Google Maps”:** the **agent** calls Google Places; the **widget** is OSM. For Camila’s rental pins, use **MAP-001** vis.gl — not `travel/components/MapCanvas.tsx`.

---

## 7. Phased roadmap

### 7.1 Core (W2–W3 foundation — blocks everything)

| Feature | Files to create/modify | Tests | Success criteria | Risks | Proof |
|---------|------------------------|-------|------------------|-------|-------|
| **Stable Maps loader** | `src/lib/google-maps-loader.ts` (singleton, StrictMode-safe, `gm_authFailure`) | boot test | One `importLibrary` path; no double script | Race on HMR | Console clean on `/chat` |
| Supabase geo columns | migrations: `google_place_id`, `maps_url`, `lat`, `lng` on listings/venues | SQL | Non-null on seed rows | Missing on enrich | `select` proof |
| Typed action schemas | `src/platform/contracts/`, `src/platform/maps/normalize-tool-output.ts` | Vitest schema tests | Invalid pin payload fails Zod | Schema drift vs agent | `npm test` green |
| Runtime pipeline proof | `src/mastra/tools/search-grounded-places.ts`, `src/app/chat/page.tsx`, `MapContext.tsx` | `tests/maps/action-pipeline.spec.ts` | 1 chat → ≥3 `grounded` pins on map | SSE format mismatch | Screenshot + `curl` copilotkit |
| Grounding attribution | `src/components/maps/GroundingAttribution.tsx` | Vitest render | Roboto, `translate="no"`, contrast | Missing on one surface | Playwright snapshot |
| Map ID + APIProvider | `src/components/maps/MdeMap.tsx`, `.env.example` | `map-id.test.ts` | `data-mapid-present=true` | DEMO_MAP_ID in prod | Build + preview URL |

### 7.2 MVP (W4–W6 — Camila + Roberto paths)

| Feature | Files | Tests | Success criteria | Risks | Proof |
|---------|-------|-------|------------------|-------|-------|
| Places field-mask client | `src/lib/google/places-client.ts`, `supabase/functions/places-proxy/` | mask unit tests | Every request logs mask header | Wide mask SKU blast | Network log in test |
| `places_cache` migration | `supabase/migrations/*_places_cache.sql` | RLS tests | Cache hit on repeat query | RLS leak | SQL `select` |
| Nearby Search | tool + `showNearby` on RentalCard | integration | 5 POIs within 800m | Radius cost | Staging demo |
| vis.gl migration | `MdeMap.tsx`, remove legacy loader duplication | Playwright | Pins render Medellín center | Double loader | Mobile + desktop screenshot |
| Advanced markers | `MdeMarker.tsx`, `pinContent.ts` | a11y | `mapId` on parent `<Map>` | Marker without mapId | Hook blocks bad PR |
| Marker clustering | `MdeMarkerCluster.tsx` | pin count test | 50 pins → clusters | Cluster race | Dense map screenshot |
| Place autocomplete | host event form | e2e | `google_place_id` saved | Session token misuse | DB row |
| Route preview (light) | `CommuteCard` + routes tool | parse duration | Shows minutes, not raw string | Unparsed `"180s"` | Unit test |
| DB-backed search tools | `search-rentals`, `search-events`, restaurants/attractions | floor | Real pins from Supabase | Mock data left in | `npm run floor` |

### 7.3 Post-MVP

| Feature | Files | Tests | Success criteria |
|---------|-------|-------|------------------|
| Neighborhood intelligence workflow | `workflows/neighborhood-intel.ts` | golden queries | Hood card without US summaries |
| Place Photos on cards | `place-photo` edge | load test | Photo on open only |
| ECL mobile sheet | `MdeMobileSheet.tsx` + flag | 390px Playwright | Single Maps bootstrap |
| Gemini Maps grounding panel | optional tool config | manual | Attribution + fallback |
| Cross-vertical itinerary | `trips` tables | e2e | Pins persist per trip |

### 7.4 Advanced

| Feature | Notes |
|---------|--------|
| Map-based itinerary planner | Multi-day `trip_items` |
| Predictive nomad scoring | Hermes + labeled leads |
| Influencer/sponsor geo | Events module crossover |
| 3D / deck.gl overlays | **Not Phase 1** |
| WhatsApp map links | Static map image URL — OpenClaw only |

---

## 8. Suggested implementation order

Canonical sequence (override only if runtime proof fails step 1):

| Step | Work item | MAP task IDs (suggested) | Exit proof |
|------|-----------|--------------------------|------------|
| 1 | **Runtime action pipeline** | MAP-001 | Chat → Zod action → MapContext pins |
| 2 | **Grounding tool + attribution + quota** | MAP-002 | ≥3 places, valid `placeId`, legal badge (ex–MAP-003 merged) |
| 3 | *(reserved)* | — | Do not create MAP-003; attribution is in MAP-002 |
| 4 | **Places API New client + mask registry** | MAP-004 | Logged mask per endpoint |
| 5 | **`places_cache` + `places-proxy` edge** | MAP-005 | Second query cache hit |
| 6 | **Nearby Search** | MAP-006 | “Show nearby” on rental card |
| 7 | **`/chat` three-panel polish** | MAP-007 | Shell in MAP-001; polish + mobile sheet |
| 8 | **Advanced markers + mapId** | MAP-008 | Prod Map ID in Vercel |
| 9 | **Marker clustering** | MAP-009 | 50-pin cluster screenshot |
| 10 | **Place autocomplete** | MAP-010 | Roberto venue `place_id` |
| 11 | **Route previews / commute** | MAP-011 | “10 min metro” card |
| 12 | **Neighborhood intelligence** | MAP-012 | Laureles vs Poblado card |

Aligns with [`drafts/maps-plan.md`](./drafts/maps-plan.md) §3 and real-estate **RE-004–RE-007** (places-proxy, cache, enrich).

---

## 9. Testing and verification

### 9.1 Vitest (`mdeapp/` — wire at F09)

| Suite | Asserts |
|-------|---------|
| `maps/actions.schema.test.ts` | Zod rejects missing `lat`, invented `placeUri` |
| `maps/normalize-tool-output.test.ts` | Tool output → `SET_MAP_PINS` |
| `maps/places-client.masks.test.ts` | Each endpoint uses allowed mask from registry |
| `maps/parse-duration.test.ts` | `"180s"` → `180` seconds |
| `maps/attribution.test.tsx` | `GroundingAttribution` has `translate="no"` |

### 9.2 Playwright

| Spec | Asserts |
|------|---------|
| `tests/e2e/maps-pins.spec.ts` | `data-testid="map-pin"` count matches card count |
| `tests/e2e/maps-grounded.spec.ts` | Grounded query shows attribution text “Google Maps” |
| `tests/e2e/maps-selection.spec.ts` | Click pin highlights card |
| `tests/e2e/host-venue-autocomplete.spec.ts` | Roberto flow saves `google_place_id` |
| `tests/e2e/maps-mobile-390.spec.ts` | **390×844** — map + chat usable; pin tappable | Mobile map test (from `prd-maps-doc`) |

### 9.3 Integration / ops

| Check | Command / tool |
|-------|----------------|
| Map ID present | `expect(page.locator('[data-mapid-present=true]'))` |
| Field mask | DevTools → places-proxy request headers |
| Cache hit | SQL `places_cache` or `places_search_cache` |
| RLS | Supabase MCP / pgTAP — anon cannot read cache admin rows |
| Quota | `grounding_quota_log` row per session |
| Floor gate | `cd mdeapp && npm run floor` (when wired) |
| Localhost proof | `npm run dev` + `curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/chat` |

### 9.4 Anti-patterns (fail review)

- Places API called from browser
- `AdvancedMarker` without parent `mapId`
- LLM returns coordinates not from tool payload
- Grounded card without attribution
- `setPins(all)` wiping other categories

---

## 10. Final recommendation

### 10.1 Best architecture

See **[`plan/ADK/maps-adk-prd.md`](../../plan/ADK/maps-adk-prd.md)** §3–§5. Summary:

```text
CopilotKit + vis.gl → Mastra (Gemini + Supabase tools) → ADK sidecar (Grounding Lite)
                              ↓
                    Places (New) via edge + masks + cache
                              ↓
                    MapContext → AdvancedMarker
```

Google **never** chooses inventory — Mastra validates; ADK/Places supply geo facts only.

### 10.2 Best repos to use first

1. `CopilotKit/examples/integrations/mastra` — runtime (`getLocalAgents`)  
2. `CopilotKit/examples/canvas/mastra` — Zod / `useCoAgent` state  
3. `github/maps/grounding-lite-mcp-sample-app` — MCP tool (MAP-002)  
4. `github/maps/react-google-maps` — vis.gl UI (MAP-001)  
5. `github/maps/codelab-maps-platform-101-react-js` — clusterer + AdvancedMarker (MAP-009)  
6. `CopilotKit/examples/v1/travel` — **progress + layout only** (MAP-007)  

**Reference only (do not wire):** `ag-ui-adk-grounding-app`, LangGraph travel agent, `dev.to` travel article.

### 10.3 Do not build now

- Contextual View widget, Maps Imagery Grounding  
- Full route planner / turn-by-turn, **Navigation SDK**, turn-by-turn nav UX  
- 3D maps, heatmaps, Deck.gl  
- **Fleet tracking**, **Android/iOS Maps SDKs** in Phase 1  
- **Autonomous map agents** (map decides what to show)  
- **Scraping Google Maps** or bypassing Places/ToS  
- **Continuous user location tracking** (only explicit search bias)  
- ADK / LangGraph second orchestrator  
- Installing entire `googlemaps-samples` into `mdeapp`  
- Rebuilding maps only in frozen `/home/sk/mde`  
- **Maps as orchestration layer** — Mastra owns workflow decisions  

### 10.4 Biggest risks

1. **Action pipeline never wired** — pins stay broken until MAP-001 green  
2. **Key leakage** — Places key in `NEXT_PUBLIC_*`  
3. **Attribution skipped** — ToS violation on grounded UI  
4. **US-only Places fields in CO** — empty summaries, wrong product promise  

### 10.5 Fastest safe path (2 weeks engineering focus)

**Week A:** MAP-001 → MAP-002 (pipeline + grounding + attribution) on `/chat` with ≥3 grounded pins.  
**Week B:** MAP-004 → MAP-006 (places client, cache, nearby) + port minimal `MapContext` from legacy.  
**Defer:** clustering polish, ECL, full neighborhood batch until first **paid rental** map demo works.

### 10.6 Cursor implementation checklist

- [ ] Read `.claude/skills/mde-maps/SKILL.md` + `drafts/maps-prd-v2.md` §2 (Colombia rules)
- [ ] `npm install @vis.gl/react-google-maps @googlemaps/markerclusterer` in `mdeapp/` (add `@googlemaps/extended-component-library` at Post-MVP / M4 only; `npm i -D @googlemaps/jest-mocks` when Vitest lands)
- [ ] Create `src/platform/maps/` (`MapContext`, `mergePinsByCategory`, `normalize-tool-output`)
- [ ] Create `src/platform/contracts/` (Zod `MapPin`, `ToolResponse`)
- [ ] Implement `searchGroundedPlaces` tool (server MCP client, `pageSize: 5`)
- [ ] Register tool on `conciergeAgent` / router agent — names match `useCoAgent({ name })`
- [ ] Add `src/components/maps/GroundingAttribution.tsx` — wire on every grounded surface
- [ ] Add `src/app/chat/page.tsx` — nav | CopilotSidebar | `MdeMap` (three-panel)
- [ ] `useCopilotAction` for `showRentalResults` / `showGroundedPlaces`
- [ ] `supabase/functions/places-proxy` + migration `places_cache` with RLS
- [ ] Field mask registry + hook enforcement
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` in Vercel + `.env.example`
- [ ] Vitest + Playwright specs from §9
- [ ] Evidence: screenshot + `npm run dev` clean + pin count assertion
- [ ] PR cites: clone path + Google doc URL with `utm_source=gmp-code-assist`

---

## Appendix A — Target folder layout (`mdeapp/`)

```text
mdeapp/src/
  app/chat/page.tsx              # three-panel canvas
  app/api/copilotkit/route.ts    # existing
  context/MapContext.tsx
  components/maps/
    MdeMap.tsx                   # APIProvider + Map
    MdeMarker.tsx
    MdeMarkerCluster.tsx
    MdeInfoWindow.tsx
    GroundingAttribution.tsx
    pinContent.ts
  components/cards/
    RentalCard.tsx PlaceInfoCard.tsx NeighborhoodCard.tsx CommuteCard.tsx
  lib/maps/actions.ts normalize-tool-output.ts
  lib/google/places-client.ts places-field-masks.ts
  mastra/tools/search-grounded-places.ts search-rentals.ts
  mastra/workflows/rental-search.ts nearby-intel.ts venue-discovery.ts

mdeapp/supabase/functions/places-proxy/
mdeapp/supabase/migrations/*_places_cache.sql
mdeapp/tests/e2e/maps-*.spec.ts
mdeapp/tests/unit/maps-*.test.ts
```

## Appendix B — Cross-module links

| Doc | Link |
|-----|------|
| Beginner maps summary (merged) | [`docs/prd-maps-doc.md`](./docs/prd-maps-doc.md) |
| Real estate maps §5 | [`../real-estate/draft/prd-real-estateV2.md`](../real-estate/draft/prd-real-estateV2.md) |
| Chat canvas | [`../../docs/CHAT-CENTRAL-PLAN.md`](../../docs/CHAT-CENTRAL-PLAN.md) |
| Events maps gates | [`../events/events-prd.md`](../events/events-prd.md) |
| RE tasks | [`../real-estate/draft/roadmap.md`](../real-estate/draft/roadmap.md) |
| Legacy port source | `/home/sk/mde/src/context/MapContext.tsx` (read-only) |

## Appendix C — Phase note (`prd-maps-doc` vs this plan)

| Topic | `prd-maps-doc.md` | This plan (authoritative) |
|-------|-------------------|---------------------------|
| Marker clustering | Post-MVP | **MVP** step 9 (scale demo with 25+ listings) |
| ECL install | “install now” in npm block | **Post-MVP** — avoid double Maps loader until M4 |
| Agent count | 8 named agents | Same roles; ship as router + tools first |

---

*End of Maps V2 Implementation Plan — execute from MAP-001; do not mark Done without localhost pin proof per CLAUDE.md anti-fake-done gate.*
