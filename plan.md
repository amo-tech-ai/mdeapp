---
title: mdeai — Phase 1 MVP Progress Task Tracker
updated: 2026-06-06T03:30Z
owner: sanjiovani
prod_sha: f8ac95b
prod_url: https://www.mdeai.co
linear: https://linear.app/sanjiovani/project/mdeapp-099cd7795071
initiative: Phase 1 MVP Exit
active_track: Discovery Beta + Design browse polish
deferred_track: Commerce MVP Exit
mvp_dashboard: docs/tasks/MVP-REQUIRED.md
task_index: docs/tasks/INDEX.md
operator_queue: tasks.md
---

# Phase 1 MVP — Progress Task Tracker

> **North star:** Camila on `/` (cards + pins) · Andrés paid ticket · Roberto host publish @ [mdeai.co](https://www.mdeai.co)  
> **Operator queue (ordered tasks):** **[`tasks.md`](tasks.md)** ← start here (includes screen order)  
> **Verified:** `origin/main` = **`f8ac95b`** · VEN-025 prod routing **PASS** · browse nav live  
> **Also:** [`docs/tasks/design/notes/notes-11.md`](docs/tasks/design/notes/notes-11.md) · [`todo.md`](todo.md) · [`docs/tasks/PR/PROGRESS-TRACKER.md`](docs/tasks/PR/PROGRESS-TRACKER.md)

## Release tracks (do not conflate)

| Track | Status | What it measures | Operator source |
|-------|--------|------------------|-----------------|
| **Discovery Beta** | **Active** | Chat, venues, maps, auth soak, prod journeys | [`tasks.md`](tasks.md) rows 1–50 |
| **Commerce MVP Exit** | **Deferred** | PAY-001 → PAY-003 → EVT-002 → EVT-001 | [`tasks.md`](tasks.md) rows D1–D5 |

> **Conflict resolver:** Operator may defer Commerce Exit sequence while Discovery Beta remains active. Sequence **1A below** applies only when reopening the commerce track — not to daily Discovery Beta work.

| Dot | Status |
|-----|--------|
| 🟢 | Complete — functional + evidenced on prod or archived |
| 🟡 | In progress — partial ship or awaiting sign-off |
| 🟥 | Blocked / failed — missing dependency or prod failure |
| ⚪ | Not started — planned, needs implementation |

---

## Executive rollup (2026-06-06)

| Area | % | Dot | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next action |
|------|--:|:---:|--------------|----------------------|----------------|
| **Design browse UX** | **92%** | 🟢 | SAN-518/586/584/587/575 on prod; cafés nav #89 | VEN-035 PR #91; rentals nav (SAN-478) | Merge #91 → DATA-041 |
| **Foundation (F01–F20)** | 100% | 🟢 | Archived IMP-001–078 | — | None |
| **PR remediation train** | 86% | 🟡 | 15/18 archived @ `bf40ef9` | PR-16 branch protection; PR-18 open | GitHub: protect `main` + Floor |
| **Stable Beta soak (SAN-462)** | 33% | 🟥 | 1/3 scheduled prod synthetics | 2 more scheduled greens | Wait 09:00 UTC runs |
| **Discovery Beta readiness** | **72%** | 🟡 | VEN-012/021/020/SEARCH-003 🟢; chat prod smoke | SAN-462 3/3; MAP-002B/008B; `/rentals` redirect | [`tasks.md`](tasks.md) rows 1–50 |
| **Commerce MVP Exit (deferred)** | 55% | ⏸ | EVT-013 cards 🟢; G2 lead 🟢 | PAY-001/003; EVT-002; EVT-001 ledger | Sequence 1A when D-track reopened |
| **CopilotKit + chat UX** | 88% | 🟢 | #41 hoist; wave-1 #35–37; G2d | UX-023 post-soak; UX-033 stale pins | After SAN-462 3/3 |
| **Mastra + Gemini agents** | 85% | 🟢 | `conciergeAgent` gemini-3.5-flash; 7 agents; roadmap 95/100 | Phase 0 SAN-589→591 not started | [`docs/tasks/mastra/plan/index-mastra.md`](docs/tasks/mastra/plan/index-mastra.md) |
| **Google Maps + ADK grounding** | 74% | 🟡 | MAP-007B layout; MAP-009 cluster; vis.gl | Billing error; dual mobile map; MAP-002B/008B prod | [`wireframes/audit/02-maps-audit.md`](docs/tasks/wireframes/audit/02-maps-audit.md) |
| **Supabase DATA pack** | 80% | 🟢 | 26 specs archived; RLS 113/114 | DATA-028 trips sync; DATA-008 backfill | Close DATA-041 QA |
| **pgvector / hybrid search** | 85% | 🟢 | **SEARCH-003 🟢** (SAN-388 Done); hybrid RPC + signals | SEARCH-002 #38 open; embed 403; SEARCH-001 app | SAN-387 / PR #38 after soak |
| **Mobile wireframes (M1–M4)** | 40% | 🟡 | MAP-007 sheet partial | SCREEN-018 dvh; MOB-CHAT-001 | [`wireframes/mobile/index-mobile.md`](docs/tasks/wireframes/mobile/index-mobile.md) |
| **Auth production** | 40% | 🟡 | F08 login; AUTH-001–010 archived | AUTH-011 checklist; HaveIBeenPwned off | SAN-367 |
| **OpenClaw / VPS agents** | 5% | ⚪ | Hostinger docs only | Phase 2 — not MVP | Defer |

**Discovery Beta readiness: ~72%** — venues spine largely shipped; **not signed off** until SAN-462 3/3 + AUTH-011 + MAP prod gates + VEN-031 + prod journeys J05–J20.

**Commerce MVP Exit readiness: ~55%** — **deferred**; **not signed off** until Sequence 1A (PAY→EVT) + EVT-001 ledger. Do not block Discovery Beta on this track.

---

## Master implementation order

Execute **top → bottom** per active track. **`‖`** = parallel OK when upstream started.

```text
TIER 0 — SHIPPED 🟢 (do not re-execute)
  Foundation F01–F20 · G2 lead capture · PR-01–14, PR-17 · DATA-001–007, 009–012, 019–021, 023, 026–030, 034–035, 039–040, 047, 048, 050
  DATA-041 · SEARCH-003 · VEN-012 · VEN-021 · VEN-020 · UX-001/002/003/005/006/008/009/010/028/032/034 archived
  Browse stack: SAN-586 → SAN-518 → SAN-584 (events nav) → SAN-587 (re-skin) → SAN-584 cafés nav (#89) @ 7db2282

DESIGN / BROWSE — ACTIVE (see notes-11.md)

  DB-0 Browse polish
      VEN-035 (#91 e2e)  →  DATA-041 (Patricia QA)  ‖  SAN-589 (Mastra telemetry)

DISCOVERY BETA — ACTIVE (see tasks.md rows 1–50)

  DB-1 Platform gates (‖ each other where noted)
      SAN-462 (3/3 soak)  ‖  AUTH-011  ‖  MAP-002B  ‖  MAP-008B  ‖  PR-16
      F13 thread persistence  ‖  DATA-EMBED (403)  ‖  OPS-JOURNEY J05–J20

  DB-2 Stable Beta UX (after SAN-462 3/3)
      SEARCH-002 (#38 / SAN-387)  →  UX-023 → UX-024/029  ‖  UX-033

  DB-3 Venues MVP
      VEN-009…013  ‖  SCREEN-023/022  →  VEN-014  →  AUTH-009  →  VEN-019 HITL
      → hardening (VEN-025…)  →  VEN-031 Playwright gate

  DB-4 Other + mobile + intel
      SCREEN-005/SEARCH-001 (/rentals)  ‖  SCREEN-017  ‖  mobile M1–M4  ‖  INT-003/004

  DB-5 Trips Phase 2 (after venues stop + AUTH-011 + MAP-008B)
      TRIP-001…019 (T10 ⏸ until commerce reopened)

COMMERCE MVP EXIT — DEFERRED (tasks.md D1–D5; reopen explicitly)

  1A Commerce + host (STRICT ORDER — only when D-track active)
      PAY-001  →  PAY-003  →  EVT-002  →  EVT-001

TIER 4+ — MAPS DEPTH / PHASE 2+ (post exit)
  MAP-005…023 · OpenClaw · ADK on Vercel · DATA-013–018 · VEB · coffee tours
```

### Plain English — what each P0 task means

| # | Task | One sentence | Linear | Project |
|--:|------|--------------|--------|---------|
| 1 | **PAY-001** | Andrés buys a real ticket on production; Stripe marks it paid and the QR shows in wallet | [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) | Core Foundation |
| 2 | **PAY-003** | Ticket and sponsor Stripe webhooks use different secrets so payments can't cross-wire | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) | Core Foundation |
| 3 | **EVT-002** | Roberto finishes the host wizard on production and the event row lands in Supabase | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | Events Platform |
| 4 | **EVT-001** | Patricia signs the MVP proof ledger once commerce + host proofs are green | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | Platform Infrastructure |
| 5 | **SAN-462** | Three nightly automated prod chat checks pass in a row (Stable Beta soak) | [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) | Core Foundation |
| 6 | **AUTH-011** | Login, signup, and Supabase auth env vars are verified on production Vercel | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) | Core Foundation |
| 7 | **MAP-002B** | Café/rental AI grounding sidecar runs on Cloud Run and prod chat can call it | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | Core Foundation |
| 8 | **MAP-008B** | Real Google Map ID is set on Vercel so pins render (no DEMO_MAP_ID warning) | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) | Core Foundation |
| 9 | **PR-16** | GitHub blocks merges to `main` unless Floor CI + review pass | [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) | Core Foundation |
| 10 | **SEARCH-002** | Merge PR #38 so hybrid event search results show in the app UI | [SAN-387](https://linear.app/sanjiovani/issue/SAN-387) | Platform Infrastructure |
| — | **SEARCH-003** | Hybrid restaurant search + venue_signals (Done) | [SAN-388](https://linear.app/sanjiovani/issue/SAN-388) | Platform Infrastructure |
| 11 | **UX-023** | All result cards share one shell component (after soak gate) | [SAN-437](https://linear.app/sanjiovani/issue/SAN-437) | Platform Infrastructure |

---

## Linear project audit (2026-06-02)

Linear **default sort is `updatedAt`**, not implementation order. Use **`data-order:*` / `pr-order:*` / `int-seq:*` labels** or run `node scripts/linear-sort-todo.mjs` after edits.

| Project / view | URL | Order OK? | Findings |
|----------------|-----|:---------:|----------|
| **Core Foundation** | [issues](https://linear.app/sanjiovani/project/core-foundation-3a69b76c57ca/issues) | 🟢 Yes | Sorted via `linear-sort-core-foundation.mjs` — PAY-001 first, SYS post-MVP at bottom. |
| **DATA view** | [data](https://linear.app/sanjiovani/view/data-54425dec37b9) | 🟢 Yes | `data-order:01→16` matches plan Tier 0 chain. Active tail: **DATA-008** (order 14) In Review — correct next DATA task. Post-MVP **DATA-013+** correctly Backlog. |
| **Discovery Platform** | [issues](https://linear.app/sanjiovani/project/discovery-platform-23d24b177348/issues) | 🟢 Yes | Bodies fixed for **SAN-105/106** (MAP-005/006); sorted MAP-010→011 chain. SAN-463/464 Duplicate → Core SAN-368/369. |
| **Venues** | [issues](https://linear.app/sanjiovani/project/venues-b003fe68b767/issues) | 🟢 Yes | MVP venue DATA work largely **Done** (DATA-001–007). **VEN-014b** hotfix Done. Remaining VEN-* correctly **Phase 2** — defer until EVT-001 🟢. |
| **Platform Infrastructure** | [issues](https://linear.app/sanjiovani/project/platform-infrastructure-099cd7795071/issues) | 🟢 Yes | **SAN-115** (EVT-001) pinned #1 Todo via `linear-sort-todo.mjs`. PR issues mostly Done at bottom. |

### Status mismatches vs `plan.md` (fix in Linear)

| Issue | Linear status | Plan truth | Action |
|-------|---------------|------------|--------|
| **SAN-100** OPS-002 | Duplicate | Superseded by **UX-034** + **SAN-462** | ✅ Marked Duplicate of SAN-462 (2026-06-03) |
| **SAN-407/406** INT-004/003 | Todo | Code not shipped; INT-005 Done | ✅ Moved Todo + blocker notes (2026-06-03) |
| **SAN-463/464** | Duplicate | Canonical = **SAN-368/369** in Core | No action — correct |
| **EVT-002 SAN-366** | Todo | 85% — wizard on prod, needs publish proof | Matches plan |
| **OPS-002 vs SAN-462** | Two issues | **SAN-462** = active soak gate; **SAN-100** = old F32 matrix | Do not execute both — track soak on SAN-462 only |

### Recommended Core Foundation manual order (drag in Linear)

```text
1  SAN-178  PAY-001          (strict #1 — blocks EVT-001)
2  SAN-116  PAY-003          (strict #2)
   SAN-366  EVT-002          (Events project — strict #3)
3  SAN-462  soak gate        (‖ parallel once PAY started)
4  SAN-367  AUTH-011        (‖)
5  SAN-368  MAP-002B         (‖)
6  SAN-369  MAP-008B         (‖)
7  SAN-458  PR-16            (‖)
—— Done / soak-wait ——
8  SAN-460  PR-18            (after 3/3 soak)
9  SAN-112  UX-012            (login polish — Tier 2)
—— Done at bottom ——
   SAN-322 UX-034 · SAN-339/340 DATA-010/011 · SAN-404–405 INT-001/002 · SAN-408 INT-005 · SAN-459 PR-17
—— Post-MVP bottom ——
   SAN-95/96 SYS-001/002
```

**`plan.md` verification:** Tier order, prod SHA (`bf40ef9`), test count (488), and path migrations are **correct**. Only clarifications added above: **SAN-462 ≠ SAN-100**, Discovery **title/body drift**, INT review ordering.

---

## TIER 0 — Foundation & shipped gates

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|-------------------|----------------|
| F01–F20 core | Next.js, CopilotKit, Mastra, Supabase, auth shell | 🟢 | 100% | [`docs/tasks/archive/`](docs/tasks/archive/README.md) | — | None |
| G2 lead capture | Camila schedule viewing + lead row | 🟢 | 100% | G2 evidence; UX-010 | — | None |
| PR-01–14, PR-17 | Remediation train (migrations, hoist, #23 close) | 🟢 | 100% | [`docs/tasks/PR/archive/`](docs/tasks/PR/archive/README.md) @ `bf40ef9` | — | None |
| DATA P0 venue | Café/restaurant/nightclub seeds + security | 🟢 | 100% | 26 archived specs | — | None |
| UX wave-1 | Photos, new chat, prod synthetic CI | 🟢 | 100% | #35–#37 on prod | — | None |

---

## TIER 1A — Commerce + host (MVP exit blockers)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|-------------------|----------------|
| **PAY-001** | Andrés live Stripe → `paid` + wallet QR | 🟡 | 70% | Checkout session works locally | Prod end-to-end proof | Manual prod ticket purchase — SAN-178 |
| **PAY-003** | Distinct webhook secrets (sponsor vs platform) | 🟥 | 40% | Webhook route exists | Identical secrets flagged | Rotate + audit — SAN-116 |
| **EVT-013** | Event cards in chat + buy CTA | 🟢 | 100% | SCREEN-006 3/3; fast-path merged | — | None |
| **EVT-002** | Roberto HITL publish → Supabase row | 🟢 | 100% | Done 2026-06-04; wizard on prod | Optional regression refresh | — |
| **EVT-001** | MVP exit ledger (G1+G2+G3) | 🟥 | 0% | Spec on disk | Blocked on PAY + EVT-002 | Sign ledger after 1A — SAN-115 |

**Spec paths:** [`docs/tasks/events/docs/tasks/`](docs/tasks/events/docs/tasks/) · PAY via [`todo.md`](todo.md)

---

## TIER 1B — Platform prod sign-off (parallel)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|-------------------|----------------|
| **SAN-462** (soak gate) | 3× scheduled prod synthetic smoke (replaces OPS-002/SAN-100) | 🟡 | 33% | UX-034 workflow shipped; 1/3 PASS 2026-06-02 | 2 scheduled greens needed | Wait nightly runs — [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) |
| **PR-16** | Floor CI + branch protection on `main` | 🟡 | 70% | `floor.yml` green; 488 tests | GH branch protection 404 | Admin: require Floor + review — SAN-458 |
| **AUTH-011** | Production auth checklist + evidence | 🟡 | 40% | Partial evidence file | HaveIBeenPwned OFF; checklist open | Close SAN-367 — [`data/tasks-data/AUTH-011-production-auth-checklist.md`](docs/tasks/data/tasks-data/AUTH-011-production-auth-checklist.md) |
| **MAP-002B** | ADK grounding on prod (Cloud Run → Vercel) | ⚪ | 30% | Local ADK invoke works | Prod URL / sidecar verify | Deploy + env — SAN-368 |
| **MAP-008B** | `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` on Vercel | 🟡 | 50% | `getGoogleMapsMapId()` guard in code | Prod Map ID + billing | Vercel env + GCP billing — SAN-369 |
| **PR-18** | SHA-pin GitHub Actions | ⚪ | 0% | Spec on disk | Post-soak policy | After SAN-462 — SAN-460 |

---

## TIER 1C — AI stack (CopilotKit · Mastra · Gemini · tools)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|-------------------|----------------|
| **CopilotKit runtime** | `/api/copilotkit` + provider + thread nav | 🟢 | 95% | POST 400 alive on prod; #41 merged | POST storm guard ongoing | Monitor CK budget e2e |
| **conciergeAgent** | Gemini 3.5 Flash + working memory | 🟢 | 90% | Agent + tools on `main` | JWT user context missing | AUTH-009 |
| **Search tools** | rentals / events / restaurants / grounded places | 🟢 | 85% | Vitest + fast paths | Event UI #38 open | Merge SEARCH-002 |
| **Host wizard agent** | Roberto `/host/event/new` HITL tools | 🟡 | 85% | Wizard + tools shipped | Prod publish row proof | EVT-002 |
| **ADK grounding client** | `search_grounded_places` → sidecar | 🟡 | 75% | Local invoke + café fallback | Prod ADK URL (MAP-002B) | SAN-368 |
| **Grounding quota** | `grounding_quota_log` daily cap | 🟢 | 100% | Supabase table + increment | — | None |
| **Web grounding events** | Fresh event citations sidecar | 🟢 | 80% | Tool + tests | — | None |
| **Mastra workflows** | rental/event discovery workflows | 🟡 | 35% | 3 workflows exist | Not primary `/` path | Phase 1b — [`mastra/progress-mastra.md`](docs/tasks/mastra/progress-mastra.md) |
| **Gemini models** | Production = Gemini only | 🟢 | 100% | `gemini-3.5-flash` in agent | Embed API 403 in logs | Fix embedding key (non-blocking) |

---

## TIER 1C — Maps · Places · responsive chat

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|-------------------|----------------|
| **MAP-001/007B** | Mindtrip 3-column + mobile sheet | 🟢 | 90% | Playwright mobile/desktop specs | Dual hidden map on mobile | MAP-AUDIT-001 — audit doc |
| **MAP-008/009** | mapId + AdvancedMarker + clustering | 🟢 | 85% | vis.gl + clusterer ≥4 pins | BillingNotEnabledMapError | GCP billing enable |
| **Places proxy** | `/api/places/detail` + cache | 🟡 | 70% | Route + field masks live | MAP-005 full edge spine open | Partial — Next.js proxy OK for MVP |
| **MAP-002B** | Prod ADK for Tourist grounding | ⚪ | 30% | See 1B | — | — |
| **SCREEN-018** | Mobile shell (drawer, FAB, dvh) | 🟡 | 55% | Components on disk | dvh/safe-area; 3/8 PW tests | [`wireframes/mobile/018-scr-mobile-responsive-shell.md`](docs/tasks/wireframes/mobile/018-scr-mobile-responsive-shell.md) |
| **UX-023** | ResultCardShell card unification | ⚪ | 10% | Spec in wireframes/ux | Not on disk; blocked soak | After SAN-462 — SAN-437 |
| **UX-033** | Clear stale AdvancedMarkers | ⚪ | 0% | Spec | Overlaps MAP-AUDIT | SAN-323 |

**Audit:** [`docs/tasks/wireframes/audit/02-maps-audit.md`](docs/tasks/wireframes/audit/02-maps-audit.md)

---

## TIER 1D — Supabase · DATA · pgvector (active backlog)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|-------------------|----------------|
| **DATA pack (archived)** | Seeds, migrations, golden queries, RLS | 🟢 | 100% | 26 specs in [`data/archive/`](docs/tasks/data/archive/README.md) | — | None |
| **DATA-041** | venue_signals + human QA | 🟡 | 90% | 30 rows live | Editorial sign-off | Close QA sheet |
| **DATA-028** | Orders/showings → `trip_items` sync | 🟥 | 0% | DDL + bridge live | Webhook not writing trip_items | After PAY-001 — [`data/tasks-data/data-028-booking-trip-item-sync.md`](docs/tasks/data/tasks-data/data-028-booking-trip-item-sync.md) |
| **DATA-008** | Places backfill cron | 🟡 | 40% | Partial evidence | Cron not fully wired | Priority after cache audit |
| **SEARCH-002** | Hybrid events app UI (#38) | 🟡 | 60% | RPC + tool on main | PR #38 open | Merge after soak |
| **SEARCH-001** | Hybrid rentals app wiring | ⚪ | 0% | RPC live | `/rentals` shell broken | SAN-386 |
| **SEARCH-003** | Hybrid restaurants | 🟢 | 100% | Smoke + fast path | — | None |
| **VEC-001 / embeddings** | HNSW + backfill | 🟢 | 95% | ~95% backfilled | Embed 403 intermittent | Fix API key |
| **AUTH-005** | Playwright auth E2E | ⚪ | 0% | Spec ready | P2 — not launch gate | Post-MVP |
| **AUTH-009** | JWT → Mastra RequestContext | ⚪ | 0% | Spec ready | Tools lack user id | P1 after AUTH-011 |

**Index:** [`docs/tasks/data/tasks-data/INDEX-data.md`](docs/tasks/data/tasks-data/INDEX-data.md)

---

## TIER 1E — UX active (`docs/tasks/wireframes/ux/`)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|-------------------|----------------|
| **UX-023** | ResultCardShell + card primitives | ⚪ | 10% | Spec moved to wireframes | No `base-result-card.tsx` | Post-soak M0 |
| **UX-024** | Hover → pin parity | ⚪ | 0% | Spec | Blocked UX-023 | After UX-023 |
| **UX-029** | Retire GroundedPlaceCard | ⚪ | 0% | Spec | Blocked UX-023 | After UX-023 |
| **UX-033** | Stale marker cleanup | ⚪ | 0% | Spec | — | SAN-323 |
| **UX-018** | ADK URL on Vercel | ⚪ | 0% | Deferred | Phase 2 ADK | SAN-444 backlog |

**Archived UX (9):** [`docs/tasks/PR/archive/ux/`](docs/tasks/PR/archive/ux/)

---

## TIER 2 — Mobile MVP (`docs/tasks/wireframes/mobile/`)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|-------------------|----------------|
| **SCREEN-018** | Mobile 3-panel shell | 🟡 | 55% | MAP-007 FAB + sheet | dvh, safe-area, 8/8 PW | Finish shell — SAN-521 |
| **MOB-CK-001** | CopilotKit mobile baseline | 🟡 | 60% | Partial patterns | 44px send, viewportFit | SAN-521 |
| **MOB-CHAT-001** | Composer + keyboard UX | ⚪ | 0% | Spec | — | SAN-522 |
| **MAP-011-M** | Mobile map interactions | ⚪ | 0% | Spec + maps audit | Single map instance | SAN-524 |
| **MOB-CARD-001** | Mobile card system | ⚪ | 0% | Spec | — | SAN-525 P1 |
| **PAY-005** | Mobile checkout + QR ticket | ⚪ | 0% | Spec | — | SAN-526 after MOB-CHAT |
| **AUTH-006** | Mobile OAuth Safari | ⚪ | 0% | Spec | — | SAN-527 P1 |
| **PERF/PWA/A11Y** | Performance, install, a11y audit | ⚪ | 0% | Specs | **Phase 2** — not MVP | Defer |

**Critical path:** SCREEN-018 → MOB-CK-001 → MOB-CHAT-001 → MAP-011 → PAY-005

---

## TIER 3 — Intelligence program (post-core MVP)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|-------------------|----------------|
| **INT-001–005** | CORE ranking + signals pipeline | 🟡 | 45% | SAN-404–408 in Core Foundation | Full INT program ~45% | [`intelligence/intelligence-plan.md`](docs/tasks/intelligence/intelligence-plan.md) |
| **AI-003/004** | Signal enrichment + grounding verify | ⚪ | 0% | Specs in tasks-data | Phase 1b | SAN-395/396 |
| **DATA-046** | Golden queries v2 | ⚪ | 0% | Spec | Phase 1b | SAN-384 |
| **MIS-M1 gate** | Restaurant hybrid + venue_signals | 🟢 | 91% | SEARCH-003 smoke ✅ | Patricia editorial ☐ | Human QA sign-off |

---

## TIER 4+ — Post-MVP (defer until EVT-001 🟢)

| Track | Status | Index |
|-------|:------:|-------|
| Maps depth (MAP-005→023) | ⚪ | [`docs/tasks/maps/INDEX.md`](docs/tasks/maps/INDEX.md) |
| Venues MVP (VEN-009…) | ⚪ | [`docs/tasks/venues/INDEX.md`](docs/tasks/venues/INDEX.md) |
| Trips app (TRIP-001…) | ⚪ | [`docs/tasks/trips/docs/tasks/INDEX.md`](docs/tasks/trips/docs/tasks/INDEX.md) |
| Real estate (RE-001…) | ⚪ | [`docs/tasks/real-estate/docs/tasks/INDEX.md`](docs/tasks/real-estate/docs/tasks/INDEX.md) |
| Events ADV schema | ⚪ | DATA-013–018 in [`data/tasks-data/`](docs/tasks/data/tasks-data/) |
| **OpenClaw / VPS** | ⚪ | [`docs/tasks/openclaw/index-ocl.md`](docs/tasks/openclaw/index-ocl.md) — **Phase 2 only** |
| CopilotKit v2 migration | ⚪ | Phase 2 per CLAUDE.md |

---

## Persona journey readiness (prod @ `bf40ef9`)

| Persona | Journey | Example | Status | % | 💡 Next |
|---------|---------|---------|--------|--:|---------|
| **Camila** | Rental search + map pins | “1BR Laureles under $80” | 🟢 | 95% | — |
| **Camila** | Café grounding + pins | “specialty coffee Laureles” | 🟢 | 90% | MAP billing |
| **Tourist** | Restaurant fast path | “suggest restaurants medellin” | 🟢 | 90% | — |
| **Tourist** | Events browse catalog | `/events` grid + nav | 🟢 | 95% | — |
| **Tourist** | Cafés browse + nav | `/cafes` + sidebar | 🟢 | 95% | VEN-035 #91 |
| **Andrés** | Buy ticket → wallet QR | Stripe checkout | 🟡 | 70% | PAY-001/003 |
| **Roberto** | Host publish event | `/host/event/new` HITL | 🟢 | 100% | SAN-366 Done |
| **Patricia** | Admin / ops | `/admin/*` shells | ⚪ | 30% | W8+ |
| **Sofía** | CI + floor + soak | SAN-462 + PR-16 | 🟡 | 65% | 2/3 synthetics + branch rules |

---

## Production readiness checklist

| Gate | Status | Evidence |
|------|:------:|----------|
| `main` = Vercel Production | 🟢 | SHA `7db2282` |
| Browse `/events` + `/cafes` prod | 🟢 | GET 200; nav links live |
| VEN-035 venue release e2e | 🟡 | PR #91 floor ✅ |
| Vitest floor | 🟢 | 488/488 @ 2026-06-03 |
| CopilotKit runtime | 🟢 | POST `/api/copilotkit` 400 (alive) |
| Prod synthetic 4-query matrix | 🟡 | UX-034 workflow; **1/3** scheduled |
| Branch protection + Floor required | 🟥 | GH 404 |
| Paid ticket prod proof | 🟥 | PAY-001 |
| MVP ledger EVT-001 | 🟥 | Blocked |
| Auth prod checklist | 🟡 | AUTH-011 40% |
| Maps billing + Map ID prod | 🟡 | MAP-008B / console billing error |
| Mobile prod parity | 🟥 | SCREEN-018 incomplete |

**Discovery Beta (active track)?** 🟡 **Desktop chat + venues spine yes** · soak + maps prod + VEN-031 + journeys incomplete  
**Commerce MVP Exit (deferred track)?** 🔴 **No** — Sequence 1A + EVT-001 ledger incomplete  
**Full combined declaration?** 🔴 **No** — both tracks must be green for Patricia EVT-001 sign-off

---

## Doc map (corrected paths after folder moves)

| Need | File |
|------|------|
| **Ordered task queue** | [`tasks.md`](tasks.md) |
| **Implementation playbook** | [`docs/tasks/notes/1/improve.md`](docs/tasks/notes/1/improve.md) |
| **Forensic tracker / Linear audit** | [`plan.md`](plan.md) |
| **Slim task index + tiers** | [`docs/tasks/INDEX.md`](docs/tasks/INDEX.md) |
| **MVP operator dashboard** | [`docs/tasks/MVP-REQUIRED.md`](docs/tasks/MVP-REQUIRED.md) |
| **Live P0 checklist** | [`todo.md`](todo.md) |
| **Forensic rollup** | [`docs/tasks/progres.md`](docs/tasks/progres.md) |
| **PR train tracker** | [`docs/tasks/PR/PROGRESS-TRACKER.md`](docs/tasks/PR/PROGRESS-TRACKER.md) |
| **DATA active specs** | [`docs/tasks/data/tasks-data/INDEX-data.md`](docs/tasks/data/tasks-data/INDEX-data.md) |
| **UX active specs** | [`docs/tasks/wireframes/ux/README.md`](docs/tasks/wireframes/ux/README.md) |
| **Mobile specs** | [`docs/tasks/wireframes/mobile/index-mobile.md`](docs/tasks/wireframes/mobile/index-mobile.md) |
| **Screen / wire hub** | [`docs/tasks/wireframes/screens/INDEX.md`](docs/tasks/wireframes/screens/INDEX.md) |
| **Maps audit** | [`docs/tasks/wireframes/audit/02-maps-audit.md`](docs/tasks/wireframes/audit/02-maps-audit.md) |
| **Mastra / MIS** | [`docs/tasks/mastra/progress-mastra.md`](docs/tasks/mastra/progress-mastra.md) |
| **Sitemap (route truth)** | [`sitemap.md`](sitemap.md) |
| **Machine queue** | [`docs/tasks/linear/mvp-queue.json`](docs/tasks/linear/mvp-queue.json) |

### Path migrations (2026-06-02)

| Was | Now |
|-----|-----|
| `docs/tasks/PR/ux/` | `docs/tasks/wireframes/ux/` |
| `docs/tasks/PR/tasks-data/` | `docs/tasks/data/tasks-data/` |
| `docs/tasks/data/docs/tasks/AUTH-*` | `docs/tasks/data/tasks-data/AUTH-*` |
| `docs/tasks/screens/` (shell) | `docs/tasks/wireframes/screens/` (+ legacy symlinks in `docs/tasks/screens/`) |

---

## Linear sync

```bash
cd /home/sk/mdeai
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
node scripts/linear-build-implementation-order.mjs
node scripts/linear-sort-core-foundation.mjs      # Core Foundation P0 order
node scripts/linear-sort-discovery-platform.mjs   # MAP-010 → MAP-005 → … chain
node scripts/linear-sort-todo.mjs                 # Platform Infrastructure Todo
```

**Views:** [MVP EXECUTION](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) · [DATA](https://linear.app/sanjiovani/view/data-54425dec37b9) · [Core Foundation](https://linear.app/sanjiovani/project/core-foundation-3a69b76c57ca/issues) · [Discovery Platform](https://linear.app/sanjiovani/project/discovery-platform-23d24b177348/issues) · [Venues](https://linear.app/sanjiovani/project/venues-b003fe68b767/issues) · [Platform Infrastructure](https://linear.app/sanjiovani/project/platform-infrastructure-099cd7795071/issues)

*Last verified: 2026-06-06 (browse stack ship) · Owner: sanjiovani · Prod SHA: `7db2282`*
