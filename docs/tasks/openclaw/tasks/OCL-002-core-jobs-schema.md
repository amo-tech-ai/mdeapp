---
id: OCL-002-core
tier: core
title: Supabase openclaw_jobs + automation_approvals
status: Open
priority: P0
phase: OCL-0
effort: M
owner: claude
depends_on: [F08]
blocks: [OCL-003-core, OCL-011-mvp]
skill: [open-claw, mde-supabase, task-verifier]
mcp: [user-supabase]
sources_index: ../docs/sources.md
---

# OCL-002-core — Jobs schema

## Tables

`automation_approvals`, `openclaw_jobs`, `openclaw_job_results`, `agent_tool_logs` (optional `outbox_events`).

## Acceptance

1. RLS on; anon cannot insert jobs.
2. MCP advisors clean.
3. `job_type` enum documented in INDEX.

## Ref

`plan/openclaw/tasks/01-openclaw-adk.md` §10
