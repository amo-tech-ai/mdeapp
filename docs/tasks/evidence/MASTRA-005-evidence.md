# MASTRA-005 evidence — check:mastra PR gate

**Date:** 2026-05-20  
**Task:** [`tasks/archive/mastra-A/MASTRA-005-mastra-pr-gate.md`](../archive/mastra-A/MASTRA-005-mastra-pr-gate.md)

## Deliverables

| File | Purpose |
|------|---------|
| `mdeapp/scripts/check-mastra.mjs` | Agent name, CK pin, Gemini, service-role, route pattern, storage mode |
| `mdeapp/package.json` | `"check:mastra": "node scripts/check-mastra.mjs"` |
| `mdeapp/docs/ARCHITECTURE.md` | §7 Mastra PR gate |

## Dry-run output (2026-05-20)

```
check:mastra — mdeapp Mastra PR gate

WARN storage.ts allows :memory: LibSQL (local dev OK; set MASTRA_REQUIRE_PG=1 on prod CI after MASTRA-003)

OK — all Mastra gate checks passed
```

## Checks implemented

| Check | Result |
|-------|--------|
| `useCoAgent` names ⊆ Mastra keys | ✅ `conciergeAgent`, `hostEventAgent` |
| CopilotKit `@copilotkit/*` === 1.55.2 | ✅ |
| No `@copilotkit/react-core/v2` in app/components | ✅ |
| No deprecated Gemini in `src/mastra/agents` | ✅ |
| No service-role in client app/components | ✅ |
| `getLocalAgentsWithLogging` in route | ✅ |
| `:memory:` storage | WARN (allowed; strict via `MASTRA_REQUIRE_PG=1`) |

## Verification

```bash
cd mdeapp && npm run check:mastra && npm run floor
```

## Official docs cross-check

- CopilotKit Mastra integration: https://docs.copilotkit.ai/integrations/mastra (MCP search-docs 2026-05-20)
- Plan ref: `plan/mastra/github/14-mastra-system-check.md`

## Grade: **A**
