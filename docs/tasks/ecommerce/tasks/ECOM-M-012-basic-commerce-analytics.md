---
id: ECOM-M-012
task_id: ECOM-M-012
title: Basic commerce analytics
status: Not Started
priority: P2
phase: mvp
milestone: M5 - Lifestyle commerce integrations
effort: S
estimated_effort: 0.5-1 day
owner: mdeai-commerce
area: database
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-658
linear_url: https://linear.app/sanjiovani/issue/SAN-658
depends_on: [ECOM-C-018]
blocks: [ECOM-M-013]
skill: mde-task-lifecycle
skills: [mde-task-lifecycle]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://supabase.com/docs
official_refs:
  - https://supabase.com/docs
description: "Ship basic commerce analytics as one small commerce PR after its dependencies are green."
---

# ECOM-M-012 - Basic commerce analytics

## 1. Purpose

**Easy description:** Ship basic commerce analytics as one small commerce PR after its dependencies are green.

**Goal:** Track commerce funnel events without duplicating commerce truth.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Track search, product card click, add-to-cart, checkout-start, checkout-complete.
- Store product id and event metadata only.
- Respect existing analytics/privacy patterns.

## 4. Workflows

1. Create or modify only Supabase extension/link/vector tables.
2. Add RLS and negative checks.
3. Verify no product/order/cart/price/inventory truth is copied.
4. Run migration and stale-data checks.

### Files likely touched

- Determined during implementation from this task scope.

## 5. User Journeys

**Real-world example:** Natalia discovers a product inside an event, trip, or venue context, but checkout still uses the same proven web Stripe flow.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- No autonomous agent behavior is added in this task; keep changes deterministic and manually verifiable.

## 7. Integrations

### Official docs/repos used

- https://supabase.com/docs

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | mvp |
| Milestone | M5 - Lifestyle commerce integrations |
| Priority | P2 |
| Estimate | S / 0.5-1 day |
| Depends on | ECOM-C-018 |
| Blocks | ECOM-M-013 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Funnel events are recorded.
- [ ] Analytics table has RLS.
- [ ] No order/cart/product truth is stored.
- [ ] Events can be used for conversion reporting.

### Proof Commands

```bash
cd mdeapp && npm test -- src/lib/commerce/analytics.test.ts
rg -n "commerce_analytics" mdeapp/supabase/migrations mdeapp/src
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Unit tests for event writer.
- RLS policy checks.
