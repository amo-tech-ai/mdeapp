# Events Platform — Todo (canonical order)

> **Cycle 1:** Jun 8 → Jun 22, 2026 · [Linear Cycle 1](https://linear.app/sanjiovani/team/SAN/cycle/upcoming)  
> **Rules:** [`.cursor/rules/mdeai-done-gate.mdc`](../../../../.cursor/rules/mdeai-done-gate.mdc) · [`.cursor/rules/mdeai-events-task-skill-mcp-gate.mdc`](../../../../.cursor/rules/mdeai-events-task-skill-mcp-gate.mdc) · [`.cursor/rules/mdeai-events-pre-impl-verify.mdc`](../../../../.cursor/rules/mdeai-events-pre-impl-verify.mdc) · [`.cursor/rules/mdeai-real-world-proof-pr-review.mdc`](../../../../.cursor/rules/mdeai-real-world-proof-pr-review.mdc) · [`.cursor/rules/mdeai-events-gate-audit.mdc`](../../../../.cursor/rules/mdeai-events-gate-audit.mdc)  
> **Skills index:** [`index-skills.md`](../../../../index-skills.md) § Events Platform  
> **Naming:** `SAN-### · SPEC-ID — <full Linear title>` · **Changelog:** [`changelog.md`](./changelog.md)  
> **Last synced:** 2026-06-09 (EVENTS-PLATFORM-AUDIT · Linear synced · main `2835cf2` · SAN-135/510/511 Done · 512–514 In Review)

---

## Scoring columns

| Column | When set | Source |
|--------|----------|--------|
| **Grade** | After ship | [`changelog.md`](./changelog.md) execution grade (A–F) |
| **% correct** | After ship | Changelog weighted formula |
| **Readiness** | **Before implement** | Pre-verify rubric ([`mdeai-events-pre-impl-verify.mdc`](../../../../.cursor/rules/mdeai-events-pre-impl-verify.mdc)) |
| **Success rate** | Pre: estimate · Post: = % correct | First-pass merge probability |
| **Verify** | Pre + post | Skills + MCP + `task-verifier` ([§ Per-task verify pack](#per-task-verify-pack-skills--mcp--verifier)) |

**Before any implementation:** load task pack → MCP probes → `task-verifier` pre-impl → update row → **GO** only if readiness ≥ 70 and no 🔴.

**Before Done:** `task-verifier` post-ship — every AC verified on disk + runtime; evidence + changelog; not 100% until verifier says SHIP.

---

## Immediate focus

**P0 next:** [SAN-178 · PAY-001 — Live ticket purchase on production](https://linear.app/sanjiovani/issue/SAN-178) — 🟡 **partial prod proof** ([`SAN-178-RESULTS.md`](../../../../tasks/testing/evidence/2026-06-09/SAN-178-RESULTS.md): paid order + QR; Stripe **test** mode on prod) → [SAN-115 · AIE-001](https://linear.app/sanjiovani/issue/SAN-115) ledger → [SAN-857 · AIE-025](https://linear.app/sanjiovani/issue/SAN-857) browse panel.

**Phase A = CLOSED** · **Linear Todo (16)** — schema + wires + venue chain + data-quality + browse panel (see below).

---

## Current state

| Area | Status |
|------|--------|
| **main** | `2835cf2` — SAN-546 pin-clear (#145) + SAN-135 cleanup (#142) |
| **Active branch** | `ai/san-492-evt-033-event-venue-offerings-schema` — draft PR [#146](https://github.com/amo-tech-ai/mdeapp/pull/146) |
| **Shipped (changelog)** | SAN-660 · SAN-730 · SAN-731 · **SAN-135** (#138 + #142) |
| **Platform readiness** | 96/100 — Phase A gate closed |

---

## Phase A — Gate

| # | Task | Linear | Grade | % correct | PR / SHA | Readiness | Success rate | Verify |
|---|------|--------|:-----:|----------:|----------|----------:|-------------:|--------|
| A.1 | **SAN-730 · AIE-002 — Enable host navigation rail** | Done | **B+** | **88%** | [#135](https://github.com/amo-tech-ai/mdeapp/pull/135) · `b50104c` | 92 | **88%** | ✅ post-ship |
| A.2 | **SAN-731 · UI-004 — Event detail loading skeleton + hero alt (a11y)** | Done | **B+** | **90%** | [#137](https://github.com/amo-tech-ai/mdeapp/pull/137) · `0baeda7` | 90 | **90%** | ✅ post-ship |
| A.3 | **SAN-135 · AIE-024 — MVP Luma event detail layout (EVP-032)** | Done | **A** | **95%** | [#138](https://github.com/amo-tech-ai/mdeapp/pull/138) · `9971bb8` + [#142](https://github.com/amo-tech-ai/mdeapp/pull/142) · `8936927` | 95 | **95%** | ✅ merged + cleanup |

**Failure points (A.3):** resolved · Gate: [`PHASE-A-GATE-AUDIT.md`](../../../../tasks/testing/evidence/2026-06-08/PHASE-A-GATE-AUDIT.md)

**Gate exit criteria (all required):**

- [x] SAN-731 merged on `main` + changelog + evidence
- [x] SAN-135 merged on `main` + changelog + evidence
- [x] Linear **Done** (SAN-135 — verified 2026-06-09 EVENTS-PLATFORM-AUDIT)
- [x] Blockers updated
- [x] **task-verifier** post-ship on SAN-135

Run: [`.cursor/rules/mdeai-events-gate-audit.mdc`](../../../../.cursor/rules/mdeai-events-gate-audit.mdc)

---

## Phase B — Venue booking chain

**Phase A gate closed.** Venue *code* blocked on SAN-492 approval; wires (510/511) may start now.

**SAN-492 data model revised + live-audited (2026-06-09):** `partner_locations` reuse model — readiness **85 (GO migration branch; NO-GO prod apply)**. Migration authored with **`partner_is_active()`** fix: `mdeapp/supabase/migrations/20260609120000_san492_event_venue_offerings.sql` — **NOT APPLIED on prod**. RLS smoke **ALL PASS** on disposable DB. Docs: [`VENUE-DATA-MODEL.md`](./data/VENUE-DATA-MODEL.md) · audit [`data/data-model-audit.md`](./data/data-model-audit.md) · seed spec [`EVT-034-seed.md`](./specs/venue-booking/EVT-034-seed.md)

**Parent epic:** [SAN-855 · VEB-000 — Event Venue Booking Platform](https://linear.app/sanjiovani/issue/SAN-855/veb-000-event-venue-booking-platform)

| # | Task | Linear | Readiness | Success rate | Verify |
|---|------|--------|----------:|-------------:|--------|
| B.1 | **SAN-492 · EVT-033 — Event venue + offerings schema** | In Progress | **88** | **84%** est. | 🟢 PR [#146](https://github.com/amo-tech-ai/mdeapp/pull/146) draft — [`SAN-492-RESULTS.md`](../../../../tasks/testing/evidence/2026-06-09/SAN-492-RESULTS.md) · NO prod apply |
| B.2 | **SAN-493 · EVT-034 — Seed Mamacita + 5 event partners** | [Todo](https://linear.app/sanjiovani/issue/SAN-493/evt-034-seed-mamacita-5-event-partners) | **80** | **75%** est. | ⬜ blockedBy 492 |
| B.3 | **SAN-510 · EVT-051 — Wire: Event offerings panel + Event Venue CTA** | Done | **92** | **92%** est. | ✅ [`SAN-510-511-WIRE-RESULTS.md`](../../../../tasks/testing/evidence/2026-06-09/SAN-510-511-WIRE-RESULTS.md) |
| B.4 | **SAN-511 · EVT-052 — Wire: Request proposal modal** | Done | **92** | **92%** est. | ✅ same evidence file |
| B.5 | **SAN-494 · EVT-035 — Restaurant card Event Venue CTA** | [Todo](https://linear.app/sanjiovani/issue/SAN-494/evt-035-restaurant-card-event-venue-cta) | **78** | **74%** est. | ⬜ blockedBy 492+493 |
| B.6 | **SAN-495 · EVT-036 — Event offerings detail panel** | [Todo](https://linear.app/sanjiovani/issue/SAN-495/evt-036-event-offerings-detail-panel) | **76** | **72%** est. | ⬜ blockedBy 510 |
| B.7 | **SAN-496 · EVT-037 — Request proposal modal (HITL)** | [Todo](https://linear.app/sanjiovani/issue/SAN-496/evt-037-request-proposal-modal-hitl) | **73** | **68%** est. | ⬜ blockedBy 511+494 |
| B.8 | **SAN-512 · EVT-053 — Wire: Venue match panel + compare** | Done | **90** | **88%** est. | ✅ [`SAN-512-514-WIRE-RESULTS.md`](../../../../tasks/testing/evidence/2026-06-09/SAN-512-514-WIRE-RESULTS.md) · impl gated on 497 |
| B.9 | **SAN-513 · EVT-054 — Wire: Host wizard venue step** | Done | **90** | **88%** est. | ✅ same evidence · impl gated on 492 |
| B.10 | **SAN-514 · EVT-055 — Wire: Admin event booking queue** | Done | **90** | **88%** est. | ✅ same evidence · impl gated on 492+502 |
| B.11 | **SAN-497 · EVT-038 — eventVenueAgent + search/rank tools** | [Todo](https://linear.app/sanjiovani/issue/SAN-497/evt-038-eventvenueagent-searchrank-tools) | **82** | **78%** est. | ⬜ blockedBy 492+493 |
| B.12 | **SAN-498 · EVT-039 — AI venue match score panel** | [Todo](https://linear.app/sanjiovani/issue/SAN-498/evt-039-ai-venue-match-score-panel) | **80** | **76%** est. | ⬜ blockedBy 497 |
| B.13 | **SAN-500 · EVT-041 — Host wizard venue step** | [Todo](https://linear.app/sanjiovani/issue/SAN-500/evt-041-host-wizard-venue-step-roberto) | **78** | **74%** est. | ⬜ blockedBy 492 · wire 513 |
| B.14 | **SAN-502 · EVT-043 — Patricia admin queue** | [Todo](https://linear.app/sanjiovani/issue/SAN-502/evt-043-patricia-admin-queue-event-requests) | **76** | **72%** est. | ⬜ blockedBy 492+496 · wire 514 |
| B.15 | **SAN-858 · DATA-QUALITY — Events ownership classification** | In Progress | **85** | **90%** est. | 🟡 Option A draft — [`SAN-858-CLASSIFICATION.md`](../../../../tasks/testing/evidence/2026-06-09/SAN-858-CLASSIFICATION.md) · human sign-off pending |

### Linear Todo column (16) — execution order (dependency-correct)

**Start NOW — no 492 gate** (parallel): wires `SAN-510 · EVT-051`, `SAN-511 · EVT-052` (doc-only); `SAN-858 · DATA-QUALITY` (no DDL); + P0 launch track `SAN-178 · PAY-001` → `SAN-115 · AIE-001`.

| # | SAN · SPEC | Title | Gate (blockedBy) |
|---|-----------|-------|------------------|
| 1 | **SAN-492 · EVT-033** | Event venue + offerings schema (`partner_locations` reuse) | root — sign-off → apply |
| 2 | **SAN-510 · EVT-051** | Wire: offerings panel + Event Venue CTA | none (relatedTo 492) — now |
| 3 | **SAN-511 · EVT-052** | Wire: request proposal modal | none (relatedTo 492) — now |
| 4 | **SAN-858 · DATA-QUALITY** | Events ownership classification | none — now (parallel, no DDL) |
| 5 | **SAN-513 · EVT-054** | Wire: host wizard venue step | spec only (wire — can start now) |
| 6 | **SAN-514 · EVT-055** | Wire: admin event booking queue | spec only (wire — can start now) |
| 7 | **SAN-493 · EVT-034** | Seed Mamacita + 5 event partners | 492 (applied) |
| 8 | **SAN-497 · EVT-038** | eventVenueAgent + search/rank tools | 492 + 493 |
| 9 | **SAN-512 · EVT-053** | Wire: venue match panel + compare | **497 contract** (moved — was #4) |
| 10 | **SAN-494 · EVT-035** | Restaurant card Event Venue CTA | 492 + 493 |
| 11 | **SAN-495 · EVT-036** | Event offerings detail panel | 510 + 494 |
| 12 | **SAN-496 · EVT-037** | Request proposal modal (HITL) | 511 + 494 + 495 |
| 13 | **SAN-498 · EVT-039** | AI venue match score panel | 497 (+ wire 512) |
| 14 | **SAN-500 · EVT-041** | Host wizard venue step | 492 (+ wire 513) |
| 15 | **SAN-502 · EVT-043** | Patricia admin booking queue | 492 + 496 (+ wire 514) |
| 16 | **SAN-857 · AIE-025** | Event browse detail panel | **SAN-115** (separate P0 track) |

> **Fix applied 2026-06-09:** `SAN-512 · EVT-053` moved #4 → #9 (it needs the `SAN-497 · EVT-038` agent match-score contract). `SAN-858 · DATA-QUALITY` raised #16 → #4 (independent, fixes Roberto's host list now). All five wires (`SAN-510/511/512/513/514`) are doc-only — gated by spec/contract, not the applied migration.

### Blocker chain (Linear-accurate — full venue chain)

```text
SAN-492 ─┬─> SAN-493 ──> SAN-494 ──┬─> SAN-495 ──> SAN-496 ──> SAN-502 (admin queue)
         │         └──> SAN-497 ──┬─> SAN-498 (match panel)
         │                        └─> SAN-512 (wire match, needs 497 contract)
         ├─> SAN-500 (host wizard venue step)
         ├─ relatedTo ─> SAN-510 (wire) ──> blocks SAN-495
         └─ relatedTo ─> SAN-511 (wire) ──> blocks SAN-496
SAN-858 (data quality)  — independent, no gate
SAN-115 ──> SAN-857 (browse panel)  — separate P0 launch track
```

**Wires (510–514) are doc-only** — reference specs/contracts, not the applied DB. `SAN-858` and the P0 ledger (`SAN-178 → SAN-115`) run in parallel with the venue chain.

### Cycle 1 assignment

**Now (parallel, no 492 gate):** `SAN-510 · EVT-051` + `SAN-511 · EVT-052` wires · `SAN-858 · DATA-QUALITY` · P0 `SAN-178 · PAY-001` → `SAN-115 · AIE-001`.  
**492 sign-off → apply**, then: `SAN-493 · EVT-034` → `SAN-497 · EVT-038` → `SAN-494 · EVT-035` → `SAN-495 · EVT-036` → `SAN-496 · EVT-037` → `SAN-502 · EVT-043`.

---

## Phase C — Browse UX polish (P1)

**After SAN-115 P0 commerce gates** (PAY-001 · EVT-002 · PAY-003). Small MVP — no new detail page.

| # | Task | Linear | Readiness | Success rate | Verify |
|---|------|--------|----------:|-------------:|--------|
| C.1 | **SAN-857 · AIE-025 — Event browse detail panel (EVP-032A)** | [Todo](https://linear.app/sanjiovani/issue/SAN-857/aie-025-mvp-event-browse-detail-panel-evp-032a) | **90** est. | **88%** est. | ⬜ blockedBy SAN-115 · relatedTo SAN-135, SAN-574 |

**Disk (on start):** `tasks/events/specs/EVP-032A-event-browse-detail-panel.md`

---

## Per-task verify pack (skills + MCP + verifier)

Load **≤5 skills** (read `SKILL.md` each). Run **MCP probes** before coding. **`task-verifier`** required pre-impl (GO) and post-ship (100% AC).

| Task | Skills (≤5, in order) | MCP (before code) | Spec / disk | Pre-verify | Post-ship verifier |
|------|------------------------|-------------------|-------------|------------|-------------------|
| **SAN-660 · MKT** | `mde-task-lifecycle` · `shadcn` · `testing` · `task-verifier` · `mde-worktree-pr-flow` | — | `tasks/events/specs/marketing/` | ✅ Done | ✅ A · 92% |
| **SAN-730 · AIE-002** | `shadcn` · `copilotkitV1` · `testing` · `task-verifier` · `mde-worktree-pr-flow` | copilotkit (single provider) | host nav spec + `host-nav-rail.tsx` | ✅ Done | ✅ B+ · 88% |
| **SAN-731 · UI-004** | `shadcn` · `testing` · `task-verifier` · `mde-task-lifecycle` · `mde-worktree-pr-flow` | — | PAGE-003 · SCREEN-014 | ✅ Done | ✅ B+ · 90% |
| **SAN-135 · AIE-024** | `shadcn` · `testing` · `task-verifier` · `mde-supabase` · `mde-worktree-pr-flow` | **Supabase** — backfill `details.host_display` + `event_venues` join | PAGE-003b · [`SAN-135-RESULTS.md`](../../../../tasks/testing/evidence/2026-06-08/SAN-135-RESULTS.md) | ✅ GO 94 | ✅ tests green · PR |
| **SAN-492 · EVT-033** | `mde-supabase` · `task-verifier` · `mermaid-diagrams` · `mde-task-lifecycle` · `testing` | **Supabase** — tables exist? RLS audit | **VENUE-DATA-MODEL** · EVT-033-schema | ⬜ approve SoT first | ⬜ |
| **SAN-493 · EVT-034** | `mde-supabase` · `mde-maps` · `task-verifier` · `testing` · `mde-task-lifecycle` | **Supabase** + **google-maps** Places IDs | seed spec | ⬜ after 492 | ⬜ |
| **SAN-510 · EVT-051** | `mde-wireframe` · `shadcn` · `testing` · `task-verifier` · `mde-worktree-pr-flow` | — | VEB-W01 wire | 🟢 GO 92 | ⬜ |
| **SAN-511 · EVT-052** | `mde-wireframe` · `copilotkitV1` · `shadcn` · `testing` · `task-verifier` | copilotkit HITL patterns (reference) | VEB-W02 wire | 🟢 GO 92 | ⬜ |
| **SAN-494 · EVT-035** | `copilotkitV1` · `mde-maps` · `testing` · `task-verifier` · `shadcn` | **google-maps** + chat card routing | [VEN-001](./specs/venue-booking/VEN-001-restaurant-venue-cta.md) (`google_place_id` join) | ⬜ after 493 | ⬜ |
| **SAN-858 · DATA-QUALITY** | `mde-supabase` · `task-verifier` · `mde-task-lifecycle` | **Supabase** — per-row ownership probe | audit [`05`](./audit/05-all-events-data-model-live-audit.md) · §13.5 | 🟢 GO 85 | ⬜ |
| **SAN-495 · EVT-036** | `shadcn` · `copilotkitV1` · `testing` · `task-verifier` · `mde-maps` | — | detail panel spec | ⬜ after 510 | ⬜ |
| **SAN-496 · EVT-037** | `copilotkitV1` · `copilotkit-agui` · `testing` · `task-verifier` · `mde-supabase` | copilotkit + **Supabase** booking RLS | HITL modal spec | ⬜ after 511+494 | ⬜ |
| **SAN-857 · AIE-025** | `shadcn` · `mobile-responsiveness` · `testing` · `task-verifier` · `mde-worktree-pr-flow` | — | EVP-032A browse panel spec | ⬜ after SAN-115 | ⬜ |

**Screen work:** add `copilotkitV1` (not `copilotkit-develop` v2) · **UI:** `shadcn` + [`DESIGN.MD`](../../../../DESIGN.MD)

---

## Related shipped (not in venue chain)

| Task | Linear | Grade | % correct | Verify |
|------|--------|:-----:|----------:|--------|
| **SAN-660 · MKT — For Event Hosts landing (/host)** | Done | **A** | **92%** | ✅ |
| **SAN-730 · AIE-002 — Enable host navigation rail** | Done | **B+** | **88%** | ✅ |

---

## P0 gate (Core Foundation — not on Events board)

| Issue | Linear | Status | Unblocks |
|-------|--------|--------|----------|
| **SAN-178 · PAY-001 — Live ticket purchase** | [Todo](https://linear.app/sanjiovani/issue/SAN-178) Urgent · Cycle 1 | 🟡 **Partial** — test-mode Stripe on prod; paid+QR proof filed | SAN-115 ledger → SAN-857 |
| **SAN-115 · AIE-001 — Production proof ledger** | [Todo](https://linear.app/sanjiovani/issue/SAN-115) | ⬜ G1 proof pending | SAN-857 browse panel |
| SAN-116 PAY-003 | Done | ✅ | — |
| SAN-366 EVT-002 | Done | ✅ | SAN-115 unblocked from host side |

## Do not start yet

| Issue | Reason |
|-------|--------|
| SAN-492 **prod migration apply** | 🟡 GO for **branch only** — human ERD sign-off before prod (`VENUE-DATA-MODEL.md`) |
| SAN-493–502 implementation code | Blocked by 492 migration merge (+ chain deps) |
| SAN-857 browse panel | Blocked by SAN-115 P0 ledger |
| SAN-824, SAN-765, PR #136 | [`notes/1-notes.md`](./notes/1-notes.md) |

---

## Agent checklist (every task)

### Before implement

- [ ] Read this row + Linear MCP `get_issue` (+ `includeRelations: true`)
- [ ] Load **≤5 skills** from [Per-task verify pack](#per-task-verify-pack-skills--mcp--verifier) — read each `SKILL.md`
- [ ] Run **MCP probes** listed for the task
- [ ] **`task-verifier`** pre-impl — readiness score + failure points
- [ ] Update this file: Readiness, Success rate (est.), Verify column
- [ ] Verdict **GO** (readiness ≥ 70, no 🔴) — else **HOLD**, no code

### After implement (before PR)

- [ ] Vitest / Playwright per spec
- [ ] Real-world browser — localhost screenshot → `tasks/testing/evidence/YYYY-MM-DD/`
- [ ] `cr review --agent --base main` + `cubic review --base main` ([`mdeai-real-world-proof-pr-review.mdc`](../../../../.cursor/rules/mdeai-real-world-proof-pr-review.mdc))
- [ ] Evidence → `SAN-###-RESULTS.md`

### Before merge / Done

- [ ] floor + Vercel + cubic/CodeRabbit PR threads resolved
- [ ] **`task-verifier`** post-ship — **100% AC** on disk + runtime (not status field)
- [ ] Graded row in [`changelog.md`](./changelog.md) → copy Grade + % correct here
- [ ] Linear **In Review** with evidence link — **Done** only after user OK + verifier SHIP
