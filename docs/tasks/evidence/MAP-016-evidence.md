# MAP-016 evidence — fitBounds on multi-pin search

**Date:** 2026-05-25  
**Status:** Done

## Change

- `MapFitBoundsController` — fits bounds when `fitBoundsToken` increments after tool merge ≥2 pins
- `map-context` — `requestFitBounds()` / `fitBoundsToken`
- `ToolPinsSync` — calls `requestFitBounds()` when incoming batch ≥2
- `computeLatLngBounds` pure helper + Vitest in `map-pin-filters.ts`

## Verification (localhost :3001)

| Check | Result |
|-------|--------|
| Vitest `map-pin-filters.test.ts` | bounds NE/SW ✅ |
| `npm run smoke:map-pins` | 5 rental pins visible after search |
| `npm run smoke:f50-pin-sync` | single-pin pan still works (no fitBounds fight) |
| `npm run floor` | exit 0 |
