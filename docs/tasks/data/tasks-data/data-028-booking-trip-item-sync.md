---
task_id: data-028
mvp_step: 28
title: event_orders / showings → trip_items idempotent sync
layer: DATA
priority: P1
status: Not Started
estimated_effort: 5h
depends_on: ["data-027", "data-021", "data-029"]
unblocks: ["TRIP-010"]
skills: [mde-supabase]
related:
  - ../../trips/tasks/TRIP-010-booking-trip-item-sync.md
  - ../../../supabase/functions/ticket-payment-webhook/index.ts
description: After paid ticket or confirmed showing, upsert trip_items; reuse idempotency_keys pattern.
---

# DATA-028 — booking → trip_items sync

## Gap (verified 2026-05-29)

`ticket-payment-webhook` finalizes `event_orders` but does **not** write `trip_items`. **DATA-029 columns exist** — remaining work is webhook/app sync only.

## Design

Prefer **`insert_trip_item_for_user`** (DATA-027) or equivalent upsert on `unique_trip_item`:

```text
Stripe webhook (idempotent event.id)
  → event_orders paid + trip_id set at checkout
  → upsert trip_items (event, source_id=event_id)
```

Showings path after DATA-021:

```text
showings insert (status=scheduled) or confirm (status=confirmed)
  → IF showings.trip_id IS NOT NULL THEN insert_trip_item_for_user (showing, source_id=showing_id)
```

Initial insert uses `status = 'scheduled'` per live CHECK (DATA-021).

## Idempotency

- `ON CONFLICT (trip_id, item_type, source_id) DO UPDATE` for schedule/metadata refresh
- Do not add new queue table for MVP

## Acceptance criteria

- [ ] Paid order with trip_id creates exactly one itinerary row
- [ ] Webhook replay does not duplicate
- [ ] Viewing path documented with data-021
- [ ] Evidence SQL + edge log snippet
