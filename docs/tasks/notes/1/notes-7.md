Implemented everything from `improve.md` §11. Here's what's live:

## Shipped

| Item | Path |
|------|------|
| **PR checklist** | `mdeapp/.github/pull_request_template.md` |
| **`verify:task`** | `mdeapp/scripts/verify-task.mjs` + `npm run verify:task` |
| **Queue stale hints** | `tasks/scripts/sync-tasks-queue-hints.mjs` |
| **J05–J08 Playwright** | `mdeapp/e2e/prod-venues-journey.spec.ts` |
| **Task spec template** | `tasks/templates/task-spec-template.md` |

## Wiring

- **`tasks.md`** — `playbook:` frontmatter + link to `improve.md`
- **`plan.md`** — doc map → improve.md
- **`09-prod-live-journey-matrix.md`** — J05–J08 automated section
- **`mdeai-live-prod-check.mdc`** — prod-venues-journey + verify:task
- **`improve.md`** — §11 updated to "shipped"; §5 documents `verify:task`

## Usage

```bash
# Per-task gate (floor + scoped tests)
cd mdeapp && npm run verify:task -- VEN-020 --skip-floor   # ✅ tested — 3/3 pass
cd mdeapp && npm run verify:task -- SEARCH-003
cd mdeapp && npm run verify:task -- OPS-JOURNEY --base https://www.mdeai.co

# Prod J05–J08
PROD_SMOKE_BASE_URL=https://www.mdeai.co npm run test:e2e:prod-venues-journey

# Stale queue hints (read-only)
node tasks/scripts/sync-tasks-queue-hints.mjs --since 14
```

**Registry tasks:** SAN-462, OPS-JOURNEY, SEARCH-003, DATA-041, VEN-012/020/021/031, MAP-008B, AUTH-011, SCREEN-023, SCREEN-005 — add more in `verify-task.mjs` as needed.

**Not auto-editing `tasks.md`** — sync script only prints hints (e.g. flagged VEN-014, SEARCH-001/002 still 🟡 in active rows). Run it after merges to catch drift.


## Done — queue normalized

Patched [`tasks.md`](tasks.md) and [`plan.md`](plan.md). Vitest **488/488** green. Disk checks: no `/restaurants/page.tsx`, `/rentals` still redirects.

---

### Changelog

