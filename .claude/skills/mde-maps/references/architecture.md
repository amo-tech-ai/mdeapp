---
title: Maps + AI — Three systems and how they work together
---

# Maps + AI — Architecture overview for mdeAI

Three separate Google systems serve different parts of the mdeAI geo story. They are **not interchangeable** — each has a distinct role, billing model, and latency profile.

> **Core principle:**
> **Gemini enriches · Mastra orchestrates · Supabase owns truth · Frontend owns rendering**
>
> Gemini should never directly control app state. It returns data; Mastra tools apply it to Supabase; the frontend reads from Supabase. Grounding is just Gemini having richer data to enrich — the ownership model doesn't change.

---

## The three systems at a glance

| System | What it does | When it runs | Cost | Auth |
|--------|-------------|-------------|------|------|
| **Places API (New)** | Batch-enriches the Supabase DB with `place_id`, `maps_url` per venue | Once, at seed/migration time — never during chat | ~$17–40/1K requests (field-mask driven) | `GOOGLE_PLACES_API_KEY` (IP restricted) |
| **Gemini Maps Grounding** | Real-time geo-aware answers inside `generateContent` | Only for "near me / open now / walkable" queries during chat | **$25/1K grounded prompts**, 500/day free | `GEMINI_API_KEY` (Maps grounding must be enabled on project) |
| **Maps Grounding Lite MCP** *(GA)* | Live `search_places` / `lookup_weather` / `compute_routes` via MCP tool calls | Claude Code sessions, Mastra agents, non-Gemini LLM workflows | Pay-as-you-go per request (product SKU) | `GOOGLE_MAPS_API_KEY` via `X-Goog-Api-Key` header |

---

## How they connect — phase by phase

```
PHASE 2 — Seed time (once per venue)
──────────────────────────────────────
Places API (New) → searchText("El Cielo Restaurant El Poblado Medellín Colombia")
         │
         ▼
Supabase DB row: {
  place_id: "ChIJxxxxx",
  maps_url: "https://maps.app.goo.gl/...",  ← canonical placeUri from googleMapsLinks
  latitude: 6.2088,
  longitude: -75.5736,
  ai_summary: "Wood-fired arepas on a terrace..."  ← Gemini-generated at seed time
}


PHASE 3 — Chat turn (per user message)
──────────────────────────────────────
User: "any good arepas open now near Parque Lleras?"
         │
         ▼
needsMapsGrounding(message) → true  [GEO_PATTERNS match]
         │
         ▼
canGroundToday() → true  [quota not exceeded]
         │
         ▼
Call 1 — Gemini generateContent + googleMaps tool + Medellín latLng
         │
         ▼
groundingChunks: [{ maps: { placeId: "ChIJxxxxx", title: "El Cielo", uri: "..." } }]
         │
         ├── Look up DB row by place_id → get rich cached data (ai_summary, maps_url, images)
         │
         ▼
Call 2 — Gemini generateContent + responseMimeType: 'application/json'
         (grounding context injected as text, NOT as googleMaps tool)
         │
         ▼
Structured ChatAction { listings: [...], citations: [{ placeId, uri }] }
         │
         ▼
SSE → EmbeddedListings renders cards with maps_url link + ai_summary
ChatMap.tsx renders pins from latitude/longitude
```

---

## Decision tree: which system to use?

```
Question about a venue/place
  │
  ├─ Does this need live/real-time data (open now, current hours, proximity)?
  │    │
  │    ├─ Do you also need typed structured output (JSON schema) in the SAME call?
  │    │    └─ YES → Mode 2 via function calling: convert MCP tools with mcpToTool(),
  │    │             call search_places as regular function + responseMimeType in one call
  │    │
  │    └─ NO structured output needed (prose + citations only)
  │         └─ Mode 1: Gemini native googleMaps tool, sequential calls if structured output needed
  │
  ├─ Is this a seeding/enrichment script run manually?
  │    └─ YES → Places API (New) via @googlemaps/places
  │
  ├─ Is this a Claude Code session or Mastra agent tool call (not Gemini API)?
  │    └─ YES → Maps Grounding Lite MCP (search_places / lookup_weather / compute_routes)
  │
  └─ Is this a standard query against existing DB data?
       └─ YES → Supabase only — $0, fastest path, no Maps API call needed
```

### Mode 1 vs Mode 2 for structured output

