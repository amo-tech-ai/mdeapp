---
task_id: ven-019
mvp_step: 019
title: requestVenueBooking CopilotKit action
layer: WIRE
priority: P0
status: Not Started
estimated_effort: 1 day
depends_on: [VEN-016, VEN-017, VEN-018, VEN-021]
unblocks: [VEN-020]
skills: [copilotkit-develop, copilotkit-integrations, copilotkit-agui]
mcp: [project-0-mdeai-copilotkit]
description: Generative UI mirror for MSV-002 — renderAndWaitForResponse + disabled render registration.
form_stack: react-hook-form + zod + shadcn-field
---

# VEN-19 — Booking CopilotKit action


## At a glance

| | |
|---|---|
| **For** | All booking personas |
| **Surface** | `/chat` CopilotKit HITL |
| **Layer** | WIRE |

## What we're building

Generative UI mirror for booking tool — `renderAndWaitForResponse` embeds the **same** `VenueBookingForm` (RHF + Zod + Field) as VEN-017, not a one-off HITL markup.

## Features

- Disabled useCopilotAction + agent tool
- Pre-fill from detail context
- Both Mastra action names (CKV-009)

## Agents & tools

`conciergeAgent` + requestVenueBooking

## Workflows

Blocked until respond()

## User journey

1. Agent invokes booking tool.
2. Sheet renders in chat.
3. User submits; agent continues with booking id.

## Pattern

Follow Roberto HITL in [`host-event-copilot-bridge.tsx`](../../../mdeapp/src/components/host/host-event-copilot-bridge.tsx):

| Roberto | Venues booking |
|---------|----------------|
| `preview_and_publish` | `requestVenueBookingTool` |
| `EventPublishApprovalPanel` | `VenueBookingSheet` (CKV-005) |
| `available: "remote"` | `available: "disabled"` + agent tool |

Agent tool executes after user submits form via `respond({ ...fields })`.

## Goals

1. Register **both** names in `mastra-tool-action-names.ts` (**CKV-009**).
2. Mount action in `SearchToolRenders` or `VenueBookingBridge` component.
3. Pre-fill from `CafeVenueDetail` / restaurant / nightlife detail context.
4. On success — show honest copy: "Request received — pending review" (**CAF-015** chip).
5. Agent name invariant: `conciergeAgent` only.

## Acceptance

- [ ] Tool name grep matches Mastra registry exactly
- [ ] POST `/api/copilotkit` trace shows tool-input + tool-output
- [ ] No `confirmed` UX before DB status says so
- [ ] Vitest: render with mock `respond`

## Debug (copilotkit-debug)

If render never shows: AG-UI `tool-input-available` name vs `useCopilotAction.name`.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-019](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-019-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | renderAndWaitForResponse blocks until submit |
| **MCP** | CopilotKit HITL docs |
| **Chrome DevTools** | Sheet blocks agent until respond() |
| **Playwright** | Full HITL submit flow |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Mirror host wizard HITL pattern

