---
task_id: ven-030
post_mvp_step: 030
title: venueBookingWorkflow
layer: mastra
priority: P0
status: Not Started
estimated_effort: 1.5 days
depends_on: [VEN-016, VEN-022]
skills: [mastra, mde-task-lifecycle]
mcp: [user-mastra]
description: Structured workflow validate → insert booking → draft WhatsApp (no send).
---

# VEN-030 — Mastra — venueBookingWorkflow


## At a glance

| | |
|---|---|
| **For** | Sarah, Carlos, Tourist |
| **Surface** | Mastra Studio + booking |
| **Layer** | mastra |

## What we're building

Structured booking pipeline: validate → insert → draft WA → return pending — auditable steps for Patricia HITL later.

## Features

- Four named steps
- Registered in mastra/index.ts
- No WA send in workflow

## Agents & tools

Invoked by concierge or direct tool (Phase 1: tool OK)

## Workflows

`venueBookingWorkflow`

## User journey

1. Booking request starts workflow.
2. Validate → insert (VEN-016) → draft (VEN-022).
3. UI shows pending; future suspend step adds Patricia approval.

## Why workflow vs agent-only

Booking is a **defined process** with fixed steps and audit trail. Agent can call tools ad-hoc; workflow guarantees order and enables suspend for Patricia.

## Steps (verify via Mastra MCP + embedded docs)

| Step | id | Action |
|------|-----|--------|
| 1 | `validate-booking-input` | Zod parse + business rules (future date, party_size) |
| 2 | `insert-booking-request` | Call same logic as VEN-016 |
| 3 | `draft-whatsapp-message` | Call VEN-022; store draft on row |
| 4 | `return-pending-status` | Output for CopilotKit status chip |

## Registration

```ts
// src/mastra/workflows/venue-booking-workflow.ts
// mastra/index.ts workflows: { ..., venueBookingWorkflow }
```

## Agent integration

Option A (Core): Agent calls `requestVenueBooking` tool directly.  
Option B: Agent invokes workflow via tool wrapper `runVenueBookingWorkflow`.

Pick **A for Phase 1**; register workflow for Studio visibility + future suspend.

## Acceptance criteria

- [ ] `venueBookingWorkflow.commit()` registered in `mastra/index.ts`
- [ ] Studio shows workflow + step traces
- [ ] No WhatsApp send in workflow (Patricia path **VEN-023**)
- [ ] Vitest step unit tests OR workflow integration test
