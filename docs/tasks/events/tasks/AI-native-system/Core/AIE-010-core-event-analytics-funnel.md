---
id: AIE-010-core
title: Event analytics funnel + event_views
status: Not Started
priority: P1
phase: core
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-008]
blocks: []
depends_on: [AIE-003]
wireframe: ../../wireframes/events/014-event-analytics.md
---

# AIE-010-core — Event analytics funnel

## Objective

Conversion funnel on analytics: view → detail → checkout → paid.

## Schema

```sql
event_views(event_id, session_id, utm_source, created_at)
visitor_sessions(id, user_id, started_at)
```

## Acceptance criteria

- Migration + RLS
- `/events/[slug]` records view (server or edge)
- Funnel chart on analytics right panel
- Numbers from SQL; agent explains only
