---
title: Revenue vertical — forensic task audit
date: 2026-06-04
auditor: task-verifier protocol (disk + schema + linear.md cross-check)
scope: tasks/revenue/*.md · tasks/revenue/INDEX-revenue.md · docs/strategy/index-revenue.md
parent: tasks/INDEX.md TIER R
skills: .claude/skills/task-verifier/SKILL.md · mde-stripe · linear.md
linear_upload: pending — label matrix §6 required before bulk import
---

# Revenue task audit — forensic report

## Executive verdict

| Area | Score | Reading |
|------|------:|---------|
| **Individual task spec quality** | 86/100 | C2, C3, C13, C5 are strong: wiring plans, AC, persona value, skill refs. |
| **Dependency graph / INDEX order** | 62/100 | **C11 listed before C2** while depending on C2; R3-A row numbering gap; strategy doc drift. |
| **Schema / disk alignment** | 68/100 | C5 table names wrong vs `sponsor.*` schema; C1/C3 assume `subscriptions` + webhooks **not on disk**. |
| **Linear label / ID readiness** | 58/100 | Frontmatter `prefix: REV/GRW/AGENT` **not in `linear.md`**; strategy cites nonexistent `track:commerce`. |
| **MVP gate honesty** | 70/100 | Gate documented (PAY-001 + EVT-001 + MAP-002B + AUTH-011) but **not closed** on disk. |
| **Production readiness (pack)** | **0/100 ship** | All 26 tasks `Not Started`; zero revenue infra beyond ticket webhook. |
| **Will the plan succeed?** | **Conditional yes** | Succeeds if MVP exit closes first, INDEX order fixed, Linear labels normalized; **fails** if R1 starts before gate or C11 before C2. |

**Overall pack correctness: 74/100** (specs are good; orchestration + Linear + disk truth drag score).

**Persona impact today:** Andrés can buy tickets via existing checkout (pre-C2); Roberto has **no** `/advertise`, agency billing, or agent transact. Camila cannot pay in-chat. Patricia has ticket webhook + idempotency only — **no** MRR ledger, Connect, or lead billing.

---

## Tests run (2026-06-04)

| Probe | Check | Result |
|-------|-------|--------|
| Agent registry | `mdeapp/src/mastra/index.ts` | ✅ C13 claims accurate — `pingAgent`, `routerAgent`, `evaluationAgent` still registered |
| Transact tools | `mdeapp/src/mastra/tools/` | 🔴 No `create-checkout.ts` — C2 not started |
| Payment API | `src/app/api/checkout/create-payment-intent` | 🔴 Missing |
| Billing | `subscription-webhook`, `public.subscriptions` | 🔴 **Not found** in mdeapp (C1/C3 assume they exist) |
| Ticket money path | `supabase/functions/ticket-payment-webhook` | ✅ Exists + idempotency |
| Sponsor schema | `sponsor.placements` migration | ✅ `20260512140000_sponsor_schema_foundation.sql` |
| C5 table names | `sponsor_advertisers`, `sponsor_placements` | 🔴 **Wrong** — use `sponsor.*` namespace, not `public.sponsor_*` |
| `/advertise` route | `sitemap.md` | 🔴 No route listed |
| Chatwoot CW-* | `tasks/venues/tasks/chatwoot/` | ✅ CW-1..5 specs exist (duplicate copy under `tasks/chatwoot/`) |
| Vitest floor cited | Tasks say ≥401 tests | ⚪ Verify at implement time (`npm test -- --run`) |
| Audit file | `38-revenue-audit.md` | Was empty — this report |

---

## Red flags (blockers)

| # | Issue | Severity | Fix before Linear upload |
|---|-------|----------|---------------------------|
| 1 | **MVP-exit gate open** | 🔴 Critical | Close PAY-001, EVT-001, MAP-002B, AUTH-011 with evidence; keep all revenue issues `Backlog` + blocked-by links |
| 2 | **C11 before C2 in INDEX R1** | 🔴 Critical | Reorder R1: C13 → C1 → **C2 → C11** (C11 `depends_on: [C2]`) |
| 3 | **Linear labels invalid** | 🔴 Critical | Replace `prefix: REV/GRW/AGENT` with `linear.md` labels (§6 matrix) |
| 4 | **C1/C3 build on missing infra** | 🔴 Critical | C1 must **create** `subscriptions` + `subscription-webhook`; C3 must not assume C1 shipped |
| 5 | **C1 vs C5 `/advertise` collision** | 🟡 High | Both own `/advertise` — merge scope or sequence (C1 agency checkout vs C5 self-serve listings) |
| 6 | **C5 schema_tables drift** | 🟡 High | Update frontmatter + wiring to `sponsor.organizations`, `sponsor.placements`, etc. |
| 7 | **M12 price vs C3 price** | 🟡 Medium | M12 body $9.99/mo vs C3 consumer Pro **$19/mo** — pick one SKU |
| 8 | **M12 Linear project** | 🟡 Medium | Task says `Revenue`; `index-revenue.md` maps M12 → **Trips** — align |
| 9 | **index-revenue phase label** | 🟡 Medium | Doc says `phase:mvp` for revenue — wrong; use **`phase:post-mvp`** per gate |
| 10 | **index-revenue C5 deps** | 🟡 Medium | Strategy table "none"; task file **`depends_on: [C2]`** — fix strategy |
| 11 | **Skills typo** | 🟡 Low | `copilotkitV1` in INDEX — use **`copilotkit`** / `stack:copilotkit` (1.55.2 v1 imports) |
| 12 | **R5 A1–A10** | 🟡 Low | Referenced in INDEX/strategy but **no task files** under `tasks/revenue/` — don't import to Linear yet |
| 13 | **Duplicate CW paths** | 🟡 Low | `tasks/chatwoot/` vs `tasks/venues/tasks/chatwoot/` — pick canonical for Linear links |
| 14 | **INDEX R3-A missing #13** | 🟢 Low | Row numbers jump 12 → 14 — renumber |

---

## Critical fixes (ordered)

1. **Fix `tasks/revenue/INDEX-revenue.md` R1 order:** C13 → C1 → C2; C11 first in R2.
2. **Add MVP-exit parent issue** in Linear (or link existing SAN issues) and set `blocked-by` on every C/M issue until gate green.
3. **Normalize label matrix** (§6) — apply on `save_issue` import.
4. **Reconcile C1 + C5** — single `/advertise` product spec or explicit phased pages (`/advertise/agency` vs `/advertise/list`).
5. **Patch C5** `schema_tables` + SQL references to `sponsor.*`.
6. **Patch `index-revenue.md`:** `phase:post-mvp`, C5 depends on C2, C11 after C2, M12 → Trips project.
7. **C1 acceptance criteria** must include migration for `subscriptions` + RLS + webhook (currently assumed not proven).

---

## Missing items

| Gap | Why it matters |
|-----|----------------|
| **SAN-### IDs** | No Linear issue IDs in revenue frontmatter — import will create new SAN-*; add mapping table after create |
| **Evidence paths** | No `tasks/testing/evidence/REV-*` or `C*-evidence.md` templates |
| **PAY-001 task link** | Gate cites PAY-001 but no file match in `tasks/` grep — tie to SAN-178 or F11 explicitly |
| **Rollback / feature flags** | Large tasks (M1 Connect) lack kill-switch AC |
| **Colombia payments** | PRD Phase 1 US/Stripe-only; C-series assumes USD — note for Roberto/Camila personas |
| **RLS on new billing tables** | C1/C3 mention tables; only C3 AC partially covers `processed_webhook_events` RLS |
| **Service-role in routes** | C2 API routes need auth pattern audit vs F13 carve-out |

---

## Task-by-task sanity (26 files)

| ID | Spec | Deps OK | Disk aligned | Notes |
|----|:----:|:-------:|:------------:|-------|
| C13 | ✅ | ✅ | ✅ | Ready post MVP-exit |
| C1 | ✅ | ✅ | 🔴 | No subscriptions table yet |
| C2 | ✅ | ✅ | 🔴 | Foundational; blocks 8+ tasks |
| C3 | ✅ | ⚠️ | 🔴 | Depends C1 not C2 — OK parallel; infra missing |
| C4 | ✅ | ✅ | 🔴 | Needs C3 Billing |
| C5 | ✅ | ✅ | ⚠️ | Schema name drift; `/advertise` overlap with C1 |
| C6 | ✅ | ✅ | 🔴 | Needs C2 + C13 |
| C7 | ✅ | ✅ | 🔴 | Blocked CW-3 — correctly marked |
| C8 | ✅ | ✅ | 🔴 | Needs C4 |
| C9 | ✅ | ✅ | 🔴 | Needs C3 + C5 |
| C10 | ✅ | ✅ | 🔴 | Needs C2 + C6 |
| C11 | ✅ | 🔴 | 🔴 | **INDEX order wrong** |
| C12 | ✅ | ✅ | 🔴 | Needs C2 webhook extension |
| C14 | ✅ | ✅ | 🔴 | Blocked C7 |
| C15 | ✅ | ✅ | 🔴 | Needs C2 |
| M1 | ✅ | ✅ | 🔴 | 6–10 wk; Connect not started |
| M2–M12 | ✅ | ✅ | 🔴 | Post R2/R3; specs adequate |

**Average spec quality: ~86/100** · **Average execution readiness: ~15/100** (blocked on gate + C2).

---

## Will the task succeed?

| Scenario | Verdict |
|----------|---------|
| Start R1 after MVP-exit, fixed order, C2 before C11 | **Yes** — C13→C1 parallel agency cash + C2 rail is coherent |
| Start C11 in week 1 per current INDEX | **No** — dependency violation |
| Upload to Linear without label fix | **Partial** — issues land in wrong views / filters break |
| Ship C2 without extending ticket webhook | **No** — double-charge / orphan PaymentIntent risk |
| Skip CW track, start C7 | **No** — WhatsApp loop missing |
| R4 M-series before C-series complete | **No** — Connect without checkout + fees ledger |

---

## Production readiness

| Layer | Ready? | Evidence |
|-------|--------|----------|
| Ticket checkout | 🟡 Partial | Webhook + smoke scripts exist; not full revenue stack |
| Agent transact | 🔴 No | Zero transact tools |
| Recurring billing | 🔴 No | No subscriptions table/webhook |
| Connect / marketplace | 🔴 No | M1 not started |
| WhatsApp revenue | 🔴 No | CW-1..5 not started |
| Self-serve ads | 🔴 No | `/advertise` + C5 not started |

**Revenue vertical production-ready: No.** Earliest shippable slice: **C13** (internal) then **C1** or **C2** after MVP-exit.

---

## Linear upload — label matrix (use this, not task `prefix:`)

**Rules from [`linear.md`](../../linear.md):** every issue needs ≥1 `phase:*` + ≥1 `track:*` or `prefix:*`; max 3 `stack:*`.

### Phase (all revenue tasks)

| Label | When |
|-------|------|
| **`phase:post-mvp`** | All C*, M*, CW-* (after MVP-exit gate) |
| ~~`phase:mvp`~~ | **Do not use** for revenue (contradicts gate) |

### By task area

| Tasks | Linear project (from spec) | `track:*` | `prefix:*` | `area:*` | `stack:*` (pick ≤3) |
|-------|---------------------------|-----------|------------|----------|---------------------|
| C2,C3,C4,C11,C12,C15,M1,M4,M3,M10 | Commerce Platform | — | **`prefix:PAY`** | **`area:payments`** | `stack:stripe`, `stack:supabase` |
| C13,C6,C7,C8,M5 | AI & Intelligence | **`track:intelligence`** | **`prefix:INT`** | `area:concierge` | `stack:mastra`, `stack:copilotkit`, `stack:gemini` |
| C1,C5,C14,M2,M6,M8,M9,M11 | Growth & Operations | — | **`prefix:OPS`** | `area:launch` | `stack:stripe` (if payment surface) |
| C9,C10,M7 | Venues | **`track:venues`** | **`prefix:VEN`** | `area:concierge` | `stack:stripe` |
| C4,C8,M10 (real estate slice) | + Real Estate project | **`track:real`** | **`prefix:REAL`** | `area:rentals` | `stack:stripe` |
| M12 | **Trips** (fix task frontmatter) | **`track:trips`** | **`prefix:TRP`** | — | `stack:stripe` |
| CW-1..CW-5 | Venues or Growth | **`track:venues`** | **`prefix:OPS`** | — | **`stack:whatsapp`**, `stack:supabase` |

### Issue title convention

```text
REV-C13 Agent cleanup (remove ping/router/evaluation agents)
REV-C2 create_checkout Mastra tool + CheckoutWidget
REV-M1 Stripe Connect Express
```

Use **`REV-`** slug prefix in title for search; Linear ID remains **SAN-###** after create.

### Blocked-by links (Linear)

| Child | Block until |
|-------|-------------|
| All C*, M*, CW-* | MVP-exit meta-issue (PAY-001 ∧ EVT-001 ∧ MAP-002B ∧ AUTH-011) |
| C11,C6,C10,C12,C15,M3,M10 | C2 Done |
| C3,C4,M4,M12 | C1 Done (C3) / C3 Done (C4,M4,M12) |
| C7,C14,M7,M8 | CW-3 Done (+ C1 for C7) |
| M1 | C2 + C12 Done |

---

## Suggested improvements

1. **Single `/advertise` RFC** — one page spec covering C1 agency tiers + C5 listings (tabs or steps).
2. **Add `linear_labels:` YAML** to each task frontmatter (machine-readable for import script).
3. **Evidence template** — `tasks/testing/evidence/REV-C2-verify.md` per task at In Review.
4. **Shrink R1** — consider moving C11 to R2 (always after C2) in both INDEX and strategy.
5. **Import script** — extend `tasks/linear/` tooling: read frontmatter → `save_issue` with label matrix + project ID.
6. **Price sheet** — one table in `index-revenue.md` for all Stripe Prices (fix M12 vs C3 consumer Pro).
7. **Phase field in frontmatter** — map `CRITICAL/HIGH` → priority; add `linear_phase: post-mvp` distinct from task priority.

---

## Best practices (already good — keep)

- One task → one PR discipline in specs
- Persona tables (Roberto, Andrés, Camila, Patricia)
- Wiring plans with file paths
- Skill citations (`mde-stripe`, `mde-supabase`)
- Chatwoot gate called out explicitly (R3-B)
- C13 verified line refs to disk

---

## Percent correct summary

| Bucket | % |
|--------|---|
| Task markdown structure & AC | **86%** |
| Dependency declarations (in files) | **82%** |
| INDEX / strategy ordering | **62%** |
| Schema / route names vs disk | **68%** |
| Linear label / project mapping | **58%** |
| Ready to execute today | **0%** (gate + infra) |
| **Weighted overall** | **74%** |

---

## Next actions (Linear upload)

1. ~~Create or locate **MVP-exit** umbrella issue; attach blockers.~~ **Done** — gate = SAN-178, SAN-115, SAN-367, SAN-368 on each R1/CW-1 issue ([`LINEAR-REVENUE.md`](../revenue/LINEAR-REVENUE.md)).
2. ~~Fix INDEX R1 order + `index-revenue.md` drift.~~ **Done** 2026-06-05.
3. ~~Bulk create issues **R1 only** (3 issues) with §6 labels.~~ **Done** — SAN-550, SAN-552, SAN-551.
4. ~~Add CW-1..5 under Venues with `stack:whatsapp`.~~ **Done** — SAN-553..557 in Growth & Operations (CW-1 project field); `phase:post-mvp` applied.
5. **Deferred** — M-series and R5 A-series until C2 proof exists.
6. ~~After import: update INDEX + `linear_id` in task frontmatter.~~ **Done** for R1 + CW.

**Remaining:** Import R2 when SAN-551 moves to In Progress. Overlap triage SAN-559/560/561/562/563/565 complete 2026-06-05 — see [`LINEAR-REVENUE.md`](../revenue/LINEAR-REVENUE.md).

---

## References

- [`tasks/revenue/INDEX-revenue.md`](../revenue/INDEX-revenue.md)
- [`docs/strategy/index-revenue.md`](../../docs/strategy/index-revenue.md)
- [`linear.md`](../../linear.md) § Labels
- [`tasks/MVP-REQUIRED.md`](../MVP-REQUIRED.md) — gate status
- [`tasks/notes/june4/worktrees-best.md`](../notes/june4/worktrees-best.md) — one SAN → one worktree when implementing
