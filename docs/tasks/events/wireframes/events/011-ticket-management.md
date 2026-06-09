---
type: wireframe
screen_number: "011"
title: Ticket Management
route: /host/events/[id]/tickets
persona: [Roberto]
phase: Core
status: partial
---

# Wireframe: Ticket Management

## Page goal

View/edit tiers, capacity, sold counts — AI explains performance.

## User type

Host

## User stories

```text
As Roberto I want to see which tier sells fastest
So that I adjust pricing
```

## Components

TierTable · SoldProgressBar · AddTierButton · PriceChangeHITL

## Layout

Center: tier table · Right: `hostOpsAgent` chat "VIP 80% sold"

## Data sources

`ticket_tiers`, `orders` aggregates

## AI features

`get_sales_summary` tool · price change → HITL

## Mermaid

```mermaid
flowchart TD
  A[Tier view] --> B[Sales data]
  B --> C[AI narrative]
  C --> D{Change price?}
  D -->|Yes| E[HITL]
```
