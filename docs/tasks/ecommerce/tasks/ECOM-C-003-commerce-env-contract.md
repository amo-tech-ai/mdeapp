---
id: ECOM-C-003
task_id: ECOM-C-003
title: Commerce environment contract
status: Not Started
priority: P0
phase: core
milestone: M1 - Core commerce foundation
effort: S
estimated_effort: 0.5-1 day
owner: mdeai-commerce
area: operations
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-631
linear_url: https://linear.app/sanjiovani/issue/SAN-631
depends_on: [ECOM-C-002]
blocks: [ECOM-C-004, ECOM-C-005, ECOM-C-007]
skill: mde-task-lifecycle
skills: [mde-task-lifecycle, building-with-medusa]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.medusajs.com
  - https://docs.stripe.com
  - https://cloudinary.com/documentation
  - https://supabase.com/docs
official_refs:
  - https://docs.medusajs.com
  - https://docs.stripe.com
  - https://cloudinary.com/documentation
  - https://supabase.com/docs
description: "Create a clear commerce environment contract so Stripe, Medusa, Supabase, and Cloudinary secrets do not collide with existing payment flows."
---

# ECOM-C-003 - Commerce environment contract

## 1. Purpose

**Easy description:** Create a clear commerce environment contract so Stripe, Medusa, Supabase, and Cloudinary secrets do not collide with existing payment flows.

**Goal:** Define commerce-specific environment variables without colliding with existing ticket/sponsor Stripe flows.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add `tasks/ecommerce/docs/env-commerce.md`.
- Update `.env.example` files only, never real secrets.
- Add `mdeapp/scripts/verify-commerce-env.mjs`.
- Use commerce-specific names such as `MEDUSA_BACKEND_URL`, `MEDUSA_PUBLISHABLE_KEY`, `COMMERCE_STRIPE_SECRET_KEY`, `COMMERCE_STRIPE_WEBHOOK_SECRET`, `COMMERCE_STRIPE_PUBLISHABLE_KEY`, and Cloudinary vars.
- Verify commerce webhook secret is not reusing event ticket or sponsor names.

## 4. Workflows

1. Make the smallest repo change that satisfies the task.
2. Preserve existing mdeai routes and product flows.
3. Run proof commands.
4. Rollback using the documented plan if any gate fails.

### Files likely touched

- tasks/ecommerce/docs/env-commerce.md
- .env.example
- mdeapp/scripts/verify-commerce-env.mjs
- MEDUSA_BACKEND_URL
- MEDUSA_PUBLISHABLE_KEY
- COMMERCE_STRIPE_SECRET_KEY
- COMMERCE_STRIPE_WEBHOOK_SECRET
- COMMERCE_STRIPE_PUBLISHABLE_KEY

## 5. User Journeys

**Real-world example:** Andres asks for a Medellin designer shirt and the platform has a real Medusa product, image, price, and stock record to show him.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- No autonomous agent behavior is added in this task; keep changes deterministic and manually verifiable.

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com
- https://docs.stripe.com
- https://cloudinary.com/documentation
- https://supabase.com/docs

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M1 - Core commerce foundation |
| Priority | P0 |
| Estimate | S / 0.5-1 day |
| Depends on | ECOM-C-002 |
| Blocks | ECOM-C-004, ECOM-C-005, ECOM-C-007 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Required vars are documented.
- [ ] Verifier fails on missing required commerce vars.
- [ ] Verifier warns if commerce code references ticket/sponsor webhook env names.
- [ ] No secret values are committed.

### Proof Commands

```bash
cd mdeapp && node --env-file=.env.local scripts/verify-commerce-env.mjs
rg -n "COMMERCE_STRIPE|MEDUSA_|CLOUDINARY_" mdeapp/.env.example commerce/medusa/.env.template tasks/ecommerce/docs/env-commerce.md
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

```bash
cd mdeapp && npm test -- src/lib/commerce/__tests__/commerce-env.test.ts
```
