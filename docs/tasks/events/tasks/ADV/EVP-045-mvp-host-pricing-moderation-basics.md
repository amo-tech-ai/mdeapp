---
id: EVP-045-mvp
linear: SAN-148
tier: mvp
title: Host pricing suggestions and moderation basics
status: Open
priority: P2
depends_on: [EVP-010-core, EVP-012-core, EVP-034-mvp]
skill: [mastra, mde-task-lifecycle]
surfaces:
  - /host/event/new
  - /host/events
  - /admin/approvals
---

# EVP-045-mvp — Host pricing and moderation basics

## Objective

Add two host-side primitives: AI-assisted ticket pricing suggestions and basic moderation for Q&A/community content.

## Real-world example

Roberto creates a networking event. mdeai suggests VIP and general admission price ranges from comparable mdeai events, but Roberto chooses the final price. Patricia can flag spam Q&A before it appears publicly.

## User story

As a host, I want guidance on pricing and safety, but I need final control over money and public moderation.

## Workflow

1. Host enters venue, audience size, format, ticket types, and target audience.
2. Mastra suggests pricing ranges with reasons.
3. Host edits and approves final ticket tiers.
4. Q&A/community submissions pass basic spam/scam moderation before public display.

## Acceptance Criteria

- AI pricing is suggestion-only and never writes final prices directly.
- Final ticket prices are written only through approved host action.
- Moderation flags spam/scam/unsafe submissions for review.
- Ban/hide actions are human-approved.
- Tests prove AI cannot finalize price or moderation ban alone.
