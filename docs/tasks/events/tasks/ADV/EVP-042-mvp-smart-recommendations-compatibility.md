---
id: EVP-042-mvp
linear: SAN-145
tier: mvp
title: Smart event recommendations and compatibility score
status: Open
priority: P1
depends_on: [EVP-033-mvp, EVP-035-mvp, EVP-037-mvp]
skill: [mastra, copilotkit, mde-task-lifecycle]
surfaces:
  - /
  - /events/[slug]
---

# EVP-042-mvp — Smart recommendations and compatibility

## Objective

Add deterministic-first event recommendations with an optional AI explanation and later compatibility score.

## Real-world example

Camila says, "I want startup networking with ambitious people this week in Poblado." mdeai recommends Visionarios Night because it matches startup-heavy, international, founder/creator audience, El Poblado, and evening timing.

## User story

As a guest, I want mdeai to explain why an event fits my goals instead of showing a generic list.

## Workflow

1. User gives goals, neighborhood, time, language, and interests.
2. SQL filters eligible events.
3. Deterministic score ranks matches by tags, date, location, price, and audience categories.
4. AI writes a short reason using only retrieved fields.
5. CopilotKit renders recommendation cards with "why this matches."

## Acceptance Criteria

- Recommendation score uses deterministic inputs first.
- AI explanation cannot invent attendees or event facts.
- Cards show top match reasons.
- Compatibility score is hidden unless enough user/profile/event data exists.
- Tests cover founder, creator, solo attendee, and neighborhood-specific queries.
