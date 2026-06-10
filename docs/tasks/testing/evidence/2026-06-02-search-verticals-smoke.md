# Search verticals smoke — 2026-06-02

**Branch:** `main` @ `4688b7a` (local pinId/tsconfig fix; not yet pushed)  
**Dev:** `npm run dev` — UI `:3001`, Mastra `:4111`

## Automated

| Gate | Result |
|------|--------|
| `npm test` | 101 files, 436 tests PASS |
| Search Vitest subset | 40 tests PASS (events, restaurants, rental intelligence, café fallback) |

## Fast-path APIs (POST)

| Vertical | Endpoint | Status | Results |
|----------|----------|--------|---------|
| Rentals | `/api/rentals/search` | 200 | 5 |
| Events | `/api/events/search` | 200 | 6 |
| Cafés (grounded) | `/api/grounded/search` | 200 | 5 |
| Restaurants | `/api/restaurants/search` | 200 | 5 |

## Browser (`http://localhost:3001/`)

| Query | UI | Map |
|-------|-----|-----|
| 1BR Laureles under $80/night | 5 rental cards | 5 pins |
| salsa events this weekend | 6 event cards | 6 pins |
| best restaurants in Poblado | 5 restaurant cards (El Cielo, …) | 5 pins |
| quiet cafes in Laureles for remote work | 5 grounded cards | 10 pins (stacked session) |

## Notes

- `[query-embedding] embed API failed: 403` — rentals still return (non-embedding path).
- React hydration warning in dev (layout SSR); non-blocking for search flows.
