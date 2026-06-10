---
title: AI-Native Events OS — Master Prompt
output_plan: ../plans/04-AI-native-system.md
output_plan_v1: ../plans/03-copilotkit-mastraAI.md
companion_plans:
  - ../plans/01a-copilotkit-mastra-plan.md
  - ../plans/02-mastra-events.md
---

> **Canonical output (V2):** [`../plans/04-AI-native-system.md`](../plans/04-AI-native-system.md) — audit-refined 2026-06-08. V1: [`03-copilotkit-mastraAI.md`](../plans/03-copilotkit-mastraAI.md).

# MASTER PROMPT — Design an AI-Native Event Operating System (CopilotKit + Mastra)

Act as a Principal Product Architect, AI UX Designer, CopilotKit Expert, Mastra Architect, Event Platform Founder, Systems Engineer, CRM Architect, and Workflow Automation Specialist.

---

# Objective

Design a next-generation AI-Native Event Operating System that dramatically improves upon:

* Eventbrite
* Luma
* Meetup
* Partiful
* Splash
* Ticketmaster
* Fever

The platform should not feel like a traditional dashboard.

The platform should feel like:

```text
ChatGPT + Eventbrite + Linear + Notion + Google Maps
```

combined into one intelligent workspace.

---

# Core Vision

Replace:

```text
Forms
Menus
Tables
Settings
Filters
Manual workflows
```

With:

```text
Chat
Agents
Actions
Approvals
Workflows
Memory
Context
Generative UI
```

The user should accomplish most actions through conversation.

---

# Research Sources

Review:

## CopilotKit

