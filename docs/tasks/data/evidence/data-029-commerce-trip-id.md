---
task: data-029
date: 2026-05-29
project: zkwcbyxiwklihegjhuql
status: Done
---

# DATA-029 — commerce trip_id linkage evidence

## Migration

Applied live: `data029_commerce_trip_id_linkage`

## Columns added

| Table | Column | FK |
|-------|--------|-----|
| `event_orders` | `trip_id` | `trips(id)` ON DELETE SET NULL |
| `leads` | `trip_id` | `trips(id)` ON DELETE SET NULL |
| `showings` | `trip_id` | `trips(id)` ON DELETE SET NULL |

## Indexes

- `idx_event_orders_trip_id`
- `idx_leads_trip_id`
- `idx_showings_trip_id`

## Pre-existing

- `bookings.trip_id` ✅
- `saved_places.trip_id` ✅

## App follow-up (out of scope)

- `ticketCheckoutInputSchema` optional `tripId`
- Schedule viewing modal → `leads.trip_id`
- DATA-028 sync jobs
