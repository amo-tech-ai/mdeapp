task_id: ven-033
mvp_step: 033
id: VEN-033
title: CoffeeTour types + Zod schemas
status: Open
priority: P0
phase: CTI-A
effort: 2h
owner: claude
depends_on: [VEN-032]
blocks: [VEN-036, VEN-035, VEN-038]
skill: [testing, mastra, mde-task-lifecycle]
mcp: []
---

# VEN-033 — CoffeeTour types + Zod

## In plain English

Define **one shared language** (TypeScript + Zod) for tour rows, tool inputs, and card UI — so the agent, database, and map pins never disagree on field names.

## User story

**As Sofía (QA),** I want invalid tour payloads to fail at parse time in Vitest, **so that** a bad seed row or tool response cannot crash Camila’s chat mid-demo.

## Real-world example

`CoffeeTourCardDTO` carries `finalScore: 78`, `whyRecommended: "Community-owned farm with cupping"`, and `limitedVerification: false` — the same shape `searchCoffeeTours` returns and `CoffeeTourCard` renders.

## Goals

1. `CoffeeTour`, `CoffeeTourCardDTO`, `CoffeeTourSearchFilters`, `CoffeeTourRankSignals`.
2. Zod schemas for tool input/output.
3. Vitest fixtures from [`05-coffee-tours.md`](../../listings/cafes/05-coffee-tours.md) JSON samples.

## Wiring plan

| Layer | File | Action |
|-------|------|--------|
| Types | `mdeapp/src/lib/types/coffee-tour.ts` | Create/expand |
| Tests | `mdeapp/src/lib/types/__tests__/coffee-tour.test.ts` | Create |

## Success criteria

1. Invalid tool payload fails Zod parse in test.
2. `CoffeeTourCardDTO` includes optional `finalScore`, `bestFor`, `whyRecommended`, `confidence`.
3. Export reused by VEN-036 tool without circular imports.
4. Types align with VEN-032 column names and MAP-001 `MapPin`.

## Tests

```bash
cd mdeapp && npm test -- coffee-tour
```

## MCP

None — schema-only. Cross-check column names against VEN-032 migration.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-033](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-033-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-033 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

