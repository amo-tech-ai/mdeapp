---
task_id: ven-022
mvp_step: 022
title: draftVenueWhatsApp Mastra tool
layer: TOOL
priority: P0
status: Not Started
depends_on: [VEN-016]
unblocks: [VEN-023]
skills: [mastra, gemini]
doc: ../docs/02-booking-whatsapp.md
description: Propose-only WhatsApp message body via gemini-3.5-flash; store on booking row.
---

# VEN-21 — draftVenueWhatsApp tool


## At a glance

| | |
|---|---|
| **For** | Patricia |
| **Surface** | Booking row field |
| **Layer** | TOOL |

## What we're building

Gemini drafts WhatsApp message to venue — stored on row, never auto-sent.

## Features

- gemini-3.5-flash draft
- Updates whatsapp_draft column
- No Twilio in tool

## Agents & tools

`draftVenueWhatsApp` on concierge or workflow

## Workflows

MSV-007 step 3

## User journey

1. Booking row exists.
2. Workflow/agent calls draft tool.
3. Patricia sees draft in CAF-017.

## Input

`bookingRequestId`, optional `tone` (formal/friendly).

## Output

`{ draft: string }` — Spanish/English per Phase 1 English-only UI; WA body may include Spanish venue names.

## Acceptance

- [ ] No Twilio SDK in tool
- [ ] Registered on `conciergeAgent` or workflow step only
- [ ] `withAudit` on write path
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-022](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-022-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | draftVenueWhatsApp tool returns draft text |
| **MCP** | mastra |
| **Chrome DevTools** | — |
| **Playwright** | — |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Store draft in metadata jsonb

