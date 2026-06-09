# GS-001 evidence — 2026-05-26

## Deliverables

| Item | Path |
|------|------|
| Sidecar parser | `services/adk-grounding/search_grounding.py` |
| Sidecar route | `main.py` `tool=search_grounded_events` |
| Tests | `test_search_grounding.py`, `test_main_invoke.py` (search paths) |
| Zod + parser | `mdeapp/src/mastra/lib/search-grounding-types.ts` |
| Vitest | `search-grounding-types.test.ts` |
| Contract | `tasks/ADK/docs/sidecar-api-contract.md` |

## Tests

```bash
cd services/adk-grounding && .venv/bin/python -m pytest test_search_grounding.py -q
# 4 passed
cd mdeapp && npm run test -- --run src/mastra/lib/search-grounding-types.test.ts
# 3 passed
npm run floor  # exit 0 — 222 Vitest
```

## Flag behavior

- `ENABLE_SEARCH_GROUNDING` unset → `metadata.reason=search_disabled`
- Flag `1` → Gemini `googleSearch` tool (mocked in unit test)

## Next (not GS-001)

- **GS-002** citation UI
- **GS-003** quota logging
- **GS-004** Mastra freshness router
- **MAP-002D** wire Mastra tool to sidecar when flag on
