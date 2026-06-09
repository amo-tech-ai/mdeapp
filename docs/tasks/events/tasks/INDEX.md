---
title: Events tasks index (EVP)
updated: 2026-06-08
canonical_prd: ../docs/events-prd.md
canonical_roadmap: ../docs/events-roadmap.md
parent_index: ../../INDEX.md
audit: ../audit/01-audit-events-mvp.md
planning_verification: ../PLANNING-VERIFICATION.md
legacy_map: ./LEGACY-ID-MAP.md
persona: Roberto (host) · Andres (tickets) · Camila (discovery) · Patricia (ops)
canonical_task_location: /home/sk/mdeai/tasks/events/tasks
ai_native_tasks: ./AI-native-system/index-aievents.md
plans:
  - ../../plan/events/event-discovery/10-event-discover-plan.md
  - ../../plan/events/event-discovery/11-openclaw-event-discovery.md
execution_map: ../docs/event-discovery-skill-routing.md
order: ../../notes/events/events-order.md
san366_audit: ../notes/events/san33-audit.md
---

# Events tasks — EVP index

> **Planning verification:** [`../PLANNING-VERIFICATION.md`](../PLANNING-VERIFICATION.md) · Linear snapshot **2026-06-08** (78 issues, **4 Done**)

> **Archived (live on Vercel):** Pack A [`../../archive/events-A/`](../../archive/events-A/README.md) · Pack B [`../archive/`](../archive/README.md) (EVP-013).  
> **Active backlog:** 35 specs in `MVP/` + `ADV/` + G3 proof task.

> **Wireframes:** [`../wireframes/INDEX.md`](../wireframes/INDEX.md)  
> **AI-native pack (AIE):** [`AI-native-system/index-aievents.md`](./AI-native-system/index-aievents.md) — 32 tasks Core→MVP→Advanced from [`04-AI-native-system`](../plans/04-AI-native-system.md)  
> **ID scheme:** `EVP-{NNN}-{tier}-{slug}.md` · `AIE-{NNN}-{tier}-{slug}.md`  
> **Legacy map:** [`LEGACY-ID-MAP.md`](./LEGACY-ID-MAP.md)

---

## Verification snapshot (2026-06-08)

| Gate | Result | Evidence |
|------|--------|----------|
| Vitest event suite | **97/97 pass** | `cd mdeapp && npm test -- --run event` |
| Host events grid | **1/1 pass** | `npm test -- --run host-events` |
| `/host/events` route | **LIVE** | `src/app/host/events/page.tsx` |
| Linear P0 gates | **4/5 Done** | SAN-117,118,116,366 Done · **SAN-115 Todo** |
| Playwright SCREEN-006 | **Flaky** | Re-run with dev server |

---

## Archived — live on Vercel 🟢

| Task | Description | Status | % | ✅ Confirmed | Surface |
|------|-------------|--------|---|--------------|---------|
| [EVP-002-core](../../archive/events-A/EVP-002-core-ticket-checkout-webhook-port.md) | Andrés ticket checkout, webhook, wallet, QR | 🟢 Done | 100% | Code + APIs LIVE; G1 prod proof deferred | `/api/tickets/*` · `/me/tickets` |
| [EVP-004-core](../../archive/events-A/EVP-004-core-event-agent-port.md) | `eventAgent` — event Q&A in chat | 🟢 Done | 100% | Agent registered; vitest pass | `/api/copilotkit` |
| [EVP-005-core](../../archive/events-A/EVP-005-core-event-tool-and-workflow.md) | `search_events` tool + DB workflow | 🟢 Done | 100% | Mastra tool + workflow on disk | Chat + `/api/events/search` |
| [EVP-006-core](../../archive/events-A/EVP-006-core-event-clarify-gate-and-chips.md) | Clarify gate + category chips | 🟢 Done | 100% | SCREEN-006 clarify branch pass | `/` concierge |
| [EVP-007-core](../../archive/events-A/EVP-007-core-event-agent-prompt-and-sources.md) | Trusted source registry + prompts | 🟢 Done | 100% | Registry + tests | Mastra agent |
| [EVP-008-core](../../archive/events-A/EVP-008-core-event-draft-state-types.md) | `EventDraftState` Zod contract | 🟢 Done | 100% | Types synced agent ↔ UI | Wizard state |
| [EVP-009-core](../../archive/events-A/EVP-009-core-host-event-agent.md) | `hostEventAgent` NL → draft | 🟢 Done | 100% | Gemini + Mastra registered | Host agent |
| [EVP-010-core](../../archive/events-A/EVP-010-core-host-event-new-wizard.md) | `/host/event/new` CopilotKit wizard | 🟢 Done | 95% | Route LIVE; authed publish E2E open (G3) | `/host/event/new` |
| [EVP-011-core](../../archive/events-A/EVP-011-core-approval-panel-hitl.md) | HITL `ApprovalPanel` | 🟢 Done | 95% | `renderAndWaitForResponse` wired | Wizard overlay |
| [EVP-012-core](../../archive/events-A/EVP-012-core-approval-commit-edge-fn.md) | `/api/approval-commit` → Supabase | 🟢 Done | 90% | Route + edge fn; `organizer_id` gap ([audit](../notes/events/san33-audit.md)) | API + edge |
| [EVP-013-core](../archive/EVP-013-core-event-card-component.md) | EventCard in chat + detail | 🟢 Done | 95% | SCREEN-006 9/9; `copilot/event-card.tsx` | Chat · `/events/[slug]` |
| [EVP-017-mvp](../../archive/events-A/EVP-017-mvp-event-grounding-architecture.md) | Grounding architecture doc | 🟢 Done | 100% | Doc-only; EVP-019–028 implement | Plan |

