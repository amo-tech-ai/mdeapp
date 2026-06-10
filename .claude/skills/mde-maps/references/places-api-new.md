---
doc_type: curated_reference
parent_skill: mde-maps
topic: places-api-new-node-examples
title: Places API (New) — Node examples + field masks for mdeAI
---

# Places API (New) — mdeAI enrichment reference

**Doc map (URLs, surfaces, rules):** [`places-api-web-service.md`](places-api-web-service.md) · **Full-text exports:** [`places-official/README.md`](places-official/README.md)

Official entry: https://developers.google.com/maps/documentation/places/web-service/op-overview  
Client library: `@googlemaps/places` (npm)

---

## Endpoints used in mdeAI

| Endpoint | Method | When |
|----------|--------|------|
| Text Search | `client.searchText()` | Finding a venue by name + neighborhood when no `place_id` exists |
| Nearby Search | `client.searchNearby()` | Finding venues near a coordinate (Phase 3 grounding fallback) |
| Place Details | `client.getPlace()` | Fetching full details when `place_id` already known |

---

## REST vs Node.js client

Both work. Node.js client is recommended for enrichment scripts (handles auth, retries, type safety).

**REST base URL:** `https://places.googleapis.com/v1/places`

**Node.js install:** `npm install @googlemaps/places`

**Auth:** Set `GOOGLE_PLACES_API_KEY` as env var. The client picks it up automatically, OR pass `{ apiKey: process.env.GOOGLE_PLACES_API_KEY }` to the constructor.

---

## Field mask reference

Only charged for fields you request. Always use the minimum mask.

### Enrichment masks by table

`generativeSummary` is often **empty outside the US** (including Colombia). Prefer **offline Gemini** → `ai_summary` in Supabase (`tasks/maps/maps-prd-v2.md`). You may keep `generativeSummary` in the mask only if you accept nulls and extra SKU risk — confirm against [Data fields](https://developers.google.com/maps/documentation/places/web-service/data-fields) before shipping.

```
# restaurants, tourist_destinations (core + optional summary field)
places.id,places.displayName,places.googleMapsLinks,places.location
# optional: ,places.generativeSummary  (verify SKU + CO empties)
# optional: ,places.photos  (refs only — bytes via Place Photos API)

# events (venue names + links + coords)
places.id,places.displayName,places.googleMapsLinks,places.location

# geocoding fallback only (cheapest)
places.id,places.location
```

### Field name differences: search vs place details

```typescript
// Text Search / Nearby Search → nested under `places.`
'places.id,places.displayName,places.googleMapsLinks'

// Place Details → top-level (no `places.` prefix)
'id,displayName,googleMapsLinks,location,generativeSummary'
```

---

## Text Search — full example with error handling

```typescript
import { PlacesClient } from '@googlemaps/places';
import { createClient } from '@supabase/supabase-js';

const places = new PlacesClient({ apiKey: process.env.GOOGLE_PLACES_API_KEY });

async function enrichVenue(row: { id: string; name: string; neighborhood: string }) {
  const query = `${row.name} ${row.neighborhood} Medellín Colombia`;

  try {
    const [resp] = await places.searchText(
      {
        textQuery: query,
        locationBias: {
          circle: {
            center: { latitude: 6.2442, longitude: -75.5812 },
            radius: 30000,
          },
        },
        maxResultCount: 1,
      },
      {
        otherArgs: {
          headers: {
            'X-Goog-FieldMask':
              'places.id,places.displayName,places.googleMapsLinks,places.location,places.generativeSummary',
          },
        },
      },
    );

    const place = resp.places?.[0];
    if (!place) {
      console.warn(`[enrich] No result for: ${query}`);
      return null;
    }

    return {
      place_id: place.id ?? null,
      maps_url: place.googleMapsLinks?.placeUri ?? null,
      latitude: place.location?.latitude ?? null,
      longitude: place.location?.longitude ?? null,
      ai_summary: place.generativeSummary?.text ?? null,
      ai_summary_disclosure: place.generativeSummary?.disclosureText ?? null,
    };
  } catch (err) {
    console.error(`[enrich] Error for ${row.name}:`, err);
    return null;
  }
}
```

---

## Nearby Search — location-first lookup

Use when you have coordinates and want to find the matching venue:

```typescript
const [resp] = await places.searchNearby(
  {
    locationRestriction: {
      circle: {
        center: { latitude: row.latitude, longitude: row.longitude },
        radius: 100, // tight radius when you have good coords
      },
    },
    includedTypes: ['restaurant'], // or 'tourist_attraction', 'event_venue'
    maxResultCount: 1,
  },
  {
    otherArgs: {
      headers: {
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.googleMapsLinks',
      },
    },
  },
);
```

---

## Place Details — most efficient when place_id known

Place Details costs less than Text Search. If `place_id` is already in the DB, use this to refresh:

```typescript
const resp = await places.getPlace(
  { name: `places/${placeId}` },
  {
    otherArgs: {
      headers: {
        'X-Goog-FieldMask':
          'id,displayName,googleMapsLinks,location,generativeSummary',
      },
    },
  },
);
// resp is a Place object (not an array)
```

---

## Enrichment script structure (PLACES-005-010)

```
scripts/
  enrich-places.ts      — Text Search → place_id + maps_url + lat/lng backfill
  cache-ai-summaries.ts — Place Details (existing place_id) → generativeSummary
  geocode-missing.ts    — Nearby Search for rows where lat/lng IS NULL
```

Run order: `enrich-places` first (gets place_id), then `cache-ai-summaries` (uses place_id from previous step).

**Progress logging pattern:**
```typescript
let success = 0, skipped = 0, failed = 0;
for (const row of rows) {
  const result = await enrichVenue(row);
  if (!result) { failed++; continue; }
  await supabase.from('restaurants').update(result).eq('id', row.id);
  success++;
  if (success % 10 === 0) console.log(`Progress: ${success}/${rows.length}`);
  await new Promise(r => setTimeout(r, 100)); // rate limit: 10 req/s
}
console.log(`Done: ${success} enriched, ${skipped} skipped, ${failed} failed`);
```

---

## Billing notes

- Text Search: charged per field group (Basic, Advanced, Preferred). `generativeSummary` is in Advanced Data SKU.
- Place Details: cheaper than Text Search when you already have `place_id`. Use for refresh-only.
- `googleMapsLinks`: currently **free** (preview as of 2026-05). Add to every mask.
- Geocoding fallback (location field only): Basic Data SKU — cheapest option.

---

## GCP project setup checklist

- [ ] Enable "Places API (New)" in GCP Console → APIs & Services → Library
- [ ] API key restricted to: Places API (New) only, IP-restricted for server scripts
- [ ] Billing account linked to project
- [ ] (Optional) Set quota limits per day in GCP Console to cap spend
- [ ] Key stored in Infisical → synced to Supabase edge fn secrets as `GOOGLE_PLACES_API_KEY`

**Do NOT enable "Places API" (legacy) — enable "Places API (New)" specifically.** They have different billing, different endpoints, and different field names.
