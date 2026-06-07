---
id: ECOM-C-001
title: Commerce ADR
phase: 1
priority: P0
complexity: XS
status: Done
linear_issue: SAN-629
linear_url: https://linear.app/sanjiovani/issue/SAN-629
github_repos:
  - https://github.com/mercurjs/mercur
---

# ECOM-C-001

# Title

Commerce ADR — Standalone Mercur + mdeai Boundary

# Goal

Document and lock the commerce architecture decision so all Phase 1 work stays inside `commerce/mercur` with zero mdeapp coupling.

# Business Value

Prevents scope creep (AI bridge, Supabase product duplication, second storefront) before checkout proof. Gives reviewers a single source of truth for data ownership and integration boundaries.

# Scope

**In scope**

- ADR file: `docs/ecommerce/adr/001-standalone-mercur.md`
- Diagrams: system boundary, data ownership table
- Explicit non-goals for Phase 1
- Link from `docs/ecommerce/tasks/INDEX.md`

**Out of scope**

- Code changes to Mercur or mdeapp
- Infisical setup
- Linear issue creation (optional follow-up)

# Files Likely Touched

| Path | Action |
|---|---|
| `docs/ecommerce/adr/001-standalone-mercur.md` | Create |
| `docs/ecommerce/tasks/INDEX.md` | Link ADR |
| `docs/ecommerce/docs/04-repos.md` | Reference (read-only) |

# Official Documentation

| Topic | URL |
|---|---|
| Mercur introduction | https://docs.mercurjs.com/getting-started/introduction |
| Mercur installation | https://docs.mercurjs.com/getting-started/installation |
| Medusa architecture | https://docs.medusajs.com/learn/introduction/architecture |
| Medusa modules overview | https://docs.medusajs.com/learn/fundamentals/modules |
| mdeai repo audit | `docs/ecommerce/docs/04-repos.md` |

# Dependencies

| Depends on | Blocks |
|---|---|
| None | ECOM-C-002, ECOM-C-003, all Phase 1 tasks |

# Acceptance Criteria

- [ ] ADR states: `commerce/mercur` = marketplace backend; `mdeapp` = AI buyer (Phase 2+)
- [ ] ADR states: communication = HTTP / `@medusajs/js-sdk` only
- [ ] Data table: Mercur owns products, inventory, carts, orders, sellers
- [ ] Data table: Supabase owns embeddings, events, trips, venues + `medusa_product_id` link only
- [ ] Phase 1 non-goals listed: CopilotKit, embeddings, Stripe Connect, vendor onboarding, second storefront
- [ ] Stripe owns payment state; Supabase stores embeddings/links only — no vendor applications table with mutable commerce fields
- [ ] Evidence stub: `tasks/testing/evidence/YYYY-MM-DD/commerce-adr.md`
- [ ] ADR reviewed and linked from INDEX

# Proof Commands

```bash
test -f docs/ecommerce/adr/001-standalone-mercur.md
grep -q "commerce/mercur" docs/ecommerce/adr/001-standalone-mercur.md
grep -q "medusa_product_id" docs/ecommerce/adr/001-standalone-mercur.md
grep -q "non-goal" docs/ecommerce/adr/001-standalone-mercur.md
```

# Test Plan

1. Read ADR as new engineer — can answer "where do prices live?" in 30s
2. Confirm no contradiction with `docs/ecommerce/tasks/roadmap.md`
3. PR review: no code files changed

# Risks

| Risk | Mitigation |
|---|---|
| ADR ignored during implementation | Reference in every Phase 1 PR description |
| Ambiguous Supabase role | Explicit "no price/stock/cart/order in Supabase" row |

# Rollback Plan

Delete ADR file; no runtime impact.

# Estimated Complexity

**XS** — documentation only, ~1–2 hours

# Priority

**P0** — must merge before substantive commerce code PRs
