**Stripe deferral:** PAY-001, PAY-003, EVT-001 (ledger), DATA-028 (ticket → `trip_items`), DATA-024 — all wait until you want commerce proof. Camila chat + discovery can keep moving without them.

---

## Core DATA — what's actually left?

**P0 venue foundation is done.** DATA-001→007, 009–012, 010/011, seeds, golden queries, RLS — all shipped/archived. No blocking schema gaps for chat/maps.

**Only 3 active DATA items matter for MVP-ish work:**

| Task | Status | Stripe? | What’s left |
|------|--------|---------|-------------|
| **DATA-041** | 90% · In Review | No | 30 `venue_signals` rows live — **Patricia human QA sign-off** on top 30 ([evidence sheet](tasks/data/evidence/DATA-041-venue-signals-human-qa.md)) |
| **DATA-008** | Partial · In Review | No | Places backfill cron — DATA-007 archived so **unblocked**; finish edge/cron wiring ([spec](tasks/data/tasks-data/data-008-places-backfill-cron.md)) |
| **DATA-028** | 0% · Todo | **Yes** | Webhook → `trip_items` — **defer with Stripe** |

Everything else in [`INDEX-data.md`](tasks/data/tasks-data/INDEX-data.md) is Phase 1b/2: DATA-013–018 (events ADV), DATA-033, DATA-045 tail (event/rental grounding 0 rows), SEARCH-001/002 (app wiring, not DB).

**Auth-adjacent (counts as data layer):**
- **AUTH-011** (40%) — prod login/env checklist + enable HaveIBeenPwned — **do this**, no Stripe
- **AUTH-009** — JWT → Mastra — after AUTH-011
- **AUTH-005** — Playwright auth — P2, skip for now

---

## Suggested next tasks (Stripe deferred)

**Do now (no soak conflict):**

1. **AUTH-011** [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) — prod auth checklist + Supabase advisor fixes (~2–4h ops)
2. **DATA-041** [SAN-379](https://linear.app/sanjiovani/issue/SAN-379) — close human QA → flip Done (mostly editorial)
3. **DATA-008** [SAN-338](https://linear.app/sanjiovani/issue/SAN-338) — finish backfill cron if maps detail panels still 403/502 on cold cache
4. **PR-16** [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) — GitHub admin: require Floor + review on `main`

**Parallel / passive:**
5. **SAN-462** — 2 more scheduled prod synthetics (09:00 UTC; don’t merge risky chat PRs until 3/3)

**After soak OR if you accept risk on frozen window:**
6. **MAP-008B** [SAN-369] — Vercel Map ID + GCP billing (Camila pins)
7. **MAP-002B** [SAN-368] — ADK sidecar on prod (Tourist grounding)
8. **SEARCH-002** — merge PR #38 (events hybrid UI; frozen during soak per SAN-462)

**Tier 2 (not core DATA, but high value without Stripe):**
- **SCREEN-018** → mobile shell
- **INT-003/004** — smart rental clarify (code still Todo on disk)

---

## Bottom line

**No critical core DATA schema work is open.** The DATA pack is ~77–80% done; what’s left is **close-out** (DATA-041 QA, DATA-008 cron) plus **AUTH-011**, not new migrations.

Best ROI this week without touching Stripe: **AUTH-011 → DATA-041 sign-off → DATA-008 → PR-16**, while SAN-462 soaks.