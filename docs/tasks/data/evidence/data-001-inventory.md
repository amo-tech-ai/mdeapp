---
task: data-001
date: 2026-05-29
project: zkwcbyxiwklihegjhuql
method: Supabase MCP execute_sql (read-only)
status: Done
---

# DATA-001 — Venues inventory evidence

## Café

| Item | Status |
|------|--------|
| `venue_anchors` (kind=cafe) | **0 rows** — table exists after DATA-009 M2 (2026-05-29) |
| Curated seed | Pending DATA-035 |
| Primary discovery | ADK / Places grounding + cache |

## Restaurant

| Table | Rows | google_place_id | RLS policies |
|-------|-----:|----------------:|-------------:|
| `restaurants` | 44 | 44/44 (100%) | 6 |
| `restaurant_embeddings` | 43 | — | — |
| `place_details_cache` | 52 | — | 4 |
| `places_search_cache` | 33 | — | 4 |

## Nightclub

| Item | Status |
|------|--------|
| `venue_anchors` (kind=nightclub) | **0 rows** — pending DATA-005 |
| Ticketed events | Use `events` — separate from nightlife anchors |

## Booking

| Table | Status |
|-------|--------|
| `venue_booking_requests` | **Created** DATA-009 M1 — 0 rows, RLS 3 policies |
| `bookings` | 0 rows (generic booking table) |

## Gaps → next tasks

- DATA-035 → seed café anchors
- DATA-005 → seed nightclub anchors
- DATA-004 → verify-only (restaurants already complete)
