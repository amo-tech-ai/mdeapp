# MASTRA-004 — ai_runs user_id + withAudit — evidence

**Date:** 2026-05-20  
**Status:** Done

## Shipped

- `route.ts` — Supabase session → `RequestContext` + `userId` → `getLocalAgentsWithLogging`
- `logging-mastra-agent.ts` — propagates `userId` to `logAgentRunForTurn`
- `tool-audit-context.ts` + `run-audited-search.ts`
- All four search tools wrapped with `withAudit` via `runAuditedSearch`
- Tests: `tool-audit-context.test.ts`, `audit-wrapper.test.ts`, `log-agent-run.test.ts` user_id case

## Supabase enum probe (agent_type)

Verified via MCP 2026-05-20:

`local_scout`, `dining_orchestrator`, `event_curator`, `itinerary_optimizer`, `budget_guardian`, `booking_assistant`, `general_concierge`, `concierge`, …

Mapping in `log-agent-run.ts` uses existing enum values only.

## Verification

| Check | Result |
|-------|--------|
| `grep userId route.ts` | session passed to logging wrapper |
| Vitest | **150/150** |
| `npm run floor` | exit **0** |
| Anonymous path | `userId: null` test preserved |

## Dual-path SQL (manual when logged-in session available)

```sql
SELECT user_id, agent_name, created_at FROM ai_runs ORDER BY created_at DESC LIMIT 5;
```

Anonymous chat → `user_id IS NULL`. Logged-in `/` turn → uuid populated (verify after Camila signs in).

## Grade: A
