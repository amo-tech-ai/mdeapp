---
audit_id: 11-maps-audit
date: 2026-05-22
last_verified: 2026-05-22
auditor: Codex forensic maps/CopilotKit/Mastra review
mcp_verified:
  - user-google-maps-code-assist (retrieve-instructions, retrieve-google-maps-platform-docs)
scope:
  - /home/sk/mdeai/plan/maps
  - /home/sk/mdeai/tasks/maps
  - /home/sk/mdeai/tasks/core/F48-copilotkit-map-canvas-layout.md
  - /home/sk/mdeai/tasks/core/F49-copilotkit-generative-search-ui.md
  - /home/sk/mdeai/tasks/core/F50-copilotkit-map-ui-state.md
  - /home/sk/mdeai/mdeapp
  - /home/sk/mde/src/components/chat/ChatCanvas.tsx
  - /home/sk/mde/src/context/MapContext.tsx
  - /home/sk/mde/src/components/chat/ChatMap.tsx
  - /home/sk/mde/src/components/map
  - /home/sk/mdeai/github/maps
official_sources:
  - https://developers.google.com/maps/documentation/places/web-service/choose-fields
  - https://developers.google.com/maps/documentation/places/web-service/place-types
  - https://developers.google.com/maps/ai/grounding-lite
  - https://developers.google.com/maps/ai/code-assist/reference/mcp/tools_list/retrieve-instructions
  - https://developers.google.com/maps/api-security-best-practices
  - https://github.com/visgl/react-google-maps
  - https://github.com/googlemaps/js-markerclusterer
  - https://github.com/googlemaps-samples/grounding-lite-mcp-sample-app
grading:
  green: "85-100 strong"
  yellow: "70-84 risky / needs correction"
  red: "below 70 blocker / incorrect"
---

# Maps + CopilotKit + Mastra Forensic Audit

## Executive Verdict

| Item | Verdict |
|---|---:|
| Overall correctness score | 🟡 **81/100** (task specs; re-verified with Maps Code Assist MCP) |
| Production readiness score | 🔴 **48/100** |
| Chance of success as written | 🟡 **58%** |
| Chance after critical fixes | 🟢 **82%** |
| Biggest blocker | **MAP-001 not implemented** (no vis.gl, no MapContext). Secondary: **Vercel `/api/copilotkit` smoke** after MASTRA-003 (code Done; prod evidence still required). |

**Brutal answer:** the strategy is directionally correct, but the maps tasks are **not 100% correct** and the app is **not map-ready**. Local app gates pass, the runtime is still Pattern 1, and the plan correctly chooses Google Maps + vis.gl + CopilotKit v1.55.2. But MAP-001 is not implemented, no map package is installed, no map context exists, no map pins can render, no production storage smoke exists, and some task acceptance criteria are too soft to prevent fake-ready status.

**Top 5 critical fixes**

1. **Implement MAP-001 before layout polish:** `src/platform/contracts`, `src/platform/maps`, `MapContext`, vis.gl `<APIProvider>`, `<Map mapId>`, `AdvancedMarker`, `data-testid="map-pin"`.
2. **Vercel storage smoke (MASTRA-003 Done on disk):** `POST https://www.mdeai.co/api/copilotkit` non-500 + Postgres path; gitignore/remove stale `src/mastra/public/mastra-agent-memory.db*`.
3. **Make F49/MAP-007 Playwright mandatory:** ≥3 cards + ≥3 map pins + bidirectional highlight (MAP-007 must list **F50** in `depends_on`).
4. **Split MAP-004:** Places SDK only — drop `@mastra/mcp` / `@modelcontextprotocol/sdk` from Places client task (Grounding MCP stays MAP-002).
5. **Surface + port hygiene:** canonical concierge surface is **`/`** (F48/F19); `/chat` redirect only. Localhost gates use **actual Next port** from `npm run dev` (often 3000, not hardcoded 3001).

## Strategy Grade

