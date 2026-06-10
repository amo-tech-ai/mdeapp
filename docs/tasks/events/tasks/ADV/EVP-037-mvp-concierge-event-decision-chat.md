---
id: EVP-037-mvp
linear: SAN-140
tier: mvp
title: AI event decision concierge
status: Open
priority: P1
depends_on: [EVP-004-core, EVP-005-core, EVP-033-mvp, EVP-035-mvp]
skill: [copilotkit, mastra, mde-task-lifecycle]
surfaces:
  - /
  - /chat
  - /events/[slug]
---

# EVP-037-mvp — AI event decision concierge

## Objective

Teach the concierge to answer event decision questions: "Should I go?", "Who will I meet?", "Is this good for founders?", "Can I come solo?", "What should I wear?", and "What can I do nearby?"

## Real-world example

Camila asks, "I want startup networking with ambitious people this week in Poblado." mdeai returns events, host signals, attendee vibe, map pins, nearby options, and why each event matches.

## User story

As a guest, I want to talk through event decisions like I would with a local friend.

## Workflow

1. User asks natural-language event intent.
2. Mastra searches Supabase events first.
3. It combines event tags, summaries, venue context, and attendee aggregates.
4. CopilotKit renders recommendation cards with reasons.
5. User can ask follow-up questions or open event detail.

## Acceptance Criteria

- Concierge answers decision questions using deterministic event data first.
- AI labels uncertainty and does not invent attendees.
- Cards include "why it matches" and map focus actions.
- Follow-up questions preserve selected event context.
- Tests cover founder, solo attendee, dress code, and nearby-plan prompts.
