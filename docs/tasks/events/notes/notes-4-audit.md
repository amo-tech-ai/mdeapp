---
title: Forensic audit — 9 tasks
date: 2026-06-09
updated: 2026-06-09 (post-merge verification)
scope: SAN-860/861/862 (ghost IDs → SAN-546) · SAN-178 · SAN-492 · SAN-858 · SAN-510 · SAN-511 · SAN-135 · SAN-116
verified_via: Linear MCP · GitHub (gh) · Supabase MCP (live, project zkwcbyxiwklihegjhuql) · Playwright prod run · Vitest · tsc
naming: every task ID carries its full name — `SAN-### · SPEC-ID — <full Linear title>`
---

# Forensic audit — 9 tasks · 2026-06-09

## Plain-English summary — what this means for real users

The website is up: mdeai.co serves `/`, `/events`, and `/rentals` (200).

- **Camila (map + rentals):** J15 pin-clear fix **merged** via PR #145 → **SAN-546 · OPS-JOURNEY — Lucía: Prod journey matrix J05–J20 (rentals, venues, maps, mobile)**. Re-run prod J15 after Vercel promote to confirm stale pins are gone.
- **Andrés (tickets):** Full prod checkout → paid order → QR proven (`MDE-6482852E4F`, COP 40,000) on **SAN-178 · PAY-001 — Live ticket purchase on production** — but Stripe is **test mode** (`cs_test_*`). Real revenue needs Path B (live keys) or Path A sign-off (test-mode prod acceptable).
- **Roberto (host):** 31/49 published events have no owner — all `source=manual` catalogue imports. **SAN-858 · DATA-QUALITY — Events ownership classification** recommends Option A (keep NULL); product sign-off only.
- **Venue bookings:** **SAN-492 · EVT-033 — Event venue + offerings schema** is on **draft PR #146** (pushed, trigger hardened). Live DB **untouched** — correct.
- **Bookkeeping:** **SAN-860 / SAN-861 / SAN-862 do not exist in Linear** (ghost IDs). Real issue: **SAN-546** (now Done). Retitle `SAN-860-j15-pin-clear-local.spec.ts` when convenient.

