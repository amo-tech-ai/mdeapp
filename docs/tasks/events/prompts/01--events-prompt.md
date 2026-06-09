You are a Senior EventTech Product Architect, AI Systems Engineer, Event Operations Expert, Growth Strategist, UX Architect, and Technical PM.

Project:
mdeai Events Platform

Goal:
Perform a complete forensic audit of the Events Platform and verify that all MVP and future event-management capabilities are represented in:

* Linear
* PRDs
* Specs
* Wireframes
* User journeys
* AI agents
* Workflows
* Schemas
* Dashboards
* Marketing pages
* Forms
* APIs
* Edge functions
* Automation systems

Primary Focus:
Events MVP first.

Do NOT optimize for future features before validating MVP completeness.

---

## Phase 1 — Current State Audit

Analyze:

* Events PRD
* Events roadmap
* Events tracker
* UI spec pack
* Wireframes
* Linear project
* Existing routes
* Existing APIs
* Existing Supabase schema
* Existing agents
* Existing workflows

Generate:

| Area                | Complete % | Grade | Status |
| ------------------- | ---------- | ----- | ------ |
| Event discovery     |            |       |        |
| Event detail        |            |       |        |
| Ticketing           |            |       |        |
| Stripe              |            |       |        |
| Host tools          |            |       |        |
| AI agents           |            |       |        |
| Chat booking        |            |       |        |
| Marketing           |            |       |        |
| Analytics           |            |       |        |
| Admin               |            |       |        |
| Venue booking       |            |       |        |
| Discovery workflows |            |       |        |
| Social promotion    |            |       |        |
| WhatsApp            |            |       |        |
| CRM                 |            |       |        |
| Automation          |            |       |        |
| Maps                |            |       |        |
| Search              |            |       |        |
| AI infrastructure   |            |       |        |

Use:

🟢 Complete
🟡 Partial
🔴 Missing
⚪ Future

---

## Phase 2 — Verify Core MVP Event Platform

Verify MVP includes:

### Event Discovery

User examples:

* "Salsa this weekend"
* "Tech events in Laureles"
* "Free networking tonight"

Verify:

* Chat discovery
* Event cards
* Filters
* Search
* Maps
* Recommendations
* Save event

---

### Event Detail

Verify:

* Hero
* Description
* Agenda
* Venue
* Host
* Pricing
* Ticket tiers
* CTA
* Share
* Mobile experience
* Accessibility

Compare against:

* Luma
* Eventbrite
* Partiful
* Meetup

---

### Ticketing

Verify:

* Ticket creation
* Capacity
* Inventory
* Pricing
* Promo codes
* Checkout
* Stripe
* Wallet
* QR
* Validation

User example:

Andrés buys a ticket and receives a QR.

Document:

* Working
* Missing
* Risks

---

### Host Platform

Verify:

* Host onboarding
* Event creation
* AI wizard
* HITL approval
* Publishing
* Event management
* Host dashboard
* Analytics
* Revenue reporting

User example:

Roberto creates and publishes an event in under 3 minutes.

---

## Phase 3 — AI Architecture Audit

Verify all AI agents.

### Gemini Agents

Confirm:

1. Concierge Agent
2. Event Agent
3. Host Event Agent

For each:

* Purpose
* Inputs
* Outputs
* Tools
* Actions
* Memory
* Prompts
* UI surfaces

Create flow diagrams.

---

### CopilotKit

Verify:

* Chat UI
* Cards
* HITL
* Approval flows
* Tool rendering
* State management

User examples:

* Discover event
* Book ticket
* Create event
* Approve event

---

### Mastra

Verify:

Tools:

* search_events
* discovery tools
* ticket tools
* host tools

Workflows:

* Discovery
* Publish
* Ticket purchase
* Venue booking
* Marketing

For each workflow:

* Trigger
* Steps
* Outputs
* Missing pieces

Create Mermaid diagrams.

---

### ADK Google

Verify:

Current state
Future state

Agents:

* SearchAgent
* MapsAgent

Determine:

* MVP?
* Phase 2?
* Phase 3?

---

## Phase 4 — Maps & Discovery

Verify:

Google Maps
Places
Grounding
Venue discovery

User examples:

* Find nearby events
* Show map pins
* Open venue
* Navigate

