---
task_id: TRIP-005
title: Itinerary tab hardening
layer: APP
priority: P1
phase: core
status: Not Started
estimated_effort: 3h
persona: Camila
depends_on: [TRIP-004]
unblocks: [TRIP-008, TRIP-009, TRIP-006]
skills: [mde-task-lifecycle, testing]
wireframes:
  - ../wireframes/013-wire-itinerary-planner.md
path: /trips/[id]
description: Day groups, conflict banner, UP NEXT strip — extend existing itinerary-logic.
---

# TRIP-005 — Itinerary tab hardening

## Current disk

✅ `itinerary-logic.ts` — `groupTripItemsByDay`, `detectScheduleOverlaps`  
✅ `itinerary-panel.tsx` — conflict banner, day groups  
✅ `__tests__/itinerary-logic.test.ts`

## Build scope

- "UP NEXT" section: first future item across groups
- Item type badges (`itemTypeLabel`)
- Load `conflict_resolutions` from DB (already in loader) — surface in banner when stored
- Budget line stub → wire TRIP-010+ / budget_tracking POST-MVP

## Acceptance criteria

- [ ] Items group by `start_at` local day
- [ ] Overlap banner when client detect finds conflicts
- [ ] Empty itinerary state with CTA
- [ ] Unit tests pass: `npm test itinerary-logic`

## Do not do

- No `timeline_events` table
- No drag reorder (POST-MVP)
