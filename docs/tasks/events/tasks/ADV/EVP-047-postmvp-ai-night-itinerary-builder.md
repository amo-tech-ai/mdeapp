---
id: EVP-047-postmvp
linear: SAN-150
tier: post-mvp
title: AI night itinerary builder
status: Open
priority: P2
depends_on: [EVP-036-mvp, EVP-037-mvp, EVP-043-mvp]
skill: [mde-maps, mastra, copilotkit, mde-task-lifecycle]
surfaces:
  - /
  - /events/[slug]
  - /trips
---

# EVP-047-postmvp — AI night itinerary builder

## Objective

Build full-night plans around an event: before-event work/cafe/dinner, route to venue, event attendance, after-event rooftops/salsa/late food, and save-to-trip.

## Real-world example

Camila asks, "Plan my Thursday around Visionarios Night." mdeai suggests coworking in Provenza, dinner nearby, the event, and a rooftop afterparty option with route timing.

## User story

As a guest, I want one concierge plan for the whole night, not separate searches for food, transit, and events.

## Workflow

1. User selects event or asks for a night plan.
2. Mastra gathers event, map, Places, schedule, weather, and user preference context.
3. AI proposes itinerary slots with alternatives.
4. User saves to trip or adjusts in chat.

## Acceptance Criteria

- Itinerary uses deterministic event time and location.
- Nearby suggestions are source-labeled.
- Routes/weather failures degrade gracefully.
- User can save itinerary to Trips.
- Tests cover before/during/after slots and conflicting event times.
