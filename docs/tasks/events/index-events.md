---
title: Events Platform — Progress Task Tracker
updated: 2026-06-08
linear_project: https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues
planning_verification: ./PLANNING-VERIFICATION.md
audit_checklist: ./prompts/03-checklist.md
audit_prompts: ./prompts/01--events-prompt.md
copilotkit_plan: ./docs/01a-copilotkit-mastra-plan.md
mastra_plan: ./docs/02-mastra-events.md
mastra_roadmap: ./docs/02a-mastra-events.md
fix_prompt: ./prompts/02-fix.md
canonical_tasks: ./tasks/INDEX.md
ai_native_tasks: ./tasks/AI-native-system/index-aievents.md
audit: ./audit/01-audit-events-mvp.md
diagrams: ./specs/DIAGRAMS.md
verified: 2026-06-09 (disk + Supabase MCP live + Linear MCP; SAN-492 migration authored)
---

# Events Platform — Progress Task Tracker

## 🔄 Current state — 2026-06-09 refresh (verified live)

> Verified this pass: disk (`mdeapp/src`), Supabase MCP (project `zkwcbyxiwklihegjhuql`, 15 tables), Linear MCP (Events Platform, 45 recent issues). **Phase A gate closed** (SAN-730 · AIE-002, SAN-731 · UI-004, SAN-135 · AIE-024 merged on `main`). Detailed EVP catalogs below are reference; this block is the authoritative status.

| Area | Description (real-world) | Status | % | ✅ Confirmed (proof) | ⚠️ Missing / Failing | 💡 Next Action |
|------|--------------------------|--------|--:|----------------------|----------------------|----------------|
| **Chat discovery** | Camila: "salsa this weekend" → event cards in `/chat` | 🟢 | 90% | `event-card.tsx`; prod `/api/events/search` 10 rows; SAN-117 Done | SCREEN-006 Playwright flake | Re-run with dev server |
| **Event detail page** | Tourist opens `/events/[slug]` → host + venue + buy | 🟢 | 88% | SAN-135 · AIE-024 merged (#138+#142); host/venue blocks live | Luma vibe/attendee layer = SAN-136+ ⚪ | Ship SAN-857 browse panel |
| **Ticket commerce** | Andrés: buy → QR wallet → door scan | 🟢 | 88% | 49 events · 36 orders (11 paid) · 40 attendees · 3 check-ins (live) | G1 **partial** — test-mode prod ([`SAN-178-RESULTS.md`](../../../../tasks/testing/evidence/2026-06-09/SAN-178-RESULTS.md)) | SAN-178 Path A/B → SAN-115 ledger |
| **Host create + publish** | Roberto: NL wizard → HITL → publish | 🟢 | 92% | `/host/event/new` + `approval-commit`; SAN-366 Done | — | — |
| **Host events list** | Roberto sees his events at `/host/events` | 🟢 | 90% | page + RLS; SAN-730 nav Done | 31/49 events have NULL `organizer_id` (legacy) → he won't see them | SAN-858 ownership fix |
| **Host marketing** | `/host` acquisition landing | 🟢 | 95% | SAN-660 Done (PR #130) | — | — |
| **Host analytics** | Roberto: "how are sales?" at `/host/analytics` | ⚪ | 0% | — | No page, no `hostOpsAgent` | SAN-729 (Backlog) |
| **Gemini AI agents** | `conciergeAgent`, `eventAgent`, `hostEventAgent`, `router` | 🟢 | 95% | 6 agents in `src/mastra/agents` on `gemini-3.5-flash` | `eventVenueAgent` (SAN-497) ⚪, `hostOpsAgent` ⚪ | Build after SAN-492 apply |
| **Mastra tools** | `search_events/restaurants/venue_anchors/grounded/web-grounded`, intent | 🟢 | 90% | 9 tools + tests in `src/mastra/tools` | venue search/rank tools (SAN-497) | — |
| **Mastra workflows** | `concierge-routing`, `event-discovery` | 🟡 | 55% | routing live | `event-discovery` DB-only stub (no web ingest/save); `eventVenueBookingWorkflow` (SAN-501) ⚪ | After discovery schema |
| **CopilotKit** | v1.55.2 cards + HITL + wizard | 🟢 | 90% | wired; single provider | prod empty POST → 401 (expect 400) | Investigate smoke |
| **Supabase data** | 15 tables, RLS on all | 🟢 | 90% | live probe; commerce + partner stacks | `discovered_events` (SAN-123) missing | — |
| **Venue booking schema** | SAN-492 · EVT-033 — Event Venue + Offerings Schema | 🟡 | 60% | **Migration AUTHORED + dry-run PASS** (`20260609120000_san492_event_venue_offerings.sql`); readiness 88 | **NOT applied to prod**; human sign-off pending | Sign-off → apply |
| **Venue booking UI** | Camila: Event Venue CTA → offerings → proposal | ⚪ | 5% | wires VEB-W01–05 reviewed on disk | SAN-494/495/496/498/500 Todo (gated on 492) | After migration |
| **Venue admin queue** | Patricia approves venue proposals | ⚪ | 0% | `bookings` approval RLS in migration | `/admin/bookings` screen (SAN-502/514) | After 492 |
| **PG Vector search** | Semantic "techno rooftop" → events | 🟢 | 85% | `hybrid_search_events` RPC; 6 pgvector migrations | not in discovery save path | — |
| **Maps / Places** | Tourist sees event pins in El Poblado | 🟡 | 45% | map panel + markers (`src/components/maps`) | event↔venue bind unproven (SAN-120/824 Backlog) | Phase 2 |
| **ADK (Google)** | SearchAgent + MapsAgent sidecar | ⚪ | 0% | Phase 2 spec only | not in `mdeapp/` runtime | Deferred per CLAUDE.md |
| **Web discovery pack** | Patricia: approve scraped events | ⚪ | 8% | `/api/grounding/event-web` stub | `discovered_events` + save UI (SAN-119–131, Backlog) | Post-launch |
| **Admin / ops** | `/admin/events`, `/admin/leads` | ⚪ | 5% | — | No admin screens | SAN-515 |
| **Launch proof ledger** | Sign-off MVP is real on prod | 🟥 | 10% | surfaces exist | SAN-115 + SAN-178 open (P0 gate) | File ledger |
| **Data quality** | events ownership + host_display backfill | 🔴 | — | measured live | 31 orphan events · 0 venue partners · 18/49 host_display | SAN-858 |

**Overall events platform: 🟡 ~46%** — commerce + host + chat shipped and live; venue booking schema authored (not applied); discovery/admin/analytics/Luma-social not started. **Not launch-signed** (SAN-115 + SAN-178 ledger open).

**Status changes since 2026-06-08:** SAN-730 · AIE-002 → **Done** · SAN-731 · UI-004 → **Done** · SAN-135 · AIE-024 → **Done** (#138+#142; #143 closed duplicate) · SAN-660 · MKT → **Done** · SAN-492 · EVT-033 → **In Progress** (PR #146 draft) · SAN-510/511/512/513/514 wires → **Done** (evidence 2026-06-09) · SAN-858 · DATA-QUALITY → **In Progress** · **new:** SAN-857 · AIE-025 (browse panel, Todo).

**Next 5 (verified order):** 1) sign-off + apply **SAN-492 · EVT-033** migration · 2) **SAN-858** Option A human ack · 3) **SAN-178/SAN-115** launch ledger · 4) **SAN-493 · EVT-034** seed after 492 apply · 5) **SAN-857 · AIE-025** browse detail panel (after SAN-115).

