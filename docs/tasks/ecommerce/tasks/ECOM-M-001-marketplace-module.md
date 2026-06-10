---
id: ECOM-M-001
task_id: ECOM-M-001
title: Marketplace module from official recipe
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
linear_issue: SAN-647
linear_url: https://linear.app/sanjiovani/issue/SAN-647
depends_on: [ECOM-C-018]
blocks: [ECOM-M-003, ECOM-M-004, ECOM-M-005, ECOM-M-006]
skill: building-with-medusa
skills: [building-with-medusa, db-generate, db-migrate]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.medusajs.com/resources/recipes/marketplace
  - https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors
  - https://github.com/medusajs/examples/tree/main/marketplace
official_refs:
  - https://docs.medusajs.com/resources/recipes/marketplace
  - https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors
  - https://github.com/medusajs/examples/tree/main/marketplace
description: "Ship marketplace module from official recipe as one small commerce PR after its dependencies are green."
---

# ECOM-M-001 - Marketplace module from official recipe

## 1. Purpose

**Easy description:** Ship marketplace module from official recipe as one small commerce PR after its dependencies are green.

**Goal:** Add a custom Medusa marketplace module after Core checkout is proven.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add `Vendor` and `VendorAdmin` models.
- Add module links between vendor and products.
- Register module in Medusa config.
- Generate and run migrations.
- Keep module name camelCase.

## 4. Workflows

1. Start only after ECOM-C-018 is green.
2. Follow official Medusa marketplace recipe patterns.
3. Keep approval/payout steps manual until tests prove isolation.
4. Run vendor isolation and rollback checks.

### Files likely touched

- Vendor
- VendorAdmin

## 5. User Journeys

**Real-world example:** A local designer applies, gets manually approved, manages products, and later sees Stripe Connect payout status after Core checkout is proven.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- Medusa owns mutable commerce lifecycle data; Stripe owns payment/Connect state; Cloudinary owns media assets.

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com/resources/recipes/marketplace
- https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors
- https://github.com/medusajs/examples/tree/main/marketplace

### Skill guardrails

- `building-with-medusa`: custom module, links, workflows, and API route layering is mandatory.
- `db-generate`: run `npx medusa db:generate marketplace`.
- `db-migrate`: run `npx medusa db:migrate`.

## 8. Summary

| Field | Value |
|---|---|
| Phase | mvp |
| Milestone | M4 - Marketplace vendors and Connect |
| Priority | P1 |
| Estimate | M / 1-3 days |
| Depends on | ECOM-C-018 |
| Blocks | ECOM-M-003, ECOM-M-004, ECOM-M-005, ECOM-M-006 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Marketplace module compiles.
- [ ] Migration generated and applied.
- [ ] Vendor can link to products.
- [ ] No product truth is copied to Supabase.

### Proof Commands

```bash
cd commerce/medusa && npx medusa db:generate marketplace
cd commerce/medusa && npx medusa db:migrate
cd commerce/medusa && npm run build
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Module service unit/integration tests.
- Link query test.
