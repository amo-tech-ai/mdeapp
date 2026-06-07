---
id: ECOM-C-019
task_id: ECOM-C-019
title: AI end-to-end checkout proof
status: Not Started
priority: P0
phase: 3
milestone: M3 - AI checkout proof
effort: M
estimated_effort: 1-2 days
owner: mdeai-commerce
area: backend
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-720
linear_url: https://linear.app/sanjiovani/issue/SAN-720
depends_on: [ECOM-C-013, ECOM-C-015, ECOM-C-016]
blocks: [ECOM-C-017, ECOM-C-020, ECOM-M-001]
skill: medusa
skills: [storefront-best-practices, mde-task-lifecycle]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - docs/ecommerce/audit/1-tasks-audit.md
  - https://docs.stripe.com/payments/checkout
  - https://docs.medusajs.com
  - https://playwright.dev
official_refs:
  - https://docs.stripe.com/payments/checkout
  - https://docs.medusajs.com
  - https://playwright.dev
description: "Run the full proof: user asks AI, sees product card, adds to cart, pays Stripe, and creates a Medusa order."
---

# ECOM-C-019 - AI end-to-end checkout proof

> **Not Phase 1.** Standalone paid order proof is [ECOM-C-016](./ECOM-C-016-paid-order-proof.md). This task proves the full AI path after Phase 2–3 bridge work.

## 1. Purpose

**Easy description:** Run the full proof: user asks AI, sees product card, adds to cart, pays Stripe, and creates a Medusa order.

**Goal:** Prove the Core milestone with one paid test order.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add Playwright checkout spec.
- Add `scripts/smoke-commerce-paid-proof.mjs`.
- Record evidence file with test order id.
- Keep proof independent from event ticket smoke scripts.

## 4. Workflows

1. Verify official SDK/API method signatures before coding.
2. Implement through the existing mdeapp surface and Medusa service boundary.
3. Hydrate mutable commerce data from Medusa immediately before display/action.
4. Run unit, smoke, and E2E proof commands from this task.

### Files likely touched

- scripts/smoke-commerce-paid-proof.mjs

## 5. User Journeys

**Real-world example:** Miguel completes a Stripe test payment from an AI ProductCard and support can find the matching Medusa order and refund path.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- Mastra owns the tool/workflow orchestration and must call the Medusa wrapper, not duplicate commerce logic.

## 7. Integrations

### Official docs/repos used

- https://docs.stripe.com/payments/checkout
- https://docs.medusajs.com
- https://playwright.dev

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M3 - Checkout proof and readiness |
| Priority | P0 |
| Estimate | M / 1-2 days |
| Depends on | ECOM-C-013, ECOM-C-015 |
| Blocks | ECOM-C-017, ECOM-C-020, ECOM-M-001 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] User can ask/search for a product.
- [ ] ProductCard renders.
- [ ] Add-to-cart works.
- [ ] Stripe test payment completes.
- [ ] Medusa order exists.
- [ ] Evidence doc records order id, date, env, and commands.

### Proof Commands

```bash
cd mdeapp && npm run test:e2e -- e2e/commerce-checkout.spec.ts --project=chromium --workers=1
cd mdeapp && node --env-file=.env.local scripts/smoke-commerce-paid-proof.mjs
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Required Playwright proof unless Stripe test env is missing; document exact blocker if skipped.
