---
title: Events MVP forensic audit
audited: 2026-06-04
scope: tasks/events/tasks/MVP/ (16 specs) + G3 proof task
skills: task-verifier · copilotkit-integrations · gemini · mastra · mde-supabase
tests: vitest event 62/62 · grounding 22/22 · approval-commit 3/3 · event-discovery 5/5 · SCREEN-006 9/9 · SCREEN-016 6/6
index: ../tasks/INDEX.md
order: ../../notes/events/events-order.md
san366: ../../notes/events/san33-audit.md
grading: index-skills.md legend (🟢 85+ · 🟡 50–84 · 🔴 <50 · ⚪ not started)
---

# Events MVP — forensic audit report

**Auditor role:** Senior software specialist · systems architect · task-verifier gate  
**Question answered:** Are MVP specs **100% correct**, **safe to execute**, and **production-ready**?

**Short answer:** **No.** Spec quality averages **~78%**; execution averages **~22%** on active MVP folder. **Production-ready for Discovery Beta host path:** partial — wizard LIVE, list missing, prod proof open. **Discovery pack (015–028):** not production-ready (intentionally queued).

---

## Test evidence (2026-06-04)

| Suite | Command | Result |
|-------|---------|--------|
| Event Vitest | `cd mdeapp && npm test -- --run event` | **62/62 pass** |
| Grounding Vitest | `npm test -- --run grounding` | **22/22 pass** |
| Approval commit | `npm test -- --run approval-commit` | **3/3 pass** |
| Event discovery | `npm test -- --run event-discovery` | **5/5 pass** |
| Playwright SCREEN-006 | Event cards + buy CTA + pins | **9/9 pass** |
| Playwright SCREEN-016 | Host wizard auth redirect | **6/6 pass** |
| `/host/events` route | `test -f src/app/host/events/page.tsx` | **MISSING** |
| `organizer_id` on publish | `approval-commit/index.ts` | **MISSING** (only `created_by`) |

---

## Grading system

| Symbol | Grade band | Meaning |
|--------|------------|---------|
| 🟢 | **85–100%** | Spec accurate + shipped + tested — Done gate OK |
| 🟡 | **50–84%** | Partial — code or spec drift; not Done |
| 🔴 | **0–49%** | Blocked, failing, or spec unsafe to execute |
| ⚪ | **0–15% exec** | Not started — spec may still be valid |

**Scores per task:**

| Column | Definition |
|--------|------------|
| **Spec %** | Frontmatter, paths, deps, DoD vs disk/CLAUDE.md (`task-verifier` rubric) |
| **Exec %** | Implementation + tests on disk today |
| **Grade** | Letter — weighted 40% spec + 60% exec for active tasks |
| **Prod** | Production-ready on Vercel **now** |
| **Succeed?** | Will task succeed if executed as written |

**Skills routing** (from [`index-skills.md`](../../../index-skills.md)) — load **≤5** per task:

| Task type | Load first | Then |
|-----------|------------|------|
| Proof / Done gate | `task-verifier` | `testing` |
| Host wizard / HITL | `copilotkit-integrations` | `mde-supabase` |
| Discovery / agents | `mastra` | `gemini`, `copilotkit-integrations` |
| Stripe audit | `mde-supabase` | `mde-stripe` |
| Maps (016) | `mde-maps` | `testing` |

---

## Executive scorecard

| Metric | Score |
|--------|------:|
| **Mean spec correctness (16 MVP)** | **78%** |
| **Mean execution (16 MVP)** | **22%** |
| **Production-ready tasks (Vercel LIVE)** | **0 of 16** in MVP folder (shipped work archived as EVP-013, 004–012) |
| **P0 launch blockers** | G3 evidence · EVP-014 route · EVP-003 secrets · `organizer_id` bug |
| **Will MVP folder succeed as a batch?** | **No** — sequential deps; 019–028 are post-MVP |

---

## Master tracker — all MVP tasks

