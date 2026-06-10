# ADK-CR-01 / ADK-CR-02 — evidence (2026-05-25)

## ADK-CR-01 Dockerfile

- `services/adk-grounding/Dockerfile`
- `services/adk-grounding/.dockerignore`
- Verify: `docker build -t mdeai-adk-grounding:test services/adk-grounding` — **exit 0**

## ADK-CR-02 Bearer auth

- `services/adk-grounding/main.py` — `require_invoke_auth` when `ADK_INTERNAL_TOKEN` set
- `mdeapp/src/mastra/lib/adk-grounding-client.ts` — `Authorization: Bearer`
- `services/adk-grounding/grounding_mcp.py` — prefers `GOOGLE_MAPS_SERVER_API_KEY`
- `mdeapp/.env.example` — `ADK_INTERNAL_TOKEN`, `GOOGLE_MAPS_SERVER_API_KEY`

### Tests

```text
services/adk-grounding: python test_invoke_auth.py → ok
mdeapp: npm test adk-grounding-client.test.ts → 4 passed
```

## Next (operator)

Superseded by [`ADK-CR-evidence.md`](./ADK-CR-evidence.md) (2026-05-25): CR-03–CR-05 Done; CR-06 browser E2E pending.
