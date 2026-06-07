# ECOM-C-018 Core Commerce Exit Gate

**Date:** 2026-06-07  
**Canonical copy:** `tasks/testing/evidence/2026-06-07/commerce-core-exit-gate.md` (repo parent)

## Checklist — all PASS (2026-06-07)

| Criterion | Result |
|-----------|--------|
| Mercur health 200 | ✅ |
| Seller `mdeai` | ✅ `sel_01KTHZGQ85Z1RE6X1JSJMVWVX8` |
| Store API count ≥ 20 | ✅ 24 |
| Stripe checkout | ✅ `pp_stripe_stripe` + `client_secret` |
| Paid order | ✅ `order_01KTJ1KEEHZG5ZQFSC4HMC6W9H` captured |
| Webhook | ✅ `stripe listen` 200 |
| Env verifier | ✅ `node scripts/verify-commerce-env.mjs` |
| ADR | ✅ `docs/ecommerce/adr/001-standalone-mercur.md` |
| No Connect Phase 1 | ✅ |
| No mdeapp bridge | ✅ |

**Phase 1 gate: PASSED**
