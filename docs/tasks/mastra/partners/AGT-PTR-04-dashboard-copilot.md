---
task_id: AGT-PTR-04
linear: SAN-707
title: Dashboard copilot shell (/dashboard)
parent: SAN-685
project: AI & Intelligence
phase: launch
priority: P1
status: Backlog
depends_on: [SAN-705, SAN-706, AGT-PTR-00]
unblocks: [SAN-690]
skills: [copilotkit, mastra, shadcn]
partners_ui: SAN-690
audit: tasks/design/partners/AI/07-ai-intelligence-partners-audit.md
---

# AGT-PTR-04 — Dashboard copilot shell

## Purpose

Partner dashboard mounts `partnerAgent` with `capability: "dashboard"` in working memory. Read-only KPIs and navigation help first.

> **Note:** `partnerAgent` is a deferred marketplace-tier agent — until marketplace scale, fold this capability into an existing agent as a tool rather than standing up a new agent.

**Persona:** Activated partner asks "how many leads this week?" without leaving `/dashboard`.

## Layout architecture

```mermaid
flowchart TD
  accTitle: Dashboard copilot shell
  accDescr: Agent Lock layout with read-only tools on partnerAgent.

  Dash["/dashboard layout"] --> CK["CopilotKit partnerAgent"]
  CK --> Bridge["dashboard-copilot-bridge"]
  Bridge --> Tabs["SAN-690 tabs"]
  CK --> Tools["get_partner_profile<br/>list_partner_leads"]
  Tools --> API["/api/partners/*"]
```

## Acceptance criteria

- [ ] `dashboard/layout.tsx` per AGT-PTR-00 — `threadId={`partner:${partnerId}`}`
- [ ] CopilotKit sidebar or embedded panel
- [ ] `useAgent({ name: "partnerAgent" })` initial state `{ capability: "dashboard", partnerId }`
- [ ] Read-only tools: `get_partner_profile`, `list_partner_leads` (requires SAN-706)
- [ ] No booking/Postiz/revenue mutations without PTR-05/06 HITL
- [ ] Auth: unauthenticated → `/login`; no partner row → `/partners/signup`
- [ ] Register `/dashboard` in `sitemap.md` when route ships
- [ ] Vitest: bridge renders with mocked agent state

## Out of scope (MVP)

- Postiz (SAN-687) · Revenue ML (SAN-668) · Booking approve (SAN-686)

## Files (expected touch)

- `mdeapp/src/app/dashboard/layout.tsx`
- `mdeapp/src/components/partners/partner-dashboard-copilot-bridge.tsx`

## Verify

```bash
cd mdeapp && npm run dev
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/dashboard
npm run floor
```

## Coordination

**SAN-690** owns tabs/KPI UI; **this task** owns copilot mount + read tools.
