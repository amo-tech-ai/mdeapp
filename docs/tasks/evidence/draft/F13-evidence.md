# F13 — ai_runs observability evidence

**Date:** 2026-05-21  
**Verifier:** Cursor agent (task-verifier gates + MCP)

## Pre-flight

- `mdeapp/.env.local`: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` present (server-only; no `NEXT_PUBLIC_*SERVICE_ROLE*` in `mdeapp/src/**`).
- Integration: Pattern 1 — `getLocalAgentsWithLogging({ mastra })` in `/api/copilotkit`; no `registerCopilotKit` / `:4111/chat` in `mdeapp/src/**`.

## Automated gates

| Command | Result |
|---|---|
| `npm test` | 10/10 pass |
| `npm run build` | exit 0 |
| `npm run floor` | exit 0 (lint/typecheck/audit after `ai-runs.ts` typed insert helper) |

## Localhost (gate 9)

- UI: `http://localhost:3001/` HTTP 200 (existing `next dev` PID 72712)
- `POST /api/copilotkit` empty body → HTTP 400 (runtime alive)
- Chat smoke via Chrome DevTools MCP on `:3001`

## Chrome DevTools MCP

- Navigated `http://localhost:3001/`
- Sent chat message: `hi`
- Assistant reply received (echo/wiring confirmation)
- Network: multiple `POST http://localhost:3001/api/copilotkit` → **200**
- Console: 1× Lit dev-mode **warn** only; **no errors**, no `INCOMPLETE_STREAM`

## Supabase MCP (`ai_runs`)

After chat turn:

```text
agent_name: ping-agent
agent_type: general_concierge
user_id: null
status: success
duration_ms: 3512
created_at: 2026-05-21 04:14:15 UTC
```

Prior rows were legacy `ai-embed` from 2026-05-08 — new `ping-agent` row proves F13 writer on CopilotKit path.

## Files shipped

- `mdeapp/src/mastra/lib/ai-runs.ts`
- `mdeapp/src/mastra/lib/log-agent-run.ts`
- `mdeapp/src/mastra/copilotkit/logging-mastra-agent.ts`
- `mdeapp/src/mastra/tools/audit-wrapper.ts`, `risk-levels.ts`
- `mdeapp/src/app/api/copilotkit/route.ts` (logging agents)
- Tests: `ai-runs.test.ts`, `log-agent-run.test.ts`
- Hook carve-out: `.claude/hooks/no-service-role-in-src.mjs` (`mdeapp/src/mastra/lib/`)
- `CLAUDE.md` F13 carve-out note

## Security

- Service role used only in `mdeapp/src/mastra/lib/ai-runs.ts` (server import chain from API route)
- Anonymous `user_id: null` allowed for W1 smoke
