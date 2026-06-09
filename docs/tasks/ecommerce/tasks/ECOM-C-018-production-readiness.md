---
id: ECOM-C-018
task_id: ECOM-C-018
title: Commerce production readiness checklist
status: Not Started
priority: P0
phase: core
milestone: M3 - Checkout proof and readiness
effort: S
estimated_effort: 0.5-1 day
owner: mdeai-commerce
area: operations
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-646
linear_url: https://linear.app/sanjiovani/issue/SAN-646
depends_on: [ECOM-C-016, ECOM-C-017]
blocks: [ECOM-M-001, ECOM-M-002, ECOM-M-009, ECOM-M-010, ECOM-M-011, ECOM-M-012]
skill: mde-task-lifecycle
skills: [mde-task-lifecycle, building-with-medusa]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.medusajs.com
  - https://docs.stripe.com
  - https://supabase.com/docs/guides/database/postgres/row-level-security
  - https://cloudinary.com/documentation
official_refs:
  - https://docs.medusajs.com
  - https://docs.stripe.com
  - https://supabase.com/docs/guides/database/postgres/row-level-security
  - https://cloudinary.com/documentation
description: "Decide if Core can ship without breaking the existing mdeai MVP."
---

# ECOM-C-018 - Commerce production readiness checklist

## 1. Purpose

**Easy description:** Decide if Core can ship without breaking the existing mdeai MVP.

**Goal:** Gate Core before marketplace work begins.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add `tasks/ecommerce/docs/commerce-production-readiness.md`.
- Add `mdeapp/scripts/verify-commerce-readiness.mjs`.
- Include env, health, Store API, Stripe webhook, product hydration, Supabase RLS, logs, rollback, and feature flag.

## 4. Workflows

1. Make the smallest repo change that satisfies the task.
2. Preserve existing mdeai routes and product flows.
3. Run proof commands.
4. Rollback using the documented plan if any gate fails.

### Files likely touched

- tasks/ecommerce/docs/commerce-production-readiness.md
- mdeapp/scripts/verify-commerce-readiness.mjs

## 5. User Journeys

**Real-world example:** Miguel completes a Stripe test payment from an AI ProductCard and support can find the matching Medusa order and refund path.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- No autonomous agent behavior is added in this task; keep changes deterministic and manually verifiable.

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com
- https://docs.stripe.com
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://cloudinary.com/documentation

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M3 - Checkout proof and readiness |
| Priority | P0 |
| Estimate | S / 0.5-1 day |
| Depends on | ECOM-C-016, ECOM-C-017 |
| Blocks | ECOM-M-001, ECOM-M-002, ECOM-M-009, ECOM-M-010, ECOM-M-011, ECOM-M-012 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Readiness checklist exists.
- [ ] Verify script checks required env and smoke endpoints.
- [ ] Commerce UI can be disabled by feature flag.
- [ ] Existing mdeai MVP passes with commerce disabled.
- [ ] Gate says marketplace tasks are blocked until Core proof exists.

### Proof Commands

```bash
cd mdeapp && node --env-file=.env.local scripts/verify-commerce-readiness.mjs
cd mdeapp && npm run lint && npm run typecheck && npm test
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Unit tests for verifier logic if non-trivial.
- Existing app floor or scoped floor with commerce flag off.
