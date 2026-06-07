---
id: ECOM-M-004
task_id: ECOM-M-004
title: Vendor dashboard v1
status: Not Started
priority: P1
phase: mvp
milestone: M4 - Marketplace vendors and Connect
effort: M
estimated_effort: 1-3 days
owner: mdeai-commerce
area: frontend
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-650
linear_url: https://linear.app/sanjiovani/issue/SAN-650
depends_on: [ECOM-M-001, ECOM-M-003]
blocks: [ECOM-M-007]
skill: building-admin-dashboard-customizations
skills: [building-admin-dashboard-customizations, building-with-medusa]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - docs/ecommerce/audit/1-tasks-audit.md
  - https://docs.medusajs.com
  - https://docs.medusajs.com/resources/recipes/marketplace
official_refs:
  - https://docs.medusajs.com
  - https://docs.medusajs.com/resources/recipes/marketplace
description: "Ship vendor dashboard v1 as one small commerce PR after its dependencies are green."
---

# ECOM-M-004 - Vendor dashboard v1

## 1. Purpose

**Easy description:** Ship vendor dashboard v1 as one small commerce PR after its dependencies are green.

**Goal:** Add a minimal vendor dashboard for products, orders, and payout status.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Build read-heavy dashboard first.
- Use Medusa JS SDK for admin calls.
- Use Medusa UI components.
- Display data loads on mount.
- Separate display queries from modal/form queries.
- Vendor can only see own products/orders.

## 4. Workflows

1. Start only after ECOM-C-020 is green.
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

- https://docs.medusajs.com
- https://docs.medusajs.com/resources/recipes/marketplace

### Skill guardrails

- Use `building-admin-dashboard-customizations` data loading, forms, and display patterns.
- Use `FocusModal` for create flows and `Drawer` for edit flows if forms are added.
- Never divide Medusa prices by 100.

## 8. Summary

| Field | Value |
|---|---|
| Phase | mvp |
| Milestone | M4 - Marketplace vendors and Connect |
| Priority | P1 |
| Estimate | M / 1-3 days |
| Depends on | ECOM-M-001, ECOM-M-003 |
| Blocks | ECOM-M-007 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Vendor sees own products.
- [ ] Vendor sees own orders.
- [ ] Loading states are shown.
- [ ] Vendor isolation is tested.
- [ ] No raw `fetch()` is used for Medusa admin API calls.

### Proof Commands

```bash
cd commerce/mercur && npm run build
cd commerce/mercur && npm test -- vendor-dashboard
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Admin UI unit tests.
- Auth/isolation route tests.
- Playwright dashboard smoke if route is browser-visible.
