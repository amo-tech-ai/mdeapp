---
task_id: TRIP-018
title: Trip lifecycle states + archival rules
layer: DATA + APP
priority: P1
phase: hardening
status: Not Started
estimated_effort: 4h
persona: Camila, Patricia
depends_on: [TRIP-001, TRIP-003, TRIP-004]
unblocks: [TRIP-012]
skills: [mde-supabase, mde-task-lifecycle, task-verifier]
description: Define strict trip status transitions using the live status constraint and deleted_at archival behavior.
---

# TRIP-018 — Trip lifecycle states + archival

## Goal

Camila's old trips should not clutter the dashboard forever, and Patricia should be able to distinguish active usage from archived history.

## Live constraint

Supabase currently allows:

```text
planning | active | completed | cancelled
```

The external suggestion `draft | active | completed | archived | cancelled` is directionally right, but `draft` and `archived` are not live values today. `deleted_at` already exists and can carry archive/soft-delete semantics unless a migration is approved.

## Build scope

- Define allowed transitions:
  - `planning -> active`
  - `planning -> cancelled`
  - `active -> completed`
  - `active -> cancelled`
  - `completed/cancelled -> archived` via `deleted_at`, not status, for MVP
- Add UI filters for planning/active/completed/cancelled and archived hidden-by-default.
- Add server action validation so clients cannot jump states arbitrarily.
- Document whether `archived` becomes a status value in POST-MVP or stays `deleted_at`.

## Acceptance criteria

- [ ] Invalid transition rejected in server action/test.
- [ ] Dashboard status filters match live DB values.
- [ ] Soft-archived rows are hidden from default `/trips` list but recoverable by owner/admin path if scoped.
- [ ] Evidence file: `tasks/trips/evidence/TRIP-018-lifecycle.md`.

## Tests

- Unit tests for transition helper.
- RLS test: User B cannot archive User A trip.

## Do not do

- Do not alter the `trips.status` CHECK without migration evidence and generated type update.
