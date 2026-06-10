# SCREEN-013 evidence — itinerary panel

**Date:** 2026-05-20  
**Task:** [`tasks/screens/SCREEN-013-itinerary-panel.md`](../screens/SCREEN-013-itinerary-panel.md)

## Deliverables

| File | Purpose |
|------|---------|
| `mdeapp/src/lib/trips/itinerary-logic.ts` | Day grouping + overlap detection |
| `mdeapp/src/lib/trips/load-trip-workspace.ts` | Trip + trip_items + conflicts load |
| `mdeapp/src/components/trips/itinerary-panel.tsx` | Timeline + conflict banner + map pin list |
| `mdeapp/src/components/trips/trip-workspace-view.tsx` | Ideas / Itinerary / Map / Bookings tabs |
| `mdeapp/src/app/trips/[id]/page.tsx` | Workspace page |
| `mdeapp/e2e/screens/SCREEN-013-itinerary.spec.ts` | Playwright 4/4 |

## Verification

```bash
cd mdeapp
npm test                                    # 154/154
npm run floor                               # exit 0
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-013-itinerary.spec.ts --project=chromium  # 4/4
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/trips/11111111-1111-1111-1111-000000000002  # 200
```

## Demo data

Trip `11111111-1111-1111-1111-000000000002` (Salsa weekend run) for `qa-landlord@mdeai.co`:
- Salsa + pre-salsa dinner on **2026-06-21** → **schedule conflict** UI
- 2 map pins (La 70 + El Poblado)

Screenshot: `mdeapp/test-results/browser-itinerary-conflict.png`

## Persona impact

**Camila** opens `/trips/[id]` → **Itinerary** tab shows day groups; overlapping dinner + salsa triggers conflict banner before Saturday.

## Grade: **A**
