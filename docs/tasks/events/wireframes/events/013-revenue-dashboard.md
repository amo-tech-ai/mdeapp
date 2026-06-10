---
type: wireframe
screen_number: "013"
title: Revenue Dashboard
route: /host/analytics
persona: [Roberto]
phase: Core
status: spec
agent: hostOpsAgent
spec: ../../specs/pages/missing/PAGE-M02-host-analytics.md
---

# Wireframe: Revenue Dashboard

## Page goal

Revenue KPIs at a glance + conversational deep-dive — beats Luma Insights export.

## User type

Host

## User stories

```text
As Roberto I want to ask "revenue vs last event"
So that I get an answer without spreadsheets
```

## Components

KpiCardRow · RevenueChart · TierBreakdown · EventSelector · HostOpsCopilotBridge · GenerativeChartCard

## Three-panel

**Left:** host nav · **Center:** `hostOpsAgent` chat · **Right:** KPI cards + charts

## Desktop

```text
┌──────────┬─────────────────────┬──────────────┐
│ Host nav │ CopilotChat         │ $2,140 rev   │
│          │ "Sales vs last week?"│ [tier chart] │
│          │ [Generative card]   │ 42 / 250 reg │
└──────────┴─────────────────────┴──────────────┘
```

## AI features

`useCoAgent<HostDashboardState>` · `salesInsightWorkflow` · read-only tools

## KPI metrics (audit-aligned)

| Metric | Source |
|--------|--------|
| Registrations | `orders` count |
| Ticket sales | tier breakdown tool |
| Revenue | sum `orders.amount_cents` |
| Attendance | check-in post-MVP |
| Forecast | [026](./026-revenue-forecast.md) workflow |

## Data sources

`orders`, `ticket_tiers`, `events`, `ai_runs`, `HostDashboardState` — see [038-shared-state](../038-shared-state.md)

## States

No events empty · Loading skeleton · RLS deny

## Mermaid

```mermaid
flowchart TD
  A[/host/analytics] --> B[KPI server fetch]
  B --> C[hostOpsAgent chat]
  C --> D[get_sales_summary]
  D --> E[Generative KPI card]
```
