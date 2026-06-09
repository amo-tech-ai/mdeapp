---
task_id: data-024
mvp_step: 24
title: Rental booking commerce prep — bookings ↔ payments Stripe
layer: DATA
priority: P2
status: Not Started
estimated_effort: 5h
depends_on: ["data-019"]
blocks_evidence_for:
  - ../../real-estate/real-estate-prd.md
description: Prepare rental booking path for RE-022 gate — booking_type rental, payment FK, commission columns, idempotency.
---

# DATA-024 — rental booking commerce prep

## Gap

PRD MVP gate: **one paid booking + commission reconciled**. Tables exist but empty:

- `bookings` — generic `resource_id`, no Stripe session id on row
- `payments` — has `stripe_payment_intent_id`, `stripe_event_id`

Events pattern (`event_orders` + webhook) is the template — **do not duplicate**; extend `bookings`/`payments` for rentals.

## Proposed migration (minimal)

```sql
-- Verify booking_type includes 'rental'
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS apartment_id uuid REFERENCES public.apartments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS commission_cents integer,
  ADD COLUMN IF NOT EXISTS commission_rate_bps integer;

CREATE INDEX idx_bookings_apartment ON public.bookings (apartment_id) WHERE apartment_id IS NOT NULL;
CREATE INDEX idx_bookings_type_status ON public.bookings (booking_type, status);
```

Add `rental-payment-webhook` edge fn spec reference (events track owns pattern — separate app task).

## Acceptance criteria

- [ ] Schema supports rental checkout without new ledger table
- [ ] RLS: buyer read own bookings; landlord read bookings on own listings
- [ ] Idempotency via existing `idempotency_keys` or payment stripe_event_id unique
- [ ] Document defer until RE-013–022 app work starts

## Out of scope

- Stripe Connect landlord payouts (Advanced)
- Implementing webhook edge fn (app/edge task)
