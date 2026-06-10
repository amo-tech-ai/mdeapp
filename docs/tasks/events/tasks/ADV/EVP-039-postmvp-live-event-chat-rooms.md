---
id: EVP-039-postmvp
linear: SAN-142
tier: post-mvp
title: Live event chat and networking rooms
status: Open
priority: P3
depends_on: [EVP-035-mvp, EVP-038-postmvp]
skill: [mde-task-lifecycle]
surfaces:
  - /events/[slug]
  - /me/tickets
---

# EVP-039-postmvp — Live event chat and networking rooms

## Objective

Create moderated event chat and themed networking rooms for ticket holders.

## Real-world example

During Visionarios Night, rooms include AI founders, creators, real estate investors, women in tech, and remote workers.

## User story

As an attendee, I want to find the right mini-room or conversation before and during the event.

## Workflow

1. Ticket holder joins event chat.
2. Host creates or approves themed rooms.
3. Attendees join rooms and ask questions.
4. Moderation queue handles reports and unsafe content.

## Acceptance Criteria

- Chat is ticket-holder or approved-community gated.
- Rooms have host/admin moderation.
- AI can suggest rooms but not create public rooms without approval.
- Realtime load limits and abuse protections exist.
- Tests cover access control and moderation states.
