---
id: ECOM-C-013
task_id: ECOM-C-013
title: Mastra checkout_link tool
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
linear_issue: SAN-641
linear_url: https://linear.app/sanjiovani/issue/SAN-641
depends_on: [ECOM-C-004, ECOM-C-012]
blocks: [ECOM-C-016]
skill: medusa
skills: [storefront-best-practices, building-with-medusa]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.medusajs.com
  - https://docs.stripe.com/payments/checkout
  - https://mastra.ai/docs
official_refs:
  - https://docs.medusajs.com
  - https://docs.stripe.com/payments/checkout
  - https://mastra.ai/docs
description: "Let Mastra return a safe web checkout link for a Medusa cart."
---

# ECOM-C-013 - Mastra checkout_link tool

## 1. Purpose

**Easy description:** Let Mastra return a safe web checkout link for a Medusa cart.

**Goal:** Create a checkout link/session for a Medusa cart.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add `checkout_link` Mastra tool.
- Keep checkout creation server-side.
- Return URL and cart/order context only.
- Use commerce-specific Stripe/Medusa env.

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

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com
- https://docs.stripe.com/payments/checkout
- https://mastra.ai/docs

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M2 - AI product cards and cart |
| Priority | P0 |
| Estimate | M / 1-2 days |
| Depends on | ECOM-C-004, ECOM-C-012 |
| Blocks | ECOM-C-016 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Valid cart returns a test checkout URL.
- [ ] Invalid/empty cart fails safely.
- [ ] Existing event ticket checkout code is not modified.
- [ ] Tool output is safe for CopilotKit and WhatsApp later.

### Proof Commands

```bash
cd mdeapp && npm test -- src/mastra/tools/__tests__/commerce-checkout-link.test.ts
node --env-file=.env.local scripts/smoke-commerce-checkout-link.mjs
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Vitest for valid/invalid cart.
- Smoke script with Medusa and Stripe test env.
