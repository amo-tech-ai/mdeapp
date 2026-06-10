---
legacy_id: EVT-055
linear: SAN-514
linear_url: https://linear.app/sanjiovani/issue/SAN-514/evt-055-wire-admin-event-booking-queue
type: wireframe
id: VEB-W05
title: Admin event booking queue
persona: Patricia
path: /admin/bookings
priority: P1
build_status: Not Started
paired_tasks: [VEB-011]
skill: [mde-wireframe]
---

# Wireframe W05 — Admin event booking queue

> **Linear:** [EVT-055 — Admin event booking queue](https://linear.app/sanjiovani/issue/SAN-514/evt-055-wire-admin-event-booking-queue) · **Project:** [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues)

> **Extends:** VEN-024 admin queue with **Event proposals** tab

## Page layout

```text
┌─ Admin — Bookings ─────────────────────────────────────────────────┐
│ [ All ] [ Event proposals * ] [ Table requests ] [ Café ]           │
│                                                                      │
│ Filter: Status [ Pending ▼ ]  Date range [____]  Search [____]     │
│                                                                      │
│ ┌────────────────────────────────────────────────────────────────┐  │
│ │ ID      Venue        Event      Date    Guests  User    Status │  │
│ │ VBR-42  Mamacita     Birthday   Jun 14  25      roberto pending│  │
│ │ VBR-41  Rooftop      Launch     Jun 20  80      camila  pending│  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ Selected: VBR-42                                                     │
│ ┌─ Detail ───────────────────────────────────────────────────────┐  │
│ │ Venue: Mamacita · [View offerings]                              │  │
│ │ Event: Birthday dinner · Jun 14 7pm · 25 guests · $500-800      │  │
│ │ Notes: Need projector                                             │  │
│ │                                                                   │  │
│ │ WhatsApp draft (editable):                                        │  │
│ │ ┌─────────────────────────────────────────────────────────────┐  │  │
│ │ │ Hola Mamacita — solicitud de evento para 25 personas...     │  │  │
│ │ └─────────────────────────────────────────────────────────────┘  │  │
│ │ [ Regenerate draft ]                                              │  │
│ │                                                                   │  │
│ │ [ Reject ]  [ Save draft ]  [ Approve & send WhatsApp ]           │  │
│ └───────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

## Status chips (Patricia view)

| Status | Color | Action available |
|--------|-------|------------------|
| pending | yellow | Approve / Reject |
| sent | blue | Mark confirmed / needs_user |
| confirmed | green | Archive |
| cancelled | gray | — |

## Security note

Route guard: admin role only. All send actions write to `wa_outbox` — never direct Twilio from browser.

## testids

`admin-bookings-tab-event` · `booking-row` · `wa-draft-textarea` · `approve-send-btn`
