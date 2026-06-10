---
id: ECOM-C-005
task_id: ECOM-C-005
title: Cloudinary media provider
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
linear_issue: SAN-633
linear_url: https://linear.app/sanjiovani/issue/SAN-633
depends_on: [ECOM-C-002, ECOM-C-003]
blocks: [ECOM-C-006, ECOM-C-014]
skill: building-with-medusa
skills: [building-with-medusa, medusa-commerce]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://cloudinary.com/documentation
  - https://docs.medusajs.com
official_refs:
  - https://cloudinary.com/documentation
  - https://docs.medusajs.com
description: "Make product images work through Cloudinary-backed Medusa product media."
---

# ECOM-C-005 - Cloudinary media provider

## 1. Purpose

**Easy description:** Make product images work through Cloudinary-backed Medusa product media.

**Goal:** Enable product media for Medusa products using Cloudinary.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Configure a Medusa-compatible Cloudinary file/media provider or a narrow adapter after verifying current Medusa support.
- Document required env vars.
- Ensure seeded product images render through Store API data.

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

- Medusa owns mutable commerce lifecycle data; Stripe owns payment/Connect state; Cloudinary owns media assets.

## 7. Integrations

### Official docs/repos used

- https://cloudinary.com/documentation
- https://docs.medusajs.com

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M1 - Core commerce foundation |
| Priority | P0 |
| Estimate | M / 1-2 days |
| Depends on | ECOM-C-002, ECOM-C-003 |
| Blocks | ECOM-C-006, ECOM-C-014 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Product image upload or referenced asset is available through Medusa.
- [ ] Product cards can render image URLs from Medusa-hydrated DTOs.
- [ ] No product binary images are committed to the repo.
- [ ] Cloudinary failures produce actionable logs.

### Proof Commands

```bash
cd commerce/medusa && npm run smoke:media
curl -fsS "$MEDUSA_BACKEND_URL/store/products" | jq
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Unit test for media URL normalization if an adapter is added.
- ProductCard image render is tested in ECOM-C-014.
