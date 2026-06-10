---
title: task-verifier — OpenClaw OCL task gate
impact: HIGH
---

# OpenClaw (OCL) task verification

**Task specs:** `/home/sk/mdeai/tasks/openclaw/tasks/OCL-*.md`  
**Sources hub:** [`tasks/openclaw/docs/sources.md`](../../../../tasks/openclaw/docs/sources.md)  
**Index:** [`tasks/openclaw/index-ocl.md`](../../../../tasks/openclaw/index-ocl.md)

## Skills to load

| Phase | Skills |
|-------|--------|
| VPS / gateway | `open-claw`, `mde-hostinger` |
| ClawHub policy | `open-claw` → `references/clawhub.md`, `code-review` |
| Mastra seam | `mastra`, `copilotkit-integrations`, `mde-supabase` |
| Done gate | **this skill** (`task-verifier`) |

## Probes (VPS tasks)

| Claim | Probe |
|-------|--------|
| Gateway up | `curl -sS "$OPENCLAW_GATEWAY_URL/health"` → 200 |
| No secret in mdeapp client | `rg service.role\|OPENCLAW_GATEWAY_TOKEN mdeapp/src` — token server-side only |
| Custom skills only | Prod compose / VPS: no `clawhub install` in startup; only `skills/mde-*` |
| Approval before job | SQL: no `openclaw_jobs` without matching `automation_approvals.approved` |
| Docs match version | Fetch [llms.txt](https://docs.openclaw.ai/llms.txt) when config flags disagree with spec |

## Official references (do not skip)

- [https://docs.openclaw.ai/](https://docs.openclaw.ai/)
- [https://docs.openclaw.ai/llms.txt](https://docs.openclaw.ai/llms.txt)
- [https://github.com/openclaw/openclaw/tree/main/docs](https://github.com/openclaw/openclaw/tree/main/docs)

Record evidence in `tasks/notes/OCL-mvp-evidence.md` (or tier-specific note). Pure-doc tasks: mark N/A explicitly.