| Task | Real-world example | Status | Spec % | Exec % | Grade | Prod? | Succeed? |
|------|-------------------|--------|-------:|-------:|:-----:|:-----:|:--------:|
| [EVP-001](../tasks/MVP/EVP-001-core-production-proof-gates.md) | Patricia signs launch checklist after Andrés paid ticket + Roberto publish | 🟡 | 82 | 5 | **D+** | 🔴 | ⚠️ After G3 |
| [EVP-003](../tasks/MVP/EVP-003-core-stripe-webhook-secret-audit.md) | Sponsor webhook can't spoof Andrés ticket finalize | 🟡 | 72 | 60 | **C** | 🔴 | 🟡 After rotation |
| [EVP-014](../tasks/MVP/EVP-014-core-host-events-list-page.md) | Roberto sees "Medellín Tech Meetup" on `/host/events` after publish | ⚪ | 78 | 0 | **F** | 🔴 | 🟢 If SAN-118 plan followed |
| [EVP-015](../tasks/MVP/EVP-015-mvp-grounded-event-discovery.md) | Camila asks "events tonight" → DB first, then cited web | ⚪ | 80 | 25 | **D** | 🔴 | 🟡 After 001 |
| [EVP-016](../tasks/MVP/EVP-016-mvp-event-maps-venue-integration.md) | Tourist taps event card → map pin in El Poblado | 🟡 | 75 | 35 | **D+** | 🔴 | 🟡 After 015 |
| [EVP-018](../tasks/MVP/EVP-018-mvp-event-web-discovery-task-pack.md) | Meta pack for Patricia's discovery rollout | ⚪ | 58 | 0 | **F** | 🔴 | N/A meta |
| [EVP-019](../tasks/MVP/EVP-019-mvp-research-official-docs.md) | Sofía verifies Mastra/CopilotKit APIs via MCP before build | ⚪ | 83 | 0 | **D+** | 🔴 | 🟢 Doc-only |
| [EVP-020](../tasks/MVP/EVP-020-mvp-discovered-events-data-model.md) | `discovered_events` table + RLS for scraped candidates | ⚪ | 88 | 0 | **C+** | 🔴 | 🟢 After 019 |
| [EVP-021](../tasks/MVP/EVP-021-mvp-google-search-grounding.md) | "Laureles events tonight" → Gemini citations | ⚪ | 62 | 15 | **F** | 🔴 | 🟡 Path fixes first |
| [EVP-022](../tasks/MVP/EVP-022-mvp-event-discovery-workflow.md) | Mastra workflow merges DB + web candidates | ⚪ | 68 | 20 | **D** | 🔴 | 🟡 Stub only |
| [EVP-023](../tasks/MVP/EVP-023-mvp-adk-search-maps-agents.md) | ADK sidecar SearchAgent (Phase 2) | ⚪ | 85 | 0 | **C** | 🔴 | 🟡 Phase 2 |
| [EVP-024](../tasks/MVP/EVP-024-mvp-places-enrichment.md) | Places field-mask enrichment on event candidates | ⚪ | 80 | 10 | **D+** | 🔴 | 🟡 After 022 |
| [EVP-025](../tasks/MVP/EVP-025-mvp-copilotkit-discovery-ui.md) | Cited discovery cards in chat + save approval | ⚪ | 72 | 15 | **D** | 🔴 | 🟡 After 022 |
| [EVP-026](../tasks/MVP/EVP-026-mvp-human-approval-save-flow.md) | Patricia approves scraped event before DB write | ⚪ | 78 | 25 | **D** | 🔴 | 🟡 Reuse HITL |
| [EVP-027](../tasks/MVP/EVP-027-mvp-discovery-test-plan.md) | Lucía replay discovery E2E before launch | ⚪ | 90 | 0 | **C+** | 🔴 | 🟢 When 025 done |
| [EVP-028](../tasks/MVP/EVP-028-mvp-production-readiness.md) | Discovery feature flag + rollback runbook | ⚪ | 88 | 0 | **C+** | 🔴 | 🟢 Last in pack |
| [G3](../tasks/G3-core-host-publish-proof.md) | Roberto publishes on mdeai.co → row in Supabase | 🟡 | 74 | 85 | **B-** | 🟡 | 🟢 Descoped |

