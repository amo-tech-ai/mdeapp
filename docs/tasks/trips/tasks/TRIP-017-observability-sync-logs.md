---
task_id: TRIP-017
title: Trips observability + sync logs
layer: OPS + APP + EDGE
priority: P1
phase: hardening
status: Not Started
estimated_effort: 4h
persona: Patricia, Sofia
depends_on: [TRIP-010, TRIP-013, TRIP-009]
unblocks: [TRIP-012]
skills: [mde-supabase, mastra, mde-task-lifecycle]
description: Add traceable logs for trip sync failures, conflict resolutions, and agent tool calls without overbuilding analytics tables.
---

# TRIP-017 — Trips observability + sync logs

## Goal

When Roberto's buyer says "I paid but it is not in my trip," Patricia needs a trace id and repair status, not a guess.

## Build scope

- Structured logs for TRIP-010 webhook mirror attempts and TRIP-013 repair runs.
- Include `trip_id`, `order_id`/`showing_id`, `source_id`, `webhook_event_id`, and sanitized `trace_id`.
- Log conflict detect/resolve events with `conflict_resolutions.id`.
- Log trip tool calls through existing `ai_runs`/Mastra audit path where agent tools are involved.
- Add a small admin/debug query or documented Supabase log search, not a new dashboard unless Patricia's W8 admin scope owns it.

## Acceptance criteria

- [ ] Failed trip mirror produces a searchable structured log.
- [ ] Repair run logs inspected/inserted/skipped/repaired counts.
- [ ] Agent tool call that mutates trip state is traceable to `ai_runs` or explicit audit log.
- [ ] Evidence file: `tasks/trips/evidence/TRIP-017-observability.md`.

## Tests

- Trigger a controlled mirror failure in test/dev and capture sanitized log.
- Run repair worker and capture count log.
- Verify no service-role key is exposed to client code.

## Do not do

- Do not create `trip_sync_failures`, `trip_conflict_events`, or `agent_tool_calls` tables unless a separate data audit proves existing logs are insufficient.
