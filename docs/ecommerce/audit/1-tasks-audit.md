---
id: ECOM-AUDIT-001
title: Commerce tasks forensic audit
audited_at: 2026-06-07
auditor: task-verifier + commerce architecture review
source: ../tasks/INDEX.md
skills_used:
  - task-verifier
  - mde-task-lifecycle
  - building-with-medusa
  - mercur-cli
  - mde-supabase
  - mde-stripe
disk_probes:
  commerce_mercur: true
  mercur_health: unreachable
  adr_exists: false
  env_template: true
  stripe_in_config: false
  store_products_visible: false
---

# Commerce Tasks Forensic Audit

**Verdict:** Task pack is **~84% correct** after C-008 fix — **not production ready**, **not 100% verified**. Phase 1 is executable with **3 live blockers** on disk.

**Will Phase 1 succeed?** 🟡 **Yes, if** C-006 fixes sales-channel linking and C-004 isolates Stripe webhooks. Current partial C-002 cannot flip Done until Store API returns products.

**Production ready?** 🔴 **No** — no paid order, no ADR, no Stripe provider, API not running at audit time.

---

## Grading system

| Dot | Meaning | Score band |
|---|---|---|
| 🟢 | Spec correct; dependencies align; provable DoD | 90–100% |
| 🟡 | Usable with listed corrections | 75–89% |
| ⚪ | Deferred phase; not evaluated for execution | N/A |
| 🔴 | Blocker — wrong ID, missing file, or disk contradicts claim | &lt;75% |

**Dimensions (task-verifier rubric):** source alignment 20% · disk accuracy 25% · DoD provability 25% · template 15% · security 15%

---

## Executive summary

| Metric | Value |
|---|---|
| Tasks in INDEX | 34 |
| Phase 1 complete | 0 / 8 |
| Critical blockers | 3 |
| ID conflicts fixed this audit | 1 (C-008 proxy vs supabase) |
| Missing on disk | ADR, Stripe config, verify-commerce-env.mjs |
| Overall pack score | **84%** |
| Phase 1 execution readiness | **62%** (blockers −15 each) |
| Production readiness | **12%** |

### Critical blockers (stop until fixed)

| # | Blocker | Impact |
|---|---|---|
| 🔴 B1 | Store API `count: 0` despite DB seed | C-006, C-016 cannot pass |
| 🔴 B2 | No Stripe payment provider in `medusa-config.ts` | C-004, C-016 blocked |
| 🔴 B3 | ADR file missing (`docs/ecommerce/adr/001-standalone-mercur.md`) | C-001 not Done; scope drift risk |

### Red flags

- Linear **SAN-644** titled "E2E AI checkout" in Linear may still say AI — task now = Phase 1 **paid order** (rename in Linear)
- Linear **SAN-646** may still say "production readiness" — task now = **Phase 1 exit gate**
- **C-002** claims health 200 but API **unreachable** at audit probe (stale status)
- Phase 1 canonical tasks use **short template** — lack task-verifier §6 sections 1–10 (🟡 not 🔴)
- **C-020** still references Cloudinary in `verified_against` — cancelled for Phase 1

### Fixes applied during this audit

1. Created [ECOM-C-008-commerce-api-proxy.md](../tasks/ECOM-C-008-commerce-api-proxy.md) (roadmap-aligned)
2. Merged supabase link tables into C-009; removed duplicate C-008 supabase file
3. Corrected INDEX implementation order (Phase 1–5 serial table)
4. C-010 `depends_on` → C-008 + C-009 per roadmap
5. M-008 `depends_on` → C-020 (was C-016 only)

---

## Implementation order verification

### Phase 1 — 🟢 Correct (after INDEX fix)

```text
C-001 → C-002 → C-003 → C-005 → C-006 → C-004 → C-016 → C-018
```

**Real-world:** Patricia won't touch mdeapp yet. Sofía boots `commerce/mercur` alone, seeds a **mdeai** seller, lists 20 Medellín SKUs, runs Stripe test card, sees **one paid order** in Mercur admin — only then may Camila's chat get commerce tools.

### Phase 2 — 🟢 Correct

```text
C-007 (SDK) → C-008 (proxy)   both require C-018
```

### Phase 3 — 🟡 Mostly correct

```text
C-009 → C-010…C-015 → C-019;  C-017 parallel after C-016;  C-020 last
```

**Correction:** C-011/C-012 should list **C-008** in `depends_on` (roadmap) — INDEX fixed; update task file frontmatter.

### Phase 4–5 — 🟢 Gated on C-020

---

## Per-task audit reports

### Phase 0

#### ECOM-C-000 — mdeapp verification floor

| Field | Value |
|---|---|
| Dot | 🟡 |
| Spec score | **86%** |
| Execution readiness | **80%** |
| Will succeed? | Yes — lint/tsconfig scope patch |
| Production impact | Indirect — protects mdeapp floor when commerce touches `src/` |

