## Root cause

**Two separate issues — not an ADK failure.**

### 1. Generic `"Place"` cards
Grounding Lite MCP returns names in `attribution.title` (e.g. `"Pausa Coffee & Brunch - Google Maps"`), **not** `displayName.text`.  
`grounding_mcp.py` only checked `displayName` / `name` → every pin became `"Place"`. UI faithfully rendered that.

### 2. Map still “all rentals” after café query
`mergePinsByCategory` **keeps all categories** (by design). After rentals, rental pins stayed at full opacity and dominated **Map results** (which listed every non-mock pin). Grounded pins were often merged but visually buried.

**Not broken:** `ToolPinsSync`, `normalizeToolOutput`, category `"grounded"`, lat/lng/mapsUrl mapping — all correct once ADK returns data.

---

## Files changed

| File | Change |
|------|--------|
| `services/adk-grounding/grounding_mcp.py` | `_place_title()` from `attribution.title` / `displayName` |
| `services/adk-grounding/test_grounding_mcp_titles.py` | Python unit tests |
| `mdeapp/src/platform/maps/active-map-category.ts` | **New** — filter/dim logic |
| `mdeapp/src/platform/maps/map-context.tsx` | `activeMapCategory` on merge |
| `mdeapp/src/components/chat/chat-results-column.tsx` | Show active category pins + Maps links |
| `mdeapp/src/components/maps/ChatMap.tsx` | Dim non-active pins (35% opacity) |
| `mdeapp/src/components/copilot/place-result-card.tsx` | `mapsUrl` → “Open in Google Maps” |
| `mdeapp/src/components/copilot/search-tool-renders.tsx` | Pass `mapsUrl` to grounded cards |
| Tests under `platform/maps/__tests__/` + `grounded-place-card.test.ts` | Normalization, merge, active category |

---

## Before / after

| Behavior | Before | After |
|----------|--------|-------|
| Café card title | `"Place"` | Real names (e.g. Pausa Coffee & Brunch) |
| Card link | Static “Google Maps” subtitle | Clickable Maps URL |
| Map results after café query | Rentals + grounded mixed; rentals dominate | **Grounded pins only** when last search was grounded |
| Map markers | All categories equal weight | Active category full; others dimmed |
| Rental chat cards | Unchanged | Unchanged (history preserved) |
| ADK REST | Working | Working (no contract change) |

**Prod note:** Title fix is in **sidecar code** — redeploy Cloud Run for www to get real names:

```bash
/home/sk/mdeai/services/adk-grounding/scripts/deploy-cloud-run.sh
```

Vercel redeploy needed for map UI fixes (`activeMapCategory`, links, dimming).

---

## Verification

| Command | Result |
|---------|--------|
| `npm run floor` | ✅ pass |
| `npm run check:mastra` | ✅ pass |
| `npm run verify:supabase` | ✅ pass |
| `npm test -- src/platform/maps …` | ✅ **91/91** |
| Python title tests (local MCP) | ✅ `Pausa Coffee & Brunch`, `Café Euge`, … |

---

## Production readiness score

| Layer | Before | After (post-deploy) |
|-------|--------|---------------------|
| ADK / Cloud Run | 95 | 95 (unchanged) |
| Tool → pin pipeline | 90 | 95 |
| Map UX (multi-intent) | 55 | **88** |
| Grounded card UX | 40 | **90** (after CR redeploy + Vercel) |
| **Overall grounded places** | **62** | **~92** after both deploys |

---

## Checklist vs your expected behavior

1. ✅ Real café names — fixed in sidecar (+ UI already used `title`)
2. ✅ Google Maps links — cards + map results rows
3. ✅ Café pins on map — merge unchanged; active category highlights them
4. ✅ Rentals not sole focus after café query — results panel + dimming
5. ✅ Rental cards stay in chat — no change to chat history
6. ✅ No ADK regression — same invoke contract; tests green