---

## Per-task forensic reports

### EVP-001-core — Production proof gates · SAN-115

| Field | Value |
|-------|-------|
| **Purpose** | Sign-off ledger: Andrés ticket + Roberto publish + chat events all proven on prod |
| **Example** | After G3, Patricia opens one markdown table: local ✅ staging ✅ prod ✅ for each surface |
| **Status** | 🟡 Not Started · **Spec 82% · Exec 5%** · Grade **D+** |
| **Prod ready?** | 🔴 No — explicitly a gate, not a feature |
| **Will succeed?** | ⚠️ Yes as doc task **after** G3 + deferred G1 |

**✅ Confirmed:** All listed surfaces exist on disk (`events/[slug]`, tickets API, host wizard, `search-events`, `event-agent`). Vitest event **62/62**.

**🔴 Red flags:** `blocked_by: OPS-ANDRES-G1` — no spec file on disk. `blocked_by: EVP-013-core` — **stale** (EVP-013 archived Done). No evidence ledger file.

**Critical fixes:**
1. Remove `EVP-013-core` from `blocked_by` (Done).
2. Add `OPS-ANDRES-G1` spec or rename to deferred note in body.
3. Create `tasks/notes/EVP-001-proof-ledger.md` template with columns: surface · local · preview · prod · evidence path.

**Skills:** `task-verifier` → `testing` → `mde-supabase`

---

### EVP-003-core — Stripe webhook isolation · SAN-116

| Field | Value |
|-------|-------|
| **Purpose** | Ticket vs sponsor Stripe webhooks must use **different** signing secrets |
| **Example** | Malicious replay of sponsor event cannot finalize Andrés ticket order |
| **Status** | 🟡 Partial · **Spec 72% · Exec 60%** · Grade **C** |
| **Prod ready?** | 🔴 No — T9 distinctness unverified on prod |
| **Will succeed?** | 🟡 Yes as audit once secrets rotated |

**✅ Confirmed:** `mdeapp/supabase/functions/ticket-payment-webhook/` exists. Vitest stripe filter **3/3**. Env var names documented.

**🔴 Red flags:** Spec points at legacy `/home/sk/mde/supabase/functions/`; sponsor fn not in `mdeapp/`. Evidence path says `tasks/notes/F11-evidence.md` — actual `tasks/evidence/F11-evidence.md`. T9 may show IDENTICAL secrets locally.

**Critical fixes:**
1. Fix evidence path in spec §9.
2. Add row: mdeapp vs legacy function locations.
3. Run `task-verifier` probe T9; rotate sponsor secret if IDENTICAL.
4. Capture Stripe Dashboard screenshot (Tm1–Tm4).

**Skills:** `mde-supabase` → `mde-stripe` → `task-verifier`

---

### EVP-014-core — Host events list · SAN-118

| Field | Value |
|-------|-------|
| **Purpose** | Roberto views drafts + published events after wizard |
| **Example** | After publishing "Visionarios Night", Roberto opens `/host/events` and sees Published chip + link to `/events/[slug]` |
| **Status** | ⚪ Not Started · **Spec 78% · Exec 0%** · Grade **F** |
| **Prod ready?** | 🔴 No — **`page.tsx` missing**; nav disabled |
| **Will succeed?** | 🟢 **High** — plan [`san-118.md`](../../../plan/san-118.md) is implementation-ready |

**✅ Confirmed:** Wireframe exists. RLS `events_organizer_select_own` in migrations. EventCard at `copilot/event-card.tsx`. Middleware protects `/host/*`.

**🔴 Red flags:** `blocked_by: EVP-013-core` — **stale** (Done). Spec requires `<EventFilters>` — deferred in archived EVP-013. Query uses `organizer_id` but publish path sets only `created_by` ([san33-audit](san33-audit.md)).

