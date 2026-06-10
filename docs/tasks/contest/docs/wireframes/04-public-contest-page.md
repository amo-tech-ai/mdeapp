---
title: Public Contest Page Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-04
path: /contests/[slug]
persona: Fan / Contestant
task: CTEST-006
phase: MVP
repo_refs:
  - Photography Contest ReactJS
  - Hi.Events
code_refs:
  - /home/sk/mdeai/mdeapp/src/app/events/[slug]/page.tsx
  - /home/sk/mdeai/mdeapp/src/components/events/event-detail-view.tsx
  - /home/sk/mdeai/mdeapp/src/components/events/event-ticket-tiers.tsx
---

# Public Contest Page

## Purpose

The public hub explains the contest, shows contestants, and routes people to apply, vote, share, or buy tickets.

## Wireframe

```text
+------------------------------------------------------------------+
| Miss Medellin Beauty Contest                                     |
| Date | Venue | Apply | Vote now | Buy tickets                    |
+------------------------------------------------------------------+
| Contestants grid                                                 |
| [Photo Name District Vote] [Photo Name District Vote]             |
+--------------------------------+---------------------------------+
| Schedule and rounds             | Sponsor highlights              |
| Casting, rehearsal, finals      | VIP sponsor slots               |
+--------------------------------+---------------------------------+
```

## Components And Code To Use

- Adapt public event detail route and ticket tier display.
- Use shadcn `Button`, `Badge`, `Card`, `Skeleton`, `Tooltip`.
- Use Hi.Events only for ticket tier modeling. Do not copy AGPL source.

## States

Unpublished, published, applications closed, voting closed, sold out, no approved contestants, role-only preview.

## Responsive

Mobile places primary CTA buttons in a sticky bottom bar. Desktop keeps CTA group in the upper content band and contestants in a grid.

## Tests / Proof

Public route smoke, unpublished access behavior, CTA target checks, mobile sticky CTA screenshot.

## Confidence

High. It extends the existing event detail pattern.
