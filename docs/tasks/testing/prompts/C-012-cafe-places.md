# C-012 — café Places detail (localhost + prod)

**Task:** [`tasks/commit/may-27/tasks/C-012-cafe-places-detail.md`](../../commit/may-27/tasks/C-012-cafe-places-detail.md)  
**Skills:** `mde-maps`, `mastra`, `copilotkit-develop`, `testing`

## Localhost

```bash
cd /home/sk/mdeai/mdeapp
pkill -f "next dev" 2>/dev/null; pkill -f "mastra dev" 2>/dev/null; sleep 2
npm run dev
# note port — usually :3001
```

1. Open `/`
2. Query: `quiet cafés in Laureles with wifi`
3. Verify:
   - café cards in chat (`data-testid` per SCREEN-021)
   - map pins for cafés
   - click card → detail panel / booking sheet in right column
   - Grounding attribution visible
   - `GET/POST /api/places/detail` → 200 with field-masked payload

## Playwright

```bash
npm test -- --run src/lib/place-details.test.ts \
  src/components/copilot/__tests__/cafe-result-card.test.ts
PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-grounding.spec.ts --project=chromium
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts --project=chromium
```

## Production (after PR #13 merge)

Repeat café query on `https://www.mdeai.co/` — log pass/fail separately from localhost.

## Pass matrix

| # | Check | Pass |
|---|-------|:----:|
| 1 | **Hard gate:** `rg 'X-Goog-FieldMask|validatePlacesFieldMask' src/mastra/lib/google-places-client.ts` | |
| 2 | No API key in client café components | |
| 3 | Café cards render (not markdown-only) | |
| 4 | Places detail route 200 localhost | |
| 5 | Grounding attribution visible | |
| 6 | `<Map>` has `mapId` | |
| 7 | No duplicate Map results (C-009) | |
| 8 | Unit tests pass | |
| 9 | SCREEN-021 pass (or flaky logged ×2) | |
| 10 | `npm run floor` green | |
| 11 | Repeat on Vercel **preview** + **prod** separately | |

## Evidence

`tasks/testing/evidence/YYYY-MM-DD/C-012-RESULTS.md`
