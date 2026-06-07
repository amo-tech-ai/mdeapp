---
id: ECOM-C-011
task_id: ECOM-C-011
title: Mastra product_detail tool
status: Not Started
priority: P0
phase: 3
milestone: M3 - AI commerce
effort: M
estimated_effort: 1-2 days
owner: mdeai-commerce
area: backend
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-639
linear_url: https://linear.app/sanjiovani/issue/SAN-639
depends_on: [ECOM-C-008]
blocks: [ECOM-C-014]
skill: medusa
skills: [storefront-best-practices]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - docs/ecommerce/audit/1-tasks-audit.md
  - https://mastra.ai/docs
  - https://docs.medusajs.com
official_refs:
  - https://mastra.ai/docs
  - https://docs.medusajs.com
description: "Let Mastra fetch one live product detail safely from Medusa."
---

# ECOM-C-011 - Mastra product_detail tool

## 1. Purpose

**Easy description:** Let Mastra fetch one live product detail safely from Medusa.

**Goal:** Fetch one live Medusa product for detail cards and cart actions.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add `mdeapp/src/mastra/tools/commerce/product-detail.ts`.
- Validate product id.
- Fetch live Medusa detail.
- Normalize detail DTO.

## 4. Workflows

1. Verify official SDK/API method signatures before coding.
2. Implement through the existing mdeapp surface and Medusa service boundary.
3. Hydrate mutable commerce data from Medusa immediately before display/action.
4. Run unit, smoke, and E2E proof commands from this task.

### Files likely touched

- mdeapp/src/mastra/tools/commerce/product-detail.ts

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

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M3 - AI commerce |
| Priority | P0 |
| Estimate | M / 1-2 days |
| Depends on | ECOM-C-007 |
| Blocks | ECOM-C-014 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Product detail includes title, image, description, variant choices, price, and availability.
- [ ] Price is displayed as Medusa display amount.
- [ ] Invalid or missing product id fails safely.

### Proof Commands

```bash
cd mdeapp && npm test -- src/mastra/tools/__tests__/commerce-product-detail.test.ts
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Vitest mocked Medusa detail.
