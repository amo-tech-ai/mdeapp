---
id: ECOM-C-006
task_id: ECOM-C-006
title: Demo catalog seed
status: Not Started
priority: P0
phase: core
milestone: M1 - Core commerce foundation
effort: M
estimated_effort: 1-2 days
owner: mdeai-commerce
area: commerce
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-634
linear_url: https://linear.app/sanjiovani/issue/SAN-634
depends_on: [ECOM-C-004, ECOM-C-005]
blocks: [ECOM-C-007, ECOM-C-009]
skill: building-with-medusa
skills: [building-with-medusa, medusa-commerce]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.medusajs.com
  - https://github.com/medusajs/examples
official_refs:
  - https://docs.medusajs.com
  - https://github.com/medusajs/examples
description: "Seed one internal seller and 20 realistic Medellin lifestyle products for live AI commerce proof."
---

# ECOM-C-006 - Demo catalog seed

## 1. Purpose

**Easy description:** Seed one internal seller and 20 realistic Medellin lifestyle products for live AI commerce proof.

**Goal:** Seed one internal/demo seller and 20 Medellin lifestyle products in Medusa.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add a seed script or fixture for 20 products.
- Include variants, prices, images, and inventory/availability.
- Do not add marketplace vendor module yet.
- Products should be realistic enough for AI product search proof.

## 4. Workflows

1. Make the smallest repo change that satisfies the task.
2. Preserve existing mdeai routes and product flows.
3. Run proof commands.
4. Rollback using the documented plan if any gate fails.

### Files likely touched

- Determined during implementation from this task scope.

## 5. User Journeys

**Real-world example:** Andres asks for a Medellin designer shirt and the platform has a real Medusa product, image, price, and stock record to show him.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- No autonomous agent behavior is added in this task; keep changes deterministic and manually verifiable.

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com
- https://github.com/medusajs/examples

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M1 - Core commerce foundation |
| Priority | P0 |
| Estimate | M / 1-2 days |
| Depends on | ECOM-C-004, ECOM-C-005 |
| Blocks | ECOM-C-007, ECOM-C-009 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] 20 active products exist in Medusa.
- [ ] Every product has title, description, image, price, variant, and stock/availability.
- [ ] Prices are stored/displayed as Medusa display amounts, not cents.
- [ ] Store API returns the seeded catalog.

### Proof Commands

```bash
cd commerce/medusa && npm run seed:demo-catalog
curl -fsS http://localhost:9000/store/products | jq '.products | length'
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Fixture shape test.
- Optional Store API smoke after seed.
