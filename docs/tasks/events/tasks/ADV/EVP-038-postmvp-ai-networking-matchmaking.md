---
id: EVP-038-postmvp
linear: SAN-141
tier: post-mvp
title: AI networking matchmaking and icebreakers
status: Open
priority: P2
depends_on: [EVP-035-mvp, EVP-037-mvp]
skill: [mastra, copilotkit, mde-task-lifecycle]
surfaces:
  - /events/[slug]
  - /me/tickets
---

# EVP-038-postmvp — AI networking matchmaking and icebreakers

## Objective

Add opt-in networking recommendations and icebreakers for attendees.

## Real-world example

An AI founder gets: "Talk to Akram. He works on growth partnerships and community building. Start with: 'I saw you help scale founder communities...'"

## User story

As an attendee, I want help meeting relevant people without awkward guessing.

## Workflow

1. Attendee opts into networking profile.
2. AI compares interests against opt-in attendee profiles.
3. It suggests people/groups to meet and draft icebreakers.
4. User controls whether to request an intro.

## Acceptance Criteria

- Matchmaking is opt-in only.
- No private contact details are exposed.
- AI suggestions include reasons and confidence.
- Users can hide/report bad suggestions.
- Tests cover opt-in, opt-out, and privacy threshold behavior.
