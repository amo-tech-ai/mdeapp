# MAP-019 — Google Maps deep-link CTAs evidence

**Date:** 2026-05-26  
**Status:** Done

## Shipped

- `FIELD_MASK_VERSION` → `details-v3-links-2026-05-26` (Python + TS)
- Sidecar `merge_details_into_pin` → `directionsUrl`, `reviewsUrl` from `googleMapsLinks`
- `GroundedPlaceCard` CTA row: Directions / Reviews / Open in Google Maps (`NEXT_PUBLIC_MAPS_DEEP_LINKS=false` rollback)
- Mastra schema + `map-adk-grounding-pins` + `parse-grounded-tool-result` propagation

## Verification

| Check | Result |
|-------|--------|
| Vitest | **219/219** (incl. `grounded-place-card` CTA tests) |
| `pytest test_places_enrich.py` | **8/8** |
| `npm run floor` | exit 0 |
| `npm run verify:grounding` | 5 pins, grounding-lite |
| `npm run smoke:map-pins` | 5 cards, 5 pins |

## Manual (localhost)

`npm run dev` → grounded café query → cards show `grounded-maps-cta-row` when API returns link URIs.
