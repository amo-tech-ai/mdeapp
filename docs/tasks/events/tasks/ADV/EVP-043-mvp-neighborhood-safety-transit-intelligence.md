---
id: EVP-043-mvp
linear: SAN-146
tier: mvp
title: Neighborhood, safety, transit, and weather intelligence
status: Open
priority: P1
depends_on: [EVP-016-mvp, EVP-024-mvp, EVP-036-mvp]
skill: [mde-maps, mastra, mde-task-lifecycle]
surfaces:
  - /events/[slug]
  - /
---

# EVP-043-mvp — Neighborhood, safety, transit, and weather intelligence

## Objective

Add Medellin-specific context to event planning: neighborhood vibe, safer movement guidance, Metro/ride timing, weather-aware suggestions, and venue-area notes.

## Real-world example

For an El Poblado rooftop event, mdeai suggests arriving by ride-share after 9 PM, shows nearby pickup points, notes rain risk, and recommends indoor backup spots.

## User story

As an expat or nomad, I want local context so I can attend confidently.

## Workflow

1. Event has venue coordinates or neighborhood.
2. Maps/Places/Routes gather deterministic location facts.
3. Optional weather source adds event-window conditions.
4. Mastra summarizes safe, non-alarmist local guidance.
5. Event page and concierge show actionable context.

## Acceptance Criteria

- Places/Routes calls use approved field masks and server-side keys.
- Safety notes are phrased as practical guidance, not guarantees.
- Exact secret venue stays hidden until registration when configured.
- Weather/route failures degrade gracefully.
- Tests cover Poblado, Laureles, missing venue, and gated location states.
