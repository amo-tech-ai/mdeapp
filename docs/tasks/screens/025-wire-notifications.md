---
type: wireframe
id: WIRE-025
number: "025"
title: Notifications
persona: Camila
path: /notifications
priority: P2
build_status: Deferred
screens:
  []
screen_ids:
  []
skill:
  - mde-wireframe
phase: Phase 2+
---
# Wireframe: Notifications

**Source:** legacy `Notifications.tsx` · Mindtrip `11-updates-notifications.png`  
**Persona:** Camila · **Path:** `/notifications` or nav **Updates** drawer · **Auth:** required · **P2**

## Desktop — full page

```text
┌─────────────────────────────────────────────────────────────────┐
│ Notifications                    [Mark all read] [Settings ⚙]   │
│ [All*] [@mentions] [Actions]     ☐ Unreads only               │
├─────────────────────────────────────────────────────────────────┤
│ ● Viewing confirmed — Laureles #1 · Sat 10:00 AM    2h ago     │
│   [Open booking] [Add to calendar]                              │
│ ○ Trip starts in 3 days — "Move to Laureles"        1d ago     │
│ ○ Budget alert — 70% of trip budget used            2d ago     │
│ ○ Empty itinerary — Jun 15 has no plans             3d ago     │
└─────────────────────────────────────────────────────────────────┘
```

## Nav drawer (Mindtrip pattern)

Same content in left nav overlay — badge count on Updates icon.

## Empty state

```text
No updates yet — create a trip or schedule a viewing to get started
[Create trip]
```

## Notification types (legacy)

| Type | Trigger |
|------|---------|
| Booking confirmed | `event_orders` / `leads` |
| Trip start reminder | cron · `trips.start_date` |
| Budget warning | `budget_tracking` |
| Empty day | `proactive_suggestions` |
| Landlord reply | Phase 2 · `landlord_inbox` |

## Realtime

Supabase channel `notifications:user_id` → toast + badge increment

## Data

`notifications`, `proactive_suggestions`, `notification_queue` (Phase 2)