**Real-world:** Sofía merges a commerce PR; `npm run floor` must stay green so Camila's `/chat` doesn't regress.

**Corrections**

1. Mark explicitly **optional** before Mercur-only work (INDEX done)
2. Add `infisical run -- npm run floor` to proof commands (project standard)
3. Remove stale `blocks: [ECOM-C-001]` — C-001 does not require floor for Mercur spike

---

### Phase 1

#### ECOM-C-001 — Commerce ADR

| Field | Value |
|---|---|
| Dot | 🟡 |
| Spec score | **88%** |
| Execution readiness | **70%** (ADR missing on disk) |
| Will succeed? | Yes — docs-only |

**Real-world:** Before any code, the team agrees: prices live in Mercur, not Supabase — so Andrés never sees a ticket price synced from the wrong database.

**Corrections**

1. 🔴 Create `docs/ecommerce/adr/001-standalone-mercur.md`
2. Add `github.com/mercurjs/mercur` to official refs (done in frontmatter)
3. Add evidence path: `tasks/testing/evidence/.../commerce-adr.md`

---

#### ECOM-C-002 — Mercur backend spike

| Field | Value |
|---|---|
| Dot | 🟡 |
| Spec score | **82%** |
| Execution readiness | **58%** (Store API empty; health stale) |
| Will succeed? | Partially — already booted once |

**Real-world:** Roberto doesn't use this task directly; it's infra so **mdeai** seller products exist for later checkout.

**Disk probe**

| Claim | Result |
|---|---|
| `commerce/mercur/BOOT.md` | 🟢 exists |
| API health :9000 | 🔴 unreachable at audit |
| Migrations | 🟢 documented |
| Store products visible | 🔴 count 0 (known) |

**Corrections**

1. Do **not** mark Done until C-006 passes Store API check (cross-link in AC)
2. Add `bun run dev` + redis container to proof commands in task body
3. Update status to **Partial — blocked on C-006 sales channel**

---

#### ECOM-C-003 — Env & secrets

| Field | Value |
|---|---|
| Dot | 🟡 |
| Spec score | **85%** |
| Execution readiness | **72%** |
| Will succeed? | Yes |

**Real-world:** Events Stripe webhooks and commerce Stripe webhooks must not share secrets — or Andrés' ticket payment could hit the wrong handler.

**Disk probe**

| Claim | Result |
|---|---|
| `.env.template` | 🟢 exists |
| `verify-commerce-env.mjs` | 🔴 missing |
| `env-commerce.md` | 🔴 missing |
| Infisical `/commerce` | 🟡 documented, not verified |

**Corrections**

1. Implement `mdeapp/scripts/verify-commerce-env.mjs`
2. Add `docs/ecommerce/docs/env-commerce.md`
3. Proof: `infisical run --path=/commerce -- bun run dev` in BOOT.md

---

#### ECOM-C-004 — Stripe test checkout

| Field | Value |
|---|---|
| Dot | 🟡 |
| Spec score | **90%** |
| Execution readiness | **65%** (no Stripe in config) |
| Will succeed? | Yes after C-003 + C-006 |

**Real-world:** Camila won't use this yet — it's Mercur admin / Store API proof that a **4242** card completes.

**Corrections**

1. Confirm Medusa v2 provider package name in `medusa-config.ts` (probe `node_modules` before implement)
2. Add shipping option seed requirement (cart complete often needs shipping profile)
3. Explicit webhook path grep vs mdeapp events route in AC

---

#### ECOM-C-005 — Demo seller

| Field | Value |
|---|---|
| Dot | 🟢 |
| Spec score | **92%** |
| Execution readiness | **88%** |
| Will succeed? | Yes |

**Real-world:** One **mdeai** approved seller owns all 20 demo SKUs — like a single boutique before multi-vendor Colombiamoda.

**Corrections**

1. Use Mercur operator-created seller (admin), not vendor self-reg, in proof steps
2. Document seller id in `BOOT.md` after seed
3. Align name with roadmap (`mdeai` vs `mdeai-demo` — pick one)

---

#### ECOM-C-006 — Product catalog seed

| Field | Value |
|---|---|
| Dot | 🟡 |
| Spec score | **88%** |
| Execution readiness | **55%** (live blocker) |
| Will succeed? | Yes — root cause known |

**Real-world:** Tourist asks for "coffee from Poblado" — Phase 3 needs real SKUs; Phase 1 needs **20** visible in Store API.

**Corrections**

