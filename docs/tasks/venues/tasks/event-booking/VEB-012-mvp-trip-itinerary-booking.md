---
legacy_id: EVT-044
linear: SAN-503
linear_url: https://linear.app/sanjiovani/issue/SAN-503/evt-044-add-confirmed-booking-to-trip
task_id: veb-012-mvp
tier: mvp
title: Add confirmed event booking to trip itinerary
layer: UI
priority: P2
status: Not Started
estimated_effort: 1 day
depends_on: [veb-010]
unblocks: []
skills: [copilotkit-develop, mde-supabase]
description: Journey C — when booking confirmed, add row to user trip with venue, date, map link; suggest nearby events.
---

# VEB-012-mvp — Trip itinerary booking integration

## Disk reality (2026-06-02)

**Not on disk.** **Blocked by:** VEB-010 confirmed booking row.

## At a glance

| | |
|---|---|
| **Linear** | [EVT-044 — Add confirmed event booking to trip itinerary](https://linear.app/sanjiovani/issue/SAN-503/evt-044-add-confirmed-booking-to-trip) · [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) |
| **For** | Tourist (Journey C) |
| **Surface** | Trip planner + `/chat` |
| **Layer** | UI + data |

## What we're building

When `venue_booking_requests.status=confirmed`, offer **Add to trip** and show in itinerary alongside restaurants, events, rentals.

## User journey (Journey C)

1. Tourist requests birthday dinner at Mamacita → confirmed.
2. System suggests: "Salsa event nearby Friday" (EVP-036 pattern).
3. User adds both to **Medellín Night** trip.
4. WhatsApp reminder before event date (future VEB-014).

## Data

| Table / field | Purpose |
|---------------|---------|
| `trip_items` (or existing trips model) | `kind=venue_booking`, `ref_id=request_id` |
| Geo | lat/lng from venue for map day view |

## Agents

| Agent | Job |
|-------|-----|
| `tripAgent` | Append booking to active trip |
| `conciergeAgent` | Cross-sell nearby ticketed events |

## Acceptance criteria

- [ ] **Add to trip** CTA on confirmed booking chip
- [ ] Trip row shows venue name, date, time, map link
- [ ] Removing trip item does not cancel booking
- [ ] Optional: suggest 1 nearby event (feature flag)

## Related

- [`venues-booking.md`](../../docs/venues-booking.md) Journey C
- [`EVP-036`](../../../events/tasks/EVP-036-mvp-community-map-nearby.md)
