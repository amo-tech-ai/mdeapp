---
title: OpenClaw Task Context Matrix
updated: 2026-05-27
status: Task enrichment reference
canonical_index: ../index-ocl.md
---

# OpenClaw Task Context Matrix

Use this file before implementing any `OCL-*` task. It adds product context to the executable task specs: description, real-world example, user story, journey/workflow, and the agents/systems involved.

## Operating Rule

OpenClaw executes approved background work only. Supabase owns truth, Mastra orchestrates, CopilotKit renders approval UI, Gemini summarizes or drafts, and humans approve sensitive actions.

## Core And MVP Tasks

| Task | Description | Real-world example | User story | Journey / workflow | Agents / systems |
|---|---|---|---|---|---|
| [OCL-001-core](../tasks/OCL-001-core-gateway-health.md) | Prove the OpenClaw gateway is reachable, observable, and safe to call before any job exists. | Sofia checks the VPS before Patricia approves a crawl. | As Sofia, I need a health check so I know OpenClaw is online before Roberto depends on it. | Probe gateway health, status, logs, version, and failure mode. | OpenClaw gateway, Sofia ops, mde-hostinger. |
| [OCL-002-core](../tasks/OCL-002-core-jobs-schema.md) | Create Supabase tables for approvals, jobs, results, and audit state. | Patricia can see who approved a sponsor research run. | As Patricia, I need every job and result to be auditable. | Migration -> RLS -> policies -> seed-safe statuses -> catalog proof. | Supabase, RLS, Patricia admin, Sofia. |
| [OCL-003-core](../tasks/OCL-003-core-approval-workflow.md) | Add the workflow that converts a human approval into a queued OpenClaw job. | Roberto requests venue research; Patricia approves before it runs. | As Roberto, I can request help without silently triggering scraping. | CopilotKit request -> approval row -> approve -> `openclaw_jobs` insert. | Mastra, CopilotKit, Supabase, OpenClaw. |
| [OCL-004-core](../tasks/OCL-004-core-clawhub-safety.md) | Prevent unreviewed ClawHub/public skills from entering production. | A public event skill looks useful but is blocked until audited. | As Sofia, I need a gate so the VPS does not run unknown third-party code. | Source review -> allow/deny decision -> config allowlist -> test blocked install. | OpenClaw, ClawHub policy, Sofia. |
| [OCL-005-core](../tasks/OCL-005-core-kill-switch.md) | Add a kill switch that stops OpenClaw starts fast. | A bad Apify Actor spikes cost; Sofia disables OpenClaw starts. | As Sofia, I need one switch to stop all new jobs. | Env flag/config flag -> enqueue blocked -> active jobs handled by policy. | OpenClaw, Supabase, Mastra enqueue tool. |
| [OCL-006-core](../tasks/OCL-006-core-gemini-vps-config.md) | Configure Gemini on the VPS for OpenClaw reasoning/search jobs. | OpenClaw summarizes public sponsor pages with the approved Gemini model. | As Sofia, I need model config to be explicit and testable. | Secret config -> model list verify -> smoke prompt -> log model ID. | OpenClaw, Gemini, mde-hostinger. |
| [OCL-007-core](../tasks/OCL-007-core-gateway-token-rotate.md) | Rotate and verify gateway credentials. | A token leak does not leave the worker permanently exposed. | As Sofia, I need rotation proof before production automation. | Create new token -> update callers -> verify old token rejected -> audit. | OpenClaw gateway, secrets, Mastra server. |
| [OCL-008-mvp](../tasks/OCL-008-mvp-admin-approvals-ui.md) | Build Patricia's approval queue for OpenClaw jobs. | Patricia approves a coffee-tour crawl after reading the preview. | As Patricia, I need to see risk, cost, source, and payload before approval. | Job proposal -> approval card -> approve/reject -> audit log. | CopilotKit UI, Supabase, Mastra. |
| [OCL-009-mvp](../tasks/OCL-009-mvp-gemini-web-search.md) | Enable cited Gemini web search for verification tasks. | Tourist sees a coffee tour card with official source confidence. | As a Tourist, I want verified source badges, not stale copied text. | Request verification -> search with citations -> store draft result -> approve. | OpenClaw, Gemini search, Supabase results. |
| [OCL-010-mvp](../tasks/OCL-010-mvp-tour-enrich-skill.md) | Create the first custom mde OpenClaw skill for tour enrichment. | A Comuna 13 coffee tour gets source URLs, schedule notes, and confidence. | As Patricia, I need one narrow skill before broader scraping. | Approved job -> skill runs browser/search steps -> normalized result. | Custom `mde-tour-enrich` skill, OpenClaw, Gemini. |
| [OCL-011-mvp](../tasks/OCL-011-mvp-enqueue-openclaw-job.md) | Add Mastra tool for proposing/enqueuing approved OpenClaw jobs. | Concierge proposes a crawl; Patricia must approve before execution. | As Sofia, I need one server-side tool path for all OpenClaw jobs. | Mastra tool validates payload -> checks approval -> inserts job. | Mastra, Supabase, OpenClaw gateway. |
| [OCL-012-mvp](../tasks/OCL-012-mvp-e2e-approval-safety.md) | Prove no OpenClaw job can run without approval. | A test tries to enqueue venue scraping without approval and fails. | As Patricia, I need proof that automation cannot bypass me. | E2E attempt unapproved -> blocked; approved -> accepted; logged. | Playwright/test harness, Supabase, Mastra, OpenClaw. |
| [OCL-013-mvp](../tasks/OCL-013-mvp-coffee-tour-crawler.md) | Run the first useful production-style enrichment: coffee tours. | Tourist asks for coffee tours; cards show fresher sources and confidence. | As a Tourist, I want reliable tour recommendations with evidence. | Approved crawl -> fetch sources -> normalize -> Patricia approves card update. | OpenClaw, Gemini, Supabase, CTI cards. |