Want me to redeploy Cloud Run + Vercel prod now?
**Short answer:** mdeai is **not** wired through the [Places (New) JavaScript `Place` class](https://developers.google.com/maps/documentation/javascript/place) or [Places API (New) web service](https://developers.google.com/maps/documentation/places/web-service/op-overview) in product code. Café grounding goes through **Grounding Lite MCP** on Cloud Run. The browser only renders pins via **Maps JS + AdvancedMarker** (`@vis.gl/react-google-maps`).

---

## What mdeai uses today

| Surface | API / product | Used in prod? |
|--------|----------------|---------------|
| **Café / POI grounding** | [Grounding Lite MCP](https://mapstools.googleapis.com/mcp) `search_places` | ✅ ADK sidecar → Mastra `search-grounded-places` |
| **Map widget** | Maps JavaScript API + `AdvancedMarker` + `mapId` | ✅ `ChatMap.tsx` — **no** `Place.fetchFields()` |
| **Rentals / restaurants (inventory)** | Supabase | ✅ `search-rentals`, `search-restaurants` |
| **Places API (New) REST** | `places.googleapis.com/v1/places:searchText` | ⚠️ **Probe only** in `verify-maps-env.mjs` — not chat runtime |
| **Place Details / Photos / Reviews (JS)** | [Place class](https://developers.google.com/maps/documentation/javascript/place-details) | ❌ Not used |
| **Nearby / Text Search (JS)** | [place-search](https://developers.google.com/maps/documentation/javascript/place-search), [nearby-search](https://developers.google.com/maps/documentation/javascript/nearby-search) | ❌ Not used |
| **Places UI Kit** | [Pre-built web components](https://developers.google.com/maps/documentation/javascript/places-ui-kit/overview) | ❌ Not used (experimental anyway) |
| **Autocomplete** | [place-autocomplete-data](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data) | ❌ Not used |

Enabling [`places.googleapis.com`](https://console.cloud.google.com/apis/library/places.googleapis.com?project=dev-inscriber-445714-k0) on GCP is correct for probes and future enrichment — it does **not** automatically switch the app to Places (New).

---

## How the docs you linked map to mdeai

| Google doc | mdeai equivalent today |
|------------|-------------------------|
| [Place Details (New)](https://developers.google.com/maps/documentation/javascript/place-details) — `Place.fetchFields({ displayName, formattedAddress, googleMapsURI })` | Sidecar gets name from MCP `attribution.title` (we fixed that locally; **redeploy Cloud Run**) |
| [Place class data fields](https://developers.google.com/maps/documentation/javascript/place-class-data-fields) | Only `id`, lat/lng, `mapsUrl` flow through to pins/cards — no photos, reviews, hours |
| [Place Search / Nearby Search](https://developers.google.com/maps/documentation/javascript/place-search) | Agent uses **MCP text search**, not JS `Place.searchByText()` |
| [Place Photos / Reviews](https://developers.google.com/maps/documentation/javascript/place-photos) | Not rendered — cards are custom `PlaceResultCard` |
| [AI-powered summaries](https://developers.google.com/maps/documentation/javascript/ai-powered-summaries) | Concierge prose from Gemini; not Places UI Kit summaries |
| [Places UI Kit](https://developers.google.com/maps/documentation/javascript/places-ui-kit/overview) | Custom CopilotKit generative UI instead |
| [Places API (New) overview](https://developers.google.com/maps/documentation/places/web-service/op-overview) | REST path exists for **env verify**; product path is **MCP** |

---

## Architecture (correct for Phase 1)

```text
Camila: "list cafes in laureles"
  → conciergeAgent (Gemini)
  → search-grounded-places (Mastra, Vercel)
  → ADK Cloud Run
  → Grounding Lite MCP search_places     ← NOT places:searchText REST
  → pins { placeId, title, lat/lng, mapsUrl }
  → grounded-card + MapContext pins

Browser map
  → NEXT_PUBLIC_GOOGLE_MAPS_API_KEY only
  → AdvancedMarker (no Places library calls)
```

That matches your rules: server keys for grounding, browser key for the map widget, [`X-Goog-FieldMask`](https://developers.google.com/maps/documentation/places/web-service/op-overview) when you do call Places REST.

---

## Should you switch to Places (New) JS/API?

**Not for the main search path.** Grounding MCP is the right layer for agent-driven café discovery (already working on prod after CR-06).

**Good Phase 2 adds** (using Places New, server-side with `GOOGLE_MAPS_SERVER_API_KEY` + FieldMask):

1. **After MCP returns `placeId`** — one `GET places/{id}` or `Place Details` for `displayName`, `formattedAddress`, `photos`, `rating` → richer `grounded-card` (photos, not just title + link).
2. **`scripts/enrich-places.ts`** (MASTRA-048) — backfill Supabase restaurant rows with Place IDs + `mapsUrl` via Places API (New) REST.
3. **Pin click in browser** — optional `Place.fetchFields()` on `placeId` for info window ([Place Details JS pattern](https://developers.google.com/maps/documentation/javascript/place-details)); costs hit browser billing.

**Skip for now:** Places UI Kit — overlaps CopilotKit cards and is still experimental.

---

## GCP checklist (`dev-inscriber-445714-k0`)

| API | Needed for |
|-----|------------|
| `mapstools.googleapis.com` (Grounding Lite) | ✅ ADK sidecar (primary) |
| `places.googleapis.com` (Places New) | Probes + future enrichment |
| Maps JavaScript API | ✅ Browser map |
| `generativelanguage.googleapis.com` | Mastra + MCP fallback |

---

## Pending deploy (from last audit)

Code fixes for **real café names** + **map focus on grounded pins** are in repo but need:

1. **Cloud Run redeploy** — `_place_title()` from MCP `attribution.title`
2. **Vercel redeploy** — `activeMapCategory`, Maps links, dim old rental pins

Want me to run both deploys now, or sketch a **MAP-009** task spec for Places (New) enrichment on top of grounded `placeId`s?