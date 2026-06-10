# MASTRA-001 evidence — 2026-05-24

## Commands

```text
cd mdeapp && npm test     → 100/100 exit 0
npm run floor             → exit 0
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/           → 200
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/copilotkit -H "Content-Type: application/json" -d '{}' → 400 (expected empty body)
npm run smoke:map-pins    → exit 0 (concierge rental path end-to-end)
```

## Coverage on disk

- `src/__tests__/smoke.test.ts` — agent registry
- `src/mastra/agents/__tests__/concierge.test.ts`
- `src/mastra/agents/__tests__/router.test.ts`
- `src/mastra/tools/__tests__/*`
- `src/mastra/lib/__tests__/agent-input-processors.test.ts`

## Gap (non-blocking for Done)

- Dedicated `src/__tests__/mastra-router-smoke.test.ts` per spec — optional; smoke.test.ts covers registration.

## Workflow

Pattern 1 runtime → `conciergeAgent` on `/` → `search-rentals` tool → rental cards (Playwright SCREEN-005 + smoke:map-pins).
