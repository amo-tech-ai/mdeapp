---
id: EVP-040-postmvp
linear: SAN-143
tier: post-mvp
title: Post-event follow-up assistant
status: Open
priority: P2
depends_on: [EVP-038-postmvp]
skill: [mastra, copilotkit, mde-task-lifecycle]
surfaces:
  - /me/tickets
  - /events/[slug]
---

# EVP-040-postmvp — Post-event follow-up assistant

## Objective

Keep relationships alive after events with AI-assisted notes, follow-up drafts, and optional intro reminders.

## Real-world example

After Visionarios Night, Camila asks mdeai to draft a follow-up to an AI founder she met from Toronto.

## User story

As an attendee, I want mdeai to help me turn event conversations into relationships.

## Workflow

1. After event, attendee opens follow-up assistant.
2. User enters who they met or selects opt-in attendee.
3. AI drafts LinkedIn/WhatsApp/email follow-up.
4. User edits and sends manually unless future approved channel gates exist.

## Acceptance Criteria

- AI drafts are user-controlled and not auto-sent.
- User can save notes privately.
- Opt-in attendee references respect privacy settings.
- Follow-up prompts are available only after event start/end window.
- Tests cover draft-only behavior.
