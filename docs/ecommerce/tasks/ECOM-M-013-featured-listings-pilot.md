---
id: ECOM-M-013
task_id: ECOM-M-013
title: Featured listings pilot
status: Not Started
priority: P2
phase: mvp
milestone: M5 - Lifestyle commerce integrations
effort: S
estimated_effort: 0.5-1 day
owner: mdeai-commerce
area: commerce
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-659
linear_url: https://linear.app/sanjiovani/issue/SAN-659
depends_on: [ECOM-M-012]
blocks: []
skill: medusa
skills: [storefront-best-practices, building-admin-dashboard-customizations]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://supabase.com/docs
  - https://docs.medusajs.com
official_refs:
  - https://supabase.com/docs
  - https://docs.medusajs.com
description: "Ship featured listings pilot as one small commerce PR after its dependencies are green."
---

# ECOM-M-013 - Featured listings pilot

## 1. Purpose

**Easy description:** Ship featured listings pilot as one small commerce PR after its dependencies are green.

**Goal:** Pilot manual featured placements after Core and basic analytics are live.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add featured placement metadata table or admin-managed config.
- Store product/vendor id, placement, label, start/end, and status.
- Clearly label featured results.
- No ad auction, no autonomous bidding.

## 4. Workflows

1. Make the smallest repo change that satisfies the task.
2. Preserve existing mdeai routes and product flows.
3. Run proof commands.
4. Rollback using the documented plan if any gate fails.

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
| Depends on | ECOM-M-012 |
| Blocks | None |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Admin can mark a product/vendor as featured.
- [ ] Featured placement can boost ranking with explicit label.
- [ ] User can distinguish featured from organic results.
- [ ] Analytics tracks featured impressions/clicks.

### Proof Commands

```bash
cd mdeapp && npm test -- src/lib/commerce/featured-listings.test.ts
cd mdeapp && npm run test:e2e -- e2e/commerce-featured-listings.spec.ts --project=chromium --workers=1
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Ranking/label unit test.
- Playwright label proof.
