# Task: Review CopilotKit repos and create an implementation plan for an AI-first dashboard/chat platform

> **Output doc (canonical):** [`../docs/01a-copilotkit-mastra-plan.md`](01a-copilotkit-mastra-plan.md)  
> **Short ranking:** [`06a-copilotkit-events.md`](./06a-copilotkit-events.md)  
> **Research draft:** [`../docs/01-CopilotKit Event Dashboard Plan.md`](01-CopilotKit%20Event%20Dashboard%20Plan.md)

Act as a Senior AI Product Architect, CopilotKit Engineer, UX Systems Designer, and Technical PM.

Goal:
Review the repos/examples below and recommend how to use them to build an AI CopilotKit dashboard + chat experience that improves traditional dashboards with AI agents, generative UI, shared state, workflows, approvals, and contextual actions.

## Repos / examples to review

1. Project Manager  
https://www.copilotkit.ai/examples/project-manager

2. Chat With Your Data  
https://www.copilotkit.ai/examples/chat-with-your-data

3. Mastra PM Canvas  
https://github.com/CopilotKit/mastra-pm-canvas

4. CopilotKit Mastra PM Canvas Example  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm

5. Travel Planner  
https://www.copilotkit.ai/examples/travel-planner

6. ADK Generative Dashboard  
https://github.com/CopilotKit/adk-generative-dashboard

7. CopilotKit Showcases  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases

8. A2A Travel  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/a2a-travel

9. ADK Dashboard Showcase  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/adk-dashboard

10. Banking Showcase  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking

11. Deep Agents  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/deep-agents

12. Generative UI Playground  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/generative-ui-playground

13. Generative UI  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/generative-ui

14. MCP Apps  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/mcp-apps

15. Microsoft Kanban  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/microsoft-kanban

16. Multi-Agent Canvas  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/multi-agent-canvas

17. Multi-Page  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/multi-page

18. Strands CRM  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/strands-crm

19. Todo  
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/todo

20. Cubic Codebase Scan  
https://www.cubic.dev/codebase-scan?repo=1244282289

## Product target

Build an AI-first dashboard/chat platform for:

- Events planning
- Ticketing
- Rentals
- Venues
- Partners
- CRM/leads
- Admin operations
- Maps/search
- Workflow automation

The dashboard should be better than traditional dashboards because users can:

- Ask questions in chat
- Generate dashboards from data
- Update records through AI actions
- Approve important changes before commit
- See AI-generated cards, tables, forms, charts, and workflows
- Run multi-step planning tasks
- Use shared state between UI and agent
- Turn insights into actions

## Required output

Create a concise but complete markdown report with these sections:

## 1. Executive verdict

Rank the repos from highest to lowest value for this product.

Use this table:

| Rank | Repo | URL | Best Use | Core / Advanced | Score /100 | Use Decision |
|---:|---|---|---|---|---:|---|

Use decisions:
- FOUNDATION
- COPY PATTERNS
- REFERENCE ONLY
- DEFER
- AVOID

## 2. Best foundation choice

Pick the best repo/example to start from.

Explain:
- Why it should be the base
- What files/folders matter
- What to keep
- What to delete
- What to adapt
- What risks exist

## 3. AI dashboard feature plan

Create this table:

| Feature | Traditional Dashboard | AI-First Improvement | Best Repo Pattern | MVP or Advanced |
|---|---|---|---|---|

Include features like:
- AI chat sidebar
- Generative dashboard cards
- AI-created tables
- AI-created charts
- Task board
- Event planner board
- Approval workflows
- CRM lead assistant
- Ticketing assistant
- Venue search assistant
- Rentals assistant
- Admin operations copilot
- Chat with data
- Multi-agent workflows
- MCP tool integrations

## 4. Event planner use case

Design how the AI dashboard should work for event planning.

Include:
- Event creation wizard
- Budget planner
- Vendor checklist
- Venue shortlist
- Sponsor outreach draft
- Ticket tiers
- Publishing approval
- Sales dashboard
- Staff check-in dashboard
- Post-event report

Use real-world example:
“Medellín Fashion Night”

## 5. Architecture recommendation

Recommend the best architecture using:

- Next.js
- CopilotKit
- Mastra
- Supabase
- Stripe
- Google Maps
- Gemini
- MCP tools

Create a simple architecture diagram in Mermaid.

## 6. Implementation plan

Create a phased plan:

| Phase | Goal | Repos Used | Deliverables | Success Test |
|---:|---|---|---|---|

Phases:
1. Foundation
2. AI chat shell
3. Event planner dashboard
4. Generative UI cards/forms
5. Approvals and HITL
6. Chat with data
7. CRM/leads
8. Maps and venue search
9. Advanced multi-agent workflows

## 7. Risks and blockers

Identify:
- Wrong repo choice
- Overbuilding
- Mixing too many agent frameworks
- CopilotKit version mismatch
- Poor state management
- No approval gates
- AI hallucinated data
- Security risks
- Production deployment risks

Use this table:

| Risk | Severity | Why It Matters | Fix |
|---|---|---|---|

## 8. Final recommendation

Give one clear answer:

- Best foundation repo
- Best pattern repos
- Best MVP scope
- What not to build yet
- Exact next 5 tasks

Keep the answer practical, concise, and implementation-focused.