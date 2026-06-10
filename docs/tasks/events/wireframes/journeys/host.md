---
title: Host Experience Journeys
screens: [008, 009, 012, 013, 014, 024]
---

# Host Experience

## Task comparison — Traditional vs AI native

| Task | Luma / Eventbrite | mdeai AI native |
|------|-------------------|-----------------|
| Create event | Multi-page form | NL wizard + HITL 🟢 |
| Pick venue | Manual search | Places + AI shortlist |
| Set tiers | Pricing screen | `add_ticket_tier` chat |
| See sales | Insights tab | `hostOpsAgent` chat 🔴 |
| Message guests | Blast composer | Inbox + AI draft |
| Sponsors | Spreadsheet | `sponsorMatchWorkflow` |
| Forecast revenue | Export CSV | `revenueForecastWorkflow` |

## Dashboard → analytics loop

```mermaid
flowchart TD
  L[/host/events] --> A[/host/analytics]
  A --> C[hostOpsAgent chat]
  C --> K[KPI cards]
  K --> F[Forecast MVP]
  F --> I[Inbox guest Q]
```

## CopilotKit + Mastra wins

- **Chat-with-data** over static charts
- **HITL** on money-moving actions
- **Shared state** `HostDashboardState` across host routes
- **Generative UI** tier charts in thread

Wireframes: [008](../events/008-host-dashboard.md) · [013](../events/013-revenue-dashboard.md) · [024](../events/024-inbox.md)
