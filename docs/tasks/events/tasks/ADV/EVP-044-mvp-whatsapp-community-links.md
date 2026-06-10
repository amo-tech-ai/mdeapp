---
id: EVP-044-mvp
linear: SAN-147
tier: mvp
title: WhatsApp and community links
status: Open
priority: P1
depends_on: [EVP-032-mvp, EVP-034-mvp]
skill: [mde-task-lifecycle]
surfaces:
  - /events/[slug]
  - /host/events
---

# EVP-044-mvp — WhatsApp and community links

## Objective

Show approved WhatsApp/community links on event pages without building outbound messaging automation.

## Real-world example

After registering for Visionarios Night, Andres sees an approved Parceros Community WhatsApp link and recurring community card.

## User story

As an attendee, I want to join the event/community conversation in the channel people actually use in Colombia.

## Workflow

1. Host adds community link in host dashboard.
2. Admin/host confirms visibility rules: public, registered-only, or hidden.
3. Event page shows community link according to status.
4. Link clicks are logged for analytics.

## Acceptance Criteria

- Community links are host/admin controlled.
- Registered-only links are not visible to anonymous users.
- No automated WhatsApp sending is included in this MVP task.
- Event page has clear community section and empty state.
- Tests cover public, registered-only, hidden, and invalid URL states.
