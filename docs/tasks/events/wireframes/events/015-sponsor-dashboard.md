---
type: wireframe
screen_number: "015"
title: Sponsor Dashboard
route: /host/sponsors
persona: [Roberto]
phase: MVP
agent: sponsorAgent
---

# Wireframe: Sponsor Dashboard

## Page goal

Overview of sponsor pipeline per event — research, match, proposal status.

## User type

Host

## Components

PipelineSummary · ActiveDealsList · ResearchCTA · FitScoreBadge

## Three-panel

Center: sponsor chat · Right: matched sponsors list

## AI features

`sponsorAgent` · `sponsorDiscoveryWorkflow`

## Data sources

`sponsors`, `sponsor_deals`, `crm_leads`

## Mermaid

```mermaid
flowchart TD
  A[Open sponsors] --> B[Pipeline summary]
  B --> C[Research new]
  C --> D[sponsorMatchWorkflow]
```
