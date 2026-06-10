---
task_id: ven-028
mvp_step: 028
title: Booking retry and optimistic UI recovery
layer: UI
priority: P0
status: Not Started
depends_on: [VEN-017, VEN-019, VEN-021, VEN-026]
unblocks: [VEN-020, VEN-031]
skills: [copilotkit-develop, shadcn, mde-supabase, testing]
description: Add pending, rollback, retry, timeout, and failed-state handling for venue booking requests.
---

# VEN-028 - Booking retry and optimistic UI recovery

## At a glance

| | |
|---|---|
| **For** | Camila, Tourist |
| **Surface** | VenueBookingSheet, detail panels, booking status chips |
| **Layer** | UI / RELIABILITY |

## What we're building

Failure-safe booking UX. A user should never see "request received" if Supabase did not confirm the row, and a failed request should give a retry path without duplicating records.

## Features

- Pending state on submit.
- Rollback on failed insert/tool response.
- Retry toast/action.
- Duplicate-click lock.
- Failed booking state and timeout copy.
- Offline/network error handling where practical.

## Agents & tools

CopilotKit rendered cards must reflect deterministic tool states: pending, success, already exists, failed, retrying. Gemini must not say a booking was saved unless Supabase confirms it.

## Workflows

1. User submits booking.
2. UI enters pending state.
3. Success shows pending booking chip.
4. Duplicate returns existing booking chip.
5. Failure rolls back and offers retry.

## User journey

Tourist requests a nightlife table while on unstable mobile data. If the request fails, the sheet stays honest and offers retry; Patricia does not receive duplicate rows.

## Acceptance

- [ ] Failed insert does not show successful pending state.
- [ ] Retry succeeds without duplicate booking rows.
- [ ] Timeout/offline state is visible.
- [ ] Duplicate click cannot send concurrent booking writes.
- [ ] Playwright or component test covers success, failure, duplicate, and retry.

## Do not do

- Do not silently fail in console only.
- Do not rely on optimistic success without rollback.
- Do not let retry create duplicate outbox/approval records.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-028](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-028-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Retry on insert failure |
| **MCP** | — |
| **Chrome DevTools** | ToolErrorChip + retry |
| **Playwright** | Simulate 500 insert |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optimistic UI rollback

