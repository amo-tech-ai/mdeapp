---
id: ECOM-M-005
task_id: ECOM-M-005
title: Stripe Connect Express onboarding
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
linear_issue: SAN-651
linear_url: https://linear.app/sanjiovani/issue/SAN-651
depends_on: [ECOM-M-001, ECOM-M-003]
blocks: [ECOM-M-006, ECOM-M-007]
skill: building-with-medusa
skills: [building-with-medusa]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.stripe.com/connect
  - https://docs.stripe.com/connect/express-accounts
official_refs:
  - https://docs.stripe.com/connect
  - https://docs.stripe.com/connect/express-accounts
description: "Ship stripe connect express onboarding as one small commerce PR after its dependencies are green."
---

# ECOM-M-005 - Stripe Connect Express onboarding

## 1. Purpose

**Easy description:** Ship stripe connect express onboarding as one small commerce PR after its dependencies are green.

**Goal:** Add Stripe Connect Express onboarding after Core single-vendor checkout is proven.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Create connected account for approved vendor.
- Store Stripe account id against Medusa vendor.
- Do not store KYC data.
- Show onboarding status.

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

- Medusa owns mutable commerce lifecycle data; Stripe owns payment/Connect state; Cloudinary owns media assets.

## 7. Integrations

### Official docs/repos used

- https://docs.stripe.com/connect
- https://docs.stripe.com/connect/express-accounts

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | mvp |
| Milestone | M4 - Marketplace vendors and Connect |
| Priority | P1 |
| Estimate | M / 1-3 days |
| Depends on | ECOM-M-001, ECOM-M-003 |
| Blocks | ECOM-M-006, ECOM-M-007 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Vendor can start Express onboarding in test mode.
- [ ] Connected account id is linked to vendor.
- [ ] Onboarding status can be refreshed.
- [ ] Core checkout still works without Connect enabled.

### Proof Commands

```bash
cd commerce/medusa && npm run build
cd mdeapp && npm test -- src/lib/commerce/connect
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Stripe mocked API tests.
- Test-mode onboarding smoke if available.
