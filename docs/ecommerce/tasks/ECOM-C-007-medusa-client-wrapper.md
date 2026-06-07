---
id: ECOM-C-007
task_id: ECOM-C-007
title: Medusa client wrapper in mdeapp
status: Not Started
priority: P0
phase: 2
milestone: M2 - mdeapp commerce bridge
effort: M
estimated_effort: 1-2 days
owner: mdeai-commerce
area: backend
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-635
linear_url: https://linear.app/sanjiovani/issue/SAN-635
depends_on: [ECOM-C-018, ECOM-C-006]
blocks: [ECOM-C-010, ECOM-C-011, ECOM-C-012]
skill: medusa
skills: [storefront-best-practices, building-with-medusa]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - docs/ecommerce/audit/1-tasks-audit.md
  - https://docs.medusajs.com/resources/js-sdk
  - https://github.com/mercurjs/b2c-marketplace-storefront
  - https://github.com/mercurjs/mercur
official_refs:
  - https://docs.medusajs.com/resources/js-sdk
  - https://github.com/mercurjs/b2c-marketplace-storefront
  - https://docs.mercurjs.com/getting-started/introduction
description: "Install and wrap the Medusa JS SDK in mdeapp so all product/cart calls use the official client."
---

# ECOM-C-007 - Medusa client wrapper in mdeapp

## 1. Purpose

**Easy description:** Install and wrap the Medusa JS SDK in mdeapp so all product/cart calls use the official client.

**Goal:** Add a typed server-side Medusa client wrapper for commerce tools and UI hydration.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Add `mdeapp/src/lib/commerce/medusa-client.ts` (Mercur Store API via `@medusajs/js-sdk`).
- Add commerce DTO/types.
- Verify exact JS SDK methods against official docs before implementation.
- Include timeout and error normalization.
- Never expose admin secrets to the browser.
- Install or add workspace dependency for `@medusajs/js-sdk` and `@medusajs/types` before implementing wrapper calls.
- Add a smoke script that fails if the SDK is missing or if raw `fetch()` is used for Medusa API calls.

## 4. Workflows

1. Make the smallest repo change that satisfies the task.
2. Preserve existing mdeai routes and product flows.
3. Run proof commands.
4. Rollback using the documented plan if any gate fails.

### Files likely touched

- mdeapp/src/lib/commerce/mercur-client.ts
- @medusajs/js-sdk
- @medusajs/types
- fetch()

## 5. User Journeys

**Real-world example:** Camila asks the AI for a cafe-friendly outfit, sees live ProductCards, adds one size to cart, and never sees stale Supabase price data.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- Mercur owns mutable commerce lifecycle data; Stripe owns payment state.

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com/resources/js-sdk
- https://github.com/mercurjs/b2c-marketplace-storefront

### Skill guardrails

- `storefront-best-practices`: verify SDK methods before coding.
- Always set and use publishable key where Store API requires it.
- Display Medusa prices as-is.

## 8. Summary

| Field | Value |
|---|---|
| Phase | 2 |
| Milestone | M2 - mdeapp commerce bridge |
| Priority | P0 |
| Estimate | M / 1-2 days |
| Depends on | ECOM-C-018, ECOM-C-006 |
| Blocks | ECOM-C-010, ECOM-C-011, ECOM-C-012 |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [ ] Wrapper lists products.
- [ ] Wrapper fetches product detail.
- [ ] Wrapper creates cart and adds line item.
- [ ] Wrapper can create checkout link/session when downstream checkout task is ready.
- [ ] TypeScript does not use guessed SDK methods.

### Proof Commands

```bash
cd mdeapp && npm test -- src/lib/commerce
node --env-file=.env.local scripts/smoke-commerce-client.mjs
```

### Rollback Plan

Revert the PR and remove any feature flag/config introduced by this task.

## 10. Tests

- Vitest mocked Medusa API.
- Live smoke when env exists.