## Post-MVP Medellin Graph Tasks

| Task | Description | Real-world example | User story | Journey / workflow | Agents / systems |
|---|---|---|---|---|---|
| [OCL-014-postmvp](../tasks/OCL-014-postmvp-menu-extraction.md) | Extract restaurant/cafe menu data from public pages into drafts. | Tourist sees real brunch items for a Laureles cafe. | As a Tourist, I want menu-aware restaurant suggestions. | Approved source crawl -> menu draft -> owner/admin review -> publish. | OpenClaw, Supabase, restaurant profile UI. |
| [OCL-015-postmvp](../tasks/OCL-015-postmvp-instagram-cafe-discovery.md) | Discover public cafe signals from Instagram and public web sources. | Patricia finds new cafe openings in Provenza. | As Patricia, I want hidden gems without manual browsing all day. | Approved discovery -> public signal extraction -> candidate queue. | OpenClaw browser, Gemini summary, Supabase candidates. |
| [OCL-016-postmvp](../tasks/OCL-016-postmvp-venue-intelligence.md) | Enrich venues with public evidence for event planning. | Roberto compares Plaza Mayor vs a Provenza rooftop for finals. | As Roberto, I need venue facts before building an event plan. | Venue selected -> approved research -> evidence card -> host wizard display. | OpenClaw, Maps/Places, Supabase, hostEventAgent. |
| [OCL-017-postmvp](../tasks/OCL-017-postmvp-event-directory-import.md) | Import public event candidates into review queues. | Patricia reviews Medellin events from public calendars before map display. | As Patricia, I want more events without unreviewed public publishing. | Source run -> candidate normalize -> dedupe -> review -> promote. | OpenClaw, Supabase `event_candidates`, Patricia admin. |
| [OCL-018-postmvp](../tasks/OCL-018-postmvp-listing-enrichment.md) | Enrich rental listings from public landlord/source pages. | Camila sees clearer apartment amenities after admin approval. | As Camila, I want listings with accurate public-source details. | Approved listing crawl -> amenities draft -> host/admin review. | OpenClaw, Supabase, rentalAgent. |
| [OCL-019-postmvp](../tasks/OCL-019-postmvp-sponsor-prospect-research.md) | Research sponsor prospects with citations and category fit. | Patricia finds salons and fashion brands for Miss Medellin. | As Patricia, I want qualified sponsor leads, not a raw scraped list. | Criteria -> approved research -> lead candidates -> score -> CRM review. | OpenClaw, Gemini, sponsorAgent, Supabase CRM. |
| [OCL-020-postmvp](../tasks/OCL-020-postmvp-seo-competitor-monitor.md) | Monitor external city/event content competitors. | Patricia sees which event guides outrank mdeai. | As Patricia, I need weekly competitive intelligence. | Scheduled approved monitor -> diff report -> action suggestions. | OpenClaw, Gemini summary, marketingAgent. |
| [OCL-021-postmvp](../tasks/OCL-021-postmvp-correlation-observability.md) | Add trace/correlation IDs across Mastra, Supabase, and OpenClaw. | Sofia traces why a venue crawl failed. | As Sofia, I need one trace ID per automation. | Request ID -> approval -> job -> result -> UI/log correlation. | Mastra, OpenClaw, Supabase logs, observability. |

