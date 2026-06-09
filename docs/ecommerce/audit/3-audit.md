---
id: ECOM-AUDIT-003
title: Commerce platform forensic audit (post SAN-635)
audited_at: 2026-06-08
auditor: release engineer + commerce architecture review
sources:
  - https://github.com/mercurjs/mercur
  - https://docs.medusajs.com/resources/recipes/marketplace
  - https://github.com/mercurjs/b2c-marketplace-storefront
  - https://docs.mercurjs.com/llms-full.txt (fetched 158KB)
disk_probes:
  mercur_health: down_at_audit
  redis: up
  postgres_54322: up
  main_has_c007: true
  local_branch_has_c007: false
  vitest_commerce: 15/15
  vitest_floor: 667/668
  smoke_commerce_client: fail_mercur_down
---

# Commerce Forensic Audit #3

**Verdict:** Phase 1 commerce on Mercur is **real and ~95% correct**. Phase 2 bridge (mdeapp ↔ Mercur) is **merged on `main` but broken on your active checkout** — that mismatch explains most “we used the official repos, why errors?” confusion.

**Production ready?** 🔴 **No** for Camila buying in chat. 🟡 **Yes** for Phase 1 standalone proof (paid order exists) when Mercur is running.

**Overall pack score:** **86%** (weighted across phases below)

---

## Grading system

| Dot | Meaning | Score band |
|-----|---------|------------|
| 🟢 | Spec matches disk; proof runnable; aligns with Mercur/Medusa docs | 90–100% |
| 🟡 | Correct direction; doc drift, env, or process gaps | 75–89% |
| ⚪ | Not started / deferred phase | N/A |
| 🔴 | Blocker — disk contradicts claim, or gate cannot pass | &lt;75% |

**Dimensions:** architecture alignment 25% · disk/proof 25% · docs/Linear sync 20% · security/env 15% · ops/runtime 15%

---

## Tests run (2026-06-08)

| Probe | Command / URL | Result | Notes |
|-------|---------------|--------|-------|
| Mercur health | `GET :9000/health` | 🔴 **down** (`000`) | Redis + Postgres up; **API process not running** |
| B2C reference | `GET :3000/` | 🔴 **down** | Expected when storefront not started |
| Mercur env | `node scripts/verify-commerce-env.mjs` | 🟢 **PASS** | `commerce/.env` + `packages/api/.env` aligned |
| mdeapp commerce env | `npm run verify:commerce-mdeapp-env` | 🟢 **PASS** | On `main` tree (`mdeapp-san635` @ `3292a7a`) |
| Commerce vitest | `npm test -- src/lib/commerce` | 🟢 **15/15** | On `main` |
| Full vitest | `npm test` | 🟢 **667/668** (1 skipped) | Floor subset green |
| Lint + typecheck | `npm run lint && npm run typecheck` | 🟢 **PASS** | On `main` |
| Live smoke | `npm run smoke:commerce-client` | 🔴 **FAIL** | `fetch failed` — Mercur down |
| Local branch commerce | `~/mdeai/mdeapp` on `ai/san-723-*` | 🔴 **missing scripts** | `package.json` lacks C-007 npm scripts |

---

## Why errors happen even though we used official repos

