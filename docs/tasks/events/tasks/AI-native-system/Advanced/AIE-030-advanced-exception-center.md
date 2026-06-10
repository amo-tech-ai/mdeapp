---
id: AIE-030-advanced
title: Exception center /admin/exceptions
status: Not Started
priority: P2
phase: advanced
persona: patricia
linear: —
percent: 0
blocked_by: [AIE-025]
blocks: []
depends_on: []
wireframe: ../../wireframes/events/034-exception-center.md
---

# AIE-030-advanced — Exception center

## Objective

Dedicated ops queue: failed payments, webhook failures, refund errors, ticket generation failures.

## Acceptance criteria

- `adminOpsAgent` read tools list exceptions
- Retry actions HITL-gated
- Sentry correlation ids visible
