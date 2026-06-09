# F50b — Map viewport sync evidence

**Date:** 2026-05-26  
**Status:** Done

## Shipped

- `MapCameraSync.tsx` — `map.addListener("idle")` → debounced viewport on `MapContext`
- `map-ui-sync.tsx` — `buildMapUiSummary` includes `viewport` in concierge `mapUi`
- `search-grounded-places` — optional `locationBias` → ADK invoke body
- Concierge instructions — pass `mapUi.viewport` as `locationBias` when map-visible search
- `ChatMap` marker click → `panToPin` (F50b acceptance)

## Verification

| Check | Result |
|-------|--------|
| Vitest `map-ui-summary.test.ts` | pass |
| Vitest `grounding-location-bias.test.ts` | pass |
| `adk-grounding-client.test.ts` | forwards `locationBias` in POST body |
| `npm run floor` | exit 0 |
| `npm run smoke:f50-pin-sync` | ✅ card + pin sync |
