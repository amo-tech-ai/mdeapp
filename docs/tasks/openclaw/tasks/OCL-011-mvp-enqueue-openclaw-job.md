---
id: OCL-011-mvp
tier: mvp
title: Mastra enqueueOpenClawJob tool
status: Open
priority: P1
depends_on: [OCL-003-core]
skill: [open-claw, mastra, mde-supabase]
mcp: [user-mastra]
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/gateway/tools-invoke-http-api
  - https://docs.openclaw.ai/concepts/openclaw-sdk
github:
  - https://github.com/openclaw/openclaw
---

# OCL-011-mvp — Enqueue tool

`enqueueOpenClawJob({ job_type, payload })` → creates approval request or pending job per workflow. Concierge may **propose** only. Acceptance: no auto-queue without approval record.
