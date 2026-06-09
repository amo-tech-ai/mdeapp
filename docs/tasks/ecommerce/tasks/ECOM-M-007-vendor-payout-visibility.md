---
id: ECOM-M-007
task_id: ECOM-M-007
title: Vendor payout visibility
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
linear_issue: SAN-653
linear_url: https://linear.app/sanjiovani/issue/SAN-653
depends_on: [ECOM-M-005, ECOM-M-006]
blocks: []
skill: building-admin-dashboard-customizations
skills: [building-admin-dashboard-customizations]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.stripe.com/connect
  - https://docs.medusajs.com
official_refs:
  - https://docs.stripe.com/connect
  - https://docs.medusajs.com
description: "Ship vendor payout visibility as one small commerce PR after its dependencies are green."
---

# ECOM-M-007 - Vendor payout visibility

## 1. Purpose

**Easy description:** Ship vendor payout visibility as one small commerce PR after its dependencies are green.

**Goal:** Show vendors payout and transfer status without making mdeai the payout source of truth.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Show order amount, platform fee, transfer/payout status.
- Read payment/transfer state from Stripe/Medusa, not a custom ledger.
- Use Medusa admin UI patterns and SDK.

## 4. Workflows

1. Start only after ECOM-C-018 is green.
2. Follow official Medusa marketplace recipe patterns.
3. Keep approval/payout steps manual until tests prove isolation.
4. Run vendor isolation and rollback checks.

### Files likely touched

- Determined during implementation from this task scope.

## 5. User Journeys

**Real-world example:** A local designer applies, gets manually approved, manages products, and later sees Stripe Connect payout status after Core checkout is proven.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- Medusa owns mutable commerce lifecycle data; Stripe owns payment/Connect state; Cloudinary owns media assets.

## 7. Integrations

### Official docs/repos used

- https://docs.stripe.com/connect
- https://docs.medusajs.com

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | mvp |
| Milestone | M4 - Marketplace vendors and Connect |
| Priority | P1 |
| Estimate | M / 1-3 days |
| Depends on | ECOM-M-005, ECOM-M-006 |
| Blocks | None |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Vendor sees payout status for own orders only.
- [ ] Amount formatting is correct.
- [ ] Stripe/Medusa remains source of payment truth.
- [ ] Loading and error states exist.

### Proof Commands

```bash
cd commerce/medusa && npm test -- vendor-payout
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Status mapping unit tests.
- Vendor isolation tests.
