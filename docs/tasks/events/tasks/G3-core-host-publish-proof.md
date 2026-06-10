---
id: G3-core-host-publish-proof
legacy_id: G3
title: Roberto host publish — authenticated HITL → Supabase row (prod proof)
status: Partial
priority: P0
phase: mvp
persona: roberto
project: roberto-host
milestone: P0
imp: "082"
linear: SAN-366
percent: 90
blocked_by: []
blocks: [EVP-001-core]
depends_on:
  - EVP-010-core
  - EVP-011-core
  - EVP-012-core
skill: [testing, mde-supabase, copilotkit-integrations]
spec_refs:
  - ../archive/events-A/EVP-010-core-host-event-new-wizard.md
  - ../archive/events-A/EVP-011-core-approval-panel-hitl.md
  - ../archive/events-A/EVP-012-core-approval-commit-edge-fn.md
---

# G3-core — Host publish production proof

## Purpose

**Roberto** completes `/host/event/new` → HITL approve → **row in Supabase** on **https://www.mdeai.co**. Code for EVP-010/011/012 is **Done** (archived); this task is **ops proof only**.

## Acceptance

- [ ] Authenticated host session (not logged-out redirect only)
- [ ] NL wizard fills `EventDraftState`
- [ ] HITL approval panel → `respond(approved)`
- [ ] SQL row in `events` (+ ticket tiers if applicable) with evidence path
- [ ] Evidence rolls into [EVP-001-core](./EVP-001-core-production-proof-gates.md)

## Sub-issues (Linear)

| Sub | Work |
|-----|------|
| G3.1 | Bypass-auth or test-user wizard fill E2E |
| G3.2 | Approve → commit edge → Supabase SELECT proof |
| G3.3 | Screenshot + curl + evidence markdown |

## Verify

```bash
cd mdeapp && npm run test:e2e -- host-event
```

Evidence target: `tasks/notes/G3-host-publish-evidence.md`
