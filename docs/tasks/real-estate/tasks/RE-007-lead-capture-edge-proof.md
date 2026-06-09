---
task_id: RE-007
title: Lead capture edge proof (G2)
layer: EDGE
priority: P0
phase: core
status: Not Started
persona: Sofía
depends_on: [RE-006]
unblocks: [RE-008]
skills: [mde-supabase, task-verifier]
related:
  - ../../../supabase/functions/chat-lead-capture/index.ts
  - ../../archive/real-estate-A/F47-lead-capture-api.md
description: Evidence for chat-lead-capture — rate limit, idempotency, no service role in browser.
---

# RE-007 — Lead capture edge proof

## Verify

| Check | Method |
|-------|--------|
| Guest rate limit 20/hr/IP | edge logs / test burst |
| Authenticated path | session JWT |
| `listing_id` in metadata | SQL inspect new lead |
| No service role in mdeapp browser | grep + hook |
| Idempotency | resubmit same payload |

## Acceptance criteria

- [ ] Evidence: `tasks/real-estate/evidence/RE-007-g2-lead-capture.md`
- [ ] curl/API test documented
- [ ] RLS note: leads not world-readable

## Parallel

- **data-020** adds `apartment_id` column — update edge after migration