## Advanced Channel And Governance Tasks

| Task | Description | Real-world example | User story | Journey / workflow | Agents / systems |
|---|---|---|---|---|---|
| [OCL-022-advanced](../tasks/OCL-022-advanced-wa-templates-allowlist.md) | Define approved WhatsApp templates and recipient allowlists. | Ticket holders get only opted-in event reminders. | As Patricia, I need WhatsApp sends constrained to approved templates. | Template register -> opt-in proof -> send approval -> delivery log. | OpenClaw WhatsApp, Supabase, Patricia. |
| [OCL-023-advanced](../tasks/OCL-023-advanced-event-reminders.md) | Send approved event reminders after event commerce is stable. | Andres gets a T-24h QR ticket reminder for finals. | As Andres, I want timely reminders without spam. | Audience segment -> template preview -> approval -> send -> delivery audit. | OpenClaw WhatsApp, ticketing, Supabase. |
| [OCL-024-advanced](../tasks/OCL-024-advanced-sponsor-roi-screenshots.md) | Capture sponsor ROI screenshots and recap artifacts. | A salon sponsor receives proof of impressions and placement. | As Patricia, I need sponsor renewal evidence after an event. | Metrics selected -> screenshot job -> recap draft -> sponsor approval/send. | OpenClaw browser, analyticsAgent, Supabase Storage. |
| [OCL-025-advanced](../tasks/OCL-025-advanced-external-publish-draft.md) | Draft external event posts without publishing automatically. | Roberto gets a Facebook event draft for human posting. | As Roberto, I want help drafting posts but final control. | Event data -> draft -> approval -> external outbox. | OpenClaw, marketingAgent, CopilotKit approval. |
| [OCL-026-advanced](../tasks/OCL-026-advanced-contest-wa-ops.md) | Support contest WhatsApp ops without touching votes/payments. | Contestants receive rehearsal reminders, not vote edits. | As Patricia, I need contest messaging separated from vote truth. | Audience list -> template preview -> approval -> delivery log. | OpenClaw WhatsApp, contest ops, Supabase audit. |
| [OCL-027-advanced](../tasks/OCL-027-advanced-postiz-handoff.md) | Hand approved campaigns to Postiz scheduling. | A sponsor co-branded post is scheduled after approval. | As Patricia, I want scheduled social posts only after review. | Campaign draft -> approval -> Postiz schedule -> status sync. | Postiz, OpenClaw, marketingAgent. |
| [OCL-028-advanced](../tasks/OCL-028-advanced-paperclip-gates-deferred.md) | Defer Paperclip governance adapter until core gates justify it. | Future budget approval checks before high-volume campaigns. | As Sofia, I need governance extensibility without blocking MVP. | Design adapter -> wait for need -> implement only after proof. | Paperclip, OpenClaw, Supabase. |
| [OCL-029-advanced](../tasks/OCL-029-advanced-paperclip-wa-deferred.md) | Defer Paperclip WhatsApp gateway integration. | Future campaign budgets gate WhatsApp sends. | As Patricia, I want budget-aware outbound controls later. | Paperclip approval -> OpenClaw send -> audit sync. | Paperclip, OpenClaw WhatsApp. |

## Event Expansion Tasks

