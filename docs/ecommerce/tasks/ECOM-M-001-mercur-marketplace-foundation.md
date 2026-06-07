---
id: ECOM-M-001
task_id: ECOM-M-001
title: Mercur marketplace foundation verification
status: Not Started
priority: P1
phase: 4
milestone: M4 - Marketplace vendors and Connect
effort: S
estimated_effort: 0.5-1 day
owner: mdeai-commerce
area: backend
linear_project: Commerce Platform
linear_issue: SAN-647
linear_url: https://linear.app/sanjiovani/issue/SAN-647
depends_on: [ECOM-C-020]
blocks: [ECOM-M-003, ECOM-M-004, ECOM-M-005, ECOM-M-006]
skill: mercur-cli
skills: [mercur-cli, building-with-medusa]
github_repos:
  - https://github.com/mercurjs/mercur
  - https://github.com/medusajs/examples
official_refs:
  - https://docs.mercurjs.com/core-concepts/seller
  - https://docs.mercurjs.com/how-to-guides/stripe-connect-integration
  - https://docs.mercurjs.com/core-concepts/payout
description: "Verify @mercurjs/core seller/commission/payout modules in commerce/mercur — do NOT add custom Medusa marketplace recipe."
---

# ECOM-M-001 — Mercur marketplace foundation verification

> **Replaces** archived `tasks-draft/archive/ECOM-M-001-marketplace-module.md` (Medusa marketplace recipe). Mercur 2.0 already ships marketplace modules.

## Goal

Confirm seller, commission, split-order-payment, and payout modules are active in `commerce/mercur` before vendor onboarding or Stripe Connect work.

## Scope

**In scope**

- Audit `commerce/mercur/packages/api/medusa-config.ts` for `@mercurjs/core` plugins
- Verify admin → Sellers, Commissions, Payouts surfaces load
- Document module list in `commerce/mercur/BOOT.md`
- Reference patterns from [mercurjs/mercur](https://github.com/mercurjs/mercur) only

**Out of scope**

- Custom marketplace module from [medusajs/examples/marketplace](https://github.com/medusajs/examples/tree/main/marketplace)
- Stripe Connect configuration (ECOM-M-005)
- Vendor self-registration UX (ECOM-M-002)

## Acceptance Criteria

- [ ] No custom marketplace recipe code added to repo
- [ ] Mercur seller module responds in admin API
- [ ] `commerce/mercur` monorepo `apps/vendor` documented as vendor UI path
- [ ] ECOM-C-020 production readiness green

## Proof Commands

```bash
curl -s -o /dev/null -w 'health=%{http_code}\n' http://localhost:9000/health
# Admin UI: Sellers module visible
rg '@mercurjs/' commerce/mercur/packages/api/medusa-config.ts
```

## Rollback

N/A — documentation/verification only.
