---
id: OCL-038-postmvp
tier: post-mvp
title: Events — public event source connector adapters
status: Open
priority: P2
depends_on: [OCL-017-postmvp, OCL-030-postmvp, OCL-036-postmvp]
skill: [open-claw, mde-task-lifecycle]
sources_index: ../docs/sources.md
research:
  - ../docs/event-repos-skills-scorecard.md
references:
  - bmoore117/luma-events
  - itsuzef/openclaw-live-events
  - ClawNewsde/openclaw-meetup-skill
---

# OCL-038-postmvp — Event source connector adapters

## Objective

Define mdeai-owned adapters for public event sources inspired by Luma, Ticketmaster-style search, Meetup/community discovery, Eventbrite/Eventee/Eventzilla concepts, and Apify Actors.

## Why this is needed

Event discovery is valuable only if imported events enter a review queue with source evidence. mdeai should learn connector patterns from repos and skills, but normalize them into one safe candidate schema.

## Scope

| Source type | Adapter output |
|---|---|
| Luma-like calendars | Public event candidates with source URL, organizer, time, venue text, and confidence. |
| Ticketmaster-style API | API-backed public events with external ID and category. |
| Meetup/community pages | Medellin community events with neighborhood and audience tags. |
| Eventbrite/Eventee/Eventzilla concepts | Candidate source model only until auth/scraping risk is reviewed. |
| Apify Actors | Sandbox-only connector runs with dataset pointer and cost metadata. |

## Forbidden

- No credentialed account scraping in MVP or post-MVP connector adapters.
- No auto-publishing imported events.
- No writing directly to public `events` truth tables.

## Acceptance Criteria

- All connector outputs normalize into one `event_candidates` draft shape.
- Imported candidates include source URL, fetch timestamp, confidence, and raw snapshot pointer.
- Patricia reviews candidates before promotion.
- Duplicate detection uses deterministic keys first, AI only for suggestions.
- Tests cover duplicate candidate rejection and no direct event publish.