The official Google sample app (`googlemaps-samples/grounding-lite-mcp-sample-app`) uses **Mode 2** as its primary approach — it connects to `mapstools.googleapis.com/mcp`, converts the MCP tools to Gemini function declarations via `mcpToTool()`, and uses standard function calling. Since this is regular function calling (not the native `googleMaps` grounding tool), it can be combined with `responseMimeType: 'application/json'` in a single call.

| Approach | Structured output | Pricing | When to use |
|----------|------------------|---------|-------------|
| **Mode 1** (`tools: [{ googleMaps: {} }]`) | Sequential calls only (not confirmed combined) | $25/1K, 500/day free | Prose-first answers with grounding citations |
| **Mode 2** (MCP → `mcpToTool()` → function calling) | Can combine in one call | Per SKU via Maps Platform | Structured card payloads from grounded data |

For GROUNDING-001, Mode 2 may simplify implementation significantly if structured JSON card payloads are needed from grounded search results.

---

## What each system returns and what to do with it

### Places API (New) — enrichment output

```typescript
// From searchText() with field mask
{
  id: "ChIJxxxxx",                            // → store as place_id
  displayName: { text: "El Cielo", languageCode: "es" },
  googleMapsLinks: {
    placeUri: "https://maps.app.goo.gl/...",  // → store as maps_url (canonical, free in preview)
    directionsUri: "https://...",
    photosUri: "https://...",
  },
  location: { latitude: 6.2088, longitude: -75.5736 },  // → backfill if null
  generativeSummary: null,  // ALWAYS null for Medellín — US/India only
}
```

### Gemini Maps Grounding — chat-turn output

```typescript
// From groundingMetadata in candidate[0]
{
  groundingChunks: [
    { maps: { placeId: "ChIJxxxxx", title: "El Cielo", uri: "https://maps.google.com/..." } }
  ],
  groundingSupports: [...],  // text-span → chunk-index mappings for inline citations
  webSearchQueries: [...],
}
// placeId from chunk → look up maps_url from DB row (already enriched in Phase 2)
```

### Maps Grounding Lite MCP — tool-call output

```typescript
// From search_places({ text_query: "arepas near Parque Lleras", location_bias: { latitude, longitude, radius_meters } })
{
  places: [
    {
      id: "...",
      displayName: { text: "..." },
      googleMapsUri: "https://...",
      // attribution field — must display immediately following results
    }
  ],
  attribution: "Data from Google Maps"
}
```

---

## Cost comparison at mdeAI scale

Assume 1,000 MAU, 10 chat messages/user/month = 10,000 messages/month:

| Query type | Fraction | System | Cost |
|-----------|---------|--------|------|
| Standard DB queries (events, rentals, restaurant lists) | ~85% | Supabase only | $0 |
| Geo proximity / open-now queries | ~15% | Gemini Maps Grounding | 1,500 grounded prompts = ~$25.50/mo after 500/day free tier used |
| Seeding new venues (one-time) | 1,000 venues | Places API (New) | ~$20–40 one-time |
| **Total maps cost** | | | **~$25–65/month** |

At this scale, stay on free tier for grounding as long as grounding calls stay below 500/day. Above 500/day, costs are ~$25/1K.

---

## ToS compliance checklist (per system)

### Places API (New)
- [ ] `generativeSummary.disclosureText` shown wherever `generativeSummary` is displayed ("Summarized with Gemini") — not applicable for Medellín, but needed if any US/India venue is ever added
- [ ] Do not cache results beyond the permitted window (DB enrichment at seed time is permitted)

### Gemini Maps Grounding
- [ ] "Google Maps" attribution text verbatim, immediately following grounded content
- [ ] Font: Roboto or sans-serif fallback, weight 400, size 12sp minimum, 4.5:1 contrast
- [ ] `translate="no"` on the attribution element
- [ ] Attribution reachable in one user interaction (linked or tappable)
- [ ] Do NOT cache: grounded text, `webSearchQueries`
- [ ] MAY cache: `placeId`, `reviewId`, `googleMapsWidgetContextToken`
- [ ] No emergency/safety-critical use cases
- [ ] No Prohibited Territory distribution

### Maps Grounding Lite MCP
- [ ] Include `attribution` field content from response immediately following generated content
- [ ] 300 QPM per tool per project rate limit — add backoff if calling at scale

---

## Common failure modes

