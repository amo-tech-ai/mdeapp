# Linear Commerce Platform Audit (verified)

**Date:** 2026-06-07 (post C-005/C-006 seed)  
**Verdict:** 🟡 **Ordering correct — execute remaining Phase 1 only (ADR → Stripe → paid order).**  
**Overall score:** **88/100** (↑ from 86 — Store API blocker cleared)  
**Phase 1 order score:** **92/100** (unchanged — correct)  
**Production readiness:** **22/100** (↑ — catalog visible; Stripe + paid order still missing)

---

## Verified against disk (2026-06-07)

| Probe | Result |
|-------|--------|
| `GET :9000/health` | **200** |
| `GET /store/products` + publishable key | **count: 24** (20 mdeai + 4 legacy) |
| Seller `mdeai` | `sel_01KTHZGQ85Z1RE6X1JSJMVWVX8` · status `open` |
| ADR `docs/ecommerce/adr/001-standalone-mercur.md` | **Missing** |
| Stripe in `medusa-config.ts` | **Not configured** |
| `bun run seed:mdeai-catalog` | Idempotent · exit 0 |

**Correction to prior audit:** Blocker “Store API count 0” is **resolved**. C-005 and C-006 are **done on disk**; Linear updated to match.

---

## Phase 1 order (canonical — correct)

```text
0. ECOM-C-000  optional
1. ECOM-C-001  Commerce ADR          ← ACTIVE (ADR file missing)
2. ECOM-C-002  Mercur backend spike ← DONE (health + catalog)
3. ECOM-C-003  Env & secrets        ← NEXT after ADR
4. ECOM-C-005  Demo seller          ← DONE
5. ECOM-C-006  Catalog seed         ← DONE
6. ECOM-C-004  Stripe test checkout
7. ECOM-C-016  Paid order proof
8. ECOM-C-018  Core commerce exit gate
```

**Note:** INDEX lists C-003 before C-005 in sequence numbers; C-003 only **blocks C-004** (Stripe), not seller/catalog. C-005/C-006 may run once C-002 boots — already executed.

---

## Phase 1 task status (verified)

| Task | Linear | Disk | Grade | Notes |
|------|--------|------|-------|-------|
| C-000 | SAN-628 Backlog | optional | B+ | OK optional |
| C-001 | SAN-629 In Progress | ADR missing | A- | **Only active P0 doc task** |
| C-002 | SAN-630 Done | health 200, BOOT.md | A | Was partial; unblocked by C-006 |
| C-003 | SAN-631 Backlog | no verify script | B+ | Start after ADR |
| C-005 | SAN-633 Done | seller open | A | `seed-demo-seller.ts` |
| C-006 | SAN-634 Done | count 24 | A | `seed-mdeai-catalog.ts` |
| C-004 | SAN-632 Backlog | no Stripe provider | A- | After C-003 + C-006 ✓ |
| C-016 | SAN-644 Backlog | — | A- | After C-004 |
| C-018 | SAN-646 Backlog | 2/5 checklist | A- | Needs paid order |

---

## What the original audit got right

1. Mercur-first (`commerce/mercur`) — correct  
2. Seller before catalog — correct (executed)  
3. Catalog before Stripe — correct  
4. C-016 standalone (no AI) — correct  
5. Phase 2+ FROZEN labels — correct  
6. Do not clone `medusajs/medusa` — correct  
7. Serial ADR before sprawling — correct (keep SAN-629 focused)

---

## What was wrong / stale

| Claim | Reality |
|-------|---------|
| Store API `count: 0` | **Fixed** — `count: 24` |
| C-005/C-006 not started | **Done** 2026-06-07 |
| “Correct Next Steps” puts C-003 after C-006 | **Inconsistent** with numbered order; for **remaining** work: C-001 → C-003 → C-004 → C-016 → C-018 |

---

## Red flags (still valid)

| Flag | Action taken |
|------|----------------|
| C-001 + C-002 both In Progress | C-002 → **Done**; only C-001 In Progress |
| C-017 not CORE-GATE | SAN-645 → **CORE-GATE** + blocked by SAN-644 |
| Phase 2 tasks Priority Urgent | Keep FROZEN; blocked by SAN-646 |
| Frozen tasks executable | Added note to INDEX + project issues |

---

## Remaining critical blockers

1. **ECOM-C-001** — ADR file not written  
2. **ECOM-C-003** — `verify-commerce-env.mjs` + Infisical `/commerce`  
3. **ECOM-C-004** — Stripe provider + webhook  
4. **ECOM-C-016** — one paid Mercur order  
5. **ECOM-C-018** — exit gate (paid order + no mdeapp bridge)

---

## Correct next steps (remaining Phase 1)

```text
1. Finish ECOM-C-001 ADR (SAN-629)
2. ECOM-C-003 env/secrets (SAN-631)
3. ECOM-C-004 Stripe (SAN-632)
4. ECOM-C-016 paid order (SAN-644)
5. ECOM-C-018 exit gate (SAN-646)
```

**Do not start:** C-007+, marketplace, AI, Connect, WhatsApp.

---

## Scorecard

| Area | Score | Grade |
|------|------:|-------|
| Task naming | 96 | A+ |
| Mercur architecture | 94 | A |
| Phase 1 ordering | 92 | A |
| Dependency logic | 90 | A- |
| Frozen future tasks | 88 | B+ |
| Disk ↔ Linear sync | 85 | B+ (was 60 before this update) |
| Production readiness | 22 | F |
| **Overall** | **88** | **B+** |

---

## Linear sync actions (2026-06-07)

| Issue | Action |
|-------|--------|
| SAN-630 | Done — spike AC met |
| SAN-633 | Done — seller mdeai |
| SAN-634 | Done — Store API count 24 |
| SAN-645 | CORE-GATE label + blockedBy SAN-644 |
| SAN-635 | blockedBy SAN-646 confirmed |
| SAN-629 | In Progress — ADR blocker |

Proof path: `commerce/mercur/BOOT.md` · `commerce/.env`