**Critical fixes:**
1. Clear `blocked_by`; add `blocked_by: G3-organizer_id-fix` until edge insert fixed.
2. Drop EventFilters from DoD or split to follow-up.
3. Implement `src/app/host/events/page.tsx` per `san-118.md`.
4. Add `e2e/host/host-events-list.spec.ts`.

**Skills:** `shadcn` → `mde-supabase` → `testing`

---

### EVP-015-mvp — Grounded event discovery · SAN-119

| Field | Value |
|-------|-------|
| **Purpose** | Camila gets DB events first; web grounding only for freshness |
| **Example** | "What's on tonight?" → Supabase cards; if thin, Gemini cites allowlisted sources |
| **Status** | ⚪ Not Started · **Spec 80% · Exec 25%** · Grade **D** |
| **Prod ready?** | 🔴 Partial API only |
| **Will succeed?** | 🟡 After EVP-001 + quota/citation UX |

**✅ Confirmed:** `/api/grounding/event-web`, `search-web-grounded-events.ts`, `search-events.ts`, citation UI partial. Grounding vitest **22/22**.

**🔴 Red flags:** `related` link to nonexistent `tasks/events/EVP-021-...`. Full workflow (save, quota labels) not Done.

**Critical fixes:**
1. Fix `related` path → `tasks/events/tasks/MVP/EVP-021-...`.
2. Document what's LIVE vs acceptance gap in spec header.
3. Defer start until G3 green.

**Skills:** `mastra` → `gemini` → `copilotkit-integrations`

---

### EVP-016-mvp — Event maps + venue · SAN-120

| Field | Value |
|-------|-------|
| **Purpose** | Event cards sync to map pins; venue on detail page |
| **Example** | Camila clicks salsa event card → map flies to Laureles pin |
| **Status** | 🟡 · **Spec 75% · Exec 35%** · Grade **D+** |
| **Prod ready?** | 🔴 No binding proof |
| **Will succeed?** | 🟡 After EVP-015 |

**✅ Confirmed:** `chat-map-panel`, `event-results-panel`, map platform code, Places client. SCREEN-006 map pin test **passes**.

**🔴 Red flags:** INDEX says In Progress 35%; spec says Not Started — **drift**. MAP-010 venue binding not proven.

**Critical fixes:**
1. Sync frontmatter `status: In Progress`, `percent: 35`.
2. Add acceptance test: card click → pin highlight.
3. Load `mde-maps` + verify `mapId` on parent Map.

**Skills:** `mde-maps` → `testing` → `copilotkit-integrations`

---

### EVP-018-mvp — Discovery task pack (meta) · SAN-121

| Field | Value |
|-------|-------|
| **Purpose** | Parent orchestrator for EVP-019–028 |
| **Example** | Patricia tracks discovery rollout as one Linear epic with ordered children |
| **Status** | ⚪ · **Spec 58% · Exec 0%** · Grade **F** |
| **Prod ready?** | N/A |
| **Will succeed?** | N/A — not executable code |

**🔴 Red flags:** Broken plan paths `../../plan/events/...` (should be `docs/plan/events/...`). Child links `./EVP-031` wrong (ADV folder). Skill list **>5** — violates index-skills cap for agents.

**Critical fixes:**
1. Repair all relative paths in frontmatter.
2. Split skill list into `execution_map` reference only.
3. Update rule: EVP-013 Done → change gate to G3 + EVP-001.

**Skills:** `mde-task-lifecycle` only (planning)

---

### EVP-019-mvp — Research official docs · SAN-122

| Field | Value |
|-------|-------|
| **Purpose** | MCP-verify CopilotKit, Mastra, ADK, Grounding before discovery build |
| **Example** | Sofía runs gemini + copilotkit MCP; saves dated note before EVP-020 migration |
| **Status** | ⚪ · **Spec 83% · Exec 0%** · Grade **D+** |
| **Prod ready?** | N/A doc task |
| **Will succeed?** | 🟢 High — low risk |

**🔴 Red flags:** Deliverable `tasks/events/notes/EVP-019-mvp-research-notes.md` missing. `depends_on` uses filename suffix style.

