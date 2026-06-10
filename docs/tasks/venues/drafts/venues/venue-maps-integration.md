# Venue maps integration

**PRD:** [venue-management-prd-v1.md](./venue-management-prd-v1.md) · **Platform:** [`maps-prd-v2.md`](../../mastra/maps-prd-v2.md) · **EVT:** 039–044

---

## 1. Architecture principle

**Server-side Places (New)** for all enrichment. **Browser** only for map display (Map ID + Advanced Markers). **Never** expose server API key in client.

---

## 2. `place_id` spine

```text
User picks "Teatro Metropolitano" in Autocomplete
  → session token ends
  → Edge Place Details (New) minimal mask
  → UPSERT places_cache + event_venues.google_place_id
  → events inherit venue coords OR duplicate for denormalized queries
  → maps_link_uri from googleMapsLinks.placeUri (NOT hand-built CID URL)
```

| Field | Table | Purpose |
|-------|-------|---------|
| `google_place_id` | `event_venues`, `events` | Stable join to cache |
| `maps_link_uri` | `event_venues` | "Open in Google Maps" |
| `latitude`, `longitude` | `event_venues` | Map pin, Nearby Search center |
| `place_cache_id` | FK | Shared enrichment row |

---

## 3. API usage by feature

| Feature | API | MASTRA/EVT | Field mask (minimal) |
|---------|-----|------------|------------------------|
| Wizard address | Autocomplete (New) | 078, 039 | per Google docs |
| First save enrich | Place Details (New) | 076, 040 | `id,displayName,location,googleMapsLinks` |
| Event map pin | JS Maps + Map ID | 043, 068 | — |
| Nearby dining | Nearby Search (New) | 075, 044 | `id,displayName,location,googleMapsLinks` |
| Route hint | Routes / Grounding Lite | 049, 062 | duration parse |
| Offline description | Gemini on cache | 048 | `ai_summary` — **not** generativeSummary (empty in CO) |

---

## 4. Grounding Lite (concierge)

| Tool | Use |
|------|-----|
| `search_places` | “venues like this near Laureles” |
| `compute_routes` | “how far from Poblado” — parse `"3.5s"` duration |
| `lookup_weather` | Outdoor events (later MASTRA-072) |

**Attribution:** `GroundingAttribution` component on every card ([maps-prd-v2](../../mastra/maps-prd-v2.md)).

---

## 5. Caching & quotas

| Layer | TTL | Log |
|-------|-----|-----|
| `places_cache` | 24–72h | `places_api_quota_log` |
| Nearby results | 24h per center+radius | same |
| Autocomplete | session-scoped | debounce 300ms |

---

## 6. Geospatial analytics (Phase 2+)

- PostGIS on `event_venues` (optional `geography` column).  
- Sponsor “premium venues near hotel X” — Nearby + Hermes.  
- Heatmap of check-ins vs capacity — check_ins lat optional future.

---

## 7. Contextual venue AI (real-time)

**Input bundle for Mastra (read-only):**

```json
{
  "venue": { "name", "city", "capacity", "place_id" },
  "event": { "starts_at", "status" },
  "nearby_top5": [{ "name", "placeUri", "distance_m" }],
  "weather": null
}
```

Used for concierge answers — not persisted as truth.

---

## 8. EVT crosswalk

| EVT | Venue deliverable |
|-----|-------------------|
| 039 | Autocomplete UI in wizard |
| 040 | Server mask enforcement |
| 041 | Cache TTL |
| 042 | placeUri persistence |
| 043 | EventDetail map |
| 044 | Nearby cards |

---

## 9. Verification (acceptance)

- [ ] MCP/google-maps-code-assist documents masks used  
- [ ] No `places.*` wildcard in production  
- [ ] Map ID in prod env (not DEMO only)  
- [ ] Attribution visible on map + nearby cards  
- [ ] Colombia venue: `ai_summary` present when generativeSummary null  