| Failure | Symptom | Root cause | Fix |
|---------|---------|-----------|-----|
| Places enrichment finds wrong venue | `maps_url` points to wrong place | Text query too short or ambiguous | Add neighborhood + "Medellín Colombia" to query; add `location_bias` |
| `generativeSummary` always null | `ai_summary` never populated from Places API | Not available for Colombia | Use Gemini `generateContent` directly at seed time (PLACES-005-010 step 4) |
| Grounding fires on wrong queries | Every restaurant query charges $25/1K | Regex too broad | Tighten GEO_PATTERNS; confirm Spanish patterns don't match standard queries |
| Grounding fires 0 times | "Near me" queries use Supabase path | Regex doesn't match Spanish input | Add Spanish patterns to GEO_PATTERNS |
| Quota guard doesn't hold | Grounding fires >200x/day in production | In-memory counter resets on cold start | Replace counter with Supabase row before Phase 3 launch |
| `responseMimeType` breaks grounding | Call 1 returns no `groundingChunks` | Structured output + googleMaps tool combined in one call | Never combine — two sequential calls required |
| Missing maps_url on grounded results | Cards have no "Open in Maps" link | Grounded placeId not found in DB | Phase 2 must complete before Phase 3; fall back to constructed URL |
| Attribution missing in UI | ToS violation | Forgot to render `groundingChunks[].maps.uri` | Every grounded result render path must show attribution |
| `findPlaceFromText` 404 | Enrichment script fails | Using deprecated legacy Places API endpoint | Use `@googlemaps/places` `searchText()` with field mask header |

---

## Interactions API vs generateContent for Maps grounding

The Gemini API offers two paths for Maps grounding:

| Path | Status | Structured output | Interface |
|------|--------|------------------|-----------|
| `generateContent` + `tools: [{ googleMaps: {} }]` | **Stable / GA** | Maps + custom function declarations can be combined in one call (March 2026 update). Maps + `responseMimeType: 'application/json'` is **still not confirmed** — use sequential calls | `toolConfig.retrievalConfig.latLng` — works with Spanish prompts |
| `interactions.create` + `tools: [{ type: "google_maps", latitude, longitude }]` | **Beta** | Constraint unclear | **English prompts and responses only** — unusable for mdeAI Spanish users |

**For mdeAI production (Phase 3): use `generateContent` only.**

Two reasons to never use the Interactions API for mdeAI:
1. **English-only** — the official docs state "Language: English prompts and responses only". Most mdeAI users write in Spanish.
2. **Beta status** — Google's own docs say "For stable production deployments, we recommend you continue to use the generateContent API."

The Interactions API might work for purely English-language tools or Claude Code sessions, but it is not viable for a Spanish-language chat interface.

---

## ADK vs direct Gemini API — which path mdeAI uses

Google's Agent Development Kit (ADK) offers `google.adk.tools.google_maps_grounding` as a first-class tool, but it **requires Vertex AI** (`GOOGLE_GENAI_USE_VERTEXAI = "True"`). The Google Cloud Console project must have the Vertex AI API enabled, and Application Default Credentials must be configured.

mdeAI uses the **direct Gemini API** (`generateContent` with `tools: [{ googleMaps: {} }]`), which works without Vertex AI using just `GEMINI_API_KEY`. The behavior is equivalent; the ADK wrapper adds agent lifecycle management and streaming UI helpers that mdeAI doesn't need.

Do not follow ADK code examples literally when implementing GROUNDING-001 — the SDK imports, auth setup, and tool declaration syntax are all different from the direct API path.

| Approach | Requires Vertex AI | Tool declaration | Auth |
|----------|------------------|------------------|------|
| **ADK** (`google.adk.tools`) | **Yes** | `tools=[google_maps_grounding]` | Vertex AI Application Default Credentials |
| **Direct API** (mdeAI path) | No | `tools=[{ googleMaps: {} }]` | `GEMINI_API_KEY` |

---

## See also

- [`maps-grounding.md`](maps-grounding.md) — full code patterns, quota guard, ai_runs logging, red-flags table
- [`places-official/README.md`](places-official/README.md) — full-text Places / UI Kit / Contextual View exports (grep, air-gap)
- [`places-api-web-service.md`](places-api-web-service.md) — Places Web Service **official URL index** + mdeAI rules
- [`places-api-new.md`](places-api-new.md) — enrichment field masks, Node.js client pattern
- [`maps-js-api.md`](maps-js-api.md) — ChatMap.tsx, AdvancedMarkerElement, pin merge
- [`security-and-optimization.md`](security-and-optimization.md) — 2-key architecture, zero-key embeds
- [`maps-grounding-lite`](maps-grounding.md#mode-2--maps-grounding-lite-mcp-server) — `mapstools.googleapis.com` MCP, search_places, lookup_weather, compute_routes
