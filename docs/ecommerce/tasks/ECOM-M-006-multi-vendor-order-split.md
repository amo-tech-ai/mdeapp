---
id: ECOM-M-006
task_id: ECOM-M-006
title: Multi-vendor cart and order split
status: Not Started
priority: P1
phase: mvp
milestone: M4 - Marketplace vendors and Connect
effort: M
estimated_effort: 1-3 days
owner: mdeai-commerce
area: backend
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-652
linear_url: https://linear.app/sanjiovani/issue/SAN-652
depends_on: [ECOM-M-001, ECOM-M-005]
blocks: [ECOM-M-007]
skill: building-with-medusa
skills: [building-with-medusa]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - docs/ecommerce/audit/1-tasks-audit.md
  - https://docs.medusajs.com/resources/recipes/marketplace
  - https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors
official_refs:
  - https://docs.medusajs.com/resources/recipes/marketplace
  - https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors
description: "Ship multi-vendor cart and order split as one small commerce PR after its dependencies are green."
---

# ECOM-M-006 - Multi-vendor cart and order split

## 1. Purpose

**Easy description:** Ship multi-vendor cart and order split as one small commerce PR after its dependencies are green.

**Goal:** Allow a paid cart to create vendor-scoped order records.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Follow the official marketplace recipe order-split approach.
- Resolve vendor per line item using module links.
- Use workflows for split mutations and compensation.
- Preserve platform order traceability.

## 4. Workflows

1. Verify official SDK/API method signatures before coding.
2. Implement through the existing mdeapp surface and Medusa service boundary.
3. Hydrate mutable commerce data from Medusa immediately before display/action.
4. Run unit, smoke, and E2E proof commands from this task.

### Files likely touched

- Determined during implementation from this task scope.

## 5. User Journeys

**Real-world example:** A local designer applies, gets manually approved, manages products, and later sees Stripe Connect payout status after Core checkout is proven.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- Mastra owns the tool/workflow orchestration and must call the Medusa wrapper, not duplicate commerce logic.
- Medusa owns mutable commerce lifecycle data; Stripe owns payment/Connect state; Cloudinary owns media assets.

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com/resources/recipes/marketplace
- https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | mvp |
| Milestone | M4 - Marketplace vendors and Connect |
| Priority | P1 |
| Estimate | M / 1-3 days |
| Depends on | ECOM-M-001, ECOM-M-005 |
| Blocks | ECOM-M-007 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] One cart can contain products from two vendors.
- [ ] Paid checkout creates vendor-scoped order records or equivalent vendor fulfillment records.
- [ ] Platform fee/payout path is compatible with Stripe Connect.
- [ ] If split fails, workflow compensation leaves no partial visible vendor order.

### Proof Commands

```bash
cd commerce/mercur && npm run build
cd commerce/mercur && npm test -- multi-vendor-order-split
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Integration test with two vendors, two products, one cart, one paid test order.
- Workflow retry/idempotency test.
