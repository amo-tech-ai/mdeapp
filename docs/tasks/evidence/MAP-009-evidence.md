# MAP-009 evidence

**Date:** 2026-05-26

## Shipped

- `@googlemaps/markerclusterer` in `mdeapp/package.json`
- `ClusteredCategoryMarkers` + `ClusteredCategoryMapPin` — vis.gl `AdvancedMarker` refs → `MarkerClusterer`
- Paisa teal cluster renderer (`#0f766e`) in `src/lib/map-clustering.ts`
- `ChatMap` clusters when `shouldClusterMapPins(n)` (≥4 pins, flag not `0`)
- Rollback: `NEXT_PUBLIC_MAP_CLUSTERING=0` → flat markers
- Hydration: `ChatResultsColumn` uses `useSyncExternalStore` deferral (`results-column-hydrate`)

## Verification

```bash
cd mdeapp
npm test -- src/lib/__tests__/map-clustering.test.ts src/components/maps/__tests__/
npm run typecheck
SMOKE_GROUNDING_QUERY="list best cafes in medellin" npm run smoke:grounding-attribution
```

- Unit: 11/11 maps + chat tests pass
- Smoke: 5 cafe glyphs, MAP-031 copy, `data-map-clustering="true"` on chat-map when ≥4 pins
