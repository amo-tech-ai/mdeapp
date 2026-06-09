---
id: EVP-036-mvp
linear: SAN-139
tier: mvp
title: Community, map, and nearby intelligence
status: Open
priority: P2
depends_on: [EVP-016-mvp, EVP-024-mvp, EVP-032-mvp]
skill: [mde-maps, mde-task-lifecycle]
surfaces:
  - /events/[slug]
  - chat map
---

# EVP-036-mvp — Community, map, and nearby intelligence

## Objective

Make the event page Medellin-aware: neighborhood, map, weather/context, nearby cafes, rooftop/bar after-options, coworking, and pickup/safety notes where available.

## Real-world example

For an El Poblado networking event, mdeai shows nearby coffee before the event, a rooftop after-option, and a pickup point.

## User story

As a guest, I want to plan the whole night around the event, not just buy a ticket.

## Workflow

1. Event has venue/neighborhood/place ID.
2. Places enrichment fetches nearby context with field masks.
3. Detail page shows curated nearby cards.
4. Concierge can answer "Where should I go after?"

## Acceptance Criteria

- Event detail includes map section when coordinates/place ID exist.
- Nearby recommendations are source-labeled.
- Places API calls use required field masks.
- No exact secret venue reveal before registration when event requires gated location.
- Tests cover venue present, venue missing, and gated location states.
