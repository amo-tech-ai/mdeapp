---
id: AIE-005-core
title: hostOpsAgent + HostDashboardState
status: Not Started
priority: P0
phase: core
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-001]
blocks: [AIE-006, AIE-007, AIE-008]
depends_on: [AIE-004]
wireframe: ../../wireframes/038-shared-state.md
plan: ../../../plans/04-AI-native-system.md §4
---

# AIE-005-core — hostOpsAgent + HostDashboardState

## Objective

Register 5th Core agent: `hostOpsAgent` with `HostDashboardState` synced across agent, `src/lib/types.ts`, and CopilotKit bridge.

> **Note:** `hostOpsAgent` is a deferred marketplace-tier agent (beyond today's live `conciergeAgent` + `hostEventAgent`) — until marketplace scale, fold this capability into an existing agent as a tool rather than standing up a new agent.

## Scope

- `src/mastra/agents/host-ops-agent.ts` (or index export)
- Zod schema: selected event, date range, KPI snapshot, tasks[]
- Register in `Mastra({ agents: { hostOpsAgent } })` — key must match `useAgent({ name })`
- Gemini `gemini-3.5-flash` only

## Acceptance criteria

- Agent registered; name matches frontend exactly
- Vitest: schema round-trip
- `POST /api/copilotkit` routes to `hostOpsAgent` when selected
- Agent count Core ≤ 5

## Anti-patterns

Do **not** add `analyticsAgent`, `revenueAgent`, or `reportAgent`.
