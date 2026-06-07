---
id: ECOM-C-014
task_id: ECOM-C-014
title: CopilotKit ProductCard render
status: Not Started
priority: P0
phase: 3
milestone: M3 - AI commerce
effort: M
estimated_effort: 1-2 days
owner: mdeai-commerce
area: frontend
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-642
linear_url: https://linear.app/sanjiovani/issue/SAN-642
depends_on: [ECOM-C-010, ECOM-C-011, ECOM-C-006]
blocks: [ECOM-C-015, ECOM-C-019]
skill: medusa
skills: [storefront-best-practices]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - docs/ecommerce/audit/1-tasks-audit.md
  - https://docs.copilotkit.ai
  - https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra
  - https://docs.medusajs.com
official_refs:
  - https://docs.copilotkit.ai
  - https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra
  - https://docs.medusajs.com
description: "Render AI product results as compact CopilotKit product cards inside the existing mdeai UI."
---

# ECOM-C-014 - CopilotKit ProductCard render

## 1. Purpose

**Easy description:** Render AI product results as compact CopilotKit product cards inside the existing mdeai UI.

**Goal:** Render AI product results as ProductCards in the existing mdeai/CopilotKit UI.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add `mdeapp/src/components/commerce/ProductCard.tsx`.
- Register product search render path in existing CopilotKit/Mastra render system.
- Card supports image, title, price, availability, variant strategy, view detail, and add to cart.
- Keep UI compact and mobile safe.

## 4. Workflows

1. Verify official SDK/API method signatures before coding.
2. Implement through the existing mdeapp surface and Medusa service boundary.
3. Hydrate mutable commerce data from Medusa immediately before display/action.
4. Run unit, smoke, and E2E proof commands from this task.

### Files likely touched

- mdeapp/src/components/commerce/ProductCard.tsx

## 5. User Journeys

**Real-world example:** Camila asks the AI for a cafe-friendly outfit, sees live ProductCards, adds one size to cart, and never sees stale Supabase price data.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- CopilotKit owns the visible shopping UI and renders only DTOs hydrated from Medusa.

## 7. Integrations

### Official docs/repos used

- https://docs.copilotkit.ai
- https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra
- https://docs.medusajs.com

### Skill guardrails

- Product card uses semantic HTML and accessible buttons.
- Product image has alt text and lazy loading where appropriate.
- Fashion products with sizes must not silently add the wrong variant; choose a deliberate variant strategy.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M3 - AI commerce |
| Priority | P0 |
| Estimate | M / 1-2 days |
| Depends on | ECOM-C-010, ECOM-C-011, ECOM-C-006 |
| Blocks | ECOM-C-015, ECOM-C-019 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] ProductCard renders from `product_search` DTO.
- [ ] Price/stock are Medusa-hydrated.
- [ ] Add-to-cart action is visible and has loading/error states.
- [ ] Mobile touch targets are at least 44px.
- [ ] No new storefront route is created.

### Proof Commands

```bash
cd mdeapp && npm test -- src/components/commerce
npm run test:e2e -- e2e/commerce-product-card.spec.ts --project=chromium --workers=1
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Vitest component test.
- Playwright render test.
