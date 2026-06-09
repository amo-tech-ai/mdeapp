---
id: ECOM-M-009
task_id: ECOM-M-009
title: Event product links
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
linear_issue: SAN-655
linear_url: https://linear.app/sanjiovani/issue/SAN-655
depends_on: [ECOM-C-018]
blocks: []
skill: medusa
skills: [storefront-best-practices]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://supabase.com/docs
  - https://docs.medusajs.com
official_refs:
  - https://supabase.com/docs
  - https://docs.medusajs.com
description: "Ship event product links as one small commerce PR after its dependencies are green."
---

# ECOM-M-009 - Event product links

## 1. Purpose

**Easy description:** Ship event product links as one small commerce PR after its dependencies are green.

**Goal:** Link existing events to live Medusa products.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add `commerce_event_products` link table if not already added.
- Store `event_id`, `product_id`, label, and sort order only.
- Render linked ProductCards on event surfaces by hydrating products from Medusa.
- Use migration path `mdeapp/supabase/migrations`, not the root-level migration directory.

## 4. Workflows

1. Create or modify only Supabase extension/link/vector tables.
2. Add RLS and negative checks.
3. Verify no product/order/cart/price/inventory truth is copied.
4. Run migration and stale-data checks.

### Files likely touched

- commerce_event_products
- event_id
- product_id
- mdeapp/supabase/migrations

## 5. User Journeys

**Real-world example:** Natalia discovers a product inside an event, trip, or venue context, but checkout still uses the same proven web Stripe flow.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- No autonomous agent behavior is added in this task; keep changes deterministic and manually verifiable.

## 7. Integrations

### Official docs/repos used

- https://supabase.com/docs
- https://docs.medusajs.com

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
| Blocks | None |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Event page can show linked products.
- [ ] Link table stores product id only, not price/stock.
- [ ] Product card displays current Medusa price/stock.

### Proof Commands

```bash
rg -n "commerce_event_products" mdeapp/supabase/migrations mdeapp/src
cd mdeapp && npm run test:e2e -- e2e/commerce-event-products.spec.ts --project=chromium --workers=1
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Link fetcher unit test.
- Playwright event product card proof.
