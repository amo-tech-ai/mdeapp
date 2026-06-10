---
name: mde-maps
description: "mdeai Google Maps: Places (New), ChatMap, Gemini grounding, MCP tools, keys, Mastra maps. Quick routing; legacy `google-maps` name archived (see `_archive/2026-05-14`). NOT for: Mapbox-only, pure GIS math, non-Google stacks, generic off-repo tutorials."
title: mde-maps — Google Maps Platform (comprehensive)
impact: HIGH
impactDescription: Places enrichment, Maps grounding, ChatMap, batch APIs, security, AI code assist
tags: google-maps, places-api, maps-links, gemini-grounding, mdeai, mastra, security, cli, mcp
paths:
  - "src/**/*Map*"
  - "src/**/*map*"
  - "my-mastra-app/src/mastra/tools/*place*"
  - "supabase/functions/*maps*/**"
  - "supabase/functions/*places*/**"
---

# mde-maps — Google Maps Platform

## When NOT to use

- Generic GIS / spatial math with no Google Maps Platform APIs
- **Mapbox-only** or **Leaflet/OpenStreetMap-only** stacks (no GMP)
- Unrelated mapping tutorials or homework off the mdeai repo
- **Non-mdeAI** products—still read-only here; prefer not to expand scope in this skill

## Load order (keep context small)

