---
id: OCL-035-advanced
tier: advanced
title: Events — approved WhatsApp/Postiz/social campaign execution
status: Open
priority: P3
depends_on: [OCL-022-advanced, OCL-027-advanced, OCL-032-postmvp, OCL-034-postmvp]
skill: [open-claw, mde-hostinger, mde-supabase]
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/channels/whatsapp
  - https://docs.openclaw.ai/automation/tasks
---

# OCL-035-advanced — Approved channel campaigns

## Objective

Execute approved event, sponsor, and creator campaigns through WhatsApp templates, Postiz scheduling, and approved social handoffs.

## Channels

| Channel | Allowed action |
|---|---|
| WhatsApp | Opt-in template reminders, ticket reminders, sponsor asset reminders, staff alerts. |
| Postiz | Schedule approved posts from approved campaign records. |
| Instagram/Facebook | Draft captions/assets or Postiz handoff only. |
| Email | Approved sponsor/vendor follow-up drafts or sends if configured. |

## Required gates

- Campaign approval row.
- Audience opt-in proof for WhatsApp.
- Per-channel rate limit.
- Per-message preview.
- Kill switch.
- Delivery log.
- Rollback/cancel path for scheduled posts.

## Acceptance Criteria

- No campaign can execute without approval.
- WhatsApp sends use approved templates and opted-in recipients.
- Postiz receives only approved content.
- Delivery logs include actor, campaign ID, channel, timestamp, and result.
- Failed sends surface in `/admin/approvals` or campaign ops queue.
