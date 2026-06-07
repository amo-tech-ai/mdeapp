---
id: ECOM-C-009
task_id: ECOM-C-009
title: Product embedding sync
status: Not Started
priority: P0
phase: 3
milestone: M3 - AI commerce
effort: M
estimated_effort: 1-2 days
owner: mdeai-commerce
area: database
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-637
linear_url: https://linear.app/sanjiovani/issue/SAN-637
depends_on: [ECOM-C-006, ECOM-C-018]
blocks: [ECOM-C-010]
skill: mde-supabase
skills: [mde-supabase, gemini]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - docs/ecommerce/audit/1-tasks-audit.md
  - https://docs.medusajs.com
  - https://supabase.com/docs/guides/database/extensions/pgvector
official_refs:
  - https://docs.medusajs.com
  - https://supabase.com/docs/guides/database/extensions/pgvector
description: "Sync searchable product text into pgvector while hydrating live price and stock from Medusa later."
---

# ECOM-C-009 - Product embedding sync

## 1. Purpose

**Easy description:** Sync searchable product text into pgvector while hydrating live price and stock from Medusa later.

**Goal:** Sync Medusa product search text into Supabase pgvector without copying commerce truth.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

### Step A — Supabase link tables (formerly misnumbered C-008)

- Add `commerce_product_embeddings` migration under `mdeapp/supabase/migrations/`
- RLS enabled; **no** price, stock, cart, or order columns
- Optional sync log table

### Step B — Embedding sync

- Build embedding text from Mercur product title, description, tags, and non-price attributes.
- Generate Gemini embeddings.
- Upsert into `commerce_product_embeddings`.
- Store checksum and `synced_at`.
- Add stale-data detector.

## 4. Workflows

1. Create or modify only Supabase extension/link/vector tables.
2. Add RLS and negative checks.
3. Verify no product/order/cart/price/inventory truth is copied.
4. Run migration and stale-data checks.

### Files likely touched

- commerce_product_embeddings
- synced_at

## 5. User Journeys

**Real-world example:** Camila asks the AI for a cafe-friendly outfit, sees live ProductCards, adds one size to cart, and never sees stale Supabase price data.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- Gemini may generate embeddings or ranking text; Supabase stores vectors only.

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com
- https://supabase.com/docs/guides/database/extensions/pgvector

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M2 - AI product cards and cart |
| Priority | P0 |
| Estimate | M / 1-2 days |
| Depends on | ECOM-C-006, ECOM-C-008 |
| Blocks | ECOM-C-010 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Product sync writes product id and vector.
- [ ] Sync does not write authoritative price, stock, cart, or order data.
- [ ] Failed sync is logged and retryable.
- [ ] Stale products are detectable.

### Proof Commands

```bash
cd mdeapp && node --env-file=.env.local scripts/sync-commerce-embeddings.mjs --dry-run
cd mdeapp && npm test -- src/lib/commerce/embedding-text.test.ts
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Unit tests for embedding text builder.
- Unit tests for checksum/staleness logic.
