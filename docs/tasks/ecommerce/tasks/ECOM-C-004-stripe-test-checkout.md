---
id: ECOM-C-004
task_id: ECOM-C-004
title: Stripe test checkout in Medusa
status: Not Started
priority: P0
phase: core
milestone: M1 - Core commerce foundation
effort: M
estimated_effort: 1-2 days
owner: mdeai-commerce
area: backend
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-632
linear_url: https://linear.app/sanjiovani/issue/SAN-632
depends_on: [ECOM-C-002, ECOM-C-003]
blocks: [ECOM-C-006, ECOM-C-013, ECOM-C-016]
skill: building-with-medusa
skills: [building-with-medusa, medusa-commerce]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.medusajs.com
  - https://docs.stripe.com/payments/checkout
official_refs:
  - https://docs.medusajs.com
  - https://docs.stripe.com/payments/checkout
description: "Prove Stripe test checkout through Medusa before any marketplace payout complexity begins."
---

# ECOM-C-004 - Stripe test checkout in Medusa

## 1. Purpose

**Easy description:** Prove Stripe test checkout through Medusa before any marketplace payout complexity begins.

**Goal:** Configure Stripe test checkout through Medusa's commerce lifecycle.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Configure Medusa Stripe payment provider.
- Add commerce-specific webhook config and local proof path.
- Keep existing event ticket and sponsor Stripe code untouched.
- Add a smoke script that verifies a test payment creates a Medusa order.

## 4. Workflows

1. Verify official SDK/API method signatures before coding.
2. Implement through the existing mdeapp surface and Medusa service boundary.
3. Hydrate mutable commerce data from Medusa immediately before display/action.
4. Run unit, smoke, and E2E proof commands from this task.

### Files likely touched

- Determined during implementation from this task scope.

## 5. User Journeys

**Real-world example:** Andres asks for a Medellin designer shirt and the platform has a real Medusa product, image, price, and stock record to show him.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- Mastra owns the tool/workflow orchestration and must call the Medusa wrapper, not duplicate commerce logic.
- Medusa owns mutable commerce lifecycle data; Stripe owns payment/Connect state; Cloudinary owns media assets.

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com
- https://docs.stripe.com/payments/checkout

### Skill guardrails

- `building-with-medusa`: mutations must use Medusa workflows/lifecycle, not ad hoc routes.
- Stripe amounts and Medusa prices differ; Medusa prices are display amounts.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M1 - Core commerce foundation |
| Priority | P0 |
| Estimate | M / 1-2 days |
| Depends on | ECOM-C-002, ECOM-C-003 |
| Blocks | ECOM-C-006, ECOM-C-013, ECOM-C-016 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Stripe test checkout can complete.
- [ ] Successful payment creates a Medusa order.
- [ ] Webhook signature uses `COMMERCE_STRIPE_WEBHOOK_SECRET`.
- [ ] Existing ticket/sponsor webhook tests are not modified.

### Proof Commands

```bash
cd commerce/medusa && npm run test:stripe-smoke
stripe listen --forward-to localhost:9000/hooks/stripe
rg -n "STRIPE_WEBHOOK_SECRET|STRIPE_SPONSOR_WEBHOOK_SECRET" commerce/medusa mdeapp/src mdeapp/scripts
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Medusa integration/smoke test for paid checkout.
- Idempotent webhook replay test if webhook handler is customized.
