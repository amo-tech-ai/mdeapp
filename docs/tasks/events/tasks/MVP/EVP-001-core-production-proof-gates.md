---
id: EVP-001-core
legacy_id: EVT-MVP-01
title: Event production proof gates
status: Not Started
priority: P0
phase: mvp
persona: andres
project: andres-commerce
milestone: P0
imp: "083"
linear: SAN-115
percent: 0
blocked_by:
  - OPS-ANDRES-G1
  - EVP-003-core
  - EVP-013-core
  - G3-core-host-publish-proof
blocks: []
persona_note: Consolidates G1+G2+G3 proof for all personas
depends_on:
  - EVP-002-core
  - EVP-004-core
  - EVP-005-core
  - EVP-008-core
  - EVP-009-core
  - EVP-010-core
  - EVP-011-core
  - EVP-012-core
outputs:
  - Updated evidence notes for current Done tasks
  - Clear local vs staging vs production proof table
---

# EVP-001-core — Event production proof gates

## Objective

Refresh proof for the existing events implementation before claiming production readiness. Earlier docs mark major event tasks as Done, but this task records current evidence against the actual `mdeapp` runtime.

## Scope

| Surface | Files/modules | Proof |
|---|---|---|
| Event detail | `src/app/events/[slug]/page.tsx`, `src/components/events/event-detail-view.tsx` | Browser route loads, no console errors |
| Ticket checkout | `src/app/api/tickets/checkout/route.ts`, `src/lib/tickets/*` | Test checkout session created |
| Ticket wallet | `src/app/me/tickets/*`, `src/app/api/tickets/wallet/route.ts` | User-scoped wallet route proof |
| Host wizard | `src/app/host/event/new/page.tsx`, `src/components/host/*` | Roberto can draft and preview |
| HITL publish | `src/lib/events/approval-*`, host approval panel | Human approval required before commit |
| Mastra event tools | `src/mastra/tools/search-events.ts`, `src/mastra/agents/event-agent.ts` | Unit tests + tool smoke |

## Acceptance criteria

- `npm run test` passes from `/home/sk/mdeai/mdeapp`.
- Relevant Playwright screen tests pass: event detail, tickets, host wizard.
- `npm run smoke:ticket-checkout` passes or records exact blocker.
- `npm run smoke:ticket-paid-proof` passes locally or records exact Stripe blocker.
- `POST /api/copilotkit` responds through the current local app.
- Supabase proof records the expected rows for orders/events/approvals where applicable.
- Production readiness remains **No** until the live Stripe Dashboard webhook and live-domain smoke pass.

## Notes

This task is a gate. It does not add features. It makes the existing Done labels trustworthy.
