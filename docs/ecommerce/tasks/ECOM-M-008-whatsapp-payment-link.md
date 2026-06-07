---
id: ECOM-M-008
task_id: ECOM-M-008
title: WhatsApp payment link
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
linear_issue: SAN-654
linear_url: https://linear.app/sanjiovani/issue/SAN-654
depends_on: [ECOM-C-020]
blocks: []
skill: medusa
skills: [storefront-best-practices]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - docs/ecommerce/audit/1-tasks-audit.md
  - https://mastra.ai/docs
  - https://docs.stripe.com/payments/checkout
official_refs:
  - https://mastra.ai/docs
  - https://docs.stripe.com/payments/checkout
description: "Ship whatsapp payment link as one small commerce PR after its dependencies are green."
---

# ECOM-M-008 - WhatsApp payment link

## 1. Purpose

**Easy description:** Ship whatsapp payment link as one small commerce PR after its dependencies are green.

**Goal:** Send an existing web checkout link through WhatsApp/Chatwoot after checkout is stable.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Reuse `checkout_link`.
- Add human/user-requested WhatsApp send path.
- No autonomous campaigns.
- No new checkout surface.

## 4. Workflows

1. Make the smallest repo change that satisfies the task.
2. Preserve existing mdeai routes and product flows.
3. Run proof commands.
4. Rollback using the documented plan if any gate fails.

### Files likely touched

- checkout_link

## 5. User Journeys

**Real-world example:** Natalia discovers a product inside an event, trip, or venue context, but checkout still uses the same proven web Stripe flow.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- No autonomous agent behavior is added in this task; keep changes deterministic and manually verifiable.

## 7. Integrations

### Official docs/repos used

- https://mastra.ai/docs
- https://docs.stripe.com/payments/checkout

### Skill guardrails

- Follow the Medusa skill guardrails and keep the task to one PR.

## 8. Summary

| Field | Value |
|---|---|
| Phase | mvp |
| Milestone | M5 - Lifestyle commerce integrations |
| Priority | P2 |
| Estimate | S / 0.5-1 day |
| Depends on | ECOM-C-016 |
| Blocks | None |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] User can receive payment link in WhatsApp/Chatwoot.
- [ ] Payment still happens through web/Stripe checkout.
- [ ] Message is sent only after user request or human action.
- [ ] Failure falls back to showing link in web chat.

### Proof Commands

```bash
cd mdeapp && npm test -- src/mastra/tools/__tests__/commerce-whatsapp-payment-link.test.ts
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Mocked Chatwoot/WhatsApp API test.
- Manual sandbox smoke if available.
