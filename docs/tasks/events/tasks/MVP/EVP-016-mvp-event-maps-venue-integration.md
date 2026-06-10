---
id: EVP-016-mvp
linear: SAN-120
legacy_id: EVT-MVP-03
title: Event maps + venue integration
status: Not Started
priority: P1
persona: Roberto, Camila, Tourist
depends_on:
  - EVP-015-mvp
  - MAP-004
  - MAP-010
related:
  - /home/sk/mdeai/tasks/maps/INDEX.md
---

# EVP-016-mvp — Event maps + venue integration

## Objective

Connect event discovery, event detail, and host event creation to a consistent map/venue model. Event cards should focus pins; venue selection should preserve place ID and coordinates when available.

## Scope

| Capability | MVP behavior |
|---|---|
| Event pins | Published events with coordinates render as category markers. |
| Card-to-pin sync | Event card focus moves map camera and highlights marker. |
| Venue display | Event detail shows venue name/address/map link. |
| Host venue binding | Roberto can attach a text venue now and a Places-backed venue when MAP-010 is ready. |
| Places cost control | Places API New calls use field masks and cache. |

## Files/modules

- `src/components/chat/event-results-panel.tsx`
- `src/components/chat/chat-map-panel.tsx`
- `src/components/copilot/event-card.tsx`
- `src/components/maps/*`
- `src/platform/maps/*`
- `src/lib/maps-deep-links.ts`
- `src/mastra/lib/google-places-client.ts`

## Acceptance criteria

- Event results with coordinates create map pins.
- Selecting an event card focuses the correct pin.
- Event detail includes a Google Maps CTA when venue location exists.
- Host wizard does not require Places to publish MVP events.
- Places-backed venue binding is gated behind MAP-010 and uses field masks.
- Mobile map sheet and desktop map panel both pass Playwright proof.
