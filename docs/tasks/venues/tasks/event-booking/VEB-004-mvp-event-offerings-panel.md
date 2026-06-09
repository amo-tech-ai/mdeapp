---
legacy_id: EVT-036
linear: SAN-495
linear_url: https://linear.app/sanjiovani/issue/SAN-495/evt-036-event-offerings-detail-panel
task_id: veb-004-mvp
tier: mvp
title: Event offerings detail panel
layer: UI
priority: P0
status: Not Started
estimated_effort: 1 day
depends_on: [veb-003]
unblocks: [veb-005]
skills: [shadcn, copilotkit-develop, mde-maps, mde-wireframe]
wireframe: ./wireframes/VEB-W01-wire-event-offerings-panel.md
description: Right-column panel — capacity, packages, amenities, map context, Request proposal CTA.
---

# VEB-004-mvp — Event offerings detail panel

## Disk reality (2026-06-02)

**Not on disk.** **Blocked by:** VEB-001 schema, VEB-003 CTA.

## At a glance

| | |
|---|---|
| **Linear** | [EVT-036 — Event offerings detail panel](https://linear.app/sanjiovani/issue/SAN-495/evt-036-event-offerings-detail-panel) · [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) |
| **For** | Roberto, Tourist, Carlos |
| **Surface** | `/chat` right column (same shell as restaurant detail) |
| **Screen to design** | **W01** — full panel spec |

## What we're building

When user clicks **Event Venue**, show structured offerings — **all facts from Supabase/Places**, Gemini explains only from tool data.

## Panel sections

| Section | Source | Example |
|---------|--------|---------|
| Hero + name | `venues` | Mamacita Medallo |
| Event types | `venue_event_offerings` | Birthdays, AI meetups |
| Capacity | offerings | Seated 60 · Standing 120 |
| Spaces | offerings | Rooftop, private room |
| Amenities | offerings | DJ, projector, WiFi |
| Packages | `venue_event_packages` | $25/person dinner |
| Best for / Not ideal | offerings | Networking · Not large concerts |
| Map context | Places (field mask) | Parking, hotels nearby |
| CTA | — | **Request event proposal** |

## User journey

1. User opens Event Venue from card.
2. Scrolls packages and capacity.
3. Taps **Request event proposal** → VEB-005 modal.

## Layout (ASCII — full wireframe in W01)

```text
┌─ Event venue — Mamacita ─────────────────── [×] ─┐
│ 🎉 Hosts Events · Provenza · $$$                    │
│ ┌─ gallery / map mini ─────────────────────────┐   │
│ └──────────────────────────────────────────────┘   │
│ Capacity: 60 seated · 120 standing                 │
│ Spaces: Rooftop · Private room                     │
│ Packages: Birthday dinner from $25/person          │
│ Amenities: DJ · Projector · WiFi                   │
│ Best for: Networking · Birthdays                   │
│ Map: Parking · Hotels nearby [pin on map]          │
│ [ Request event proposal ]                         │
└────────────────────────────────────────────────────┘
```

## Agents & tools

| Tool | Role |
|------|------|
| `getEventVenueOfferings` | Fetch offerings by `venue_id` |
| Places detail | Enrich map context (cached) |

## Acceptance criteria

- [ ] All numeric/text fields from DB — no LLM-invented capacity
- [ ] Empty state when offerings missing ("Contact us for custom events")
- [ ] Map pin syncs with chat map (F50 pattern)
- [ ] Places calls use `X-Goog-FieldMask`
- [ ] Loading skeleton + error retry states

## Wireframe

[`VEB-W01`](./wireframes/VEB-W01-wire-event-offerings-panel.md)
