---
legacy_id: EVT-043
linear: SAN-502
linear_url: https://linear.app/sanjiovani/issue/SAN-502/evt-043-patricia-admin-queue-event-requests
task_id: veb-011-mvp
tier: mvp
title: Admin event booking queue (Patricia)
layer: UI
priority: P1
status: Not Started
estimated_effort: 1 day
depends_on: [veb-010, ven-024]
unblocks: [veb-013, veb-014, veb-015]
skills: [shadcn, mde-supabase, mde-wireframe]
wireframe: ./wireframes/VEB-W05-wire-admin-event-booking-queue.md
description: Extend /admin/bookings with event proposal filter — review WA draft, approve, edit, send.
---

# VEB-011-mvp — Admin event booking queue

## Disk reality (2026-06-02)

**Not on disk.** **Blocked by:** VEB-010, VEN-024 admin policies.

## At a glance

| | |
|---|---|
| **Linear** | [EVT-043 — Admin event booking queue (Patricia)](https://linear.app/sanjiovani/issue/SAN-502/evt-043-patricia-admin-queue-event-requests) · [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) |
| **For** | Patricia |
| **Surface** | `/admin/bookings` |
| **Screen to design** | **W05** |

## What we're building

Patricia reviews **event proposals** separately from café dinner requests — same outbox pattern (VEN-023), filtered view.

## Queue columns

| Column | Source |
|--------|--------|
| Request ID | `venue_booking_requests.id` |
| Venue | `venues.name` |
| Event type | `event_type` |
| Date / guests | `event_date`, `guest_count` |
| User | profile |
| Status | pending / sent / confirmed |
| WA draft | editable textarea |
| Actions | Approve · Edit · Reject · Send |

## User journey

1. Roberto submits proposal → row appears as **pending**.
2. Patricia opens queue → reviews AI WhatsApp draft.
3. Patricia edits copy → **Approve & send** → `wa_outbox`.
4. Status → **sent**; user sees chip update.

## Security

- Admin role only (RLS + route guard)
- Audit log link (VEN-030)
- WA consent check (VEN-027)

## Acceptance criteria

- [ ] Filter tab: **Event proposals** vs **Table requests**
- [ ] Edit draft before send — no auto-send
- [ ] Reject requires reason stored
- [ ] Links to venue offerings for context
- [ ] Mobile-usable for Patricia on phone

## Wireframe

[`VEB-W05`](./wireframes/VEB-W05-wire-admin-event-booking-queue.md)

## Related

- [`VEN-024`](../mvp/024-ven-admin-booking-queue.md)
