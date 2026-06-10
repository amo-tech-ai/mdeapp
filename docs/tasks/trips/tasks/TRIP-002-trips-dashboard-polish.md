---
task_id: TRIP-002
title: Trips dashboard polish (SCREEN-012)
layer: APP
priority: P0
phase: core
status: Not Started
estimated_effort: 4h
persona: Camila
depends_on: [TRIP-001, AUTH-003]
unblocks: [TRIP-003]
skills: [copilotkit-develop, shadcn, mde-task-lifecycle, task-verifier]
screen_ids: [SCREEN-012]
wireframes:
  - ../wireframes/012-wire-trips-dashboard.md
  - ../wireframes/012-scr-trips-dashboard.md
path: /trips
description: Polish existing dashboard — status groups, counts, empty states per wireframe.
---

# TRIP-002 — `/trips` dashboard polish

## Current disk

✅ `mdeapp/src/app/trips/page.tsx` — auth, empty states, grid  
✅ `trips-dashboard-grid.tsx`, `load-user-trips.ts`

## Build scope

### Frontend

- Status sections: Active / Planning / Archived (filter `trips.status`)
- Card summary: date range, item count, budget snippet when `budget_tracking` exists
- `[+ New trip]` button placeholder → TRIP-003 wires modal
- `data-testid="trips-dashboard"` ✅ keep

### Supabase

- Read-only `trips` + `trip_items(count)` — already in loader

## Acceptance criteria

- [ ] Authenticated user sees own trips grouped by status
- [ ] Empty state + "Start in chat" CTA
- [ ] Card links to `/trips/[id]`
- [ ] Logged-out → sign-in prompt (or AUTH-003 redirect)
- [ ] `npm run floor` exit 0

## Tests

- [ ] Unit: `formatTripDateRange` (exists)
- [ ] Playwright: `e2e/screens/SCREEN-012-trips.spec.ts` (create in TRIP-011 if not here)

## Do not do

- No create modal (TRIP-003)
- No `trip_days` table
