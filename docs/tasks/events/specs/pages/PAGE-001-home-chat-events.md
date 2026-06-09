---
id: PAGE-001
title: Home + chat event discovery
route: / , /chat
status: Live
persona: camila
screen: SCREEN-001
updated: 2026-06-08
implementation:
  pages:
    - mdeapp/src/app/page.tsx
    - mdeapp/src/app/chat/page.tsx
  shell: mdeapp/src/components/chat/geo-chat-shell.tsx
  cards: mdeapp/src/components/copilot/search-tool-renders.tsx
playwright: mdeapp/e2e/prod-synthetic-smoke.spec.ts (events vertical)
---

# PAGE-001 — Home & chat event discovery

## Purpose

Primary concierge surface; events appear as **tool-rendered cards** after `search_events`.

## Persona example

Camila on `/`: *salsa events this weekend in Medellín* → ≥1 `event-card`, map pins in `map-panel`.

## Layout

Three-column desktop: nav rail · chat · map/results. Mobile: chat + bottom sheet map.

## Components

`GeoChatShell`, `CopilotKit` provider, `EventCard`, `EventWebCitationFetch` (partial)

## Data

`POST /api/events/search`, Mastra `search_events`, optional `hybrid_search_events`

## States

| State | Behavior |
|-------|----------|
| Loading | CopilotKit in-progress |
| Clarify | Generic query → chips, no cards (SCREEN-006) |
| Results | Cards + pins |
| Error | Copilot run error banner |

## Mobile

Single column; map collapses; composer sticky bottom

## Accessibility

Chat regions labeled; cards keyboard selectable when pin sync on

## Test gaps

SCREEN-006 one failing test without dev server; prod synthetic events vertical

## Files touched (audit)

`page.tsx`, `chat/page.tsx`, `geo-chat-shell.tsx`, `search-tool-renders.tsx`, `event-card.tsx`

## Acceptance

- [x] Event cards in chat
- [x] Map pins after cards
- [ ] CK POST budget <8 per query
