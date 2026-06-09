---
type: wireframe
screen_number: "022"
title: Admin Operations
route: /admin/ops
persona: [Patricia]
phase: Advanced
---

# Wireframe: Admin Operations

## Page goal

Failed webhooks, Stripe disputes, system health, AI run failures.

## Components

WebhookFailureList · RetryButton · ai_runs failure filter · Sentry link

## AI features

`adminOpsAgent` summarize incident

## Mermaid

```mermaid
flowchart TD
  A[Alert] --> B[Ops queue]
  B --> C[Manual or retry]
```
