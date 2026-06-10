# ECOM-C-018 Core Commerce Exit Gate

**Date:** 2026-06-07  
**Linear:** [SAN-646](https://linear.app/sanjiovani/issue/SAN-646)  
**ADR:** [001-standalone-mercur.md](../../../mdeapp/docs/ecommerce/adr/001-standalone-mercur.md)

## Checklist

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | Mercur `/health` → 200 | **PASS** | `curl localhost:9000/health` → 200 |
| 2 | Seller `mdeai` open | **PASS** | `sel_01KTHZGQ85Z1RE6X1JSJMVWVX8` |
| 3 | Store API `count >= 20` | **PASS** | `count: 24` |
| 4 | Stripe checkout session | **PASS** | `pp_stripe_stripe` → `client_secret` |
| 5 | Paid order captured | **PASS** | `order_01KTJ1KEEHZG5ZQFSC4HMC6W9H` · `payment_status: captured` · total 15 EUR |
| 6 | Webhook verified | **PASS** | `stripe listen` → 200 on `/hooks/payment/stripe_stripe` |
| 7 | `verify-commerce-env.mjs` | **PASS** | exit 0 |
| 8 | ADR exists | **PASS** | `docs/ecommerce/adr/001-standalone-mercur.md` |
| 9 | No Stripe Connect in config | **PASS** | `payment-stripe` only in `medusa-config.ts` |
| 10 | No mdeapp commerce bridge | **PASS** | no `mdeapp/src` commerce SDK/proxy |

## Phase 1 verdict

**GATE PASSED** — Phase 2 (C-007, C-008) may start after PR merge.

## Deferred (Phase 2+)

- ECOM-C-007 Medusa JS SDK wrapper
- ECOM-C-008 Commerce API proxy
- Embeddings, ProductCards, Stripe Connect
