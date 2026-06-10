---
task_id: ven-030
mvp_step: 030
title: Admin audit log for approval and send actions
layer: OPS
priority: P0
status: Not Started
depends_on: [VEN-023, VEN-024, VEN-027]
unblocks: [VEN-031]
skills: [mde-supabase, task-verifier]
description: Audit Patricia approval, edit, enqueue, send, failure, and status-change actions.
---

# VEN-030 - Admin audit log for approval and send actions

## At a glance

| | |
|---|---|
| **For** | Patricia, Sofia |
| **Surface** | `/admin/bookings`, WA outbox worker |
| **Layer** | OPS / AUDIT |

## What we're building

An audit trail for admin approval and WhatsApp send actions. Venue booking automation needs replay evidence: who approved, what changed, what was sent, and what failed.

## Features

- Audit rows for approve, edit, enqueue, send, fail, retry, cancel.
- Actor user ID, booking ID, outbox ID, Twilio SID/error, timestamp.
- Admin-only read access.
- No secrets or raw tokens in logs.
- Links from booking queue to latest audit state where useful.

## Agents & tools

Mastra/Gemini can draft copy only. Approval and send audit events must come from deterministic server/admin paths, not model claims.

## Workflows

1. Patricia edits and approves a draft.
2. Audit row records approval actor and changed fields.
3. Worker enqueues/sends WA and records result.
4. Failure or retry appends another audit event.

## User journey

Patricia sees a booking marked `sent`; Sofia can verify which admin approved it and whether Twilio accepted or rejected the message.

## Acceptance

- [ ] Approval/edit/enqueue/send/fail actions are auditable.
- [ ] Admin-only read path is enforced.
- [ ] Logs contain no service-role keys, tokens, or raw secrets.
- [ ] Failed send can be traced from booking row to outbox/audit row.
- [ ] Playwright/admin smoke includes audit evidence or SQL proof.

## Do not do

- Do not store secrets in audit rows.
- Do not rely on edge logs alone for business audit.
- Do not allow non-admin audit reads.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-030](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-030-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Admin actions logged |
| **MCP** | Audit table RLS |
| **Chrome DevTools** | /admin audit view |
| **Playwright** | — |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Link to Patricia workflows

