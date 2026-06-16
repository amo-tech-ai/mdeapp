---
task_id: AGT-PTR-06
linear: SAN-711
title: Partner HITL policy module
parent: SAN-685
project: AI & Intelligence
phase: launch
priority: P2
status: Backlog
depends_on: [SAN-705]
unblocks: [SAN-708, SAN-686]
skills: [mastra, copilotkit]
audit: tasks/design/partners/AI/07-ai-intelligence-partners-audit.md
---

# AGT-PTR-06 — Partner HITL policy module

## Purpose

Shared module listing which partner (and host) actions require `useHumanInTheLoop`. Ship **before or with** PTR-05 so lead reply uses policy from day one.

**Persona:** Patricia ops — one policy table for money/public actions across host + partner agents.

## Policy decision flow

```mermaid
flowchart TD
  accTitle: Partner HITL policy gate
  accDescr: Tool execution checks requiresPartnerHitl before running public actions.

  T["Tool invoked"] --> P{"requiresPartnerHitl?"}
  P -->|no| X["Execute tool"]
  P -->|yes| H["useHumanInTheLoop"]
  H --> A{"approved?"}
  A -->|yes| X
  A -->|no| R["Abort with reason"]
```

## Policy table (MVP)

| Action | HITL required |
|---|---|
| `send_lead_reply` | yes |
| `preview_and_publish` (host) | yes |
| Approve booking + charge | yes |
| Schedule social post | yes |
| Read KPIs / drafts | no |
| `upsert_partner_draft` autosave | no |

## Acceptance criteria

- [ ] `mdeapp/src/mastra/lib/partner-hitl-policy.ts` exports `requiresPartnerHitl(action: string): boolean`
- [ ] `partnerAgent` tool wrapper checks policy before execute
- [ ] Host publish may import same policy (optional same PR)
- [ ] Unit tests: each action class covered
- [ ] Documented in `partnerAgent` system prompt appendix

## Files (expected touch)

- `mdeapp/src/mastra/lib/partner-hitl-policy.ts`
- `mdeapp/src/mastra/lib/partner-hitl-policy.test.ts`
- `mdeapp/src/mastra/agents/partner.ts`

## Verify

```bash
cd mdeapp && npm test -- --run src/mastra/lib/partner-hitl-policy
npm run floor
```

## Blocks

SAN-708 lead HITL · SAN-686 booking HITL · SAN-687 Postiz actions
