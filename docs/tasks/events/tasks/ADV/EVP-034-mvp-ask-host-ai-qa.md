---
id: EVP-034-mvp
linear: SAN-137
tier: mvp
title: Ask Host and AI Q&A assistant
status: Open
priority: P1
depends_on: [EVP-032-mvp, EVP-012-core]
skill: [copilotkit, mastra, mde-task-lifecycle]
surfaces:
  - /events/[slug]
  - /host/events
  - /admin/approvals
---

# EVP-034-mvp — Ask Host and AI Q&A assistant

## Objective

Add an Ask Host section where guests can ask event-specific questions. AI can draft instant answers from approved event context, but host/admin approval controls public answers.

## Real-world example

Andres asks, "Can I come alone?" The AI drafts: "Yes, this event is designed for solo attendees and includes moderated networking circles." Roberto can approve or edit the answer.

## User story

As a guest, I want low-friction answers before registering. As a host, I want AI help answering repetitive questions without losing control.

## Workflow

1. Guest asks a question on event detail.
2. Mastra generates answer from event context and policy.
3. If answer is low-risk, show as AI draft with "host confirmation pending" or save for host review.
4. Host approves/edits in `/host/events`.
5. Approved Q&A becomes public.

## Acceptance Criteria

- Q&A table has RLS and moderation status.
- AI answer never becomes official host answer without approval.
- Common prompts exist: come solo, English okay, dress code, parking, networking format, investor/founder fit.
- Host dashboard shows pending questions.
- Tests cover pending, approved, rejected, and unsafe question paths.
