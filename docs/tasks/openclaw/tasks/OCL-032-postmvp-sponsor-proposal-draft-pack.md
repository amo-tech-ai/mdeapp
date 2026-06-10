---
id: OCL-032-postmvp
tier: post-mvp
title: Events — sponsor proposal draft pack
status: Open
priority: P1
depends_on: [EVP-029-advanced, OCL-019-postmvp, OCL-031-postmvp]
skill: [open-claw, mastra, mde-supabase, gemini]
sources_index: ../docs/sources.md
---

# OCL-032-postmvp — Sponsor proposal draft pack

## Objective

Generate approval-ready sponsor proposal drafts for events without sending anything automatically.

## Draft outputs

| Output | Purpose |
|---|---|
| Sponsor fit summary | Why this sponsor fits this event audience. |
| Package recommendation | Suggested package tier and activation options. |
| Email/WhatsApp draft | Human-reviewed outreach copy. |
| One-page proposal text | Copy for PDF/deck generation. |
| ROI promise guardrail | Claims limited to available SQL metrics and forecast labels. |
| Follow-up schedule | Draft reminders, not auto-sends. |

## Workflow

```text
Sponsor prospect + event facts
  -> OpenClaw collects public evidence
  -> Gemini drafts proposal pack
  -> Supabase stores proposal_draft
  -> Patricia approves, edits, or rejects
  -> optional Postiz/email/WhatsApp handoff after approval
```

## Acceptance Criteria

- Proposal drafts cite source URLs.
- All claims are labeled actual, estimated, or proposed.
- No proposal is sent without approval.
- Draft includes sponsor decision-maker type from OCL-031 when available.
- Rejected drafts are retained for audit and model improvement.
