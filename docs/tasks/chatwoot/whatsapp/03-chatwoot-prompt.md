# Forensic Audit: Chatwoot + Mastra Architecture for mdeai

You are a Principal Software Architect, Mastra Expert, Chatwoot Specialist, WhatsApp Platform Engineer, Product Manager, and Forensic Auditor.

Your job is to determine the BEST architecture for Chatwoot + Mastra inside mdeai.

Do not assume.

Verify everything from source code, documentation, installed packages, Linear, and existing architecture before making recommendations.

---

# Required Research

Review all official documentation first.

## Chatwoot

Review:

- [https://www.chatwoot.com/docs](https://www.chatwoot.com/docs)
    
- [https://www.chatwoot.com/docs/product/channels/whatsapp](https://www.chatwoot.com/docs/product/channels/whatsapp)
    
- [https://www.chatwoot.com/docs/product/others/agent-bots](https://www.chatwoot.com/docs/product/others/agent-bots)
    
- [https://www.chatwoot.com/docs/product/features/automation](https://www.chatwoot.com/docs/product/features/automation)
    
- [https://www.chatwoot.com/docs/product/features/inbox-management](https://www.chatwoot.com/docs/product/features/inbox-management)
    
- [https://www.chatwoot.com/docs/self-hosted](https://www.chatwoot.com/docs/self-hosted)
    
- [https://developers.chatwoot.com](https://developers.chatwoot.com/)
    

Determine:

- Agent Bot capabilities
    
- Webhooks
    
- APIs
    
- WhatsApp integrations
    
- Human handoff patterns
    
- Automation rules
    
- Labels
    
- Routing
    
- Mobile support
    
- Omnichannel capabilities
    
- Self-hosting requirements
    

---

## Mastra

Review:

- [https://mastra.ai](https://mastra.ai/)
    
- [https://mastra.ai/docs](https://mastra.ai/docs)
    
- [https://mastra.ai/guides/guide/whatsapp-chat-bot](https://mastra.ai/guides/guide/whatsapp-chat-bot)
    
- [https://mastra.ai/examples/v0/agents/whatsapp-chat-bot](https://mastra.ai/examples/v0/agents/whatsapp-chat-bot)
    
- workflows
    
- suspend/resume
    
- human-in-the-loop
    
- memory
    
- background tasks
    
- observability
    
- agents
    
- tools
    

Determine:

- Which Mastra features should be used
    
- Which Mastra features should NOT be used
    
- Whether Chatwoot changes the existing roadmap
    
- How Mastra fits into Chatwoot architecture
    

---

# Review Existing mdeai Architecture

Audit actual implementation.

Review:

- CLAUDE.md
    
- DESIGN.MD
    
- sitemap.md
    
- tasks/mastra/**
    
- tasks/events/**
    
- tasks/rentals/**
    
- tasks/trips/**
    
- tasks/venues/**
    
- tasks/maps/**
    
- src/mastra/**
    
- src/app/api/copilotkit/**
    
- existing workflows
    
- existing agents
    
- Supabase schema
    
- WhatsApp tables
    
- lead capture
    
- booking flows
    
- Stripe integration
    

Verify:

- conciergeAgent
    
- rentalAgent
    
- hostEventAgent
    
- routerAgent
    
- memory implementation
    
- approval implementation
    
- workflow implementation
    

Generate:

|Capability|Exists|Reusable|Missing|
|---|---|---|---|

Do not assume anything exists.

Verify.

---

# Architecture Decision

Determine whether the recommended architecture should be:

Option A

WhatsApp  
→ Chatwoot  
→ Mastra  
→ Supabase

Option B

WhatsApp  
→ Mastra  
→ Chatwoot

Option C

Hybrid

Provide a recommendation with reasoning.

---

# Build vs Buy Analysis

Evaluate:

## Chatwoot should own

- inbox
    
- agent console
    
- mobile app
    
- human handoff
    
- routing
    
- labels
    
- CSAT
    
- conversation history
    

Verify.

## Mastra should own

- reasoning
    
- workflows
    
- approvals
    
- memory
    
- orchestration
    
- lead qualification
    

Verify.

Generate:

|Responsibility|Chatwoot|Mastra|Supabase|
|---|---|---|---|

---

# Revenue-First Roadmap

mdeai priorities:

1. rentals
    
2. restaurants
    
3. cafes
    
4. nightlife
    
5. events
    
6. trips
    

Design the roadmap around revenue generation.

Do not overengineer.

Do not introduce:

- MCP
    
- RAG
    
- multi-agent systems
    
- Kubernetes
    
- microservices
    
- unnecessary abstractions
    

Reuse existing architecture.

---

# Create Implementation Plan

Generate:

## Phase 1 — Rentals MVP

User:

"Find apartments in Laureles"

Flow:

WhatsApp  
→ Chatwoot  
→ Mastra  
→ rentalAgent  
→ lead capture  
→ human handoff

Include:

- architecture
    
- sequence diagram
    
- tasks
    
- dependencies
    
- effort
    
- risks
    

---

## Phase 2 — Restaurants / Cafes

Use existing grounded search tools.

Show exactly how Chatwoot interacts with conciergeAgent.

---

## Phase 3 — Nightlife

Use existing venue architecture.

---

## Phase 4 — Events

Use existing event workflows.

Include:

- ticket support
    
- QR resend
    
- host approvals
    

---

# Critical Audit

Identify:

- architectural mistakes
    
- duplicated systems
    
- overlapping responsibilities
    
- maintenance risks
    
- scaling risks
    
- security risks
    
- WhatsApp policy risks
    
- Meta pricing risks
    

Generate:

| Risk | Severity | Recommendation |

---

# Deliverables

Generate:

1. Current-state audit
    
2. Chatwoot capability audit
    
3. Mastra capability audit
    
4. Architecture recommendation
    
5. Responsibility matrix
    
6. Revenue-first roadmap
    
7. Implementation phases
    
8. Linear epic structure
    
9. Risks and blockers
    
10. Final recommendation
    

Be brutally honest.

Challenge assumptions.

Prefer simplicity over cleverness.

The final architecture should be something a small team can operate and maintain while maximizing revenue and minimizing complexity.