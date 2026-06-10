# CopilotKit examples — short ranking (Events)

> **Canonical plan:** [`../docs/01a-copilotkit-mastra-plan.md`](01a-copilotkit-mastra-plan.md) — mdeapp-grounded implementation phases, architecture, Linear mapping, next 5 tasks.

## Best CopilotKit repo for an event planner

| Rank | Repo / Example | Use for event planner | Core / Advanced | Score |
|---:|---|---|---|---:|
| 1 | [Mastra PM Canvas](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm) | Event planning board: tasks, vendors, budget, timeline | Core | **96/100** |
| 2 | **mdeapp `/host/event/new`** | HITL wizard + `hostEventAgent` (already shipped) | Core | **95/100** |
| 3 | [Project Manager](https://www.copilotkit.ai/examples/project-manager) | AI assistant that helps plan and update event tasks | Core | **94/100** |
| 4 | [Travel Planner](https://www.copilotkit.ai/examples/travel-planner) | Itinerary, map, venues, schedule flow | Core | **92/100** |
| 5 | [Generative UI](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/generative-ui) | Dynamic event cards, ticket forms, approval panels | Core | **91/100** |
| 6 | [Banking Showcase](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) | Human approval for payments, refunds, publish actions | Advanced | **89/100** |
| 7 | [Chat With Your Data](https://www.copilotkit.ai/examples/chat-with-your-data) | Ask questions over event sales, orders, tiers | Advanced | **87/100** |

## Best choice

**Extend mdeapp** — use **Mastra PM Canvas** patterns for the **ops dashboard**, not a greenfield fork. Create flow stays on **`hostEventAgent`** @ `/host/event/new`.

## Recommended combo

| Area | Best repo / surface |
|------|---------------------|
| Event create + publish | mdeapp host wizard ✅ |
| Event ops dashboard | Mastra PM Canvas + **new `hostOpsAgent`** |
| AI task assistant | Project Manager |
| Venue/map planning | Travel Planner + `mde-maps` |
| Ticket/card UI | Generative UI |
| Payment approval | Banking Showcase |
| Sales Q&A | Chat With Your Data |

**Next:** See [01a-copilotkit-mastra-plan.md §10](01a-copilotkit-mastra-plan.md#10-final-recommendation) — SAN-730 → `hostOpsAgent` → PAGE-M02 analytics.
