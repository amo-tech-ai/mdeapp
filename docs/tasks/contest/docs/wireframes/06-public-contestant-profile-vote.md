---
title: Public Contestant Profile And Vote Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-06
path: /contests/[slug]/contestants/[id]
persona: Fan / Contestant
task: CTEST-010
phase: MVP
repo_refs:
  - Photography Contest ReactJS
  - Helios Server
code_refs:
  - /home/sk/mdeai/mdeapp/src/components/ui/card.tsx
  - /home/sk/mdeai/mdeapp/src/components/ui/button.tsx
  - /home/sk/mdeai/mdeapp/src/components/ui/badge.tsx
---

# Public Contestant Profile And Vote

## Purpose

Fans view a contestant profile, vote, share the profile, and understand the receipt/status of their support.

## Wireframe

```text
+------------------------------------------------------------------+
| Contest breadcrumb                                  Share | Vote  |
+-------------------------------+----------------------------------+
| Hero photo / gallery          | Name, division, district         |
| Approved public photos        | Bio, platform, event attendance  |
|                               | Vote count/status, receipt note  |
+-------------------------------+----------------------------------+
| Fan actions: Vote | Buy ticket | Copy link | WhatsApp share       |
+------------------------------------------------------------------+
```

## Components And Code To Use

- Build with shadcn `Card`, `Button`, `Badge`, `Avatar`, `Dialog`, `Tooltip`.
- Use Photography Contest ReactJS only for visual inspiration.
- Use Helios concepts for receipt/status language, backed by Supabase vote ledger.

## States

Approved profile, pending profile hidden, missing photos, voting closed, vote success, vote pending, share copied, fraud review hold.

## Responsive

Mobile puts photo first, then sticky vote/share bar. Desktop uses two-column hero and gallery below.

## Tests / Proof

Public profile route smoke, pending-profile privacy test, vote CTA state tests, share link test, receipt display test.

## Confidence

High. Needs DB privacy rules before shipping.
