---
task_id: TRIP-009
title: Conflict detection persist + CopilotKit HITL
layer: APP + AGENT
priority: P1
phase: mvp
status: Not Started
estimated_effort: 5h
persona: Camila
depends_on: [TRIP-005]
unblocks: [TRIP-011]
skills: [copilotkit, copilotkit-agui, mastra, mde-supabase]
wireframes:
  - ../wireframes/013-wire-itinerary-planner.md
description: Persist time overlaps to conflict_resolutions; HITL card to pick resolution; document timezone and travel-buffer limits.
---

# TRIP-009 — Conflict persist + HITL

## Current disk

✅ Client `detectScheduleOverlaps` in `itinerary-logic.ts`  
✅ `conflict_resolutions` table + RLS  
❌ No persist on detect; no HITL card

## Build scope

### Server

- On overlap detect (or on insert via TRIP-007): upsert `conflict_resolutions` row
- `affected_items` JSON: `[{ trip_item_id, start_at, end_at }]`
- Status: `detected` → `resolved`
- Normalize `start_at` / `end_at` as absolute timestamps; display in trip/profile timezone only
- Treat cross-midnight windows as one absolute interval, not two naive date buckets
- Persist a `metadata.conflict_version` so future resolver changes do not reinterpret old rows silently

### CopilotKit

- `useCopilotAction` + `renderAndWaitForResponse` — conflict card
- Options: move item A, move item B, dismiss
- User pick → update `trip_items.start_at` / `end_at` + mark resolution

### Mastra

- No new `timelineAgent` for MVP. Add a scoped `create_conflict_resolution` / `resolve_trip_conflict` tool to the existing concierge/trip tool surface.
- Gemini proposes options only; Supabase writes remain deterministic and user-approved.

## Acceptance criteria

- [ ] Overlap shows banner + persisted row
- [ ] HITL card resolves without silent AI write
- [ ] `data-testid="itinerary-conflict"` on banner
- [ ] Unit test: overlap detection unchanged
- [ ] Tests cover timezone-normalized same-day, cross-midnight, and DST-adjacent fixture timestamps
- [ ] Known limitation documented: travel-time conflicts are advisory until TRIP-016/MAP-011 route cache lands

## POST-MVP

- Server-side conflict RPC on insert (audit recommendation)
- Travel-buffer scoring using route estimates / `route_cache`

## Do not do

- Auto-reschedule without user approval