| Task | Description | Real-world example | User story | Journey / workflow | Agents / systems |
|---|---|---|---|---|---|
| [OCL-030-postmvp](../tasks/OCL-030-postmvp-apify-plugin-sandbox.md) | Sandbox Apify OpenClaw plugin for approved Actor runs. | Sofia tests a harmless public Actor before event source research. | As Sofia, I need Apify power constrained by actor allowlists and cost caps. | Discover actor -> approve start -> collect dataset -> store raw pointer. | OpenClaw Apify plugin, Supabase, Sofia. |
| [OCL-031-postmvp](../tasks/OCL-031-postmvp-event-sponsor-decision-maker-map.md) | Identify sponsor decision-maker role types with evidence. | Patricia learns a boutique likely needs owner approval. | As Patricia, I want to route proposals to the right role type. | Sponsor candidate -> public research -> role confidence -> CRM note. | sponsorAgent, OpenClaw, Gemini, Supabase CRM. |
| [OCL-032-postmvp](../tasks/OCL-032-postmvp-sponsor-proposal-draft-pack.md) | Generate approval-ready sponsor proposal drafts. | A Provenza salon receives a human-approved package draft. | As Roberto, I want sponsor proposals tailored to the event. | Lead selected -> metrics/context -> draft -> approval -> outbound queue. | sponsorAgent, Gemini, CopilotKit, Supabase. |
| [OCL-033-postmvp](../tasks/OCL-033-postmvp-event-vendor-recruitment-research.md) | Research vendors for event planning. | Roberto shortlists AV, makeup, photo, and livestream vendors. | As Roberto, I need vetted vendors with public evidence. | Vendor category -> approved research -> shortlist -> contact draft. | OpenClaw, venueAgent, sponsorAgent, Supabase. |
| [OCL-034-postmvp](../tasks/OCL-034-postmvp-event-social-intelligence.md) | Collect source-labeled public social signals for events. | Patricia sees Instagram buzz around a Provenza venue. | As Patricia, I need social context before campaign planning. | Approved public-source run -> signal extraction -> summary -> review. | OpenClaw browser/Apify, marketingAgent, Gemini. |
| [OCL-035-advanced](../tasks/OCL-035-advanced-approved-channel-campaigns.md) | Execute approved WhatsApp/Postiz/social campaigns. | Sponsor announcement posts go out after approval. | As Patricia, I want campaign automation with a visible stop button. | Campaign approved -> channel checks -> schedule/send -> delivery audit. | OpenClaw, Postiz, WhatsApp, Supabase. |
| [OCL-036-postmvp](../tasks/OCL-036-postmvp-repo-skill-intake-audit.md) | Gate every repo/skill/Actor before adaptation. | `event-planner-os` is reviewed before shaping Roberto's checklist. | As Sofia, I need source decisions recorded before work begins. | Source intake -> license/security/test review -> adapt/reject/defer. | Sofia, OpenClaw policy, mde-task-lifecycle. |
| [OCL-037-postmvp](../tasks/OCL-037-postmvp-event-planner-checklist-adapter.md) | Adapt event-planner repo patterns into mde-owned checklists. | Roberto generates a Miss Medellin production checklist. | As Roberto, I want AI to draft tasks I can edit and approve. | Event brief -> checklist draft -> approval -> Supabase tasks. | hostEventAgent, Mastra, CopilotKit, Supabase. |
| [OCL-038-postmvp](../tasks/OCL-038-postmvp-event-source-connector-adapters.md) | Normalize public event connectors into one candidate model. | Luma-like and Meetup-like events enter the same review queue. | As Patricia, I want one review workflow for all event sources. | Source run -> normalize -> dedupe -> candidate review -> promote. | OpenClaw, Apify, Supabase `event_candidates`. |
| [OCL-039-postmvp](../tasks/OCL-039-postmvp-event-source-health-monitor.md) | Monitor connector health, drift, and cost. | Sofia gets an alert when a source returns zero events for three runs. | As Sofia, I need source failures visible before the map looks empty. | Scheduled health check -> threshold alert -> ops item -> fix/defer. | OpenClaw, observability, Supabase. |
| [OCL-040-postmvp](../tasks/OCL-040-postmvp-event-page-qa-crawler.md) | QA event pages before campaign approval. | A broken ticket CTA blocks a Miss Medellin campaign push. | As Patricia, I want QA proof before spending sponsor attention. | Approved QA run -> screenshots/facts -> pass/fail -> approval gate. | OpenClaw browser, CopilotKit approval, Playwright-style checks. |
| [OCL-041-advanced](../tasks/OCL-041-advanced-live-ops-ticker.md) | Add role-specific live event ops updates. | Staff see scanner issues while Roberto sees schedule delay summary. | As Roberto, I need event-day status without noisy public broadcasts. | Internal event signal -> severity review -> role-specific ticker -> optional approved send. | OpenClaw, streamingAgent, analyticsAgent, WhatsApp/Postiz only after approval. |

## Agent Boundary Summary

| Agent / system | Allowed role |
|---|---|
| `hostEventAgent` | Draft event setup, checklist, venue planning, and approval cards. |
| `sponsorAgent` | Score and draft sponsor research/proposals; never sends contracts or outreach autonomously. |
| `marketingAgent` | Draft campaign copy and summarize signals; Postiz only after approval. |
| `venueAgent` | Enrich venue evidence with Maps/Places plus approved OpenClaw research. |
| `analyticsAgent` | Summarize ROI, screenshots, and operational metrics. |
| `streamingAgent` | Advanced live ops summaries only; no public announcements without approval. |
| OpenClaw | Executes approved background jobs and captures evidence. |
| Supabase | Stores truth, audit, approvals, candidates, jobs, and results. |
| CopilotKit | Shows review cards, approval cards, and human-in-the-loop UI. |
| Mastra | Orchestrates workflows and validates tool calls. |