**Full audit:** [`EVENTS-PLATFORM-AUDIT.md`](../../../../tasks/testing/evidence/2026-06-09/EVENTS-PLATFORM-AUDIT.md) · **62/100 (C+)**

---

**Linear project:** [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) · Target **2026-06-30** · Milestone **MVP Gates** at **0%** in Linear (ledger not signed)

**Audit workflow:** Run [`prompts/03-checklist.md`](03-checklist.md) (Phases 1–10 from [`01--events-prompt.md`](./prompts/01--events-prompt.md) + fix pass from [`02-fix.md`](./prompts/02-fix.md))

**Planning bundle (2026-06-08):** [PRD](./events-prd.md) · [Roadmap](./events-roadmap.md) · **[AI V2 plan](./plans/04-AI-native-system.md)** · [CopilotKit UI](./plans/01a-copilotkit-mastra-plan.md) · [Mastra](./plans/02-mastra-events.md) · [Luma design](./design/luma/00-index.md)

**Verified today:** `npm test -- --run event` **97/97** · `approval-commit` **9/9** · `grounding` **25/25** · `host-events` **1/1** · prod GET `/` **200** · prod `/api/events/search` **10 results** · prod `/api/copilotkit` empty body **401** (script expects **400** — investigate)

---

## Executive verdict

