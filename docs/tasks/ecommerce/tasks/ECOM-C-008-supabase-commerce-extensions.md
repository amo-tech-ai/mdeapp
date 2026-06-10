---
id: ECOM-C-008
task_id: ECOM-C-008
title: Supabase commerce extension tables
status: Not Started
priority: P0
phase: core
milestone: M2 - AI product cards and cart
effort: M
estimated_effort: 1-2 days
owner: mdeai-commerce
area: database
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-636
linear_url: https://linear.app/sanjiovani/issue/SAN-636
depends_on: [ECOM-C-001]
blocks: [ECOM-C-009, ECOM-M-009, ECOM-M-010, ECOM-M-011, ECOM-M-012]
skill: db-generate
skills: [db-generate, db-migrate]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://supabase.com/docs
  - https://supabase.com/docs/guides/database/extensions/pgvector
official_refs:
  - https://supabase.com/docs
  - https://supabase.com/docs/guides/database/extensions/pgvector
description: "Add only Supabase embedding/link tables, never product, cart, order, price, or inventory truth."
---

# ECOM-C-008 - Supabase commerce extension tables

## 1. Purpose

**Easy description:** Add only Supabase embedding/link tables, never product, cart, order, price, or inventory truth.

**Goal:** Add Supabase tables for embeddings and links only, with RLS.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add `commerce_product_embeddings`.
- Add optional sync log table.
- Add later-ready link tables only if needed by follow-on tasks.
- Do not add Supabase product, order, cart, inventory, or price truth.
- Enable RLS and policies.
- Use migration path `mdeapp/supabase/migrations`, not the root-level migration directory.

## 4. Workflows

1. Create or modify only Supabase extension/link/vector tables.
2. Add RLS and negative checks.
3. Verify no product/order/cart/price/inventory truth is copied.
4. Run migration and stale-data checks.

### Files likely touched

- commerce_product_embeddings
- mdeapp/supabase/migrations

## 5. User Journeys

**Real-world example:** Camila asks the AI for a cafe-friendly outfit, sees live ProductCards, adds one size to cart, and never sees stale Supabase price data.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- No autonomous agent behavior is added in this task; keep changes deterministic and manually verifiable.

## 7. Integrations

### Official docs/repos used

- https://supabase.com/docs
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
| Depends on | ECOM-C-001 |
| Blocks | ECOM-C-009, ECOM-M-009, ECOM-M-010, ECOM-M-011, ECOM-M-012 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] RLS is enabled on new tables.
- [ ] No mutable commerce truth table is added to Supabase.
- [ ] Embeddings table stores product id, embedding text, vector, sync checksum, and sync metadata only.
- [ ] Migration has rollback/down notes.

### Proof Commands

```bash
rg -n "create table .*commerce_.*(products|orders|carts|inventory)" mdeapp/supabase/migrations && exit 1 || echo OK
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- RLS checks: anon cannot write embeddings; service role can upsert.
- Supabase migration dry run in local/test project.