Audit:

* Maps
* Places
* Enrichment
* Venue matching

---

## Phase 5 — Database & Infrastructure

Verify:

Supabase

Tables:

* events
* tickets
* orders
* hosts
* venues
* discovery
* analytics

For each:

* Exists?
* RLS?
* Production ready?
* Missing fields?

---

### PG Vector

Verify:

* hybrid_search_events
* embeddings
* recommendations

User example:

"Startup networking with founders"

returns relevant events.

---

### Edge Functions

Verify:

* approval-commit
* ticket-payment-webhook
* Stripe handlers
* discovery approval

For each:

* Status
* Tests
* Risks

---

## Phase 6 — Event Marketing System

Audit future growth stack.

### Marketing Pages

Verify existing and missing:

* /host
* /events
* /sponsors
* /business/event-marketing
* onboarding
* partner pages

For each:

* Spec
* Wireframe
* Linear issue
* CTA
* Funnel stage

---

### Lead Generation

Audit:

* Forms
* Lead capture
* CRM
* Follow-up

User examples:

* Become a host
* Become sponsor
* Request venue
* Event consultation

---

### Social Distribution

Verify roadmap for:

* WhatsApp
* Instagram
* Facebook
* Threads
* X
* LinkedIn

Tools:

* Postiz
* OpenClaw
* Chatwoot
* WhatsApp

User example:

Host publishes event →
draft social campaign generated →
human approves →
publishes to channels.

---

## Phase 7 — WhatsApp & Chat Commerce

Reference:
https://mastra.ai/guides/guide/whatsapp-chat-bot

Audit future WhatsApp flows.

User examples:

* Discover events
* Buy tickets
* Get reminders
* Join waitlist
* Event updates

Verify:

* Chatwoot integration
* WhatsApp integration
* Mastra workflow
* Ticket delivery
* QR delivery

Determine:

MVP
Phase 2
Phase 3

---

## Phase 8 — Missing Screens & Dashboards

Verify every required screen exists.

Categories:

### Consumer

* Home
* Chat
* Browse
* Event detail
* Wallet
* Ticket

### Host

* Create
* Events
* Analytics
* Revenue
* Marketing

### Admin

* Events
* Leads
* Sponsors
* Venue requests
* Discovery queue

### Marketing

* Host
* Sponsor
* Partner
* Event marketing

Generate missing screen matrix.

---

## Phase 9 — Linear Validation

Audit every Events task.

Verify:

* Exists in Linear
* Correct milestone
* Correct dependencies
* Correct order

Find:

* Missing tasks
* Duplicate tasks
* Wrong sequence
* Scope creep

Create:

### MVP Order

1. Discovery
2. Detail
3. Ticketing
4. Wallet
5. Host publish
6. Launch ledger

### Growth Order

1. Luma UX
2. Discovery approval
3. Admin tools
4. Host analytics
5. Venue booking
6. Sponsors
7. WhatsApp
8. Social automation

---

## Phase 10 — Deliverables

Produce:

### 1. Executive Summary

* MVP readiness %
* Production readiness %
* UX readiness %
* AI readiness %

### 2. Feature Matrix

Core vs Advanced

### 3. Missing Task Matrix

What is missing from Linear

### 4. Missing Screen Matrix

What is missing from specs

### 5. Missing Workflow Matrix

What is missing from Mastra

### 6. Missing Schema Matrix

What is missing from Supabase

### 7. AI Agent Matrix

All agents, tools, workflows, actions

### 8. Mermaid Diagrams

* Discovery flow
* Ticket flow
* Host publish flow
* WhatsApp flow
* Marketing flow
* Venue booking flow

### 9. Recommended Linear Structure

Correct implementation order.

### 10. Top 25 Priority Tasks

Ranked by:

* MVP impact
* Revenue impact
* User impact
* Engineering effort

Rules:

* MVP first.
* No future feature should block MVP.
* Use real Eventbrite, Luma, Partiful, Meetup comparisons.
* Identify blockers, risks, missing tasks, missing screens, missing workflows, missing schemas.
* Flag anything not production-ready.
* Provide grades and scores for every area.
* Be extremely critical and evidence-based.
* Verify before assuming.
* Use code, specs, Linear, and production evidence.
* Output concise tables with percentages and recommendations.
