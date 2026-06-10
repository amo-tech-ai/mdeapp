---
task_id: ven-026
mvp_step: 026
title: Venue booking idempotency and duplicate prevention
layer: DATA
priority: P0
status: In Progress
depends_on: [VEN-015, VEN-016, VEN-021]
unblocks: [VEN-028, VEN-031]
skills: [mde-supabase, copilotkit-develop, mastra, task-verifier]
description: Prevent duplicate venue booking requests from retries, double-clicks, and webhook/tool replay.
---

# VEN-026 - Venue booking idempotency and duplicate prevention

## At a glance

| | |
|---|---|
| **For** | Camila, Tourist, Patricia |
| **Surface** | VenueBookingSheet, Mastra tool, Supabase |
| **Layer** | DATA / RELIABILITY |

## What we're building

An idempotent booking write contract so repeat submits, tool replay, retries, and network timeouts do not create duplicate venue booking requests.

## Features

- Deterministic idempotency key for booking submissions.
- Unique constraint or RPC conflict handling for same user/place/request window.
- Typed duplicate response that the UI can render as "already requested".
- Replay-safe Mastra tool result.

## Agents & tools

`requestVenueBooking` must return deterministic `created`, `already_exists`, or `failed` states. Gemini must not claim a new request was created unless Supabase confirms it.

## Workflows

1. User submits booking request.
2. App computes idempotency key from user, venue, requested time, party size, and source.
3. Supabase insert/upsert returns a stable booking row.
4. Second submit returns existing row without duplicate side effects.

## User journey

Camila taps submit twice on a weak mobile connection. She sees one pending request, not two rows in Patricia's queue.

## Partial shipped (2026-06-02)

- [x] Unique index `(user_id, idempotency_key)` on `venue_booking_requests` (DATA-009)
- [x] Web API builds deterministic `vb-{hash}` key (`app/api/venue-booking/request/route.ts`)
- [ ] UI shows friendly message on 409 duplicate (form still generic error)
- [ ] Mastra tool returns typed `already_exists` (not only throw)
- [ ] Vitest + Playwright double-submit

## Acceptance

- [ ] Double submit produces one `venue_booking_requests` row.
- [ ] Tool retry returns existing booking row and clear duplicate state.
- [x] Database constraint proves duplicate prevention outside the browser
- [ ] Status chip uses the canonical row returned from Supabase (VEN-020)
- [ ] Test covers replay/double-click behavior.

## Do not do

- Do not rely on button disabling alone.
- Do not use Gemini text as persistence proof.
- Do not create duplicate approval/outbox records during replay.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-026](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-026-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Duplicate idempotency_key → one row |
| **MCP** | Supabase unique index |
| **Chrome DevTools** | — |
| **Playwright** | Double-submit sheet |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- UI dedupe feedback

