---
title: Contest Vote Checkout Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-07
path: /contests/[slug]/vote
persona: Fan
task: CTEST-006
phase: MVP
repo_refs:
  - Helios Server
  - Hi.Events
code_refs:
  - /home/sk/mdeai/mdeapp/src/app/api/tickets/checkout/route.ts
  - /home/sk/mdeai/mdeapp/src/components/modals/booking-checkout-modal.tsx
  - /home/sk/mdeai/mdeapp/src/lib/tickets/ticket-checkout-schema.ts
---

# Contest Vote Checkout

## Purpose

Fans select a contestant, choose free or paid votes, submit payment when needed, and receive vote receipt proof.

## Wireframe

```text
+------------------------------------------------------------------+
| Vote for a contestant                                             |
+----------------------------+-------------------------------------+
| Contestant picker          | Vote summary                        |
| Vote package selector      | Free vote eligibility               |
| Stripe checkout handoff    | Receipt hash/status after submit    |
| Terms and fraud notice     | Help / dispute link                 |
+----------------------------+-------------------------------------+
```

## Components And Code To Use

- Adapt ticket checkout schema and checkout modal for paid vote purchase flow.
- Use shadcn `RadioGroup`, `Button`, `Card`, `Badge`, `Dialog`, `Skeleton`.
- Use Helios for receipt and tally-freeze concepts, not full crypto election implementation.

## States

No contestants, free vote available, free vote already used, paid vote selected, payment pending, payment failed, vote receipt created, review hold.

## Responsive

Mobile uses one-column steps with persistent summary. Desktop uses picker and summary columns.

## Tests / Proof

Free vote eligibility test, Stripe webhook-derived paid vote test, receipt hash display, duplicate vote guard, mobile checkout screenshot.

## Confidence

Medium-high. Integrity depends on CTEST-002 and CTEST-003.
