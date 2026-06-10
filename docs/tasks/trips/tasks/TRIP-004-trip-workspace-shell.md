---
task_id: TRIP-004
title: Trip workspace shell (SCREEN-013)
layer: APP
priority: P0
phase: core
status: Not Started
estimated_effort: 3h
persona: Camila
depends_on: [TRIP-003]
unblocks: [TRIP-005, TRIP-008, TRIP-009]
skills: [copilotkit-develop, shadcn, mde-task-lifecycle]
screen_ids: [SCREEN-013]
wireframes:
  - ../wireframes/012-wire-trip-workspace.md
path: /trips/[id]
description: Harden workspace tabs shell; defer Mindtrip 3-panel chat split to POST-MVP.
---

# TRIP-004 — Trip workspace shell

## Current disk

✅ `app/trips/[id]/page.tsx`, `trip-workspace-view.tsx` — tabs Ideas/Itinerary/Map/Bookings  
✅ `load-trip-workspace.ts`

## Build scope

- Header: title, dates, destination, status, back link
- Tab a11y: `role="tablist"`, `aria-selected`
- Ideas + Bookings remain dashed stubs until TRIP-006/010
- Mobile: horizontal scroll tabs (wireframe)

## Acceptance criteria

- [ ] Owner GET `/trips/[id]` → 200
- [ ] Non-owner → 404
- [ ] `data-testid="trips-workspace"`, `trip-workspace-tabs`
- [ ] Tab switch without full page reload

## Do not do

- No Calendar / Media / Chats tabs (ADVANCED)
- No trip-scoped CopilotKit split layout MVP (single column OK)
