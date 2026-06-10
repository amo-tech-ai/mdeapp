---
task_id: TRIP-007
title: Add-to-trip from rental/event cards
layer: APP + AGENT
priority: P1
phase: mvp
status: Not Started
estimated_effort: 6h
persona: Camila
depends_on: [TRIP-006, data-027]
unblocks: [TRIP-010, TRIP-019]
skills: [copilotkit, copilotkit-develop, copilotkit-integrations, mastra, mde-supabase]
related:
  - ../../real-estate/INDEX.md
  - ../../events/docs/events-prd.md
description: Add-to-trip modal + Mastra tool + CopilotKit action; hydrate snapshot fields on insert.
---

# TRIP-007 — Add-to-trip from cards

## Goal

Camila hearts a rental or event → picks active trip → `trip_items` row with title/lat/lng copied from source.

## Build scope

### UI

- **Create** `components/trips/add-to-trip-modal.tsx`
- Trip picker (user's active trips)
- Optional schedule: `start_at` / `end_at`
- Entry points: rental card, event card, saved collection row
- Optimistic state: pending button/row, rollback on failed insert, retry toast, and duplicate-click lock

### Mastra

- **Create** `src/mastra/tools/add-trip-item.ts`
- **Create** `src/mastra/tools/create-trip.ts` (optional)
- User-scoped Supabase client (JWT) — **no service role**
- Zod: `item_type`, `source_id`, `trip_id`, schedule
- Respect `unique_trip_item` — upsert or friendly error

### CopilotKit

- `useCopilotAction` mirror: `add_to_trip` with `available: "disabled"` + render card
- `useCopilotReadable` trip list on workspace page (TRIP-004+)

## Acceptance criteria

- [ ] Insert creates row visible on itinerary tab
- [ ] Duplicate add blocked by unique index
- [ ] `title`, `latitude`, `longitude` populated from source entity
- [ ] Agent name matches Mastra registry key
- [ ] Failed insert rolls back any optimistic "saved" UI and shows retry path
- [ ] Double-click cannot create duplicate pending requests

## Dependencies

- **data-027** — extended `item_type` CHECK + RPC optional
- Rental save CTA from real-estate screens
- **TRIP-019** hardens retry/rollback across cards after this task lands

## Do not do

- Gemini must not invent schedule or booking status
