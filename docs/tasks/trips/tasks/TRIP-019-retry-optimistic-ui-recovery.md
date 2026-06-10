---
task_id: TRIP-019
title: Retry + optimistic UI recovery
layer: APP + QA
priority: P1
phase: hardening
status: Not Started
estimated_effort: 4h
persona: Camila
depends_on: [TRIP-007, TRIP-006]
unblocks: [TRIP-011, TRIP-012]
skills: [copilotkit-develop, testing, task-verifier]
description: Standardize pending, rollback, retry, and duplicate-click behavior for saves/add-to-trip flows.
---

# TRIP-019 — Retry + optimistic UI recovery

## Goal

If Camila taps "Add to trip" on a rental and the insert fails, the card must not pretend the item is saved.

## Build scope

- Shared optimistic mutation helper or local pattern for add-to-trip and save-to-collection flows.
- Pending visual state and spinner/disabled lock.
- Rollback on failed insert/update/delete.
- Retry toast/action with the original payload.
- Duplicate request guard keyed by `(trip_id, item_type, source_id)`.
- Error copy that tells Camila the item was not saved.

## Acceptance criteria

- [ ] Failed add-to-trip mutation rolls UI back.
- [ ] Retry succeeds without creating duplicate `trip_items`.
- [ ] Double-click produces one network mutation.
- [ ] Saved collection failure behaves consistently.

## Tests

- Component test with mocked Supabase insert failure.
- Playwright network abort test for add-to-trip.
- Unit test for duplicate request key.

## Do not do

- Do not hide failed writes behind optimistic success.
