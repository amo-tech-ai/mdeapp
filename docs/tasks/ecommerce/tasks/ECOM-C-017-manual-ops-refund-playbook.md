---
id: ECOM-C-017
task_id: ECOM-C-017
title: Manual ops and refund playbook
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
linear_issue: SAN-645
linear_url: https://linear.app/sanjiovani/issue/SAN-645
depends_on: [ECOM-C-016]
blocks: [ECOM-C-018]
skill: mde-task-lifecycle
skills: [mde-task-lifecycle]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - /home/sk/mdeai/tasks/ecommerce/docs/02-audit-tasks.md
  - https://docs.stripe.com/refunds
  - https://docs.medusajs.com
official_refs:
  - https://docs.stripe.com/refunds
  - https://docs.medusajs.com
description: "Document manual support, refund, fulfillment, and failure handling before real users buy."
---

# ECOM-C-017 - Manual ops and refund playbook

## 1. Purpose

**Easy description:** Document manual support, refund, fulfillment, and failure handling before real users buy.

**Goal:** Document how to support, fulfill, refund, and reconcile Core orders manually.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add `tasks/ecommerce/docs/commerce-ops-playbook.md`.
- Add `tasks/ecommerce/docs/commerce-refund-playbook.md`.
- Include order lookup, refund, webhook failure, stock correction, support handoff, and test/live mode separation.

## 4. Workflows

1. Make the smallest repo change that satisfies the task.
2. Preserve existing mdeai routes and product flows.
3. Run proof commands.
4. Rollback using the documented plan if any gate fails.

### Files likely touched

- tasks/ecommerce/docs/commerce-ops-playbook.md
- tasks/ecommerce/docs/commerce-refund-playbook.md

## 5. User Journeys

**Real-world example:** Miguel completes a Stripe test payment from an AI ProductCard and support can find the matching Medusa order and refund path.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- No autonomous agent behavior is added in this task; keep changes deterministic and manually verifiable.

## 7. Integrations

### Official docs/repos used

- https://docs.stripe.com/refunds
- https://docs.medusajs.com

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M3 - Checkout proof and readiness |
| Priority | P0 |
| Estimate | S / 0.5-1 day |
| Depends on | ECOM-C-016 |
| Blocks | ECOM-C-018 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Operator can find a Medusa order.
- [ ] Operator can refund a test order.
- [ ] Operator can identify webhook failure symptoms.
- [ ] Support path is documented for CopilotKit and manual handoff.

### Proof Commands

```bash
rg -n "refund|webhook|order lookup|test mode|live mode|support" tasks/ecommerce/docs/commerce-*playbook.md
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

Docs-only; optional test refund evidence in the playbook.
