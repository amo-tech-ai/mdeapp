---
id: AIE-026-mvp
title: Admin AI runs observability UI
status: Not Started
priority: P2
phase: mvp
persona: patricia
linear: —
percent: 0
blocked_by: [AIE-004, AIE-003]
blocks: []
depends_on: []
wireframe: ../../wireframes/events/022-admin-operations.md
---

# AIE-026-mvp — AI observability admin

## Objective

`/admin/ai-runs` or section in `/admin/ops` — agent history, workflow_runs, failures, token usage.

## Acceptance criteria

- Reads `ai_runs` + `workflow_runs` (no PII leak)
- Filter by agent, status, date
- Links to Sentry for failures
