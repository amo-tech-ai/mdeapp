---
type: wireframe
id: WIRE-021
number: "021"
title: Bookings Inbox
persona: Camila
path: /bookings
priority: P1
build_status: Frozen
screens:
  []
screen_ids:
  []
skill:
  - mde-wireframe
phase: Phase 5+
---
# Wireframe: Bookings Inbox

**Source:** legacy `Bookings.tsx`  
**Persona:** Camila, Andrés · **Path:** `/bookings` · **Auth:** required

> Mindtrip weak spot — no unified inbox. mdeai differentiator.

## Desktop

```text
┌─────────────────────────────────────────────────────────────────┐
│ Bookings & reservations                                         │
│ [Upcoming*] [Past] [Cancelled]     Filter: [All types ▼]        │
├─────────────────────────────────────────────────────────────────┤
│ ┌─ Jun 14 ────────────────────────────────────────────────────┐ │
│ │ 🎫 Salsa en Provenza · 9:00 PM        Confirmed · [QR]      │ │
│ │ 🏠 Viewing · Laureles #1 · 10:00 AM   Pending landlord      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─ Jun 15 ────────────────────────────────────────────────────┐ │
│ │ 🍽 Carmen · 8:00 PM                   Requested             │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Booking card actions

| Type | Actions |
|------|---------|
| Event ticket | View QR · Cancel (policy) · Add to calendar |
| Rental viewing | Reschedule · Cancel · Open chat |
| Restaurant (P2) | Modify · Cancel |

## Link to trip workspace

Each row → `[View in trip "June Medellín"]` opens [18-trip-workspace.md](18-trip-workspace.md) Bookings tab.

## Right panel tab mirror

Same data as **Bookings** tab in trip workspace — single source `bookings` + `event_orders` + `leads` (viewings).

## Empty state

```text
No bookings yet — find events in chat or browse /events
[Open chat]
```

## Data

`bookings`, `event_orders`, `leads`, `showings` (Phase 2)

## Phase 2

Email receipt forward → parse → auto row (Mindtrip receipts moat)
