---
task_id: ven-018
mvp_step: 018
title: mastra-tool-action-names booking keys
layer: WIRE
priority: P0
status: Done
estimated_effort: 0.5 day
depends_on: [VEN-016]
unblocks: [VEN-019]
skills: [copilotkit-integrations]
description: Add requestVenueBookingTool + request-venue-booking to MASTRA_COPILOT_TOOL_ACTIONS map.
---

# VEN-17 — Mastra tool action names


## At a glance

| | |
|---|---|
| **For** | Sofía — prevents silent 404s |
| **Surface** | mastra-tool-action-names.ts |
| **Layer** | WIRE |

## What we're building

Registry mapping Mastra tool ids to CopilotKit useCopilotAction names — both must match exactly.

## Features

- Central registry file
- Grep gate in floor/hooks
- Covers booking + search tools

## Agents & tools

All concierge tools with UI renders

## Workflows

None

## User journey

1. New tool added to concierge.
2. Registry updated with two names.
3. Cards render; no AG-UI name mismatch.

## Goals

Shipped in [`mastra-tool-action-names.ts`](../../../mdeapp/src/platform/copilot/mastra-tool-action-names.ts):

```ts
venueBooking: "requestVenueBooking",      // CopilotKit action name
// MASTRA_TOOL_IDS.venueBooking: "request-venue-booking"
```

Verify against `conciergeAgent` tools registry after MSV-002.

## Acceptance

- [x] Dual registration in `SearchToolRenders` (`venueBookingToolRender`)
- [x] `mastra-tool-action-names.test.ts` passes (3/3)
- [x] Concierge tool key `requestVenueBooking` matches `MASTRA_COPILOT_TOOL_ACTIONS.venueBooking`

**Evidence:** partial in [`VEN-016-verify-2026-06-02.md`](../evidence/VEN-016-verify-2026-06-02.md); extend VEN-029 for CI gate.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-018](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-018-verify-YYYY-MM-DD.md` |
| Grade | **B / 78** partial |
| Production ready | Yes for booking tool wiring — VEN-029 CI guard still open |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Grep registry keys match concierge |
| **MCP** | CopilotKit action name = Mastra tools key |
| **Chrome DevTools** | — |
| **Playwright** | `mastra-tool-action-names.test.ts` |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Mark done after VEN-016 sign-off
- VEN-029 CI guard

