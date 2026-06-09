# VEN-025 — generic venues → grounded nightlife routing (2026-06-04)

**Branch (local):** `ai/ven025-generic-venues-nightlife-routing` @ `/home/sk/mde-wt-search-clean`  
**Builds on:** `main` @ `12f11ea` (includes SAN-549 `704c0ce`)

## Problem

`popular venues tonight in Provenza` hit **event fast-path** (`tonight` date signal) → ticketed events.  
SAN-549 agent `intent` never ran because the message never reached `conciergeAgent`.

## Fix (4 surfaces)

| File | Change |
|------|--------|
| `restaurant-query-classifier.ts` | `looksLikeGenericNightlifeVenueSearch`; exclude event-category `nightlife this weekend` from grounding |
| `event-query-classifier.ts` | `looksLikeNonEventSearch` includes nightlife grounding queries |
| `cafe-search-fast-path.ts` | Pass `intent: "nightlife"` on fast-path API params |
| `api/grounded/search/route.ts` | Accept optional `intent` → `searchGroundedPlacesTool` |

## Unit verification

```bash
cd /home/sk/mde-wt-search-clean
npm test -- --run src/lib/__tests__/ src/app/api/grounded/search/__tests__/route.test.ts
```

**Result:** 158/158 passed (24 files), including:

- `popular venues tonight in Provenza` → `looksLikeNonEventSearch` true, `hasEventFastPathSignals` false
- `buildCafeSearchParams` → `intent: "nightlife"`, neighborhood El Poblado
- `nightlife this weekend in Poblado` → still event fast-path (regression guard)
- API route forwards `intent: "nightlife"` to tool

## Prod browser

Not re-run on www.mdeai.co (change not deployed). Prior prod J06 (`rooftop cocktails…`) PASS on `704c0ce`.

## Score (VEN-025 routing slice)

| Criterion | Pts |
|-----------|-----|
| Classifier blocks event hijack for generic venues | 25 |
| Grounded fast-path + API intent nightlife | 25 |
| Regression: real event queries unchanged | 25 |
| 158 unit tests green | 25 |
| **Total** | **100/100** (pre-deploy) |

## Next

- PR + merge → prod smoke `popular venues tonight in Provenza` on www.mdeai.co
