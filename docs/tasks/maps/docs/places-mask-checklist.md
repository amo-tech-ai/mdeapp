---
task_id: MAP-004
doc_type: places_field_mask_checklist
title: Places API (New) — signed field masks (MAP-004)
sources:
  - https://developers.google.com/maps/documentation/places/web-service/op-overview
  - https://developers.google.com/maps/documentation/javascript/place-class-data-fields
  - https://developers.google.com/maps/documentation/javascript/place-types
  - https://developers.google.com/maps/documentation/places/web-service/choose-fields
---

# MAP-004 — Field mask checklist

**Rule:** Every server Places (New) call MUST send `X-Goog-FieldMask` with **only** paths listed for that use case. Implemented in `mdeapp/src/mastra/lib/google-places-client.ts`.

**Never by default:** `generativeSummary`, `reviewSummary`, `neighborhoodSummary` (AI SKU / attribution rules).

## Registry

| Endpoint | Constant | Minimum mask |
|----------|----------|--------------|
| Text Search | `DEFAULT_TEXT_SEARCH_MASK` | `places.id,places.displayName,places.googleMapsLinks,places.location` |
| Nearby Search | `DEFAULT_NEARBY_SEARCH_MASK` | above + `places.primaryType` |
| Place Details | `PLACE_DETAILS_MVP_MASK` / `buildPlaceDetailsMask()` | `id,displayName,formattedAddress,location,googleMapsLinks,rating,userRatingCount,priceLevel,currentOpeningHours,photos,types` |

**Planned extension (MAP-004 §12 — not yet in prod):**

| Constant | Mask addition | Version bump |
|----------|---------------|--------------|
| `PLACE_DETAILS_LINKS_MASK` | `googleMapsLinks.placeUri,googleMapsLinks.directionsUri,googleMapsLinks.reviewsUri` | `details-v2-links-2026-05-26` (example) |

Sync locations when bumped: `google-places-client.ts`, `places_enrich.py`, 018E `place_details_cache.field_mask_version`.

**Opt-in (Enterprise + Atmosphere — $25/1k vs $20/1k global):** `editorialSummary` only when `PLACES_ENABLE_EDITORIAL_SUMMARY=true`.

## Place types (Nearby Search)

Use [Place Types (New)](https://developers.google.com/maps/documentation/javascript/place-types) — e.g. `cafe`, `coffee_shop`, `restaurant` for Camila/Tourist queries; `event_venue` for Roberto.

## Maps links

Always read `googleMapsLinks.placeUri` — never build URLs from lat/lng ([Maps links doc](https://developers.google.com/maps/documentation/places/web-service/maps-links)).

## Verification

```bash
cd mdeapp && npm test -- src/mastra/lib/google-places-client.test.ts
cd mdeapp && npm test -- src/mastra/lib/__tests__/places-retry.test.ts
rg 'FieldMask.*\\*' src/mastra/lib/google-places-client.ts  # → 0
```

## Cache version (MAP-018E)

| Constant | Value | Location |
|----------|-------|----------|
| `PLACE_DETAILS_FIELD_MASK_VERSION` | `details-v3-links-2026-05-26` | `google-places-client.ts`, `places_enrich.py` — MAP-019 `directionsUri` / `reviewsUri` |

Bump when `DEFAULT_PLACE_DETAILS_MASK` changes.

## Retry (MAP-004b)

- TS client: `withPlacesRetry` — max 3 attempts, exponential backoff + jitter on 429/500/503/gRPC 8/13/14.
- Sidecar: `fetch_place_details` — max 2 retries on 429/500/503 with jitter.

## Interim cache (MAP-018B → 018E)

Sidecar in-memory TTL default **300s** (`PLACES_ENRICH_CACHE_TTL_SEC`). Set `0` to disable until Supabase cache lands.
