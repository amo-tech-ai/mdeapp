---
id: EVP-046-mvp
linear: SAN-149
tier: mvp
title: Live event updates feed
status: Open
priority: P2
depends_on: [EVP-032-mvp, EVP-035-mvp, EVP-044-mvp]
skill: [mde-task-lifecycle]
surfaces:
  - /events/[slug]
  - /host/events
  - /me/tickets
---

# EVP-046-mvp — Live event updates feed

## Objective

Create a host-controlled live updates feed for schedule changes, arrival notes, room changes, and important event-day notices.

## Real-world example

Visionarios Night changes rooftop access at 8:30 PM. Roberto posts an update visible to registered attendees and on the event page if public.

## User story

As an attendee, I want trustworthy updates during the event without needing to search chat history.

## Workflow

1. Host creates update with visibility: public, registered-only, staff-only.
2. Optional AI rewrites for clarity.
3. Host confirms publish.
4. Event page/ticket wallet shows latest updates.

## Acceptance Criteria

- Updates are host/admin authored or approved.
- Visibility rules are enforced.
- AI rewrite is draft-only.
- Registered-only updates do not leak publicly.
- Tests cover public, registered-only, staff-only, and deleted update states.
