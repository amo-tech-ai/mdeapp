---
id: EVP-032-mvp
linear: SAN-135
tier: mvp
title: Luma-style event detail layout
status: Open
priority: P1
depends_on: [EVP-013-core, EVP-016-mvp]
skill: [mde-wireframe, mde-task-lifecycle]
surfaces:
  - /events/[slug]
  - event detail sheet from chat
---

# EVP-032-mvp — Luma-style event detail layout

## Objective

Upgrade `/events/[slug]` from a commerce-first page into a clean, mobile-first event experience inspired by Luma: hero, host, vibe, attendees, AI summary, timeline, location, nearby context, and sticky CTA.

## Real-world example

Camila opens "Visionarios Night: Medellin Edition" and immediately understands who hosts it, who attends, why it matters, where it is, and whether she should register.

## User story

As an event guest, I want the event page to feel like a curated community experience, not just a ticket checkout page.

## Workflow

1. User opens event detail from chat, map, or share link.
2. Page shows image, title, host, time, neighborhood, price, and CTA.
3. User scans AI summary, who-you-will-meet, timeline, location, and tickets.
4. User registers or asks a question.

## Acceptance Criteria

- `/events/[slug]` has sections for hero, host, AI summary placeholder, who-you-will-meet placeholder, timeline placeholder, location/map placeholder, and tickets.
- Existing ticket checkout still works.
- Mobile sticky CTA remains visible without covering content.
- Empty states exist when host/attendee/timeline data is not available.
- Playwright screenshot covers mobile and desktop.
