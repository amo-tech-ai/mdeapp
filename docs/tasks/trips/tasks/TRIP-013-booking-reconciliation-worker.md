---
task_id: TRIP-013
title: Booking reconciliation repair worker
layer: DATA + EDGE + OPS
priority: P0
phase: hardening
status: Not Started
estimated_effort: 5h
persona: Camila, Andres, Patricia
depends_on: [TRIP-010, data-028]
unblocks: [TRIP-012, TRIP-017]
skills: [mde-supabase, mde-stripe, mde-task-lifecycle, task-verifier]
description: Lightweight pg_cron backstop that repairs paid/scheduled commerce rows missing trip_items mirrors.
---

# TRIP-013 — Booking reconciliation repair worker

## Goal

If Andres pays for a ticket with a `trip_id` and the primary webhook path misses the `trip_items` mirror, Camila's itinerary must self-heal without asking support to inspect Stripe by hand.

## Build scope

- Add or verify `repair_missing_trip_items()` as a deterministic Postgres function or edge-invoked routine.
- Schedule it every 15 minutes with installed `pg_cron` only after TRIP-001 evidence confirms required columns and permissions.
- Scan paid `event_orders` and confirmed `showings` with known `trip_id` metadata/FK and no matching `unique_trip_item`.
- Upsert missing `trip_items` using the same snapshot contract as TRIP-010.
- Log counts and row ids in structured logs; do not create a queue table unless this audit proves existing logs/idempotency are insufficient.

## Acceptance criteria

- [ ] Function/routine is idempotent; repeated runs insert zero duplicates.
- [ ] Fixture: paid order with `trip_id` and missing `trip_items` is repaired.
- [ ] Fixture: paid order without `trip_id` is skipped and logged, not guessed.
- [ ] Cron schedule exists or a Supabase scheduled edge equivalent is documented with evidence.
- [ ] Evidence file: `tasks/trips/evidence/TRIP-013-reconciliation.md`.

## Tests

- SQL or edge smoke: seed repair fixture, run worker, assert one mirror row.
- Replay smoke: run worker twice, assert row count unchanged.
- Negative: no service-role key in `mdeapp/src/**`.

## Do not do

- Do not introduce a general booking queue for MVP.
- Do not let Gemini infer payment or booking status.