**Bottom line:** PR train unblocked (#145 merged, #146 draft open). P0 remains **SAN-178 · PAY-001** (live-money decision) and **SAN-116 · PAY-003** tracker drift (Linear Done vs identical webhook secrets in env).

---

**Verdict: B+ (~85%) at audit time · still directionally correct after verification.**

## Post-merge corrections (2026-06-09 evening)

| Original audit claim | Verified now |
|----------------------|--------------|
| PR #145 open, floor red | ❌ **Stale** — #145 **merged**; floor SUCCESS |
| SAN-492 branch unpushed | ❌ **Stale** — **PR #146** draft, 2 commits (`1b10550` trigger fix) |
| SAN-546 In Progress | ❌ **Stale** — Linear **Done** |
| J15 broken on prod | 🟡 **Re-verify** after #145 deploy |
| Flip Stripe to live (only path) | ⚠️ **Nuance** — Path A test-mode sign-off OR Path B live keys |

## Findings that still matter

1. **SAN-860 · SAN-861 · SAN-862 — ghost IDs** → real work is **SAN-546 · OPS-JOURNEY — Lucía: Prod journey matrix J05–J20 (rentals, venues, maps, mobile)**. PR #145 title still uses ghost IDs; `Closes SAN-546` may not have fired — verify link on SAN-546.
2. **SAN-116 · PAY-003 — Stripe webhook secret isolation** — Linear **Done**, but `.env.local` still has **identical** `STRIPE_WEBHOOK_SECRET` and `STRIPE_SPONSOR_WEBHOOK_SECRET`. Tracker drift; reopen or rotate sponsor secret.
3. **SAN-178 · PAY-001 — Live ticket purchase on production** — partial prod proof filed; Linear should be **In Progress**, not Todo.
4. **Mixed working tree on `main`** — Mastra/search WIP still needs its own branch (LESSONS.md).

## Test results (2026-06-09)

| Check | Result |
|-------|--------|
| Vitest | 🟢 778/778 (point-in-time; CLAUDE.md "445+" stale) |
| Playwright prod J05–J20 | 🟡 8 pass · 4 fail · 4 skip — re-run J15 post-#145 |
| Prod Tier 1 chat-smoke | 🟢 all checks passed |
| PR #145 floor | 🟢 SUCCESS (merged) |
| Supabase live | 🟢 49 published events · 31 manual orphans · 0 venue partners · SAN-492 tables absent · 6 `bookings` RLS policies |

## Per-task scorecard (full names)

| Task | Status | Grade | Ready % | Go/No-Go |
|------|--------|-------|--------:|----------|
| **SAN-546 · OPS-JOURNEY — Lucía: Prod journey matrix J05–J20 (rentals, venues, maps, mobile)** (was SAN-860/861/862 ghosts) | 🟢 Merged #145 | B+ | 90% | Re-verify J15 on prod |
| **SAN-178 · PAY-001 — Live ticket purchase on production** | 🟡 Partial | B | 75% | Path A sign-off OR Path B live Stripe |
| **SAN-116 · PAY-003 — Stripe webhook secret isolation** | 🔴 Tracker drift | C | 50% | Re-audit env; distinct sponsor `whsec` |
| **SAN-492 · EVT-033 — Event venue + offerings schema** | 🟡 Draft PR #146 | B+ | 88% | **No-Go prod apply** until ERD + RLS smoke |
| **SAN-858 · DATA-QUALITY — Events ownership classification** | 🟡 Option A drafted | B+ | 90% | Product sign-off → close |
| **SAN-510 · EVT-051 — Wire: Event offerings panel + Event Venue CTA** | 🟢 Wire on disk | A− | 95% | In Review → user Done |
| **SAN-511 · EVT-052 — Wire: Request proposal modal** | 🟢 Wire on disk | A− | 95% | In Review → user Done |
| **SAN-135 · AIE-024 — MVP Luma event detail layout (EVP-032)** | 🟡 PR #143 open | A− | 92% | Merge/close #143 → Done |

## Evidence paths

| Task | Evidence |
|------|----------|
| SAN-178 · PAY-001 | `tasks/testing/evidence/2026-06-09/SAN-178-RESULTS.md` |
| SAN-492 · EVT-033 | `tasks/testing/evidence/2026-06-09/SAN-492-RESULTS.md` · `SAN-492-PR146-AUDIT.md` · [PR #146](https://github.com/amo-tech-ai/mdeapp/pull/146) |
| SAN-858 · DATA-QUALITY | `tasks/testing/evidence/2026-06-09/SAN-858-CLASSIFICATION.md` |
| SAN-510/511 wires | `tasks/testing/evidence/2026-06-09/SAN-510-511-WIRE-RESULTS.md` |

## Exact next order (updated)

1. **Re-run prod J15** (pin clear) after #145 deploy — **SAN-546 · OPS-JOURNEY — Lucía: Prod journey matrix J05–J20**
2. **SAN-178 · PAY-001 — Live ticket purchase on production** — choose Path A (sign-off test-mode proof) or Path B (live Stripe + `cs_live_*` evidence) → unblocks **SAN-115 · AIE-001 — Core production proof ledger (MVP launch gate)**
3. **SAN-116 · PAY-003 — Stripe webhook secret isolation** — rotate distinct sponsor test webhook; fix Infisical/Vercel/Supabase; reconcile Linear Done vs env
4. **SAN-492 · EVT-033 — Event venue + offerings schema** — ERD sign-off on draft **PR #146** → staging apply → RLS smoke → then **SAN-493 · EVT-034 — Seed Mamacita + 5 event partners**
5. **SAN-858 · DATA-QUALITY — Events ownership classification** — record Option A sign-off; close
6. **SAN-510 · EVT-051** + **SAN-511 · EVT-052** — user flips Done (wires complete; evidence attached)
7. **SAN-135 · AIE-024 — MVP Luma event detail layout (EVP-032)** — merge or close **PR #143** → Done
8. **Quarantine `main` WIP** (Mastra/search edits) onto a named branch

## Launch impact

Prod is healthy. Andrés journey works in **test mode only**. Silent risks: ghost ID traceability, **SAN-116** false Done, unpushed WIP on `main`. Nothing new on fire since #145/#146 landed.
