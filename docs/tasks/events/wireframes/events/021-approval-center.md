---
type: wireframe
screen_number: "021"
title: Approval Center
route: /host/approvals
persona: [Roberto, Patricia]
phase: MVP
---

# Wireframe: Approval Center

## Page goal

**Unified approval queue** (audit: stop scattering approvals) — publish, price changes, sponsor proposals, moderation, blasts.

Routes: `/host/approvals` (host) · Patricia uses [020](./020-moderation.md) + [034](./034-exception-center.md) for ops.

## Components

ApprovalLogTable · FilterByType · DetailDrawer · ResubmitAction

## Data sources

`approval_logs`

## Mermaid

```mermaid
flowchart TD
  A[Pending approvals] --> B[Review detail]
  B --> C[Approve or reject]
  C --> D[Log + execute]
```
