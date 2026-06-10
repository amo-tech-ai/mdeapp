# June 5 — queue (updated 2026-06-06 PM)

**Prod HEAD:** `f8ac95b` · **Audit:** [`12-audit.md`](./12-audit.md) · **Wave 1 evidence:** [`DATA-041-wave1-2026-06-06.md`](../../data/evidence/DATA-041-wave1-2026-06-06.md)

## Wave 1 ✅ SHIPPED (local — PR pending)

| Task | Full name | Status |
|------|-----------|--------|
| **DATA-041-R01** | Restore verify-mis-phase1.mjs | ✅ 9/9 PASS |
| **DATA-041-R02** | Venue Signals Seed SQL (30 Rows) | ✅ `tasks/data/seeds/data041_venue_signals.sql` |
| **DATA-041-R03** | SEARCH-003 Integration Test | ✅ 5/5 live + verify:task SEARCH-003 |

```bash
cd mdeapp && infisical run --silent --env=dev --path=/ -- npm run verify:mis-phase1
infisical run --silent --env=dev --path=/ -- node scripts/verify-task.mjs DATA-041 --skip-floor
infisical run --silent --env=dev --path=/ -- node scripts/verify-task.mjs SEARCH-003 --skip-floor
```

**Readiness:** 74 → **80/100** · Patricia **DATA-041-R07** still ☐

---

## Wave 2 ✅ DATA-041-R04 (local — PR pending)

| Task | Full name | Status |
|------|-----------|--------|
| **DATA-041-R04** | Unused Signals in signalBoost | ✅ 12 unit + 6 integration |

**Readiness:** 80 → **83/100** · evidence: [`DATA-041-r04-2026-06-06.md`](../../data/evidence/DATA-041-r04-2026-06-06.md)

---

## NOW — Wave 3–4

| Wave | Tasks | Owner |
|------|-------|-------|
| **3** | **DATA-041-R05** + **R06** — Café/Nightlife join + anchor evidence | Sofía |
| **4** | **DATA-041-R07** — Patricia sign-off | Patricia |

**Do not start INT-021 — Restaurant & Venue Intelligence Wrapper** until Wave 4 Pass.

---

## Done ✅ (browse + routing train)

| Item | Merge |
|------|-------|
| VEN-025, VEN-035, SAN-584, SAN-587, SAN-575, SAN-586, SAN-518 | `f8ac95b` … `2cca205` |

---

## PR checklist (Wave 1 + R04)

Branch: `ai/data041-wave1-r04` (suggested)

| File | Task |
|------|------|
| Wave 1 files (see above) | R01–R03 |
| `mdeapp/src/mastra/lib/intelligence-restaurant-search.ts` | R04 |
| `mdeapp/src/mastra/lib/__tests__/intelligence-restaurant-search.test.ts` | R04 |
| `tasks/data/evidence/DATA-041-r04-2026-06-06.md` | R04 evidence |

**Exclude:** `e2e/prod-ven025-nightlife-routing.spec.ts` (unrelated)

---

## Go / No-Go

| Gate | Verdict |
|------|---------|
| Wave 1 reproducibility | **Go** |
| DATA-041 editorial sign-off | **No-Go** (Patricia R07) |
| INT-021 start | **No-Go** |
