# SAN-636 — ECOM-C-008 Commerce API Proxy Evidence

Date: 2026-06-09

## Verdict

SAN-636 — ECOM-C-008 Commerce API Proxy is Done locally. The repo verification floor is reliable, and live curl proof passed against Mercur `:9000` and mdeapp `:3001`.

## Files Changed

| File | Purpose |
|---|---|
| `src/app/api/commerce/_lib.ts` | Shared proxy headers, parameter parsing, pricing-context resolution, and sanitized error responses |
| `src/app/api/commerce/health/route.ts` | Server-only SDK-backed health check using Store API regions |
| `src/app/api/commerce/products/route.ts` | Server-only product list proxy |
| `src/app/api/commerce/products/[id]/route.ts` | Server-only product detail proxy |
| `src/app/api/commerce/__tests__/commerce-routes.test.ts` | Acceptance tests for health, list, detail, and field-mask safety |
| `src/app/shop/page.tsx` | mdeapp read-only shop preview resolves Store API region before product list |
| `.env.example` | Documents optional commerce default region/country env |
| `docs/ecommerce/tasks/ECOM-C-008-commerce-api-proxy.md` | Task status and acceptance criteria |
| `docs/ecommerce/tasks/INDEX.md` | Current release tracker and SAN-636 status |
| `sitemap.md` | API inventory for the commerce routes |

## Architecture Review

| Requirement | Result | Proof |
|---|---|---|
| Mercur `:9000` bridged through mdeapp `/api/commerce/*` | 🟢 Pass | Routes live under `src/app/api/commerce/*` |
| Use SAN-635 — ECOM-C-007 Medusa JS SDK Wrapper only | 🟢 Pass | Routes call `getCommerceClient()` from `src/lib/commerce/medusa-client.ts` |
| Use SAN-725 — ECOM-C-022 safe field masks | 🟢 Pass | Routes do not accept or forward caller `fields`; wrapper owns list/detail field masks |
| Calculated price context | 🟢 Pass | Proxy resolves a Store API region before product list/detail calls |
| Do not add ProductCards, Mastra tools, cart tools, or checkout tools | 🟢 Pass | No AI/UI/cart/checkout tools added |
| Server-only boundary | 🟢 Pass | App Router route handlers pinned to `runtime = "nodejs"` |

## Security Review

| Check | Result | Proof |
|---|---|---|
| No direct Mercur browser calls | 🟢 Pass | Proxy routes are server route handlers |
| No raw Store API `fetch` in routes | 🟢 Pass | Routes call the SDK wrapper only |
| No admin API exposure | 🟢 Pass | Routes expose only health/list/detail read APIs |
| No Stripe secrets | 🟢 Pass | Route grep found no Stripe secret usage |
| No publishable key in route response | 🟢 Pass | Env key stays inside wrapper |
| No `seller.reviews` field-mask forwarding | 🟢 Pass | Tests inject malicious `fields=*seller.reviews` and assert it is not forwarded |
| No raw upstream error message leakage | 🟢 Pass | Proxy errors return sanitized error codes |

## Acceptance Criteria Results

| Acceptance Criteria | Status | Proof |
|---|---|---|
| `GET /api/commerce/health` returns 200 | 🟢 Pass | Live curl returned 200 |
| `GET /api/commerce/products` returns products | 🟢 Pass | Live curl returned 24 products |
| `GET /api/commerce/products/[id]` returns product | 🟢 Pass | Live curl returned `Medusa T-Shirt` with 8 variants |
| Uses Medusa JS SDK wrapper | 🟢 Pass | Route tests mock `getCommerceClient()` wrapper boundary |
| Uses safe field masks | 🟢 Pass | Tests verify malicious caller `fields` is ignored and wrapper constants exclude `seller.reviews` |
| Server-only boundary | 🟢 Pass | Route files are App Router API handlers with Node runtime |

## Verification Commands

| Command | Result | Notes |
|---|---|---|
| `npm run verify:commerce-mdeapp-env` | 🟢 Pass | Env names verified; values intentionally omitted |
| `npm run verify:commerce-env` | 🟢 Pass | Standalone commerce env contract verified; values intentionally omitted |
| `npm test -- src/app/api/commerce src/lib/commerce` | 🟢 Pass | 3 files, 18 tests |
| `npm run lint` | 🟢 Pass | Global lint floor repaired |
| `npm run typecheck` | 🟢 Pass | Global typecheck floor repaired |
| `npm test -- --run` | 🟢 Pass | 161 files, 778 tests |
| `npm run build` | 🟢 Pass | Build completes; `/shop` prerenders product list without commerce error |
| `npm run audit` | 🟢 Pass | High-severity audit gate exits 0 |
| `curl http://localhost:9000/health` | 🟢 Pass | Mercur health returned 200 |
| `curl http://localhost:3000/` | 🟢 Pass | B2C storefront followed to `http://localhost:3000/fr` and returned 200 |
| `curl http://localhost:3001/api/commerce/health` | 🟢 Pass | mdeapp proxy health returned 200 |
| `curl http://localhost:3001/api/commerce/products` | 🟢 Pass | Returned 24 products; first product `prod_01KTHTXVR31JBRMDSQ5N90WF74` |
| `curl http://localhost:3001/api/commerce/products/prod_01KTHTXVR31JBRMDSQ5N90WF74` | 🟢 Pass | Returned `Medusa T-Shirt` with 8 variants |
| `curl http://localhost:3001/shop` | 🟢 Pass | Returned 200 with 24 product cards |

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Linear status is stale | 🟡 Medium | Update SAN-628 and SAN-636 in Linear; mutation tool was not available in this session |
| Cart/checkout proxy routes are intentionally out of scope | 🟡 Medium | Define route scope before SAN-640 — ECOM-C-012 Cart Tools and SAN-641 — ECOM-C-013 Checkout Link |
| AI commerce remains frozen | 🟡 Medium | Start SAN-637 — ECOM-C-009 only when Phase 3 is explicitly opened |

## Linear Coverage

| Issue | Live Status | Coverage |
|---|---|---|
| SAN-628 — ECOM-C-000 mdeapp verification floor | Backlog | Locally complete; Linear status needs update |
| SAN-636 — ECOM-C-008 Commerce API Proxy | Todo / FROZEN | Locally complete; Linear status needs update |
| SAN-721 — ECOM-C-020 Production Readiness | Backlog / FROZEN | Covers production env, readiness script, and final release gate |
| SAN-727 — ECOM-C-023 B2C full Stripe checkout re-proof | Todo | Covers optional standalone B2C Stripe checkout re-proof |

## Completion Score

| Dimension | Score |
|---|---:|
| Implementation | 100% |
| Security boundary | 100% |
| Test coverage | 100% |
| Live proof | 100% |
| Release floor | 100% |
| **SAN-636 — ECOM-C-008 Commerce API Proxy overall** | **100%** |

## Ready For Merge?

Yes locally. SAN-636 — ECOM-C-008 Commerce API Proxy is code-complete, live-proofed, and passes the repo floor. Update Linear before PR/merge bookkeeping.
