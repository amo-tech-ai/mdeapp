---
legacy_id: EVT-046
linear: SAN-505
linear_url: https://linear.app/sanjiovani/issue/SAN-505/evt-046-auto-follow-up-wa-drafts-24h
task_id: veb-014-advanced
tier: advanced
title: Auto follow-up WhatsApp drafts (24h no reply)
layer: mastra
priority: P2
status: Not Started
estimated_effort: 2 days
depends_on: [veb-011, ven-023]
unblocks: []
skills: [mastra, gemini, mde-supabase]
description: Cron/workflow drafts follow-up when venue silent 24h — Patricia still approves before send.
---

# VEB-014-advanced — Auto follow-up WA drafts

> **Linear:** [EVT-046 — Auto follow-up WhatsApp drafts (24h no reply)](https://linear.app/sanjiovani/issue/SAN-505/evt-046-auto-follow-up-wa-drafts-24h) · **Project:** [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues)

## Phase 2+ automation — draft only, Patricia approves.

## What we're building

When `status=sent` and no venue reply for 24h, Mastra drafts a polite follow-up → Patricia queue — **never auto-send**.

## Workflow

```mermaid
sequenceDiagram
  participant CRON as Scheduled job
  participant W as followUpDraftWorkflow
  participant DB as venue_booking_requests
  participant P as Patricia

  CRON->>W: Check sent + stale > 24h
  W->>DB: Load request + thread
  W->>W: Gemini draft follow-up
  W->>DB: UPDATE whatsapp_draft_followup
  W->>P: Queue notification
  P->>P: Approve / edit / skip
```

## Acceptance criteria

- [ ] Feature flag `VENUE_AUTO_FOLLOWUP=0` default off
- [ ] Max 1 follow-up draft per request
- [ ] Audit log entry on draft creation
- [ ] Suppression if user cancelled or venue confirmed

## Related

- [`venues-booking.md`](../../docs/venues-booking.md) §6 Advanced AI
