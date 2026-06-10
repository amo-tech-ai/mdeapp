---
legacy_id: EVT-052
linear: SAN-511
linear_url: https://linear.app/sanjiovani/issue/SAN-511/evt-052-wire-request-proposal-modal
type: wireframe
id: VEB-W02
title: Request event proposal modal
persona: Roberto, Tourist
path: overlay on /chat
priority: P0
build_status: Not Started
paired_tasks: [VEB-005]
skill: [mde-wireframe, copilotkit-develop]
---

# Wireframe W02 — Request event proposal modal

> **Linear:** [EVT-052 — Request event proposal modal](https://linear.app/sanjiovani/issue/SAN-511/evt-052-wire-request-proposal-modal) · **Project:** [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues)

> **HITL:** CopilotKit `renderAndWaitForResponse` mirror of `requestEventVenueProposal` tool

## Modal layout

```text
┌─ Request event proposal ─────────────────────── [×] ─┐
│ Venue: Mamacita Medallo (locked)                     │
│                                                       │
│ Event type *                                          │
│ [ Birthday dinner          ▼ ]                        │
│                                                       │
│ Date *              Time *                            │
│ [ Jun 14, 2026 ]    [ 7:00 PM ]                       │
│                                                       │
│ Guest count *                                         │
│ [ 25                    ]                             │
│                                                       │
│ Budget (optional)                                     │
│ [ $500 – $800           ]                             │
│                                                       │
│ Notes                                                 │
│ ┌─────────────────────────────────────────────────┐  │
│ │ Need projector for short presentation           │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
│ WhatsApp number *                                     │
│ [ +57 300 …             ]  (from profile if set)      │
│                                                       │
│ ⓘ Request sent — we'll confirm by WhatsApp.           │
│    This is not an instant booking.                    │
│                                                       │
│ [ Cancel ]              [ Submit request ]            │
└───────────────────────────────────────────────────────┘
```

## Success state (after submit)

```text
┌─ Request received ───────────────────────────────────┐
│ ✓ We received your event proposal for Mamacita.      │
│   Patricia will review and contact the venue on        │
│   WhatsApp. You'll see status updates here.            │
│ [ Done ]                                               │
└────────────────────────────────────────────────────────┘
```

## States

| State | UI |
|-------|-----|
| Validation error | Inline field errors; Submit disabled until fixed |
| Submitting | Spinner on Submit; form disabled |
| Duplicate | "You already submitted for this date" (VEN-026) |
| Agent mode | Same form inside CopilotKit tool render |

## Forbidden copy

- ❌ "Booking confirmed"
- ❌ "Your table is reserved"
- ✅ "Request sent — we'll confirm by WhatsApp"

## testids

`proposal-modal` · `proposal-event-type` · `proposal-submit` · `proposal-success`
