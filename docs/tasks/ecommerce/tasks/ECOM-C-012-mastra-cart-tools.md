---
id: ECOM-C-012
task_id: ECOM-C-012
title: Mastra cart tools
status: Not Started
priority: P0
phase: core
milestone: M2 - AI product cards and cart
effort: M
estimated_effort: 1-2 days
owner: mdeai-commerce
area: backend
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-640
linear_url: https://linear.app/sanjiovani/issue/SAN-640
depends_on: [ECOM-C-007]
blocks: [ECOM-C-013, ECOM-C-015]
skill: medusa
skills: [storefront-best-practices]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://mastra.ai/docs
  - https://docs.medusajs.com
official_refs:
  - https://mastra.ai/docs
  - https://docs.medusajs.com
description: "Let Mastra create Medusa carts and add variants to cart."
---

# ECOM-C-012 - Mastra cart tools

## 1. Purpose

**Easy description:** Let Mastra create Medusa carts and add variants to cart.

**Goal:** Add `create_cart` and `add_to_cart` tools backed by Medusa carts.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Create cart with region/currency context after SDK method verification.
- Add variant to cart.
- Return cart id, line items, variants, totals, and availability.
- Persist/reuse cart id through existing session state pattern.

## 4. Workflows

1. Verify official SDK/API method signatures before coding.
2. Implement through the existing mdeapp surface and Medusa service boundary.
3. Hydrate mutable commerce data from Medusa immediately before display/action.
4. Run unit, smoke, and E2E proof commands from this task.

### Files likely touched

- Determined during implementation from this task scope.

## 5. User Journeys

**Real-world example:** Camila asks the AI for a cafe-friendly outfit, sees live ProductCards, adds one size to cart, and never sees stale Supabase price data.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- Mastra owns the tool/workflow orchestration and must call the Medusa wrapper, not duplicate commerce logic.

## 7. Integrations

### Official docs/repos used

- https://mastra.ai/docs
- https://docs.medusajs.com

### Skill guardrails

- Cart UI must display variant details.
- Cart count updates need accessible live announcement in UI follow-up task.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M2 - AI product cards and cart |
| Priority | P0 |
| Estimate | M / 1-2 days |
| Depends on | ECOM-C-007 |
| Blocks | ECOM-C-013, ECOM-C-015 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Cart can be created.
- [ ] Variant can be added.
- [ ] Totals come from Medusa.
- [ ] Quantity and out-of-stock errors are handled.

### Proof Commands

```bash
cd mdeapp && npm test -- src/mastra/tools/__tests__/commerce-cart.test.ts
node --env-file=.env.local scripts/smoke-commerce-cart.mjs
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Vitest mocked Medusa cart API.
- Optional live smoke with Medusa running.
