---
task_id: TRIP-003
title: Create trip modal + server action
layer: APP
priority: P0
phase: core
status: Not Started
estimated_effort: 4h
persona: Camila
depends_on: [TRIP-002]
unblocks: [TRIP-004]
skills: [copilotkit-develop, shadcn, mde-supabase, mde-task-lifecycle]
wireframes:
  - ../wireframes/012-wire-trips-dashboard.md
path: /trips
description: Modal to insert trips row; optional budget_tracking; redirect to workspace.
---

# TRIP-003 — Create trip modal

## Wireframe

Title, destination, dates, travelers (metadata), budget + currency → `trips` insert.

## Build scope

### Frontend

- **Create** `components/trips/create-trip-modal.tsx`
- Trigger from TRIP-002 `[+ New trip]`
- Zod validate: title, start_date ≤ end_date

### Server

- **Create** `app/trips/actions/create-trip.ts` (server action)
- Insert `trips` with `user_id = auth.uid()`
- Optional: insert `budget_tracking` when budget provided
- Redirect to `/trips/[id]`

### CopilotKit / Mastra

- Defer `create_trip` tool to TRIP-007 batch (optional parallel)

## Acceptance criteria

- [ ] Modal creates trip; appears on dashboard
- [ ] RLS: cannot insert for another user
- [ ] Invalid dates rejected
- [ ] Browser proof + screenshot

## Do not do

- No `mastra_threads` link required MVP (metadata trip_id POST-MVP)
