---
title: tasks.md forensic audit vs skills + MCP
auditor: task-verifier protocol
date: 2026-06-03
method: CLAUDE.md → skills (copilotkit, mastra, gemini, mde-supabase, shadcn, mde-maps) → disk probes → Supabase/evidence cross-check
sources_probed:
  - tasks.md (prod_sha bf40ef9)
  - mdeapp/package.json (@copilotkit/* 1.55.2, @mastra/* beta)
  - vitest 488/488 (2026-06-03)
  - git log: 269c436 VEN-012, bf2599d VEN-021, 3772d79 VEN-020, 84fc187 SEARCH-003
  - sitemap.md, plan.md, venue/trip INDEX files
  - tasks/notes/audit-linear.md (Linear sync 58%)
overall_queue_correctness: 62%
overall_status_accuracy: 54%
production_readiness_discovery_beta: 🟡
production_readiness_commerce_exit: 🔴
---

> **Summary:** Forensic audit of `tasks.md` rows vs disk, prod, and skills — scores each queue item and flags gaps (F13, embed 403, stale statuses).

# tasks.md forensic audit — skills + MCP alignment

> **Question:** Is the operator queue correct, complete, and production-ready?  
> **Answer:** Ordering and dependency **rules are mostly right**, but **status columns are stale** (3 shipped venue tasks still marked open/blocker). **SEARCH-003 Done but absent.** **Two exit tracks** (Discovery Beta vs Commerce Exit) are not labeled — conflicts with `plan.md` Tier 1A. **Discovery beta:** 🟡 ship-with-gaps OK after SAN-462 + prod browser proof. **Full MVP exit:** 🔴 Stripe sequence still required.

## Dot legend

| Dot | Meaning |
|-----|---------|
| 🟢 | Done / accurate / production-ready for stated scope |
| 🟡 | Partially correct, in progress, or minor spec drift |
| ⚪ | Not started — queue entry OK |
| 🔴 | Wrong status, blocker mislabeled, or missing critical task |
| ⏸ | Correctly deferred |

**% correct** = weighted average of (1) queue placement & deps, (2) spec/skill/MCP alignment, (3) `tasks.md` status vs disk today. Not the same as implementation %.

---

## Summary table (all active queue rows)

| # | Task | Queue % | Status accuracy | Combined % | Dot | Prod ready | Top issue |
|--:|------|--------:|----------------:|-----------:|:---:|------------|-----------|
| 1 | SAN-462 | 90 | 35 | **62** | 🟡 | 🟡 | Soak 1/3 — gate for rows 8–13 |
| 2 | AUTH-011 | 85 | 40 | **62** | 🟡 | 🟡 | Prod login/signup checklist open |
| 3 | DATA-041 | 100 | 100 | **100** | 🟢 | 🟢 | Done — evidence 2026-06-03 |
| 4 | DATA-008 | 80 | 40 | **60** | 🟡 | 🟡 | Places backfill 403 — Google billing/key |
| 5 | PR-16 | 85 | 70 | **78** | 🟡 | 🟡 | Branch protection partial |
| 6 | MAP-008B | 90 | 50 | **70** | 🟡 | 🟡 | `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` prod verify |
| 7 | MAP-002B | 85 | 30 | **58** | 🟡 | 🔴 | ADK grounding on prod unproven |
| 8 | SEARCH-002 | 75 | 40 | **58** | 🟡 | 🟡 | **Wrong Linear:** SAN-388 = SEARCH-003 |
| 9 | UX-023 | 85 | 90 | **88** | ⚪ | ⚪ | Correctly queued post-soak |
| 10 | UX-024 | 80 | 90 | **85** | ⚪ | ⚪ | Depends UX-023 |
| 11 | UX-029 | 80 | 90 | **85** | ⚪ | ⚪ | Retire duplicate card — valid |
| 12 | UX-033 | 75 | 85 | **80** | ⚪ | ⚪ | Ghost pins — valid P1 |
| 13 | PR-18 | 90 | 90 | **90** | ⚪ | ⚪ | SHA-pin Actions — valid defer |
| 14 | VEN-009 | 90 | 88 | **89** | 🟡 | 🟡 | Restaurant cards — polish left |
| 15 | VEN-010 | 90 | 90 | **90** | 🟡 | 🟡 | Panel shipped; enrichment thin |
| 16 | VEN-011 | 70 | 35 | **52** | 🟡 | 🟡 | Intent spec understates shipped classifier |
| 17 | VEN-012 | 95 | **25** | **55** | 🔴 | 🟢 | **STALE:** merged #48 — still 🟥 in tasks.md |
| 18 | VEN-013 | 75 | 50 | **62** | 🟡 | 🟡 | Panel exists; spec says 5% |
| 19 | SCREEN-023 | 80 | 60 | **70** | 🟡 | 🔴 | No `/restaurants/page.tsx` on disk |
| 20 | SCREEN-022 | 85 | 55 | **70** | ⚪ | 🟡 | Blocked claim stale post-VEN-012 |
| 21 | VEN-014 | 85 | 62 | **74** | 🟡 | 🟡 | Cache layer OK; fill rate low |
| 22 | VEN-015 | 90 | 85 | **88** | 🟡 | 🟡 | Schema + RLS — verify tests |
| 23 | VEN-017 | 90 | 80 | **85** | 🟡 | 🟡 | Form shipped |
| 24 | VEN-021 | 95 | **30** | **58** | 🔴 | 🟢 | **STALE:** Done #53 — queue shows 75% 🟡 |
| 25 | VEN-019 | 95 | 90 | **93** | ⚪ | ⚪ | HITL — correctly after persist |
| 26 | VEN-020 | 95 | **10** | **48** | 🔴 | 🟢 | **STALE:** Done #55 — queue shows 0% ⚪ |
| 27 | VEN-022 | 90 | 90 | **90** | ⚪ | ⚪ | WA draft — valid defer |
| 28 | VEN-023 | 90 | 90 | **90** | ⚪ | ⚪ | Patricia outbox — valid |
| 29 | VEN-024 | 90 | 90 | **90** | ⚪ | ⚪ | Admin queue — valid |
| 30 | VEN-025 | 95 | 90 | **93** | ⚪ | ⚪ | RLS pen tests — required pre-ship |
| 31 | VEN-026 | 85 | 55 | **70** | 🟡 | 🟡 | Idempotency partial |
| 32 | VEN-027 | 90 | 90 | **90** | ⚪ | ⚪ | WA consent — valid |
| 33 | VEN-028 | 90 | 90 | **90** | ⚪ | ⚪ | Error recovery — valid |
| 34 | VEN-029 | 90 | 70 | **80** | 🟡 | 🟡 | Registry CI exists — needs green proof |
| 35 | VEN-030 | 90 | 90 | **90** | ⚪ | ⚪ | Audit log — valid defer |
| 36 | VEN-031 | 90 | 40 | **65** | 🟡 | 🟡 | Playwright gate — deps outdated |
| 37 | SCREEN-005 + SEARCH-001 | 85 | 25 | **55** | 🔴 | 🔴 | `/rentals` redirects to `/chat` — 🟥 correct |
| 38 | SCREEN-017 | 85 | 90 | **88** | 🟡 | 🟡 | Auth polish — reasonable |
| 39 | EVP-014 | 80 | 90 | **85** | ⚪ | ⚪ | Host list — valid defer |
| 40 | SCREEN-010 | 85 | 90 | **88** | ⚪ | ⚪ | Map exploration — valid |
| 41 | SCREEN-018 | 85 | 55 | **70** | 🟡 | 🟡 | Mobile shell partial |
| 42 | MOB-CK-001 | 85 | 60 | **72** | 🟡 | 🟡 | CK mobile baseline |
| 43 | MOB-CHAT-001 | 90 | 90 | **90** | ⚪ | ⚪ | Keyboard — valid |
| 44 | MAP-011-M | 90 | 90 | **90** | ⚪ | ⚪ | Single map instance — valid |
| 45 | MOB-CARD-001 | 85 | 90 | **88** | ⚪ | ⚪ | Carousel — valid |
| 46 | AIM-010 | 80 | 90 | **85** | ⚪ | ⚪ | Mobile AI UX — valid |
| 47 | AUTH-006 | 85 | 90 | **88** | ⚪ | ⚪ | Mobile OAuth — valid |
| 48 | AUTH-009 | 70 | 90 | **80** | ⚪ | 🔴 | **Under-prioritized** — JWT→Mastra before VEN-019 |
| 49 | INT-003 | 75 | 15 | **45** | ⚪ | 🔴 | Rental clarify broken vs fast-path |
| 50 | INT-004 | 80 | 90 | **85** | ⚪ | ⚪ | Anti-canned-clarify — valid |
| D1 | PAY-001 | 90 | 70 | **80** | ⏸ | 🟡 | Correctly deferred; code ~70% |
| D2 | PAY-003 | 90 | 40 | **65** | ⏸ | 🟡 | Webhook isolation partial |
| D3 | EVT-002 | 85 | 85 | **85** | ⏸ | 🟡 | Publish prod — mostly shipped |
| D4 | EVT-001 | 90 | 90 | **90** | ⏸ | 🔴 | Ledger/sign-off — 0% |
| D5 | PAY-005 | 90 | 90 | **90** | ⏸ | ⚪ | Mobile checkout — valid defer |
| T1 | TRIP-001 | 90 | 25 | **58** | ⚪ | ⚪ | Audit spec OK; low disk progress |
| T2 | TRIP-002 | 85 | 35 | **60** | 🟡 | 🟡 | Dashboard shell partial |
| T3 | TRIP-003 | 90 | 90 | **90** | ⚪ | ⚪ | Create modal — valid |
| T4 | TRIP-004 | 85 | 30 | **58** | 🟡 | 🟡 | Workspace shell partial |
| T5 | TRIP-005 | 85 | 25 | **55** | 🟡 | 🟡 | Itinerary tab partial |
| T6 | TRIP-006 | 85 | 40 | **62** | 🟡 | 🟡 | `/saved` LIVE needs polish |
| T7 | TRIP-007 | 90 | 90 | **90** | ⚪ | ⚪ | Add-to-trip — valid |
| T8 | TRIP-008 | 95 | 90 | **93** | ⚪ | ⚪ | Correct MAP-008B dep |
| T9 | TRIP-009 | 90 | 90 | **90** | ⚪ | ⚪ | Conflict HITL — valid |
| T10 | TRIP-010 | 95 | 90 | **93** | ⏸ | ⏸ | Stripe + T7 dep — correct |
| T11 | TRIP-013 | 95 | 90 | **93** | ⚪ | ⚪ | Reconciliation worker — ship gate |
| T12 | TRIP-014 | 95 | 90 | **93** | ⚪ | ⚪ | RLS pen — ship gate |
| T13 | TRIP-015 | 90 | 90 | **90** | ⚪ | ⚪ | Places cache hydration |
| T14 | TRIP-016 | 85 | 90 | **88** | ⚪ | ⚪ | Mobile workspace |
| T15 | TRIP-017 | 90 | 90 | **90** | ⚪ | ⚪ | Observability |
| T16 | TRIP-018 | 85 | 90 | **88** | ⚪ | ⚪ | Lifecycle states |
| T17 | TRIP-019 | 90 | 90 | **90** | ⚪ | ⚪ | Retry/optimistic UI |
| T18 | TRIP-011 | 95 | 90 | **93** | ⚪ | ⚪ | Playwright ship gate |
| T19 | TRIP-012 | 90 | 90 | **90** | ⚪ | ⚪ | Prod smoke |

### Missing from queue (should appear)

| Task | Combined % | Dot | Why add |
|------|----------:|:---:|---------|
| **SEARCH-003** | **100** | 🟢 | Done 2026-06-03 — must be in Done section; unblocks INT-008 |
| **F13** thread / `ai_runs` persistence | **55** | 🔴 | Cold-start memory loss — in plan.md not tasks.md |
| **DATA-EMBED** (embed API 403) | **50** | 🟡 | Hybrid search degraded; logs show 403 — PROGRESS-TRACKER only |
| **Prod journey matrix J05–J20** | **70** | 🟡 | `09-prod-live-journey-matrix.md` — operational gate tied to SAN-462 |

**Pack rollup**

| Section | Avg combined % | Dot |
|---------|---------------:|:---:|
| Platform 1–7 | **70** | 🟡 |
| UX 8–13 | **81** | 🟡 |
| Venues 14–36 | **72** | 🟡 |
| Other screens 37–40 | **79** | 🟡 |
| Mobile 41–47 | **85** | ⚪ |
| Auth/agents 48–50 | **70** | 🟡 |
| Deferred Stripe D1–D5 | **82** | ⏸ |
| Trips T1–T19 | **78** | ⚪ |
| **Overall queue document** | **62** | 🟡 |

---

## Production readiness verdict

| Track | Dot | Rationale |
|-------|:---:|-----------|
| **Discovery Beta** (Stripe deferred per `tasks.md`) | 🟡 | Chat + venue booking spine largely on `main`; vitest 488/488; prod curl smoke PASS. Blockers: SAN-462 3/3, AUTH-011 prod, MAP-002B grounding prod, `/rentals` redirect, tasks.md stale statuses confuse operators. |
| **Commerce MVP exit** (`plan.md` Tier 1A PAY→EVT) | 🔴 | Andrés paid ticket + Roberto prod publish + EVT-001 ledger unsigned — correctly ⏸ but plan still claims ~78% exit. |
| **Venues MVP stop** (rows 14–36 rule) | 🟡 | VEN-012/021/020 **already merged** — stop condition closer than queue shows. Remaining: VEN-031 Playwright green, VEN-025 RLS pen, prod browser proof, SCREEN-023 page. |
| **Trips Phase 2** | ⚪ | Correctly gated after venues; data layer Done (DATA-026–030). |

---

## Skills + MCP alignment

### CopilotKit (`copilotkit` / `copilotkit-develop`)

| Check | Result |
|-------|--------|
| Version pin 1.55.2 | ✅ `package.json` — no v2 mix |
| Agent name match | ✅ `conciergeAgent` in provider + Mastra |
| HITL pattern | ✅ `renderAndWaitForResponse` on host wizard; **VEN-019 not wired** for booking |
| POST storm | 🟡 Guarded (#30) — monitor via SAN-462 soak |
| MCP | CopilotKit MCP flaky per CLAUDE.md — fall back to `CopilotKit/examples/integrations/mastra/` |

**Task gaps:** VEN-019 spec correctly cites `copilotkit-develop` + `copilotkit-agui`; AUTH-009 should precede user-scoped HITL (row 48 too late in queue vs row 25).

### Mastra (`mastra`)

| Check | Result |
|-------|--------|
| Agents on `FLASH_MODEL` | ✅ `gemini-3.5-flash` via `@ai-sdk/google` |
| Tool registry | ✅ VEN-018 Done; VEN-029 CI partial |
| `@mastra/pg` beta | 🟡 Acceptable Phase 1; probe before F13 Postgres memory |
| Integration surface | ✅ CopilotKit in-process via `getLocalAgentsWithLogging` — not HTTP `/chat` alone |

**Missing task:** **F13** (`ai_runs`, thread persistence, cold-start) — archived under `tasks/archive/core/` but **not in operator queue**.

### Gemini (`gemini`)

| Check | Result |
|-------|--------|
| Production model | ✅ `gemini-3.5-flash` in `models.ts` |
| Env var | ✅ `GOOGLE_GENERATIVE_AI_API_KEY` (not deprecated aliases) |
| Embed API | 🔴 `query-embedding.ts` 403 — hybrid path disabled; no queue row |
| MCP | Re-verify model IDs via `gemini-api-docs-mcp` before new agent work |

### Supabase (`mde-supabase`)

| Check | Result |
|-------|--------|
| `venue_signals` | ✅ 30 rows; RLS anon read OK (DATA-041) |
| `venue_booking_requests` | ✅ POST `/api/venue-booking/request` uses user-scoped client — not service role in route |
| Service-role carve-out | ✅ Only `/api/copilotkit`, `/api/threads` pattern per CLAUDE.md |
| RLS pen tests | ⚪ VEN-025 / TRIP-014 queued — **required before ship** |

### shadcn (`shadcn`)

| Check | Result |
|-------|--------|
| Booking form stack | ✅ RHF + Zod + shadcn Field (VEN-017) |
| `ResultCardShell` (UX-023) | ⚪ Not started — duplicate cards risk (LESSONS) |
| DESIGN.MD tokens | 🟡 Venue panels OK; UX debt on card primitives |

### Maps (`mde-maps`)

| Check | Result |
|-------|--------|
| `mapId` on `<Map>` | ✅ `getGoogleMapsMapId()` — prod unset → undefined (fail-safe) |
| Field mask on Places | 🟡 VEN-014 wired; cache 2.7% fill — DATA-008 blocked on Google 403 |
| MCP workflow | ✅ Use `retrieve-instructions` first — tasks reference this in VEN-014 spec |
| AdvancedMarker | ✅ Requires mapId — MAP-008B is correct P0 |

---

## Red flags (🔴)

1. **Status drift — three shipped tasks still open in `tasks.md`**
   - VEN-012 🟥 → merged `269c436` (#48)
   - VEN-021 🟡 75% → Done `bf2599d` (#53)
   - VEN-020 ⚪ 0% → Done `3772d79` (#55)

2. **SEARCH-003 Done but omitted** — breaks DATA-041 → SEARCH-003 → INT-008 chain visibility.

3. **Linear mislink row 8** — SEARCH-002 points to SAN-388; evidence shows SAN-388 closed for SEARCH-003.

4. **Two-track conflict undocumented** — `plan.md` Tier 1A (Stripe first) vs `tasks.md` Stripe ⏸ — operators will pick wrong sequence.

5. **VEN-019 `unblocks: [VEN-020]` in spec** — VEN-020 shipped without HITL; dependency graph stale.

6. **`/rentals` redirect** — Camila P0 surface is a redirect; row 37 🟥 accurate but **under-prioritized** vs venue polish.

7. **Embed API 403** — degrades hybrid rental + restaurant search; logged non-blocking but **no owned task**.

8. **AUTH-009 at row 48** — JWT→Mastra context should move **before VEN-019** (user-scoped booking HITL).

---

## Failure points & blockers

| Blocker | Persona | Surface | Fix |
|---------|---------|---------|-----|
| SAN-462 soak incomplete | Sofía | CI / prod | 3/3 synthetic chat smoke before UX rows 8–13 |
| MAP-002B ADK prod | Tourist | `/chat` grounded | Verify ADK env on Vercel; journey J05 |
| Google Places 403 | Sarah | Detail panels | Enable Places API (New) + billing on server key (DATA-008) |
| `/restaurants` page missing | Tourist | `/restaurants` | SCREEN-023 — API live, no `page.tsx` |
| Rental surface redirect | Camila | `/rentals` | SCREEN-005 + SEARCH-001 — P0 regression |
| F13 cold-start | Camila | `/chat` turn 11+ | Add F13 to platform section |
| VEN-031 deps stale | Lucía | CI | Update gate: VEN-012/021/020 Done → run Playwright |
| EVT-001 ledger | Patricia | sign-off | Commerce track only |

---

## Critical fixes (do first)

1. **Patch `tasks.md` statuses** — VEN-012 → 🟢/🟡 Done, VEN-021/020 → 🟢 Done; add SEARCH-003 to Done section; fix SAN-388 link on row 8.
2. **Add two-track header** — "Discovery Beta (active)" vs "Commerce Exit (deferred D1–D5)" — align with `plan.md` footnote.
3. **Reorder AUTH-009** — move to row ~7b or before VEN-019 (JWT before HITL booking).
4. **Add queue rows:** F13, DATA-EMBED (or sub-bullet under DATA-008), prod journey matrix execution.
5. **SAN-462** — complete 3/3 soak (unblocks UX 8–13 honestly).
6. **SCREEN-023** — `/restaurants/page.tsx` (API exists at `/api/restaurants/search`).
7. **Update VEN-031 stop rule** — remove "VEN-012 blocked" language; require browser proof on prod for nightlife routing.

---

## Suggested improvements & best practices

| Area | Recommendation |
|------|----------------|
| **Operator queue hygiene** | Re-probe disk before every `%` / dot update; treat `status:` in specs as hint only (task-verifier §2). |
| **Done sections** | Mirror `tasks/data/archive/` and venue evidence SHAs in `tasks.md` Done tables — prevents SEARCH-003-class omissions. |
| **Linear sync** | One SAN-* per task ID; grep Linear title vs repo task_id (VEN-021 vs SAN-304 note is a precedent). |
| **Dependency graphs** | When shipping out of order (VEN-020 before VEN-019), patch spec `unblocks` / `depends_on` same commit. |
| **MCP-first** | Maps tasks: `retrieve-instructions` before coding; Gemini: `search_docs` before new model IDs; Supabase: MCP SQL for row counts in evidence. |
| **Release gates** | Keep VEN-031 + TRIP-011 as Playwright ship gates; pair with `09-prod-live-journey-matrix.md` for persona journeys. |
| **Phase 1 language** | English-only — no Spanish placeholders in new specs. |
| **Commit discipline** | Status doc updates in parent repo after mdeapp merges — small commits per C-### row. |

---

## Per-section notes

### Platform (1–7)

Queue order is sound for Discovery Beta: soak → auth → data → CI → maps. **Missing F13** and **embed 403** are the main completeness gaps. DATA-041 correctly 🟢.

### Venues (14–36)

**Dependency rule "persist before HITL" is correct** and was followed on disk (021 before 019). **Phase order** (UI → cache → booking → HITL → hardening → e2e) matches skills. Main failure is **stale operator view**, not wrong architecture.

### Trips (T1–T19)

INDEX alignment ✅ — no new MVP tables, TRIP-013/014 as ship gates, T10 ⏸ on Stripe. Start-after rule (venues MVP + AUTH-011 + MAP-008B) is correct. Spec quality ~78% — T1 audit evidence thin.

### Deferred Stripe (D1–D5)

Correctly ⏸ for Discovery Beta. **Do not delete** — `plan.md` commerce exit still depends on this sequence.

---

## Verification probes (2026-06-03)

| Probe | Result |
|-------|--------|
| `npm test -- --run` | **488/488** pass |
| `@copilotkit/*` version | **1.55.2** |
| `conciergeAgent` + `FLASH_MODEL` | **gemini-3.5-flash** |
| VEN-012 nightlife branch | **`GroundedNightlifeResults`** in `search-tool-renders.tsx` |
| VEN-021 API | **`POST /api/venue-booking/request`** — auth + insert |
| `/restaurants/page.tsx` | **missing** |
| `/rentals/page.tsx` | **redirect `/chat`** |
| SEARCH-003 in tasks.md | **absent** |
| prod_sha in tasks.md | **bf40ef9** |

---

## Persona impact (one line each — active P0)

| Task | Who notices |
|------|-------------|
| SAN-462 | Sofía — merge confidence for chat changes |
| AUTH-011 | Camila — login/signup on phone and desktop prod |
| VEN-012 | Carlos — nightclub query opens nightlife panel not café |
| VEN-021/020 | Sarah — booking saves; chip shows pending on panel |
| SCREEN-005 | Camila — `/rentals` browse instead of redirect |
| MAP-002B | Tourist — grounded places on prod chat |
| F13 (missing) | Camila — thread survives redeploy |

---

*Next audit trigger: after SAN-462 Done + tasks.md status patch + SCREEN-023 ship.*
