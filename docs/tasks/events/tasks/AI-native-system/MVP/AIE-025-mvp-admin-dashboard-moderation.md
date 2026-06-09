---
id: AIE-025-mvp
title: Admin dashboard + moderation
status: Not Started
priority: P2
phase: mvp
persona: patricia
linear: —
percent: 0
blocked_by: [AIE-003]
blocks: [AIE-030]
depends_on: []
wireframe: ../../wireframes/events/019-admin-dashboard.md, 020-moderation.md
---

# AIE-025-mvp — Admin dashboard

## Objective

Patricia ops: `/admin` KPIs + `/admin/events` moderation queue with approval actions.

## Acceptance criteria

- Admin role gate (RLS + middleware)
- Moderation ties to `approval_logs`
- Event health rollup on dashboard (optional card)
