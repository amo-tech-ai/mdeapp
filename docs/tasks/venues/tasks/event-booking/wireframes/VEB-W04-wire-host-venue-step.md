---
legacy_id: EVT-054
linear: SAN-513
linear_url: https://linear.app/sanjiovani/issue/SAN-513/evt-054-wire-host-wizard-venue-step
type: wireframe
id: VEB-W04
title: Host event wizard — venue step
persona: Roberto
path: /host/event/new
priority: P1
build_status: Not Started
paired_tasks: [VEB-009]
paired_wire: ../../../events/wireframes/004-wire-host-event-wizard.md
skill: [mde-wireframe]
---

# Wireframe W04 — Host wizard venue step

> **Linear:** [EVT-054 — Host event wizard — venue step](https://linear.app/sanjiovani/issue/SAN-513/evt-054-wire-host-wizard-venue-step) · **Project:** [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues)

> **Extends:** [events 004-wire-host-event-wizard](../../../events/wireframes/004-wire-host-event-wizard.md)

## Workflow strip (updated)

```text
Basics ✓  →  Venue ●  →  Tickets ○  →  Preview ○
```

## Venue step — chat + suggestions

```text
┌────────────┬──────────────────────────────────────────────────────┐
│ Host nav   │ Create event — Roberto                               │
│            │ ┌─ Workflow strip ─────────────────────────────────┐ │
│            │ │ Basics ✓ → Venue ● → Tickets ○ → Preview ○       │ │
│            │ └──────────────────────────────────────────────────┘ │
│            │ CopilotChat — hostEventAgent                         │
│            │ ROBERTO: "200 cap startup mixer, Provenza, Mar 15"   │
│            │ ASSIST: Here are event venues that fit:              │
│            │                                                       │
│            │ ┌─ Suggested venue ───────────────── 92% fit ──────┐ │
│            │ │ Mamacita · 120 standing · from $25/p           │ │
│            │ │ [ Select venue ] [ View offerings ]              │ │
│            │ └────────────────────────────────────────────────┘ │
│            │ ┌─ Suggested venue ───────────────── 85% fit ──────┐ │
│            │ │ Rooftop Provenza · 80 standing                   │ │
│            │ │ [ Select venue ]                                 │ │
│            │ └────────────────────────────────────────────────┘ │
│            │                                                       │
│            │ Or search Places: [________________] [Search]        │
│            │                                                       │
│            │ ┌─ Live preview ─────────────────────────────────┐ │
│            │ │ Startup Mixer · Mar 15 · Mamacita · 200 cap    │ │
│            │ │ [mini map pin]                                  │ │
│            │ │ ☐ Also request venue hold (WhatsApp)           │ │
│            │ └────────────────────────────────────────────────┘ │
└────────────┴──────────────────────────────────────────────────────┘
```

## Optional hold checkbox

When checked, completing venue step triggers VEB-010 workflow (proposal) linked to `event_draft_id`.

## Mobile

- Workflow strip scrolls horizontally
- Venue cards stack vertically

## testids

`host-venue-step` · `suggest-venue-card` · `select-venue-btn` · `venue-hold-checkbox`