| Strategy area | Grade | Evidence |
|---|---:|---|
| Google Maps strategy | 🟢 **88** | Correct layer choice: Google Maps as spatial evidence, vis.gl for React, Advanced Markers with Map ID, Places/Grounding as source of truth. |
| old `/home/sk/mde` layout reuse | 🟡 **78** | Correct as **read-only layout/map pattern**. Dangerous if legacy `useChat`, `react-router`, Vite env names, or custom loader are copied. |
| CopilotKit + Mastra integration | 🟢 **86** | `src/app/api/copilotkit/route.ts` uses `CopilotRuntime` + local Mastra agents; `layout.tsx` uses `agent="conciergeAgent"`. |
| task sequencing | 🟡 **74** | Current specs are close, but production storage must be step 0 and F50 should be a hard dependency for MAP-007 sync. |
| production safety | 🔴 **52** | No map implementation, no Vercel storage smoke, no Places server key in `mdeapp/.env.local`, no Playwright pin proof. |

## Task Scorecard

| Task | Score | Status | Will succeed? | Main blocker | Required correction |
| ---- | ----: | ------ | ------------- | ------------ | ------------------- |
| MAP-001 | 🟡 **82** | Not Started | Yes, after fixes | No implementation; no vis.gl installed; prod Map ID guard deferred | Require real Map ID for prod, install vis.gl, add `data-testid="map-pin"` proof, no duplicate loader |
| MAP-002 | 🟡 **80** | Not Started | Yes | Agent/surface drift (`/chat`, `pingAgent`); env keys exist on disk | Fix `conciergeAgent` + `/`; MCP probe in evidence; attribution uses `googleMapsLinks.placeUrl` (official); quota text **correct** (100 QPM / 1k QPD for `search_places`) |
| MAP-004 | 🔴 **68** | Not Started | Risky | Places client deps/key not present; too much MCP/package ambiguity | Split direct Places client from MCP, enforce field-mask registry, separate server key |
| MAP-005 | 🟡 **75** | Not Started | Conditional | Edge/cache/RLS proof not specific enough | Add SQL/RLS negative tests, cache hit proof, field-mask log proof |
| MAP-006 | 🟡 **73** | Not Started | Defer until F46/MAP-005 | Optional Playwright; Places type allowlist not explicit | Require Place Type table validation, mandatory pin-count test, no prod fallback |
| MAP-007 | 🟡 **78** | Not Started | Conditional | Depends on F50 behavior but does not list F50 | Add `depends_on: [MAP-001, MAP-002, F48, F49, F50]`, mandatory desktop/mobile screenshots |
| F48 | 🟡 **84** | Not Started | Yes | MAP-001 absent | Keep v1 `CopilotSidebar`; do not port legacy `useChat`; verify `/chat` redirect |
| F49 | 🟡 **82** | Not Started | Yes, with tests | No `MapContext`; Playwright optional | Make Playwright card+pin count mandatory; parse tool `result`, not only custom events |
| F50 | 🟡 **80** | Not Started | Conditional | Co-agent state sync can desync or bloat memory | Store summary only, debounce, no full `MapPin[]`, sync Zod/TS/agent schema |
| MASTRA-003 / PROD-STORAGE-001 | 🟡 **78** | **Done** (code) | Yes locally | Vercel re-smoke + stale `.db` files | Not a maps task blocker for spec writing; gate MAP-001 **Done** with Vercel evidence note |

## Critical Errors

1. **No map implementation exists in `mdeapp`.**
   - Evidence: `rg "MapContext|MapProvider|ChatMap|AdvancedMarker|APIProvider|mapId|NEXT_PUBLIC_GOOGLE_MAPS" src` only found a comment in `src/mastra/workflows/concierge-routing-workflow.ts`.
   - Evidence: `find src -maxdepth 3 -type d -name platform -o -name maps -o -name copilot` returned no platform/maps/copilot directories.
   - Impact: Camila can ask for Laureles rentals, but there is no client state or map renderer to show pins.

2. **`@vis.gl/react-google-maps` is not installed.**
   - Evidence: `package.json` has no `@vis.gl/react-google-maps`, no `@googlemaps/markerclusterer`, no `@googlemaps/places`.
   - Official/local evidence: the vis.gl README uses `<APIProvider>`, `<Map mapId="DEMO_MAP_ID">`, and `<AdvancedMarker>` as the React pattern.
   - Impact: MAP-001 cannot succeed until dependencies are installed.

3. **Production storage is only partially fixed.**
   - Evidence: `src/mastra/lib/storage.ts` uses `PostgresStore` when `DATABASE_URL` exists, else `LibSQLStore({ url: ":memory:" })`.
   - Evidence: `src/mastra/public/mastra-agent-memory.db`, `*.db-shm`, and `*.db-wal` still exist.
   - Local proof: build/dev logged `[mastra-storage] using Postgres`, but only because local env has `DATABASE_URL`.
   - Required proof: Vercel `POST /api/copilotkit` must no longer throw `ConnectionFailed: Unable to open connection to local database mastra-agent-memory.db`.

