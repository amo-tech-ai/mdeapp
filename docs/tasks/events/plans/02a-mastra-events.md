---
title: Mastra Events Roadmap — Executive Summary
date: 2026-06-08
status: active
canonical_detail: ./02-mastra-events.md
copilotkit_companion: ./01a-copilotkit-mastra-plan.md
principle: Agents think. Workflows control. No agent swarms in MVP.
---

# Mastra Events Roadmap (Production-First)

> **Full agent/tool/workflow plan:** [`02-mastra-events.md`](02-mastra-events.md)  
> **CopilotKit dashboard UI:** [`01a-copilotkit-mastra-plan.md`](01a-copilotkit-mastra-plan.md)

Mastra guidance: use **workflows for deterministic business steps** and **agents for reasoning** — not a giant super-agent ([agents vs workflows](https://mastra.ai/learn/agents-vs-workflows)).

---

## North star

```text
Discover → Create → Publish → Sell → Attend → Analyze
```

| Step | Status (2026-06-08) | Mastra owner |
|------|:---:|---|
| Discover | 🟢 LIVE | `conciergeAgent`, `eventAgent`, `searchEventsTool` |
| Create | 🟢 LIVE | `hostEventAgent` + `EventDraftState` |
| Publish | 🟢 LIVE | HITL `preview_and_publish` (CopilotKit) |
| Sell | 🟢 LIVE | Stripe (outside Mastra) |
| Attend | 🟡 partial | Wallet/QR (outside Mastra) |
| Analyze | 🔴 gap | **`hostOpsAgent`** — not built |

---

## Stage 1 — CORE (launch foundation)

**Goal:** Prove create → publish → sell → **track revenue in chat**.

### Already shipped (do not rebuild)

| Item | Evidence |
|------|----------|
| `hostEventAgent` | `src/mastra/agents/host-event.ts` |
| `conciergeAgent` + event tools | `agents/concierge.ts`, `tools/search-events.ts` |
| `eventDiscoveryWorkflow` | `workflows/event-discovery-workflow.ts` |
| `routerAgent` | `agents/router.ts` |
| Host wizard + HITL | `/host/event/new`, `HostEventCopilotBridge` |

### Build now (5 agents max — not 10)

| Agent | Status | Notes |
|-------|:---:|-------|
| `conciergeAgent` | 🟢 | Discovery — **already Phase 1** |
| `eventAgent` | 🟢 | Specialist |
| `hostEventAgent` | 🟢 | Create/publish |
| `hostOpsAgent` | 🔴 **NEW** | Sales Q&A, KPI tools — replaces draft `analyticsAgent` |
| ~~`venueAgent`~~ | ⚪ | Defer — Places on concierge / SAN-500 |
| ~~`ticketingAgent`~~ | ⚪ | Merged into wizard + `hostOpsAgent` |
| ~~`eventPlannerAgent`~~ | ❌ | **Do not add** |

### Core workflows

| Workflow | Status | Notes |
|----------|:---:|-------|
| `createEventWorkflow` | 🟡 | **Wizard + HITL** is the live orchestration |
| `ticketSetupWorkflow` | 🟡 | Partial in wizard; add Stripe verify step |
| `venueShortlistWorkflow` | 🔴 | Optional SAN-500 |
| `salesInsightWorkflow` | 🔴 | **P0 with `hostOpsAgent`** |

### Template repos (patterns only)

| Repo | Use |
|------|-----|
| mdeapp `src/mastra/` | Foundation |
| [Personal Assistant](https://github.com/mastra-ai/personal-assistant-example) | `hostOpsAgent` memory |
| [Text-to-SQL](https://github.com/mastra-ai/template-text-to-sql) | Sales tools |
| [Mastra Triage](https://github.com/mastra-ai/mastra-triage) | Reference — have `routerAgent` |
| [AGUI Dojo](https://github.com/mastra-ai/mastra-agui-dojo) | CopilotKit already bridges AG-UI |

### P0 features

| Feature | Priority | Status |
|---------|:---:|---|
| Event creation | P0 | 🟢 |
| Publish approval | P0 | 🟢 |
| Ticket setup + Stripe | P0 | 🟢 |
| Event discovery | P0 | 🟢 |
| Revenue dashboard + AI Q&A | P0 | 🔴 `hostOpsAgent` |
| Venue search | P1 | 🟡 SAN-500 |

---

## Stage 2 — MVP (intelligence, not complexity)

**Gate:** SAN-115 proof ledger green + `hostOpsAgent` live.

| Add | Repo pattern | Agent |
|-----|--------------|-------|
| Sponsor research | Deep Search | `sponsorAgent` |
| CRM assistant | Personal Assistant | `crmAgent` |
| NL analytics | Text-to-SQL | extend `hostOpsAgent` tools |
| Feedback summaries | Customer Feedback template | workflow only |

`conciergeAgent` is **not** Stage 2 — it is **already LIVE**.

---

## Stage 3 — ADVANCED

**Gate:** 100+ events, daily host ops, sponsor pipeline in use.

| Add | Notes |
|-----|-------|
| `marketingAgent` | HITL + Postiz handoff |
| `adminOpsAgent` | Patricia `/admin` |
| `automationAgent` | Approved drafts only |
| Multi-agent (AI Buddies) | **Avoid** until Stages 1–2 stable |

---

## Do NOT build yet

```text
20+ agents · Autonomous sponsor outreach · Auto-publishing · Agent swarms
Agent-to-agent chains · WhatsApp bot (Phase 2 PRD)
```

---

## Build order (corrected for disk)

| # | Task | Status |
|---|------|:---:|
| 1 | `routerAgent` | 🟢 done |
| 2 | `hostEventAgent` | 🟢 done |
| 3 | `conciergeAgent` + `eventAgent` | 🟢 done |
| 4 | `eventDiscoveryWorkflow` | 🟢 done |
| 5 | **`hostOpsAgent`** + read tools | 🔴 **next** |
| 6 | `salesInsightWorkflow` | 🔴 next |
| 7 | `venueShortlistWorkflow` | ⚪ SAN-500 |
| 8 | `/host/analytics` + Copilot shell | 🔴 SAN-729/730 |
| 9 | `sponsorAgent` | ⚪ Stage 2 |
| 10 | `crmAgent` | ⚪ Stage 2 |

---

## Architecture score

| Area | Score | Note |
|------|------:|------|
| Core agents (shipped) | 95/100 | Discovery + host create live |
| Ops gap (`hostOpsAgent`) | 40/100 | Blocks “Analyze” step |
| Overengineering risk | Low | Plan caps MVP agents |
| Mastra v1 readiness | 90/100 | `@mastra/core@1.35.0`; partial observability |

---

## Related

- [`../events-roadmap.md`](events-roadmap.md) — product phases + GitHub repos
- [`../events-prd.md`](events-prd.md) — PRD + audit
- [`../index-events.md`](index-events.md) — progress tracker
