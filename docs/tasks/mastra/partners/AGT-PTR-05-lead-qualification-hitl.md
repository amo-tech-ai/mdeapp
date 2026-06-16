---
task_id: AGT-PTR-05
linear: SAN-708
title: Lead qualification + HITL reply draft
parent: SAN-685
project: AI & Intelligence
phase: launch
priority: P1
status: Backlog
depends_on: [SAN-706, AGT-PTR-06]
unblocks: [SAN-684]
skills: [mastra, copilotkit, mde-supabase]
audit: tasks/design/partners/AI/07-ai-intelligence-partners-audit.md
---

# AGT-PTR-05 — Lead qualification + HITL reply

## Purpose

`partnerAgent` scores inbound `leads`, drafts a reply, and **requires HITL** before any customer-visible send or status change to `contacted`.

**Persona:** Broker on `/dashboard` — AI drafts reply; human approves before tourist sees it.

## HITL sequence

```mermaid
sequenceDiagram
  participant Partner as Partner user
  participant Agent as partnerAgent
  participant Policy as partner-hitl-policy
  participant UI as lead-reply-hitl panel
  participant API as /api/partners/leads/id

  Partner->>Agent: qualify this lead
  Agent->>Agent: qualify_lead tool
  Agent->>Agent: draft_lead_reply tool
  Agent->>Policy: requiresPartnerHitl send_lead_reply
  Policy-->>Agent: true
  Agent->>UI: useHumanInTheLoop
  Partner->>UI: approve or edit
  UI->>Agent: respond approved true
  Agent->>API: PATCH status contacted
```

## Acceptance criteria

- [ ] Tool `qualify_lead`: score + rationale in agent state
- [ ] Tool `draft_lead_reply`: draft in state or `leads.metadata`
- [ ] `useHumanInTheLoop` before `send_lead_reply`
- [ ] `send_lead_reply` only after `respond({ approved: true })`
- [ ] Updates `leads.status` via `/api/partners/leads/[id]` with RLS
- [ ] `requiresPartnerHitl` from AGT-PTR-06 gates outbound send
- [ ] Vitest: send blocked without approval
- [ ] Optional: SAN-590 faithfulness scorer on draft

## HITL trigger

| Action | HITL |
|---|---|
| Outbound message to tourist | required |
| Internal note / qualify only | not required |

## Files (expected touch)

- `mdeapp/src/mastra/tools/partner-leads.ts`
- `mdeapp/src/app/api/partners/leads/[id]/route.ts`
- `mdeapp/src/components/partners/lead-reply-hitl.tsx`

## Verify

```bash
cd mdeapp && npm test -- --run src/mastra/tools/partner-leads
npm run floor
```

## Blocks

SAN-684 lead engine AI layer
