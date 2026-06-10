---
type: wireframe
screen_number: "019"
title: Admin Dashboard
route: /admin
persona: [Patricia]
phase: MVP
---

# Wireframe: Admin Dashboard

## Page goal

Ops overview — failed payments, pending approvals, event quality.

## User type

Admin

## Components

OpsKpiTiles · ExceptionQueuePreview · ai_runs link

## AI features

`adminOpsAgent` read-only queries (MVP)

## Data sources

`orders`, `events`, `approval_logs`, `ai_runs`

## Mermaid

```mermaid
flowchart TD
  A[/admin] --> B[KPI tiles]
  B --> C[Drill moderation or ops]
```