| Dimension | Status | % | Proof |
|-----------|--------|--:|-------|
| **Core commerce (Andrés)** | 🟡 | 85% | Ticket APIs + `/events/[slug]` LIVE; G1 paid webhook proof deferred to EVP-001 |
| **Host create + publish (Roberto)** | 🟢 | 92% | Wizard + HITL + `organizer_id` fix on disk; [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) Done in Linear |
| **Host list (Roberto)** | 🟢 | 88% | `/host/events` shipped; Vitest pass; Playwright `e2e/host/host-events-list.spec.ts` **missing** |
| **Chat discovery (Camila)** | 🟢 | 90% | [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) Done; prod events API green |
| **Web discovery pack (015–028)** | ⚪ | 8% | Stub workflow + `/api/grounding/event-web`; no `discovered_events` schema |
| **Luma / social layer (032–047)** | ⚪ | 85% | SAN-135 · AIE-024 Done (#138+#142); SAN-136+ Backlog |
| **Venue booking (EVT-033–055)** | 🟡 | 12% | Specs + wires reviewed; SAN-492 In Progress (#146); SAN-510/511 Done |
| **Launch proof ledger** | 🟥 | 10% | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) Todo — **P0 exit gate** |
| **Overall (51 tracked tasks)** | 🟡 | **38%** | 16 Done/ship-ready code · 35 queued/post-MVP |

**Production readiness:** 🟡 **Discovery Beta** — core paths on Vercel; **not launch-signed** until SAN-115 ledger + prod persona proofs refreshed.

### Readiness scores (audit checklist)

| Dimension | % | Grade |
|-----------|--:|-------|
| MVP readiness | 72% | C+ — code shipped; ledger blocks sign-off |
| Production readiness | 55% | D+ — G1 proof + copilotkit smoke gap |
| UX readiness | 68% | C — Luma/admin/marketing missing |
| AI readiness | 90% | A- — agents + tools LIVE |
| Planning completeness | 95% | A — Linear ↔ specs mapped |

**Planning confidence:** **82/100** — see [`prompts/03-checklist.md`](03-checklist.md)

---

## Capability audit matrix (Phase 1)

Full checklist: [`prompts/03-checklist.md`](03-checklist.md) · Diagrams: [`specs/DIAGRAMS.md`](./specs/DIAGRAMS.md)

| Area | % | Grade | Status | Primary Linear |
|------|--:|-------|--------|----------------|
| Event discovery | 88 | B+ | 🟡 | SAN-117 |
| Event detail | 70 | C+ | 🟡 | SAN-135, SAN-731 |
| Ticketing | 85 | B | 🟡 | SAN-248, SAN-115 |
| Stripe | 90 | A- | 🟢 | SAN-116 |
| Host tools | 92 | A- | 🟢 | SAN-366, SAN-118 |
| AI agents | 95 | A | 🟢 | Mastra disk |
| Chat booking | 90 | A- | 🟢 | SAN-117 |
| Marketing | 15 | F | ⚪ | SAN-660+ |
| Analytics | 0 | F | ⚪ | SAN-729 |
| Admin | 5 | F | ⚪ | SAN-515+ |
| Venue booking | 0 | F | ⚪ | SAN-492–514 |
| Discovery workflows | 8 | F | ⚪ | SAN-119–131 |
| Maps | 45 | D+ | 🟡 | SAN-120 |
| Search / PG vector | 85 | B+ | 🟢 | hybrid_search_events |

---

## Status legend

| Dot | Meaning |
|-----|---------|
| 🟢 | Complete — functional + tested |
| 🟡 | In progress — partial or proof gap |
| ⚪ | Not started — planned |
| 🟥 | Blocked — dependency or failing check |

---

## Milestone rollup (Linear)

| Milestone | Target | Linear progress | Verdict |
|-----------|--------|-----------------|---------|
| 🎟️ **MVP Gates** | 2026-06-30 | 0% | 🟡 4/5 gate issues Done in Linear; **SAN-115 ledger open** |
| 🎟️ **Polish** | 2026-07-15 | 0% | 🟡 EVP-014 code shipped; SCREEN-017 polish open |
| 🔮 **Discovery** | 2026-08-31 | 0% | ⚪ SAN-119→131 all Todo |

---

## P0 — MVP gates & launch proof

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|------|-------------|--------|--:|--------------|---------------------|----------------|
| [EVP-013 / SAN-117](https://linear.app/sanjiovani/issue/SAN-117) | Event cards in AI chat (Camila) | 🟢 | 100% | `event-card.tsx`; prod `/api/events/search` 10 rows | SCREEN-006 Playwright **1 fail** (clarify branch, no dev server) | Re-run SCREEN-006 with `npm run dev` |
| [G3 / SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | Roberto prod publish → Supabase row | 🟢 | 95% | Wizard + HITL + `build-event-insert.ts` sets `organizer_id` | No dated evidence under `tasks/testing/evidence/` | Capture prod SQL screenshot → EVP-001 |
| [EVP-014 / SAN-118](https://linear.app/sanjiovani/issue/SAN-118) | `/host/events` list page | 🟢 | 88% | [`host/events/page.tsx`](../../../src/app/host/events/page.tsx); RLS `organizer_id`; Vitest grid **1/1** | Spec still `Not Started`; `e2e/host/host-events-list.spec.ts` missing | Sync spec status · add Playwright spec |
| [EVP-003 / SAN-116](https://linear.app/sanjiovani/issue/SAN-116) | Stripe webhook secret isolation | 🟢 | 95% | Linear **Done**; `ticket-payment-webhook` + Vitest filter | Local spec `Partial`; prod rotation evidence not in repo | Close spec · archive T9 screenshot |
| [EVP-001 / SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | MVP launch proof ledger (G1+G2+G3) | 🟥 | 10% | Dependency surfaces exist on disk | **No evidence ledger**; G1 deferred; stale `blocked_by: EVP-013` | Create `tasks/notes/EVP-001-proof-ledger.md` |

---

## Archived core — LIVE on Vercel 🟢

| Task | Description | Status | % | ✅ Confirmed | Linear |
|------|-------------|--------|--:|--------------|--------|
| [EVP-002](../../../../tasks/archive/events-A/EVP-002-core-ticket-checkout-webhook-port.md) | Andrés checkout + webhook + wallet QR | 🟢 | 95% | APIs LIVE | (pre-Linear pack) |
| [EVP-004](../../../../tasks/archive/events-A/EVP-004-core-event-agent-port.md) | `eventAgent` Q&A | 🟢 | 100% | Registered in Mastra | — |
| [EVP-005](../../../../tasks/archive/events-A/EVP-005-core-event-tool-and-workflow.md) | `search_events` + DB workflow | 🟢 | 100% | Tool + `/api/events/search` | — |
| [EVP-006](../../../../tasks/archive/events-A/EVP-006-core-event-clarify-gate-and-chips.md) | Clarify gate + chips | 🟢 | 100% | SCREEN-006 branch | — |
| [EVP-007](../../../../tasks/archive/events-A/EVP-007-core-event-agent-prompt-and-sources.md) | Source registry + prompts | 🟢 | 100% | Registry + tests | — |
| [EVP-008](../../../../tasks/archive/events-A/EVP-008-core-event-draft-state-types.md) | `EventDraftState` Zod | 🟢 | 100% | Agent ↔ UI sync | — |
| [EVP-009](../../../../tasks/archive/events-A/EVP-009-core-host-event-agent.md) | `hostEventAgent` NL → draft | 🟢 | 100% | Gemini + Mastra | — |
| [EVP-010](../../../../tasks/archive/events-A/EVP-010-core-host-event-new-wizard.md) | `/host/event/new` wizard | 🟢 | 95% | Route LIVE | — |
| [EVP-011](../../../../tasks/archive/events-A/EVP-011-core-approval-panel-hitl.md) | HITL `ApprovalPanel` | 🟢 | 95% | `renderAndWaitForResponse` | — |
| [EVP-012](../../../../tasks/archive/events-A/EVP-012-core-approval-commit-edge-fn.md) | `/api/approval-commit` | 🟢 | 95% | Edge fn + `organizer_id` | — |
| [EVP-013](./archive/EVP-013-core-event-card-component.md) | EventCard component | 🟢 | 100% | [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) Done | SAN-117 |
| [EVP-017](../../../../tasks/archive/events-A/EVP-017-mvp-event-grounding-architecture.md) | Grounding architecture doc | 🟢 | 100% | Doc-only | — |

---

## Discovery pack — EVP-015 → EVP-028 (post-MVP gate)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action | Linear |
|------|-------------|--------|--:|--------------|---------------------|----------------|--------|
| [EVP-015](./tasks/MVP/EVP-015-mvp-grounded-event-discovery.md) | DB-first + cited web freshness | ⚪ | 20% | `/api/grounding/event-web`; citation UI hooks | Full acceptance not met | After SAN-115 | [SAN-119](https://linear.app/sanjiovani/issue/SAN-119) |
| [EVP-016](./tasks/MVP/EVP-016-mvp-event-maps-venue-integration.md) | Event map pins + venue binding | 🟡 | 40% | Map panel + event cards in chat | Event↔venue binding unproven | Wire pins E2E | [SAN-120](https://linear.app/sanjiovani/issue/SAN-120) |
| [EVP-018](./tasks/MVP/EVP-018-mvp-event-web-discovery-task-pack.md) | Parent pack (019–028) | ⚪ | 0% | Meta spec | Children not started | Queue after gates | [SAN-121](https://linear.app/sanjiovani/issue/SAN-121) |
| [EVP-019](./tasks/MVP/EVP-019-mvp-research-official-docs.md) | MCP doc verification | ⚪ | 0% | Spec | No MCP run logged | Run CopilotKit/Mastra/ADK MCP | [SAN-122](https://linear.app/sanjiovani/issue/SAN-122) |
| [EVP-020](./tasks/MVP/EVP-020-mvp-discovered-events-data-model.md) | `discovered_events` + RLS | ⚪ | 0% | Spec | **No migration** | Design SQL + RLS | [SAN-123](https://linear.app/sanjiovani/issue/SAN-123) |
| [EVP-021](./tasks/MVP/EVP-021-mvp-google-search-grounding.md) | Search Grounding templates | ⚪ | 15% | Partial grounding utils | No citation templates | After GS allowlist | [SAN-124](https://linear.app/sanjiovani/issue/SAN-124) |
| [EVP-022](./tasks/MVP/EVP-022-mvp-event-discovery-workflow.md) | Mastra discovery workflow | 🟡 | 25% | `event-discovery-workflow.ts` (DB-only stub) | No web merge + save path | Extend after 020 | [SAN-125](https://linear.app/sanjiovani/issue/SAN-125) |
| [EVP-023](./tasks/MVP/EVP-023-mvp-adk-search-maps-agents.md) | ADK SearchAgent + MapsAgent | ⚪ | 0% | Spec (Phase 2) | ADK sidecar not wired | Phase 2 only | [SAN-126](https://linear.app/sanjiovani/issue/SAN-126) |
| [EVP-024](./tasks/MVP/EVP-024-mvp-places-enrichment.md) | Places enrichment | ⚪ | 10% | Places API patterns elsewhere | No discovery field-mask proof | After 022 | [SAN-127](https://linear.app/sanjiovani/issue/SAN-127) |
| [EVP-025](./tasks/MVP/EVP-025-mvp-copilotkit-discovery-ui.md) | Discovery UI + attribution | ⚪ | 15% | `EventWebCitationFetch` | No save approval UI | After 022 | [SAN-128](https://linear.app/sanjiovani/issue/SAN-128) |
| [EVP-026](./tasks/MVP/EVP-026-mvp-human-approval-save-flow.md) | Human approval before save | ⚪ | 25% | HITL pattern from EVP-011 | No discovery save path | Reuse ApprovalPanel | [SAN-129](https://linear.app/sanjiovani/issue/SAN-129) |
| [EVP-027](./tasks/MVP/EVP-027-mvp-discovery-test-plan.md) | Discovery E2E test plan | ⚪ | 0% | Spec | No replay tests | Before 028 | [SAN-130](https://linear.app/sanjiovani/issue/SAN-130) |
| [EVP-028](./tasks/MVP/EVP-028-mvp-production-readiness.md) | Discovery prod readiness | ⚪ | 0% | Spec | Depends 019–027 | Last in pack | [SAN-131](https://linear.app/sanjiovani/issue/SAN-131) |

---

## Luma / social / advanced — EVP-029 → EVP-047

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action | Linear |
|------|-------------|--------|--:|--------------|---------------------|----------------|--------|
| [EVP-029](./tasks/ADV/EVP-029-advanced-sponsor-crm-lite.md) | Sponsor CRM-lite | ⚪ | 0% | Spec | No schema/UI | After commerce stable | [SAN-132](https://linear.app/sanjiovani/issue/SAN-132) |
| [EVP-030](./tasks/ADV/EVP-030-advanced-openclaw-postiz-approval-sandbox.md) | OpenClaw/Postiz sandbox | ⚪ | 0% | Spec | No sandbox | After 029 | [SAN-133](https://linear.app/sanjiovani/issue/SAN-133) |
| [EVP-031](./tasks/ADV/EVP-031-advanced-openclaw-automation-plan.md) | OpenClaw automation plan | ⚪ | 0% | Spec | Plan not written | Doc-only | [SAN-134](https://linear.app/sanjiovani/issue/SAN-134) |
| [EVP-032](./tasks/ADV/EVP-032-mvp-luma-event-detail-layout.md) | Luma-style `/events/[slug]` | 🟡 | 15% | Commerce page LIVE | Hero/vibe/attendee UX | Ship layout pass | [SAN-135](https://linear.app/sanjiovani/issue/SAN-135) **In Review** |
| [EVP-033](./tasks/ADV/EVP-033-mvp-event-vibe-ai-summary.md) | Vibe tags + AI summary | ⚪ | 0% | Spec | No model/UI | After 032 | [SAN-136](https://linear.app/sanjiovani/issue/SAN-136) |
| [EVP-034](./tasks/ADV/EVP-034-mvp-ask-host-ai-qa.md) | Ask Host + AI Q&A | ⚪ | 0% | Spec | No Q&A schema | After 032 | [SAN-137](https://linear.app/sanjiovani/issue/SAN-137) |
| [EVP-035](./tasks/ADV/EVP-035-mvp-attendee-profiles-audience-breakdown.md) | Attendee profiles | ⚪ | 0% | Spec | No opt-in model | After tickets | [SAN-138](https://linear.app/sanjiovani/issue/SAN-138) |
| [EVP-036](./tasks/ADV/EVP-036-mvp-community-map-nearby.md) | Community map + nearby | ⚪ | 0% | Spec | No event page map | After 016/032 | [SAN-139](https://linear.app/sanjiovani/issue/SAN-139) |
| [EVP-037](./tasks/ADV/EVP-037-mvp-concierge-event-decision-chat.md) | “Should I go?” concierge | ⚪ | 0% | Chat search only | No decision layer | After vibe data | [SAN-140](https://linear.app/sanjiovani/issue/SAN-140) |
| [EVP-038](./tasks/ADV/EVP-038-postmvp-ai-networking-matchmaking.md) | AI networking | ⚪ | 0% | Spec | Post-MVP | Phase 3+ | [SAN-141](https://linear.app/sanjiovani/issue/SAN-141) |
| [EVP-039](./tasks/ADV/EVP-039-postmvp-live-event-chat-rooms.md) | Live event chat | ⚪ | 0% | Spec | No Realtime chat | Post-MVP | [SAN-142](https://linear.app/sanjiovani/issue/SAN-142) |
| [EVP-040](./tasks/ADV/EVP-040-postmvp-post-event-follow-up.md) | Post-event follow-up | ⚪ | 0% | Spec | No flow | Post-MVP | [SAN-143](https://linear.app/sanjiovani/issue/SAN-143) |
| [EVP-041](./tasks/ADV/EVP-041-advanced-community-relationship-graph.md) | Relationship graph | ⚪ | 0% | Spec | Privacy open | Advanced | [SAN-144](https://linear.app/sanjiovani/issue/SAN-144) |
| [EVP-042](./tasks/ADV/EVP-042-mvp-smart-recommendations-compatibility.md) | Smart recommendations | ⚪ | 0% | Spec | No score UI | After 033/035 | [SAN-145](https://linear.app/sanjiovani/issue/SAN-145) |
| [EVP-043](./tasks/ADV/EVP-043-mvp-neighborhood-safety-transit-intelligence.md) | Safety/transit/weather | ⚪ | 0% | Spec | No Medellín context UI | After map | [SAN-146](https://linear.app/sanjiovani/issue/SAN-146) |
| [EVP-044](./tasks/ADV/EVP-044-mvp-whatsapp-community-links.md) | WhatsApp + community links | ⚪ | 0% | Spec | No link handling | Host-controlled | [SAN-147](https://linear.app/sanjiovani/issue/SAN-147) |
| [EVP-045](./tasks/ADV/EVP-045-mvp-host-pricing-moderation-basics.md) | Pricing suggestions + moderation | ⚪ | 0% | Spec | No queue | Suggestion-only | [SAN-148](https://linear.app/sanjiovani/issue/SAN-148) |
| [EVP-046](./tasks/ADV/EVP-046-mvp-live-event-updates.md) | Live updates feed | ⚪ | 0% | Spec | No feed | After attendee model | [SAN-149](https://linear.app/sanjiovani/issue/SAN-149) |
| [EVP-047](./tasks/ADV/EVP-047-postmvp-ai-night-itinerary-builder.md) | AI night itinerary | ⚪ | 0% | Spec | No planner | After 036/043 | [SAN-150](https://linear.app/sanjiovani/issue/SAN-150) |

---

## Platform stack — agents, tools, infra

| Layer | Component | Status | % | ✅ Confirmed | ⚠️ Gap | Real-world example |
|-------|-----------|--------|--:|--------------|--------|-------------------|
| **Gemini** | `conciergeAgent`, `eventAgent`, `hostEventAgent` | 🟢 | 95% | `gemini-3.5-flash` in Mastra | — | Roberto: “Jazz night Friday, 200 tickets” → draft filled |
| **Mastra** | Tools: `search_events`, rentals, grounded places | 🟢 | 90% | Registered + Vitest | Discovery workflow DB-only | Camila: “salsa this weekend” → cards |
| **Mastra** | `event-discovery-workflow` | 🟡 | 25% | Stub on disk | No web ingest/save | Patricia: scraped events not saved |
| **CopilotKit** | Chat cards, HITL, host wizard | 🟢 | 90% | v1.55.2 wired | Prod empty POST → **401** not 400 | Andrés buys from card CTA |
| **Supabase** | `events`, tickets, RLS, `hybrid_search_events` | 🟢 | 85% | RPC in `intelligence-event-search.ts` | `discovered_events` missing | PG vector hybrid search for events |
| **PG Vector** | `hybrid_search_events` RPC | 🟢 | 80% | Types + RPC calls | Not in discovery save path | Semantic “techno rooftop” search |
| **Maps / Places** | Event pins, venue enrichment | 🟡 | 45% | Map panel + markers | EVP-016 venue bind unproven | Tourist sees pin in El Poblado |
| **ADK** | SearchAgent + MapsAgent sidecar | ⚪ | 0% | Phase 2 spec only | Not in `mdeapp/` runtime | Deferred per CLAUDE.md |
| **OpenClaw / Postiz** | Sponsor + promo automation | ⚪ | 0% | Hostinger VPS exists | EVP-030/031 not started | No auto-post without approval |
| **Stripe** | Ticket checkout + webhooks | 🟢 | 90% | APIs LIVE; SAN-116 Done | G1 live paid proof in ledger | Andrés pays → QR in wallet |
| **Edge functions** | `approval-commit`, `ticket-payment-webhook` | 🟢 | 90% | On disk + tests | Prod evidence sparse | Publish commits after HITL |

---

## Persona journeys — production readiness

| Persona | Journey | Status | % | Example | Blocker |
|---------|---------|--------|--:|---------|---------|
| **Roberto** | NL wizard → HITL → publish → `/host/events` | 🟢 | 92% | “Medellín Tech Meetup” listed after publish | EVP-001 prod evidence |
| **Camila** | Chat → event cards → map pins | 🟢 | 88% | “salsa events this weekend” | SCREEN-006 clarify flake |
| **Andrés** | Detail → checkout → QR wallet | 🟡 | 85% | Buys from `/events/[slug]` | G1 deferred to EVP-001 |
| **Tourist** | Event detail + buy CTA | 🟢 | 80% | Luma layout still commerce-first | EVP-032 |
| **Patricia** | Discovery ops + sponsor CRM | ⚪ | 5% | No admin discovery queue | EVP-015–029 |

---

## Linear-only — venue + revenue (specs in `specs/`, not EVP-NNN)

These issues sit in the [Events Platform project](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues). UI specs: [`specs/venue-booking/`](./specs/venue-booking/) · Coverage: [`specs/LINEAR-COVERAGE.md`](./specs/LINEAR-COVERAGE.md)

### Venue booking track (EVT-033 → EVT-055)

| Linear | Title | Status | % | 💡 Next Action |
|--------|-------|--------|--:|----------------|
| [SAN-492](https://linear.app/sanjiovani/issue/SAN-492) | EVT-033 Event venue + offerings schema | ⚪ | 0% | VEN-001–007 depend on this |
| [SAN-493](https://linear.app/sanjiovani/issue/SAN-493) | EVT-034 Seed Mamacita + partners | ⚪ | 0% | After schema |
| [SAN-494](https://linear.app/sanjiovani/issue/SAN-494) | EVT-035 Restaurant card Event Venue CTA | ⚪ | 0% | Wire CTA on restaurant cards |
| [SAN-495](https://linear.app/sanjiovani/issue/SAN-495) | EVT-036 Event offerings detail panel | ⚪ | 0% | — |
| [SAN-496](https://linear.app/sanjiovani/issue/SAN-496) | EVT-037 Request proposal modal (HITL) | ⚪ | 0% | Reuse CopilotKit HITL |
| [SAN-497](https://linear.app/sanjiovani/issue/SAN-497) | EVT-038 `eventVenueAgent` + tools | ⚪ | 0% | New Mastra agent |
| [SAN-498](https://linear.app/sanjiovani/issue/SAN-498) | EVT-039 AI venue match score panel | ⚪ | 0% | — |
| [SAN-499](https://linear.app/sanjiovani/issue/SAN-499) | EVT-040 Compare venues side-by-side | ⚪ | 0% | — |
| [SAN-500](https://linear.app/sanjiovani/issue/SAN-500) | EVT-041 Host wizard venue step | ⚪ | 0% | Extend `/host/event/new` |
| [SAN-501](https://linear.app/sanjiovani/issue/SAN-501) | EVT-042 `eventVenueBookingWorkflow` | ⚪ | 0% | Mastra workflow |
| [SAN-502](https://linear.app/sanjiovani/issue/SAN-502) | EVT-043 Patricia admin queue | ⚪ | 0% | `/admin/*` |
| [SAN-503](https://linear.app/sanjiovani/issue/SAN-503) | EVT-044 Add booking to trip | ⚪ | 0% | Trips integration |
| [SAN-504](https://linear.app/sanjiovani/issue/SAN-504) | EVT-045 Venue availability calendar | ⚪ | 0% | Backlog |
| [SAN-505](https://linear.app/sanjiovani/issue/SAN-505) | EVT-046 Auto follow-up WA drafts | ⚪ | 0% | Backlog · OpenClaw |
| [SAN-506](https://linear.app/sanjiovani/issue/SAN-506) | EVT-047 Venue CRM | ⚪ | 0% | Backlog |
| [SAN-507](https://linear.app/sanjiovani/issue/SAN-507) | EVT-048 Dynamic package pricing | ⚪ | 0% | Backlog |
| [SAN-508](https://linear.app/sanjiovani/issue/SAN-508) | EVT-049 Sponsor ↔ venue match | ⚪ | 0% | Backlog |
| [SAN-509](https://linear.app/sanjiovani/issue/SAN-509) | EVT-050 OpenClaw venue enrichment | ⚪ | 0% | Backlog |
| [SAN-510](https://linear.app/sanjiovani/issue/SAN-510) | EVT-051 Wire: offerings panel | ⚪ | 0% | Wireframe track |
| [SAN-511](https://linear.app/sanjiovani/issue/SAN-511) | EVT-052 Wire: proposal modal | ⚪ | 0% | Wireframe track |
| [SAN-512](https://linear.app/sanjiovani/issue/SAN-512) | EVT-053 Wire: venue match panel | ⚪ | 0% | Wireframe track |
| [SAN-513](https://linear.app/sanjiovani/issue/SAN-513) | EVT-054 Wire: host wizard venue step | ⚪ | 0% | Wireframe track |
| [SAN-514](https://linear.app/sanjiovani/issue/SAN-514) | EVT-055 Wire: admin booking queue | ⚪ | 0% | Wireframe track |

### Revenue / promo (no EVP file)

| Linear | Title | Status | % | Notes |
|--------|-------|--------|--:|-------|
| [SAN-561](https://linear.app/sanjiovani/issue/SAN-561) | Event discovery depth + promo + in-chat upsell | ⚪ | 0% | Points to `tasks/revenue/C14`, `C15` — not events/tasks |

### Contest issues in project (scope creep — exclude from events %)

SAN-532→SAN-544 (**CTEST-000–012**) are contest platform issues attached to the same Linear project — **not** part of EVP backlog.

---

## Local-only — not on Linear (or no SAN link)

| Path | Role | Status | 💡 Action |
|------|------|--------|-----------|
| [wireframes/](./wireframes/INDEX.md) | SCR wireframes (discovery, wizard, tickets) | 🟡 | Link from SAN issues when implementing |
| [docs/events-prd.md](./docs/events-prd.md) | Canonical PRD | 🟢 | Source of truth for scope disputes |
| [docs/events-roadmap.md](./docs/events-roadmap.md) | Phase 1–5 roadmap | 🟢 | — |
| [docs/event-features-improvements-matrix.md](event-features-improvements-matrix.md) | Feature matrix | 🟢 | Planning reference |
| [docs/luma-inspired-event-ux-review.md](luma-inspired-event-ux-review.md) | Luma gap analysis | 🟢 | Feeds EVP-032 |
| [audit/01-audit-events-mvp.md](./audit/01-audit-events-mvp.md) | Forensic audit (2026-06-04) | 🟡 | **Stale** on EVP-014/G3 — refresh after this tracker |
| [tasks/notes-events.md](./tasks/notes-events.md) | Working notes | 🟡 | Not a Linear issue |
| [G3-core-host-publish-proof.md](./tasks/G3-core-host-publish-proof.md) | Ops proof spec | 🟡 | Linear = SAN-366 Done; local = Partial |

---

## Verification proof log (2026-06-08)

| Check | Command / path | Result |
|-------|----------------|--------|
| Event Vitest | `npm test -- --run event` | **97/97 pass** |
| Approval commit | `npm test -- --run approval-commit` | **9/9 pass** |
| Grounding | `npm test -- --run grounding` | **25/25 pass** |
| Host events grid | `npm test -- --run host-events` | **1/1 pass** |
| `/host/events` route | `src/app/host/events/page.tsx` | **EXISTS** |
| `organizer_id` on publish | `supabase/functions/approval-commit/build-event-insert.ts` | **SET** |
| `discovered_events` table | repo grep | **MISSING** |
| Prod GET `/` | `curl https://www.mdeai.co/` | **200** |
| Prod events API | `chat-smoke.mjs --base https://www.mdeai.co` | **PASS** (10 events) |
| Prod copilotkit empty | same script | **FAIL 401** (expected 400) |
| Linear P0 gates | MCP `list_issues` project Events Platform | SAN-115 Todo · 116/117/118/366 Done |
| Playwright SCREEN-006 | `e2e/screens/SCREEN-006-event-card.spec.ts` | **1 failed** (no dev server) |

---

## Priority queue (verified order)

```text
NOW:    SAN-115 EVP-001 ledger → SAN-730/731 UI polish → SAN-135 Luma
NEXT:   SAN-119 discovery when ledger green
LATER:  SAN-492+ venue · SAN-132 sponsor · UX screens (518,237,259)
```

See [`PLANNING-VERIFICATION.md`](./PLANNING-VERIFICATION.md) for full Linear ↔ local matrix.

---

## Top 25 priority tasks (ranked)

| # | Linear | Task | Impact | Effort | Phase |
|--:|--------|------|--------|--------|-------|
| 1 | SAN-115 | Launch proof ledger | P0 exit gate | M | MVP |
| 2 | SAN-730 | Enable host nav Events link | Roberto UX | S | Polish |
| 3 | SAN-731 | Detail skeleton + hero alt | a11y + perf | S | Polish |
| 4 | SAN-135 | Luma hero + host block | Tourist conversion | L | Growth |
| 5 | SAN-518 | Events browse evidence refresh | QA | S | UX |
| 6 | SAN-237 | Event detail SCREEN-014 | QA | M | UX |
| 7 | SAN-248 | Checkout → wallet deep link | Andrés loop | M | Commerce |
| 8 | SAN-660 | `/host` marketing landing | Host acquisition | L | Growth |
| 9 | SAN-119 | Grounded event discovery | Camila freshness | L | Discovery |
| 10 | SAN-123 | `discovered_events` schema | Discovery blocker | L | Discovery |
| 11 | SAN-128 | Discovery save UI | Patricia ops | L | Discovery |
| 12 | SAN-129 | Human approval save flow | Trust | M | Discovery |
| 13 | SAN-120 | Event map + venue bind | Map parity | M | Discovery |
| 14 | SAN-515 | `/admin/events` | Patricia ops | L | Admin |
| 15 | SAN-690 | Partner dashboard events tab | Host revenue | L | Growth |
| 16 | SAN-729 | Host analytics | Roberto KPIs | L | Growth |
| 17 | SAN-492 | Venue schema | Venue chain blocker | L | Venue |
| 18 | SAN-494 | Restaurant Event Venue CTA | Venue entry | M | Venue |
| 19 | SAN-496 | Proposal modal HITL | Roberto booking | L | Venue |
| 20 | SAN-502 | Admin booking queue | Patricia | L | Venue |
| 21 | SAN-664 | `/sponsors` landing | Revenue | L | Growth |
| 22 | SAN-132 | Sponsor CRM-lite | Patricia | L | Advanced |
| 23 | SAN-133 | OpenClaw/Postiz sandbox | Automation | L | Advanced |
| 24 | SAN-561 | Promo + in-chat upsell | Revenue | M | Revenue |
| 25 | SAN-732 | Spec pack parent + doc hygiene | Planning | S | Docs |

**Next PRs:** SAN-730 → SAN-731 → SAN-135 → SAN-115 ledger (docs-only for 115 first)

---

## Related indexes

- **Audit checklist:** [`prompts/03-checklist.md`](03-checklist.md)
- **Audit prompts:** [`prompts/01--events-prompt.md`](./prompts/01--events-prompt.md) · [`prompts/02-fix.md`](./prompts/02-fix.md)
- **UI pages inventory:** [`event-pages.md`](./event-pages.md)
- **Flow diagrams:** [`specs/DIAGRAMS.md`](./specs/DIAGRAMS.md)
- Detailed EVP table: [`tasks/INDEX.md`](./tasks/INDEX.md)
- Forensic audit: [`audit/01-audit-events-mvp.md`](./audit/01-audit-events-mvp.md)
- Cycle 1 P0 map: [`../../../../linear.md`](../../../../linear.md)
- Prod journey matrix: [`../../../../tasks/testing/09-prod-live-journey-matrix.md`](../../../../tasks/testing/09-prod-live-journey-matrix.md)
