---
id: EVP-026-mvp
linear: SAN-129
legacy_id: EVT-D09
title: Human approval save flow
status: Not Started
priority: P2
phase: Post-MVP
effort: 2d
depends_on: [EVP-020-mvp-discovered-events-data-model, EVP-011-core-approval-panel-hitl]
parent_pack: EVP-018-mvp-event-web-discovery-task-pack.md
---

# EVP-026-mvp — Human approval save flow

## Flow

1. AI proposes discovered event → `event_approval_queue`
2. Patricia / Roberto reviews in admin or host UI
3. Edit fields (title, date, venue, price, source URL)
4. Approve → edge fn writes `public.events` + audit log
5. Reject → store reason; no write

## Reuse

- Pattern from EVP-011-core `ApprovalPanel` + EVP-012-core `approval-commit`
- New edge: `discovered-event-commit` (separate from host publish)

## Acceptance criteria

- [ ] RLS: only approvers can flip status
- [ ] Idempotent approve (same discovery_id)
- [ ] Playwright HITL smoke
- [ ] Mermaid approval flow diagram in evidence