1. This **`SKILL.md`** — Quick routing table + Consolidated sibling note.
2. **GMP doc questions** — MCP **Maps Code Assist** first (§ [Code Assist workflow](#maps-code-assist-mcp-workflow) below); then one `references/*.md` for the task.
3. **One** `references/*.md` file for implementation (do not bulk-load `google-offline/` unless grepping mirrors).
4. **`references/all-apis.md`** only when running or editing `gmaps.py` batch CLI work.

**Cursor rule:** [`.cursor/rules/mdeai-google-maps.mdc`](../../.cursor/rules/mdeai-google-maps.mdc) · **MCP setup:** [`.cursor/MCP-GOOGLE-MAPS.md`](../../.cursor/MCP-GOOGLE-MAPS.md) · **Project:** [`.mcp.json`](../../.mcp.json) key `google-maps-code-assist`

---

## Maps Code Assist MCP workflow

Official: [developers.google.com/maps/ai/code-assist](https://developers.google.com/maps/ai/code-assist) · Source: [`github/maps/platform-ai/`](../../github/maps/platform-ai/) ([GEMINI.md](https://github.com/googlemaps/platform-ai/blob/main/GEMINI.md))

**Use hosted HTTP only** — `https://mapscodeassist.googleapis.com/mcp`. The npm package `@googlemaps/code-assist-mcp` is **deprecated 2026-07-01** per [platform-ai README](https://github.com/googlemaps/platform-ai).

| Step | MCP tool | When |
|------|----------|------|
| 1 | `retrieve-instructions` → `{ "name": "instructions" }` | **Always first** for any map/places/routes/geocoding task |
| 2 | `retrieve-google-maps-platform-docs` → `{ "llmQuery", "filter?", "source": "mdeai-app" }` | Concrete API/mask/vis.gl questions |

**Not for production runtime** — no live `search_places`. For live geo tools use **Grounding Lite** (`mapstools.googleapis.com`) — [`references/maps-grounding.md`](references/maps-grounding.md) § Mode 2.

Full setup: [`references/maps-ai-code-assist.md`](references/maps-ai-code-assist.md)

---

## Canonical `github/maps/` clones (read-only)

**Index:** [`github/maps/README.md`](../../github/maps/README.md) · **Scores:** [`index.md`](../../index.md) §4

| Folder | Phase | mdeapp action |
|--------|-------|---------------|
| `react-google-maps/` | MVP | **npm** `@vis.gl/react-google-maps` — MAP-001 |
| `codelab-maps-platform-101-react-js/` | MVP | AdvancedMarker + clusterer patterns |
| `grounding-lite-mcp-sample-app/` | MVP | MAP-002 Mastra grounding |
| `js-markerclusterer/` | MVP | **npm** `@googlemaps/markerclusterer` — MAP-009 |
| `js-api-samples/` | All | Field masks, JS API samples |
| `google-maps-services-js/` | MVP+ | Edge Places — MAP-004–005 |
| `platform-ai/` | Dev | Code Assist MCP source only |
| `ag-ui-adk-grounding-app/` | Post-MVP | UX reference — not Mastra |
| `react-wrapper/` | — | **Do not use** (archived) |

**Never** copy vendor `src/` into `mdeapp/` — read patterns, install npm packages.

## Quick routing

| Task | Go to |
|------|-------|
| **Architecture** — how Places API + Grounding + Grounding Lite work together, decision tree, cost model, failure modes | [`references/architecture.md`](references/architecture.md) |
| **Places offline exports** — full-text Places / UI Kit / Contextual View (`places-official/`) | [`references/places-official/README.md`](references/places-official/README.md) |
| **Places API (New)** — official doc map, URLs, masks, Colombia rules (PLACES-002) | [`references/places-api-web-service.md`](references/places-api-web-service.md) |
| **Places API (New)** — `@googlemaps/places` examples (PLACES-005-010) | [`references/places-api-new.md`](references/places-api-new.md) |
| **PRD / audit** — Places API (New) v2.1 feature matrix + score (PLACES-002–081) | Repo: `tasks/maps/maps-prd-v2.md`, `tasks/maps/places-api-new-audit.md` |
| **mdeAI** — Gemini Maps grounding + red flags + GEO_PATTERNS (GROUNDING-001) | [`references/maps-grounding.md`](references/maps-grounding.md) |
| **mdeAI** — ChatMap.tsx, AdvancedMarkerElement, pins | [`references/maps-js-api.md`](references/maps-js-api.md) |
| **Interactive** — search_places, get_directions, show_on_map in Claude session | [§ Interactive MCP tools below](#interactive-mcp-tools) |
| **CLI batch** — geocoding, routes, weather, solar, 20+ APIs | [`references/all-apis.md`](references/all-apis.md) |
| **Security** — API key architecture, HTML pages, embed iframes | [`references/security-and-optimization.md`](references/security-and-optimization.md) |
| **Maps AI Code Assist MCP** — RAG over official Maps docs (`mapscodeassist.googleapis.com`) | [`references/maps-ai-code-assist.md`](references/maps-ai-code-assist.md) |
| **Maps Grounding Lite MCP** — live `search_places` / `lookup_weather` / `compute_routes` (`mapstools.googleapis.com`) | [`references/maps-grounding.md`](references/maps-grounding.md) § Mode 2 |
| **Offline vendor page mirrors** (`references/google-offline/*.md`) — grep / offline only; **live docs + curated refs win on conflict** | [`references/official-docs-mirror.md`](references/official-docs-mirror.md) |
| **Former `google-maps` skill** — removed 2026-05-14 (last stub copy in `_archive/2026-05-14/google-maps-stub/`) | § [Interactive MCP tools](#interactive-mcp-tools) below |
| **Former `google-maps-api` skill** — `gmaps.py` + operator rules | [`scripts/gmaps.py`](scripts/gmaps.py) + [`references/gmaps-cli-behavior.md`](references/gmaps-cli-behavior.md) + [`references/all-apis.md`](references/all-apis.md) |
| **Former `react-google-maps` skill** — `@vis.gl/react-google-maps` | [`references/react-vis-gl/README.md`](references/react-vis-gl/README.md) |

### Consolidated sibling skills (read once)

These top-level skills are **thin stubs** (or archived names) that point here — one maintenance surface for mdeai:

| Symlink / folder | Role now |
|-------------------|----------|
| `google-maps` | **Archived** 2026-05-14 — skill folder removed; last `SKILL.md` under `_archive/2026-05-14/google-maps-stub/`. |
| `google-maps-api` | Redirect stub only; **`gmaps.py`** lives in **`mde-maps/scripts/`** (vendor README/plugin → `_archive/2026-05-14/google-maps-api-vendor/`). |
| `react-google-maps` | Redirect only; vis.gl **reference/*.md** copied under `references/react-vis-gl/`. |

---

## Offline Google documentation (local mirror)

Google Maps / Grounding / MCP pages exported as Markdown live under **[`references/google-offline/`](references/google-offline/)** — each file has YAML `frontmatter` (`doc_type: google_offline_mirror`). Use for **local search** and **air-gapped** reading; they are **not** authoritative.

- **Index + conflict rules:** [`references/official-docs-mirror.md`](references/official-docs-mirror.md)
- **Do not** treat mirrors as SoT for billing, tool schemas, or launch gates — cross-check **live** `developers.google.com` and **`grounding-lite-mcp-sample-app`** when implementing **GROUNDING-001** / **057** / **065**.

---

## mdeAI environment

```
VITE_GOOGLE_MAPS_API_KEY    — Frontend (browser) — Maps JS API, AdvancedMarkerElement
GOOGLE_PLACES_API_KEY       — Server-side only — Places API (New), enrichment scripts
GOOGLE_MAPS_API_KEY         — Edge functions — Directions, Routes
GOOGLE_ROUTES_API_KEY       — Edge functions — Routes API
```

**Medellín anchor:** `{ latitude: 6.2442, longitude: -75.5812 }` — default `locationBias` center and Maps grounding `latLng`.

**Never put `GOOGLE_PLACES_API_KEY` in a `VITE_` var** — visible in browser DevTools.

---

## Interactive MCP tools

Use these when answering location questions **in a Claude session** (not for mdeAI production code). Tools call Google Maps APIs live.

### Tools available

```
search_places(query, location?, radius?, type?, open_now?, language?)
  query     — text query ("restaurants in Laureles")
  location  — "lat,lng" center (optional)
  radius    — meters, max 50000 (optional)
  type      — place type filter ("restaurant", "tourist_attraction", "hotel")
  open_now  — boolean, default false
  language  — language code, default "en"

search_nearby_places(location, radius, keyword?, type?, rank_by?, open_now?, language?)
  location  — "lat,lng" (required)
  radius    — meters (required, max 50000)
  rank_by   — "prominence" (default) or "distance"

get_place_details(place_id, language?, reviews_sort?)
  place_id  — from search results
  reviews_sort — "most_relevant" (default) or "newest"

get_directions(origin, destination, mode?, alternatives?, avoid?, language?)
  mode      — "driving" (default), "walking", "bicycling", "transit"
  avoid     — "tolls", "highways", or "ferries"

geocode_address(address, language?, region?)
  region    — country code for regional bias

reverse_geocode(latlng, language?)
  latlng    — "lat,lng"

show_on_map(map_type, markers?, directions?, center?, zoom?)
  map_type  — "markers", "directions", or "area"
  markers   — array of {lat, lng} objects
```

### Response pattern — Text → Map → Text

**Always follow this sequence. Never call `show_on_map` in parallel with other calls.**

1. **Text** — introduce what you'll show ("Here are top restaurants near Poblado:")
2. **Map** — call `show_on_map` to render results
3. **Text** — explain results in plain language (names, ratings, notes)

**Multiple categories:** sequential maps — events then restaurants, not parallel.

**Never echo raw map_data JSON** (coordinates, markers, zoom) in your text response. The map renders visually; describe places by name and quality only.

### Intent → tool mapping

| User says | Tool to use |
|-----------|-------------|
| "Where is X?" | `geocode_address` |
| "Find restaurants near..." | `search_places` or `search_nearby_places` |
| "What are the hours for...?" | `get_place_details` |
| "How do I get from A to B?" | `get_directions` |
| "What address is at these coords?" | `reverse_geocode` |
| "Show me these places on a map" | `show_on_map` |

**Preserve `place_id`** from search results for use in `get_place_details`.

---

## Places API (New) — field masks for mdeAI

Every request uses `X-Goog-FieldMask` header. Only request fields you need — billing is field-mask driven.

### Enrichment mask (PLACES-005-010)

```
places.id,places.displayName,places.googleMapsLinks,places.location,places.generativeSummary
```

| Field | Returns | mdeAI use |
|-------|---------|-----------|
| `places.id` | Place ID (`ChIJ...`) | Store as `place_id` |
| `places.googleMapsLinks.placeUri` | Canonical `https://maps.app.goo.gl/...` URL | Store as `maps_url` |
| `places.googleMapsLinks.directionsUri` | Directions link | Optional card button |
| `places.googleMapsLinks.photosUri` | Google Maps photos link | Optional "see photos" |
| `places.location` | `{ latitude, longitude }` | Backfill lat/lng |
| `places.generativeSummary` | `{ text, disclosureText }` | Store as `ai_summary`; show `disclosureText` |

### generativeSummary constraints

- **Coverage:** English only; US and India only currently
- **Attribution required:** Display `disclosureText` ("Summarized with Gemini") wherever `ai_summary` appears — ToS requirement
- **Cache in DB:** Fetch once at seeding time. Never call per chat turn.

### googleMapsLinks — currently free

`googleMapsLinks` is in preview and **free** as of 2026-05. Use `placeUri` (not lat/lng-constructed URLs) — it's stable and canonical.

---

## Node.js client — enrichment script pattern

```typescript
import { PlacesClient } from '@googlemaps/places';

const client = new PlacesClient({ apiKey: process.env.GOOGLE_PLACES_API_KEY });

const [response] = await client.searchText(
  {
    textQuery: `${venueName} ${neighborhood} Medellín Colombia`,
    locationBias: {
      circle: { center: { latitude: 6.2442, longitude: -75.5812 }, radius: 30000 },
    },
  },
  { otherArgs: { headers: { 'X-Goog-FieldMask': 'places.id,places.displayName,places.googleMapsLinks,places.location,places.generativeSummary' } } },
);
```

---

## Gemini Maps grounding — summary

> Full pattern: [`references/maps-grounding.md`](references/maps-grounding.md)

| Mode | Free tier | Cost | Enable |
|------|-----------|------|--------|
| Grounding with Google Maps (Gemini API) | 500/day | $25/1K | `tools: [{ googleMaps: {} }]` |
| Maps Grounding Lite (MCP) — **GA** | pay-as-you-go | per SKU | `mapstools.googleapis.com/mcp` |

**Kill switch:** `MAPS_GROUNDING_DAILY_LIMIT=0` → fall back to Supabase immediately.

**Sequential calls for structured output:** grounded call (no `responseMimeType`) → structured output call (no grounding). Maps + custom function declarations CAN be combined in one call (March 2026 update).

---

## Maps JavaScript API — ChatMap.tsx summary

> Full pattern: [`references/maps-js-api.md`](references/maps-js-api.md)

- Loader: `@googlemaps/js-api-loader` with `libraries: ['marker']`
- `mapId` required for `AdvancedMarkerElement`
- `data-testid="map-pin"` on every pin content element (MASTRA-045 smoke spec)
- Per-category pin merge: `setPins(prev => [...prev.filter(p => p.category !== cat), ...newPins])`
- Frontend key restricted to HTTP referrers + Maps JS API only

---

## Session tokens — autocomplete billing

Use UUID v4 session tokens to group autocomplete keystrokes + final Place Details into one billing event:

```typescript
import { v4 as uuidv4 } from 'uuid';
const sessionToken = uuidv4(); // new UUID per search session
// Pass as sessionToken on each Autocomplete call
// Generate fresh UUID after user selects a place
```

---

## GCP key setup — quick reference

| Key | Restrictions | APIs enabled |
|-----|-------------|-------------|
| `VITE_GOOGLE_MAPS_API_KEY` | HTTP referrers: mdeai.co/*, localhost:8080/* | Maps JavaScript API only |
| `GOOGLE_PLACES_API_KEY` | Server IP | Places API (New) only |
| `GOOGLE_MAPS_API_KEY` | Server IP | Directions API, Maps Static |
| `GOOGLE_ROUTES_API_KEY` | Server IP | Routes API |

> Full 2-key security architecture → [`references/security-and-optimization.md`](references/security-and-optimization.md)

**Enable "Places API (New)"** in GCP Console — NOT "Places API" (legacy). Different billing, different endpoints, different field names.

---

## Event discovery — Maps / Places / ADK (plan 10 §11)

| Layer | mdeai use | Skill / task |
|-------|-----------|----------------|
| **Places API (New)** | Batch venue enrich → `place_id`, `maps_url`, lat/lng | **EVD-06** → [EVP-024](../../../tasks/events/EVP-024-mvp-places-enrichment.md) |
| **Maps JS** | Camila’s event pins (`mapId` + `AdvancedMarker`) | [EVP-016](../../../tasks/events/EVP-016-mvp-event-maps-venue-integration.md) |
| **ADK sidecar** | Freshness / `search_grounded_places` — not event inventory | [EVP-023](../../../tasks/events/EVP-023-mvp-adk-search-maps-agents.md) |
| **Web grounding** | C-004 citations — Google Search, not Places catalog | [EVP-021](../../../tasks/events/EVP-021-mvp-google-search-grounding.md) |

Plans: [10-event-discover-plan.md](../../../plan/events/event-discovery/10-event-discover-plan.md) · Routing: [event-discovery-skill-routing.md](../../../tasks/events/docs/event-discovery-skill-routing.md)

**Golden rule:** Places enriches DB once; grounding answers live geo questions — never invent event listings from Maps.

---

## MASTRA task references

Canonical numbered specs live under `tasks/mastra/maps/tasks/` (`runtime/`, `grounding/`, `places/`, …). Index: [`tasks/mastra/maps/tasks/index-maps-tasks.md`](../../tasks/mastra/maps/tasks/index-maps-tasks.md) and [`places/README.md`](../../tasks/mastra/maps/tasks/places/README.md).

| Task | File | Phase |
|------|------|-------|
| PLACES-005-010 | `tasks/mastra/maps/tasks/places/020-place-details-enrichment.md` | Phase 2 — enrichment |
| GROUNDING-001 | `tasks/mastra/maps/tasks/grounding/010-grounded-search.md` | Phase 3 — grounding |
| PLAN-001 | `tasks/mastra/maps/tasks/plans/001-geo-chat-production-plan.md` | Master roadmap |
| Maps audit + PR order | `tasks/maps/07-mapsv2-tasks.md` | Forensic sequencing |

---

## Common gotchas

| Gotcha | Fix |
|--------|-----|
| `generativeSummary` null | Handle gracefully — not all places have summaries |
| No `disclosureText` shown | Required by ToS — show "Summarized with Gemini" |
| Legacy Places API | Switch to Places API (New) — different billing, different endpoints |
| `googleMapsLinks` missing | Must be in field mask explicitly |
| Constructing Maps URLs from lat/lng | Use `placeUri` from `googleMapsLinks` — it's canonical and stable |
| `AdvancedMarkerElement` not found | Add `'marker'` to `libraries` in js-api-loader |
| Missing `mapId` | Required for AdvancedMarkerElement — set in Map constructor |
| Frontend key 403 | Verify HTTP referrer restriction includes current origin |
| API key in `VITE_` for Places API | Server-side keys must never be in `VITE_` vars |
