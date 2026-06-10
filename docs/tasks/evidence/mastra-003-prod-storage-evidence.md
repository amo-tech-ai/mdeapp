# MASTRA-003 production storage fix — evidence

**Date:** 2026-05-22  
**Blocker:** `ConnectionFailed: mastra-agent-memory.db` on Vercel → `/api/copilotkit` 500

## Root cause

`src/mastra/lib/agent-memory.ts` used `file:mastra-agent-memory.db`. Vercel serverless FS is read-only/ephemeral.

## Fix

| Requirement | Status |
|-------------|--------|
| `DATABASE_URL` → `PostgresStore` | ✅ `src/mastra/lib/storage.ts` |
| No `DATABASE_URL` → `:memory:` LibSQL (dev) | ✅ |
| No `file:` / `mastra-agent-memory.db` in repo | ✅ grep clean |
| Pattern 1 CopilotKit unchanged | ✅ |
| Route: `nodejs`, `force-dynamic`, `maxDuration=60` | ✅ |
| Logging `[mastra-storage] using Postgres/local dev LibSQL` | ✅ |

## Tests

| Command | Result |
|---------|--------|
| `npm run lint` | ✅ 0 warnings |
| `npm test` | ✅ 66/66 |
| `npm run build` | ✅ logs `[mastra-storage] using Postgres` at build |
| `npm run floor` | ✅ exit 0 |

## Production smoke (www.mdeai.co)

| Check | Before | After |
|-------|--------|-------|
| `GET /` | 200 | ✅ 200 |
| `POST /api/copilotkit` `{}` | **500** | ✅ **400** `Missing method field` |
| Browser concierge rental query | failed | ✅ 5 Laureles listings + links |
| Vercel logs `mastra-agent-memory` | error | ✅ none (15m window) |

**Deploy:** production redeploy via `vercel deploy --prod` (Postgres storage + logging).

## Files changed

- `src/mastra/lib/storage.ts` (new) — Postgres/LibSQL factory + logging
- `src/mastra/lib/storage.test.ts` (new)
- `src/mastra/lib/agent-memory.ts` — uses `getMastraStorage()`
- `src/mastra/index.ts` — uses `getMastraStorage()`
- `src/mastra/agents/index.ts` — pingAgent uses shared storage
- `src/app/api/copilotkit/route.ts` — nodejs runtime config + error logging
- `package.json` — `@mastra/pg@beta`

**Grade: A** — prod chat verified end-to-end.
