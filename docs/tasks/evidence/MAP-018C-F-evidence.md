# MAP-018C / 018D / 018F evidence — 2026-05-25

## Shipped

| Task | Files |
|------|-------|
| **018C** | `adk-grounding-types.ts`, `map-adk-grounding-pins.ts`, `search-grounded-places.ts`, `parse-grounded-tool-result.ts`, `normalize-tool-output.ts` |
| **018D** | `src/lib/places-photo-proxy.ts`, `src/app/api/places/photo/route.ts` |
| **018F** | `src/components/copilot/grounded-place-card.tsx`, `search-tool-renders.tsx`, `places-display.ts` |

## Tests

```bash
cd mdeapp && npm test   # 205/205 passed
npm run verify:grounding-enrichment   # 5/5 enriched
node --env-file=.env.local scripts/smoke-grounding-attribution.mjs   # 5 cards, 0 console errors
PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-grounding.spec.ts --project=chromium   # 1 passed
```

## Localhost Browser proof (Cursor @Browser)

Query: *"list cafés in Laureles Medellín"* on `http://localhost:3001`

Verified in accessibility snapshot:
- **Café Zeppelin** — ★ 4.6 (4.0k), $$, Open now, photo thumbnail
- **Amelier Café Laureles** — ★ 4.7 (229), Closed
- **Botswana Café & Brunch** — ★ 4.8 (988)
- **San Jorge Café-Bar** — ★ 5.0 (489), Open now
- **Pausa Coffee & Brunch** — ★ 4.7 (165)
- **Open map with 5 pins** — map panel synced

Photo requests use `/api/places/photo?name=...` (no server key in browser).

## Rollback

`NEXT_PUBLIC_RICH_GROUNDED_CARDS=false` → thin `PlaceResultCard` fallback.
