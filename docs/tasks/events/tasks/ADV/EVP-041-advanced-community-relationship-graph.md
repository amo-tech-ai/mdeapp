---
id: EVP-041-advanced
linear: SAN-144
tier: advanced
title: Community relationship graph
status: Open
priority: P3
depends_on: [EVP-038-postmvp, EVP-039-postmvp, EVP-040-postmvp]
skill: [mde-task-lifecycle]
surfaces:
  - /events/[slug]
  - /saved
  - /trips
---

# EVP-041-advanced — Community relationship graph

## Objective

Connect events into recurring communities, relationship history, introductions, and personalized discovery.

## Real-world example

mdeai learns that a user attends AI founder events, saves coworking spaces, and asks for investor meetups, then recommends recurring communities and intros.

## User story

As a returning user, I want mdeai to remember the communities and people that matter to me.

## Workflow

1. User opts into relationship memory.
2. Events, saved places, and attendee interactions create private graph edges.
3. AI recommends communities, events, and follow-ups.
4. User can inspect/delete memory.

## Acceptance Criteria

- Relationship graph is opt-in and user-deletable.
- Private memory is not exposed to hosts or other attendees.
- Recommendations explain why they were shown.
- Admin cannot use graph for spam campaigns.
- Tests cover opt-in, deletion, and recommendation audit trail.
