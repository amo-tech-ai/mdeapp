---
type: wireframe
screen_number: "034"
title: Exception Center
route: /admin/exceptions
persona: [Patricia]
phase: MVP
---

# Wireframe: Exception Center

## Page goal

Dedicated ops queue — failed payments, webhooks, refunds, ticket generation errors.

## User type

Admin

## Components

ExceptionTable · SeverityBadge · RetryAction · StripeLink · SentryLink · ai_runs correlation

## Rows

| Type | Source |
|------|--------|
| Webhook failed | Stripe |
| Ticket not minted | checkout finalize |
| Refund error | Stripe |
| Agent run failed | `ai_runs` |

## Mermaid

```mermaid
flowchart TD
  E[Exception detected] --> Q[Exception center]
  Q --> R{Retry?}
  R -->|Yes| F[Fix + log]
  R -->|No| M[Manual ops]
```

**Extends** [022-admin-operations](./022-admin-operations.md) with focused queue.
