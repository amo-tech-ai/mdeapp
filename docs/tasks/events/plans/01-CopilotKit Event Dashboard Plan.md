---
title: CopilotKit Event Dashboard Plan — Research Draft
date: 2026-06-08
status: superseded-by-canonical
canonical: ./01a-copilotkit-mastra-plan.md
companion: ./02-mastra-events.md
note: First-pass repo ranking; merged into 01a with mdeapp disk truth
---

# CopilotKit Event Dashboard Plan — Core + Advanced

> **Canonical implementation plan:** [`01a-copilotkit-mastra-plan.md`](01a-copilotkit-mastra-plan.md)  
> **Mastra agents/workflows:** [`02-mastra-events.md`](02-mastra-events.md)  
> **Executive Mastra roadmap:** [`02a-mastra-events.md`](02a-mastra-events.md)

This file keeps the original **20-repo ranking** and feature tables. For build order, agent names, and Linear mapping, use **01a** (not this file).

---

## 1. Best repos ranked for events

| Rank | Repo / Example | Full URL | Purpose | Event Use Case | Core / Advanced | Score |
| ---: | --- | --- | --- | --- | --- | ---: |
| 1 | **mdeapp `/host/event/new`** | `mdeapp/src/components/host/` | HITL wizard + `hostEventAgent` | Roberto publish flow | Core | **95/100** |
| 2 | Mastra PM Canvas | [examples/canvas/mastra-pm](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm) | Event planning board | Tasks, vendors, budget, timeline | Core | **96/100** |
| 3 | Project Manager | [copilotkit.ai/examples/project-manager](https://www.copilotkit.ai/examples/project-manager) | AI project manager | Event checklist + task updates | Core | **94/100** |
| 4 | Generative UI | [showcases/generative-ui](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/generative-ui) | Dynamic UI from AI | Event cards, ticket forms, approval panels | Core | **93/100** |
| 5 | Banking Showcase | [showcases/banking](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) | Approval workflows | Publish, refunds, payout HITL | Core | **91/100** |
| 6 | Travel Planner | [copilotkit.ai/examples/travel-planner](https://www.copilotkit.ai/examples/travel-planner) | Itinerary + map | Venue shortlist, schedule | Core | **90/100** |
| 7 | Chat With Your Data | [copilotkit.ai/examples/chat-with-your-data](https://www.copilotkit.ai/examples/chat-with-your-data) | Data Q&A | “Which event sold most tickets?” | Core | **89/100** |
| 8–15 | ADK, MCP, Multi-Agent, Strands, Deep Agents, … | CopilotKit showcases | Advanced patterns | **DEFER** post-MVP | Advanced | 80–87 |

> Standalone `CopilotKit/mastra-pm-canvas` is **archived** — use monorepo path only.

---

## 2. Best foundation (updated 2026-06-08)

| Foundation | Role |
| --- | --- |
| **mdeapp host stack** | **Primary** — `/host/event/new` LIVE; extend, do not fork |
| **Mastra PM Canvas** | Ops dashboard patterns (shared state, task board) |
| **Project Manager** | AI updates plan from chat |
| **Generative UI** | Cards, forms, approval panels |
| **Banking Showcase** | HITL before publish/refund |

---

## 3. Agent naming correction

| This draft (stale) | mdeapp canonical |
| --- | --- |
| `eventPlannerAgent` | **Do not add** — use `hostEventAgent` (create) + `hostOpsAgent` (ops) |
| `analyticsAgent` | **`hostOpsAgent`** (sales Q&A + KPI tools) |
| `ticketingAgent` | Wizard + Stripe routes; ops via `hostOpsAgent` |
| `venueAgent` | Defer separate agent; `search-grounded-places` / SAN-500 |

---

## 4. Medellín Fashion Night (unchanged scenario)

See full table in [`01a-copilotkit-mastra-plan.md` §4](01a-copilotkit-mastra-plan.md#4-event-planner-use-case--medellín-fashion-night).

---

## 5. Next 5 tasks (canonical — from 01a)

| # | Task |
| ---: | --- |
| 1 | **SAN-730** — enable host nav (`/host/events`, `/host/analytics`) |
| 2 | Scaffold **`hostOpsAgent`** in Mastra |
| 3 | **`/host/analytics`** KPI page + Copilot shell (PAGE-M02) |
| 4 | **`HostOpsCopilotBridge`** + read-only sales tools |
| 5 | Generative tier chart card (`useCopilotAction`) |

---

## Related

- [CopilotKit](https://www.copilotkit.ai/)
- [Mastra PM Canvas (monorepo)](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm)
