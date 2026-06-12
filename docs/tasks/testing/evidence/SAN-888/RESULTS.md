---
title: SAN-888 · CK-V2-002 — Host Analytics prototype — localhost runtime proof
date: 2026-06-12
main_sha: b9a4f70
pr: "#208 merged"
verdict: PASS (flag off + flag on)
---

# SAN-888 · CK-V2-002 — v2 /host/analytics prototype

Roberto's sales dashboard on `/host/analytics` behind `COPILOTKIT_V2_ANALYTICS`. Camila's `/chat` and the event wizard stay on v1.

## Flag off (`COPILOTKIT_V2_ANALYTICS` unset or `0`)

Command:

```bash
COPILOTKIT_V2_ANALYTICS=0 infisical run --silent --env=dev --path=/ -- npm run dev
SAN888_V2=0 infisical run --silent --env=dev --path=/ -- \
  node docs/tasks/testing/evidence/SAN-888/san-888-localhost-proof.mjs
```

| Gate | Result |
|---|---|
| `/host/analytics` HTTP 200 (qa-landlord session) | ✅ |
| v1 shell `data-testid="host-analytics"` | ✅ |
| Ask **"How are my sales?"** → `Sales loaded ✓` | ✅ |
| KPI cards show revenue (COP / ticket counts) | ✅ |
| Console errors (excl. Lit dev / Maps vector fallback) | ✅ none |

Artifacts: `SAN-888-v2-flag-off-results.json` · `SAN-888-v2-flag-off-localhost.png`

## Flag on (`COPILOTKIT_V2_ANALYTICS=1`)

Command:

```bash
COPILOTKIT_V2_ANALYTICS=1 infisical run --silent --env=dev --path=/ -- npm run dev
SAN888_V2=1 COPILOTKIT_V2_ANALYTICS=1 infisical run --silent --env=dev --path=/ -- \
  node docs/tasks/testing/evidence/SAN-888/san-888-localhost-proof.mjs
```

| Gate | Result |
|---|---|
| `/host/analytics` HTTP 200 (qa-landlord session) | ✅ |
| v2 shell `data-testid="host-analytics"` | ✅ |
| `CopilotChat` bound to `agentId="hostOpsAgent"` | ✅ (code) |
| Ask **"How are my sales?"** → `Sales loaded ✓` | ✅ |
| KPI cards from tool result | ✅ |
| Console errors (excl. Lit dev / Maps vector fallback) | ✅ none |
| `/api/copilotkit` POST | ✅ 200 (runtime connected during chat) |

Artifacts: `SAN-888-v2-flag-on-results.json` · `SAN-888-v2-flag-on-localhost.png`

## Infisical / Vercel

| Env | Where | Value |
|---|---|---|
| `COPILOTKIT_V2_ANALYTICS` | local dev | `1` to exercise v2 path; omit or `0` for prod v1 |
| `COPILOTKIT_V2_ANALYTICS` | Vercel preview | set `1` only on preview URLs testing SAN-888; **never** on production until merge train |

Documented in `.env.example` (server-only, no `NEXT_PUBLIC_` prefix).

## Scripts

- `san-888-localhost-proof.mjs` — unified flag on/off proof (replaces branch-only script)
- `san-888-v2-localhost-proof.mjs` — legacy flag-on only (kept for reference)

## Linear

Merged to `main` @ `b9a4f70` via [PR #208](https://github.com/amo-tech-ai/mdeapp/pull/208). Status: **Done**.
