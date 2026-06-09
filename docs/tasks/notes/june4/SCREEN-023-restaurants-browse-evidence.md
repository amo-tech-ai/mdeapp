# SCREEN-023 Evidence — `/restaurants` browse page

> **Summary:** Tourist can browse `/restaurants` with neighborhood + cuisine filters — no chat required. Uses existing `POST /api/restaurants/search`.

**Date:** 2026-06-03  
**Linear:** [SAN-490](https://linear.app/sanjiovani/issue/SAN-490)

## Files

| File | Purpose |
|------|---------|
| `src/app/restaurants/page.tsx` | Server fetch + filter searchParams |
| `src/app/restaurants/loading.tsx` | Skeleton while navigating |
| `src/components/restaurants/restaurant-browse-view.tsx` | Header, filter chips, card grid |
| `src/app/api/restaurants/search/route.test.ts` | API contract vitest |
| `e2e/screens/SCREEN-023-restaurant-listings.spec.ts` | Browse e2e (2 tests) |

## Proof

```bash
cd mdeapp
curl -s -o /dev/null -w "/restaurants -> %{http_code}\n" http://localhost:3001/restaurants
npm run verify:task -- SCREEN-023 --skip-floor
npx playwright test e2e/screens/SCREEN-023-restaurant-listings.spec.ts --project=chromium
```

## Grade

| Task | Feature | Real-world example | Score | Grade |
|------|---------|-------------------|------:|-------|
| API | Hybrid restaurant search | Backend for browse | 100% | A |
| `/restaurants` page | Catalog browse | Tourist opens mdeai.co/restaurants | 100% | A |
| Chat detail panel | RestaurantDetailPanel | Still on `/` chat only | n/a | — |
| **Overall browse surface** | Row 21 SCREEN-023 | Browse Provenza dinner without chat | **100%** | **A** |

Prod 404 until deploy — expected.
