# mdeai Mastra Events Roadmap

> **Canonical plan:** [`../docs/02-mastra-events.md`](02-mastra-events.md)  
> **CopilotKit UI companion:** [`../docs/01a-copilotkit-mastra-plan.md`](01a-copilotkit-mastra-plan.md)  
> **Repo ranking:** [`07-mastra-repos.md.md`](./07-mastra-repos.md.md)

## Goal

Build an AI-powered Event Operating System.

Do NOT build:

* Agent swarms
* Autonomous outreach
* Complex multi-agent systems
* Overengineered workflows

Focus on proving:

```text
Discover Event
→ Create Event
→ Publish Event
→ Sell Ticket
→ Attend Event
→ Analyze Results
```

---

# Phase 1 — CORE

## Goal

Prove event creation and ticket sales.

## Repositories

| Repo               | Use           |
| ------------------ | ------------- |
| Mastra Core        | Foundation    |
| Personal Assistant | Event Copilot |
| Mastra Triage      | Agent routing |
| AGUI Dojo          | Dashboard UI  |

---

## Core Agents

### 1. routerAgent

Purpose:

Route requests.

Examples:

```text
Find venue
→ venueAgent

Create event
→ hostEventAgent

Show ticket sales
→ analyticsAgent
```

---

### 2. hostEventAgent

Purpose:

Create and manage events.

Examples:

```text
Create Medellín Fashion Night
Create Salsa Festival
Create Startup Meetup
```

---

### 3. venueAgent

Purpose:

Venue discovery.

Examples:

```text
Find venue for 300 guests
Find rooftop venue
Find venue under $2,000
```

---

### 4. ticketingAgent

Purpose:

Ticket operations.

Examples:

```text
Create VIP ticket
Create Early Bird ticket
Show ticket sales
```

---

### 5. analyticsAgent

Purpose:

Business reporting.

Examples:

```text
How many tickets sold?
Revenue today?
Most popular event?
```

---

## Core Workflows

### 1. createEventWorkflow

```text
Event Idea
→ Venue
→ Ticket Setup
→ Review
→ Approval
→ Publish
```

Output:

Published Event

---

### 2. ticketSetupWorkflow

```text
Capacity
→ Ticket Types
→ Pricing
→ Stripe
```

Output:

Live Ticket Sales

---

### 3. venueShortlistWorkflow

```text
Search
→ Compare
→ Score
→ Recommend
```

Output:

Top 5 Venues

---

## Core Features

| Feature           | Why      |
| ----------------- | -------- |
| Event creation    | Required |
| Venue search      | Required |
| Ticket setup      | Required |
| Publish approval  | Required |
| Event dashboard   | Required |
| Sales dashboard   | Required |
| AI chat assistant | Required |

---

## Real World Example

### Medellín Fashion Night

```text
User:
Create event for 250 guests

AI:
Creates draft

AI:
Suggests 5 venues

AI:
Creates ticket tiers

User:
Approve

AI:
Publishes event
```

---

# Phase 2 — MVP

## Goal

Improve discovery and operations.

## Additional Repositories

| Repo                 | Use                |
| -------------------- | ------------------ |
| Template Deep Search | Research           |
| Browsing Agent       | Venue intelligence |
| Text To SQL          | Analytics          |
| Customer Feedback    | Reviews            |

---

## New Agents

### 6. conciergeAgent

Purpose:

Event discovery.

Examples:

```text
What should I do tonight?
Best salsa events?
Best fashion events?
```

---

### 7. sponsorAgent

Purpose:

Research sponsors.

Examples:

```text
Find fashion sponsors
Find startup sponsors
Find nightlife sponsors
```

---

### 8. crmAgent

Purpose:

Lead management.

Examples:

```text
Track sponsors
Track venue leads
Track partners
```

---

## MVP Workflows

### 4. sponsorDiscoveryWorkflow

```text
Research
→ Score
→ Shortlist
```

Output:

Top Sponsors

---

### 5. salesInsightWorkflow

```text
Query Sales
→ Analyze
→ Recommend
```

Output:

Revenue Report

---

### 6. eventFeedbackWorkflow

```text
Collect Reviews
→ Summarize
→ Recommendations
```

Output:

Event Improvement Plan

---

## MVP Features

| Feature                 | Use Case   |
| ----------------------- | ---------- |
| Event recommendations   | Discovery  |
| Sponsor research        | Revenue    |
| CRM dashboard           | Sales      |
| Event feedback analysis | Quality    |
| Revenue reporting       | Operations |
| Venue comparison        | Planning   |

---

## Real World Example

### Fashion Week Sponsor Search

```text
Find local fashion brands

AI:
Researches companies

AI:
Scores sponsors

AI:
Creates shortlist

AI:
Suggests sponsorship tiers
```

---

# Phase 3 — ADVANCED

## Goal

Scale operations safely.

Only start after:

```text
Events selling tickets
Sponsors acquired
CRM used daily
```

---

## Additional Repositories

| Repo         | Use                  |
| ------------ | -------------------- |
| AI Buddies   | Multi-agent patterns |
| AgentStack   | Orchestration        |
| Social Agent | Marketing            |
| MCP Agent    | Integrations         |

---

## Advanced Agents

### 9. marketingAgent

Purpose:

Campaign generation.

Examples:

```text
Instagram campaign
Email campaign
Sponsor campaign
```

---

### 10. partnerAgent

Purpose:

Partner ecosystem.

Examples:

```text
Venue partners
Restaurant partners
Cafe partners
```

---

### 11. adminOpsAgent

Purpose:

Operations.

Examples:

```text
Failed payments
Refund issues
Ticket problems
```

---

### 12. automationAgent

Purpose:

Approved automation only.

Examples:

```text
Generate campaign drafts
Generate sponsor proposals
Generate reports
```

---

## Advanced Workflows

### 7. marketingCampaignWorkflow

```text
Event
→ Content
→ Approval
→ Schedule
```

---

### 8. sponsorProposalWorkflow

```text
Sponsor
→ Package
→ Proposal
→ Approval
```

---

### 9. postEventReportWorkflow

```text
Revenue
→ Attendance
→ Feedback
→ Summary
```

---

### 10. adminExceptionWorkflow

```text
Failures
→ Diagnosis
→ Fix Plan
```

---

## Advanced Features

| Feature             | Value        |
| ------------------- | ------------ |
| Marketing AI        | Growth       |
| Sponsor proposals   | Revenue      |
| Partner management  | Expansion    |
| Post-event reports  | Insights     |
| MCP integrations    | Productivity |
| Workflow automation | Efficiency   |

---

# Final Architecture

## Build Now

```text
routerAgent
hostEventAgent
venueAgent
ticketingAgent
analyticsAgent

createEventWorkflow
ticketSetupWorkflow
venueShortlistWorkflow
```

## Build Next

```text
conciergeAgent
sponsorAgent
crmAgent

salesInsightWorkflow
eventFeedbackWorkflow
sponsorDiscoveryWorkflow
```

## Build Later

```text
marketingAgent
partnerAgent
adminOpsAgent
automationAgent

marketingCampaignWorkflow
postEventReportWorkflow
adminExceptionWorkflow
```

## Do NOT Build Yet

```text
Multi-agent swarms
Autonomous outreach
Auto-publishing
Auto-spending
Complex agent-to-agent networks
10+ agents in MVP
```

### MVP Success Metric

```text
Host creates event
→ Event published
→ Tickets sold
→ Revenue tracked
→ Event completed
→ Report generated
```

If those 6 steps work reliably, the Mastra event platform is successful.
