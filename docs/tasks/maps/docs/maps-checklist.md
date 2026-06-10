---
title: Maps — GMP capabilities audit + run checklist
updated: 2026-05-26
source: https://developers.google.com/maps/documentation/capabilities-explorer?hl=en
docs:
  places_insights: https://developers.google.com/maps/documentation/places-insights
  places_aggregate: https://developers.google.com/maps/documentation/places-aggregate
  geocoding: https://developers.google.com/maps/documentation/geocoding
  maps_static: https://developers.google.com/maps/documentation/maps-static
  map_tiles: https://developers.google.com/maps/documentation/tile
  maps_datasets: https://developers.google.com/maps/documentation/datasets
  maps_embed: https://developers.google.com/maps/documentation/embed
  gemini_maps_grounding: https://ai.google.dev/gemini-api/docs/maps-grounding
  gemini_google_search: https://ai.google.dev/gemini-api/docs/google-search
  gemini_tool_combination: https://ai.google.dev/gemini-api/docs/tool-combination
  gemini_function_calling: https://ai.google.dev/gemini-api/docs/function-calling
  gemini_structured_output: https://ai.google.dev/gemini-api/docs/structured-output
  gemini_interactions: https://ai.google.dev/gemini-api/docs/interactions
  gemini_live_api: https://ai.google.dev/gemini-api/docs/live-api
  gemini_3_5: https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.5
full_verification: ./VERIFICATION-CHECKLIST.md
localhost: ./LOCALHOST-QA-CHECKLIST.md
index: ./INDEX.md
skill: ../../.agents/skills/mde-maps/SKILL.md
---

# Google Maps Platform — capabilities vs mdeai

