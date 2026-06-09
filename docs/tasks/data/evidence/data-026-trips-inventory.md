---
task: data-026
date: 2026-05-29
project: zkwcbyxiwklihegjhuql
status: Done
---

# DATA-026 — Trips inventory evidence

## CORE verdict: ✅ No new tables for MVP

| Table | Rows | RLS policies |
|-------|-----:|-------------:|
| `trips` | 2 | 4 |
| `trip_items` | 4 | 4 |
| `saved_places` | 0 | — |
| `collections` | 0 | — |
| `conflict_resolutions` | 0 | — |
| `budget_tracking` | 0 | — |

## `trip_items_item_type_check` (live)

Allowed: `event`, `restaurant`, `rental`, `poi`, `other`

**Missing:** `showing`, `booking`, `custom_note` → DATA-027

## Commerce linkage gaps

| Column | Status |
|--------|--------|
| `event_orders.trip_id` | Missing → DATA-029 |
| `showings.trip_id` | Missing → DATA-029 |
| `bookings.trip_id` | **Exists** |
| `saved_places.trip_id` | **Exists** |
