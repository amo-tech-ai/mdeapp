---
id: ECOM-C-002
task_id: ECOM-C-002
title: Medusa service setup
status: Not Started
priority: P0
phase: core
milestone: M1 - Core commerce foundation
effort: S
estimated_effort: 0.5-1 day
owner: mdeai-commerce
area: backend
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-630
linear_url: https://linear.app/sanjiovani/issue/SAN-630
depends_on: [ECOM-C-001]
blocks: [ECOM-C-003, ECOM-C-004, ECOM-C-005, ECOM-C-006]
skill: building-with-medusa
skills: [building-with-medusa, medusa-commerce, db-generate, db-migrate]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.medusajs.com
  - https://github.com/medusajs/medusa
official_refs:
  - https://docs.medusajs.com
  - https://github.com/medusajs/medusa
description: "Add Medusa as the bounded commerce service, not as a second storefront."
---

# ECOM-C-002 - Medusa service setup

## 1. Purpose

**Easy description:** Add Medusa as the bounded commerce service, not as a second storefront.

**Goal:** Add Medusa as a bounded backend service, not a storefront.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Create Medusa backend under the selected path, preferably `commerce/medusa/`.
- Pin the Medusa version.
- Use port `9000` locally unless blocked.
- Configure CORS for existing `mdeapp` on port `3001`.
- Add a service README with start, health, migration, and rollback commands.
- Do not add a Medusa Next.js storefront.

## 4. Workflows

1. Make the smallest repo change that satisfies the task.
2. Preserve existing mdeai routes and product flows.
3. Run proof commands.
4. Rollback using the documented plan if any gate fails.

### Files likely touched

- commerce/medusa/
- 9000
- mdeapp
- 3001

## 5. User Journeys

**Real-world example:** Andres asks for a Medellin designer shirt and the platform has a real Medusa product, image, price, and stock record to show him.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- Medusa owns mutable commerce lifecycle data; Stripe owns payment/Connect state; Cloudinary owns media assets.

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com
- https://github.com/medusajs/medusa

### Skill guardrails

- `building-with-medusa`: validate with build after setup.
- `db-generate` and `db-migrate`: record that custom module migrations require both commands in later tasks.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M1 - Core commerce foundation |
| Priority | P0 |
| Estimate | S / 0.5-1 day |
| Depends on | ECOM-C-001 |
| Blocks | ECOM-C-003, ECOM-C-004, ECOM-C-005, ECOM-C-006 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Medusa service starts locally.
- [ ] Health endpoint responds.
- [ ] Store API responds.
- [ ] Admin app is reachable.
- [ ] No new ecommerce storefront app is added.
- [ ] `mdeapp` remains untouched except optional workspace wiring.

### Proof Commands

```bash
cd commerce/medusa && npm run dev
curl -fsS http://localhost:9000/health
find /home/sk/mdeai -maxdepth 4 -iname '*storefront*'
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Medusa build command for the service.
- API smoke for `/health`.