---

## Active Progress Task Tracker

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|-----------------|
| [G3-core](./G3-core-host-publish-proof.md) | Roberto prod publish proof — wizard → HITL → Supabase row | 🟢 Done (Linear) | 95% | Code + `organizer_id` on disk | No dated evidence file in repo | Capture prod SQL → EVP-001 · [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) Done |
| [EVP-001-core](./MVP/EVP-001-core-production-proof-gates.md) | Consolidated launch proof ledger (G1+G2+G3) | 🟥 Blocked | 10% | Surfaces exist on disk | **No evidence ledger** — P0 exit gate | Create ledger · [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) Todo |
| [EVP-003-core](./MVP/EVP-003-core-stripe-webhook-secret-audit.md) | Ticket vs sponsor Stripe webhook isolation | 🟢 Done (Linear) | 95% | Vitest + separate env vars | Local spec still Partial | Sync spec · [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) Done |
| [EVP-014-core](./MVP/EVP-014-core-host-events-list-page.md) | `/host/events` — Roberto's draft + published list | 🟢 Done | 88% | Page + RLS + Vitest | Nav link disabled · Playwright missing | [SAN-730](https://linear.app/sanjiovani/issue/SAN-730) · [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) Done |
| [EVP-015-mvp](./MVP/EVP-015-mvp-grounded-event-discovery.md) | DB-first + cited web freshness (Camila) | ⚪ Not Started | 15% | `/api/grounding/event-web` exists | Full acceptance not met | After G3 green · [SAN-119](https://linear.app/sanjiovani/issue/SAN-119) |
| [EVP-016-mvp](./MVP/EVP-016-mvp-event-maps-venue-integration.md) | Event map pins + venue binding | 🟡 In Progress | 35% | Map components + tests exist | Event↔venue binding not proven | Wire cards to pins · [SAN-120](https://linear.app/sanjiovani/issue/SAN-120) |
| [EVP-018-mvp](./MVP/EVP-018-mvp-event-web-discovery-task-pack.md) | Parent pack for web discovery (019–028) | ⚪ Not Started | 0% | Meta spec exists | Children not started | Queue post core proof |
| [EVP-019-mvp](./MVP/EVP-019-mvp-research-official-docs.md) | MCP doc verification (CopilotKit, Mastra, ADK) | ⚪ Not Started | 0% | Task exists | Docs not re-verified | Run MCP before build |
| [EVP-020-mvp](./MVP/EVP-020-mvp-discovered-events-data-model.md) | `discovered_events` schema + RLS | ⚪ Not Started | 0% | Task exists | No migration | Design SQL + RLS |
| [EVP-021-mvp](./MVP/EVP-021-mvp-google-search-grounding.md) | Search Grounding query templates | ⚪ Not Started | 0% | Task exists | No citation templates | After GS-001/003 |
| [EVP-022-mvp](./MVP/EVP-022-mvp-event-discovery-workflow.md) | Mastra discovery workflow (DB + web) | ⚪ Not Started | 0% | Task exists | No workflow proof | After schema |
| [EVP-023-mvp](./MVP/EVP-023-mvp-adk-search-maps-agents.md) | ADK SearchAgent + MapsAgent sidecar | ⚪ Not Started | 0% | Task exists | Phase 2 sidecar | MCP verify ADK |
| [EVP-024-mvp](./MVP/EVP-024-mvp-places-enrichment.md) | Places enrichment for candidates | ⚪ Not Started | 0% | Task exists | No field-mask proof | After workflow |
| [EVP-025-mvp](./MVP/EVP-025-mvp-copilotkit-discovery-ui.md) | Discovery UI — cited cards + approval | ⚪ Not Started | 0% | Task exists | No UI proof | After workflow |
| [EVP-026-mvp](./MVP/EVP-026-mvp-human-approval-save-flow.md) | Human approval before saving discoveries | ⚪ Not Started | 0% | Task exists | No save path | Reuse EVP-011 HITL pattern |
| [EVP-027-mvp](./MVP/EVP-027-mvp-discovery-test-plan.md) | Discovery E2E test plan | ⚪ Not Started | 0% | Task exists | No replay tests | Before EVP-028 |
| [EVP-028-mvp](./MVP/EVP-028-mvp-production-readiness.md) | Discovery production readiness | ⚪ Not Started | 0% | Task exists | Depends 019–027 | Last in discovery pack |
| [EVP-029-advanced](./ADV/EVP-029-advanced-sponsor-crm-lite.md) | Sponsor CRM-lite + proposal drafts (Patricia) | ⚪ Not Started | 0% | Task exists | No schema/UI | After commerce stable |
| [EVP-030-advanced](./ADV/EVP-030-advanced-openclaw-postiz-approval-sandbox.md) | OpenClaw/Postiz approval sandbox | ⚪ Not Started | 0% | Task exists | No sandbox | After EVP-029 |
| [EVP-031-advanced](./ADV/EVP-031-advanced-openclaw-automation-plan.md) | OpenClaw automation plan (doc only) | ⚪ Not Started | 0% | Task exists | Plan not written | After EVP-030 |
| [EVP-032-mvp](./ADV/EVP-032-mvp-luma-event-detail-layout.md) | Luma-style `/events/[slug]` layout | 🟡 In Progress | 10% | Spec + wireframe; commerce page LIVE | Hero/vibe/attendee UX missing | After EVP-014 · [SAN-135](https://linear.app/sanjiovani/issue/SAN-135) |
| [EVP-033-mvp](./ADV/EVP-033-mvp-event-vibe-ai-summary.md) | Vibe tags + AI summary | ⚪ Not Started | 0% | Task exists | No model/UI | After EVP-032 |
| [EVP-034-mvp](./ADV/EVP-034-mvp-ask-host-ai-qa.md) | Ask Host + AI Q&A | ⚪ Not Started | 0% | Task exists | No Q&A schema | After EVP-032 |
| [EVP-035-mvp](./ADV/EVP-035-mvp-attendee-profiles-audience-breakdown.md) | Attendee profiles + audience breakdown | ⚪ Not Started | 0% | Task exists | No opt-in model | After tickets stable |
| [EVP-036-mvp](./ADV/EVP-036-mvp-community-map-nearby.md) | Community map + nearby places | ⚪ Not Started | 0% | Task exists | No event page map | After EVP-016/032 |
| [EVP-037-mvp](./ADV/EVP-037-mvp-concierge-event-decision-chat.md) | “Should I go?” decision concierge | ⚪ Not Started | 0% | Task exists | Chat searches only | After vibe + attendee data |
| [EVP-038-postmvp](./ADV/EVP-038-postmvp-ai-networking-matchmaking.md) | AI networking + icebreakers | ⚪ Not Started | 0% | Task exists | Needs opt-in profiles | Post-MVP social |
| [EVP-039-postmvp](./ADV/EVP-039-postmvp-live-event-chat-rooms.md) | Live event chat rooms | ⚪ Not Started | 0% | Task exists | No Realtime chat | Post-MVP social |
| [EVP-040-postmvp](./ADV/EVP-040-postmvp-post-event-follow-up.md) | Post-event follow-up assistant | ⚪ Not Started | 0% | Task exists | No follow-up flow | Post-MVP social |
| [EVP-041-advanced](./ADV/EVP-041-advanced-community-relationship-graph.md) | Community relationship graph | ⚪ Not Started | 0% | Task exists | Privacy design open | Advanced |
| [EVP-042-mvp](./ADV/EVP-042-mvp-smart-recommendations-compatibility.md) | Smart recommendations + compatibility | ⚪ Not Started | 0% | Task exists | No score UI | After EVP-033/035 |
| [EVP-043-mvp](./ADV/EVP-043-mvp-neighborhood-safety-transit-intelligence.md) | Safety, transit, weather on event pages | ⚪ Not Started | 0% | Task exists | No Medellín context UI | After map context |
| [EVP-044-mvp](./ADV/EVP-044-mvp-whatsapp-community-links.md) | WhatsApp + community links (no auto-send) | ⚪ Not Started | 0% | Task exists | No link handling | Host-controlled links |
| [EVP-045-mvp](./ADV/EVP-045-mvp-host-pricing-moderation-basics.md) | AI pricing suggestions + moderation | ⚪ Not Started | 0% | Task exists | No moderation queue | Suggestion-only |
| [EVP-046-mvp](./ADV/EVP-046-mvp-live-event-updates.md) | Host live event updates feed | ⚪ Not Started | 0% | Task exists | No update feed | After attendee model |
| [EVP-047-postmvp](./ADV/EVP-047-postmvp-ai-night-itinerary-builder.md) | AI night itinerary around events | ⚪ Not Started | 0% | Task exists | No planner flow | After EVP-036/043 |

**Status legend:** 🟢 Complete · 🟡 In Progress · ⚪ Not Started · 🟥 Blocked

---

## Progress Summary

| Tier | Tasks | Shipped | Avg % (active) | Production readiness |
|------|------:|--------:|---------------:|----------------------|
| **Archived LIVE** | 12 | 12 | 97% | 🟢 Core host + chat + commerce **code** on Vercel |
| **Launch proof** | G3 + 001 + 003 | 2/3 Linear Done | 67% | 🟡 SAN-115 ledger open |
| **Core gap** | 014 | 1/1 Done | 88% | 🟢 polish via SAN-730 |
| **Discovery (015–028)** | 14 | 0 | 4% | ⚪ Post-MVP — intentionally queued |
| **Luma/social (032–047)** | 16 | 0 | 1% | ⚪ Post-MVP product layer |
| **Advanced (029–031)** | 3 | 0 | 0% | ⚪ Deferred |
| **Overall (47 + G3)** | 48 | 16 | **38%** | 🟡 **Discovery Beta** — SAN-115 is P0 exit gate |

### Persona north-star status

| Persona | Journey | Status |
|---------|---------|--------|
| **Roberto** | Create event → approve → see on `/host/events` | 🟢 Wizard + list LIVE; nav polish + ledger open |
| **Camila** | Ask for events → cards in chat | 🟢 SAN-117 Done |
| **Andrés** | Buy ticket → wallet QR | 🟡 Code LIVE; G1 proof in SAN-115 ledger |
| **Tourist** | Event detail + buy CTA | 🟢 Commerce LIVE; Luma SAN-135 In Review |
| **Patricia** | Sponsor CRM / discovery ops | ⚪ EVP-029+ deferred |

---

## Implementation order

See [`../notes/events/events-order.md`](../notes/events/events-order.md) · **AI-native:** [`AI-native-system/index-aievents.md`](./AI-native-system/index-aievents.md)

```text
NOW:    AIE-001 SAN-115 → AIE-002 SAN-730 → AIE-005–009 hostOps analytics
NEXT:   AIE-011–012 venues · AIE-013–019 MVP intelligence
LATER:  EVP-015–028 discovery · AIE-027+ Advanced agents
```

---

## Rules

- Supabase = event/ticket truth · Stripe = money · Mastra orchestrates · CopilotKit renders UI · Gemini only.
- Search grounding — **no auto-publish** (EVP-026).
- OpenClaw/Postiz only after EVP-029/030.
- No **Done** without dated evidence (`tasks/notes/`); refresh via EVP-001.
- Shipped specs → [`../archive/`](../archive/README.md) or [`../../archive/events-A/`](../../archive/events-A/README.md).

---

## Notes (not EVP tasks)

| File | Role |
|------|------|
| [../docs/F-39-prompt-event-search.md](F-39-prompt-event-search.md) | Discovery prompt source |
| [../docs/luma-inspired-event-ux-review.md](luma-inspired-event-ux-review.md) | Luma UX gap analysis |
| [../docs/event-features-improvements-matrix.md](event-features-improvements-matrix.md) | Feature matrix |
| [../notes/events/san33-audit.md](../notes/events/san33-audit.md) | SAN-366 forensic audit |
| [../notes/events/events-order.md](../notes/events/events-order.md) | Build order |
