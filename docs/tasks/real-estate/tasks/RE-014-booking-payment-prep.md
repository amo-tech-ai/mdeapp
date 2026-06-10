---
task_id: RE-014
title: Booking + payment prep (rental Stripe)
layer: DATA + STRIPE
priority: P2
phase: post-mvp
status: Not Started
persona: Camila
depends_on: [RE-013]
unblocks: []
skills: [mde-supabase, mde-stripe]
related:
  - ../../data/tasks-data/data-024-rental-booking-commerce-prep.md
description: Spec rental booking webhook; mirror events idempotency pattern.
---

# RE-014 — Booking/payment prep

## Scope (data-024)

- `bookings.trip_id`, payment_status enums documented
- Edge: rental checkout session (separate from ticket-checkout)
- Webhook finalize → `payments` + `bookings` — **never** LLM
- Commission field in metadata

## Acceptance criteria

- [ ] Spec + migration plan reviewed
- [ ] Idempotency pattern matches `idempotency_keys`
- [ ] No service role in client
- [ ] No implementation required for CORE/MVP Done

## Gate

One **paid rental booking** before calling POST-MVP Done.
