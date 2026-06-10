# Create WhatsApp + Mastra Roadmap and Linear Issues

You are a Principal Mastra Architect, WhatsApp Platform Specialist, Product Manager, and Forensic Auditor.

Review the official Mastra WhatsApp documentation before creating any tasks:

Official references:

* https://mastra.ai/guides/guide/whatsapp-chat-bot
* https://mastra.ai/examples/v0/agents/whatsapp-chat-bot

Also review:

* src/mastra/**
* src/app/api/copilotkit/**
* tasks/mastra/**
* tasks/whatsapp/**
* tasks/events/**
* tasks/rentals/**
* tasks/trips/**
* CLAUDE.md
* current SAN-588 Mastra roadmap
* WhatsApp / Chatwoot architecture

Verify actual implementation before proposing tasks.

Do not assume.

---

# Objective

Create a WhatsApp + Mastra roadmap focused on:

* rentals
* events
* restaurants
* cafes
* nightlife
* trips
* bookings
* host workflows

The design must follow official Mastra WhatsApp patterns.

Use:

* workflows
* approvals
* background tasks
* streaming where appropriate

Avoid:

* MCP
* RAG
* multi-agent systems
* unnecessary complexity

---

# First: Audit Current State

Determine:

### Current WhatsApp capability

What already exists?

* Chatwoot
* AiSensy
* WhatsApp Business API
* existing automations
* current workflows

### Current Mastra capability

What can be reused?

* conciergeAgent
* hostEventAgent
* search tools
* memory
* workflows
* approvals

Generate:

| Capability | Exists | Reusable | Gap |
| ---------- | ------ | -------- | --- |

---

# Create WhatsApp Roadmap

Create implementation-ready tasks.

Use naming convention:

WA-001
WA-002
WA-003
etc.

For every task include:

* Title
* Business value
* Real-world example
* Technical implementation
* Acceptance criteria
* Dependencies
* Effort
* Priority

---

# Phase 1 — Foundation

## WA-001 — WhatsApp Webhook Foundation

Based on official Mastra WhatsApp guide.

Purpose:

Receive inbound WhatsApp messages.

Example:

User sends:

"Find apartments in Laureles"

Webhook receives event.

Workflow starts.

Acceptance criteria:

* webhook verified
* messages persisted
* user identified

Priority:

P0

---

## WA-002 — WhatsApp Sender Service

Purpose:

Send outbound WhatsApp messages.

Examples:

* viewing reminder
* ticket confirmation
* booking confirmation

Acceptance criteria:

* text messages
* retries
* logging

Priority:

P0

---

## WA-003 — WhatsApp Message Formatter

Based on official Mastra example.

Purpose:

Convert long AI responses into WhatsApp-friendly messages.

Example:

Instead of:

500-word response

Generate:

3–5 concise WhatsApp messages.

Acceptance criteria:

* message splitting
* markdown cleanup
* emoji handling

Priority:

P1

---

# Phase 2 — Revenue Workflows

## WA-004 — Rental Lead Follow-Up Workflow

Persona:

Camila

Example:

User requests apartment.

Workflow sends:

"Would you like to schedule a viewing?"

Acceptance criteria:

* lead creation
* follow-up message
* response tracking

Priority:

P1

---

## WA-005 — Viewing Reminder Workflow

Example:

Viewing tomorrow.

WhatsApp reminder automatically sent.

Acceptance criteria:

* scheduled workflow
* reminder delivery
* confirmation handling

Priority:

P1

---

## WA-006 — Event Ticket Support Workflow

Persona:

Andrés

Example:

"Resend my ticket"

Acceptance criteria:

* ticket lookup
* resend workflow
* support logging

Priority:

P1

---

# Phase 3 — Host Operations

## WA-007 — Host Approval Workflow

Persona:

Roberto

Example:

AI prepares event.

WhatsApp:

APPROVE
EDIT
REJECT

Acceptance criteria:

* workflow suspend
* approval capture
* resume workflow

Use official Mastra:

* suspend/resume
* human-in-the-loop

Priority:

P2

---

## WA-008 — Venue Contact Approval Workflow

Persona:

Patricia

Example:

Restaurant inquiry drafted by AI.

Human approves before send.

Acceptance criteria:

* approval gate
* audit log
* workflow resume

Priority:

P2

---

# Phase 4 — Intelligence

## WA-009 — Resource Memory Integration

Purpose:

Remember preferences across WhatsApp conversations.

Examples:

* Laureles
* budget
* nightlife preference

Use:

Mastra resource-scoped memory.

Priority:

P2

---

## WA-010 — Background Follow-Up Campaigns

Examples:

* unfinished booking
* abandoned viewing request
* event reminder

Use:

Mastra scheduled workflows.

Priority:

P2

---

# Required Architecture Review

Verify whether official Mastra features should be used:

| Feature             | Use? | Why? |
| ------------------- | ---- | ---- |
| Workflows           |      |      |
| Scheduled Workflows |      |      |
| Human-in-the-loop   |      |      |
| Suspend/Resume      |      |      |
| Resource Memory     |      |      |
| Background Tasks    |      |      |
| Streaming           |      |      |
| Observability       |      |      |

Explain decisions.

---

# Create Linear Issues

Create actual Linear issues.

Project:

AI & Intelligence

Parent:

WhatsApp / Messaging epic (create one if missing)

Include:

* dependencies
* blockedBy
* priorities
* milestones
* labels

Use same quality standard as SAN-588.

---

# Final Deliverables

1. WhatsApp architecture audit
2. WhatsApp roadmap
3. Linear issues
4. Dependency map
5. Priority order
6. MVP vs Post-MVP classification
7. Revenue impact analysis
8. Risks and blockers

Be critical.

Avoid overengineering.

Follow official Mastra WhatsApp documentation, not generic chatbot patterns.

Reference the official docs throughout the analysis and explain exactly which Mastra features are being adopted and why.
