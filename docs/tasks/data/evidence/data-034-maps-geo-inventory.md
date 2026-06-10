---
task: data-034
date: 2026-05-29
project: zkwcbyxiwklihegjhuql
status: Done
---

# DATA-034 — Maps geo inventory evidence

## Geo coverage

| Kind | Metric | Value |
|------|--------|------:|
| Rentals (`apartments` active) | lat/lng present | 44/44 |
| Restaurants | google_place_id | 44/44 |
| Tourist destinations | google_place_id | 23/23 |
| Events + venues | venues with lat | joinable via `event_venues` |

## Cache

| Table | Rows |
|-------|-----:|
| `place_details_cache` | 52 |
| `places_search_cache` | 33 |
| `route_cache` | **Missing** → DATA-033 |

## Index note

`idx_apartments_rental_search_daily` applied DATA-009 — EXPLAIN uses Index Scan on Laureles+2BR+price_daily query.
