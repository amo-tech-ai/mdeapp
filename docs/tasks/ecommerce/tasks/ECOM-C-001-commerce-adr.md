---
id: ECOM-C-001
task_id: ECOM-C-001
title: Commerce architecture decision record
status: Not Started
priority: P0
phase: core
milestone: M1 - Core commerce foundation
effort: S
estimated_effort: 0.5-1 day
owner: mdeai-commerce
area: commerce
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-629
linear_url: https://linear.app/sanjiovani/issue/SAN-629
depends_on: [ECOM-C-000]
blocks: [ECOM-C-002, ECOM-C-008]
skill: mde-task-lifecycle
skills: [mde-task-lifecycle, building-with-medusa]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.medusajs.com
  - https://docs.medusajs.com/resources/recipes/marketplace
  - https://supabase.com/docs
  - https://docs.stripe.com
official_refs:
  - https://docs.medusajs.com
  - https://docs.medusajs.com/resources/recipes/marketplace
  - https://supabase.com/docs
  - https://docs.stripe.com
description: "Write the commerce boundary decision before any Medusa or Supabase changes land."
---

# ECOM-C-001 - Commerce architecture decision record

## 1. Purpose

**Easy description:** Write the commerce boundary decision before any Medusa or Supabase changes land.

**Goal:** Create the ADR that locks the commerce boundary before any code lands.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add `tasks/ecommerce/docs/ADR-commerce-bounded-context.md`.
- Declare Medusa as the owner of products, variants, carts, orders, inventory, payments lifecycle references, and later vendor module data.
- Declare Supabase as the owner of identity, vectors, profiles, links, analytics, and pre-approval vendor applications only.
- Declare mdeai Next.js/CopilotKit as the only storefront.
- Declare Mastra as the orchestration/tool layer.
- Explicitly defer Stripe Connect, multi-vendor, WhatsApp automation, reviews, AI stylist, and creator commerce.

## 4. Workflows

1. Make the smallest repo change that satisfies the task.
2. Preserve existing mdeai routes and product flows.
3. Run proof commands.
4. Rollback using the documented plan if any gate fails.

### Files likely touched

- tasks/ecommerce/docs/ADR-commerce-bounded-context.md

## 5. User Journeys

**Real-world example:** Andres asks for a Medellin designer shirt and the platform has a real Medusa product, image, price, and stock record to show him.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- No autonomous agent behavior is added in this task; keep changes deterministic and manually verifiable.

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com
- https://docs.medusajs.com/resources/recipes/marketplace
- https://supabase.com/docs
- https://docs.stripe.com

### Skill guardrails

- `building-with-medusa`: do not fork Medusa; use modules, workflows, API routes, and links.
- `mde-task-lifecycle`: task must remain traceable through proof and ship gates.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M1 - Core commerce foundation |
| Priority | P0 |
| Estimate | S / 0.5-1 day |
| Depends on | ECOM-C-000 |
| Blocks | ECOM-C-002, ECOM-C-008 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] ADR exists and names the first milestone as single-seller AI commerce proof.
- [ ] ADR says no separate ecommerce frontend.
- [ ] ADR says no mutable product/order/cart/inventory data in Supabase.
- [ ] ADR says Stripe Connect starts only after single-vendor checkout proof.
- [ ] ADR includes rollback and feature-flag strategy.

### Proof Commands

```bash
rg -n "Medusa owns|Supabase owns|separate ecommerce frontend|Stripe Connect" tasks/ecommerce/docs/ADR-commerce-bounded-context.md
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

Docs-only. No Vitest or Playwright required.