**`tasks.md`**
- Two-track header: **Discovery Beta (active)** vs **Commerce MVP Exit (deferred)** + conflict resolver
- Renumbered: platform **1–10**, UX **11–16**, venues **17–37**, screens **38–41**, mobile **42–48**, intel **49–50**
- **Added:** F13 (8), DATA-EMBED (9), OPS-JOURNEY J05–J20 (10)
- **Fixed:** SEARCH-002 → **SAN-387** (was wrongly SAN-388)
- **Moved:** AUTH-009 → **row 26** (before VEN-019)
- **Done section:** VEN-012 (#48), VEN-021 (#53), VEN-020 (#55), **SEARCH-003**
- **Removed stale blockers:** VEN-012 no longer blocks SCREEN-022; **VEN-013** blocks SCREEN-022
- **VEN-031 stop:** Playwright + VEN-025 RLS + prod journeys (not "VEN-012 blocked")

**`plan.md`**
- Matching two-track table + "operator may defer Commerce Exit" note
- Split readiness: **Discovery Beta ~72%** vs **Commerce Exit ~55% ⏸**
- Master order rewritten: **DB-1…DB-5** active, **1A deferred**
- SEARCH-003 → SAN-388 Done; SEARCH-002 → SAN-387
- Vitest **488/488**

---

### Readiness verdict

| Metric | Before | After | Dot |
|--------|-------:|------:|:---:|
| Operator queue correctness | 62% | **~88%** | 🟢 |
| Discovery Beta | ~65% | **~72%** | 🟡 |
| Commerce MVP Exit | 55% | **55%** (deferred) | ⏸ |

---

### Remaining critical blockers

| # | Blocker | Dot |
|---|---------|:---:|
| 1 | **SAN-462** soak 1/3 | 🟥 |
| 2 | **MAP-002B / MAP-008B** prod | 🟡 |
| 3 | **AUTH-011** prod checklist | 🟡 |
| 4 | **SCREEN-023** — no `/restaurants` page | 🟥 |
| 5 | **SCREEN-005** — `/rentals` redirect | 🟥 |
| 6 | **DATA-EMBED** 403 — hybrid degraded | 🟡 |
| 7 | **F13** cold-start thread loss | 🟡 |

---

### Recommended next 5 tasks

1. **SAN-462** — finish 3/3 soak (unblocks UX 11–16)
2. **OPS-JOURNEY** — J05–J08 on prod (nightlife + restaurant ranking proof)
3. **SCREEN-023** — `/restaurants/page.tsx` (API exists)
4. **AUTH-011** + **MAP-008B** — prod gates in parallel
5. **VEN-031** — Playwright venue suite (now unblocked by VEN-012/021/020 Done)

---

### Corrected release tracks

```
Discovery Beta (ACTIVE)     → tasks.md rows 1–50
Commerce MVP Exit (DEFER)   → tasks.md D1–D5 only when reopened
Trips Phase 2               → T1–T19 after venues stop + AUTH-011 + MAP-008B
```
\

## Verdict on the audit

**Mostly correct for full MVP exit. Overstated for “can we ship anything.”** It matches `plan.md`; it fights your **intentional Stripe defer** in `tasks.md`.

| Claim | Verdict | Evidence |
|-------|---------|----------|
| **Not MVP-exit ready** | ✅ Correct | `plan.md` L46, L335: Sequence 1A + 1B incomplete |
| **~78% overall** | ✅ Correct | Same rollup in `plan.md` L46 |
| **55–60% production readiness (full MVP)** | ✅ Fair | Commerce + ledger + branch protection + mobile open |
| **Stripe: P0 in plan vs deferred in tasks** | ✅ Real conflict | `plan.md` Tier 1A: PAY-001 first · `tasks.md` D1–D5 at bottom |
| **SAN-462 33%, AUTH-011 40%, PR-16 70%, MAP gates partial** | ✅ Matches `tasks.md` rows 1–7 |
| **VEN-012 club→café bug** | ✅ Still 🔥 | Row 17, e2e not Done-gated |
| **`/rentals` broken ~25%** | ✅ Matches row 37 |
| **Mobile not ready** | ✅ Rows 41–47 mostly ⚪ |
| **“Do PAY-001 before anything else”** | ❌ **Only if** you pursue **full MVP exit now** | Wrong active queue if Stripe is deferred |
| **Desktop discovery soft-launch** | ✅ Understated in report | `plan.md` L334: “Desktop chat + discovery yes”; prod `GET /` 200; chat-smoke PASS today |
| **Stale since audit written** | ⚠️ | **DATA-041** + **SEARCH-003** → Done; Vitest **488** (not 480) |

**Safe one-liner (matches `plan.md`):**  
*Desktop beta discovery is live; commerce MVP + Patricia ledger are still blocked.*

---

## Two different “done” definitions

```text
FULL MVP EXIT (plan.md north star)
  Andrés paid ticket + Roberto publish + Patricia EVT-001
  → Stripe CANNOT be deferred

DISCOVERY BETA (your current tasks.md choice)
  Camila chat + cards + pins + venues intel
  → Stripe CAN be deferred to Tier “Commerce exit”
```

The audit assumes **full MVP exit**. Your queue assumes **discovery beta first**. Both docs are right for their scope — they need an explicit label so agents stop “fixing” the order every week.

---

## Suggested order with Stripe deferred (update mental model for `tasks.md`)

Keep **active queue** = discovery beta. Move commerce to **“MVP exit — do last”** (not “never”).

### Track 1 — Active now (discovery beta)

```text
1. SAN-462 (3/3 soak)
2. AUTH-011 + PR-16 + MAP-008B + MAP-002B  (parallel)
3. SEARCH-002 (#38) + UX-023…033 (after soak)
4. VEN-012 e2e → VEN-013 → SCREEN-022
5. VEN-021 persist → VEN-019/020
6. VEN-031 Playwright
7. SCREEN-005 /rentals (Camila P0 broken)
8. Mobile 41–47 (parallel once auth polish lands)
```

**Already done (don’t re-queue):** DATA-041 ✅ · SEARCH-003 ✅

### Track 2 — Commerce exit (deferred — `plan.md` Tier 1A)

```text
D1 PAY-001 → D2 PAY-003 → D3 EVT-002 → D4 EVT-001
then D5 DATA-028, D6 PAY-005 (mobile checkout)
```

**Gate:** Only promote Track 2 to rows 1–4 when you want **Andrés paid ticket + Patricia sign-off**, not before.

### Track 3 — Phase 2

```text
Trips T1–T19 · INT-008/021 · VEB · coffee tours
```

---

## What to fix in docs (one sentence each)

| Doc | Fix |
|-----|-----|
| **`tasks.md` top** | Add: *“Active = Discovery Beta. Commerce (D1–D4) required for MVP exit per `plan.md`, intentionally deferred.”* |
| **`plan.md` L46** | Add footnote: *Operator may defer 1A; full exit still blocked until D1–D4 Done.* |
| **Audit report** | Split verdict: **Discovery beta ~75–80%** vs **MVP exit ~55–60%** |

---

## Bottom line

| Question | Answer |
|----------|--------|
| Is the audit correct? | **Yes for full MVP exit.** **No** if the product goal is discovery beta with Stripe later. |
| Should Stripe be “before everything”? | **Only for MVP exit.** For your current sprint: **defer is valid** — keep D1–D4 at bottom, don’t hide that they block Andrés + EVT-001. |
| Next task (Stripe deferred)? | **SAN-462** or **VEN-012 e2e** — highest persona impact without opening commerce. |

Want me to patch `tasks.md` + `plan.md` with the two-track header so this conflict stops recurring?