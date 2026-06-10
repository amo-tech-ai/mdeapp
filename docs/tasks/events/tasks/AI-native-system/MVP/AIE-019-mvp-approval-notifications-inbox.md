---
id: AIE-019-mvp
title: Approvals + notifications + host inbox
status: Not Started
priority: P1
phase: mvp
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-003]
blocks: []
depends_on: []
wireframe: ../../wireframes/events/021-approval-center.md, 023-notifications.md, 024-inbox.md
---

# AIE-019-mvp — Unified comms + approvals

## Objective

Stop scattering HITL — unified queue + platform notifications + host guest Q&A inbox.

## Routes

| Route | Purpose |
|-------|---------|
| `/host/approvals` | publish, price, sponsor, blast history |
| `/me/notifications` | ticket + event + sponsor updates |
| `/host/inbox` | host ↔ attendee messages |

## Acceptance criteria

- `approval_logs` rows visible on 021
- Notification preferences stub OK
- Inbox threads tied to `messages` table + RLS