Audited against the [Google Maps Platform Capabilities Explorer](https://developers.google.com/maps/documentation/capabilities-explorer?hl=en) (updated 2026-05-20). Scores reflect **mdeai Phase 1 scope** (Camila chat/rentals, Tourist concierge, Roberto events) — not every GMP SKU.

## Executive scorecard

| Metric | Score | Verdict |
|--------|------:|---------|
| **Phase 1 maps MVP** (MAP-001–018 + MAP-014–017 + MAP-019 + F50b) | **91/100** | Strong — discovery + enrichment + deep-link CTAs + viewport bias |
| **Full product-relevant GMP** (incl. MAP-005–012 backlog) | **46/100** | Expected — half the roadmap is Post-MVP |
| **Analytics SKUs** (Insights + Aggregate) | **0/100** | Not started — MAP-012 uses Nearby cache path first |
| **Places `googleMapsLinks` depth** | **82/100** | MAP-019: `placeUri` + `directionsUri` + `reviewsUri` on mask v3; `writeAReviewUri` / `photosUri` deferred |
| **Maps JS API breadth** (Explorer feature list) | **22/100** | Core map only — layers, SV, Fleet N/A |
| **Architecture fit** (discovery vs enrichment vs render) | **94/100** | Grounding Lite → Details → proxy → vis.gl is textbook |
| **Cost / security hygiene** (masks, cache, keys, rate limits) | **90/100** | Field masks, 018E cache, photo proxy, no server key in browser |
| **Attribution & ToS** | **85/100** | Grounding footer + photo author attributions; keep auditing |
| **Gemini built-in tools** (Search/Maps/ combo) | **12/100** | Prod = Mastra custom tools + Grounding Lite MCP; Gemini Maps = sidecar fallback only |
| **Gemini agent primitives** (function call + structured output + 3.5 tuning) | **72/100** | Strong via Mastra/Zod; not native `responseSchema` / Interactions / Live |

**Bottom line:** Maps **display + Places REST** are strong. **Gemini geo** is correctly routed through **Grounding Lite MCP**, not the [`googleMaps` built-in tool](https://ai.google.dev/gemini-api/docs/maps-grounding). Biggest unused Gemini wins: [**Google Search grounding**](https://ai.google.dev/gemini-api/docs/google-search) for time-sensitive events, explicit **3.5 thinking levels**, and (Phase 2) [**tool combination**](https://ai.google.dev/gemini-api/docs/tool-combination) — not replacing MCP pins.

---

## Scoring rubric (per row)

| Score | Meaning |
|------:|---------|
| **0** | N/A for mdeai (native SDK, fleet, US-only, etc.) |
| **1–25** | Not started / stub only |
| **26–50** | Client or sidecar exists; not in persona-facing flow |
| **51–75** | Shipped in one persona path; gaps (UX, cache, tests) |
| **76–100** | Production-hardened: masks, cache, tests, attribution, deploy |

**Personas:** Camila (rentals/chat), Tourist (concierge), Roberto (host), Patricia (ops).

### How mdeai runs Gemini today (read first)

```text
CopilotKit UI → Mastra conciergeAgent (gemini-3.5-flash via @ai-sdk/google)
              → Mastra createTool + Zod (custom function calling)
              → search-grounded-places → ADK Cloud Run → Grounding Lite MCP search_places
              → Places Details enrich (018B) — NOT Gemini googleMaps tool
Fallback only: sidecar gemini_maps_grounding.py → generateContent + tools:[googleMaps]
```

| Layer | What we use | What we do **not** use in prod |
|-------|-------------|--------------------------------|
| Model | `gemini-3.5-flash` (`models.ts`) | Interactions API, Live API |
| Tool loop | Mastra `createTool` + Zod I/O | Gemini native parallel function calling in concierge |
| Geo discovery | Grounding Lite MCP | Gemini `googleMaps` on every turn |
| Real-time web | — | Gemini `googleSearch` |
| Memory schema | Mastra working memory Zod | Gemini `responseSchema` on replies |

---

## 1. AI & agentic (highest leverage for mdeai)

| Capability | GMP product | Key features | mdeai usage | Score | Task / code | Should we add? |
|------------|-------------|--------------|-------------|------:|-------------|----------------|
| Place discovery in natural language | **Maps Grounding Lite** MCP `search_places` | POI search, Place IDs, Maps links, attribution | ✅ Primary discovery path — Cloud Run sidecar → Mastra tool | **95** | MAP-002, `grounding_mcp.py` | **Keep** — core |
| Commute / distance Q&A | Grounding Lite `compute_routes` | Drive/walk duration + distance (no turn-by-turn) | ⚠️ Sidecar returns `compute_routes_not_implemented` | **15** | MAP-011 | **Yes — P1 post-MVP** for Camila “how far to Poblado?” |
| Weather at a place | Grounding Lite `lookup_weather` | Current + forecast by place/lat | ❌ Not wired | **0** | — | **Could — Phase 2** Tourist “rain today?” (cheap vs full Weather API) |
| LLM-native Maps tool | **Gemini Maps grounding** (`googleMaps` tool) | Citations in `generateContent` | ❌ Deferred | **5** | MAP-002D | **Phase 2 only** — we chose MCP for multi-model + explicit pins |
| Resolution APIs (experimental) | Grounding Lite REST `resolveNames` / `resolveMapsUrls` | Disambiguate names ↔ place IDs | ❌ | **0** | — | **Later** — useful for CRM / lead dedupe (Patricia) |
| Dev MCP / Code Assist | Maps Code Assist MCP | Docs + field-mask guidance | ✅ Dev/audit only | **N/A** | mde-maps skill | **Keep for Sofía** — not product runtime |

---

## 1b. Gemini API — built-in tools & agent features

Audited against [Maps grounding](https://ai.google.dev/gemini-api/docs/maps-grounding), [Google Search grounding](https://ai.google.dev/gemini-api/docs/google-search), [Tool combination](https://ai.google.dev/gemini-api/docs/tool-combination), [Function calling](https://ai.google.dev/gemini-api/docs/function-calling), [Structured output](https://ai.google.dev/gemini-api/docs/structured-output), [Interactions API](https://ai.google.dev/gemini-api/docs/interactions), [Live API](https://ai.google.dev/gemini-api/docs/live-api), [Gemini 3.5 Flash](https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.5).

### Gemini tooling scorecard

| Area | Score | mdeai today |
|------|------:|-------------|
| Model (`gemini-3.5-flash` GA) | **95** | All Phase 1 agents via `@ai-sdk/google` |
| Custom function calling (Mastra tools) | **85** | 6 concierge tools + Zod `inputSchema`/`outputSchema` |
| **Google Maps** built-in tool (`googleMaps`) | **15** | Sidecar fallback only (`gemini_maps_grounding.py`); not Mastra path |
| **Google Search** built-in tool (`googleSearch`) | **0** | Not wired |
| **Tool combination** (built-in + custom, Gemini 3) | **0** | Mastra orchestrates tools; no `includeServerSideToolInvocations` |
| **`groundingMetadata` UX** (Maps/Search citations, widgets) | **35** | Manual attribution rows; no Search widget / Maps context tokens |
| **Structured output** (`responseSchema` / JSON mode) | **45** | Zod on tools + working memory; agent prose is free text |
| **Interactions API** (`interactions.create`, steps) | **0** | Mastra + `generateContent` path |
| **Live API** (voice/video WebSocket) | **0** | Text chat only |
| **Gemini 3.5 tuning** (thinking levels, thought signatures) | **40** | Default SDK behavior; no explicit `thinking_level` per agent |

### Google Search grounding ([docs](https://ai.google.dev/gemini-api/docs/google-search))

| Capability | mdeai usage | Score | Should we add? |
|------------|-------------|------:|----------------|
| Enable `googleSearch` tool on `generateContent` | ❌ | **0** | **Phase 2** — “Feria de las Flores 2026 dates” when not in Supabase |
| Auto search query generation + synthesis | ❌ | **0** | Same — event/news freshness |
| `groundingMetadata.webSearchQueries` (debug) | ❌ | **0** | Patricia observability if enabled |
| `groundingChunks` + `groundingSupports` inline citations | ❌ | **0** | Tourist trust — link claims to web sources |
| `searchEntryPoint` rendered widget (ToS) | ❌ | **0** | Only if we enable Search grounding |
| Per-query billing (Gemini 3+) | N/A | — | Budget guard like `grounding-quota.ts` required |
| Combine Search + URL context | ❌ | **0** | Sponsor / venue URL verification |

**Invariant:** Search grounding answers **time-sensitive / non-map** facts. **Do not** use for lat/lng or POI lists — keep Grounding Lite + Places.

### Google Maps grounding — Gemini built-in ([docs](https://ai.google.dev/gemini-api/docs/maps-grounding))

| Capability | mdeai usage | Score | Code | Should we add? |
|------------|-------------|------:|------|----------------|
| `tools: [{ googleMaps: {} }]` on `generateContent` | ⚠️ Fallback when MCP fails | **15** | `gemini_maps_grounding.py` | **Keep fallback** — MAP-002D documents prod switch criteria |
| `toolConfig.retrievalConfig.latLng` location bias | ✅ Medellín default in fallback | **60** | `DEFAULT_BIAS` 6.2442, -75.5812 | **Pass user map viewport** from `mapUi` when available |
| Parse `groundingMetadata.groundingChunks[].maps` | ✅ Fallback pin extraction | **55** | `_chunk_coords`, `placeUri` | **Keep** |
| Maps **context tokens / widgets** in response | ❌ | **0** | — | Phase 2 rich UI — optional alongside cards |
| Primary discovery via Gemini Maps in Mastra | ❌ | **0** | — | **No** — loses explicit pins + Places enrich pipeline |
| Pricing ($25 / 1k grounded prompts, verify current) | N/A | — | — | MCP + Details often cheaper for card UX |

**Prod path (correct):** Grounding Lite MCP → Places Details — documented in §1 and [Grounding Lite](https://developers.google.com/maps/ai/grounding-lite).

### Tool combination ([docs](https://ai.google.dev/gemini-api/docs/tool-combination))

| Pattern | mdeai usage | Score | Should we add? |
|---------|-------------|------:|----------------|
| `googleSearch` + custom function in one turn | ❌ | **0** | **Phase 2** — “events this weekend” → Search + `search-events` |
| `googleMaps` + custom function in one turn | ❌ | **0** | **Avoid in Mastra** — duplicate geo paths |
| `includeServerSideToolInvocations: true` (Gemini 3) | ❌ | **0** | Required if we ever mix built-in + custom in raw Gemini |
| Mastra multi-tool turn (custom only) | ✅ concierge calls grounded + rentals tools across turns | **80** | **Keep** — different mechanism, same UX goal |
| Thought signatures in multi-step tool history | ⚠️ Mastra/AI SDK may strip — unverified | **30** | Audit before enabling Gemini 3.5 `high` thinking |

### Function calling ([docs](https://ai.google.dev/gemini-api/docs/function-calling))

| Capability | mdeai usage | Score | Code | Should we add? |
|------------|-------------|------:|------|----------------|
| Declare tools with JSON schema | ✅ Zod → tool schemas | **90** | `createTool` in `mdeapp/src/mastra/tools/*` | **Keep** |
| Parallel function calls | ⚠️ Model-dependent; Mastra handles | **60** | — | Monitor — OK for Phase 1 |
| Tool choice / forced tool | ⚠️ Prompt gates only (rental/event clarify) | **50** | concierge instructions | **Structured intent tool** could use forced call |
| Automatic function calling (Python SDK) | N/A | **0** | — | Not applicable — TS/Mastra |
| Meeting-scheduler style multi-step | ⚠️ Working memory + follow-ups | **70** | rental/event memory schema | **Keep improving** prompts vs native AFC |

**Concierge tools today:** `search-rentals`, `search-events`, `search-restaurants`, `search-attractions`, `search-grounded-places` (+ router `classify-intent`).

### Structured output ([docs](https://ai.google.dev/gemini-api/docs/structured-output))

| Capability | mdeai usage | Score | Should we add? |
|------------|-------------|------:|----------------|
| `responseSchema` / JSON mode on agent reply | ❌ Prose + UI cards | **20** | **Low priority** — cards carry structure |
| Zod `outputSchema` on **tools** | ✅ All grounded/rental tools | **90** | **Keep** — this is our structured layer |
| Working memory Zod schema | ✅ `conciergeWorkingMemorySchema` | **85** | **Keep** |
| Enum / nested objects in schema | ✅ intents, budgetType, mapUi | **80** | Extend for MAP-011 route schema |
| Feedback-form style user JSON extraction | ❌ | **0** | **Roberto** host wizard — MAP-010+ form fill |

**Rule from Gemini docs:** Do not combine **structured output** with **Maps grounding** on same `generateContent` — we already split: tools return JSON, model speaks briefly.

### Interactions API ([docs](https://ai.google.dev/gemini-api/docs/interactions))

| Capability | mdeai usage | Score | Should we add? |
|------------|-------------|------:|----------------|
| `interactions.create` + server-side history | ❌ | **0** | **Defer** — Mastra + CopilotKit own thread state |
| `previous_interaction_id` cache hits | ❌ | **0** | Revisit if Mastra adds Interactions adapter |
| Observable `steps` timeline (thoughts, tools) | ❌ | **0** | Patricia debug — Phase 2 observability |
| Background / Deep Research agent | ❌ | **0** | **Skip Phase 1** — host research not in scope |
| Beta breaking changes (May 2026) | N/A | — | **Stay on generateContent** for prod per Google guidance |

### Live API ([docs](https://ai.google.dev/gemini-api/docs/live-api))

| Capability | mdeai usage | Score | Should we add? |
|------------|-------------|------:|----------------|
| Real-time voice (16 kHz in / 24 kHz out) | ❌ | **0** | **Phase 2+** — WhatsApp/voice concierge |
| Video / image stream to model | ❌ | **0** | Skip |
| Barge-in + tool use in live session | ❌ | **0** | With voice |
| Server-to-server vs client WebSocket | N/A | **0** | Edge function proxy + ephemeral tokens if shipped |
| Multilingual (70 langs) | ❌ English-only Phase 1 | **0** | PRD W7+ Spanish |

### Gemini 3.5 Flash features ([docs](https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.5))

| Capability | mdeai usage | Score | Should we add? |
|------------|-------------|------:|----------------|
| GA `gemini-3.5-flash` model ID | ✅ `FLASH_MODEL` | **95** | **Keep** — verify deprecations in CLAUDE.md |
| Default thinking `medium` (was `high` on 3 Flash preview) | ⚠️ Implicit via SDK | **50** | Set explicitly per agent |
| `thinking_level: low` for fast tool routing | ❌ | **0** | **Try** on `classify-intent` / simple turns — latency win |
| `thinking_level: high` for complex multi-tool turns | ❌ | **0** | Optional concierge override |
| Thought signatures in history | ⚠️ Unverified with Mastra | **30** | Test before enabling high thinking |
| 1M context / 65k output | ⚠️ Available, unused | **40** | Long thread summaries — Phase 2 |
| Computer Use tool | ❌ Not supported on 3.5 Flash | **0** | **Skip** |

### Recommended Gemini additions (maps + chat)

| P | Feature | Persona | Effort | Notes |
|---|---------|---------|--------|-------|
| **G1** | Pass **map viewport / latLng** into ADK invoke + Gemini fallback bias | Camila | ~1h | Better “near me” when map panned |
| **G2** | **`thinking_level: low`** on router / cheap turns | All | ~2h | Measure latency on tool-heavy chat |
| **G3** | **Google Search grounding** edge fn for **event date** facts | Tourist | ~4h | Only when Supabase empty; quota + citations |
| **G4** | Document **MAP-002D** criteria for Gemini Maps vs MCP | Sofía | ~1h | When MCP 429 / key restriction |
| **G5** | **Tool combination spike** (Search + `search-events`) | Tourist | ~1d | Phase 2 — do not merge with Maps built-in |
| **G6** | **Interactions API** pilot | Patricia | ~1w | After Mastra stability review — not W1–W6 |
| **G7** | **Live API** voice concierge | Camila | weeks | Phase 2 WhatsApp — ephemeral tokens |

---

## 2. Maps (Web display)

| Capability | GMP product | Key features | mdeai usage | Score | Task / code | Should we add? |
|------------|-------------|--------------|-------------|------:|-------------|----------------|
| Interactive map + pins | **Maps JavaScript API** via `@vis.gl/react-google-maps` | Map, camera, gestures | ✅ `ChatMap`, Medellín default center | **80** | MAP-001, F48 | **Keep** |
| Custom styled markers | **Advanced Markers** + **Map ID** | Pin chrome, no legacy Marker | ✅ `AdvancedMarker` + env Map ID guard | **85** | MAP-008 | **Keep** — polish → MAP-009 numbered pins |
| Fit bounds / focus pin | JS API camera controls | fitBounds, panTo | ✅ `MapFitBoundsController`, F50 sync | **82** | MAP-016, F50 | **F50b** viewport sync next |
| Marker clustering | `@googlemaps/markerclusterer` | Dense pin UX | ❌ Planned | **10** | MAP-009 | **Yes — Post-MVP** when >20 pins common |
| Map layers / data-driven styling | Map ID cloud styling, datasets | Thematic layers | ❌ | **5** | — | **Defer** — no persona story yet |
| Static map images | **Maps Static API** | OG images, email thumbnails | ❌ | **0** | — | **Could** — event share cards (Roberto) |
| Embeddable iframe map | **Maps Embed API** | Zero-JS embed | ❌ | **0** | — | **Skip** — we own full JS map |
| Street View | **Street View Static / JS** | Building context | ❌ | **0** | — | **Phase 2** rental “street view” CTA |
| 3D / tilt / WebGL extras | JS API vector features | Immersive map | ❌ | **0** | — | **Skip Phase 1** |

---

## 3. Places

| Capability | GMP product | Key features | mdeai usage | Score | Task / code | Should we add? |
|------------|-------------|--------------|-------------|------:|-------------|----------------|
| Agent-driven POI search | Grounding Lite (not Places REST) | NL queries | ✅ | **95** | MAP-002 | **Keep** — don’t replace with `searchText` in chat |
| Place Details enrichment | **Places API (New)** `places/{id}` | Rating, hours, photos, types | ✅ Sidecar batch enrich + field masks | **92** | MAP-018B, MAP-004 | **Keep** — bump mask only via checklist |
| Place Photos | **Places API (New)** Photo media | `photos[].name` → media URL | ✅ `/api/places/photo` proxy + attributions | **88** | MAP-018D | **Keep** |
| Details + search cache | Supabase + sidecar L1/L2 | Repeat query cost control | ✅ `place_details_cache` + Cloud Run **00009-bwv** | **85** | MAP-018E | **Extend** → MAP-005 search cache |
| Text Search REST | Places API (New) `places:searchText` | Keyword search | ⚠️ SDK + `verify-maps-env` probe only | **35** | MAP-004 client | **Yes — MAP-005/006** for “Show nearby”, not concierge NL |
| Nearby Search REST | Places API (New) `places:searchNearby` | Radius + types | ⚠️ Client method exists; no UI | **30** | MAP-006 | **Yes — high ROI** Camila rental card CTA |
| Autocomplete (New) | **Place Autocomplete** | Session tokens, venue pick | ❌ | **5** | MAP-010 | **Yes — required** Roberto `/host/event/new` |
| Geocoding API | Legacy geocode | Address ↔ lat/lng | ⚠️ Env probe only — see **§11** | **10** | `verify-maps-env.mjs` | **No product path** — Places/Grounding |
| Address Validation | **Address Validation API** | Deliverability, components | ❌ | **0** | — | **Could** — Roberto venue address QA |
| Editorial / AI summaries | Details `editorialSummary`, `generativeSummary` | Marketing blurbs | ❌ Cost-gated off | **20** | MAP-018 | **Defer** |
| **Maps deep links** (`googleMapsLinks`) | Places API (New) | See **§3b** below | Shipped (MAP-019) | **82** | `details-v3-links-2026-05-26` | **Keep** — redeploy ADK for prod mask v3 |

### 3b. Places API — `googleMapsLinks` (Capabilities Explorer)

Verified **2026-05-26** via `mde-maps` + Google Maps Code Assist MCP against [Link to Google Maps](https://developers.google.com/maps/documentation/places/web-service/maps-links?utm_source=gmp-code-assist) (GA Aug 2025; billed when mask includes `googleMapsLinks`).

| Explorer capability | mdeai usage | Score | Code / mask | Should we add? |
|---------------------|-------------|------:|-------------|----------------|
| Return URI to open place in Google Maps (`placeUri`) | ✅ Cards + pins + attribution | **90** | Mask v3 + `GroundedPlaceCard` “Open in Google Maps” | **Keep** |
| Return URI to open **directions** page in Google Maps | ✅ When Google returns URI | **85** | `googleMapsLinks.directionsUri` — official link only (origin = user device per Google docs) | **Keep** — MAP-019 Done |
| Return URI to open **photos** page in Google Maps | ❌ We proxy photo bytes instead | **40** | Proxy covers card thumbnail; `photosUri` optional fallback | **Optional** |
| Return URI to open **read reviews** page | ✅ When Google returns URI | **85** | `googleMapsLinks.reviewsUri` on mask v3 + card CTA | **Keep** — MAP-019 Done |
| Return URI to open **write a review** page | ❌ | **0** | `googleMapsLinks.writeAReviewUri` | **Skip Phase 1** — no UGC loop yet |

---

## 4. Routes & mobility

| Capability | GMP product | Key features | mdeai usage | Score | Task / code | Should we add? |
|------------|-------------|--------------|-------------|------:|-------------|----------------|
| Simple A→B time/distance | Grounding Lite `compute_routes` | Commute cards | ⚠️ Stub | **15** | MAP-011 | **Yes** |
| Full directions + polylines | **Routes API (New)** | Steps, traffic, alternatives | ❌ | **0** | — | **Defer** — Mindtrip walking routes out of scope |
| Distance Matrix | Routes API | Many-to-many ETAs | ❌ | **0** | — | **Phase 2** “compare 5 apartments to coworking” |
| Roads / snap to road | **Roads API** | GPS trace cleanup | ❌ | **0** | — | **Skip** |
| Route Optimization | **Route Optimization API** | Fleet / delivery | ❌ | **0** | — | **Skip** — not events logistics Phase 1 |
| Turn-by-turn navigation | Navigation SDK (iOS/Android) | In-app nav | ❌ | **0** | — | **Skip** — link out to Google Maps app |

---

## 5. Environment APIs

| Capability | GMP product | Key features | mdeai usage | Score | Should we add? |
|------------|-------------|--------------|-------------|------:|----------------|
| Weather | **Weather API** / Grounding `lookup_weather` | Forecast, conditions | ❌ | **0** | **Phase 2** Tourist; prefer Grounding Lite first |
| Air Quality | **Air Quality API** | AQI, pollutants | ❌ | **0** | **Skip Phase 1** |
| Pollen | **Pollen API** | Allergy forecast | ❌ | **0** | **Skip** |
| Solar | **Solar API** | Rooftop solar potential | ❌ | **0** | **Skip** — wrong vertical |

---

## 6. Places Insights API (analytics — Patricia / MAP-012+)

**Product fit:** Admin market intel, host “how competitive is this neighborhood?” — **not** live chat turns. Prefer **cached rollups** in Supabase (MAP-012) over per-message Insights calls.

| Explorer capability | mdeai usage | Score | Persona | Should we add? |
|---------------------|-------------|------:|---------|----------------|
| Understand core concepts, features, endpoints | ❌ Not evaluated in prod | **0** | Patricia | **Phase 2** — read before MAP-012 design |
| GCP project setup + enable Places Insights API | ❌ | **0** | Sofía | **When** Patricia dashboards ship |
| Formulate and submit insight queries | ❌ | **0** | Patricia | **MAP-012+** or admin `/admin/maps-insights` |
| Apply filters: geographic boundaries, radius, types, **brands** | ❌ | **0** | Patricia | **High value** — “how many specialty coffee brands in Laureles?” |
| Filter by commercial **brand identifiers** | ❌ | **0** | Patricia | **Enterprise** — sponsor / chain density |
| Query aggregated place count metrics (analytical functions) | ❌ | **0** | Patricia | Overlaps MAP-012 `neighborhood_scores` |
| Total count matching filter parameters | ❌ | **0** | Camila (indirect) | **Cache weekly** — don’t call live in chat |
| Breakdown by **place types** | ❌ | **0** | Camila | **MAP-012** hood cards (“cafés vs gyms”) |
| Breakdown by **H3 hex grid** cells | ❌ | **0** | Patricia | **Ops** — heatmaps for lead gen territories |
| List supported place type categories | ❌ | **0** | Sofía | **Doc task** — align with MAP-004 type filters |
| Parse response schema + country availability | ❌ | **0** | Sofía | **Verify CO coverage** before committing to Insights vs Aggregate |
| Understand data types, coverage, attributes | ❌ | **0** | Sofía | Required pre-implementation spike |

**Places Insights vs our plan:** MAP-012 currently specifies **MAP-006 nearby patterns + Supabase cache**, not Places Insights. Re-evaluate if Insights gives cheaper hex/type rollups for Colombia than hand-rolled Nearby Search loops.

| Approach | Score today | Best for |
|----------|------------:|----------|
| Live Places Insights in chat | **0** | ❌ Never — quota storm |
| Weekly Insights → Supabase | **0** | Patricia dashboards, MAP-012 v2 |
| Weekly Nearby Search sampling → Supabase (MAP-012 v1) | **15** | Planned — simpler, already masked |

---

## 7. Places Aggregate API (lighter analytics)

**Product fit:** “How many `$` cafés in this polygon?” without full Insights schema — good stepping stone before Insights.

| Explorer capability | mdeai usage | Score | Task | Should we add? |
|---------------------|-------------|------:|------|----------------|
| Count places in geographic area matching filters | ❌ | **0** | MAP-012 | **Yes — Phase 2** hood density |
| Return **place IDs** in area matching filters | ❌ | **0** | MAP-012 enrichment | **Maybe** — seed Supabase POI tables |
| Filter by **operating status** (count / place IDs) | ❌ | **0** | — | **Patricia** — “open now density” reports |
| Filter by **place type** (count / place IDs) | ❌ | **0** | MAP-012 | **Yes** — café/coworking counts |
| Filter by **price level** (count / place IDs) | ❌ | **0** | MAP-012 | **Camila** — “budget dining density” |
| Filter by **user rating** (count / place IDs) | ❌ | **0** | MAP-012 | **Camila** — “high-rated gym count” |

**Aggregate vs Insights:** Start with **Aggregate** for MAP-012 if CO coverage is confirmed — simpler API, fewer analytical functions, enough for neighborhood comparison cards.

---

## 8. Maps Static API

| Explorer capability | mdeai usage | Score | Should we add? |
|---------------------|-------------|------:|----------------|
| Return URL of configurable static map image | ❌ | **0** | **Roberto** — OG/social preview with event pin |
| Embed static map image in web page | ❌ | **0** | Same — email templates |
| Customize size and scale | ❌ | **0** | With Static URL builder |
| Customize image format (PNG/JPG) | ❌ | **0** | With Static URL builder |

**Note:** We use **live Maps JS** in chat — Static is for **share artifacts**, not the main map panel.

---

## 9. Map Tiles API & Maps Datasets API

| Explorer capability | GMP product | mdeai usage | Score | Should we add? |
|---------------------|-------------|-------------|------:|----------------|
| 2D roadmap / satellite / terrain tile images | Map Tiles API | ❌ | **0** | **Skip** — vis.gl uses JS API, not raw tiles |
| Street View tile / thumbnail / metadata | Map Tiles API | ❌ | **0** | **Phase 2** custom SV picker |
| Photorealistic 3D tiles (OGC / CesiumJS) | Map Tiles API | ❌ | **0** | **Skip Phase 1** — marketing only |
| Create / list / upload custom datasets (CSV, GeoJSON, KML) | Maps Datasets API | ❌ | **0** | **Patricia** — Medellín comuna boundaries overlay |
| Return data + metadata from custom dataset | Maps Datasets API | ❌ | **0** | **MAP-012+** — hood polygons for Aggregate filters |

---

## 10. Maps Embed API

| Explorer capability | mdeai usage | Score | Should we add? |
|---------------------|-------------|------:|----------------|
| Embed standard map iframe | ❌ | **0** | **Skip** — full JS map shipped |
| Embed place search results iframe | ❌ | **0** | **Skip** |
| Embed directions iframe | ❌ | **0** | **Skip** — use `directionsUri` deep link |
| Embed Street View iframe | ❌ | **0** | **Skip** |

---

## 11. Geocoding API (Capabilities Explorer)

**Policy:** Prefer **Places New + Grounding** for product geocoding. Geocoding API used today only as **env probe** (`verify-maps-env.mjs`).

| Explorer capability | mdeai usage | Score | Should we add? |
|---------------------|-------------|------:|----------------|
| Forward geocode (address → lat/lng) | ⚠️ Probe only | **10** | **No** in app — MAP-010 autocomplete + Details |
| Reverse geocode (lat/lng → address) | ❌ | **0** | **Maybe** — pin drop → address label |
| Restrict geocode to region / country / postal code | ❌ | **0** | **With** Address Validation / Autocomplete bias CO |
| Restrict geocode to viewport | ❌ | **0** | Autocomplete handles this |
| Reverse geocode filter by address type | ❌ | **0** | **Skip** |
| Return address for Place ID | ❌ | **0** | **Use Places Details** `formattedAddress` instead |
| Building **entrance** lat/lng (Place ID / address / coords) | ❌ | **0** | **Phase 2** Roberto venue precision |
| Building **outline** lat/lng | ❌ | **0** | **Skip** |
| Proximity to landmarks / areas | ❌ | **0** | **MAP-012** narrative — “near Parque Lleras” |
| Return **Street View panorama** for location | ❌ | **0** | **Phase 2** rental detail — JS SV or Static SV |

---

## 12. Maps JavaScript API — extended (Capabilities Explorer)

**Summary score for JS API feature breadth:** **22/100** — we use core map + AdvancedMarker only; most explorer flags are N/A or Phase 2+.

| Explorer capability | mdeai usage | Score | Should we add? |
|---------------------|-------------|------:|----------------|
| Localize map (language/region) | ⚠️ English-only Phase 1 | **30** | **Phase 2** i18n (PRD deferred W7+) |
| Bicycling / transit layer | ❌ | **0** | **Phase 2** Tourist “metro near me” |
| GeoRSS layer | ❌ | **0** | **Skip** |
| Vector-based icon markers | ✅ AdvancedMarker custom div | **75** | **MAP-009** numbered/cluster icons |
| **Street View** panorama in page | ❌ | **0** | **Phase 2** venue preview |
| deck.gl / 3D photorealistic overlays | ❌ | **0** | **Skip** |
| **Fleet Engine** delivery tracking (all variants) | ❌ | **0** | **N/A** — not a logistics product |
| Fleet Engine map styling (buildings, roads, density, polylines) | ❌ | **0** | **N/A** |

---

## 13. Analytics & enterprise (other)

| Capability | GMP product | mdeai usage | Score | Should we add? |
|------------|-------------|-------------|------:|----------------|
| Imagery / Roads Management Insights | Analytics | ❌ | **0** | Skip |
| Google Earth | Enterprise | ❌ | **0** | Skip |

---

## Recommended additions (priority order)

| P | Product / capability | Persona win | Effort | Task | Why not “max” today |
|---|----------------------|-------------|--------|------|---------------------|
| ~~**1**~~ | Places **`googleMapsLinks.directionsUri`** on cards | Camila — one-tap directions | — | **MAP-019** ✅ 2026-05-26 | Done — prod needs ADK redeploy for v3 cache |
| **2** | Places **Nearby Search** | Camila — walkable from rental | ~3h | **MAP-006** | Client exists; needs MAP-005 proxy + UI CTA |
| **3** | Place **Autocomplete** (New) | Roberto — venue picker | ~3h | **MAP-010** | Blocked on MAP-005 + F34 wizard |
| **4** | Grounding Lite **`compute_routes`** | Camila — commute minutes in chat | ~3h | **MAP-011** §011A→011B | Sidecar stub today |
| **5** | **Places Aggregate API** → Supabase rollups | Patricia / MAP-012 hood density | ~4h | **MAP-012** after **MAP-012A** | Spike gates v1 path |
| **6** | **Places Insights API** (hex + brand filters) | Patricia — territory heatmaps | ~6h+ | **MAP-012** v2 | After **MAP-012A** decision |
| **7** | **Marker clustering** | Camila — 20+ pins readable | ~2h | **MAP-009** | When dense searches common |
| **8** | **Places proxy + search cache** | Patricia — cost at scale | ~4h | **MAP-005** | Unlocks 006/010 |
| ~~**9**~~ | **`googleMapsLinks.reviewsUri`** on grounded cards | Tourist — read reviews | — | **MAP-019** ✅ 2026-05-26 | Done — same deploy note as #1 |
| **10** | **Maps Static API** | Roberto — OG event map image | ~2h | **MAP-023** | WhatsApp / SEO previews |
| **11** | Grounding Lite **`lookup_weather`** | Tourist — weather in chat | ~1h | New (MAP-020 TBD) | MCP already on sidecar |
| **12** | Gemini Maps fallback observability | Patricia — debug MCP failures | ~1–2h | **MAP-002E** | Runbook + logging; criteria in MAP-002 G4 |
| **G1–G7** | See **§1b Recommended Gemini additions** | Search, thinking, Live, viewport bias | varies | **MAP-002D** (G3), **MAP-002 G1** | Complements MAP tasks — not replacements |
| **—** | Map Tiles, Embed, Fleet Engine, Interactions (prod), Live API (Phase 1) | — | — | — | **Skip or Phase 2+** — see [INDEX § Do not file MAP tasks yet](./INDEX.md#do-not-file-map-tasks-yet-phase-2-platform) |

---

## Do not file MAP tasks yet

Future platform work — **not** current MVP priorities. Correct to defer.

| Feature | Why defer |
|---------|-----------|
| Live voice AI | Too early — no Phase 1 persona surface |
| Gemini Interactions API | Architecture still evolving; Mastra owns conversation threads |
| Full multimodal live agent | Phase 2 |
| Street View AI | Nice-to-have; no product story yet |
| Transit overlays on map | Later — MAP-011 ships commute **card** only |
| Maps Datasets admin analytics | After core UX (MAP-012A spike → MAP-012 first) |

**Where to track:** `tasks/core/` (G6/G7), `tasks/ADK/`, or Phase 2 PRD — **not** new `MAP-###` specs.

---

## Architecture alignment (Capabilities Explorer → mdeai)

```text
Discovery  → Grounding Lite MCP search_places     (Camila / Tourist NL queries)
Enrichment → Places API (New) Details + Photos    (018B sidecar, masked)
Cache      → Supabase place_details_cache        (018E, 7-day TTL)
Render     → Maps JS + Map ID + AdvancedMarker     (browser only)
Photos     → /api/places/photo proxy               (server key, rate limit)
```

This matches Google’s recommended split: **Grounding for agent search**, **Places New for structured fields**, **Maps JS for display** ([Grounding Lite docs](https://developers.google.com/maps/ai/grounding-lite)).

---

## Gaps vs “max potential” (honest)

| Gap | Impact | Fix |
|-----|--------|-----|
| No Nearby / Autocomplete in UI | Camila + Roberto flows incomplete | MAP-006, MAP-010 |
| `compute_routes` stub | Commute questions fall back to prose | MAP-011 |
| No clustering | Map noisy at scale | MAP-009 |
| `searchText` not in chat | ✅ **Correct** — don’t double-bill with Grounding | Keep invariant |
| No Weather / Environment APIs | Tourist “what to pack” weak | Grounding `lookup_weather` first |
| No `directionsUri` / `reviewsUri` on cards | Extra tap through Maps app only | Add to Details mask + card buttons |
| No Insights / Aggregate | Hood comparison is LLM-ish without MAP-012 | Aggregate first, Insights if CO coverage OK |
| Gemini Search grounding unused | Event dates / news hallucination risk | G3 — gated edge call with citations |
| No explicit `thinking_level` | Default medium may over-think simple turns | G2 — `low` on router/classify |
| Gemini Maps not in Mastra path | ✅ Correct — MCP + Details richer than built-in alone | Keep; improve fallback bias (G1) |

---

# Operational run checklist

**Prereq:** `cd mdeapp && npm run dev` (or UI already on `:3001` HTTP 200).

## A. Unit + floor

```bash
cd /home/sk/mdeai/mdeapp
npm test
npm run lint && npm run typecheck
cd /home/sk/mdeai/services/adk-grounding && .venv/bin/python -m pytest test_places_enrich.py -q
```

## B. Env + sidecar smoke

```bash
cd /home/sk/mdeai/mdeapp
npm run verify:maps-env
npm run verify:supabase
npm run verify:grounding
npm run verify:grounding-enrichment
curl -s -o /dev/null -w "UI:%{http_code} " http://localhost:3001/
curl -s -o /dev/null -w "CK:%{http_code}\n" -X POST http://localhost:3001/api/copilotkit -H "Content-Type: application/json" -d '{}'
```

## C. Console + chat smokes

```bash
npm run verify:console:boot
npm run verify:console
npm run smoke:map-pins
npm run smoke:grounding-attribution
npm run smoke:f50-pin-sync
```

## D. Playwright (maps track)

```bash
PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-grounding.spec.ts --project=chromium
PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-layout-desktop.spec.ts --project=chromium
PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-layout-mobile.spec.ts --project=chromium
PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-007b-evidence.spec.ts --project=chromium
```

## E. Cloud Run prod sidecar

```bash
URL=$(gcloud run services describe mdeai-adk-grounding --region=us-east1 --format='value(status.url)')
curl -sS "$URL/health"
npm run verify:grounding-enrichment
```

## F. Evidence

- [ ] Redacted output → `tasks/notes/MAP-###-evidence.md`
- [ ] Update `INDEX.md` + `notes-2.md` if status changed

## MAP-018 Done gates (reference)

| Gate | Pass |
|------|------|
| Rich cards (photo, ★, price, hours) | `grounded-card-rating` in Playwright |
| No duplicate prose list | concierge ≤2 sentences after grounded search |
| Photo proxy server-only | no Places key in browser network |
| Photo attributions when present | `grounded-card-photo-attribution` |
| Details cache 018E | `places_cache_hit=true source=supabase` |
| Rate limit on `/api/places/photo` | 429 after 120/min/IP |

---

## Re-audit cadence

Re-score when: new MAP task ships, Google adds Capabilities Explorer SKUs, Gemini tool docs change, or Phase 2 opens (MAP-002D, MAP-005–012, G1–G7). Use **google-maps-code-assist** MCP before changing field masks; use **gemini-api-docs** before enabling built-in Search/Maps tools.