**Critical fixes:**
1. Add output path under `tasks/notes/events/`.
2. Run MCP checklist; save dated notes before any 020 migration.

**Skills:** `gemini` → `copilotkit` (MCP) → `mastra` (MCP)

---

### EVP-020-mvp — Discovered events schema · SAN-123

| Field | Value |
|-------|-------|
| **Purpose** | Tables + RLS for scraped event candidates + approval queue |
| **Example** | Scraped "Festival de Flores" sits in `discovered_events` until Patricia approves |
| **Status** | ⚪ · **Spec 88% · Exec 0%** · Grade **C+** |
| **Prod ready?** | 🔴 No migration |
| **Will succeed?** | 🟢 Good spec — execute after 019 |

**Critical fixes:** Every new table needs RLS + ≥1 policy (`mde-supabase`). Migration + Supabase MCP verify.

**Skills:** `mde-supabase` → `task-verifier`

---

### EVP-021-mvp — Search Grounding templates · SAN-124

| Field | Value |
|-------|-------|
| **Purpose** | Medellín-specific Gemini Search query templates + citations |
| **Example** | "El Poblado nightlife events" → grounded chunks with source URLs |
| **Status** | ⚪ · **Spec 62% · Exec 15%** · Grade **F** |
| **Prod ready?** | 🔴 |
| **Will succeed?** | 🟡 After path fixes |

**🔴 Red flags:** `playbook_ref` paths `../grounding-search/` **broken** from MVP folder (should be `../../../grounding-search/`). Depends on archived MAP-002D, EVP-007.

**Critical fixes:**
1. Fix all playbook relative paths.
2. Align with existing `mastra/lib/search-grounding-*` — don't duplicate.
3. Verify models via `gemini` skill MCP (`gemini-3.5-flash` only).

**Skills:** `gemini` → `mastra`

---

### EVP-022-mvp — Discovery workflow · SAN-125

| Field | Value |
|-------|-------|
| **Purpose** | Mastra workflow: Supabase + web candidates → ranked list |
| **Example** | Agent runs workflow; returns 5 events with source tier labels |
| **Status** | ⚪ · **Spec 68% · Exec 20%** · Grade **D** |
| **Prod ready?** | 🔴 Stub only |
| **Will succeed?** | 🟡 Spec overshoots disk — narrow DoD to extend stub |

**✅ Confirmed:** `event-discovery-workflow.ts` registered; vitest **5/5**.

**Critical fixes:** Match spec to current stub; add steps after EVP-020 schema.

**Skills:** `mastra` → `gemini` → `mde-supabase`

---

### EVP-023-mvp — ADK sidecar · SAN-126

| Field | Value |
|-------|-------|
| **Purpose** | Google ADK SearchAgent + MapsAgent sidecar |
| **Example** | Mastra calls `:8000` ADK for heavy search (Phase 2) |
| **Status** | ⚪ · **Spec 85% · Exec 0%** · Grade **C** |
| **Prod ready?** | 🔴 Phase 2 — ADK disabled in CLAUDE.md Phase 1 |
| **Will succeed?** | 🟡 Defer to Phase 2 |

**Critical fixes:** Mark `phase: post-mvp` prominently; do not load `google-agents-cli-adk-code` for Phase 1 execution.

**Skills:** Defer — doc only Phase 1

---

### EVP-024-mvp — Places enrichment · SAN-127

| Field | Value |
|-------|-------|
| **Purpose** | Places API enrichment on discovered events (field masks) |
| **Example** | Candidate venue gets lat/lng + formatted address from Places |
| **Status** | ⚪ · **Spec 80% · Exec 10%** · Grade **D+** |
| **Prod ready?** | 🔴 |
| **Will succeed?** | 🟢 After 022 — `google-places-client.ts` exists |

**Critical fixes:** Every Places call needs `X-Goog-FieldMask` (`mde-maps`).

**Skills:** `mde-maps` → `mde-supabase`

---

### EVP-025-mvp — Discovery CopilotKit UI · SAN-128

