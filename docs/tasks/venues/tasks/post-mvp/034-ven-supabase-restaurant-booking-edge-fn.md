---
task_id: ven-034
post_mvp_step: 034
title: restaurant-booking edge fn + booking UI in RestaurantDetail
layer: supabase
phase: PHASE-3-RESTAURANT
priority: P2
status: Open
estimated_effort: 1 day
area: backend + frontend
depends_on: [ven-033]
skills: [supabase, frontend-design, mdeai-project-gates]
edge_function: restaurant-booking
schema_tables:
  - restaurant.reservations
  - restaurant.tables
  - restaurant.availability_slots
  - restaurant.venues
description: Race-safe restaurant table booking edge fn + RestaurantDetail widget.
---

<!-- task-summary -->
> **What:** restaurant-booking edge fn + booking UI in RestaurantDetail
> **Why:** Two people booking the last table at 8pm simultaneously must not both succeed. Achieved with: - `pg_advisory_xact_lock(venue_id || date || time hash)` before INSERT - UNIQUE constraint `(table_id, reserved_date,…`
> **Delivers:** `restaurant-booking` edge fn + migrations: `restaurant.reservations`, `restaurant.tables`, `restaurant.availability_slots`, `restaurant.venues`
> **Tools/Skills:** `supabase` · `frontend-design` · `mdeai-project-gates`
> **PHASE-3-RESTAURANT · P2 · Open · Effort: 1 day**
> **Depends on:** ven-033

# VEN-034 — Supabase — restaurant booking edge fn

## Summary

| Aspect | Details |
|---|---|
| **Phase** | PHASE-3-RESTAURANT |
| **Route** | `POST /functions/v1/restaurant-booking` (create) · `DELETE /functions/v1/restaurant-booking/:id` (cancel) |
| **UI** | Booking widget embedded in `/restaurants/:id` detail page |
| **Real-world** | Camila opens El Cielo on `/restaurants/el-cielo`. She sees a "Reserve a Table" card showing available time slots for tonight. Selects 8pm for 2 people, enters her name/email, confirms — receives a confirmation code via email. Carlos sees the booking in his owner dashboard within seconds via Realtime |

## Description

**Race-safe booking.** Two people booking the last table at 8pm simultaneously must not both succeed. Achieved with:
- `pg_advisory_xact_lock(venue_id || date || time hash)` before INSERT
- UNIQUE constraint `(table_id, reserved_date, reserved_time)` as second guard

**Table selection logic.** Auto-assigns the smallest table that fits the party size (minimize waste). If organizer has set `table_id` manually, use that.

## Edge function spec

```typescript
// POST /functions/v1/restaurant-booking
// Auth: Bearer JWT (preferred) or anonymous with guest_email
// Body:
{
  venue_id: string,
  reserved_date: string,   // ISO date
  reserved_time: string,   // "20:00"
  party_size: number,
  guest_name: string,
  guest_email: string,
  guest_phone?: string,
  special_requests?: string,
  dietary?: string[]
}
//
// 1. Validate availability_slots (not blocked, within open hours)
// 2. Count existing reservations at requested time for this venue
//    → 409 if fully booked (no suitable table available)
// 3. SELECT table WHERE capacity >= party_size ORDER BY capacity ASC LIMIT 1
//    (smallest suitable table, fewest chairs wasted)
// 4. pg_advisory_xact_lock to serialize concurrent bookings for same venue+date+time
// 5. INSERT restaurant.reservations — UNIQUE constraint catches race
// 6. INSERT dietary_requirements if provided
// 7. Send confirmation email (via SendGrid or Supabase Edge Mail)
// 8. Return { success: true, data: { confirmation_code, reserved_date, reserved_time, table_number } }

// DELETE /functions/v1/restaurant-booking/:id
// Auth: Bearer JWT (user must be reservation owner OR venue owner)
// 1. Verify ownership
// 2. UPDATE reservations SET status='cancelled'
// 3. Notify restaurant owner via Supabase notification
// 4. If deposit paid: trigger partial refund (Phase 3.5+)
```

## UI widget in RestaurantDetail

Replaces current "Reserve" external link button:
1. Date picker (available dates highlighted; blocked dates greyed)
2. Time slot grid (available slots as buttons; full slots greyed out)
3. Party size selector (1–8)
4. Guest info form (name, email, phone, dietary checkboxes, special requests)
5. "Book Table" → calls edge fn → success: confirmation code + summary card
6. Loading + error states

## Availability check endpoint

```typescript
// GET /functions/v1/restaurant-booking/availability?venue_id=X&date=Y
// Returns: { slots: [{ time: "19:00", available_tables: 3 }, ...] }
// Used by UI to populate the time slot grid
```

## Acceptance Criteria

- [ ] Concurrent booking (2 simultaneous requests for last table) results in exactly 1 success + 1 409.
- [ ] `UNIQUE (table_id, reserved_date, reserved_time)` violation handled gracefully (409 to client).
- [ ] Availability check returns correct slot availability reflecting existing reservations.
- [ ] Confirmation email sent within 60s of successful booking.
- [ ] Owner dashboard (extend `/host/venue/:id`) shows reservations in real time via Realtime subscription.
- [ ] Anonymous booking (no JWT) works with `guest_email` as identity anchor.
- [ ] Cancel updates `status='cancelled'`; table becomes available again in availability check.
- [ ] `npm run lint` zero new errors; `npm run build` clean.

## See also

- [`033-ven-data-restaurant-reservations-schema.md`](./033-ven-data-restaurant-reservations-schema.md) — schema
- [`004-ticket-checkout-edge-fn.md`](./004-ticket-checkout-edge-fn.md) — parallel pattern (Stripe checkout with atomic capacity guard)
