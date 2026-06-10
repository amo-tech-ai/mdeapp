---
id: EVP-035-mvp
linear: SAN-138
tier: mvp
title: Attendee profiles and audience breakdown
status: Open
priority: P2
depends_on: [EVP-002-core, EVP-032-mvp]
skill: [mde-task-lifecycle]
surfaces:
  - /events/[slug]
  - /me/tickets
---

# EVP-035-mvp — Attendee profiles and audience breakdown

## Objective

Add Luma-style social proof: going count, optional attendee visibility, and privacy-safe audience breakdown.

## Real-world example

"69 going" becomes "32 founders, 12 marketers, 8 AI builders, 5 investors" with optional visible attendee avatars for users who opt in.

## User story

As a guest, I want to know whether the room has people I want to meet before I register.

## Workflow

1. Ticket buyer can opt into visible attendee profile.
2. Profile captures role/interests with privacy controls.
3. Event page shows aggregate audience categories.
4. AI may summarize the audience, but cannot expose private details.

## Acceptance Criteria

- Attendee visibility is opt-in.
- Aggregates render only above privacy thresholds.
- Event page shows going count and audience breakdown.
- No private attendee fields leak to anonymous users.
- Tests cover anonymous, logged-in, opt-in, and opt-out states.
