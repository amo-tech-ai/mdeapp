---
id: OCL-027-advanced
tier: advanced
title: Marketing — Postiz approved post handoff
status: Open
priority: P3
depends_on: [OCL-003-core, OCL-032-postmvp, OCL-034-postmvp]
skill: [open-claw, mde-hostinger]
deferred_skill: [postiz]
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/automation/tasks
github:
  - https://github.com/openclaw/openclaw
---

# OCL-027-advanced — Postiz

Approved social copy → Postiz VPS schedule. Phase 2+ only; Postiz skill 🔴 in index-skills until enabled.

## Scope

- Event announcement posts.
- Sponsor co-branded posts.
- Venue countdown posts.
- Contest finalist announcement drafts.
- Creator/influencer collaboration drafts.

## Rules

- No unapproved scheduling.
- No autonomous Instagram/Facebook posting outside Postiz-approved workflow.
- No DMs, comments, likes, follows, or engagement automation.
- Every scheduled item must carry `campaign_id`, `approval_id`, channel, copy, asset, and rollback/cancel path.
