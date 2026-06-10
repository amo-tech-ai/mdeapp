---
title: Gemini Maps Grounding — mdeAI reference
---

# Gemini Maps Grounding — mdeAI reference

Official docs:
- Gemini API: https://ai.google.dev/gemini-api/docs/maps-grounding
- Maps Platform product page: https://mapsplatform.google.com/maps-products/grounding/
- Grounding Lite (MCP path): https://developers.google.com/maps/ai/grounding-lite
- Google Search grounding (sibling pattern): https://ai.google.dev/gemini-api/docs/google-search

## Table of contents

- [Two separate systems — pick the right one](#two-separate-systems--pick-the-right-one)
- [Two grounding modes](#two-grounding-modes) — Mode 1 (Gemini API tool) · Mode 2 (Grounding Lite MCP, GA)
- [Intent gate — only fire grounding when needed](#intent-gate--only-fire-grounding-when-needed)
- [Sequential call pattern — do not combine with structured output](#sequential-call-pattern--do-not-combine-with-structured-output)
- [`groundingMetadata` response fields](#groundingmetadata-response-fields)
- [Attribution compliance (Terms of Service requirement)](#attribution-compliance-terms-of-service-requirement)
- [Quota guard](#quota-guard)
- [`ai_runs` logging for grounded calls](#ai_runs-logging-for-grounded-calls)
- [Full call flow in mdeAI (Phase 3)](#full-call-flow-in-mdeai-phase-3)
- [How grounding and Places API work together](#how-grounding-and-places-api-work-together)
- [Red flags, blockers, and failure points](#red-flags-blockers-and-failure-points)
- [Reference implementations](#reference-implementations)

---

## Two separate systems — pick the right one

| System | What it is | When to use in mdeAI |
|--------|-----------|---------------------|
| **Places API (New)** | Server-side enrichment: call once per venue, store `place_id` / `maps_url` / `ai_summary` in Supabase | Seeding scripts, batch enrichment (PLACES-005-010) — **never during chat turns** |
| **Gemini Maps Grounding** | Gemini tool: LLM calls Maps search during `generateContent`, returns prose + citations | "near me" / "open now" queries during chat turns — **strictly intent-gated** (GROUNDING-001) |

**The golden rule:** Places API populates the DB once; Maps grounding answers real-time proximity questions during chat. They don't overlap.

---

## Two grounding modes

### Mode 1 — Grounding with Google Maps (Gemini API tool)

Full grounding via `tools: [{ googleMaps: {} }]` in `generateContent`. The model issues Maps search calls server-side and returns grounding citations.

**Pricing (Gemini API billing — combined LLM + Maps data):**
- Free tier: **500 grounded prompts/day**
- Pay-as-you-go: **$25 per 1,000 grounded prompts** (where at least one Maps source was returned)
- A prompt without any Maps sources returned = NOT charged the Maps fee
- Always verify current rates at https://ai.google.dev/gemini-api/docs/pricing

**Latency:** +1–2s per grounded prompt.

### Mode 2 — Maps Grounding Lite (MCP server) — **Generally Available**

Standalone MCP server that exposes Maps data as explicit tool calls. Separate from the Gemini API — works with any LLM (Claude, Gemini, GPT) that supports MCP.

**MCP endpoint:** `https://mapstools.googleapis.com/mcp`

**Auth:** `X-Goog-Api-Key` header (API key) OR OAuth scope `https://www.googleapis.com/auth/maps-platform.mcp`

**Three tools:**

| Tool | Does | Required params |
|------|------|-----------------|
| `search_places` | Places, businesses, POI, addresses → place info, Place IDs, Maps links | `text_query` (must include location if ambiguous) |
| `lookup_weather` | Current conditions, hourly (120h), daily (10d) | one of: `lat_lng`, `place_id`, or `address` |
| `compute_routes` | Driving or walking distance + duration (no turn-by-turn) | `origin`, `destination` (each accepts address/lat_lng/place_id) |

**Pricing:** Pay-as-you-go per request, tracked by product SKU. Also available through Essentials and Pro subscribe packages.

**Rate limits:** 300 QPM per project per tool.

**Attribution:** Always include the `attribution` field from responses immediately following generated content.

**`search_places` location tip:** `location_bias` (circle with lat/lng + optional radius_meters) is optional but strongly recommended for Medellín queries — include `{ latitude: 6.2442, longitude: -75.5812, radius_meters: 30000 }`.

**mdeAI uses Mode 1 (Gemini API tool) for production.** Mode 2 is available as a cost-reduction fallback and is useful for non-Gemini LLM workflows (e.g., Mastra agents, Claude Code sessions).

**Important:** The $25/1K figure sometimes cited is the **Gemini API token billing** for a grounded prompt (paying for both the Maps data access AND the LLM tokens that process the grounding result). The Maps Platform charge itself is $14/1K. Budget guards use the Maps Platform charge.

---

## Intent gate — only fire grounding when needed

Grounding costs money and adds latency. Gate it strictly. Most queries use the Supabase DB path for free.

```typescript
// my-mastra-app/src/mastra/lib/classify-intent.ts

// English patterns
const GEO_PATTERNS_EN = [
  /near\b|nearby|close to|walking distance|walkable/i,
  /open now|open tonight|currently open/i,
  /\d+\s*(min|minute|km|block)s?\s*(away|from|walk)/i,
  /from (my hotel|parque|metro|station)/i,
  /directions? (to|from)/i,
];

// Spanish patterns — Medellín is a Spanish-speaking city
const GEO_PATTERNS_ES = [
  /cerca de|cerca\b|cerquita|a la vuelta/i,
  /abierto ahora|abiertos ahora|está abierto/i,
  /\d+\s*(min|minutos?|km|cuadra)s?\s*(a pie|caminando|de aquí|lejos)/i,
  /desde (mi hotel|el parque|el metro|la estación)/i,
  /cómo llego|cómo ir|cómo llegar/i,
  /a caminar|queda cerca|queda lejos/i,
];

const GEO_PATTERNS = [...GEO_PATTERNS_EN, ...GEO_PATTERNS_ES];

export function needsMapsGrounding(message: string): boolean {
  return GEO_PATTERNS.some(p => p.test(message));
}
```

**Never trigger grounding for:** rental searches, event discovery (seeded data), restaurant/attraction lists (use cached DB `ai_summary` instead), general Q&A about Medellín, neighborhood descriptions, trip planning without proximity queries.

---

## Sequential call pattern — do not combine with structured output

**March 2026 update (Gemini API tooling):** You can now combine Maps grounding with custom function declarations in a single `generateContent` call. This means Call 1 can include both `tools: [{ googleMaps: {} }]` AND your own function declarations alongside it — the tool results can be passed between steps via "Context Circulation".

However, combining Maps grounding + `responseMimeType: 'application/json'` in a **single** call is still not confirmed. Gemini 3 confirms structured outputs combine with Google Search, URL Context, and Code Execution — but Maps grounding is **not listed** in that combination guarantee. Until Google explicitly documents it, use two sequential calls. This also makes each call independently debuggable.

> If you later test single-call combination on Gemini 3 and it works, that is an implementation win — but the behavior is undocumented and may break on model updates. Sequential is the durable approach for **structured output specifically**.

```typescript
// my-mastra-app/src/mastra/tools/concierge-tool.ts

const MEDELLIN_ANCHOR = { latitude: 6.2442, longitude: -75.5812 };

async function groundedSearch(userMessage: string, originalContents: Content[]) {
  // ── Call 1: grounded prose (no structured output) ──────────────────────────
  const groundedResp = await gemini.generateContent({
    model: 'gemini-3-flash-preview',
    contents: originalContents,
    tools: [{ googleMaps: {} }],
    toolConfig: {
      retrievalConfig: {
        latLng: MEDELLIN_ANCHOR,
      },
    },
    // ⚠️ NO responseMimeType or responseSchema here — grounding won't fire if present
  });

  const groundingChunks =
    groundedResp.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const placeIds = groundingChunks
    .map(c => c.maps?.placeId)
    .filter(Boolean) as string[];
  const groundingText = JSON.stringify(groundingChunks);

  // ── Call 2: structured output, grounding context injected as text ──────────
  const structuredResp = await gemini.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...originalContents,
      {
        role: 'model',
        parts: [{ text: `Maps grounding context (do not cite directly — use for place IDs and names only): ${groundingText}` }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: ChatActionSchema,
    },
    // ⚠️ NO tools here — structured output only
  });

  return {
    structured: structuredResp,
    placeIds,
    groundingChunks,
  };
}
```

---

## `groundingMetadata` response fields

When at least one Maps source is returned, `candidates[0].groundingMetadata` contains:

| Field | Type | mdeAI use |
|-------|------|-----------|
| `groundingChunks[]` | Array | Each chunk: `maps.uri`, `maps.title`, `maps.placeId`, `maps.placeAnswerSources[]` — forward `placeId` to card payload |
| `groundingSupports[]` | Array | Maps text spans to chunk indices — use for inline citations if rendering prose |
| `webSearchQueries[]` | string[] | Related queries; log for debugging |
| `googleMapsWidgetContextToken` | string | Only present when `enableWidget: true` — not used in mdeAI Phase 3. Extraction: `(response.custom as any)?.candidates?.[0]?.groundingMetadata?.googleMapsWidgetContextToken` |

`maps.placeAnswerSources[]` (when present) contains review snippets with `uri`, `title`, and `text` fields — can be shown inline for richer card descriptions. Not guaranteed to be populated.

The `GroundingChunk` type is exported from `@google/genai` — import it rather than defining a custom interface:
```typescript
import type { GroundingChunk } from '@google/genai';
```

```typescript
// Extract placeIds from grounding chunks for citation linking
// ⚠️ groundingChunks may return placeId with a "places/" prefix (e.g. "places/ChIJxxx")
// Strip the prefix before DB lookup or Places API calls
const citations = groundingChunks
  .filter(c => c.maps?.placeId)
  .map(c => ({
    placeId: (c.maps!.placeId!).replace(/^places\//, ''),  // normalize — strip prefix
    title: c.maps!.title ?? '',
    uri: c.maps!.uri ?? '',
  }));

// After grounding call: enrich in parallel from DB — fire-and-forget
// Don't block the model response while doing place detail lookups
;(async () => {
  const results = await Promise.allSettled(
    citations.map(c => supabase.from('restaurants').select('maps_url,ai_summary,latitude,longitude').eq('place_id', c.placeId).single())
  );
  results.forEach((r, i) => {
    if (r.status === 'fulfilled' && r.value.data) {
      citations[i] = { ...citations[i], ...r.value.data };
    }
  });
})();
```

---

## Attribution compliance (Terms of Service requirement)

When displaying grounded results:

1. **Show "Google Maps" verbatim** (no rewording, no localization, `translate="no"` attribute in HTML)
2. **Sources must immediately follow the grounded text** they support
3. **Sources must be reachable in one user interaction** (linked preview or tap-to-expand)
4. Use `uri` from `groundingChunks[].maps.uri` as the link target

```tsx
// Minimal compliant citation UI
function MapsCitation({ chunk }: { chunk: GroundingChunk }) {
  if (!chunk.maps?.uri) return null;
  return (
    <a
      href={chunk.maps.uri}
      target="_blank"
      rel="noopener noreferrer"
      translate="no"
      className="text-xs text-emerald-700 underline"
    >
      {chunk.maps.title ?? 'Google Maps'}
    </a>
  );
}
```

---

## Quota guard

```typescript
// my-mastra-app/src/mastra/lib/grounding-quota.ts

const LIMIT = parseInt(Deno.env.get('MAPS_GROUNDING_DAILY_LIMIT') ?? '200', 10);
let dailyCount = 0;
let resetDate = new Date().toDateString();

export function canGroundToday(): boolean {
  const today = new Date().toDateString();
  if (today !== resetDate) {
    dailyCount = 0;
    resetDate = today;
  }
  if (LIMIT === 0) return false; // kill switch
  return dailyCount < LIMIT;
}

export function recordGroundingCall(): void {
  dailyCount++;
}
```

**Kill switch:** Set `MAPS_GROUNDING_DAILY_LIMIT=0` in Vercel env → all queries fall back to Supabase immediately, no code change needed, no user-visible error.

**Default:** 200 calls/day = ~$3.50/day at $25/1K after the 500/day free tier is used.

> **Production blocker:** The in-memory counter above resets on every serverless cold start — do NOT ship to production as-is. Replace with a Supabase counter row or Redis key that resets at midnight UTC. See the red flags section below.

At-limit behavior: silently return Supabase-only results. **Never show a "quota exceeded" error** to users.

---

## ai_runs logging for grounded calls

Every grounded call writes to `ai_runs`. Ungrounded calls still log but with `grounded: false`.

```typescript
await supabase.from('ai_runs').insert({
  agent_name: 'concierge-agent',
  status: 'ok',
  duration_ms: elapsed,
  grounded: true,        // ← distinguishes Maps grounding calls in analytics
  cost_class: 'maps',    // ← 'maps' | 'standard' | null
});
```

---

## Full call flow in mdeAI (Phase 3)

```
User message: "What restaurants near Parque Arví are open now?"
         │
         ▼
needsMapsGrounding(message) → true
         │
         ▼
canGroundToday() → true  [else: go to Supabase path]
         │
         ▼
Call 1: generateContent + googleMaps tool + Medellín latLng
         │
         ▼
groundingChunks: [{ maps: { placeId: 'ChIJ...', title: 'La Trattoria', uri: '...' } }]
         │
         ▼
Call 2: generateContent + structured JSON schema + groundingChunks injected as text
         │
         ▼
ChatAction { type: 'OPEN_RESTAURANT_RESULTS', payload: { restaurants: [...], citations: [...] } }
         │
         ▼
recordGroundingCall()
logToAiRuns(grounded: true, cost_class: 'maps')
         │
         ▼
SSE → client renders cards + "Google Maps" citation links
```

---

## How grounding and Places API work together

| Phase | System | What happens |
|-------|--------|-------------|
| **Seeding (once)** | Places API (New) | Enrich DB: `place_id`, `maps_url`, `ai_summary` stored per venue |
| **Chat turn — standard query** | Supabase DB | Query cached data, return `maps_url` from DB as "Open in Google Maps" link — $0 |
| **Chat turn — "near me" query** | Gemini Maps Grounding | Sequential grounding calls return `placeId` citations → look up matching DB rows by `place_id` → merge grounding data (live proximity info) with DB data (rich cached details) |
| **ChatMap.tsx** | Maps JS API | Render pins using `latitude`/`longitude` from DB rows; `maps_url` drives the "directions" deep link |

The Places API fills the DB so that when Gemini grounding returns a `placeId`, mdeAI can **immediately** hydrate a rich card from the DB rather than making another Places API call. This keeps chat-turn latency low and Maps Platform costs minimal.

---

## Red flags, blockers, and failure points

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | **CRITICAL** | In-memory quota counter resets on every serverless cold start — will not enforce the daily limit in production | Replace with Supabase row: `UPDATE grounding_quota SET daily_count = daily_count + 1 WHERE date = today` or Redis INCR with TTL |
| 2 | **CRITICAL** | `generativeSummary` is English-only and US/India only — returns `null` for **all Medellín venues** | Never call `generativeSummary` for Medellín seeding. Use Gemini `generateContent` directly to produce `ai_summary` at seed time instead |
| 3 | **HIGH** | `responseMimeType: 'application/json'` may silently disable Maps grounding — no error thrown, grounding may not fire. Gemini 3 documents structured + tool combinations for Google Search/URL Context but NOT explicitly for Maps grounding | Use two sequential calls until Google confirms Maps + structured output combination. See sequential pattern section above |
| 4 | **CRITICAL** | Using legacy `findPlaceFromText` endpoint in enrichment scripts — doesn't support `googleMapsLinks`, `generativeSummary`, or New API field masks | Use `@googlemaps/places` Node.js client `searchText()` with `X-Goog-FieldMask` header |
| 5 | **MAJOR** | GEO_PATTERNS English-only — misses all Spanish proximity queries from bilingual/Spanish users | Add Spanish patterns: `cerca de`, `abierto ahora`, `a caminar`, `cómo llegar`, `queda cerca` |
| 6 | **MAJOR** | MASTRA-046 adds `version: 1` to `normalizeToolOutput` return before MASTRA-047 adds `version` to the `ChatAction` type — TypeScript build error | Merge 046 and 047 into a single PR, or defer adding `version` to the return object until the type supports it |
| 7 | **MAJOR** | `mapsUrl` in Phase 3 constructed as `https://www.google.com/maps/place/?q=place_id:${placeId}` — less stable than Places API canonical `placeUri` | After Phase 2 ships, look up the matching DB row by `place_id` to get `maps_url` (from Phase 2 enrichment) instead of constructing the URL |
| 8 | **MAJOR** | Attribution: "Google Maps" text must be verbatim, Roboto font, 4.5:1 contrast, `translate="no"` attribute — easy to skip | Check every grounded result render path for attribution compliance before launch |
| 9 | **MODERATE** | Free tier is 500/day (not 5,000) — default 200 call budget will exceed free tier at ~200 calls if organic traffic is light | Keep default at ≤ 500 calls/day to stay in free tier during early phase; adjust once traffic is measured |
| 10 | **MODERATE** | Grounding context token (`googleMapsWidgetContextToken`) is cacheable/storable but requires `enableWidget: true` — not enabled by default | Don't add `enableWidget` until the Phase 3 widget spec is written; adds complexity without a UI consumer |
| 11 | **MINOR** | Concurrent Vercel edge function invocations with shared in-memory counter can undercount (race condition) | The Supabase counter fix (item 1) also solves this |
| 12 | **MODERATE** | Grounding API returns place IDs with `places/` prefix (e.g. `places/ChIJxxx`) | Always strip prefix: `placeId.replace(/^places\//, '')` before DB lookup or Places API calls |
| 13 | **MODERATE** | Mode 1 (`googleMaps` tool) requires sequential calls for structured output; Mode 2 (Grounding Lite MCP via function calling) supports structured output in same call | If typed card payloads are the primary goal, prefer Mode 2: convert MCP tools with `mcpToTool()`, call alongside `responseMimeType` in one request |

---

## Reference implementations

| Repo | What it shows |
|------|--------------|
| [googlemaps-samples/grounding-lite-mcp-sample-app](https://github.com/googlemaps-samples/grounding-lite-mcp-sample-app) | **Official Google sample** — chat UI + MCP + grounded places + SSE + Node backend. Closest architecture to mdeAI. Uses Mode 2 (MCP → `mcpToTool()`) as primary approach. |
| [JKL999/chat-with-maps-demo](https://github.com/JKL999/chat-with-maps-demo) | Mode 1 grounding with Live API, 3D Maps, tool registry pattern, fire-and-forget place enrichment, `Promise.allSettled` parallel requests |
| [bukempas/Google-Maps-Grounding-with-Gemini---Geospace-Search](https://github.com/bukempas/Google-Maps-Grounding-with-Gemini---Geospace-Search) | TypeScript grounding metadata extraction, `GroundingChunk` type from `@google/genai`, `placeAnswerSources` rendering |
| [waynegakuo/concierge](https://github.com/waynegakuo/concierge) | Genkit multi-agent pattern: specialist agents exposed as tools to an orchestrator agent (router → dayTrip/foodie/findAndNavigate agents). Architecture equivalent to mdeAI's concierge intent router. |

---

## Task references

| Task | File | Phase |
|------|------|-------|
| GROUNDING-001 | `tasks/mastra/maps/tasks/grounding/010-grounded-search.md` | Phase 3 — full implementation spec |
| PLACES-005-010 | `tasks/mastra/maps/tasks/places/020-place-details-enrichment.md` | Phase 2 — Places enrichment that feeds Phase 3 |
| PLAN-001 | `tasks/mastra/maps/tasks/plans/001-geo-chat-production-plan.md` | Master roadmap |