1. 🔴 AC must include: publishable key ↔ sales channel ↔ seller product link (fix for count 0)
2. Add reference: [mercurjs/mercur](https://github.com/mercurjs/mercur) seed scripts
3. Idempotent upsert by `handle` in proof commands

---

#### ECOM-C-016 — Paid order proof

| Field | Value |
|---|---|
| Dot | 🟢 |
| Spec score | **91%** |
| Execution readiness | **60%** (deps not green) |
| Will succeed? | Yes when C-004 + C-006 green |

**Real-world:** First revenue signal — a test order in Mercur admin with captured payment, no mdeapp UI required.

**Corrections**

1. Rename Linear SAN-644 title to "Paid order proof (Phase 1)" — decouple from AI E2E
2. Evidence file path: `tasks/testing/evidence/YYYY-MM-DD/commerce-paid-order.md`
3. Clarify: Store API complete flow, not CopilotKit

---

#### ECOM-C-018 — Core commerce exit gate

| Field | Value |
|---|---|
| Dot | 🟢 |
| Spec score | **90%** |
| Execution readiness | **70%** |
| Will succeed? | Yes — checklist task |

**Real-world:** Patricia signs off Phase 1 — only then can engineers start `/api/commerce` in mdeapp.

**Corrections**

1. Rename Linear SAN-646 to "Core commerce exit gate"
2. Merge prod-deploy items from C-020 — keep C-018 focused on Phase 1 evidence
3. Require `infisical run` in proof commands per testing rule

---

### Phase 2

#### ECOM-C-007 — Medusa JS SDK wrapper

| Field | Value |
|---|---|
| Dot | 🟡 |
| Spec score | **83%** |
| Execution readiness | ⚪ deferred |

**Real-world:** Camila's chat backend calls `mercur-client.ts` — she never sees API keys.

**Corrections**

1. Rename file target to `medusa-client.ts` OR `mercur-client.ts` — align with roadmap (`medusa-client.ts`)
2. Replace `nextjs-starter-medusa` ref with `b2c-marketplace-storefront` in §7
3. `depends_on`: C-018 + C-006 (INDEX ✅)

---

#### ECOM-C-008 — Commerce API proxy

| Field | Value |
|---|---|
| Dot | 🟢 |
| Spec score | **93%** |
| Execution readiness | ⚪ deferred |

**Real-world:** Browser calls `localhost:3001/api/commerce/products`; server holds publishable key.

**Corrections**

1. Add Vitest smoke test path in AC
2. Verify no `createClient()` service-role in routes (mde-supabase rule)
3. Created this audit — was **missing** before

---

### Phase 3 (summary scores)

| ID | Title | Dot | % | Key correction |
|---|---|---|---|---|
| C-009 | Embeddings + link tables | 🟢 | 87% | Skill → `mde-supabase` (fixed); Step A/B split |
| C-010 | product_search | 🟡 | 82% | depends C-008 (fixed); add `agentic-commerce` ref in body |
| C-011 | product_detail | 🟡 | 80% | Add `depends_on: [ECOM-C-008]` |
| C-012 | cart tools | 🟡 | 81% | Add `depends_on: [ECOM-C-008]`; working memory schema |
| C-013 | checkout_link | 🟡 | 83% | HITL / no PAN in chat |
| C-014 | ProductCard | 🟡 | 85% | `data-testid="product-card"`; DESIGN.MD |
| C-015 | Cart UI | 🟡 | 78% | Minimal — no full cart page scope creep |
| C-019 | AI E2E proof | 🟡 | 79% | Create Linear issue; Playwright evidence |
| C-017 | Ops playbook | 🟡 | 84% | Can start after C-016 (not only C-019) |
| C-020 | Prod readiness | 🟡 | 76% | Remove Cloudinary ref; add Linear issue |

**Real-world Phase 3:** Camila asks *"white linen shirt for Provenza dinner"* → embedding search → ProductCard with **live** Mercur price → add to cart → Stripe link.

---

### Phase 4 — Marketplace

| ID | Title | Dot | % | Key correction |
|---|---|---|---|---|
| M-001 | Mercur foundation | 🟢 | 94% | Do not install Medusa marketplace recipe |
| M-002 | Vendor application | 🟡 | 78% | Use Mercur seller registration, not custom module |
| M-003 | Admin invite | 🟡 | 76% | Use `commerce/mercur/apps/vendor` |
| M-004 | Vendor dashboard | 🟡 | 72% | Avoid standalone vendor-panel repo |
| M-005 | Stripe Connect | 🟡 | 80% | Gate on C-020; Mercur Connect provider |
| M-006 | Order split | 🟡 | 77% | Use Mercur split-order-payment — no custom |
| M-007 | Payout visibility | 🟡 | 75% | Admin + vendor panel only |

---

### Phase 5 — Lifestyle

| ID | Dot | % | Note |
|---|---|---|---|
| M-008 | 🟡 | 74% | depends C-020 (fixed); WhatsApp deferred P2 |
| M-009–M-011 | 🟡 | 76% | Link tables in Supabase metadata only |
| M-012 | 🟡 | 73% | Analytics — no order truth in Supabase |
| M-013 | ⚪ | 70% | Featured listings — pilot only |

---

## Missing items

| Item | Priority | Suggested task |
|---|---|---|
| ADR file on disk | P0 | C-001 |
| `verify-commerce-env.mjs` | P0 | C-003 |
| Shipping profile seed for checkout | P0 | C-006 or C-004 |
| Linear issues for C-019, C-020 | P1 | Ops |
| Playwright `e2e/commerce-*.spec.ts` | P1 | C-016, C-019 |
| `npm run smoke:commerce` script | P2 | C-010 |
| Infisical `/commerce` path proof | P0 | C-003 |

---

## Best practices compliance

| Rule | Status |
|---|---|
| Mercur standalone backend | 🟢 |
| GitHub repos over custom modules | 🟢 (after M-001 fix) |
| Checkout before AI | 🟢 INDEX order |
| No Supabase product truth | 🟢 C-009 AC |
| task-verifier disk probes | 🟡 Phase 1 tasks need evidence paths |
| Infisical for secrets | 🟡 partial |
| CopilotKit 1.55.2 only (Phase 3) | 🟢 implied |
| Gemini-only AI (Phase 3) | 🟢 C-009 |

---

## Can we claim 100% correct?

**No.** task-verifier fails closed:

- Disk contradicts C-002 Done eligibility
- ADR not on disk
- Stripe not configured
- Store API product visibility unproven
- 10+ moved tasks still use draft template with stale `02-audit-tasks.md` paths

**Target after Phase 1 green:** re-run this audit → expect **≥92%** pack score, **≥90%** Phase 1 readiness.

---

## Next steps (priority order)

1. **ECOM-C-001** — write ADR (1–2 h, unblocks formal sign-off)
2. **ECOM-C-005 + C-006** — seller + 20 products visible in Store API (fixes B1)
3. **ECOM-C-004** — Stripe provider + isolated webhook (fixes B2)
4. **ECOM-C-016** — paid order evidence file
5. ~~**Linear sync**~~ — done 2026-06-07 (SAN-628…721; SAN-551 canceled). See `tasks/INDEX.md` § Linear sync
6. **ECOM-C-003** — `verify-commerce-env.mjs` + Infisical `/commerce` proof
7. Re-run audit probes:

```bash
curl -s -o /dev/null -w 'health=%{http_code}\n' http://localhost:9000/health
PK=pk_... curl -s -H "x-publishable-api-key: $PK" http://localhost:9000/store/products | jq '.count'
test -f docs/ecommerce/adr/001-standalone-mercur.md && echo ADR=ok
rg 'payment-stripe|stripe' commerce/mercur/packages/api/medusa-config.ts
```

8. Only after C-018 green → start **C-007** (SDK bridge)

---

## Scorecard summary

| Phase | Tasks | Avg % | Dot |
|---|---|---:|---|
| 0 | 1 | 86% | 🟡 |
| 1 | 8 | 84% | 🟡 |
| 2 | 2 | 88% | 🟢 |
| 3 | 10 | 81% | 🟡 |
| 4 | 7 | 79% | 🟡 |
| 5 | 6 | 74% | 🟡 |
| **Pack total** | **34** | **84%** | **🟡** |

**Production ready:** 🔴 **12%** (infra partial only)  
**Phase 1 will succeed:** 🟡 **Yes, with corrections above**

---

## Linear sync (2026-06-07)

**Verified audit:** [2-linear-commerce-audit.md](./2-linear-commerce-audit.md) — Store API `count: 24`; SAN-630/633/634 Done.

**Project:** [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) — **34 ECOM issues** (33 active + 1 canceled).

| Order | Task | Linear | Status |
|---:|---|---|---|
| 0 | C-000 | SAN-628 | Backlog |
| 1 | C-001 | SAN-629 | **In Progress** (ADR missing) |
| 2 | C-002 | SAN-630 | **Done** |
| 3 | C-003 | SAN-631 | Backlog |
| 4 | C-005 | SAN-633 | **Done** |
| 5 | C-006 | SAN-634 | **Done** |
| 6–8 | C-004, C-016, C-018 | SAN-632, 644, 646 | Backlog |
| 9–17 | C-007…C-015 | SAN-635…643 | Backlog (FROZEN) |
| 18 | C-019 | **SAN-720** (new) | Backlog |
| — | C-017 | SAN-645 | Backlog |
| 19 | C-020 | **SAN-721** (new) | Backlog |
| 20–32 | M-001…M-013 | SAN-647…659 | Backlog |

**Repurposed:** SAN-633 (Cloudinary→C-005), SAN-636 (Supabase→C-008), SAN-644 (AI E2E→C-016), SAN-646 (prod→C-018).  
**Canceled:** SAN-551 (REV-C2 duplicate of C-013 / SAN-641).