[https://www.copilotkit.ai](https://www.copilotkit.ai)

[https://www.copilotkit.ai/examples/project-manager](https://www.copilotkit.ai/examples/project-manager)

[https://www.copilotkit.ai/examples/travel-planner](https://www.copilotkit.ai/examples/travel-planner)

[https://www.copilotkit.ai/examples/chat-with-your-data](https://www.copilotkit.ai/examples/chat-with-your-data)

[https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm)

[https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases)

---

## Mastra

[https://mastra.ai/docs](https://mastra.ai/docs)

[https://mastra.ai/docs/agents/overview](https://mastra.ai/docs/agents/overview)

[https://mastra.ai/docs/workflows/overview](https://mastra.ai/docs/workflows/overview)

[https://mastra.ai/docs/memory/overview](https://mastra.ai/docs/memory/overview)

[https://mastra.ai/docs/rag/overview](https://mastra.ai/docs/rag/overview)

[https://mastra.ai/docs/mcp/mcp-apps](https://mastra.ai/docs/mcp/mcp-apps)

[https://mastra.ai/guides/concepts/multi-agent-systems](https://mastra.ai/guides/concepts/multi-agent-systems)

[https://mastra.ai/guides/getting-started/next-js](https://mastra.ai/guides/getting-started/next-js)

[https://mastra.ai/guides/guide/web-search](https://mastra.ai/guides/guide/web-search)

[https://mastra.ai/guides/guide/research-assistant](https://mastra.ai/guides/guide/research-assistant)

[https://mastra.ai/guides/guide/whatsapp-chat-bot](https://mastra.ai/guides/guide/whatsapp-chat-bot)

---

# Deliverables

Create a complete architecture report.

Use:

* Tables
* Mermaid diagrams
* ERD diagrams
* User journey diagrams
* System architecture diagrams
* Data flow diagrams
* Workflow diagrams
* Wireframes

---

# Section 1 — Executive Summary

Explain:

* Why traditional dashboards are becoming obsolete
* Why AI-native workflows are superior
* Why CopilotKit + Mastra is the ideal architecture
* How this platform beats Eventbrite and Luma

Create:

| Area | Traditional Platform | AI Native Platform |
| ---- | -------------------- | ------------------ |

---

# Section 2 — AI Native Event Vision

Design the future event platform.

Create:

| Capability | Eventbrite | Luma | AI Native |
| ---------- | ---------- | ---- | --------- |

Include:

* Event creation
* Ticketing
* Discovery
* Sponsors
* CRM
* Analytics
* Marketing
* Operations
* Partnerships
* Venues
* Maps

---

# Section 3 — Core vs MVP vs Advanced

Create:

| Phase | Goal | Users | Features | Agents | Workflows |
| ----- | ---- | ----- | -------- | ------ | --------- |

---

## CORE

Focus only on:

```text
Create Event
Publish Event
Sell Tickets
Track Revenue
```

Do NOT overengineer.

Must include:

* Event creation
* Venue search
* Ticket setup
* Stripe
* Event dashboard
* AI chat

Maximum:

```text
5 agents
3 workflows
```

---

## MVP

Add intelligence.

Must include:

* CRM
* Sponsors
* Venue intelligence
* Discovery
* Analytics
* Feedback

Maximum:

```text
8 agents
6 workflows
```

---

## ADVANCED

Add automation.

Must include:

* Marketing
* WhatsApp
* Partner management
* MCP integrations
* Workflow automation

Maximum:

```text
12 agents
10 workflows
```

---

# Section 4 — Three Panel UX

Design the complete layout.

## Left Panel

* Navigation
* Saved views
* Memory
* Recent activity
* Quick actions

## Center Panel

* Chat
* Tasks
* Workflow progress
* Generative UI
* Suggestions

## Right Panel

* Maps
* Event details
* Forms
* Analytics
* Approval panels

---

Create:

### Mermaid Layout Diagram

### Mobile Layout

### Tablet Layout

### Desktop Layout

---

# Section 5 — Chat Experience

Design the perfect chat experience.

Examples:

User:

```text
Create a fashion event for 300 people in Medellín
```

AI:

```text
Creates draft
Suggests venues
Creates ticket tiers
Creates schedule
Creates sponsor package
```

Design:

* Chat actions
* Quick prompts
* Suggested actions
* Context switching
* Memory usage

---

# Section 6 — Chat Toolbar

Design icon actions.

Include at least 50 actions.

Examples:

📅 Event

🎟 Ticket

📍 Venue

🏢 Sponsor

👥 CRM

📊 Analytics

📣 Marketing

🗺 Maps

💰 Revenue

⚙ Operations

Create:

| Icon | Action | Agent | Workflow | Result |
| ---- | ------ | ----- | -------- | ------ |

---

# Section 7 — Auto Population

Design AI context system.

Sources:

* User profile
* Event history
* Venue history
* Sponsor history
* CRM history
* Analytics history
* Saved preferences

Create:

| Context Source | Auto Filled Fields | Example |
| -------------- | ------------------ | ------- |

---

# Section 8 — Agent Architecture

Design:

* routerAgent
* conciergeAgent
* ~~eventPlannerAgent~~ (do not add — use hostEventAgent + hostOpsAgent)
* hostEventAgent
* hostOpsAgent
* venueAgent
* ticketingAgent
* sponsorAgent
* crmAgent
* analyticsAgent
* marketingAgent
* adminOpsAgent
* automationAgent

Create:

| Agent | Purpose | Inputs | Outputs | Memory | Tools |
| ----- | ------- | ------ | ------- | ------ | ----- |

---

Create Mermaid Agent Architecture Diagram.

---

# Section 9 — Workflow Architecture

Design:

* createEventWorkflow
* publishEventWorkflow
* venueShortlistWorkflow
* sponsorDiscoveryWorkflow
* ticketSetupWorkflow
* salesInsightWorkflow
* marketingCampaignWorkflow
* postEventReportWorkflow
* adminExceptionWorkflow

Create:

| Workflow | Inputs | Steps | Outputs |
| -------- | ------ | ----- | ------- |

Create Mermaid Workflow Diagrams.

---

# Section 10 — Data Model

Design complete database architecture.

Include:

* users
* events
* venues
* tickets
* orders
* sponsors
* crm_leads
* partners
* conversations
* workflows
* approvals
* analytics

Create:

### ERD Diagram

### Table Relationship Diagram

### Entity Relationship Explanation

---

# Section 11 — Data Flow

Create Mermaid diagrams for:

## Event Creation

User → Chat → Agent → Workflow → Database

## Ticket Purchase

Buyer → Stripe → Ticket → Wallet

## Sponsor Discovery

User → Agent → Research → CRM

## Venue Search

User → Maps → Venue Agent → Results

---

# Section 12 — User Journeys

Create Mermaid User Journey Diagrams.

## Host Journey

Idea → Event → Publish → Revenue

## Attendee Journey

Discovery → Ticket → Attendance

## Sponsor Journey

Lead → Proposal → Partnership

## Admin Journey

Monitoring → Approval → Operations

---

# Section 13 — MCP Strategy

Evaluate:

* Google Maps
* Apify
* Browser
* GitHub
* Linear
* Supabase
* Stripe
* WhatsApp
* Postiz
* Email

Create:

| MCP | Use Case | Core | MVP | Advanced |
| --- | -------- | ---- | --- | -------- |

---

# Section 14 — Conversational Analytics

Examples:

```text
How many tickets sold today?

What venue generated most revenue?

Which sponsor produced most leads?

Which campaigns worked best?
```

Create:

| Question | Agent | Data Source | Visualization |
| -------- | ----- | ----------- | ------------- |

---

# Section 15 — Screens

Design all screens.

Create:

| Screen | Purpose | Core/MVP/Advanced |
| ------ | ------- | ----------------- |

Include:

* Dashboard
* Chat
* Event Workspace
* Ticketing
* Venue Explorer
* Sponsors
* CRM
* Analytics
* Marketing
* Admin

Provide wireframes for each.

---

# Section 16 — Competitive Analysis

Compare:

* Eventbrite
* Luma
* Meetup
* Fever
* AI Native Platform

Score:

* UX
* AI
* Automation
* Discovery
* CRM
* Sponsors
* Analytics
* Operations

Out of 100.

---

# Section 17 — Implementation Roadmap

Create:

## Phase 1 Core

Tasks
Features
Agents
Workflows

## Phase 2 MVP

Tasks
Features
Agents
Workflows

## Phase 3 Advanced

Tasks
Features
Agents
Workflows

---

# Section 18 — Additional Opportunities

Suggest features not mentioned.

Examples:

* AI event co-host
* AI attendee concierge
* AI networking assistant
* AI sponsor matcher
* AI venue scorer
* AI event health score
* AI revenue predictor
* AI campaign optimizer

Rank all ideas:

| Feature | Value | Complexity | Priority |
| ------- | ----- | ---------- | -------- |

---

# Section 19 — Final Recommendation

Provide:

* Best MVP scope
* Best UI architecture
* Best agent architecture
* Best workflow architecture
* Best data architecture
* Best MCP integrations
* Biggest risks
* Biggest opportunities
* Exact next 50 implementation tasks in order

Be opinionated.

Challenge assumptions.

Prioritize production readiness, simplicity, and business value over complexity.

**Additional items worth adding that are often forgotten:**

1. Event Health Score system
2. Approval architecture diagram
3. Stripe lifecycle diagram
4. Notification architecture (email, WhatsApp, push)
5. Audit log design
6. Role/permission matrix
7. AI safety and approval gates
8. Cost analysis (LLM, Maps, Stripe, MCP)
9. Multi-tenant architecture
10. Success metrics/KPIs dashboard

These usually separate a production-ready platform from a prototype.
