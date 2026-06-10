---
task_id: ven-023
mvp_step: 023
title: WhatsApp approval + wa_outbox
layer: EDGE
priority: P1
status: Not Started
depends_on: [VEN-022, VEN-027]
unblocks: [VEN-024, VEN-030]
skills: [mde-whatsapp, mde-supabase]
doc: ../docs/02-booking-whatsapp.md
replaces: [VEN-005]
description: Patricia approves draft → enqueue wa_outbox → Twilio send; idempotent.
---

# VEN-22 — WA approval outbox


## At a glance

| | |
|---|---|
| **For** | Patricia |
| **Surface** | `/admin` + edge WA worker |
| **Layer** | OPS |

## What we're building

After Patricia approves draft, enqueue WhatsApp send via outbox — idempotent, audited.

## Features

- approval_requests → wa_outbox
- No send from Mastra tools directly
- English Phase 1 copy

## Agents & tools

None — edge worker

## Workflows

Patricia HITL gate (MSV-010 advanced)

## User journey

1. Patricia approves draft in admin.
2. Outbox row created.
3. Worker sends WA; booking status → sent.

## Goals

1. Link `venue_booking_requests` → `approval_requests`.
2. Patricia approve/edit in admin (CAF-017).
3. On approve: insert `wa_outbox` row; edge fn sends.
4. Update booking `status` sent / needs_user / confirmed on reply webhook.

## Acceptance

- [ ] No send without approval row
- [ ] No send without consent/suppression/template checks from VEN-027
- [ ] Twilio message SID or failure code logged
- [ ] RLS on all tables
- [ ] Evidence: test booking E2E with stub Twilio
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-023](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-023-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Patricia approve → wa_outbox row |
| **MCP** | Supabase wa_outbox schema |
| **Chrome DevTools** | Admin approval UI |
| **Playwright** | Stub Twilio path |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Audit trail per send

