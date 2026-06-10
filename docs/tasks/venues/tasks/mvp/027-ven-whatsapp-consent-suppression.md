---
task_id: ven-027
mvp_step: 027
title: WhatsApp consent and suppression list
layer: OPS
priority: P0
status: Not Started
depends_on: [VEN-022]
unblocks: [VEN-030, VEN-031]
skills: [mde-supabase, task-verifier]
description: Add WhatsApp opt-in, approved template, suppression, and failure logging requirements before outbound venue messages.
---

# VEN-027 - WhatsApp consent and suppression list

## At a glance

| | |
|---|---|
| **For** | Tourist, venue operators, Patricia |
| **Surface** | `/admin/bookings`, WA outbox worker |
| **Layer** | COMPLIANCE / OPS |

## What we're building

Compliance guardrails around WhatsApp sending. Patricia can approve a draft, but the send path must still require consent, approved templates where needed, suppression checks, and delivery failure logs.

## Features

- Store user/recipient opt-in source and timestamp.
- Approved template IDs for business-initiated messages.
- Suppression list checked before enqueue/send.
- Twilio failure codes logged and visible to admin/support.
- No cold-message path for venues or users.

## Agents & tools

Gemini may draft copy, but it must never send. Mastra tools cannot bypass consent or suppression checks. Any outbound send must be deterministic, audited, and approval-gated.

## Workflows

1. Patricia approves WhatsApp draft.
2. Worker checks consent and suppression.
3. Worker uses an approved template or valid in-session path.
4. Twilio response is logged.
5. Failed sends update booking status to `needs_user` or `send_failed`.

## User journey

Patricia approves a venue booking message. If the recipient has opted out or the template is paused, no message is sent and Patricia sees the failure reason.

## Acceptance

- [ ] Opt-in fields or consent lookup are part of the send contract.
- [ ] Suppression list blocks outbound sends.
- [ ] Approved template ID is stored/logged for template sends.
- [ ] Twilio failure code and message SID are logged.
- [ ] Tests cover opt-out, missing consent, and template failure.

## Do not do

- Do not cold-message venues or users.
- Do not send from Gemini/Mastra directly.
- Do not ignore STOP/opt-out style signals.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-027](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-027-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Consent gate before WA |
| **MCP** | — |
| **Chrome DevTools** | Consent UI |
| **Playwright** | — |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Suppression list storage

