# MAP-004 evidence — Places API client + field masks

**Date:** 2026-05-25  
**Status:** Done

## Delivered

| Item | Path |
|------|------|
| Places client | `mdeapp/src/mastra/lib/google-places-client.ts` |
| Vitest (mask headers) | `mdeapp/src/mastra/lib/google-places-client.test.ts` |
| Field mask registry | `tasks/maps/places-mask-checklist.md` |
| PreToolUse hook | `.claude/hooks/places-api-field-mask.mjs` (promoted) |
| Dependency | `@googlemaps/places@^2.4.1` |

## Official docs alignment

| API | Mask prefix | Key fields |
|-----|-------------|------------|
| Text Search | `places.*` | id, displayName, googleMapsLinks, location |
| Nearby Search | `places.*` | + `primaryType` ([place types](https://developers.google.com/maps/documentation/javascript/place-types)) |
| Place Details | flat (no prefix) | Mindtrip MVP: rating, photos, currentOpeningHours, editorialSummary ([data fields](https://developers.google.com/maps/documentation/javascript/place-class-data-fields)) |

Maps URL source: `googleMapsLinks.placeUri` only — not lat/lng URLs.

## Verification (localhost)

| Check | Result |
|-------|--------|
| Vitest `google-places-client.test.ts` | **10/10** — each method sends `X-Goog-FieldMask` |
| `rg GOOGLE_PLACES mdeapp/src/components` | 0 |
| `rg 'FieldMask.*\*' google-places-client.ts` | 0 |
| `node scripts/verify-maps-env.mjs` | Places searchText probe HTTP 200 |
| `npm run floor` | exit 0 |

## Next

**MAP-018B** — sidecar batch `getPlaceDetails` enrichment after Grounding Lite discovery.