4. **Server Maps keys — present on disk (2026-05-22 re-probe).**
   - Evidence: `mdeai/.env.local` includes `GOOGLE_MAPS_API_KEY`, `GOOGLE_PLACES_API_KEY`, plus `NEXT_PUBLIC_GOOGLE_MAPS_*`.
   - Still required: prove keys are **restricted** (browser = Maps JS only; server = Grounding/Places); grep client bundle for server key names.

5. **MAP-002 quota text is correct (MCP-verified).**
   - [Grounding Lite billing and quotas](https://developers.google.com/maps/ai/grounding-lite): **`search_places` = 100 QPM and 1,000 QPD per project**; `lookup_weather` and `compute_routes` = **300 QPM** each.
   - Prior audit correction claiming 300 QPM for `search_places` was **wrong** — do not change MAP-002 limits.
   - Attribution: sources must follow grounded output immediately; links use **`places.googleMapsLinks.placeUrl`** from MCP response.

6. **MAP-004 mixes client concerns.**
   - It asks for `@googlemaps/places`, `@mastra/mcp`, and `@modelcontextprotocol/sdk` in one Places-client task.
   - Places API New direct client/fetch work does not need MCP; Grounding Lite MCP belongs in MAP-002.
   - Required: split “Places New client + field masks” from “MCP client.”

7. **F49 and MAP-007 leave Playwright optional where it must be required.**
   - A card/pin sync regression is exactly what Lucía needs to catch.
   - Required: Playwright must prove `cards >= 3`, `map pins >= 3`, card click focuses pin, pin click highlights card.

8. **Legacy layout copying is safe only if runtime/chat is not copied.**
   - Legacy `/home/sk/mde/src/components/chat/ChatCanvas.tsx` uses `useChat`, React Router, `pendingActions`, and Vite env names.
   - Legacy `/home/sk/mde/src/components/chat/ChatMap.tsx` uses a custom `loadGoogleMapsLibrary`.
   - Required: copy proportions, mobile sheet, `mergePinsByCategory`, and pin UX only; rebuild on CopilotKit + vis.gl.

## Per-Task Audit

### MAP-001 — Platform contracts + MapContext + vis.gl

- **What it is trying to do:** create the foundational map contracts, normalize/merge pipeline, client `MapContext`, and first Google map with an `AdvancedMarker`.
- **Percent correct:** **82%**
- **What is correct:** chooses vis.gl, requires MapContext as single writer, forbids `loadGoogleMapsLibrary`/`react-wrapper`, splits F48/F49/F50 correctly, and requires `mapId`.
- **What is wrong:** defers “full prod guard” for `getGoogleMapsMapId()` to MAP-008; for production, real `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` cannot be optional. It also says `/chat` shell in the heading while the body correctly says `/` via F48.
- **Missing steps:** add `data-testid="map-pin"`; add production Map ID failure test; add browser key referrer/API restriction evidence; add no duplicate Maps script check.
- **Dependency issues:** `depends_on: [F09, F13, F19]` is acceptable, but production storage fix must now precede it.
- **Command issues:** `npm install @vis.gl/react-google-maps` is listed but package version/lockfile proof should be captured.
- **Best-practice issues:** never rely on `DEMO_MAP_ID` for production screenshots.
- **Required fixes:** require real Map ID for Done; move mock pin behind dev/test fixture; add Playwright/canvas marker proof.
- **Real-world example:** Camila’s first rental query should create rental pins; without MAP-001 she only gets text/cards.
- **Final verdict:** **Modify**

### MAP-002 — Grounding Lite + attribution

- **What it is trying to do:** add Grounding Lite MCP, quota, telemetry, Mastra tool, and visible Google Maps attribution.
- **Percent correct:** **76%**
- **What is correct:** uses `mapstools.googleapis.com/mcp`, keeps calls server-side, includes fail-closed behavior, requires attribution, and makes quota explicit.
- **What is wrong:** surface/agent drift — still says `/chat` and `pingAgent` while F19/F48 use **`/`** and **`conciergeAgent`**. Needs MCP argument probe (`textQuery` vs `text_query`) recorded in evidence. `placeUrl` gate matches official `googleMapsLinks.placeUrl` (not generic `placeUri`).
- **Quota:** task line **100 QPM / 1,000 QPD** for `search_places` matches official docs (Maps Code Assist MCP, 2026-05-22).
- **Missing steps:** Vercel env proof, attribution DOM proof immediately after grounded output, QPM/QPD product cap config, no browser MCP grep.
- **Dependency issues:** should depend on F49 render infrastructure if grounded cards must appear in CopilotKit UI.
- **Command issues:** needs a redacted MCP probe command recorded in evidence.
- **Best-practice issues:** must verify LLM output against tool result because official docs warn generated responses may not include exact MCP data.
- **Required fixes:** fix `/` + `conciergeAgent` references; add MCP schema probe; mandatory `GroundingAttribution` screenshot; keep quota as written.
- **Real-world example:** Tourist asks “quiet cafés near Parque Lleras”; every displayed café link must come from Google Maps sources, not Gemini memory.
- **Final verdict:** **Modify**

### MAP-004 — Places API client + field masks

- **What it is trying to do:** create server-side Places API New wrapper with field-mask registry.
- **Percent correct:** **68%**
- **What is correct:** field-mask emphasis is right; Places belongs server-side; `generativeSummary` is correctly avoided for MVP.
- **What is wrong:** task bundles MCP deps into a Places client task; says same key value can be used, while Google recommends separate restricted keys; `@googlemaps/places@^2.4.1` must be verified at implementation time.
- **Missing steps:** `googleMapsLinks`/Maps URL field in every minimum mask; key restriction proof; `X-Goog-FieldMask` negative test; no wildcard `*` in production.
- **Dependency issues:** MAP-004 should not block MAP-007. It should follow MAP-007 unless Roberto venue autocomplete is pulled forward.
- **Command issues:** `npm install @googlemaps/places@^2.4.1` needs package/API verification before execution.
- **Best-practice issues:** direct browser Places calls must remain forbidden.
- **Required fixes:** split MCP from Places; use server-only key; add field mask registry test for every endpoint.
- **Real-world example:** Roberto’s venue card must use actual `place_id` and `googleMapsLinks`, not a hand-built search URL for “rooftop Laureles.”
- **Final verdict:** **Split / Modify**

### MAP-005 — places-proxy + cache

- **What it is trying to do:** move Places calls into Supabase edge, cache responses, and enforce RLS.
- **Percent correct:** **75%**
- **What is correct:** server-only proxy, TTL caches, RLS, and duplicate-query cache proof are all right.
- **What is wrong:** “Mastra tools uses edge URL + user JWT” is not fully specified for service-role server flows; it also allows “direct MAP-004 client in dev” fallback without a production kill switch.
- **Missing steps:** SQL policy negative test, cache key collision test, field-mask log table, service-role isolation, idempotent migration proof.
- **Dependency issues:** correctly depends on MAP-004, but should also depend on auth/session policy if user JWT is required.
- **Command issues:** needs Deno typecheck/deploy commands when edge functions are added.
- **Best-practice issues:** avoid caching Google content longer than allowed by Maps terms; document TTL rationale.
- **Required fixes:** add `places_request_log`, SQL RLS tests, and no-browser-key grep.
- **Real-world example:** Camila clicking “Show nearby” twice should not bill Google twice within the TTL.
- **Final verdict:** **Modify**

### MAP-006 — Nearby Search CTA

- **What it is trying to do:** add “Show nearby” from rental cards using Places Nearby Search.
- **Percent correct:** **73%**
- **What is correct:** strict radius, max results, included types, attribution, and merge-by-category are correct.
- **What is wrong:** Playwright is optional; it should be required because this task is pure user-visible map behavior.
- **Missing steps:** allowed `includedTypes` list from official Place Types table, no invalid Colombia radius edge cases, field-mask proof.
- **Dependency issues:** depends on MAP-005 and F46, correct. Defer until real rental cards exist.
- **Command issues:** add test command names once edge/function test runner exists.
- **Best-practice issues:** do not let the LLM choose arbitrary Nearby types; map user choices to allowlisted Google types.
- **Required fixes:** mandatory Playwright pin-count increase proof and attribution proof.
- **Real-world example:** Camila taps “Show nearby” on a Laureles card; nearby café pins appear without deleting rental pins.
- **Final verdict:** **Defer / Modify**

### MAP-007 — Three-panel polish

- **What it is trying to do:** make the `/` map/chat/cards layout production-usable, especially mobile.
- **Percent correct:** **78%**
- **What is correct:** correctly treats `v1/travel` as layout-only, keeps Google Maps, requires no Spanish strings, and targets desktop/mobile.
- **What is wrong:** pin/card highlight sync is F50 behavior, but F50 is not in `depends_on`.
- **Missing steps:** browser console sweep, overflow checks, screenshot attachment, real keyboard/touch tests.
- **Dependency issues:** add F50; keep MAP-004 out unless Places UI is included.
- **Command issues:** Playwright should not be optional.
- **Best-practice issues:** no nested cards; keep tool surface dense and usable.
- **Required fixes:** add F50 dependency and mandatory desktop/mobile Playwright.
- **Real-world example:** Tourist taps a restaurant pin on mobile; the matching card should scroll/highlight without covering the Copilot input.
- **Final verdict:** **Modify**

### F48 — CopilotKit 3-panel map canvas

- **What it is trying to do:** refactor `/` so CopilotKit sidebar and map/results canvas share the page.
- **Percent correct:** **84%**
- **What is correct:** keeps `CopilotSidebar`, keeps one `<CopilotKit>` provider in `layout.tsx`, avoids v2 imports, and rejects legacy `useChat`.
- **What is wrong:** acceptance says chat should send through `conciergeAgent`, but this can only be proven after the map shell mounts and runtime storage is stable.
- **Missing steps:** browser console proof, no hardcoded port proof, `/chat` redirect proof.
- **Dependency issues:** depends on MAP-001 and F19, correct; also blocked by production storage gate.
- **Command issues:** `GET /` proof should use actual port from dev output. Today local dev bound to `3000`, not `3001`.
- **Best-practice issues:** `CopilotSidebar` chat will be side-panel, not true Mindtrip center chat; that is acceptable for v1.
- **Required fixes:** capture actual port, verify no second provider, add screenshot.
- **Real-world example:** Camila opens `/`; chat is usable while map remains visible in the main canvas.
- **Final verdict:** **Modify lightly**

### F49 — Generative UI cards to pins

- **What it is trying to do:** mirror Mastra tools in CopilotKit UI and merge tool result pins into MapContext.
- **Percent correct:** **82%**
- **What is correct:** v1.55.2 mapping is right: `useCopilotAction({ available: "disabled", render })`, name matches Mastra tool id, no v2 `useRenderTool`.
- **What is wrong:** Playwright is optional; card/pin count must be a hard gate. It also assumes all useful data is in `result`; current tools additionally emit `context.writer.custom({ type: "data-mdeai-actions" })`, so implementation must prove the AG-UI event path it consumes.
- **Missing steps:** card test IDs, marker test IDs, invalid coords from DB/fallback rejected, no fallback mock data in production.
- **Dependency issues:** depends on F48/MAP-001/F24; correct for rental cards.
- **Command issues:** add a concrete smoke prompt and expected DOM counts.
- **Best-practice issues:** do not call hooks inside render; task already says this.
- **Required fixes:** mandatory Playwright and AG-UI event/result proof.
- **Real-world example:** Camila sees three rental cards and exactly matching rental pins.
- **Final verdict:** **Modify**

### F50 — MapUiState + focusMapPin

- **What it is trying to do:** share summary map state with the agent and expose a frontend tool to focus a pin.
- **Percent correct:** **80%**
- **What is correct:** keeps MapContext as sole pin writer; uses `useCoAgent` and `useCopilotAction` v1; forbids full pin arrays in memory.
- **What is wrong:** it can create state desync if debounce/merge semantics are weak.
- **Missing steps:** race test for rapid pin/category changes, stale selected pin cleanup when category updates, no full pins grep across all agent schemas.
- **Dependency issues:** should block MAP-007 because MAP-007 promises bidirectional sync.
- **Command issues:** add a deterministic manual script: click card, inspect state, ask “focus the cheapest listing.”
- **Best-practice issues:** frontend tool should return a concise result and not mutate inventory or bookings.
- **Required fixes:** debounce, stale pin reset, schema sync test.
- **Real-world example:** Camila says “focus the second one”; the agent can use pin IDs/counts without storing all listing geo data in working memory.
- **Final verdict:** **Modify**

### Production Mastra storage task

- **What it is trying to do:** prevent Vercel from opening local LibSQL files for agent memory/storage.
- **Percent correct:** **64%** because there is code but no standalone P0 task/proof.
- **What is correct:** `src/mastra/lib/storage.ts` uses `PostgresStore` when `DATABASE_URL` exists; `@mastra/pg` is installed.
- **What is wrong:** production proof is missing; old `mastra-agent-memory.db*` files remain; `:memory:` fallback is still allowed without a strict production env gate.
- **Missing steps:** Vercel env verification, production `POST /api/copilotkit` smoke, strict `VERCEL && !DATABASE_URL` fail-fast, `rg "file:mastra-agent-memory.db"` gate, thread hydration test.
- **Dependency issues:** must be step 0 before MAP-001/F48/F49.
- **Command issues:** add `npm run check:mastra` or storage-specific script.
- **Best-practice issues:** serverless storage must be network-backed; local files are not durable and may be read-only.
- **Required fixes:** create `MASTRA-P0-production-storage-vercel.md` or promote MASTRA-003 to pre-maps P0.
- **Real-world example:** if storage fails on Vercel, Camila’s chat cannot run long enough to render any map pins.
- **Final verdict:** **Split / Promote to P0**

## Critical Red Flags

| Red flag | Status | Evidence / required action |
|---|---|---|
| local LibSQL file storage in production | 🔴 | Known Vercel failure; `src/mastra/public/mastra-agent-memory.db*` still present. |
| wrong dev port assumptions | 🟡 | Current dev bound to `3000`; tasks hardcode `3001` in several gates. Use actual dev output. |
| Places key exposed to browser | 🟡 | No server Places key present yet; enforce no `GOOGLE_PLACES_API_KEY` in client bundle. |
| missing Map ID | 🔴 | No map implementation; MAP-001 must require real prod Map ID. |
| AdvancedMarker without mapId | 🟡 | Task says mapId; no code yet. Add test. |
| duplicate Maps loaders | 🟡 | Legacy uses custom loader; mdeapp must use vis.gl only. |
| hand-built Google Maps URLs | 🟡 | Tasks forbid it; current tool rows use `maps_url` from DB. Require provenance. |
| missing `X-Goog-FieldMask` | 🔴 | No Places client exists; MAP-004 must enforce. |
| missing Google attribution | 🔴 | No `GroundingAttribution` component exists. |
| LLM-invented coordinates | 🟡 | Agent rules forbid tool fabrication; fallback mock coordinates exist and must be disabled/fail-closed in prod map proof. |
| direct `setPins` outside MapContext | 🟢 now | `rg "setPins" src` returned 0 because no MapContext exists yet. |
| CopilotKit v2 APIs in v1.55.2 app | 🟢 now | No `useRenderTool`, `useFrontendTool`, `useComponent`, or `CopilotKitProvider` in `src`. |
| second orchestrator / wrong runtime | 🟢 now | Pattern 1 route present; no LangGraph/ADK/CrewAI/PydanticAI in app code. `@ag-ui/langgraph` appears only transitively in audit output via CopilotKit runtime. |
| copying legacy `useChat` | 🟡 | F48 forbids it. Keep that hard. |
| Leaflet/OSM/Mapbox | 🟢 now | grep returned 0 in `mdeapp/src/package.json`. |
| missing Playwright pin proof | 🔴 | No Playwright maps proof exists. |
| fake-ready docs | 🟡 | Local gates pass, but map implementation is absent. Do not mark maps ready. |

## Correct Execution Order

The proposed order is **mostly correct** after adding production storage as step 0 and making F50 block MAP-007:

0. **Production Mastra storage fix** — Vercel PostgresStore proof for `/api/copilotkit`; no local DB file path in production.
1. **MAP-001** — contracts + MapContext + vis.gl + mock/test pin.
2. **F48** — CopilotKit 3-panel shell on `/`; `/chat` redirect only.
3. **F49** — search tools → cards → map pins.
4. **F50** — `MapUiState` + `focusMapPin`; no full pins in working memory.
5. **MAP-002** — Grounding Lite + attribution + quota.
6. **MAP-007** — responsive/mobile polish and pin/card sync proof.
7. **MAP-004** — Places client + field masks.
8. **MAP-005** — places-proxy + cache + RLS.
9. **MAP-006** — Nearby Search CTA.
10. **MAP-008/MAP-009** — marker chrome and clustering before dense public inventory.
11. **MAP-010+** — Roberto venue autocomplete, routes, neighborhood intelligence.

Why not MAP-004 earlier? MAP-002 can produce grounded Google places without the Places proxy, and MAP-007 can polish the shell after grounded cards exist. Places client/proxy is needed for cost-safe scale, venue autocomplete, nearby search, and enrichment, not for the first map proof.

## Tests Required Before Marking Done

### Unit

- `MapPinSchema` rejects invalid lat/lng, missing provenance, and LLM-only geo.
- `ToolResponseSchema` fixtures for rentals/events/restaurants/attractions/grounded.
- `mergePinsByCategory` keeps other categories.
- `MapUiStateSchema` contains counts/ids/viewport only.
- Places client test asserts every method sends `X-Goog-FieldMask`.
- Grounding client test handles MCP unavailable, quota limit, missing source link.

### Integration

- `POST /api/copilotkit` local returns 400 for `{}` with `Missing method field` or 200 for a valid CopilotKit request, not 500.
- Valid CopilotKit message calls `conciergeAgent` and tool result reaches the render component.
- `search-rentals` result → F49 render → MapContext pins.
- Follow-up restaurant query keeps rental pins.

### Playwright

- Desktop 1280px: chat/sidebar, cards/results, and map panel exist.
- `list top rentals in Laureles` creates at least 3 cards and at least 3 `[data-testid="map-pin"]`.
- Card click sets selected pin and centers/highlights map.
- Pin click highlights/scrolls matching card.
- Mobile 390x844: map sheet opens, does not cover Copilot input, no horizontal overflow.
- Console has zero map/CopilotKit errors.

### Browser Console

- No duplicate Maps script loads.
- No “AdvancedMarker requires mapId” warning.
- No “agent not found” / `useCoAgent` mismatch.
- No hydration mismatch from CopilotKit sidebar.

### Vercel Production Smoke

- `GET /` returns 200 on deployment URL.
- `POST /api/copilotkit` returns non-500 and logs `PostgresStore`, not LibSQL file.
- No `ConnectionFailed: Unable to open connection to local database mastra-agent-memory.db`.
- Thread survives a redeploy/cold-start if persistence is required.

### Supabase/RLS

- Any new table has RLS enabled and at least one policy.
- `places_*_cache` denies anon writes.
- `grounding_quota_log` increments under service role only.
- No service-role key in browser bundle.

### Google Maps Key Safety

- Browser key restricted to web referrers + Maps JavaScript API.
- Server key restricted to server/IP or appropriate server use + Places/Grounding/Routes APIs.
- `rg "GOOGLE_PLACES_API_KEY|GOOGLE_MAPS_API_KEY" src/app src/components` returns no client exposure.

### Places Field Masks

- Text Search/Nearby masks start with `places.`.
- Place Details masks do not start with `places.`.
- No wildcard `*` in production code.
- `googleMapsLinks` included when rendering “Open in Google Maps.”

### Attribution

- Grounded output has Google Maps sources immediately after supported content.
- Source is viewable within one interaction.
- Link uses the returned `googleMapsLinks` URL field.
- `translate="no"` and accessible contrast are tested.

## Command Results

All commands were run from `/home/sk/mdeai/mdeapp` on 2026-05-22.

| Command | Result |
|---|---|
| `npm run lint` | ✅ exit 0 |
| `npm run test` | ✅ 11 files / 66 tests passed |
| `npm run build` | ✅ exit 0; warnings about workspace root and middleware/proxy rename |
| `npm run floor` | ✅ exit 0; `npm audit --audit-level=high` reports only moderate advisories |
| `rg "@vis.gl/react-google-maps..."` | 🔴 no vis.gl/markerclusterer/places deps installed |
| `rg "CopilotKit..." src` | ✅ v1 imports only; provider agent is `conciergeAgent` |
| `rg "MapContext..." src` | 🔴 no map surface exists |
| `grep GOOGLE_* .env.local` (names only) | 🟢 `GOOGLE_MAPS_API_KEY`, `GOOGLE_PLACES_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_*` present |
| `rg "setPins" src` | ✅ 0 because MapContext is absent |
| `rg "LibSQLStore...PostgresStore..."` | 🟡 Postgres path exists; `:memory:` dev fallback remains |
| `rg "Leaflet|Mapbox|LangGraph|ADK|CrewAI|PydanticAI"` | ✅ 0 direct app hits |
| `npm run dev` smoke | ✅ Next `http://localhost:3000`, Mastra Studio `http://localhost:4112` |
| `curl /` | ✅ 200 |
| `curl /api/copilotkit -d '{}'` | ✅ 400 `Missing method field`, proving route is alive |

Note: the first `npm run floor` attempt failed only because I ran it concurrently with `npm run build`; the clean rerun exited 0.

## Source Verification Notes

**Maps Code Assist MCP (2026-05-22):** `retrieve-instructions` + `retrieve-google-maps-platform-docs` for grounding quota, field masks, vis.gl AdvancedMarker + `mapId`.

- Official Places docs require field masks for Place Details, Nearby Search, and Text Search; omitting the list returns an error, and wildcard `*` is discouraged in production ([choose-fields](https://developers.google.com/maps/documentation/places/web-service/choose-fields)).
- Official Place Types docs confirm `includedTypes` / `excludedTypes` (and primary-type variants) for Nearby Search.
- Official Grounding Lite: MCP at `https://mapstools.googleapis.com/mcp`; **`search_places` quota 100 QPM / 1,000 QPD**; weather/routes **300 QPM**; attribution + `googleMapsLinks.placeUrl` required ([grounding-lite](https://developers.google.com/maps/ai/grounding-lite)).
- vis.gl: `<APIProvider>`, `<Map mapId={...}>`, `<AdvancedMarker>` ([react-google-maps](https://github.com/visgl/react-google-maps)).
- [Maps Code Assist](https://developers.google.com/maps/ai/code-assist) is **dev-time** MCP (`mapscodeassist.googleapis.com`) — not production Grounding Lite.
- Official Code Assist docs say `retrieve-instructions` must be called first for mapping/geospatial coding queries; this is dev-time guidance, not a production runtime.
- Official Maps security guidance recommends API restrictions, separate keys per app, and secure storage outside source code.
- Local CopilotKit `examples/integrations/mastra` confirms v1.55.2-compatible `CopilotKit`, `CopilotSidebar`, `useCoAgent`, `useCopilotAction`, `renderAndWaitForResponse`, and `MastraAgent.getLocalAgents({ mastra })` patterns.
- Local vis.gl README confirms `APIProvider`, `Map`, and `AdvancedMarker` pattern with `mapId`.
- Local Grounding Lite sample confirms server/client key split and Grounding Lite as a pattern source only; do not port its Vite/Lit/Express runtime into mdeapp.

## Final Recommendation

**Are the maps tasks 100% correct?** **No — ~81%** after MCP re-verification. Strategically strong; execution-safe after MAP-001 lands, MAP-004 MCP split, surface/agent alignment (`/` + `conciergeAgent`), and mandatory Playwright on F49/MAP-007. **Do not change MAP-002 `search_places` quota** (100 QPM / 1k QPD is official).

**Will the plan succeed?** Yes, conditionally. It will succeed if the team keeps Pattern 1, ships storage proof first, implements MAP-001 before layout/card work, and treats Google Maps/Places/Grounding as source data rather than LLM output.

**What must be fixed first?** Production Mastra storage on Vercel. A broken `/api/copilotkit` makes every downstream map task meaningless.

**Which tasks should be modified?** MAP-001, MAP-002, MAP-004, MAP-005, MAP-006, MAP-007, F49, F50.

**Which tasks should be deferred?** MAP-006, MAP-008/009, MAP-010/011/012 until first card+pin proof and Vercel runtime proof exist.

**Is the old mde layout reuse strategy correct?** Yes, as a read-only pattern source for proportions, mobile sheet, pin merge, and marker UX. Do not copy legacy chat runtime, Vite env names, React Router navigation, or custom Google loader.

**Are the Google Maps GitHub repos being used correctly?** Mostly yes. Use `react-google-maps` and `js-markerclusterer` via npm packages; use `js-api-samples`, `grounding-lite-mcp-sample-app`, and codelab repos as pattern references only.

**Is the CopilotKit + Mastra strategy correct?** Yes. Keep `Next.js /api/copilotkit -> CopilotRuntime -> MastraAgent.getLocalAgents({ mastra }) -> AG-UI`. Do not introduce LangGraph, ADK, CrewAI, PydanticAI, Mapbox, Leaflet, or a second runtime.

