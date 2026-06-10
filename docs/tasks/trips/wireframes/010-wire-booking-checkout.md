---
type: wireframe
id: WIRE-006
number: "008"
title: Booking Checkout (modal)
persona: Andrés, Camila
path: modal
priority: P0
build_status: Done
screens:
  - 017-scr-schedule-viewing-modal.md
  - 010-scr-booking-checkout-modal.md
screen_ids:
  - SCREEN-008
  - SCREEN-009
skill:
  - mde-wireframe
---
# Wireframe: Booking Checkout (modal)

**Persona:** Andrés (tickets), Camila (stay Phase 2) · **Rule:** no external OTA

## Event ticket checkout (MVP)

```text
┌─ Book tickets — in-chat modal ────────────────── [×] ─┐
│ Salsa en Provenza · Fri Jun 14 9:00 PM               │
│ ───────────────────────────────────────────────────── │
│ General Admission  [- 1 +]     $25.00                 │
│ VIP              [- 0 +]     $45.00                 │
│ Subtotal                       $25.00                 │
│ Fees                            $2.50                 │
│ Total                          $27.50                 │
│ ───────────────────────────────────────────────────── │
│ [Continue to Stripe Checkout]                         │
│                                                       │
│ After pay: confirmation card in thread + itinerary    │
└───────────────────────────────────────────────────────┘
```

## Rental viewing (MVP — no payment)

```text
┌─ Schedule viewing ────────────────────────────── [×] ─┐
│ Laureles Walkable Studio (#1)                         │
│ Preferred dates: [Jun 12 ▼]  Time: [10:00 AM ▼]       │
│ Phone / WhatsApp: [+57 …        ]                     │
│ Note: "Interested in monthly rate"                   │
│ [Confirm request]  → leads + showings                 │
└───────────────────────────────────────────────────────┘
```

## Rental stay (Phase 2)

```text
Reserve → date range → guests → price breakdown → Stripe Connect → bookings row
```

## State machine

```text
draft → pending_payment → confirmed → cancelled
         ↓ webhook
      event_orders.status / bookings.status
```

## Post-confirm (AI follow-up)

```text
bookingAgent complete
  → confirmation generative card in chat
  → trip_items auto-added
  → concierge: "Want dinner nearby after the show?"
```

## Stripe

- Checkout Session from edge fn (never service role in browser)
- Webhook → finalize `event_orders` / `bookings`
- Return URL → same `/` thread with `?order=…`
