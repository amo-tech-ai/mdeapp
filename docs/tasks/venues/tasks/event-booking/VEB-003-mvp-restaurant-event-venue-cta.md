---
legacy_id: EVT-035
linear: SAN-494
linear_url: https://linear.app/sanjiovani/issue/SAN-494/evt-035-restaurant-card-event-venue-cta
task_id: veb-003-mvp
tier: mvp
title: Restaurant card Event Venue CTA + badge
layer: UI
priority: P0
status: Not Started
estimated_effort: 4h
depends_on: [ven-009, ven-010, veb-002]
unblocks: [veb-004]
skills: [shadcn, copilotkit-develop, mde-wireframe]
wireframe: ./wireframes/VEB-W01-wire-event-offerings-panel.md
description: Add Event Venue button and Hosts Events badge when accepts_event_bookings=true.
---

# VEB-003-mvp — Restaurant card Event Venue CTA

## Disk reality (2026-06-02)

**Not on disk.** No `accepts_event_bookings`, `Hosts Events`, or Event Venue CTA in `restaurant-card.tsx`. **Depends:** VEB-002 seed + VEN-009/010 ✅.

## At a glance

| | |
|---|---|
| **Linear** | [EVT-035 — Restaurant card Event Venue CTA + badge](https://linear.app/sanjiovani/issue/SAN-494/evt-035-restaurant-card-event-venue-cta) · [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) |
| **For** | Carlos (partner), Tourist, Roberto |
| **Surface** | `/chat` restaurant result card + detail panel |
| **Screen to design** | Extends VEN-009 card — see W01 entry CTA |

## What we're building

Upgrade restaurant card from `[ Details ]` only to:

```text
[ Details ]  [ Event Venue ]
🎉 Hosts Events   (badge when accepts_event_bookings)
```

Button **hidden** when `accepts_event_bookings=false`.

## User journey (Journey A)

1. User sees Mamacita in restaurant search results.
2. Badge **Hosts Events** visible on card.
3. User taps **Event Venue** → opens offerings panel (VEB-004).
4. **Details** still opens normal restaurant panel (hours, menu context).

## Component changes

| File (expected) | Change |
|-----------------|--------|
| `RestaurantResultCard` | Badge + second CTA |
| `RestaurantDetailPanel` | Optional inline "Plan an event here" link |
| Types | `accepts_event_bookings` on card props |

## Agents & tools

No new tools — UI reads Supabase/Places-enriched card payload from existing search tools.

## Acceptance criteria

- [ ] CTA visible only when `accepts_event_bookings=true`
- [ ] Badge does not show on non-event restaurants
- [ ] Click opens offerings panel (stub OK until VEB-004)
- [ ] Mobile + desktop layouts match W01 ASCII
- [ ] `data-testid="event-venue-cta"` for Playwright

## Wireframe

[`VEB-W01`](./wireframes/VEB-W01-wire-event-offerings-panel.md) — card row + badge placement.

## Related

- [`VEN-009`](../mvp/009-ven-restaurant-result-card.md)
- [`venues-booking.md`](../../docs/venues-booking.md) §3
