# MAP-002E evidence — 2026-05-26

## Deliverables

| Item | Path |
|------|------|
| Runbook | `services/adk-grounding/RUNBOOK.md` |
| Structured invoke logs | `services/adk-grounding/invoke_logging.py` + `main.py` |
| MCP 429 no Gemini fallback | `main.py` + `grounding_mcp.GroundingMcpError` |
| Contract | `tasks/ADK/docs/sidecar-api-contract.md` § `metadata.source` |
| Cloud Run link | `tasks/ADK/docs/14-cloud-run-reference.md` |

## Tests

```bash
cd services/adk-grounding && .venv/bin/python -m pytest test_main_invoke.py -q
# 4 passed — 429 no fallback, 403 fallback, search stub paths
cd services/adk-grounding && .venv/bin/python -m pytest -q
# 22 passed
```

## Fallback rules (grep-verified)

- `quota_exceeded` on MCP 429 — `gemini_maps` not called (`test_mcp_429_does_not_fallback_to_gemini`)
- `gemini-maps-grounding` on MCP 403/referrer (`test_mcp_403_falls_back_to_gemini_maps`)

## Deploy

Cloud Run redeploy not run in this session (requires `gcloud` + Secret Manager). After deploy: smoke mask v3 links per RUNBOOK § Triage.