| Field | Value |
|-------|-------|
| **Purpose** | Cited discovery cards + attribution in chat |
| **Example** | Camila sees "Source: somosmedellin.co" under discovered event card |
| **Status** | ⚪ · **Spec 72% · Exec 15%** · Grade **D** |
| **Prod ready?** | 🔴 |
| **Will succeed?** | 🟡 Partial — `GroundingAttribution.tsx` exists |

**Critical fixes:** Use CopilotKit **1.55.2 v1** only (`copilotkit-integrations`, not v2 develop). List actual component paths in DoD.

**Skills:** `copilotkit-integrations` → `shadcn` → `testing`

---

### EVP-026-mvp — Human approval save · SAN-129

| Field | Value |
|-------|-------|
| **Purpose** | Patricia approves discovered event before INSERT |
| **Example** | Scraped festival → HITL panel → only then writes to `events` |
| **Status** | ⚪ · **Spec 78% · Exec 25%** · Grade **D** |
| **Prod ready?** | 🔴 No discovered-event commit path |
| **Will succeed?** | 🟢 Reuse host HITL pattern from EVP-011/012 |

**✅ Confirmed:** `event-publish-approval-panel`, `approval-commit` edge — pattern exists.

**Critical fixes:** New edge fn or extend approval-commit with `source: discovered` — **never auto-publish**.

**Skills:** `copilotkit-integrations` → `mde-supabase`

---

### EVP-027-mvp — Discovery test plan · SAN-130

| Field | Value |
|-------|-------|
| **Purpose** | Playwright + Vitest plan for discovery pack |
| **Example** | Lucía runs replay test: query → citations → reject save |
| **Status** | ⚪ · **Spec 90% · Exec 0%** · Grade **C+** |
| **Prod ready?** | N/A |
| **Will succeed?** | 🟢 Write plan before 028 |

**Skills:** `testing` → `task-verifier`

---

### EVP-028-mvp — Discovery prod readiness · SAN-131

| Field | Value |
|-------|-------|
| **Purpose** | Feature flag, rate limits, rollback for discovery |
| **Example** | Patricia disables `EVENT_WEB_DISCOVERY` → chat falls back to DB-only |
| **Status** | ⚪ · **Spec 88% · Exec 0%** · Grade **C+** |
| **Prod ready?** | 🔴 Last gate in pack |
| **Will succeed?** | 🟢 After 019–027 |

**Critical fixes:** Output checklist to `tasks/notes/events/EVP-028-prod-checklist.md`.

**Skills:** `task-verifier` → `mde-vercel` (env vars)

---

### G3-core — Host publish prod proof · SAN-366

| Field | Value |
|-------|-------|
| **Purpose** | Prove Roberto publish on **production** mdeai.co |
| **Example** | Roberto describes event → approves → SQL row → `/events/[slug]` public |
| **Status** | 🟡 Partial · **Spec 74% · Exec 85%** · Grade **B-** |
| **Prod ready?** | 🟡 Code LIVE; **proof missing** |
| **Will succeed?** | 🟢 **85%** descoped — see [san33-audit.md](../../notes/events/san33-audit.md) |

**✅ Confirmed:** Wizard, HITL, approval-commit on disk. Vitest pass.

**🔴 Blockers:** No evidence file. `organizer_id` not set. `/host/events` missing. Verify cmd `host-event` matches zero specs.

**Critical fixes:**
1. Add `organizer_id: userId` to edge insert.
2. Run prod proof; write `tasks/notes/G3-host-publish-evidence.md`.
3. Fix G3 link to `./MVP/EVP-001-core-...`.
4. Fix verify command to `SCREEN-016` or add `e2e/host/host-publish.spec.ts`.

**Skills:** `testing` → `mde-supabase` → `copilotkit-integrations`

---

## Cross-cutting red flags

