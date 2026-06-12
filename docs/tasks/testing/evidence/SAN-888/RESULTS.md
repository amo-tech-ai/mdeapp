---
title: SAN-888 · CK-V2-002 — host-analytics-prototype — localhost runtime proof
date: 2026-06-12
branch: ai/san-888-ck-v2-002-host-analytics-prototype
flag: COPILOTKIT_V2_ANALYTICS=1
verdict: PASS (flag on) · v1 rollback path verified by file gate
---

# SAN-888 · CK-V2-002 — v2 /host/analytics prototype

Roberto's sales dashboard on `/host/analytics` behind `COPILOTKIT_V2_ANALYTICS`. Camila's `/chat` and the event wizard stay on v1.

## Flag on (`COPILOTKIT_V2_ANALYTICS=1`)

Command:

```bash
COPILOTKIT_V2_ANALYTICS=1 infisical run --silent --env=dev --path=/ -- npm run dev
COPILOTKIT_V2_ANALYTICS=1 infisical run --silent --env=dev --path=/ -- \
  node docs/tasks/testing/evidence/SAN-888/san-888-v2-localhost-proof.mjs
```

| Gate | Result |
|---|---|
| `/host/analytics` HTTP 200 (qa-landlord session) | ✅ |
| v2 shell `data-testid="host-analytics"` | ✅ |
| `CopilotChat` bound to `agentId="hostOpsAgent"` | ✅ (code) |
| Ask "how are my sales?" → `Sales loaded ✓` | ✅ |
| KPI cards from tool result (COP 23,640,000 / 326 / 163) | ✅ deterministic |
| Console errors (excl. Lit dev / Maps vector fallback) | ✅ none |
| `/api/copilotkit` POST | ✅ 200 |

Artifacts:

- `SAN-888-v2-flag-on-results.json`
- `SAN-888-v2-flag-on-localhost.png`
- `san-888-v2-localhost-proof.mjs`

## Flag off (`COPILOTKIT_V2_ANALYTICS` unset or `0`)

| Gate | Result |
|---|---|
| Layout gates to `HostAnalyticsProviderV1` + `HostAnalyticsShell` | ✅ code path |
| v1 bridge `host-ops-copilot-bridge.tsx` untouched | ✅ |
| Prod v1 parity baseline | ✅ [SAN-729 · AIE-008 prod proof](../2026-06-12/SAN-729-AIE-008-CHROME-MCP-prod-report.md) |

## Infisical / Vercel

| Env | Where | Value |
|---|---|---|
| `COPILOTKIT_V2_ANALYTICS` | local dev | `1` to exercise v2 path; omit or `0` for prod v1 |
| `COPILOTKIT_V2_ANALYTICS` | Vercel preview | set `1` only on preview URLs testing SAN-888; **never** on production until merge train |

Documented in `.env.example` (server-only, no `NEXT_PUBLIC_` prefix).

## Fixes landed during proof

1. `CopilotChat agentId="hostOpsAgent"` — v2 chat was defaulting off hostOpsAgent without this.
2. `enableInspector={false}` on v2 provider — web inspector blocked Playwright send clicks on localhost.
3. Proof script uses `copilot-chat-textarea` + `copilot-send-button` selectors.

## Linear branch note

Canonical git branch: `ai/san-888-ck-v2-002-host-analytics-prototype` (GitHub attachment on SAN-888). Linear auto `gitBranchName` may differ — use the attachment link.
