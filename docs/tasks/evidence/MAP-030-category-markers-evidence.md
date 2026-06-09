# MAP-030 — category Advanced Markers evidence

**Status:** Done (2026-05-26)  
**Task:** `tasks/maps/MAP-030-category-advanced-markers.md`

## Summary

Replaced generic `•` dot pins with **category-aware** `<AdvancedMarker>` content: ☕🏠🎟️🍽️📍📌 glyphs, optional grounded rating badge, closed-café gray styling, selected ring + scale. No changes to grounding, Places enrich, or MAP-002D.

## Files changed

| File | Change |
|------|--------|
| `mdeapp/src/components/maps/markers/category-map-marker.ts` | Glyph map, colors, meta parsing, state builder |
| `mdeapp/src/components/maps/markers/CategoryMapMarker.tsx` | Marker DOM + `data-marker-glyph` |
| `mdeapp/src/components/maps/markers/category-map-marker.test.ts` | 7 Vitest cases |
| `mdeapp/src/components/maps/ChatMap.tsx` | Uses `CategoryMapMarker` |
| `mdeapp/scripts/smoke-grounding-attribution.mjs` | Assert `data-marker-glyph=cafe` ≥1 |
| `mdeapp/scripts/smoke-map-chat-pins.mjs` | Assert `data-marker-glyph=rental` ≥1 |

## Tests run

```bash
cd /home/sk/mdeai/mdeapp
npm test -- src/components/maps/markers/category-map-marker.test.ts  # 7/7
npm run floor                                                        # exit 0 (246 tests)
npm run smoke:map-pins                                               # rental-marker-glyph: 5
npm run smoke:f50-pin-sync                                           # pass
SMOKE_GROUNDING_QUERY="list cafes in medellin" npm run smoke:grounding-attribution
# cafe-marker-glyph: 5, grounded-card: 5, web citations: 0
```

## Screenshots

- After café smoke: `mdeapp/tmp/map-002-grounding-attribution-1779773471802.png`

## Marker contract (for QA)

| `data-marker-glyph` | Category | Emoji |
|---------------------|----------|-------|
| `cafe` | `grounded` | ☕ (+ rating when `meta.rating`) |
| `rental` | `rental` | 🏠 |
| `event` | `event` | 🎟️ |
| `restaurant` | `restaurant` | 🍽️ |
| `attraction` | `attraction` | 📍 |
| `venue` | `venue` | 📌 |

Closed: `data-marker-closed=true` when `category=grounded` and `meta.openNow === false`.

## Risks

- Emoji rendering varies by OS — acceptable for Phase 1; swap to SVG icons later if needed.
- Rating pill widens pin — clustering (MAP-009) should account for width.

## Rollback

Revert `CategoryMapMarker` + `ChatMap.tsx` + smoke assertions → restores `•` dots.
