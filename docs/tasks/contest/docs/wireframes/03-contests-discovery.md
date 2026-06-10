---
title: Contest Discovery Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-03
path: /contests
persona: Fan / Contestant
task: CTEST-006
phase: MVP
repo_refs:
  - Photography Contest ReactJS
  - Existing mdeapp events browsing
code_refs:
  - /home/sk/mdeai/mdeapp/src/app/events/[slug]/page.tsx
  - /home/sk/mdeai/mdeapp/src/components/events/event-detail-view.tsx
  - /home/sk/mdeai/mdeapp/src/components/empty/empty-state.tsx
---

# Contest Discovery

## Purpose

Fans and prospective contestants browse contests, filter by timing/category, and choose apply, vote, or tickets.

## Wireframe

```text
+------------------------------------------------------------------+
| Contests                                                          |
| Search | Category | Date | Neighborhood                          |
+------------------------------------------------------------------+
| Contest card: title, venue, date, applications open, vote CTA     |
| Contest card: title, venue, date, ticket CTA, contestants preview |
| Contest card: title, venue, date, closed badge                    |
+------------------------------------------------------------------+
```

## Components And Code To Use

- Adapt event browse/detail card language from existing events components.
- Use shadcn `Input`, `Button`, `Badge`, `Card`, `Skeleton`.
- Use photo contest repos only for gallery/card visual inspiration.

## States

Loading, no contests, filtered no results, applications open, voting open, ticket sales open, closed contest.

## Responsive

Mobile stacks filters in a compact drawer. Tablet uses two-column cards. Desktop uses three-column card grid with stable image aspect ratio.

## Tests / Proof

Filter interaction test, no-results test, CTA link test, visual proof for `375`, `768`, `1440`.

## Confidence

High. Existing events UI is a close match.
