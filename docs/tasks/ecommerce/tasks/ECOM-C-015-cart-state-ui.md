---
id: ECOM-C-015
task_id: ECOM-C-015
title: Minimal cart state UI
status: Not Started
priority: P0
phase: core
milestone: M2 - AI product cards and cart
effort: M
estimated_effort: 1-2 days
owner: mdeai-commerce
area: frontend
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-643
linear_url: https://linear.app/sanjiovani/issue/SAN-643
depends_on: [ECOM-C-012, ECOM-C-014]
blocks: [ECOM-C-016]
skill: medusa
skills: [storefront-best-practices]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.copilotkit.ai
  - https://docs.medusajs.com
official_refs:
  - https://docs.copilotkit.ai
  - https://docs.medusajs.com
description: "Show a minimal cart state UI that reflects Medusa cart totals and line items."
---

# ECOM-C-015 - Minimal cart state UI

## 1. Purpose

**Easy description:** Show a minimal cart state UI that reflects Medusa cart totals and line items.

**Goal:** Show enough cart state to complete Core checkout without building a full storefront cart page.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add minimal cart summary component/hook.
- Show item count, selected variants, subtotal, and checkout CTA.
- Add accessible cart count update announcement.
- Keep checkout button tied to `checkout_link`.

## 4. Workflows

1. Verify official SDK/API method signatures before coding.
2. Implement through the existing mdeapp surface and Medusa service boundary.
3. Hydrate mutable commerce data from Medusa immediately before display/action.
4. Run unit, smoke, and E2E proof commands from this task.

### Files likely touched

- checkout_link

## 5. User Journeys

**Real-world example:** Camila asks the AI for a cafe-friendly outfit, sees live ProductCards, adds one size to cart, and never sees stale Supabase price data.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- Mastra owns the tool/workflow orchestration and must call the Medusa wrapper, not duplicate commerce logic.
- CopilotKit owns the visible shopping UI and renders only DTOs hydrated from Medusa.

## 7. Integrations

### Official docs/repos used

- https://docs.copilotkit.ai
- https://docs.medusajs.com

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M2 - AI product cards and cart |
| Priority | P0 |
| Estimate | M / 1-2 days |
| Depends on | ECOM-C-012, ECOM-C-014 |
| Blocks | ECOM-C-016 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Cart updates after add-to-cart.
- [ ] Variant details are visible for each item.
- [ ] Checkout button calls the checkout tool.
- [ ] Cart count updates include `aria-live="polite"`.
- [ ] Mobile sticky elements account for safe-area inset if used.

### Proof Commands

```bash
cd mdeapp && npm test -- src/components/commerce
npm run test:e2e -- e2e/commerce-cart-state.spec.ts --project=chromium --workers=1
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Vitest cart summary state.
- Playwright add-to-cart and checkout CTA smoke.