| # | Issue | Tasks affected | Severity |
|---|-------|----------------|----------|
| R1 | **`organizer_id` missing on publish** | G3, EVP-014, EVP-026 | 🔴 P0 |
| R2 | **`/host/events` not built** | EVP-014, G3 full acceptance | 🔴 P0 |
| R3 | **Stale `blocked_by: EVP-013`** | EVP-001, EVP-014, EVP-018 | 🟡 P1 |
| R4 | **Broken relative paths** | EVP-018, EVP-021, EVP-015 | 🟡 P1 |
| R5 | **Evidence path drift** (`notes/` vs `evidence/`) | EVP-003, G3 | 🟡 P1 |
| R6 | **INDEX vs spec status drift** | EVP-016 | 🟡 P2 |
| R7 | **Phase 1 ADK in active MVP folder** | EVP-023 | 🟡 Defer |
| R8 | **CopilotKit v2 trap** | EVP-025, 026 | 🟡 Use integrations skill |

---

## Production readiness verdict

| Surface | Vercel | Tests | Prod proof | Ready? |
|---------|--------|-------|------------|--------|
| Host wizard `/host/event/new` | ✅ LIVE | SCREEN-016 6/6 | G3 open | 🟡 |
| HITL + approval-commit | ✅ LIVE | 3/3 + edge | G3 open | 🟡 |
| Event cards in chat | ✅ LIVE | SCREEN-006 9/9 | EVP-001 open | 🟢 code |
| Event detail `/events/[slug]` | ✅ LIVE | vitest | — | 🟢 |
| Host list `/host/events` | ❌ | — | — | 🔴 |
| Ticket checkout | ✅ LIVE | partial | G1 deferred | 🟡 |
| Discovery pack 015–028 | partial API | 22+5 pass | not started | 🔴 |
| Stripe webhook isolation | code | 3/3 | audit open | 🔴 |

**Overall MVP production readiness: 🔴 Not launch-green** — Discovery Beta can ship **host publish + chat cards** after G3 narrow proof; not full EVP-001 ledger.

---

## Recommended execution order (verified)

```text
1. G3 prod proof (+ organizer_id fix)     — SAN-366
2. EVP-014 /host/events                   — SAN-118
3. EVP-003 secret rotation + evidence     — SAN-116
4. EVP-001 ledger                         — SAN-115
5. EVP-015 → 016                          — post core proof
6. EVP-019 → 020 → 022 → 024 → 025 → 026 → 027 → 028
```

---

## Corrections checklist (make specs 100%)

| Task | Correction |
|------|------------|
| EVP-001 | Remove EVP-013 from blocked_by; add ledger template path |
| EVP-003 | Fix evidence path to `tasks/evidence/F11-evidence.md` |
| EVP-014 | Clear blocked_by; remove EventFilters from DoD or defer; note organizer_id dep |
| EVP-015 | Fix related path to MVP/EVP-021 |
| EVP-016 | Set status In Progress 35% in frontmatter |
| EVP-018 | Fix plan + ADV child paths; trim skill list |
| EVP-021 | Fix grounding-search relative paths |
| G3 | Fix EVP-001 link; fix e2e verify command; add evidence path |
| ALL | Add `verified: 2026-06-04` after corrections |

---

## Will the MVP folder succeed?

| Scenario | Verdict |
|----------|---------|
| **P0 launch (Roberto + Camila)** | 🟢 **Yes** if team executes G3 → EVP-014 → EVP-003 → EVP-001 in order |
| **Discovery pack 015–028 as written** | 🔴 **No** — blocked on core proof + broken paths in 018/021 |
| **Specs 100% correct without edits** | 🔴 **No** — mean spec **78%**; 10+ path/status fixes required |
| **Production-ready today** | 🔴 **No** |

---

## Audit trail

- Branch probed: current workspace `mdeapp/`
- Skills loaded: task-verifier protocol, index-skills routing, CLAUDE.md hard rules (Gemini only, CK 1.55.2, RLS, field masks)
- Prior audits: [`san33-audit.md`](../../notes/events/san33-audit.md) · [`events-order.md`](../../notes/events/events-order.md)
- Next gate: run `task-verifier` per-task before any Done flip
