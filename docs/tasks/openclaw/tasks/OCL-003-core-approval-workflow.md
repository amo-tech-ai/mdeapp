---
id: OCL-003-core
tier: core
title: Mastra openclaw-approval-workflow
status: Open
priority: P0
phase: OCL-0
effort: M
owner: claude
depends_on: [OCL-002-core]
blocks: [OCL-008-mvp, OCL-011-mvp, OCL-012-mvp]
skill: [open-claw, mastra, copilotkit-integrations, mde-supabase]
mcp: [user-mastra, user-supabase]
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/automation/hooks
  - https://docs.openclaw.ai/gateway/tools-invoke-http-api
github:
  - https://github.com/openclaw/openclaw
---

# OCL-003-core — Approval workflow

## At a glance

**Patricia** approves; only then `openclaw_jobs.status = queued`.

## Wiring

| File | Action |
|------|--------|
| `mdeapp/src/mastra/workflows/openclaw-approval-workflow.ts` | Create |
| `mdeapp/src/mastra/tools/enqueue-openclaw-job.ts` | Create (or OCL-011-mvp) |

## Acceptance

1. Insert without `approval_id` rejected.
2. Vitest covers reject path.
3. CopilotKit never calls OpenClaw directly — Mastra only.
