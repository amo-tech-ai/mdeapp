---
task_id: TRIP-010
title: Booking confirm → trip_items sync
layer: APP + DATA + EDGE
priority: P0
phase: mvp
status: Not Started
estimated_effort: 6h
persona: Camila, Andrés
depends_on: [TRIP-007, data-028, data-029, EVP-001-core]
unblocks: [TRIP-013, TRIP-011]
skills: [mde-supabase, copilotkit-integrations, mastra]
related:
  - ../../data/tasks-data/data-028-booking-trip-item-sync.md
  - ../../events/tasks/EVP-001-core-production-proof-gates.md
  - ../../data/tasks-data/data-021-showings-lead-bridge.md
description: Idempotent mirror from event_orders and showings into trip_items after payment/schedule.
---

# TRIP-010 — Booking → trip_items sync

## Forensic gap (verified)

`ticket-payment-webhook` uses `idempotency_keys` ✅ but **does not insert `trip_items`** (grep zero).

## Build scope

### Data (data-028)

- Idempotent upsert on `unique_trip_item (trip_id, item_type, source_id)`
- Extend `item_type` to include `event`, `showing` via data-027
- Snapshot: copy event title, venue lat/lng, `start_at` from order/showing
- Write enough metadata to reconcile later: `order_id`, `stripe_payment_intent`, `webhook_event_id`, `sync_source`, `synced_at`

### Event ticket path

- After `event_orders.status = paid`: if `metadata.trip_id` or checkout payload includes `trip_id`, upsert `trip_items`
- Hook: edge fn extension OR mdeapp finalize route — **prefer edge** for payment truth proximity
- Reuse Stripe `event.id` idempotency — same replay must not duplicate item
- On trip item insert failure, return 500 so Stripe retries; do not mark webhook idempotency success until the mirror side effect is committed or explicitly queued for TRIP-013 repair

### Viewing path

- After `showings` row from schedule-viewing (data-021): mirror to `trip_items` when `trip_id` on lead/metadata

### CopilotKit

- Booking confirmation generative card links to trip workspace itinerary tab

## Acceptance criteria

- [ ] Paid ticket appears on itinerary when trip_id provided at checkout
- [ ] Scheduled viewing appears after confirm flow
- [ ] Webhook replay does not duplicate (`unique_trip_item`)
- [ ] Evidence: SQL select + screenshot
- [ ] Failure-mode test proves `trip_items` insert error does not get cached as successful webhook completion

## Do not do

- New durable queue table for MVP (TRIP-013 uses lightweight repair/backstop first)
- LLM does not set payment status
