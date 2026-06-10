---
task_id: ven-029
mvp_step: 029
title: Tool and CopilotKit action registry CI test
layer: TEST
priority: P0
status: Not Started
depends_on: [VEN-018, VEN-019]
unblocks: [VEN-031]
skills: [copilotkit, copilotkit-integrations, mastra, testing, task-verifier]
description: Add a CI/local gate that proves Mastra tool names and CopilotKit render/action names match.
---

# VEN-029 - Tool and CopilotKit action registry CI test

## At a glance

| | |
|---|---|
| **For** | Sofia, Lucia |
| **Surface** | `/api/copilotkit`, Mastra tool registry, CopilotKit renders |
| **Layer** | TEST / AGENT |

## What we're building

A registry test that catches silent tool render failures caused by mismatched Mastra tool IDs, CopilotKit action names, and rendered card names.

## Features

- Central registry assertions for venue tool/action IDs.
- Test that `requestVenueBooking` is registered in Mastra and has a matching CopilotKit renderer/action.
- Grep or Vitest gate in `npm run floor` or the nearest existing floor script.
- `/api/copilotkit` trace/smoke check where feasible.

## Agents & tools

The venue booking tool must have a stable name across Mastra, CopilotKit, HITL render, and tests. Gemini must not compensate for missing renders by narrating hidden tool failures.

## Workflows

1. Developer changes a tool name.
2. Registry test fails before runtime.
3. Developer updates Mastra and CopilotKit names together.

## User journey

Camila asks to book a restaurant. The rendered booking card appears reliably because the agent tool and UI action names are tested as one contract.

## Acceptance

- [ ] Test fails when Mastra tool name and CopilotKit render/action name diverge.
- [ ] Test covers restaurant, cafe, and nightlife booking entry paths.
- [ ] `/api/copilotkit` route still responds after registry change.
- [ ] Gate is documented in VEN-031 evidence.

## Do not do

- Do not rely on manual grep only.
- Do not create a second naming registry.
- Do not let tool failures degrade into model prose.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-029](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-029-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | CI fails on registry drift |
| **MCP** | — |
| **Chrome DevTools** | — |
| **Playwright** | vitest mastra-tool-action-names |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Add to npm run floor

