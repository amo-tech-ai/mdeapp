# MAP-031 evidence

**Date:** 2026-05-26

## Change

`ChatResultsColumn` uses `resolveMapResultsView()` — when rich grounded cards hide `grounded` pin rows but map still has pins, show `results-grounded-on-map` (“Pins on the map” / “Pins are on the map and in the cards above.”) instead of `results-empty` (“No pins yet”).

## Verification

```bash
cd mdeapp
npm test -- src/components/chat/__tests__/chat-results-column.test.ts src/components/maps/
npm run typecheck
SMOKE_GROUNDING_QUERY="list best cafes in medellin" npm run smoke:grounding-attribution
```

- Unit: 12/12 pass (4 MAP-031 + 8 maps)
- Smoke: `results-grounded-on-map` visible; `results-empty` not shown after café query
