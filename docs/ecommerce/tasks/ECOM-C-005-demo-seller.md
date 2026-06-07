---
id: ECOM-C-005
title: Demo Seller
phase: 1
priority: P0
complexity: S
status: Done
linear_issue: SAN-633
linear_url: https://linear.app/sanjiovani/issue/SAN-633
github_repos:
  - https://github.com/mercurjs/mercur
  - https://docs.mercurjs.com/core-concepts/seller
---

# ECOM-C-005

# Title

Demo Seller — Single Approved `mdeai` Vendor

# Goal

One seller account exists in Mercur, approved and active, ready to own catalog products for checkout proof.

# Business Value

Mercur is a marketplace engine — products require a seller. One demo seller proves single-vendor checkout without vendor onboarding UX or Stripe Connect.

# Scope

**In scope**

- Seller: name **`mdeai`** (canonical — not `mdeai-demo`), store status **ACTIVE**, approved by admin
- Operator-created seller via **admin dashboard** (preferred for Phase 1)
- Document seller id for seed scripts
- Optional: seed script hook in `commerce/mercur` for idempotent seller create

**Out of scope**

- Vendor panel self-registration flow
- Stripe Connect payout account / onboarding link
- Team members / invites
- Seller approval workflow automation
- Multiple sellers

# Files Likely Touched

| Path | Action |
|---|---|
| `commerce/mercur/packages/api/src/scripts/seed-demo-seller.ts` | Optional create |
| `commerce/mercur/BOOT.md` | Seller id + creation steps |
| `commerce/mercur/package.json` | `seed:seller` script (optional) |

# Official Documentation

| Topic | URL |
|---|---|
| Mercur seller concept | https://docs.mercurjs.com/core-concepts/seller |
| Seller registration flows | https://docs.mercurjs.com/core-concepts/seller#registration-flows |
| Create first seller (installation) | https://docs.mercurjs.com/getting-started/installation#create-your-first-seller |
| Seller entities (v1 reference) | https://docs.mercurjs.com/v1/core-concepts/seller#entities |
| Admin seller management | https://docs.mercurjs.com/v1/product/modules/b2c-core/seller/seller-concept |

# Dependencies

| Depends on | Blocks |
|---|---|
| ECOM-C-002 (Mercur running + admin access) | ECOM-C-006 |

# Acceptance Criteria

- [ ] Exactly one demo seller `mdeai` visible in Mercur admin
- [ ] Seller status = ACTIVE (not `pending_approval`)
- [ ] Seller id documented in `BOOT.md` or seed output
- [ ] No Stripe Connect payout account required for Phase 1
- [ ] Seller can be linked to products (verified in C-006)

# Proof Commands

```bash
# Admin API or UI verification
curl -s http://localhost:9000/admin/sellers \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.sellers[] | {id, name, store_status}'

# Or after seed script:
cd commerce/mercur/packages/api && bun run seed:seller
```

# Test Plan

1. Admin UI → Sellers → `mdeai` listed, active
2. Attempt product create linked to seller (manual or script) — succeeds
3. Confirm default seed does **not** include seller (per Mercur docs) — our seed adds one

# Risks

| Risk | Mitigation |
|---|---|
| Seller stuck in `pending_approval` | Operator-create with immediate active status |
| Vendor panel required for seller | Use admin operator-created path |
| Seller module API differs Mercur 2.0 vs v1 | Verify against running admin UI first |

# Rollback Plan

Delete seller via admin; re-run seed script. No impact on mdeapp.

# Estimated Complexity

**S**

# Priority

**P0**
