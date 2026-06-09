---
title: PR remediation — Progress Task Tracker
updated: 2026-06-02T23:45Z
verified_against: mdeapp origin/main bf40ef9 = Vercel Production
prod_url: https://www.mdeai.co
evidence: ../testing/evidence/
archive: ./archive/README.md
---

# Progress Task Tracker — `tasks/PR`

**Verification run:** 2026-06-02 · **`main` / prod SHA `bf40ef9`** · [Vercel Production deploy](https://www.mdeai.co) matches `origin/main`.

| Proof | Result |
|-------|--------|
| `git rev-parse origin/main` | `bf40ef9` |
| GitHub Production deployment | `bf40ef9` @ 2026-06-02T23:40:37Z |
| `GET https://www.mdeai.co/` | **200** |
| `POST /api/copilotkit` (empty body) | **400** (runtime alive) |
| `.github/workflows/floor.yml` on main | **yes** · last run **success** |
| `main` branch protection | **404** — not configured |
| PR **#38** SEARCH-002 | **OPEN** |
| Scheduled prod synthetic (SAN-462) | **1/3** green (scheduled run 2026-06-02) |

**Status legend:** 🟢 Completed · 🟡 In Progress · ⚪ Not Started · 🟥 Blocked

---

## Executive rollup

| Workstream | Tasks | 🟢 Done | 🟡 Active | ⚪ / 🟥 Open | **% Complete** | Production-ready? |
|------------|------:|--------:|----------:|-------------:|---------------:|:-----------------|
| **PR remediation (PR-01–18)** | 18 | 15 | 1 | 2 | **86%** | 🟡 CI yes; merge gate no |
| **UX Stable Beta (`ux/`)** | 14 | 9 archived | 0 | 5 (4 + 1 deferred) | **64%** shipped / **0%** refinement | 🟡 Soak blocks UX-023 |
| **DATA pack (35 + PR archive)** | 35 | 28 | 2 | 5 | **80%** | 🟢 P0 data · 🟡 app sync |
| **AUTH open** | 3 | 0 | 0 | 3 | **25%** | 🟥 E2E + prod checklist |
| **Stable Beta gate (SAN-462)** | 1 | — | 1 | — | **33%** (1/3 soak) | 🟥 Need 2 more scheduled greens |
| **Phase 1 product surfaces** | 8 | 4 | 2 | 2 | **~55%** | See § Product surfaces |

**Overall PR remediation + soak sign-off:** 🟡 **~84% code shipped** · 🟥 **not production-signed** until SAN-462 **3/3** + PR-16 branch protection + post-soak UX-023.

---

## A. PR remediation train (archived + active)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|----------------------|----------------|
| **PR-01** | Events search try/catch guard | 🟢 Completed | 100% | Merged #34; on `4de18f1` | — | None — [`archive/tasks/`](archive/tasks/PR-01-search-events-trycatch.md) |
| **PR-02** | Hoist `ConciergeCoAgentProvider` | 🟢 Completed | 100% | #41 on prod | — | Archived |
| **PR-03** | `sessionKey` remount boundary | 🟢 Completed | 100% | #41 on prod | — | Archived |
| **PR-04** | C1 migrations (DATA-048) | 🟢 Completed | 100% | #40 · `check-migration-timestamps.mjs` | — | Archived |
| **PR-05** | C2 edge functions from #23 | 🟢 Completed | 100% | #42 on prod | — | Archived |
| **PR-06** | C3 seeds from #23 | 🟢 Completed | 100% | #43 on prod | — | Archived |
| **PR-07** | C4 rollbacks + docs | 🟢 Completed | 100% | #44 on prod | — | Archived |
| **PR-08** | DATA-050 restore_post_mvp gate | 🟢 Completed | 100% | SAN-445 Done | — | Archived |
| **PR-09** | Close #23 + supersede | 🟢 Completed | 100% | #23 closed | — | Archived |
| **PR-10** | #31 Vercel Analytics | 🟢 Completed | 100% | `vercel-analytics-client.tsx` on main | — | Archived |
| **PR-11** | Close obsolete #19/#20 | 🟢 Completed | 100% | SAN-461 Done | — | Archived |
| **PR-12** | #35 anon Maps key warn | 🟢 Completed | 100% | #46 on prod | — | Archived |
| **PR-13** | Split hotfix pile | 🟢 Completed | 100% | SAN-447 | — | Archived |
| **PR-14** | Remove wave-1 worktrees | 🟢 Completed | 100% | SAN-448 | — | Archived |
| **PR-17** | Migration filename lint | 🟢 Completed | 100% | Script in repo; shipped #40 | — | Archived |
| **PR-16** | Floor + review on `main` | 🟡 In Progress | **70%** | `floor.yml` ✅ · Floor run success · evidence [`PR-16-floor-ci-prep.md`](../testing/evidence/PR-16-floor-ci-prep.md) | **`main` not protected** (GH 404) | Admin: require **`Floor / floor`** + 1 review — [`docs/16-branch-protection.md`](docs/16-branch-protection.md) |
| **PR-18** | SHA-pin GitHub Actions | ⚪ Not Started | 0% | Spec on disk | Depends on soak policy | After **SAN-462** · SAN-460 |
| **PR-15** | ADK smoke script audit (Phase 2) | ⚪ Not Started | 0% | — | Phase 2 only | Backlog SAN-444 |

---

## B. Stable Beta & operations

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|----------------------|----------------|
| **SAN-462** | 3× scheduled prod synthetic soak | 🟡 In Progress | **33%** | 1/3 scheduled PASS [run 26820069434](https://github.com/amo-tech-ai/mdeapp/actions/runs/26820069434) | 2 more **scheduled** greens required | Wait ~09:00 UTC ×2; ignore manual-only runs |
| **PR-16 admin** | Enforce floor on merge | 🟡 In Progress | **0%** (settings) | CI check exists | No branch protection | GitHub Settings → branch rules |
| **Prod deploy parity** | Vercel = `main` | 🟢 Completed | 100% | SHA `bf40ef9` match | — | None |
| **Maps billing** | GCP Maps API billing | 🟥 Blocked | N/A | Bootstrap script 200 | `BillingNotEnabledMapError` in console (infra) | Enable billing on Maps project — not app code |
| **Embed API 403** | Rental query embeddings | 🟡 In Progress | N/A | Search still returns | `[query-embedding] 403` in logs | Fix embed API key / quota — non-blocking |

---

## C. UX — Camila chat / map / cards

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|----------------------|----------------|
| **UX-010** | Unified result card architecture | 🟢 Completed | 100% | Wave-1 shipped | — | [`archive/ux/`](archive/ux/UX-010-unified-result-card-architecture.md) |
| **UX-028** | Place card fallback upgrade | 🟢 Completed | 100% | On prod | — | Archived |
| **UX-032** | New chat → thread + map reset | 🟢 Completed | 100% | PR-02/03 #41 | — | Archived |
| **UX-034** | Prod synthetic concierge monitor | 🟢 Completed | 100% | Nightly workflow | — | Archived |
| **UX-020** | `CardInteractionProps` types | 🟢 Completed | 100% | #45 · tests on main | — | Archived |
| **UX-006/007/009/017** | Superseded / canceled stubs | 🟢 Completed | 100% | Redirect only | — | Do not execute |
| **UX-023** | Result card shell (runtime) | ⚪ Not Started | 0% | Spec ready | **Blocked by SAN-462** | Start after 3/3 soak — SAN-437 |
| **UX-024** | Hover ↔ pin parity | ⚪ Not Started | 0% | — | Not shipped | After UX-023 |
| **UX-029** | Retire `GroundedPlaceCard` | ⚪ Not Started | 0% | — | Legacy card may still exist | After UX-023 |
| **UX-033** | Clear stale AdvancedMarkers | ⚪ Not Started | 0% | — | SAN-323 open | After soak |
| **UX-018** | ADK grounding URL (Vercel) | ⚪ Not Started | 0% | Deferred Phase 2 | ADK not Phase 1 | PR-15 / Phase 2 |

**Real-world (Camila):** On prod, `/chat` and `/rentals` respond (auth **307** when logged out — expected). Concierge can show rental/event/café/restaurant cards after wave-1; refinement cards (UX-023) not started.

---

## D. DATA + search + intelligence (`tasks-data/`)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|----------------------|----------------|
| **DATA pack P0** | Venue seeds + M1–M3 + trips DDL | 🟢 Completed | 100% | Live DB: cafés 17, restaurants 44, RPCs | — | [`../data/archive/`](../data/archive/README.md) |
| **DATA-048** | Migration prefix realign | 🟢 Completed | 100% | #40 @ `4de18f1` | — | [`archive/tasks-data/`](archive/tasks-data/) |
| **DATA-050** | Base-table backfill gate | 🟢 Completed | 100% | B1–B4 on prod | — | Archived |
| **DATA-041** | venue_signals + seed | 🟡 In Progress | 90% | 30 rows live | Human QA top 30 | Close QA → archive |
| **DATA-028** | Booking → `trip_items` sync | 🟥 Blocked | 0% | DDL + bridge exist | App webhook not wired | Implement upsert webhook |
| **DATA-007/008** | Places cache + backfill | 🟥 Blocked | 0% | Specs | **MAP-005** | Unblock maps proxy first |
| **SEARCH-001** | Rental hybrid **app** wiring | ⚪ Not Started | 15% | RPC `hybrid_search_listings` live | No app fast-path | SAN-386 — not soak train |
| **SEARCH-002** | Events hybrid **app** UI | ⚪ Not Started | 15% | RPC live · PR **#38 OPEN** | Fast-path UI not on main | Merge #38 after soak policy |
| **AI-003/004** | Signals + grounding verify | ⚪ Not Started | 0% | Specs | Phase 1b | Post Stable Beta |
| **DATA-046** | Golden queries v2 | ⚪ Not Started | 0% | Spec | Phase 1b | SAN-384 |
| **DATA-013–018** | Events P2 schema | ⚪ Not Started | 0% | Inventories | Phase 2 DDL | Deferred |
| **AUTH-005** | Playwright auth E2E | ⚪ Not Started | 0% | Spec Ready | No suite green | Add Playwright auth smoke |
| **AUTH-009** | JWT → RequestContext | ⚪ Not Started | 0% | Spec Ready | Not wired | Implement middleware context |
| **AUTH-011** | Production auth checklist | ⚪ Not Started | 0% | Spec Ready | Checklist open | Run pre-launch auth audit |

---

## E. Product surfaces — personas & screens

| Surface | Persona | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|---------|---------|-------------|--------|---|--------------|----------------------|----------------|
| **`/`** | All | Marketing / entry | 🟢 Completed | 90% | Prod **200** | — | — |
| **`/login`**, **`/signup`** | All | Auth entry | 🟡 In Progress | 70% | Routes **200** | AUTH-005/011 open | Playwright + prod checklist |
| **`/chat`** | Camila, Tourist | Concierge + CopilotKit | 🟡 In Progress | 75% | `conciergeAgent` · runtime **400** POST | UX-023 shell; SEARCH-002 open | Soak → UX-023 |
| **`/rentals`** | Camila | Rental search + map | 🟡 In Progress | 70% | Page + search API | SEARCH-001 app wire deferred | Post-soak wiring |
| **`/host/event/new`** | Roberto | Event wizard (HITL) | ⚪ Not Started | 25% | Route exists (**307** auth) | W3–W4 tools/HITL not Phase-1 complete | `hostEventAgent` + form-fill tools |
| **`/host/events`** | Roberto | Host dashboard | ⚪ Not Started | 10% | — | Not in app router scan | W4+ backlog |
| **`/admin/*`** | Patricia | Ops dashboards | ⚪ Not Started | 0% | — | **No `src/app/admin`** | W8 backlog |
| **`/trips`**, **`/saved`** | Camila | Trips / saved | 🟡 In Progress | 40% | Routes exist | DATA-028 sync blocked | Webhook → trip_items |
| **`/events/[slug]`** | Andrés | Event detail | 🟡 In Progress | 50% | Route exists | Checkout W9 | Stripe train |
| **`/me/tickets`** | Andrés | Ticket wallet | 🟡 In Progress | 40% | Route exists | Payment flow W9 | Stripe webhooks |
| **Mastra Studio** | Sofía | Local agent debug | 🟢 Completed | 100% | `:4111` in dev | — | Local only |
| **`/api/copilotkit`** | Platform | AG-UI runtime | 🟢 Completed | 95% | Prod POST ≠ 5xx | — | Monitor soak |

---

## F. AI agents, automations & workflows

| Component | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|-----------|-------------|--------|---|--------------|----------------------|----------------|
| **CopilotKit runtime** | Next ↔ Mastra AG-UI | 🟢 Completed | 95% | `route.ts` · prod alive | POST storm guarded (#30) | Soak monitor |
| **conciergeAgent** | Multi-intent chat (rentals/events/places) | 🟡 In Progress | 70% | Agent + tools on main | SEARCH-002 UI open | Merge #38 when allowed |
| **rentalAgent / eventAgent** | Vertical agents | 🟡 In Progress | 60% | Registered in Mastra | Full routing W5+ | MIS routing tasks |
| **pingAgent** | W1 foundation | 🟢 Completed | 100% | CoAgent sample | — | — |
| **hostEventAgent** | Roberto wizard | ⚪ Not Started | 20% | Planned W3–W4 | HITL tools empty | F03+ event tools |
| **Working memory / F13** | Thread persistence | 🟡 In Progress | 50% | LibSQL + schemas | Prod cold-start gaps | F13 `ai_runs` path |
| **Prod synthetic workflow** | Nightly concierge smoke | 🟡 In Progress | 33% | 1/3 scheduled | 2 runs pending | SAN-462 |
| **Floor workflow** | lint·tsc·build·test·audit | 🟢 Completed | 100% | `floor.yml` green | Not required on merge yet | PR-16 admin |
| **ADK grounding** | Phase 2 URL service | ⚪ Not Started | 0% | UX-018 deferred | Not in mdeapp | PR-15 audit |

---

## G. Production readiness checklist

| Gate | Status | % | Proof |
|------|--------|---|-------|
| Code on `main` = Production | 🟢 | 100% | SHA `bf40ef9` |
| `npm run floor` green | 🟢 | 100% | CI + local |
| Required check on `main` | 🟥 | 0% | Branch not protected |
| 3× prod synthetic soak | 🟡 | 33% | 1/3 SAN-462 |
| Auth production sign-off | 🟥 | 25% | AUTH-011 open |
| Stable Beta UX refinement | ⚪ | 0% | UX-023–033 |
| Intelligence / hybrid search UI | ⚪ | 15% | RPCs only; #38 open |
| Admin / host wizard MVP | ⚪ | 20% | Routes partial; features W3–W8 |

**Verdict:** 🟡 **Shipped to production for wave-1 concierge + data remediation** · 🟥 **Not Stable Beta signed off** — finish soak, branch protection, then UX-023 train.

---

## H. Priority queue (dependency-ordered)

1. **SAN-462** — 2 more scheduled prod synthetics (no feature PRs during soak).
2. **PR-16** — GitHub branch protection: **`Floor / floor`** + 1 review.
3. **UX-023 → 024 → 029 → 033** — post-soak Camila refinement.
4. **AUTH-005** → **AUTH-011** — production auth confidence.
5. **SEARCH-002 / #38** — events fast-path (explicitly after soak policy).
6. **PR-18** — SHA-pin Actions (SAN-460).
7. **DATA-028** — trip_items webhook (commerce bridge).

---

*Sources: [`INDEX.md`](./INDEX.md) · [`LINEAR.md`](./LINEAR.md) · [`archive/README.md`](./archive/README.md) · [`tasks-data/INDEX-data.md`](./tasks-data/INDEX-data.md) · live checks 2026-06-02.*
