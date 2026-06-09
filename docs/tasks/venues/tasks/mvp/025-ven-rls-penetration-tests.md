---
task_id: ven-025
mvp_step: 025
title: Venue booking RLS penetration tests
layer: TEST
priority: P0
status: Not Started
depends_on: [VEN-015, VEN-021, VEN-024]
unblocks: [VEN-031]
skills: [mde-supabase, task-verifier, testing]
description: Prove venue_booking_requests cannot leak or mutate across users/admin boundaries.
---

# VEN-025 - Venue booking RLS penetration tests

## At a glance

| | |
|---|---|
| **For** | Camila, Tourist, Patricia, Sofia |
| **Surface** | Supabase, `/chat`, `/admin/bookings` |
| **Layer** | TEST / SECURITY |

## What we're building

Negative RLS proof for the venue booking request path. The booking table is exposed through app and agent flows, so the MVP needs proof that User A cannot read or mutate User B's rows and non-admins cannot approve/send WhatsApp.

## Features

- Multi-user SELECT, INSERT, UPDATE, DELETE checks.
- Admin-only approval/send checks.
- Anon behavior explicitly tested: denied unless routed through an approved edge path.
- Join/count inference checks for booking queues and status chips.

## Agents & tools

Mastra and CopilotKit tools must use the authenticated user's scoped context or a server-only service path with explicit ownership checks. Gemini must never reveal, infer, or fabricate another user's booking truth.

## Workflows

1. Create User A booking request.
2. Swap to User B JWT.
3. Prove User B cannot SELECT, UPDATE, DELETE, or infer User A's row.
4. Prove non-admin cannot approve or enqueue WhatsApp.
5. Prove Patricia/admin path can act only through the audited approval flow.

## User journey

Camila submits a restaurant request. A different account must not see the booking on status chips, admin queues, CopilotKit readable state, tool traces, or Supabase joins.

## Acceptance

- [ ] SQL or Playwright fixture proves User A cannot SELECT User B bookings.
- [ ] UPDATE/DELETE isolation is tested, not only SELECT.
- [ ] Non-admin approval/send path returns 403 or no-op.
- [ ] Anon direct insert/read behavior is explicitly documented and tested.
- [ ] No service-role key is present in browser/client code.

## Do not do

- Do not treat service-role success as RLS proof.
- Do not loosen RLS to make agent tools easier.
- Do not mark Done without negative tests.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-025](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-025-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Penetration script green |
| **MCP** | get_advisors + execute_sql negative cases |
| **Chrome DevTools** | — |
| **Playwright** | — |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Two auth fixtures
- Extend verify-supabase-data.mjs

