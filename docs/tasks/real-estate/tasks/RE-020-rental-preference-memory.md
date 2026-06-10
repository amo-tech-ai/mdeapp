---
task_id: RE-020
title: Rental preference memory (pgvector + ranking)
layer: DATA+APP
priority: P2
phase: post-mvp
status: Not Started
persona: Camila
depends_on: [RE-018, RE-019, VEC-001]
unblocks: []
skills: [mde-supabase, mastra, gemini, mde-task-lifecycle]
paths:
  - mdeapp/src/mastra/agents/concierge.ts
  - mdeapp/src/mastra/agents/rental-agent.ts
description: Durable preferences + semantic recall; optional rentalAgent routing.
---

# RE-020 — Rental preference memory (P2)

## Problem

No product memory beyond `useCoAgent` thread working memory. No pgvector in `mdeapp/src` yet. Personalization and "quiet remote-work" ↔ "peaceful WiFi" equivalence deferred.

## Scope

1. **After VEC-001** — pgvector extension + embedding table pattern
2. Store preference summaries per user/resource (Supabase + RLS)
3. Inject retrieved prefs into `conciergeAgent` or route high-intent threads to `rentalAgent`
4. Ranking explanations via Gemini (why Laureles fits remote work)

## Acceptance criteria

- [ ] VEC-001 complete
- [ ] Design doc: table + RLS + embed model (Gemini embedding API)
- [ ] At least one E2E path: save preference → next search ranks accordingly

## References

- [`tasks/testing/agent/02-links-memory.md`](../../testing/agent/02-links-memory.md)
- [`tasks/vector/VEC-001-pgvector-inventory-and-duplicate-index-plan.md`](../../vector/VEC-001-pgvector-inventory-and-duplicate-index-plan.md)

## Out of scope (Phase 1 MVP exit)

- Not required for G1 Stripe or EVP-003
- Ship RE-017 + RE-018 first
