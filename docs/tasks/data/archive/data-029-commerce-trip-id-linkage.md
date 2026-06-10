---
task_id: data-029
mvp_step: 29
title: Commerce trip_id linkage — event_orders, leads, showings
layer: DATA
priority: P1
status: Done
verified: 2026-05-29
evidence: ../evidence/data-029-commerce-trip-id.md
estimated_effort: 4h
depends_on: ["data-026"]
unblocks: ["data-028", "TRIP-010"]
skills: [mde-supabase, mde-stripe]
related:
  - ../../trips/tasks/TRIP-010-booking-trip-item-sync.md
  - ../../trips/trips-plan.md
description: Add nullable trip_id FKs so webhook/sync can mirror paid tickets and viewings into trip_items.
---

# DATA-029 — commerce trip_id linkage

## Live state (2026-05-29)

| Table | `trip_id` | Status |
|-------|-----------|--------|
| `event_orders` | column + index | ✅ DATA-029 |
| `leads` | column + index | ✅ DATA-029 |
| `showings` | column + index | ✅ DATA-029 |
| `bookings` | column exists | ✅ pre-existing |
| `saved_places` | column exists | ✅ pre-existing |

**Ticket checkout** (`ticket-checkout-schema.ts`) still has no `tripId` field — app follow-up below.

## Migration (sketch)

```sql
ALTER TABLE public.event_orders
  ADD COLUMN IF NOT EXISTS trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL;

ALTER TABLE public.showings
  ADD COLUMN IF NOT EXISTS trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_event_orders_trip_id
  ON public.event_orders (trip_id) WHERE trip_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_trip_id
  ON public.leads (trip_id) WHERE trip_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_showings_trip_id
  ON public.showings (trip_id) WHERE trip_id IS NOT NULL;
```

## RLS

- No new SELECT policies required — trip_id is write metadata on owned rows
- FK validates trip exists; app must verify `trips.user_id = auth.uid()` on insert

## App follow-up (not this task)

- Extend `ticketCheckoutInputSchema` with optional `tripId`
- Pass through Stripe session metadata + persist on `event_orders` at finalize
- Schedule viewing modal: optional active trip picker → `leads.trip_id`

## Acceptance criteria

- [x] Columns + indexes applied
- [x] RLS unchanged on read paths
- [ ] Documented in data-028 sync spec
- [x] No service role in browser
