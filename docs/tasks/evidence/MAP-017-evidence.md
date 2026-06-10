# MAP-017 evidence — mock pin lifecycle

**Date:** 2026-05-25  
**Status:** Done

## Change

- `filterRenderableMapPins()` — hides `source: mock` when any non-mock pin exists
- `ChatMap` uses filter for marker render

## Verification (localhost :3001)

| Check | Result |
|-------|--------|
| `npm run smoke:map-pins` | **5** map pins (matches 5 cards, no extra mock) |
| Vitest `map-pin-filters.test.ts` | mock kept alone · dropped when rental present |
| `npm run floor` | exit 0 |
