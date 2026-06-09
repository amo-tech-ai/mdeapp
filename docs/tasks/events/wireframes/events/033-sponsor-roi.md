---
type: wireframe
screen_number: "033"
title: Sponsor ROI
route: /host/sponsors/[id]/roi
persona: [Roberto]
phase: Advanced
---

# Wireframe: Sponsor ROI

## Page goal

Prove sponsor value — impressions, leads, conversions tied to event.

## Components

RoiMetricCards · LeadFunnel · AttributedRevenue · ExportReportHITL

## Data sources

`sponsor_deals`, `crm_leads`, `orders` (promo codes future)

## Mermaid

```mermaid
flowchart LR
  S[Sponsor] --> E[Event metrics]
  E --> R[ROI report]
```