Official repos solve **patterns**, not **your runtime + git layout**. mdeai deliberately **does not** ship a second buyer app like [mercurjs/b2c-marketplace-storefront](https://github.com/mercurjs/b2c-marketplace-storefront). Camila’s UI stays in mdeapp (`:3001`); Mercur stays commerce truth (`:9000`). Errors come from **boundary + ops + doc drift**, not from choosing the wrong upstream project.

### Root-cause map (real-world)

| # | Symptom | Real-world impact | Root cause | Fix |
|---|---------|-------------------|------------|-----|
| 1 | `Missing script: verify:commerce-mdeapp-env` | Sofía runs proof on wrong tree; false “C-007 not shipped” | Active branch `ai/san-723-*` **≠** `main`; commerce files were **untracked orphans** | `git checkout main && git pull && npm install` |
| 2 | `fatal: branch already used by worktree` | Release engineer cannot checkout SAN-635 branch | PR #117 checked out in `mdeapp-san635` worktree | Use worktree or remove it after merge |
| 3 | `node: ~/mdeai/mdeapp/.env.local: not found` | Smoke fails in CI-like scripts | Node `--env-file` **does not expand `~`** | Use `/home/sk/mdeai/mdeapp/.env.local` or symlink |
| 4 | `smoke: FAIL fetch failed` | C-007 looks broken though code is fine | **Mercur dev server not running** (health `000`) | `cd commerce/mercur && bun run dev` per `BOOT.md` |
| 5 | B2C product page **500** / empty | Tourist reference storefront breaks on reviews | Upstream B2C mask requests `*seller.reviews*`; local Mercur has **no review seed** | **SAN-725** Option B (policy) — already partial in C-007 LIST/DETAIL masks |
| 6 | PR #117 not mergeable | SAN-635 stuck “merge-ready” but blocked | `main` moved (#118 `@langchain/core`); **package.json conflict** | Rebase + skip duplicate dep commit |
| 7 | Merge blocked by policy | GitHub won’t merge despite green floor | **Unresolved Cubic review threads** | Fix or resolve threads before squash merge |
| 8 | INDEX says C-007 “post C-018” | Planners think bridge not started | **INDEX.md not updated** after SAN-635 Done | Update INDEX + task YAML `status: Done` |
| 9 | Evidence says “11 vitest” | Done gate doc wrong | Evidence written mid-PR; **not refreshed** after 15 tests | Update `ecom-c-007-medusa-client-wrapper.md` |
| 10 | `commerce/b2c-storefront/` untracked | `yarn upgrade` wipes mdeai field-mask patch | B2C clone **gitignored by design** (ADR) | Keep auditable patch in `docs/ecommerce/evidence/` (SAN-724) |

**Example (Camila):** She asks for “marketplace sandals under €40.” mdeapp concierge must call `listProducts` via `@medusajs/js-sdk` with a **safe field mask**. If you copy the B2C repo’s default mask blindly, Store API returns **500** and she sees no ProductCard — even though [Mercur](https://github.com/mercurjs/mercur) and [Medusa marketplace recipe](https://docs.medusajs.com/resources/recipes/marketplace) are “correct.” The failure is **unseeded seller reviews + wrong fields**, not wrong platform choice.

---

## Architecture vs official repos

| Layer | Official reference | mdeai choice | Grade | Notes |
|-------|-------------------|--------------|-------|-------|
| Marketplace backend | [mercurjs/mercur](https://github.com/mercurjs/mercur) v2 block architecture | `commerce/mercur/` vendored scaffold | 🟢 **96%** | Matches ADR-001; Bun + Medusa 2.13.4; custom seeds (`seed-mdeai-catalog`) |
| Store API client | Medusa JS SDK | `src/lib/commerce/medusa-client.ts` on **`main`** | 🟢 **94%** | Read-only Phase 2; LIST/DETAIL field masks; no cart yet |
| Reference buyer UI | [b2c-marketplace-storefront](https://github.com/mercurjs/b2c-marketplace-storefront) | Local clone only `:3000` | 🟡 **82%** | Not in git; patch in `products.ts` lines 83–86 documents reviews 500 |
| Production buyer | Custom storefront per Medusa docs | **mdeapp** `:3001` chat-first | 🟢 **90%** | Correct per ADR — do **not** merge B2C into mdeapp git |
| Marketplace recipe | Medusa custom module + links | **Mercur modules** (seller, commission) | 🟢 **92%** | Right call — don’t install parallel Medusa marketplace module |

**Mercur docs note:** Upstream quickstart shows Admin `:7000` / Vendor `:7001`. Your `BOOT.md` correctly documents **this scaffold serves admin/vendor on `:9000` paths** — port mismatch with marketing README is a **doc hazard**, not a code bug.

---

## Task-by-task audit

### Phase 1 — Commerce standalone (COMPLETE)

| Task | Name | Linear | Grade | % | Report |
|------|------|--------|-------|---|--------|
| ECOM-C-001 | Commerce ADR | SAN-629 | 🟢 | **98%** | `docs/ecommerce/adr/001-standalone-mercur.md` exists; matches Mercur+Medusa marketplace pattern |
| ECOM-C-002 | Mercur backend spike | SAN-630 | 🟢 | **95%** | `BOOT.md`, health, Store API proven; **runtime must be started manually** |
| ECOM-C-003 | Env & secrets | SAN-631 | 🟢 | **93%** | `verify-commerce-env.mjs` PASS; Infisical `/commerce` path documented |
| ECOM-C-005 | Demo seller | SAN-633 | 🟢 | **96%** | Seller `mdeai` open |
| ECOM-C-006 | Product catalog seed | SAN-634 | 🟢 | **96%** | 24 products on Store API (when Mercur up) |
| ECOM-C-004 | Stripe test checkout | SAN-632 | 🟢 | **94%** | `pp_stripe_stripe` + client_secret in exit gate evidence |
| ECOM-C-016 | Paid order proof | SAN-644 | 🟢 | **95%** | Order captured in C-018 evidence |
| ECOM-C-018 | Core commerce exit gate | SAN-646 | 🟢 | **97%** | Phase 1 gate PASSED 2026-06-07 |

**Phase 1 weighted score:** 🟢 **95%**

**Corrections (Phase 1):**

- None blocking. Keep Mercur boot in daily checklist before any commerce proof.
- Add CI smoke that fails clearly when `:9000` is down (optional hardening).

---

### Phase 2 — mdeapp bridge (IN PROGRESS)

| Task | Name | Linear | Grade | % | Report |
|------|------|--------|-------|---|--------|
| ECOM-C-007 | Medusa Client Wrapper | SAN-635 | 🟢 | **94%** | **Merged #117** @ `3292a7a`; SDK 2.13.4; 15 tests; verify PASS; smoke needs Mercur |
| ECOM-C-021 | B2C reference storefront | SAN-724 | 🟡 | **88%** | Evidence + local B2C patch; clone not in git; patch not in auditable `.patch` file on disk |
| ECOM-C-022 | Seller reviews field mask | SAN-725 | 🟡 | **72%** | **Partially done inside C-007** (LIST/DETAIL masks); formal policy doc + recipes map row still open; **blocks C-008** |
| ECOM-C-008 | Commerce API proxy | SAN-636 | ⚪ | **N/A** | Correctly **not started** until SAN-725 Done |

**Phase 2 weighted score:** 🟡 **85%** (C-007 done; C-022 incomplete)

**Corrections (Phase 2):**

| Task | Correction |
|------|------------|
| C-007 | Update task YAML `status: Done`; fix `mercur-client.ts` typo → `medusa-client.ts`; refresh evidence (15 tests, LIST vs DETAIL) |
| C-007 | Pull `main` into active dev checkout — **do not** rely on untracked `src/lib/commerce/` copies |
| C-021 | Commit `b2c-products-field-mask.patch` under `docs/ecommerce/evidence/` (referenced in SAN-724, missing from glob) |
| C-022 | Add `commerce-store-api-fields.md`; mark Option B in ADR/evidence; curl proofs in task spec |
| INDEX | Add C-021, C-022 to Phase 2 table; mark C-007 **Done**; serial order: `C-007 → C-022 → C-008` |

---

### Phase 3+ — AI commerce & marketplace (NOT EVALUATED FOR EXECUTION)

| Task band | Grade | % | Note |
|-----------|-------|---|------|
| C-009…C-020 | ⚪ | N/A | Correctly gated behind Phase 2 |
| M-001…M-013 | ⚪ | N/A | Mercur marketplace modules — post C-020 |

---

## Red flags & blockers

### 🔴 Critical (fix before claiming “commerce works locally”)

1. **Wrong git branch** — `~/mdeai/mdeapp` on `ai/san-723-*` without `main` commerce merge → missing npm scripts.
2. **Mercur not running** — all live smokes fail regardless of SDK quality.
3. **SAN-725 incomplete** — C-008 must not start until field-mask policy is documented and verified with curl.

### 🟡 Important (fix before production)

4. **INDEX / task / evidence drift** — planners and agents read stale status.
5. **B2C patch not auditable in repo** — risk on `yarn upgrade` in reference clone.
6. **Vercel `COMMERCE_*` env** — not configured for prod (C-020 scope).
7. **`.npmrc` `legacy-peer-deps=true`** — repo-wide; masks peer conflicts (Cubic P2); document why Medusa install needs it.
8. **C-007 acceptance still lists cart/checkout** — out of scope for C-007; move to C-012/C-013 or strike from AC.

### 🟢 Non-issues (common false alarms)

- Using Mercur instead of raw Medusa marketplace recipe — **correct** per ADR.
- Separate B2C reference at `:3000` — **correct**; mdeapp is not a fork of b2c-marketplace-storefront.
- Stripe keys in `commerce/.env` — **correct** for Mercur backend; mdeapp uses `COMMERCE_PUBLISHABLE_KEY` only.

---

## Security & env audit

| Check | Status | Notes |
|-------|--------|-------|
| No `sk_*` in mdeapp commerce env | 🟢 | `commerce-env.ts` enforces `pk_*` |
| No `NEXT_PUBLIC_*` commerce secrets in mdeapp | 🟢 | verify script blocks `NEXT_PUBLIC_(STRIPE|MEDUSA|COMMERCE)_*` |
| Stripe secrets only in `/commerce` namespace | 🟢 | `verify-commerce-env.mjs` PASS |
| Service role in mdeapp for commerce | 🟢 | None — SDK uses publishable key server-side |
| Redis for Mercur | 🟡 | Dev container up; prod Redis in C-020 checklist |

---

## Skills & AI context

| Resource | Status |
|----------|--------|
| Mercur `llms-full.txt` | Fetched OK (`curl -o` → 158KB) — attach for agent sessions |
| Mercur MCP `docs.mercurjs.com/mcp` | Not wired in `.mcp.json` — **suggest add for C-008+** |
| mdeapp `.claude/skills/` Medusa/Mercur | Skills live in parent `.agents/skills/`; sync per project rules |
| `building-with-medusa` / `mercur-cli` | Listed in C-007 task — use before C-008 proxy routes |

---

## Will the tasks succeed?

| Phase | Verdict | Confidence |
|-------|---------|------------|
| Phase 1 | 🟢 **Succeeded** | High — paid order + exit gate evidenced |
| Phase 2 (C-007) | 🟢 **Succeeded on `main`** | High — merged, tests green |
| Phase 2 (C-022) | 🟡 **Will succeed in ~0.5d** | High — Option B mostly implemented; needs doc + curl proof |
| Phase 2 (C-008) | 🟡 **Will succeed if gated** | Medium — depends on proxy auth + session design |
| Phase 3 AI cards | 🟡 **Blocked until C-008** | Medium — agentic-commerce pattern exists in Medusa examples |
| Production | 🔴 **Not ready** | Low until C-019 + C-020 + Vercel commerce env |

---

## Production readiness scorecard

| Surface | Score | Dot |
|---------|-------|-----|
| Mercur standalone checkout | **78%** | 🟡 |
| mdeapp commerce bridge | **42%** | 🔴 |
| AI product discovery in chat | **8%** | 🔴 |
| Multi-vendor marketplace | **5%** | 🔴 |
| **Overall commerce platform** | **28%** | 🔴 |

Phase 1 proves **Roberto/ops can sell one SKU via Stripe**. It does **not** prove **Camila buys via concierge on mdeai.co**.

---

## Prompt: next steps (strict order)

```text
1. Ops (today)
   cd ~/mdeai/mdeapp
   git stash push -m "SAN-723 WIP"          # no -u
   git checkout main && git pull && npm install
   cd commerce/mercur && bun run dev      # :9000 health 200
   npm run verify:commerce-mdeapp-env
   npm run smoke:commerce-client

2. SAN-725 ECOM-C-022 Seller Reviews Field Mask Policy (P1 — blocks C-008)
   - Document Option B in docs/ecommerce/docs/commerce-store-api-fields.md
   - curl proof: slim mask 200, *seller.reviews* documented as unsupported
   - Update 05-medusa-recipes-map.md + evidence ecom-c-022-reviews-policy.md
   - Linear → Done

3. Doc hygiene (same PR or chore)
   - INDEX.md: C-007 Done, add C-021/C-022, order C-007 → C-022 → C-008
   - ECOM-C-007-medusa-client-wrapper.md: status Done, fix filenames
   - ecom-c-007 evidence: 15 tests, LIST/DETAIL masks

4. SAN-636 ECOM-C-008 Commerce API Proxy — only after SAN-725 Done
   - Server routes wrapping medusa-client; still no browser secrets

5. Do NOT start C-009 embeddings / C-010 agent tools until C-008 proxy exists
```

---

## Summary scores

| Area | % correct | Dot |
|------|-----------|-----|
| Architecture vs Mercur/Medusa docs | **93%** | 🟢 |
| Phase 1 execution | **95%** | 🟢 |
| Phase 2 C-007 implementation | **94%** | 🟢 |
| Phase 2 planning/docs sync | **68%** | 🟡 |
| Local dev ergonomics (git/worktree/runtime) | **58%** | 🔴 |
| Production readiness | **28%** | 🔴 |
| **Overall forensic score** | **86%** | 🟡 |

**Bottom line:** The official repos were the right foundation. Errors came from **(a)** intentional architecture split (mdeapp ≠ B2C repo), **(b)** unseeded Mercur seller reviews vs upstream field masks, **(c)** git/worktree/process drift, and **(d)** Mercur not running during proof. None of that invalidates Phase 1. **Pull `main`, boot Mercur, finish SAN-725, then SAN-636.**

---

## References

- [mercurjs/mercur](https://github.com/mercurjs/mercur) — marketplace backend (Medusa 2)
- [Medusa Marketplace Recipe](https://docs.medusajs.com/resources/recipes/marketplace)
- [mercurjs/b2c-marketplace-storefront](https://github.com/mercurjs/b2c-marketplace-storefront) — reference UI only
- [Mercur docs llms-full.txt](https://docs.mercurjs.com/llms-full.txt)
- Prior audits: [1-tasks-audit.md](./1-tasks-audit.md) · [2-linear-commerce-audit.md](./2-linear-commerce-audit.md)
- Evidence: [commerce-core-exit-gate.md](../evidence/2026-06-07/commerce-core-exit-gate.md) · [ecom-c-007](../evidence/2026-06-08/ecom-c-007-medusa-client-wrapper.md)
