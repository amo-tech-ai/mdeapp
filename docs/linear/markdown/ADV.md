# 🔮 ADVANCED — Post-MVP Roadmap
> Phase 2 / Post-Launch Features | Updated: 2026-06-08 (SAN-850–854 sync)

**Legend:** 🟢 Complete · 🟡 In Progress · ⚪ Not Started · 🔴 Failed/Canceled

> ⚠️ **All issues in this file require CopilotKit v2 migration OR are explicitly post-launch scope.**

---

## 🧠 AI & Intelligence (Post-MVP)
> 36 issues · 🟢 0 done · 🟡 0 WIP · ⚪ 35 not started · Score: **15/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| ⚪ | [SAN-151](https://linear.app/sanjiovani/issue/SAN-151) | pgvector inventory + duplicate HNSW cleanup plan | pgvector + Supabase | High | 20 | F | 🔮 Platform — Vector |
| ⚪ | [SAN-152](https://linear.app/sanjiovani/issue/SAN-152) | Semantic V1 schema + RLS plan | Supabase RLS | High | 20 | F | Blocked: SAN-153, SAN-151 · 🔮 Platform — Vector |
| ⚪ | [SAN-153](https://linear.app/sanjiovani/issue/SAN-153) | Model registry + embedding contract | pgvector + Supabase | High | 20 | F | Blocked: SAN-151 · 🔮 Platform — Vector |
| ⚪ | [SAN-154](https://linear.app/sanjiovani/issue/SAN-154) | Embedding text builders | pgvector + Supabase | High | 20 | F | Blocked: SAN-153, SAN-152 · 🔮 Platform — Vector |
| ⚪ | [SAN-155](https://linear.app/sanjiovani/issue/SAN-155) | Golden semantic eval harness | pgvector + Supabase | High | 20 | F | Blocked: SAN-154, SAN-153, SAN-152 · 🔮 Platform — Vector |
| ⚪ | [SAN-157](https://linear.app/sanjiovani/issue/SAN-157) | Coffee-tour vector compatibility | pgvector + Supabase | High | 20 | F | Blocked: SAN-168, SAN-158, SAN-156, SAN-155, SAN-154, SAN-152 · 🔮 Platform — Vector |
| ⚪ | [SAN-465](https://linear.app/sanjiovani/issue/SAN-465) | ADK sidecar compute_routes (Grounding Lite MCP) | Google Maps JS | High | 20 | F | 🗺️ Maps — P1 Hardening |
| ⚪ | [SAN-101](https://linear.app/sanjiovani/issue/SAN-101) | ADK LlmAgent + McpToolset package (Phase 2) | Google Maps JS | Medium | 20 | F | 🔮 Vectors & Rerank |
| ⚪ | [SAN-122](https://linear.app/sanjiovani/issue/SAN-122) | Research official docs (CopilotKit, Mastra, ADK, G… | Google Maps JS | Medium | 20 | F | — |
| ⚪ | [SAN-124](https://linear.app/sanjiovani/issue/SAN-124) | Google Search Grounding query templates | ADK + Cloud Run | Medium | 20 | F | Blocked: SAN-126 |
| ⚪ | [SAN-126](https://linear.app/sanjiovani/issue/SAN-126) | ADK SearchAgent + MapsAgent sidecar | Google Maps JS | Medium | 20 | F | Blocked: SAN-122 |
| ⚪ | [SAN-169](https://linear.app/sanjiovani/issue/SAN-169) | coffee_tour_embeddings + server embed job | Google Maps JS | Medium | 20 | F | Blocked: SAN-168, SAN-158 |
| ⚪ | [SAN-170](https://linear.app/sanjiovani/issue/SAN-170) | verifyCoffeeTourSources (Search Grounding) | Google Maps JS | Medium | 20 | F | Blocked: SAN-158 |
| ⚪ | [SAN-171](https://linear.app/sanjiovani/issue/SAN-171) | ADK discovery merge into coffee_tours staging | Google Maps JS | Medium | 20 | F | Blocked: SAN-162, SAN-158 |
| ⚪ | [SAN-172](https://linear.app/sanjiovani/issue/SAN-172) | saveCoffeeTour + user interactions RLS | Supabase RLS | Medium | 20 | F | Blocked: SAN-165, SAN-158 |
| ⚪ | [SAN-487](https://linear.app/sanjiovani/issue/SAN-487) | Rental preference memory (pgvector + ranking) | pgvector + Supabase | Medium | 20 | F | 🔮 RE Browse & Detail |
| 🟢 | [SAN-388](https://linear.app/sanjiovani/issue/SAN-388) | SEARCH-003 — Restaurant hybrid search | pgvector + Supabase | High | 100 | A+ | ✓ Done · MIS-M1 |
| ⚪ | [SAN-384](https://linear.app/sanjiovani/issue/SAN-384) | DATA-046 — Golden queries v2 harness | Vitest + Playwright | High | 10 | F | MIS Phase 1b |
| ⚪ | [SAN-395](https://linear.app/sanjiovani/issue/SAN-395) | AI-003 — Signal enrichment batch | Gemini 3.5 Flash | Medium | 10 | F | MIS Phase 1b |
| ⚪ | [SAN-396](https://linear.app/sanjiovani/issue/SAN-396) | AI-004 — Grounding verify batch | ADK + Cloud Run | Medium | 10 | F | MIS Phase 1b |
| ⚪ | [SAN-607](https://linear.app/sanjiovani/issue/SAN-607) | Workflow error handling + compensation (checkout /… | Mastra + LibSQL | High | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-809](https://linear.app/sanjiovani/issue/SAN-809) | onboardingCompletionWorkflow: background nudges + … | Mastra + LibSQL | High | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-810](https://linear.app/sanjiovani/issue/SAN-810) | leadFollowUpWorkflow: Mastra engine for 24/48h rem… | Mastra + LibSQL | High | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-597](https://linear.app/sanjiovani/issue/SAN-597) | Resource-scoped working memory (durable prefs) | Mastra + LibSQL | Medium | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-599](https://linear.app/sanjiovani/issue/SAN-599) | Tool output shaping (toModelOutput) + per-intent a… | Google Maps JS | Medium | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-600](https://linear.app/sanjiovani/issue/SAN-600) | Background tasks for slow grounding / web-search | ADK + Cloud Run | Medium | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-601](https://linear.app/sanjiovani/issue/SAN-601) | Checkout workflow (Mastra, deterministic + idempot… | Mastra + LibSQL | Medium | 10 | F | Blocked: SAN-178 · 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-602](https://linear.app/sanjiovani/issue/SAN-602) | Host publish workflow (validate → preview → publis… | Mastra + LibSQL | Medium | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-608](https://linear.app/sanjiovani/issue/SAN-608) | Suspend & resume for host event creation | Mastra + LibSQL | Medium | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-609](https://linear.app/sanjiovani/issue/SAN-609) | Progressive tool streaming (context.writer) for pe… | Mastra + LibSQL | Medium | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-610](https://linear.app/sanjiovani/issue/SAN-610) | Memory processors: preference / budget / neighborh… | Google Maps JS | Medium | 10 | F | 🚀 AGT — Phase 3: Advanced |
| ⚪ | [SAN-748](https://linear.app/sanjiovani/issue/SAN-748) | AGT-adminOps — adminOpsAgent exception digest on /… | Gemini 3.5 Flash | Medium | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-751](https://linear.app/sanjiovani/issue/SAN-751) | AGT-crmAgent — crmAgent: lead stage-move + bulk me… | Gemini 3.5 Flash | Medium | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-195](https://linear.app/sanjiovani/issue/SAN-195) | OpenClaw web_search — Gemini grounding provider | ADK + Cloud Run | Low | 10 | F | Blocked: SAN-192 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-850](https://linear.app/sanjiovani/issue/SAN-850) | Recommendation Engine (events, rentals, restaurants) | Gemini 3.5 Flash | Medium | 10 | F | Cross-entity · post-browse |
| ⚪ | [SAN-851](https://linear.app/sanjiovani/issue/SAN-851) | Follow-up Suggestions — re-engage Camila | CopilotKit 1.55.2 | Medium | 10 | F | Working memory + browse history |
| ⚪ | [SAN-852](https://linear.app/sanjiovani/issue/SAN-852) | AI Concierge Insights for admin — search analytics | Gemini 3.5 Flash | Medium | 10 | F | `/admin/ai-insights` |
| ⚪ | [SAN-603](https://linear.app/sanjiovani/issue/SAN-603) | Semantic recall (pgvector) for "the apartment I li… | Mastra + LibSQL | Low | 10 | F | 🚀 AGT — Phase 3: Advanced |
| ⚪ | [SAN-604](https://linear.app/sanjiovani/issue/SAN-604) | Phase-2 interop spike: Channels (WhatsApp) + A2A/A… | Mastra + LibSQL | Low | 10 | F | 🚀 AGT — Phase 3: Advanced |
| 🧊 | [SAN-444](https://linear.app/sanjiovani/issue/SAN-444) | UX-018 — ADK grounding URL on Vercel | ADK + Cloud Run | Medium | 10 | F | Phase 2 · wireframes/ux |
| ⚪ | [SAN-231](https://linear.app/sanjiovani/issue/SAN-231) | GS-009 — Sponsor research (Search grounding) | Google Maps JS | Low | 10 | F | 🔮 Search — Grounding |

## 🤝 Partner AI Layer (Phase 2)
> 11 issues · 🟢 0 done · 🟡 0 WIP · ⚪ 11 not started · Score: **11/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| ⚪ | [SAN-132](https://linear.app/sanjiovani/issue/SAN-132) | Sponsor CRM-lite + proposal drafts | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-115 |
| ⚪ | [SAN-802](https://linear.app/sanjiovani/issue/SAN-802) | Business health score widget (MVP) | Next.js 16 + Tailwind v4 | Urgent | 10 | F | M4 |
| ⚪ | [SAN-803](https://linear.app/sanjiovani/issue/SAN-803) | AI Partner Workspace: Copilot Sidebar as primary p… | CopilotKit 1.55.2 | Urgent | 10 | F | M4 |
| ⚪ | [SAN-800](https://linear.app/sanjiovani/issue/SAN-800) | Signup wizard: business auto-fill from Places API | Supabase Auth | High | 10 | F | M4 |
| ⚪ | [SAN-801](https://linear.app/sanjiovani/issue/SAN-801) | Dashboard "Needs Attention" AI panel | Next.js 16 + Tailwind v4 | High | 10 | F | M4 |
| ⚪ | [SAN-804](https://linear.app/sanjiovani/issue/SAN-804) | Lead & Booking Copilot: scoring, reply drafts, HIT… | CopilotKit 1.55.2 | High | 10 | F | M4 |
| ⚪ | [SAN-805](https://linear.app/sanjiovani/issue/SAN-805) | Dynamic pricing intelligence (venue & rental) | Vercel + Next.js | High | 10 | F | M4 |
| ⚪ | [SAN-685](https://linear.app/sanjiovani/issue/SAN-685) | Partner AI copilot (capability sets, tools, HITL) | CopilotKit 1.55.2 | Medium | 10 | F | M4 |
| ⚪ | [SAN-705](https://linear.app/sanjiovani/issue/SAN-705) | AGT-PTR-01 — partnerAgent foundation | Mastra + LibSQL | Urgent | 10 | F | Blocked: SAN-683 · M4 |
| ⚪ | [SAN-706](https://linear.app/sanjiovani/issue/SAN-706) | AGT-PTR-02 — Partner-scoped Supabase tools | Mastra + LibSQL | Urgent | 10 | F | Blocked: SAN-683, SAN-705 · M4 |
| ⚪ | [SAN-709](https://linear.app/sanjiovani/issue/SAN-709) | AGT-PTR-03 — Onboarding copilot (/partners/signup) | CopilotKit 1.55.2 | High | 10 | F | Blocked: SAN-705, SAN-706 · M4 |
| ⚪ | [SAN-707](https://linear.app/sanjiovani/issue/SAN-707) | AGT-PTR-04 — Dashboard copilot shell (/dashboard) | CopilotKit 1.55.2 | High | 10 | F | Blocked: SAN-705, SAN-706 · M4 |
| ⚪ | [SAN-708](https://linear.app/sanjiovani/issue/SAN-708) | AGT-PTR-05 — Lead qualification + HITL reply draft | CopilotKit 1.55.2 | High | 10 | F | Blocked: SAN-706, SAN-711 · M4 |
| ⚪ | [SAN-711](https://linear.app/sanjiovani/issue/SAN-711) | AGT-PTR-06 — Partner HITL policy module | Mastra + LibSQL | Medium | 10 | F | Blocked: SAN-705 · M4 |
| ⚪ | [SAN-710](https://linear.app/sanjiovani/issue/SAN-710) | AGT-PTR-07 — Concierge lead partner_id attribution | Mastra + LibSQL | Medium | 10 | F | Blocked: SAN-683, SAN-706 · M4 |
| ⚪ | [SAN-806](https://linear.app/sanjiovani/issue/SAN-806) | Auto follow-up reminder workflow (24/48h nudge wit… | Mastra + LibSQL | Medium | 10 | F | M4 |
| ⚪ | [SAN-854](https://linear.app/sanjiovani/issue/SAN-854) | AI Generated Weekly Reports for partners | Gemini 3.5 Flash | Medium | 10 | F | Email push · venue/event promoters |
| ⚪ | [SAN-216](https://linear.app/sanjiovani/issue/SAN-216) | Events — sponsor proposal draft pack | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-215, SAN-205, SAN-132 · 🔮 Automation — OpenClaw |

## 🤝 Partner CRM (CRM-001–012)
> 11 issues · 🟢 0 done · 🟡 0 WIP · ⚪ 11 not started · Score: **10/100 F** · Tracker: [`partners.md`](./partners.md)

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| ⚪ | [SAN-811](https://linear.app/sanjiovani/issue/SAN-811) | CRM-001 — Partner schema + RLS (9 tables) | Supabase RLS | High | 10 | F | Blocked: SAN-683 · M4 |
| ⚪ | [SAN-812](https://linear.app/sanjiovani/issue/SAN-812) | CRM-002 — Partner signup + auth flow | Supabase Auth | High | 10 | F | Reconcile SAN-723 Done |
| ⚪ | [SAN-813](https://linear.app/sanjiovani/issue/SAN-813) | CRM-003 — Onboarding wizard (manual, no AI) | Next.js 16 + Tailwind v4 | High | 10 | F | Reconcile SAN-723 Done |
| ⚪ | [SAN-814](https://linear.app/sanjiovani/issue/SAN-814) | CRM-004 — Partner profile + edit UI | Next.js 16 + Tailwind v4 | Medium | 10 | F | M4 |
| ⚪ | [SAN-815](https://linear.app/sanjiovani/issue/SAN-815) | CRM-005 — Dashboard shell + static widgets | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-690 · M4 |
| ⚪ | [SAN-816](https://linear.app/sanjiovani/issue/SAN-816) | CRM-006 — Leads inbox | Next.js 16 + Supabase | High | 10 | F | M4 |
| ⚪ | [SAN-817](https://linear.app/sanjiovani/issue/SAN-817) | CRM-007 — Bookings management | Next.js 16 + Supabase | Medium | 10 | F | Blocked: SAN-686 · M4 |
| ⚪ | [SAN-818](https://linear.app/sanjiovani/issue/SAN-818) | CRM-008 — Revenue tracking (ledger + charts) | Stripe + Next.js | Medium | 10 | F | M4 |
| ⚪ | [SAN-819](https://linear.app/sanjiovani/issue/SAN-819) | CRM-009 — Health score (server-side, no AI) | Next.js 16 + Tailwind v4 | Medium | 10 | F | M4 |
| ⚪ | [SAN-820](https://linear.app/sanjiovani/issue/SAN-820) | CRM-010 — Notifications (bell + mark-read) | Next.js 16 + Supabase | Medium | 10 | F | M4 |
| ⚪ | [SAN-821](https://linear.app/sanjiovani/issue/SAN-821) | CRM-011 — Mastra CRM tools foundation | Mastra + LibSQL | Medium | 10 | F | Phase 2 AI · M4 |

## 🗺️ Trips Module
> 46 issues · 🟢 0 done · 🟡 0 WIP · ⚪ 45 not started · Score: **17/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| ⚪ | [SAN-283](https://linear.app/sanjiovani/issue/SAN-283) | Booking reconciliation repair worker | Vercel + Next.js | High | 20 | F | Blocked: SAN-282 · 🔮 Trips — Hardening |
| ⚪ | [SAN-284](https://linear.app/sanjiovani/issue/SAN-284) | Trips RLS penetration verification | Supabase RLS | High | 20 | F | Blocked: SAN-273, SAN-275, SAN-281, SAN-279 · 🔮 Trips — Hardening |
| ⚪ | [SAN-285](https://linear.app/sanjiovani/issue/SAN-285) | Places cache + itinerary hydration | Google Maps JS | High | 20 | F | Blocked: SAN-280 |
| ⚪ | [SAN-286](https://linear.app/sanjiovani/issue/SAN-286) | Mobile workspace UX hardening | Google Maps JS | High | 20 | F | Blocked: SAN-280, SAN-281, SAN-276 |
| ⚪ | [SAN-287](https://linear.app/sanjiovani/issue/SAN-287) | Trips observability + sync logs | Google Maps JS | High | 20 | F | Blocked: SAN-283, SAN-282, SAN-281 |
| ⚪ | [SAN-288](https://linear.app/sanjiovani/issue/SAN-288) | Trip lifecycle states + archival rules | Google Maps JS | High | 20 | F | Blocked: SAN-273, SAN-275, SAN-276 |
| ⚪ | [SAN-289](https://linear.app/sanjiovani/issue/SAN-289) | Retry + optimistic UI recovery | Google Maps JS | High | 20 | F | Blocked: SAN-278, SAN-279 |
| ⚪ | [SAN-745](https://linear.app/sanjiovani/issue/SAN-745) | publishEventWorkflow: Stripe price.create + Supaba… | Mastra + LibSQL | High | 20 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-119](https://linear.app/sanjiovani/issue/SAN-119) | Grounded event discovery | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-115 |
| ⚪ | [SAN-121](https://linear.app/sanjiovani/issue/SAN-121) | Event web discovery — future task pack (EVP-019…02… | Mastra + LibSQL | Medium | 20 | F | — |
| ⚪ | [SAN-123](https://linear.app/sanjiovani/issue/SAN-123) | Discovered events data model + RLS | Supabase RLS | Medium | 20 | F | Blocked: SAN-122 |
| ⚪ | [SAN-125](https://linear.app/sanjiovani/issue/SAN-125) | eventDiscoveryWorkflow (Mastra) | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-123 |
| ⚪ | [SAN-127](https://linear.app/sanjiovani/issue/SAN-127) | Places API enrichment for discovered events | Google Maps JS | Medium | 20 | F | Blocked: SAN-125 |
| ⚪ | [SAN-128](https://linear.app/sanjiovani/issue/SAN-128) | CopilotKit discovery UI (cards, attribution, appro… | CopilotKit 1.55.2 | Medium | 20 | F | Blocked: SAN-125 |
| ⚪ | [SAN-129](https://linear.app/sanjiovani/issue/SAN-129) | Human approval save flow | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-123 |
| ⚪ | [SAN-130](https://linear.app/sanjiovani/issue/SAN-130) | Discovery test plan | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-128 |
| ⚪ | [SAN-131](https://linear.app/sanjiovani/issue/SAN-131) | Production readiness checklist | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-130 |
| ⚪ | [SAN-136](https://linear.app/sanjiovani/issue/SAN-136) | Event vibe tags and AI summary | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-135 |
| ⚪ | [SAN-137](https://linear.app/sanjiovani/issue/SAN-137) | Ask Host and AI Q&A assistant | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-135 |
| ⚪ | [SAN-138](https://linear.app/sanjiovani/issue/SAN-138) | Attendee profiles and audience breakdown | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-135 |
| ⚪ | [SAN-139](https://linear.app/sanjiovani/issue/SAN-139) | Community, map, and nearby intelligence | Google Maps JS | Medium | 20 | F | Blocked: SAN-135, SAN-127, SAN-120 |
| ⚪ | [SAN-140](https://linear.app/sanjiovani/issue/SAN-140) | AI event decision concierge | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-138, SAN-136 |
| ⚪ | [SAN-142](https://linear.app/sanjiovani/issue/SAN-142) | Live event chat and networking rooms | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-141, SAN-138 |
| ⚪ | [SAN-143](https://linear.app/sanjiovani/issue/SAN-143) | Post-event follow-up assistant | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-141 |
| ⚪ | [SAN-145](https://linear.app/sanjiovani/issue/SAN-145) | Smart event recommendations and compatibility scor… | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-140, SAN-138, SAN-136 |
| ⚪ | [SAN-146](https://linear.app/sanjiovani/issue/SAN-146) | Neighborhood, safety, transit, and weather intelli… | Google Maps JS | Medium | 20 | F | Blocked: SAN-139, SAN-127, SAN-120 |
| ⚪ | [SAN-148](https://linear.app/sanjiovani/issue/SAN-148) | Host pricing suggestions and moderation basics | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-137 |
| ⚪ | [SAN-150](https://linear.app/sanjiovani/issue/SAN-150) | AI night itinerary builder | Mastra + LibSQL | Medium | 20 | F | Blocked: SAN-146, SAN-140, SAN-139 |
| ⚪ | [SAN-173](https://linear.app/sanjiovani/issue/SAN-173) | CoffeeTourCompareDrawer + compareCoffeeTours | Google Maps JS | Medium | 20 | F | Blocked: SAN-165 |
| ⚪ | [SAN-174](https://linear.app/sanjiovani/issue/SAN-174) | Coffee tour intent chips on ChatQueryBar | Google Maps JS | Medium | 20 | F | Blocked: SAN-162 |
| ⚪ | [SAN-176](https://linear.app/sanjiovani/issue/SAN-176) | Extract coffeeTourSearchWorkflow from concierge | Google Maps JS | Medium | 20 | F | Blocked: SAN-168, SAN-162 |
| ⚪ | [SAN-481](https://linear.app/sanjiovani/issue/SAN-481) | Booking + payment prep (rental Stripe) | Stripe + Next.js | Medium | 20 | F | 🔮 RE Browse & Detail |
| ⚪ | [SAN-552](https://linear.app/sanjiovani/issue/SAN-552) | Agency agent + /advertise Agency section | Gemini 3.5 Flash | Urgent | 10 | F | Blocked: SAN-368, SAN-550, SAN-178, SAN-115 |
| ⚪ | [SAN-559](https://linear.app/sanjiovani/issue/SAN-559) | Nightlife VIP table booking + Stripe deposit | PostgreSQL | High | 10 | F | Blocked: SAN-551 |
| ⚪ | [SAN-561](https://linear.app/sanjiovani/issue/SAN-561) | Event discovery depth + promo codes + in-chat tick… | Stripe + Next.js | High | 10 | F | — |
| ⚪ | [SAN-562](https://linear.app/sanjiovani/issue/SAN-562) | Rental lead qualification + metered lead billing (… | Gemini 3.5 Flash | High | 10 | F | Blocked: SAN-473 |
| 🔴 | [SAN-563](https://linear.app/sanjiovani/issue/SAN-563) | CK checkout widget (dup REV-C2) | CopilotKit 1.55.2 | High | 0 | F | Dup: SAN-551 |
| ⚪ | [SAN-651](https://linear.app/sanjiovani/issue/SAN-651) | Stripe Connect Express | Stripe + Next.js | High | 10 | F | Blocked: SAN-647, SAN-649 · M4 - Marketplace vendors and Connect |
| ⚪ | [SAN-133](https://linear.app/sanjiovani/issue/SAN-133) | OpenClaw/Postiz approval sandbox | Mastra + LibSQL | Medium | 10 | F | Blocked: SAN-132 |
| ⚪ | [SAN-134](https://linear.app/sanjiovani/issue/SAN-134) | OpenClaw automation plan (no implementation) | Mastra + LibSQL | Medium | 10 | F | Blocked: SAN-128 |
| ⚪ | [SAN-141](https://linear.app/sanjiovani/issue/SAN-141) | AI networking matchmaking and icebreakers | Mastra + LibSQL | Medium | 10 | F | Blocked: SAN-140, SAN-138 |
| ⚪ | [SAN-144](https://linear.app/sanjiovani/issue/SAN-144) | Community relationship graph | Mastra + LibSQL | Medium | 10 | F | Blocked: SAN-143, SAN-142, SAN-141 |
| ⚪ | [SAN-149](https://linear.app/sanjiovani/issue/SAN-149) | Live event updates feed | Mastra + LibSQL | Medium | 10 | F | Blocked: SAN-147, SAN-138, SAN-135 |
| ⚪ | [SAN-656](https://linear.app/sanjiovani/issue/SAN-656) | Trip product links | Vercel + Next.js | Medium | 10 | F | Blocked: SAN-721 · M5 - Lifestyle commerce integrations |
| ⚪ | [SAN-752](https://linear.app/sanjiovani/issue/SAN-752) | ticketSetupWorkflow: capacity validation + Stripe … | Mastra + LibSQL | Medium | 10 | F | 💳 AGT — Phase 2: Business Workflows |
| 🔴 | [SAN-551](https://linear.app/sanjiovani/issue/SAN-551) | create_checkout tool + checkout widget | Mastra + LibSQL | Urgent | 0 | F | — |

## 🏗️ Platform & Infrastructure
> 197 issues · 🟢 26 done · 🟡 6 WIP · ⚪ 157 not started · Score: **25/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| 🟢 | [SAN-233](https://linear.app/sanjiovani/issue/SAN-233) | WIRE-001 — Home / Concierge Chat | Gemini 3.5 Flash | Urgent | 100 | A+ | ✓ May 27 · 🍽️ Discovery — UI |
| 🟢 | [SAN-239](https://linear.app/sanjiovani/issue/SAN-239) | WIRE-003 — Event Discovery (in-thread) | Vitest + Playwright | Urgent | 100 | A+ | ✓ May 27 · 🍽️ Discovery — UI |
| 🟢 | [SAN-243](https://linear.app/sanjiovani/issue/SAN-243) | WIRE-002 — Rental Search (in-thread) | Vitest + Playwright | Urgent | 100 | A+ | ✓ May 28 · 🍽️ Discovery — UI |
| 🟢 | [SAN-249](https://linear.app/sanjiovani/issue/SAN-249) | WIRE-006 — Booking Checkout (modal) | Stripe + Next.js | Urgent | 100 | A+ | ✓ May 27 · 🍽️ Discovery — UI |
| 🟢 | [SAN-318](https://linear.app/sanjiovani/issue/SAN-318) | Unified result cards M0–M5 | CopilotKit 1.55.2 | Urgent | 100 | A+ | ✓ Jun 01 |
| 🟢 | [SAN-325](https://linear.app/sanjiovani/issue/SAN-325) | Venues data inventory — cafés, restaurants, nightc… | PostgreSQL | Urgent | 100 | A+ | ✓ May 30 · 🍽️ Venues — Phase 2 |
| 🟢 | [SAN-328](https://linear.app/sanjiovani/issue/SAN-328) | Trips data inventory — live schema vs trips-plan | PostgreSQL | Urgent | 100 | A+ | ✓ May 30 · 🏠 Trips — Phase 2 |
| 🟢 | [SAN-330](https://linear.app/sanjiovani/issue/SAN-330) | Three-kind catalog contract — café, restaurant, ni… | PostgreSQL | Urgent | 100 | A+ | ✓ May 30 · 🍽️ Venues — Phase 2 |
| 🟢 | [SAN-331](https://linear.app/sanjiovani/issue/SAN-331) | Supabase schema migrations — venue booking, anchor… | PostgreSQL | Urgent | 100 | A+ | ✓ May 30 · 🍽️ Venues — Phase 2 |
| 🟢 | [SAN-332](https://linear.app/sanjiovani/issue/SAN-332) | Café listings → venue_anchors seed (metadata + Pla… | PostgreSQL | Urgent | 100 | A+ | ✓ Jun 02 · 🍽️ Venues — Phase 2 |
| 🟢 | [SAN-333](https://linear.app/sanjiovani/issue/SAN-333) | Restaurant catalog verify + gap-fill (not full re-… | PostgreSQL | Urgent | 100 | A+ | ✓ May 30 · 🍽️ Venues — Phase 2 |
| 🟢 | [SAN-334](https://linear.app/sanjiovani/issue/SAN-334) | Café seed sign-off + golden-query map | PostgreSQL | Urgent | 100 | A+ | ✓ May 30 · 🍽️ Venues — Phase 2 |
| 🟢 | [SAN-335](https://linear.app/sanjiovani/issue/SAN-335) | Nightclub / bar anchor seed + Places verify | PostgreSQL | Urgent | 100 | A+ | ✓ May 30 · 🍽️ Venues — Phase 2 |
| 🟢 | [SAN-246](https://linear.app/sanjiovani/issue/SAN-246) | WIRE-004 — Venue / Listing Detail (sheet) | Vitest + Playwright | High | 100 | A+ | ✓ May 27 · 🍽️ Discovery — UI |
| 🟢 | [SAN-252](https://linear.app/sanjiovani/issue/SAN-252) | WIRE-005 — Itinerary Tab | Vitest + Playwright | High | 100 | A+ | ✓ May 27 · 🍽️ Discovery — UI |
| 🟢 | [SAN-238](https://linear.app/sanjiovani/issue/SAN-238) | WIRE-019 — Event Detail Page | Vitest + Playwright | Urgent | 100 | A+ | ✓ May 27 · 🍽️ Discovery — UI |
| 🟢 | [SAN-260](https://linear.app/sanjiovani/issue/SAN-260) | WIRE-020 — My Tickets + QR | Vitest + Playwright | High | 100 | A+ | ✓ May 27 · 🍽️ Discovery — UI |
| 🟢 | [SAN-336](https://linear.app/sanjiovani/issue/SAN-336) | Golden eval queries — café, restaurant, nightclub | PostgreSQL | High | 100 | A+ | ✓ May 30 · 🍽️ Venues — Phase 2 |
| 🟢 | [SAN-337](https://linear.app/sanjiovani/issue/SAN-337) | Places cache audit (DATA-007) | PostgreSQL | High | 100 | A+ | ✓ May 30 · 🍽️ Venues — Phase 2 |
| 🟢 | [SAN-353](https://linear.app/sanjiovani/issue/SAN-353) | trip_items type CHECK extension + insert RPC | PostgreSQL | High | 100 | A+ | ✓ May 30 · 🏠 Trips — Phase 2 |
| 🟢 | [SAN-354](https://linear.app/sanjiovani/issue/SAN-354) | Commerce trip_id linkage — event_orders, leads, sh… | PostgreSQL | High | 100 | A+ | ✓ May 30 · 🏠 Trips — Phase 2 |
| 🟢 | [SAN-355](https://linear.app/sanjiovani/issue/SAN-355) | Trips golden queries pack | PostgreSQL | High | 100 | A+ | ✓ May 30 · 🏠 Trips — Phase 2 |
| 🟢 | [SAN-575](https://linear.app/sanjiovani/issue/SAN-575) | Re-skin discovery surfaces (existing routes) | Next.js 16 + Tailwind v4 | High | 100 | A+ | ✓ Jun 06 · M4 — Surface Re-skins |
| 🟢 | [SAN-577](https://linear.app/sanjiovani/issue/SAN-577) | Map workspace (pins ↔ cards) | Google Maps JS | Medium | 100 | A+ | ✓ Jun 07 · M4 — Surface Re-skins |
| 🟢 | [SAN-579](https://linear.app/sanjiovani/issue/SAN-579) | Re-skin Home (/) from home-wireframe | Next.js 16 + Tailwind v4 | Medium | 100 | A+ | ✓ Jun 07 · M4 — Surface Re-skins |
| 🟢 | [SAN-361](https://linear.app/sanjiovani/issue/SAN-361) | Remove duplicate search results panel | CopilotKit 1.55.2 | No priority | 100 | A+ | ✓ Jun 01 |
| 🟢 | [SAN-362](https://linear.app/sanjiovani/issue/SAN-362) | Build rich restaurant result cards | Google Maps JS | No priority | 100 | A+ | ✓ Jun 01 |
| 🟢 | [SAN-363](https://linear.app/sanjiovani/issue/SAN-363) | Build rich attraction result cards | Google Maps JS | No priority | 100 | A+ | ✓ Jun 01 |
| 🟢 | [SAN-365](https://linear.app/sanjiovani/issue/SAN-365) | Add tests for unified result cards | CopilotKit 1.55.2 | No priority | 100 | A+ | ✓ Jun 01 |
| 🟡 | [SAN-254](https://linear.app/sanjiovani/issue/SAN-254) | WIRE-007 — Saved Collections | Vitest + Playwright | High | 85 | B | 🍽️ Discovery — UI |
| 🟡 | [SAN-256](https://linear.app/sanjiovani/issue/SAN-256) | WIRE-018 — Trip Workspace (full tabs) | Vitest + Playwright | High | 85 | B | 🍽️ Discovery — UI |
| 🟡 | [SAN-257](https://linear.app/sanjiovani/issue/SAN-257) | WIRE-017 — Trips Dashboard | Vitest + Playwright | High | 85 | B | 🍽️ Discovery — UI |
| 🟡 | [SAN-544](https://linear.app/sanjiovani/issue/SAN-544) | Contest spec normalization, Linear sync, labels, a… | Vitest + Playwright | High | 65 | D | Blocked: SAN-532 |
| 🟡 | [SAN-663](https://linear.app/sanjiovani/issue/SAN-663) | AI Services for companies (/business/ai) | Next.js 16 + Tailwind v4 | Medium | 65 | D | M5 |
| 🟡 | [SAN-664](https://linear.app/sanjiovani/issue/SAN-664) | Sponsors / Sponsorship (/sponsors) | Next.js 16 + Tailwind v4 | Medium | 65 | D | M5 |
| ⚪ | [SAN-105](https://linear.app/sanjiovani/issue/SAN-105) | Places proxy edge + places_cache + RLS | Supabase RLS | High | 20 | F | 🔮 Search — Grounding |
| ⚪ | [SAN-106](https://linear.app/sanjiovani/issue/SAN-106) | Nearby Search + Show nearby on RentalCard | Google Maps JS | High | 20 | F | Blocked: SAN-107 · 🔮 Search — Grounding |
| ⚪ | [SAN-109](https://linear.app/sanjiovani/issue/SAN-109) | Cafe booking requests schema + RLS | Supabase RLS | High | 20 | F | Blocked: SAN-152 · 🍽️ Discovery — UI |
| ⚪ | [SAN-110](https://linear.app/sanjiovani/issue/SAN-110) | Chat Nav Rail + Thread List | Vitest + Playwright | High | 20 | F | 🍽️ Discovery — UI |
| ⚪ | [SAN-113](https://linear.app/sanjiovani/issue/SAN-113) | Mobile Responsive 3-Panel Shell | Vitest + Playwright | High | 20 | F | 🍽️ Discovery — UI |
| ⚪ | [SAN-156](https://linear.app/sanjiovani/issue/SAN-156) | Search logs + observability | Next.js 16 + Tailwind v4 | High | 20 | F | Blocked: SAN-155, SAN-152 · 🔮 Platform — Vector |
| ⚪ | [SAN-158](https://linear.app/sanjiovani/issue/SAN-158) | Supabase coffee_tours core tables + RLS | Supabase RLS | High | 20 | F | — |
| ⚪ | [SAN-159](https://linear.app/sanjiovani/issue/SAN-159) | coffee_tour_search_logs + coffee_tour_cache | Google Maps JS | High | 20 | F | Blocked: SAN-158 |
| ⚪ | [SAN-160](https://linear.app/sanjiovani/issue/SAN-160) | CoffeeTour types + Zod schemas | PostgreSQL | High | 20 | F | Blocked: SAN-158 |
| ⚪ | [SAN-161](https://linear.app/sanjiovani/issue/SAN-161) | Seed 5 verified coffee tours | Google Maps JS | High | 20 | F | Blocked: SAN-158 |
| ⚪ | [SAN-162](https://linear.app/sanjiovani/issue/SAN-162) | Concierge tour intent + searchCoffeeTours tool | Google Maps JS | High | 20 | F | Blocked: SAN-164, SAN-161, SAN-160 |
| ⚪ | [SAN-163](https://linear.app/sanjiovani/issue/SAN-163) | Places API enrich for coffee tour rows | Google Maps JS | High | 20 | F | Blocked: SAN-161 |
| ⚪ | [SAN-164](https://linear.app/sanjiovani/issue/SAN-164) | rankCoffeeTours scoring function | Google Maps JS | High | 20 | F | Blocked: SAN-161, SAN-160 |
| ⚪ | [SAN-165](https://linear.app/sanjiovani/issue/SAN-165) | CoffeeTourCard + CopilotKit tool render | Google Maps JS | High | 20 | F | Blocked: SAN-161, SAN-164, SAN-162 |
| ⚪ | [SAN-166](https://linear.app/sanjiovani/issue/SAN-166) | Map pins + results column for coffee tours | Google Maps JS | High | 20 | F | Blocked: SAN-165 |
| ⚪ | [SAN-167](https://linear.app/sanjiovani/issue/SAN-167) | smoke:coffee-tours script | Google Maps JS | High | 20 | F | Blocked: SAN-166, SAN-165 |
| ⚪ | [SAN-168](https://linear.app/sanjiovani/issue/SAN-168) | Phase A evidence + task-verifier closeout | Google Maps JS | High | 20 | F | Blocked: SAN-167 |
| ⚪ | [SAN-175](https://linear.app/sanjiovani/issue/SAN-175) | /tours/[slug] detail page | Google Maps JS | High | 20 | F | Blocked: SAN-165, SAN-158 |
| ⚪ | [SAN-180](https://linear.app/sanjiovani/issue/SAN-180) | Supabase contest core schema and RLS | Supabase RLS | High | 20 | F | Blocked: SAN-179 · 🔮 Deferred — Contest |
| ⚪ | [SAN-181](https://linear.app/sanjiovani/issue/SAN-181) | Voting and judge scoring ledgers | Next.js 16 + Tailwind v4 | High | 20 | F | Blocked: SAN-180 · 🔮 Deferred — Contest |
| ⚪ | [SAN-182](https://linear.app/sanjiovani/issue/SAN-182) | Tickets and paid-vote payment-derived schema | PostgreSQL | High | 20 | F | Blocked: SAN-181, SAN-180 · 🔮 Deferred — Contest |
| ⚪ | [SAN-183](https://linear.app/sanjiovani/issue/SAN-183) | CopilotKit contest workspace and approval cards | CopilotKit 1.55.2 | High | 20 | F | Blocked: SAN-180 · 🔮 Deferred — Contest |
| ⚪ | [SAN-184](https://linear.app/sanjiovani/issue/SAN-184) | Mastra and Gemini contest workflows | Mastra + LibSQL | High | 20 | F | Blocked: SAN-183, SAN-181 · 🔮 Deferred — Contest |
| ⚪ | [SAN-185](https://linear.app/sanjiovani/issue/SAN-185) | Contest screens, routes, and wireframes | Vitest + Playwright | High | 20 | F | Blocked: SAN-183, SAN-180 · 🔮 Deferred — Contest |
| ⚪ | [SAN-186](https://linear.app/sanjiovani/issue/SAN-186) | Contest Playwright proof gates | Vitest + Playwright | High | 20 | F | Blocked: SAN-185, SAN-182, SAN-181 · 🔮 Deferred — Contest |
| ⚪ | [SAN-267](https://linear.app/sanjiovani/issue/SAN-267) | WIRE-010 — Nightlife Explorer | Vitest + Playwright | Medium | 20 | F | 🍽️ Discovery — UI |
| ⚪ | [SAN-241](https://linear.app/sanjiovani/issue/SAN-241) | WIRE-022 — Host Event Wizard | Vitest + Playwright | High | 20 | F | 🍽️ Discovery — UI |
| ⚪ | [SAN-270](https://linear.app/sanjiovani/issue/SAN-270) | WIRE-024 — Login / Signup | Supabase Auth | High | 20 | F | 🍽️ Discovery — UI |
| ⚪ | [SAN-95](https://linear.app/sanjiovani/issue/SAN-95) | Port evaluationAgent + scorers + Vercel deploy pre… | Gemini 3.5 Flash | High | 20 | F | — |
| ⚪ | [SAN-96](https://linear.app/sanjiovani/issue/SAN-96) | Auto-review — manual calibration (rules + subagent… | Gemini 3.5 Flash | High | 20 | F | — |
| ⚪ | [SAN-97](https://linear.app/sanjiovani/issue/SAN-97) | Port Medellín hero photo library from legacy | Next.js 16 + Tailwind v4 | High | 20 | F | 🗺️ Maps — Growth |
| ⚪ | [SAN-98](https://linear.app/sanjiovani/issue/SAN-98) | Port RestaurantCard + RestaurantFilters component | Next.js 16 + Tailwind v4 | High | 20 | F | Blocked: SAN-97 · 🗺️ Maps — Growth |
| ⚪ | [SAN-99](https://linear.app/sanjiovani/issue/SAN-99) | Port OnboardingLayout — first-run shell | Next.js 16 + Supabase | High | 20 | F | 🗺️ Maps — Growth |
| ⚪ | [SAN-107](https://linear.app/sanjiovani/issue/SAN-107) | Colombia coverage spike — Places Aggregate vs Insi… | Google Maps JS | Medium | 20 | F | 🔮 Search — Grounding |
| ⚪ | [SAN-229](https://linear.app/sanjiovani/issue/SAN-229) | Route previews + commute cards | Google Maps JS | Medium | 20 | F | 🔮 Search — Grounding |
| ⚪ | [SAN-230](https://linear.app/sanjiovani/issue/SAN-230) | Neighborhood intelligence cards | Google Maps JS | Medium | 20 | F | Blocked: SAN-107 · 🔮 Search — Grounding |
| ⚪ | [SAN-789](https://linear.app/sanjiovani/issue/SAN-789) | MAP-035 — Neighborhood intel on `/explore` | CopilotKit 1.55.2 | Medium | 10 | F | Renamed from MAP-010 · 🗺️ Maps — P1 Hardening |
| ⚪ | [SAN-466](https://linear.app/sanjiovani/issue/SAN-466) | Advanced marker UX polish — selection, badges, mob… | Google Maps JS | Medium | 20 | F | 🔮 Vectors & Rerank |
| ⚪ | [SAN-479](https://linear.app/sanjiovani/issue/SAN-479) | Rental detail page (/rentals/[id]) | Next.js 16 + Tailwind v4 | Medium | 20 | F | — |
| ⚪ | [SAN-480](https://linear.app/sanjiovani/issue/SAN-480) | Rental application wizard | Next.js 16 + Tailwind v4 | Medium | 20 | F | 🔮 RE Browse & Detail |
| ⚪ | [SAN-108](https://linear.app/sanjiovani/issue/SAN-108) | Static Maps API — event location previews + OG ima… | Google Maps JS | Low | 20 | F | 🔮 Search — Grounding |
| ⚪ | [SAN-235](https://linear.app/sanjiovani/issue/SAN-235) | Wireframe: chat chrome (planning) | Vitest + Playwright | Urgent | 10 | F | 🍽️ Discovery — UI |
| ⚪ | [SAN-550](https://linear.app/sanjiovani/issue/SAN-550) | Agent cleanup (ping/router/evaluation) | Google Maps JS | Urgent | 10 | F | Blocked: SAN-368, SAN-115, SAN-178 |
| ⚪ | [SAN-250](https://linear.app/sanjiovani/issue/SAN-250) | WIRE-021 — Bookings Inbox | Vitest + Playwright | High | 10 | F | 🍽️ Discovery — UI |
| ⚪ | [SAN-528](https://linear.app/sanjiovani/issue/SAN-528) | Mobile performance (LCP / CLS / INP) | Vitest + Playwright | High | 10 | F | Blocked: SAN-529 |
| ⚪ | [SAN-529](https://linear.app/sanjiovani/issue/SAN-529) | Mobile install experience (manifest + offline) | Vitest + Playwright | High | 10 | F | — |
| ⚪ | [SAN-532](https://linear.app/sanjiovani/issue/SAN-532) | Contest diagrams, repo decisions, and scope gate | Vitest + Playwright | High | 10 | F | — |
| ⚪ | [SAN-533](https://linear.app/sanjiovani/issue/SAN-533) | Supabase contest core schema and RLS | Supabase RLS | High | 10 | F | Blocked: SAN-532 |
| ⚪ | [SAN-534](https://linear.app/sanjiovani/issue/SAN-534) | Voting and judge scoring ledgers | Vitest + Playwright | High | 10 | F | Blocked: SAN-533 |
| ⚪ | [SAN-535](https://linear.app/sanjiovani/issue/SAN-535) | Tickets and paid-vote payment-derived schema | PostgreSQL | High | 10 | F | Blocked: SAN-533, SAN-534 |
| ⚪ | [SAN-536](https://linear.app/sanjiovani/issue/SAN-536) | CopilotKit contest workspace and approval cards | CopilotKit 1.55.2 | High | 10 | F | Blocked: SAN-533 |
| ⚪ | [SAN-537](https://linear.app/sanjiovani/issue/SAN-537) | Mastra and Gemini contest workflows | Mastra + LibSQL | High | 10 | F | Blocked: SAN-534, SAN-536 |
| ⚪ | [SAN-538](https://linear.app/sanjiovani/issue/SAN-538) | Contest screens, routes, and wireframes | Vitest + Playwright | High | 10 | F | Blocked: SAN-533, SAN-534, SAN-536 |
| ⚪ | [SAN-539](https://linear.app/sanjiovani/issue/SAN-539) | Contest Playwright proof gates | Vitest + Playwright | High | 10 | F | Blocked: SAN-538, SAN-535, SAN-534 |
| ⚪ | [SAN-540](https://linear.app/sanjiovani/issue/SAN-540) | Contestant signup, URL intake, and profile extract… | Supabase Auth | High | 10 | F | Blocked: SAN-533, SAN-538 |
| ⚪ | [SAN-541](https://linear.app/sanjiovani/issue/SAN-541) | Contestant profile editor, photo uploads, and AI c… | Vitest + Playwright | High | 10 | F | Blocked: SAN-533, SAN-540, SAN-536 |
| ⚪ | [SAN-542](https://linear.app/sanjiovani/issue/SAN-542) | Public contestant profile voting page and share gr… | Vitest + Playwright | High | 10 | F | Blocked: SAN-534, SAN-541, SAN-538 |
| ⚪ | [SAN-647](https://linear.app/sanjiovani/issue/SAN-647) | Mercur marketplace foundation verify | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-721 · M4 - Marketplace vendors and Connect |
| ⚪ | [SAN-648](https://linear.app/sanjiovani/issue/SAN-648) | Vendor application flow | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-721 · M4 - Marketplace vendors and Connect |
| ⚪ | [SAN-649](https://linear.app/sanjiovani/issue/SAN-649) | Vendor admin invite | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-647, SAN-648 · M4 - Marketplace vendors and Connect |
| ⚪ | [SAN-650](https://linear.app/sanjiovani/issue/SAN-650) | Vendor dashboard (mercur apps/vendor) | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-647, SAN-649 · M4 - Marketplace vendors and Connect |
| ⚪ | [SAN-652](https://linear.app/sanjiovani/issue/SAN-652) | Multi-vendor order split | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-651, SAN-647 · M4 - Marketplace vendors and Connect |
| ⚪ | [SAN-653](https://linear.app/sanjiovani/issue/SAN-653) | Vendor payout visibility | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-651, SAN-652 · M4 - Marketplace vendors and Connect |
| ⚪ | [SAN-676](https://linear.app/sanjiovani/issue/SAN-676) | Nightclub/Bar: full onboarding cycle (e2e) | Vitest + Playwright | High | 10 | F | Blocked: SAN-675 · M5 |
| ⚪ | [SAN-677](https://linear.app/sanjiovani/issue/SAN-677) | Real-estate broker: full onboarding cycle (e2e) | Vitest + Playwright | High | 10 | F | Blocked: SAN-675 · M5 |
| ⚪ | [SAN-258](https://linear.app/sanjiovani/issue/SAN-258) | WIRE-013 — Mindtrip Observed Patterns | Vitest + Playwright | Medium | 10 | F | 🍽️ Discovery — UI |
| ⚪ | [SAN-264](https://linear.app/sanjiovani/issue/SAN-264) | WIRE-009 — Contest Discovery | Vitest + Playwright | Medium | 10 | F | 🍽️ Discovery — UI |
| ⚪ | [SAN-266](https://linear.app/sanjiovani/issue/SAN-266) | WIRE-011 — Creator Dashboard | Vitest + Playwright | Medium | 10 | F | 🍽️ Discovery — UI |
| ⚪ | [SAN-269](https://linear.app/sanjiovani/issue/SAN-269) | WIRE-023 — Onboarding Wizard | Vitest + Playwright | Medium | 10 | F | — |
| ⚪ | [SAN-271](https://linear.app/sanjiovani/issue/SAN-271) | WIRE-025 — Notifications | Vitest + Playwright | Medium | 10 | F | — |
| ⚪ | [SAN-357](https://linear.app/sanjiovani/issue/SAN-357) | trip_items itinerary covering index | PostgreSQL | Medium | 10 | F | 🏠 Trips — Phase 2 |
| ⚪ | [SAN-358](https://linear.app/sanjiovani/issue/SAN-358) | mastra_threads trip_id metadata index | PostgreSQL | Medium | 10 | F | 🏠 Trips — Phase 2 |
| ⚪ | [SAN-504](https://linear.app/sanjiovani/issue/SAN-504) | Venue availability calendar | Next.js 16 + Tailwind v4 | Medium | 10 | F | Blocked: SAN-502 · 🔮 Events — Discovery |
| ⚪ | [SAN-505](https://linear.app/sanjiovani/issue/SAN-505) | Auto follow-up WA drafts (24h) | Next.js 16 + Tailwind v4 | Medium | 10 | F | Blocked: SAN-502 · 🔮 Events — Discovery |
| ⚪ | [SAN-506](https://linear.app/sanjiovani/issue/SAN-506) | Venue CRM for Patricia | Vercel + Next.js | Medium | 10 | F | Blocked: SAN-502 · 🔮 Events — Discovery |
| ⚪ | [SAN-515](https://linear.app/sanjiovani/issue/SAN-515) | Admin Events dashboard (/admin/events) | Next.js 16 + Tailwind v4 | Medium | 10 | F | — |
| ⚪ | [SAN-516](https://linear.app/sanjiovani/issue/SAN-516) | Admin Leads / CRM (/admin/leads) | Next.js 16 + Supabase | Medium | 10 | F | — |
| ⚪ | [SAN-517](https://linear.app/sanjiovani/issue/SAN-517) | User profile / account (/me/profile) | Next.js 16 + Tailwind v4 | Medium | 10 | F | — |
| ⚪ | [SAN-530](https://linear.app/sanjiovani/issue/SAN-530) | Mobile accessibility audit (VoiceOver / TalkBack) | Vitest + Playwright | Medium | 10 | F | — |
| ⚪ | [SAN-543](https://linear.app/sanjiovani/issue/SAN-543) | OpenClaw and Firecrawl discovery plus approved inv… | Vitest + Playwright | Medium | 10 | F | Blocked: SAN-533, SAN-537 |
| ⚪ | [SAN-565](https://linear.app/sanjiovani/issue/SAN-565) | Sales Agent (upsell/bundle/promo) + Gemini fallbac… | Mastra + LibSQL | Medium | 10 | F | — |
| ⚪ | [SAN-576](https://linear.app/sanjiovani/issue/SAN-576) | Re-skin Dashboard (must not block MVP) | Next.js 16 + Tailwind v4 | Medium | 10 | F | M4 — Surface Re-skins |
| ⚪ | [SAN-578](https://linear.app/sanjiovani/issue/SAN-578) | Concierge surface (grounded AI band) | Gemini 3.5 Flash | Medium | 10 | F | M4 — Surface Re-skins |
| ⚪ | [SAN-655](https://linear.app/sanjiovani/issue/SAN-655) | Event product links | Vercel + Next.js | Medium | 10 | F | Blocked: SAN-721 · M5 - Lifestyle commerce integrations |
| ⚪ | [SAN-657](https://linear.app/sanjiovani/issue/SAN-657) | Venue product links | Vercel + Next.js | Medium | 10 | F | Blocked: SAN-721 · M5 - Lifestyle commerce integrations |
| ⚪ | [SAN-658](https://linear.app/sanjiovani/issue/SAN-658) | Basic commerce analytics | Next.js 16 + Tailwind v4 | Medium | 10 | F | Blocked: SAN-721 · M5 - Lifestyle commerce integrations |
| ⚪ | [SAN-659](https://linear.app/sanjiovani/issue/SAN-659) | Featured listings pilot | Next.js 16 + Tailwind v4 | Medium | 10 | F | Blocked: SAN-658 · M5 - Lifestyle commerce integrations |
| ⚪ | [SAN-669](https://linear.app/sanjiovani/issue/SAN-669) | AI services catalog & pricing tiers | Vercel + Next.js | Medium | 10 | F | M4 |
| ⚪ | [SAN-670](https://linear.app/sanjiovani/issue/SAN-670) | Marketing automation engine (partner lifecycle) | Next.js 16 + Supabase | Medium | 10 | F | M4 |
| ⚪ | [SAN-671](https://linear.app/sanjiovani/issue/SAN-671) | Contests & growth loops | Vitest + Playwright | Medium | 10 | F | M4 |
| ⚪ | [SAN-673](https://linear.app/sanjiovani/issue/SAN-673) | AI concierge ↔ partner interaction wiring | Gemini 3.5 Flash | Medium | 10 | F | M4 |
| ⚪ | [SAN-678](https://linear.app/sanjiovani/issue/SAN-678) | Restaurant: full onboarding cycle (e2e) | Vitest + Playwright | Medium | 10 | F | Blocked: SAN-675 · M5 |
| ⚪ | [SAN-679](https://linear.app/sanjiovani/issue/SAN-679) | Café: full onboarding cycle (e2e) | Vitest + Playwright | Medium | 10 | F | Blocked: SAN-675 · M5 |
| ⚪ | [SAN-680](https://linear.app/sanjiovani/issue/SAN-680) | Venue/event space: full onboarding cycle (e2e) | Vitest + Playwright | Medium | 10 | F | Blocked: SAN-675 · M5 |
| ⚪ | [SAN-681](https://linear.app/sanjiovani/issue/SAN-681) | Sponsor: full cycle (e2e) | Vitest + Playwright | Medium | 10 | F | Blocked: SAN-675, SAN-669 · M5 |
| ⚪ | [SAN-682](https://linear.app/sanjiovani/issue/SAN-682) | Agency/company: AI-services delivery cycle (e2e) | Vitest + Playwright | Medium | 10 | F | Blocked: SAN-669, SAN-675 · M5 |
| ⚪ | [SAN-686](https://linear.app/sanjiovani/issue/SAN-686) | Booking system (availability → approve → pay → not… | Next.js 16 + Tailwind v4 | Medium | 10 | F | Blocked: SAN-690 · M4 |
| ⚪ | [SAN-687](https://linear.app/sanjiovani/issue/SAN-687) | Brand assets + social automation pipeline (Postiz) | Vercel + Next.js | Medium | 10 | F | M4 |
| ⚪ | [SAN-688](https://linear.app/sanjiovani/issue/SAN-688) | Data intelligence / enrichment (OpenClaw + Places) | Google Maps JS | Medium | 10 | F | M4 |
| ⚪ | [SAN-694](https://linear.app/sanjiovani/issue/SAN-694) | Contests / Giveaways hub (/contests) | Vitest + Playwright | Medium | 10 | F | M4 |
| ⚪ | [SAN-695](https://linear.app/sanjiovani/issue/SAN-695) | Partner pricing (/pricing) | Vercel + Next.js | Medium | 10 | F | Blocked: SAN-668 · M4 |
| ⚪ | [SAN-699](https://linear.app/sanjiovani/issue/SAN-699) | Tour operator: full onboarding cycle (e2e) | Vitest + Playwright | Medium | 10 | F | M5 |
| ⚪ | [SAN-701](https://linear.app/sanjiovani/issue/SAN-701) | Event marketing services (/business/event-marketin… | Next.js 16 + Tailwind v4 | Medium | 10 | F | M4 |
| ⚪ | [SAN-703](https://linear.app/sanjiovani/issue/SAN-703) | Venue features deep-dive (/venues/features) | Next.js 16 + Tailwind v4 | Medium | 10 | F | M4 |
| ⚪ | [SAN-797](https://linear.app/sanjiovani/issue/SAN-797) | Concierge venue instructions + working memory slot… | Gemini 3.5 Flash | Medium | 10 | F | 🔮 Venues Post-MVP |
| ⚪ | [SAN-179](https://linear.app/sanjiovani/issue/SAN-179) | Contest diagrams, GitHub repo decisions, and scope… | Vitest + Playwright | Low | 10 | F | 🔮 Deferred — Contest |
| ⚪ | [SAN-187](https://linear.app/sanjiovani/issue/SAN-187) | OpenClaw gateway health stub | Next.js 16 + Tailwind v4 | Low | 10 | F | 🔮 Automation — OpenClaw |
| ⚪ | [SAN-188](https://linear.app/sanjiovani/issue/SAN-188) | Supabase openclaw_jobs + automation_approvals | Next.js 16 + Tailwind v4 | Low | 10 | F | 🔮 Automation — OpenClaw |
| ⚪ | [SAN-189](https://linear.app/sanjiovani/issue/SAN-189) | Mastra openclaw-approval-workflow | Mastra + LibSQL | Low | 10 | F | Blocked: SAN-188 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-190](https://linear.app/sanjiovani/issue/SAN-190) | ClawHub safety policy — no unvetted skills | Supabase RLS | Low | 10 | F | 🔮 Automation — OpenClaw |
| ⚪ | [SAN-191](https://linear.app/sanjiovani/issue/SAN-191) | OPENCLAW_DISABLED kill switch | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-187 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-192](https://linear.app/sanjiovani/issue/SAN-192) | OpenClaw VPS — Gemini provider + model routing | Gemini 3.5 Flash | Low | 10 | F | Blocked: SAN-187 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-193](https://linear.app/sanjiovani/issue/SAN-193) | Rotate OpenClaw gateway token | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-187 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-194](https://linear.app/sanjiovani/issue/SAN-194) | Admin approvals UI — OpenClaw job preview | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-189 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-196](https://linear.app/sanjiovani/issue/SAN-196) | mde-tour-enrich (+ mde-enrichment) SKILL.md pack | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-192, SAN-190 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-197](https://linear.app/sanjiovani/issue/SAN-197) | Mastra enqueueOpenClawJob tool | Mastra + LibSQL | Low | 10 | F | Blocked: SAN-189 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-198](https://linear.app/sanjiovani/issue/SAN-198) | E2E — reject OpenClaw job without approval | Vitest + Playwright | Low | 10 | F | Blocked: SAN-189 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-199](https://linear.app/sanjiovani/issue/SAN-199) | Coffee tours — source crawler + verify | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-196, SAN-195, SAN-161, SAN-158 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-200](https://linear.app/sanjiovani/issue/SAN-200) | Restaurants — menu PDF/HTML extraction | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-195, SAN-196 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-201](https://linear.app/sanjiovani/issue/SAN-201) | Cafés — Instagram / creator discovery crawl | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-196 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-202](https://linear.app/sanjiovani/issue/SAN-202) | Events — venue intelligence browser enrich | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-214, SAN-203, SAN-196 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-203](https://linear.app/sanjiovani/issue/SAN-203) | Events — directory / calendar import | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-196 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-204](https://linear.app/sanjiovani/issue/SAN-204) | Real estate — listing enrichment crawl | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-189, SAN-196 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-205](https://linear.app/sanjiovani/issue/SAN-205) | Marketing — sponsor prospect research | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-214, SAN-195 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-206](https://linear.app/sanjiovani/issue/SAN-206) | Marketing — local SEO / competitor page monitor | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-196, SAN-195 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-207](https://linear.app/sanjiovani/issue/SAN-207) | Correlation IDs Mastra ↔ OpenClaw | Mastra + LibSQL | Low | 10 | F | Blocked: SAN-197 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-208](https://linear.app/sanjiovani/issue/SAN-208) | WhatsApp templates + number allowlist | Next.js 16 + Tailwind v4 | Low | 10 | F | 🔮 Automation — OpenClaw |
| ⚪ | [SAN-209](https://linear.app/sanjiovani/issue/SAN-209) | Events — T-24h reminder WA drafts | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-208, SAN-203 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-210](https://linear.app/sanjiovani/issue/SAN-210) | Events — sponsor ROI browser screenshots | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-196 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-211](https://linear.app/sanjiovani/issue/SAN-211) | Events — external publish draft (outbox) | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-203, SAN-189 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-212](https://linear.app/sanjiovani/issue/SAN-212) | Contests — WA leaderboard / reminder drafts | Vitest + Playwright | Low | 10 | F | Blocked: SAN-208 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-213](https://linear.app/sanjiovani/issue/SAN-213) | Marketing — Postiz approved post handoff | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-218, SAN-216, SAN-189 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-214](https://linear.app/sanjiovani/issue/SAN-214) | Apify OpenClaw plugin sandbox | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-198, SAN-194, SAN-193, SAN-191, SAN-190 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-215](https://linear.app/sanjiovani/issue/SAN-215) | Events — sponsor decision-maker map | Google Maps JS | Low | 10 | F | Blocked: SAN-214, SAN-205 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-217](https://linear.app/sanjiovani/issue/SAN-217) | Events — vendor recruitment research | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-214, SAN-202 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-218](https://linear.app/sanjiovani/issue/SAN-218) | Events — Instagram/Facebook social intelligence | Vercel + Next.js | Low | 10 | F | Blocked: SAN-119, SAN-214 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-219](https://linear.app/sanjiovani/issue/SAN-219) | Events — approved WhatsApp/Postiz/social campaign … | Vercel + Next.js | Low | 10 | F | Blocked: SAN-218, SAN-216, SAN-213, SAN-208 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-220](https://linear.app/sanjiovani/issue/SAN-220) | Events — repo and OpenClaw skill intake audit gate | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-214, SAN-190 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-221](https://linear.app/sanjiovani/issue/SAN-221) | Events — event planner checklist adapter | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-217, SAN-202, SAN-220 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-222](https://linear.app/sanjiovani/issue/SAN-222) | Events — public event source connector adapters | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-220, SAN-214, SAN-203 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-223](https://linear.app/sanjiovani/issue/SAN-223) | Events — source health and connector drift monitor | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-222, SAN-207 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-224](https://linear.app/sanjiovani/issue/SAN-224) | Events — event page QA crawler | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-203, SAN-202, SAN-198 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-225](https://linear.app/sanjiovani/issue/SAN-225) | Events — live ops ticker and role-specific event u… | Vercel + Next.js | Low | 10 | F | Blocked: SAN-224, SAN-219, SAN-209, SAN-208 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-226](https://linear.app/sanjiovani/issue/SAN-226) | ClawEvents + OpenClaw — Medellín event ingest work… | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-125, SAN-123 · 🔮 Automation — OpenClaw |
| ⚪ | [SAN-507](https://linear.app/sanjiovani/issue/SAN-507) | Dynamic package pricing | Vercel + Next.js | Low | 10 | F | Blocked: SAN-495 · 🔮 Events — Discovery |
| ⚪ | [SAN-508](https://linear.app/sanjiovani/issue/SAN-508) | Sponsor ↔ venue match | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-498 · 🔮 Events — Discovery |
| ⚪ | [SAN-509](https://linear.app/sanjiovani/issue/SAN-509) | OpenClaw venue enrichment (plan) | Next.js 16 + Tailwind v4 | Low | 10 | F | 🔮 Events — Discovery |
| ⚪ | [SAN-672](https://linear.app/sanjiovani/issue/SAN-672) | Marketplace expansion (event services first) | Next.js 16 + Tailwind v4 | Low | 10 | F | M5 |
| ⚪ | [SAN-696](https://linear.app/sanjiovani/issue/SAN-696) | Creator program landing (/partners/creator) | Next.js 16 + Supabase | Low | 10 | F | M5 |
| ⚪ | [SAN-697](https://linear.app/sanjiovani/issue/SAN-697) | Postiz social services (/business/social) | Vercel + Next.js | Low | 10 | F | M4 |
| ⚪ | [SAN-698](https://linear.app/sanjiovani/issue/SAN-698) | Vendor: marketplace vendor cycle (e2e) | Vitest + Playwright | Low | 10 | F | M5 |
| ⚪ | [SAN-700](https://linear.app/sanjiovani/issue/SAN-700) | Influencer/creator: full program cycle (e2e) | Vitest + Playwright | Low | 10 | F | M5 |
| ⚪ | [SAN-702](https://linear.app/sanjiovani/issue/SAN-702) | Marketplace vendor landing (/partners/vendor) | Next.js 16 + Supabase | Low | 10 | F | M5 |
| ⚪ | [SAN-781](https://linear.app/sanjiovani/issue/SAN-781) | AIE-027 [Advanced] bookingAgent — unified vertical… | Gemini 3.5 Flash | Low | 10 | F | Blocked: SAN-115, SAN-764, SAN-773 |
| ⚪ | [SAN-782](https://linear.app/sanjiovani/issue/SAN-782) | AIE-028 [Advanced] Marketing agents split — campai… | Gemini 3.5 Flash | Low | 10 | F | Blocked: SAN-772, SAN-758 |
| ⚪ | [SAN-783](https://linear.app/sanjiovani/issue/SAN-783) | AIE-029 [Advanced] Sponsor ROI dashboard | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-768 |
| ⚪ | [SAN-784](https://linear.app/sanjiovani/issue/SAN-784) | AIE-030 [Advanced] Exception center /admin/excepti… | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-778 |
| ⚪ | [SAN-785](https://linear.app/sanjiovani/issue/SAN-785) | AIE-031 [Advanced] Campaign center /host/marketing | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-782 |
| ⚪ | [SAN-853](https://linear.app/sanjiovani/issue/SAN-853) | Feature Flags system for safe rollouts | PostgreSQL | Medium | 10 | F | DB-backed · per-env toggles |
| ⚪ | [SAN-364](https://linear.app/sanjiovani/issue/SAN-364) | Clean up orphan cards and event citations | CopilotKit 1.55.2 | No priority | 10 | F | — |
| 🔴 | [SAN-102](https://linear.app/sanjiovani/issue/SAN-102) | places-proxy edge [SUPERSEDED by MAP-005/SAN-105] | Google Maps JS | High | 0 | F | — |
| 🔴 | [SAN-103](https://linear.app/sanjiovani/issue/SAN-103) | Nearby Search [SUPERSEDED by MAP-006/SAN-106] | Google Maps JS | High | 0 | F | — |
| 🔴 | [SAN-244](https://linear.app/sanjiovani/issue/SAN-244) | WIRE-015 — Rentals Browse (catalog) | Vitest + Playwright | High | 0 | F | — |
| 🔴 | [SAN-247](https://linear.app/sanjiovani/issue/SAN-247) | WIRE-008 — Map Exploration Panel | Google Maps JS | High | 0 | F | — |
| 🔴 | [SAN-261](https://linear.app/sanjiovani/issue/SAN-261) | WIRE-016 — Explore Unified | Vitest + Playwright | Medium | 0 | F | — |
| ⚪ | [SAN-227](https://linear.app/sanjiovani/issue/SAN-227) | GS-005 — Verify ticket + venue update tools | Google Maps JS | Low | 10 | F | 🔮 Search — Grounding |
| ⚪ | [SAN-228](https://linear.app/sanjiovani/issue/SAN-228) | GS-006 — Gemini tool combination spike | Google Maps JS | Low | 10 | F | 🔮 Search — Grounding |
| ⚪ | [SAN-780](https://linear.app/sanjiovani/issue/SAN-780) | SEARCH-002 — Hybrid rental + event confidence | Mastra + LibSQL | High | 10 | F | 🔮 Search — Grounding |
| ⚪ | [SAN-790](https://linear.app/sanjiovani/issue/SAN-790) | SEARCH-001 — search_grounded_places hardening | Google Maps JS | High | 10 | F | 🔮 Search — Grounding |
| 🔴 | [SAN-360](https://linear.app/sanjiovani/issue/SAN-360) | Extract shared result card shell | CopilotKit 1.55.2 | No priority | 0 | F | Dup: SAN-574 ✅ |

## 🔗 Integrations (Chatwoot · WhatsApp · A2A)
> 27 issues · 🟢 0 done · 🟡 0 WIP · ⚪ 27 not started · Score: **11/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| ⚪ | [SAN-120](https://linear.app/sanjiovani/issue/SAN-120) | Event maps + venue integration | Google Maps JS | Medium | 20 | F | Blocked: SAN-104, SAN-119 |
| ⚪ | [SAN-177](https://linear.app/sanjiovani/issue/SAN-177) | WhatsApp handoff for coffee tours | Google Maps JS | Medium | 20 | F | Blocked: SAN-163, SAN-172 |
| ⚪ | [SAN-553](https://linear.app/sanjiovani/issue/SAN-553) | Deploy Chatwoot on Hetzner (Coolify) | Vercel + Next.js | High | 10 | F | Blocked: SAN-115, SAN-178, SAN-368 |
| ⚪ | [SAN-554](https://linear.app/sanjiovani/issue/SAN-554) | WhatsApp Cloud API inbox + templates | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-553 |
| ⚪ | [SAN-555](https://linear.app/sanjiovani/issue/SAN-555) | /api/chatwoot-bridge Mastra pipeline | Mastra + LibSQL | High | 10 | F | Blocked: SAN-554 |
| ⚪ | [SAN-556](https://linear.app/sanjiovani/issue/SAN-556) | Supabase contact/conversation mirror | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-555 |
| ⚪ | [SAN-557](https://linear.app/sanjiovani/issue/SAN-557) | G2 rental lead capture hook | Next.js 16 + Supabase | High | 10 | F | Blocked: SAN-556 |
| ⚪ | [SAN-612](https://linear.app/sanjiovani/issue/SAN-612) | CHAT-001 — Chatwoot account audit & credentials | Vercel + Next.js | Urgent | 10 | F | CHATW epic · label:CHAT |
| ⚪ | [SAN-613](https://linear.app/sanjiovani/issue/SAN-613) | CHAT-002 — WhatsApp Cloud API connection | Next.js 16 + Tailwind v4 | Urgent | 10 | F | Blocked: SAN-612 |
| ⚪ | [SAN-614](https://linear.app/sanjiovani/issue/SAN-614) | CHAT-003 — Chatwoot inbox configuration | Next.js 16 + Tailwind v4 | Urgent | 10 | F | Blocked: SAN-613 |
| ⚪ | [SAN-615](https://linear.app/sanjiovani/issue/SAN-615) | CHAT-004 — Webhook endpoint setup in mdeapp | Next.js 16 + Tailwind v4 | Urgent | 10 | F | Blocked: SAN-614 |
| ⚪ | [SAN-616](https://linear.app/sanjiovani/issue/SAN-616) | CHAT-005 — Chatwoot → Mastra bridge | Mastra + LibSQL | Urgent | 10 | F | Blocked: SAN-615 |
| ⚪ | [SAN-617](https://linear.app/sanjiovani/issue/SAN-617) | CHAT-006 — Mastra → Chatwoot reply service | Mastra + LibSQL | Urgent | 10 | F | Blocked: SAN-616 |
| ⚪ | [SAN-618](https://linear.app/sanjiovani/issue/SAN-618) | CHAT-007 — Contact sync to Supabase | Supabase RLS | High | 10 | F | Blocked: SAN-617 |
| ⚪ | [SAN-619](https://linear.app/sanjiovani/issue/SAN-619) | CHAT-008 — Conversation persistence | PostgreSQL | Medium | 10 | F | Blocked: SAN-618 |
| ⚪ | [SAN-620](https://linear.app/sanjiovani/issue/SAN-620) | CHAT-009 — Human handoff workflow | Mastra + LibSQL | High | 10 | F | Blocked: SAN-619 |
| ⚪ | [SAN-621](https://linear.app/sanjiovani/issue/SAN-621) | CHAT-010 — Lead capture workflow | Mastra + LibSQL | High | 10 | F | Blocked: SAN-620 |
| ⚪ | [SAN-622](https://linear.app/sanjiovani/issue/SAN-622) | CHAT-011 — Rentals concierge flow | CopilotKit 1.55.2 | High | 10 | F | Blocked: SAN-621 |
| ⚪ | [SAN-623](https://linear.app/sanjiovani/issue/SAN-623) | CHAT-012 — Events concierge flow | CopilotKit 1.55.2 | Medium | 10 | F | Blocked: SAN-622 |
| ⚪ | [SAN-624](https://linear.app/sanjiovani/issue/SAN-624) | CHAT-013 — Testing & verification | Vitest + Playwright | High | 10 | F | Blocked: SAN-623 |
| ⚪ | [SAN-625](https://linear.app/sanjiovani/issue/SAN-625) | CHAT-014 — Production deployment | Vercel + Next.js | High | 10 | F | Blocked: SAN-624 |
| ⚪ | [SAN-626](https://linear.app/sanjiovani/issue/SAN-626) | CHAT-015 — MVP acceptance & launch checklist | Vitest + Playwright | Medium | 10 | F | Blocked: SAN-625 |
| ⚪ | [SAN-560](https://linear.app/sanjiovani/issue/SAN-560) | Restaurant reservation management + confirmation/n… | Next.js 16 + Tailwind v4 | High | 10 | F | — |
| ⚪ | [SAN-147](https://linear.app/sanjiovani/issue/SAN-147) | WhatsApp and community links | Mastra + LibSQL | Medium | 10 | F | Blocked: SAN-137, SAN-135 |
| ⚪ | [SAN-654](https://linear.app/sanjiovani/issue/SAN-654) | WhatsApp payment link | Stripe + Next.js | Medium | 10 | F | Blocked: SAN-721 · M5 - Lifestyle commerce integrations |
| ⚪ | [SAN-689](https://linear.app/sanjiovani/issue/SAN-689) | Chatwoot + WhatsApp partner comms | Next.js 16 + Supabase | Medium | 10 | F | M4 |
| ⚪ | [SAN-786](https://linear.app/sanjiovani/issue/SAN-786) | AIE-032 [Advanced] WhatsApp opt-in reminders | Next.js 16 + Tailwind v4 | Low | 10 | F | Blocked: SAN-772 |

## 🧭 Advanced UX (CopilotKit v2 · Multi-Agent)
> 3 issues · 🟢 0 done · 🟡 0 WIP · ⚪ 3 not started · Score: **20/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| ⚪ | [SAN-744](https://linear.app/sanjiovani/issue/SAN-744) | createEventWorkflow: 5 steps + HITL (parse → venue… | Mastra + LibSQL | High | 20 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-746](https://linear.app/sanjiovani/issue/SAN-746) | rentalLeadWorkflow: inquiry → enrich → score → HIT… | Mastra + LibSQL | Medium | 20 | F | 💳 AGT — Phase 2: Business Workflows |
| ⚪ | [SAN-747](https://linear.app/sanjiovani/issue/SAN-747) | venueShortlistWorkflow: Places API → Supabase matc… | Google Maps JS | Medium | 20 | F | 💳 AGT — Phase 2: Business Workflows |


## 📊 Advanced Roadmap Summary

| Section | Issues | 🟢 Done | 🟡 WIP | ⚪ Not Started | 🔴 Failed | Avg Score | Grade |
|---------|--------|---------|--------|--------------|-----------|-----------|-------|
| 🧠 AI & Intelligence (Post-MVP) | 36 | 0 | 0 | 35 | 1 | 15 | F |
| 🤝 Partner AI Layer (Phase 2) | 11 | 0 | 0 | 11 | 0 | 11 | F |
| 🗺️ Trips Module | 46 | 0 | 0 | 45 | 1 | 17 | F |
| 🏗️ Platform & Infrastructure | 197 | 26 | 6 | 157 | 8 | 25 | F |
| 🔗 Integrations (Chatwoot · WhatsApp · A2A) | 27 | 0 | 0 | 27 | 0 | 11 | F |
| 🧭 Advanced UX (CopilotKit v2 · Multi-Agent) | 3 | 0 | 0 | 3 | 0 | 20 | F |
| **TOTAL** | **320** | **26** | **6** | **278** | **10** | **22** | **F** |

**Overall Score: 22/100 — Grade: F | Completion: 9%**

> **New 2026-06-08 (phase:post-mvp):** SAN-850–854 — recommendations, follow-ups, admin AI insights, feature flags, partner weekly reports  
> **CSV sync 2026-06-08:** SAN-612–626 (CHAT-001–015 Chatwoot epic) — was in `All issues.csv` but missing from tracker until this patch


> 📌 Partner AI Layer (SAN-800–810): Build after CopilotKit v2 migration using Atomic CRM as reference architecture.
> 📌 Trips Module: Full implementation begins post-MVP launch.
> 📌 Chatwoot/WhatsApp: Wire after Partner CRM Phase 1 (CRM-001–012) is complete.