---
task_id: TRIP-014
title: Trips RLS penetration verification
layer: DATA + QA
priority: P0
phase: hardening
status: Not Started
estimated_effort: 5h
persona: Camila, Sofia
depends_on: [TRIP-001, TRIP-003, TRIP-007, TRIP-009]
unblocks: [TRIP-011, TRIP-012]
skills: [mde-supabase, testing, task-verifier]
description: Prove User B cannot read, update, delete, join, or infer User A trip data.
---

# TRIP-014 — RLS penetration verification

## Goal

Camila's trip to Laureles must stay private even when another authenticated user hits `/trips`, `/saved`, joins through `trip_items`, or calls an insert/update path directly.

## Build scope

- Create a two-user RLS fixture for `trips`, `trip_items`, `saved_places`, `collections`, and `conflict_resolutions`.
- Test SELECT, INSERT, UPDATE, DELETE isolation under user-scoped JWTs.
- Test nested join leakage: `trips?select=*,trip_items(*)`, saved collection joins, and conflict rows.
- Test count inference where the API allows exact count headers.
- Verify edge/server actions do not bypass ownership with service role except in explicit payment repair paths.

## Acceptance criteria

- [ ] User A can CRUD own trips and trip_items through the approved paths.
- [ ] User B cannot SELECT/UPDATE/DELETE User A rows.
- [ ] User B cannot attach a trip_item to User A trip.
- [ ] User B cannot infer User A row count through joins/count requests.
- [ ] Evidence file includes commands, JWT/user ids redacted, and pass/fail table.

## Tests

- Supabase JS integration test or script with two test users.
- Playwright auth fixture covering `/trips`, `/trips/[id]`, `/saved`.
- Supabase advisor output attached; `spatial_ref_sys` called out separately as non-Trip PostGIS noise unless product policy changes.

## Do not do

- Do not rely on a "RLS enabled" table flag as sufficient proof.
