---
title: Full mdeai Project Progress Forensic Audit
date: 2026-05-24
auditor: Codex forensic audit
scope:
  - plan/
  - prd.md
  - mvp.md
  - advanced.md
  - todo.md
  - tasks/
  - screens/
  - screenshots/
  - supabase/
  - mdeapp/
mode: audit only
---

# Executive Verdict

## Top Summary Table

| Area | Percent Correct | Readiness | Evidence | Blocking Gap |
|---|---:|---|---|---|
| Runtime architecture | 92% | Green | `/api/copilotkit` uses `CopilotRuntime` + `getLocalAgentsWithLogging({ mastra })`; no `HttpAgent` in app route | Mastra beta package drift remains a maintenance risk |
| Local test/build gates | 95% | Green | `lint`, `typecheck`, `build`, `test`, `floor` exited 0 | `npm audit` reports moderate advisories; `next build` warns about workspace root + deprecated `middleware` convention |
| CopilotKit/Mastra agents | 82% | Yellow | `conciergeAgent`, `routerAgent`, `rentalAgent`, `eventAgent`, `evaluationAgent`, `pingAgent` registered | `hostEventAgent` missing; HITL not wired |
| ADK + Grounding Lite | 86% | Green/Yellow | `verify:grounding` HTTP 200, 5 pins; `smoke:grounding-attribution` renders attribution | Formal ADK package/search grounding tasks still deferred |
| Google Maps UI | 88% | Green/Yellow | rental cards + pins, attribution, card-pin sync all pass | MAP-004 Places client/proxy/field-mask work not implemented |
| Supabase schema | 84% | Yellow | required MVP tables exist; RLS enabled; rows present | app does not yet prove G1/G2/G3 flows against these tables |
| Stripe/tickets | 45% | Red | live `ticket-checkout`, `ticket-payment-webhook`, `ticket-validate` functions exist | mdeai repo UI/task flow not implemented; no fresh Stripe test proof |
| Screens/wireframes | 32% | Red | `/` shell, query bar, workflow strip, rental cards exist | most SCREEN tasks are Not Started/In Progress; no per-screen Playwright evidence |
| Progress tracker accuracy | 78% | Yellow | `tasks/progres.md` mostly names true blockers | undercounts current SCREEN-001-005 code and still has historical status drift |
| MVP readiness | 58% | Red/Yellow | core chat/maps now work | G1 ticket, G2 lead, G3 host publish not proven |

## Verdict

- **Overall readiness:** 64/100.
- **MVP readiness:** 58/100.
- **Is the task order correct?** Mostly yes after the screen-first correction, but it must explicitly put G2 lead capture and G1 ticket checkout before Roberto HITL if the MVP exit requires one lead and one paid ticket.
- **Will the current plan succeed?** Yes, if the team stops marking shell work as product-ready and executes the next P0 gates in order. No, if it keeps building deferred Maps/ADK depth before ticket/lead/host workflow proof.
- **Biggest blocker:** MVP gates G1/G2/G3 are still unproven: Andrés cannot buy a ticket from the mdeapp UI, Camila cannot submit a real viewing lead from the schedule modal, and Roberto cannot create/publish an event through a HITL host wizard.
- **Biggest red flags:** production claims outpace screen evidence; `hostEventAgent` is not built; schedule viewing modal is intentionally disabled; event/checkout/ticket routes are absent; task docs still contain stale references to legacy `ai-chat` in planning areas even though app code is clean.
- **What to do next:** finish SCREEN-001/003/004/005 visual proof, wire SCREEN-008 + F47, wire SCREEN-006/014/009/015 + EVT-01, then build F33-F38 host wizard/HITL.

# Evidence Snapshot

| Check | Result |
|---|---|
| `npm test` | Pass: 22 files, 97 tests |
| `npm run lint` | Pass: exit 0 |
| `npm run typecheck` | Pass: exit 0 |
| `npm run build` | Pass: exit 0; routes `/`, `/chat`, `/api/copilotkit`, `/host/event/new`, auth routes |
| `npm run verify:grounding` | Pass: ADK sidecar invoke HTTP 200, source `grounding-lite`, 5 pins |
| `npm run smoke:map-pins` | Pass: chat response visible, 5 rental cards, 6 map pins |
| `npm run smoke:f50-pin-sync` | Pass: card click selects pin; pin click keeps selected card |
| `npm run smoke:grounding-attribution` | Pass: 5 grounded cards, attribution rendered, 0 critical console errors |
| `npm run verify:console` | Pass: `/` loaded, 0 critical console errors |
| `npm run floor` | Pass: lint/typecheck/build/test/audit exited 0; audit shows moderate advisories only |
| Forbidden runtime grep | App route has no `HttpAgent`; app src has no `functions/v1`, `ai-chat`, `ai-router`, `react-google-maps/api`, `react-wrapper`, `Mapbox`, or `Leaflet` |
| Service role grep | Service role appears only in allowed server-side Mastra/lib paths and scripts/tests, not client components |
| Supabase MCP | Required MVP tables exist; RLS enabled on inspected tables; relevant functions/RPCs exist |

Warnings from proof:

- `next build` warns that Next inferred `/home/sk/package-lock.json` as workspace root while `mdeapp/package-lock.json` also exists. Add `turbopack.root` or clean lockfile ownership before production confidence.
- `next build` warns `middleware` convention is deprecated in favor of `proxy`.
- `npm audit --audit-level=high` exits 0, but reports moderate `postcss` and `uuid` advisories. Do not force-downgrade CopilotKit/Next to fix these.
- `mdeapp/src/mastra/public/mastra-agent-memory.db*` files still exist on disk even though runtime storage now uses Postgres with `DATABASE_URL` and `:memory:` locally. They should be deleted from the repo if tracked or ignored if untracked.

# Progress Task Tracker

Status legend: 🟢 Completed = fully functional and tested; 🟡 In Progress = partially working; ⚪ Not Started = planned but not implemented; 🟥 Blocked = missing dependency or critical failure.

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|---|---|---:|---:|---|---|---|
| F01 Bootstrap | Next/Mastra/CopilotKit scaffold | 🟢 Completed | 100 | app builds | none | keep |
| F01b Vulnerability triage | audit baseline | 🟢 Completed | 85 | audit script exists; floor passes | moderate advisories still open | document risk, avoid force downgrade |
| F02 pingAgent | Gemini ping agent | 🟢 Completed | 100 | `pingAgent` registered | none | keep |
| F03 Shell | English-only app shell | 🟢 Completed | 100 | `layout.tsx` `lang="en"` | none | keep |
| F04 Env wiring | local env scripts | 🟢 Completed | 90 | env verify scripts exist | live Vercel env not rechecked in this audit | re-run before deploy |
| F05 Boot verification | local runtime proof | 🟢 Completed | 95 | console/map smokes pass | no new screenshot in this audit | keep |
| F06 Vercel preview | deploy baseline | 🟡 In Progress | 80 | prior evidence claims prod smoke | not re-smoked live today | rerun production smoke after MVP gates |
| F07 shadcn/Paisa | UI primitives/tokens | 🟢 Completed | 90 | components exist | full visual system not finished | keep |
| F08 Auth | Supabase login/signup | 🟢 Completed | 90 | `/login`, `/signup`, auth callback exist | auth UX polish task pending | SCREEN-017 later |
| F09 Floor/Vitest | quality gates | 🟢 Completed | 100 | `floor` passes | moderate audit warnings | keep |
| F10 Legacy freeze | architecture freeze docs | 🟢 Completed | 95 | app grep clean for legacy chat | stale plan drafts still mention legacy paths | clean stale docs later |
| F11 Stripe audit | ticket/sponsor secret separation | ⚪ Not Started | 0 | task exists | no fresh secret/webhook proof | run before EVT-01 |
| F12 chat-lead JWT | lead edge auth fix | 🟡 In Progress | 80 | `chat-lead-capture` live and local function exists | modal not wired; G2 not proven | F47 + SCREEN-008 |
| F13 ai_runs | Mastra run logging | 🟢 Completed | 90 | `ai_runs` 307 rows; server writer exists | MASTRA-004 coverage incomplete | execute MASTRA-004 |
| F13b Workspace/skills | skills pack | 🟢 Completed | 100 | docs/tasks exist | none | keep |
| F18 routerAgent | intent router | 🟢 Completed | 85 | agent/tool code and tests exist | `/` uses concierge directly, not router as primary | keep as support agent |
| F19 conciergeAgent | main chat agent | 🟢 Completed | 90 | provider agent is `conciergeAgent`; tools wired | screen polish incomplete | continue screens |
| F20 evaluation/deploy prep | eval agent prod use | 🟡 In Progress | 40 | `evaluationAgent` exists | no prod eval gate | defer until MVP flows |
| F21A auto-review | PR review calibration | ⚪ Not Started | 0 | checklist exists | not executed | defer |
| F22 photo library | Medellin assets | ⚪ Not Started | 0 | spec exists | assets not ported | optional after event/rental cards |
| F26 restaurant card | restaurant UI | ⚪ Not Started | 0 | restaurant tool exists | card component absent | defer |
| F30 onboarding layout | onboarding shell | ⚪ Not Started | 0 | spec exists | out of MVP | defer |
| F32 production smoke | prod proof gate | ⚪ Not Started | 0 | spec exists | blocked by G1/G2/G3 | run after MVP gates |
| F48 map canvas | 3-panel shell | 🟢 Completed | 90 | `/` renders shell and map | per-screen visual proof incomplete | finish SCREEN-001 |
| F49 generative search UI | cards to pins | 🟢 Completed | 95 | smoke cards + pins pass | EventCard still generic | F25/SCREEN-006 |
| F50 map UI state | pin/card sync | 🟢 Completed | 95 | pin sync smoke passes | thread hydration later | keep |
| MAP-001 | MapContext + vis.gl | 🟢 Completed | 100 | map components and smokes pass | none | keep |
| MAP-002 | ADK Grounding + attribution | 🟢 Completed | 90 | sidecar + UI attribution smoke pass | formal ADK package/search grounding deferred | keep MVP scope |
| MAP-002A | formal ADK LlmAgent package | ⚪ Not Started | 0 | sidecar works without it | package not built | Phase 2 |
| MAP-002D | Search grounding | ⚪ Not Started | 0 | spec exists | not enabled | Phase 2 |
| MAP-004 | Places API New clients | ⚪ Not Started | 0 | cache tables exist | no Places client/field-mask proof | after P0 screens |
| MAP-005 | places proxy/cache | ⚪ Not Started | 0 | cache tables exist | edge/client missing | post-MVP |
| MAP-006 | nearby search CTA | ⚪ Not Started | 0 | map pins work | no nearby workflow | post-MVP |
| MAP-007 | original polish | ⚪ Not Started | 0 | superseded by 007B | should not run | delete/close as superseded |
| MAP-007B | center CopilotChat layout | 🟢 Completed | 90 | layout smoke/evidence exists | screen proof incomplete | keep |
| MAP-008 | Map ID/AdvancedMarker | 🟢 Completed | 95 | map ID guards/tests exist | prod key rotation not rechecked | keep |
| MAP-009 | clustering | ⚪ Not Started | 0 | dependency present? not verified as installed | no clusterer UI | post-MVP |
| MAP-010 | venue autocomplete | ⚪ Not Started | 0 | spec exists | Places client missing | after F34/F36 |
| MAP-011 | route previews | ⚪ Not Started | 0 | spec exists | compute routes not wired | Phase 2 |
| MAP-012 | neighborhood intel | ⚪ Not Started | 0 | spec exists | not built | Phase 2 |
| MAP-013 | env/key verification | 🟢 Completed | 95 | no public Places key in app src; env scripts guard | live Vercel env not rechecked | re-run before deploy |
| MASTRA-001 | core wiring smoke | 🟡 In Progress | 70 | tests/runtime are green | task status still Not Started | mark/finish with evidence |
| MASTRA-003 | Postgres storage | 🟢 Completed | 95 | build logs Postgres; live tables have messages/threads | stale local DB files remain | remove/ignore DB files |
| MASTRA-004 | ai_runs audit coverage | 🟡 In Progress | 60 | `ai_runs` rows exist | tool coverage/user id audit incomplete | execute next infra hardening |
| MASTRA-005 | PR gate | ⚪ Not Started | 0 | floor script exists | PR gate docs/hooks not proven | after MVP gates |
| CK-002 | typed map UI state | 🟢 Completed | 95 | `MapUiSync` + `ConciergeWorkingMemory` | hydration after persistence not tested | CK-005 later |
| CK-003 | frontend tools | 🟡 In Progress | 45 | `focusMapPin` exists; disabled tool renders exist | modal/navigation/checkout tools missing | add after G1/G2 screens |
| CK-004 | HITL interrupt | ⚪ Not Started | 0 | `ApprovalPanel` stub only | no `renderAndWaitForResponse` | F37 |
| SCREEN-001 | home chat chrome | 🟡 In Progress | 55 | `GeoChatShell`, `ChatCanvas`, header exist | per-screen Playwright/screenshots incomplete | finish visual proof |
| SCREEN-002 | nav rail/threads | ⚪ Not Started | 10 | nav rail stub exists | thread hydration not built | defer until retention |
| SCREEN-003 | query bar/chips | 🟡 In Progress | 55 | `ChatQueryBar`, chip contract exist | dedicated e2e/screenshot missing | finish after SCREEN-001 |
| SCREEN-004 | workflow strip | 🟡 In Progress | 50 | `WorkflowProgressStrip` exists | workflow states not per-screen proven | finish with Playwright |
| SCREEN-005 | rental card polish | 🟡 In Progress | 60 | rental card CTAs exist, pin sync passes | save disabled, lead submit blocked | finish with SCREEN-008 |
| SCREEN-006 | event card polish | ⚪ Not Started | 15 | generic event render exists | no EventCard/Buy CTA | F25 then SCREEN-006 |
| SCREEN-007 | venue detail sheet | ⚪ Not Started | 0 | no route/sheet found | not built | after card polish |
| SCREEN-008 | schedule viewing | 🟥 Blocked | 20 | modal shell opens from card | form disabled; no edge submit | F47 + edge smoke |
| SCREEN-009 | checkout modal | 🟥 Blocked | 0 | live edge exists | no UI modal/Stripe test proof | F11 + EVT-01 + SCREEN-009 |
| SCREEN-010 | map exploration | ⚪ Not Started | 20 | map panel works | full-screen mode not built | post-P0 |
| SCREEN-011 | saved collections | ⚪ Not Started | 0 | tables exist | no `/saved` route | P1/P2 |
| SCREEN-012 | trips dashboard | ⚪ Not Started | 0 | tables exist | no `/trips` route | defer |
| SCREEN-013 | itinerary panel | ⚪ Not Started | 0 | wireframes exist | no implementation | defer |
| SCREEN-014 | event detail | 🟥 Blocked | 0 | events table exists | no `/events/[slug]` route | build before checkout |
| SCREEN-015 | My tickets QR | 🟥 Blocked | 0 | ticket tables/functions exist | no `/me/tickets` route | after checkout |
| SCREEN-016 | host event wizard | 🟥 Blocked | 5 | auth-gated placeholder exists | no wizard, hostEventAgent, HITL | F33-F38 |
| SCREEN-017 | login polish | ⚪ Not Started | 25 | auth routes exist | polish/return URLs incomplete | later |
| SCREEN-018 | mobile shell | 🟡 In Progress | 35 | map mobile sheet/e2e assets exist | screen task still Not Started/Deferred | after P0 desktop |
| SCREEN-019 | loading/error/empty | ⚪ Not Started | 0 | scattered states exist | no standard pass | before production |
| SCREEN-020 | a11y pass | ⚪ Not Started | 0 | no axe/keyboard proof | not run | before production |
| F14 event agent | event search agent | 🟢 Completed | 85 | `eventAgent` exists | search UI generic | F25/SCREEN-006 |
| F15 event workflow/tool | event search workflow | 🟢 Completed | 80 | `search-events` tool queries Supabase | no ticket purchase surface | F25/EVT-01 |
| F25 EventCard | shared EventCard | ⚪ Not Started | 0 | spec exists | not implemented | do before SCREEN-006 |
| EVT-01 checkout/webhook port | ticket checkout proof | 🟥 Blocked | 35 | live ticket functions/RPCs exist | mdeai repo task not executed; no UI proof | execute with F11 |
| F33 EventDraftState | Roberto draft schema | ⚪ Not Started | 0 | spec exists | type absent | start host chain |
| F34 hostEventAgent | Roberto creator agent | 🟥 Blocked | 0 | no agent registered | missing entirely | after F33 |
| F35 host events list | host events page | ⚪ Not Started | 0 | no route | missing | after F36 |
| F36 host wizard | `/host/event/new` wizard | 🟥 Blocked | 5 | placeholder route only | no `useCoAgent<EventDraftState>` | after F34 |
| F37 HITL approval | `renderAndWaitForResponse` | 🟥 Blocked | 0 | `ApprovalPanel` stub only | no HITL | after F36 |
| F38 approval commit | edge/RPC commit | 🟥 Blocked | 20 | `decide_approval` RPC exists | edge not in repo/live list | implement after F37 |
| F17 rental agent/tools | rental search agent | 🟢 Completed | 85 | `rentalAgent`, `search-rentals` | fallback mocks can mask DB failure | add no-mock prod assert |
| F24 rental card | card component | 🟡 In Progress | 60 | `RentalCard` exists under copilot | task still Not Started | close/merge with SCREEN-005 |
| F41 rentals page map | standalone rentals route | ⚪ Not Started | 0 | `/` handles chat/map | no `/rentals` page | likely defer/delete |
| F46 rental workflow | search workflow | 🟢 Completed | 90 | smoke returns cards/pins | lead capture missing | F47 |
| F47 lead capture API | schedule lead submit | 🟥 Blocked | 25 | `chat-lead-capture` function live/local | no modal submit/tool | execute now |
| Automations | reminders/monitors | ⚪ Not Started | 0 | no active task proof found | not MVP | do not build now |
| Dashboards/admin | Patricia ops | ⚪ Not Started | 0 | schema/logging exists | no `/admin/*` | defer |

# Task Correctness Audit

| Task | Current status | Verified status | Percent correct | Dependencies correct? | Commands correct? | Red flags | Fix |
|---|---|---:|---:|---|---|---|---|
| Core F01-F10 | mostly Done | mostly true | 90 | yes | yes | some old audit docs still list earlier gaps | leave closed, do not churn |
| F11 | Not Started | true blocker | 0 | yes | yes | Stripe secret separation not revalidated | run before checkout work |
| F12 | Done | partial for MVP | 80 | yes | mostly | function exists but UI submit missing | pair with F47/SCREEN-008 |
| F13 | Done | true | 90 | yes | yes | MASTRA-004 still needed for coverage | run audit coverage task |
| F18/F19 | Done | true enough | 87 | yes | yes | router exists but concierge is primary provider | document actual primary agent |
| F20/F21A/F22/F26/F30/F32 | Not Started | true | 0-40 | mostly | mixed | not MVP-critical except F32 after gates | defer |
| F48/F49/F50 | Done | true for runtime | 93 | yes | yes | screen Done gates not satisfied | keep task Done, keep SCREEN tasks In Progress |
| MAP-001/002/007B/008/013 | Done | true for MVP map slice | 94 | yes | yes | no MAP-004 Places depth | keep |
| MAP-004-012 | Not Started | true | 0 | mostly | mostly | should not block visible MVP except MAP-004 for venue depth | defer until P0 screens |
| MASTRA-001 | Not Started | stale | 70 | yes | yes | runtime smoke exists but task not closed | update task/evidence or split into current smoke |
| MASTRA-003 | Done | true | 95 | yes | yes | stale local DB files remain | remove/ignore DB artifacts |
| MASTRA-004/005 | Not Started | true | 0-60 | yes | yes | user_id/tool audit and PR gates missing | after P0 flow proof |
| CK-002/003/004 | mixed | CK-002 done, CK-003 partial, CK-004 missing | 47 avg | yes | mostly | HITL is not implemented | build with F37 |
| SCREEN-001-005 | In Progress | accurate | 50 avg | yes | visual standard yes | no per-screen Playwright/screenshots | execute in screen-first order |
| SCREEN-006/014 | Not Started | true blocker for event sales UX | 0-15 | yes | yes | eventAgent output has generic cards only | F25 then SCREEN-006/014 |
| SCREEN-008 | Not Started | shell exists but blocked | 20 | yes | yes | disabled submit | F47 now |
| SCREEN-009/015 | Not Started | true blocker | 0 | yes | yes | no checkout modal or tickets route | F11 + EVT-01 |
| SCREEN-016 | Not Started | auth shell only | 5 | yes | yes | no agent/state/HITL | F33-F38 |
| Events F14/F15 | Done | search only, not commerce | 82 | yes | yes | event output cannot sell tickets | don't call ticketing done |
| Events F25/F33-F38/EVT-01 | Not Started | true | 0-35 | mostly | mostly | core MVP promises depend on these | execute P0 subset |
| Real estate F17/F46 | Done | true for search | 88 | yes | yes | fallback mocks can hide DB failure | add prod no-fallback smoke |
| Real estate F47 | Not Started | true blocker | 25 | yes | yes | modal waiting on it | execute immediately |

# Screen/Wireframe Audit

| Screen | Path | Task ID | Implemented? | Backend ready? | Supabase ready? | Maps ready? | Score /100 | Next action |
|---|---|---|---|---|---|---|---:|---|
| Home chat chrome | `/` | SCREEN-001 | Partial | yes | n/a | yes | 55 | dedicated Playwright + screenshot evidence |
| Chat nav rail | `/` | SCREEN-002 | Stub/partial | partial | mastra threads exist | n/a | 10 | defer until thread hydration |
| Query bar | `/` | SCREEN-003 | Partial | yes | n/a | yes | 55 | prove chips update working memory |
| Workflow strip | `/` | SCREEN-004 | Partial | yes | n/a | n/a | 50 | prove tool-status transitions |
| Rental cards | `/` generative UI | SCREEN-005 | Partial | yes | apartments ready | yes | 60 | finish CTAs and visual gate |
| Event cards | `/` generative UI | SCREEN-006 | Generic only | event search yes | events ready | partial | 15 | build EventCard + Buy CTA |
| Venue detail sheet | overlay | SCREEN-007 | No | Places missing | cache tables ready | yes | 0 | build after cards |
| Schedule viewing modal | modal | SCREEN-008 | Shell only | blocked | leads table ready | yes | 20 | wire F47 submit |
| Checkout modal | modal | SCREEN-009 | No | ticket edges live but unproven in app | event_orders ready | n/a | 0 | F11 + EVT-01 + Stripe test |
| Saved collections | `/saved` | SCREEN-011 | No | not wired | saved_places ready | yes | 0 | defer |
| Trips dashboard | `/trips` | SCREEN-012 | No | not wired | trips/trip_items ready | partial | 0 | defer |
| Itinerary panel | `/trips/[id]` | SCREEN-013 | No | not wired | trip_items ready | future | 0 | defer |
| Event detail | `/events/[slug]` | SCREEN-014 | No | event search yes | events/event_tickets ready | partial | 0 | build before checkout |
| My tickets QR | `/me/tickets` | SCREEN-015 | No | ticket functions live | event_orders ready | n/a | 0 | after checkout |
| Host event wizard | `/host/event/new` | SCREEN-016 | Placeholder | no host agent | events/approval tables ready | manual map ok | 5 | F33-F38 |
| Auth polish | `/login`, `/signup` | SCREEN-017 | Basic | yes | auth ready | n/a | 25 | later |
| Mobile shell | `/` | SCREEN-018 | Partial | yes | n/a | yes | 35 | after desktop P0 |
| Loading/error/empty | cross | SCREEN-019 | Scattered | partial | n/a | partial | 10 | before prod |
| A11y pass | cross | SCREEN-020 | No | n/a | n/a | n/a | 0 | before prod |

# Supabase Audit

Live MCP queries were read-only against project `zkwcbyxiwklihegjhuql`.

| Supabase Area | Needed? | Status | Risk | Score /100 | Fix |
|---|---|---|---|---:|---|
| MVP inventory tables | yes | `apartments`, `events`, `event_orders`, `event_tickets`, `leads` exist | UI flows not complete | 85 | build G1/G2 surfaces |
| Mastra persistence | yes | `mastra_threads` 121 rows, `mastra_messages` 263 rows | thread hydration UI not built | 90 | later CK hydration test |
| Observability | yes | `ai_runs` 307 rows | coverage by tool/user_id incomplete | 85 | MASTRA-004 |
| Grounding quota | yes | `grounding_quota_log` exists, RLS enabled, 2 rows | quota failure allows calls in code | 75 | decide fail-open vs fail-closed for prod |
| Places cache | post-MVP/MAP-004 | `places_search_cache`, `place_details_cache` exist with RLS/indexes | no Places client/proxy yet | 70 | MAP-004/005 |
| Saved/trips | post-MVP | `saved_places`, `trips`, `trip_items` exist | no UI/routes | 60 | defer |
| Approval tables/RPCs | MVP host flow | `approval_requests`, `approval_decisions`, `decide_approval`, `request_approval` exist | no edge/HITL flow | 70 | F37/F38 |
| Ticket RPCs | MVP ticket flow | `ticket_checkout_create_pending`, `ticket_payment_finalize`, `ticket_validate_consume` exist | UI/Stripe proof absent | 75 | EVT-01 |
| RLS | mandatory | inspected MVP tables all `rls_enabled=true`, policy count >= 1 | policy semantics not fully audited row-by-row | 85 | run targeted RLS tests before prod |
| Indexes | mandatory | key indexes exist for apartments/events/orders/leads/mastra/cache | no performance load test | 85 | run explain/load after flows |
| Edge functions | mandatory | live list includes `chat-lead-capture`, `ticket-checkout`, `ticket-payment-webhook`, `ticket-validate`; no live `ai-chat`/`ai-router` in list | ticket functions deployed from legacy/proof paths, not mdeai repo tree | 75 | port/source-control mdeai function code or document canonical source |
| Secrets | mandatory | no secret values printed; app grep shows no service role in client | Vercel secrets not revalidated | 80 | run F11 + env audit pre-prod |

# CopilotKit / Mastra / ADK / Maps Audit

| System | Best-practice status | Current implementation | Risk | Score /100 | Fix |
|---|---|---|---|---:|---|
| CopilotKit runtime | Correct Pattern 1 | `CopilotRuntime` + `ExperimentalEmptyAdapter` + local Mastra agents | low | 95 | keep |
| CopilotKit versioning | Correct | `@copilotkit/*` pinned `1.55.2` | medium due transitive advisories | 90 | do not downgrade |
| Agent name match | Correct for `/` | provider agent `conciergeAgent`; Mastra key exists | low | 95 | keep |
| Generative UI | Correct/partial | disabled `useCopilotAction` renders for search tools | medium | 80 | add event-specific and HITL renders |
| Shared state | Correct/partial | typed `useCoAgent<ConciergeWorkingMemory>`; `mapUi` mirror | medium | 85 | add hydration tests |
| HITL | Missing | only `ApprovalPanel` stub; no `renderAndWaitForResponse` | high | 0 | F37 |
| Mastra storage | Correct now | `DATABASE_URL` -> `PostgresStore`, local `:memory:` | low | 90 | remove stale db files |
| Mastra agents | Mostly correct | 6 registered agents; no duplicate runtime | medium | 82 | add `hostEventAgent` only when F33 ready |
| Workflows | Partial | rental/event/concierge workflows exist | medium | 75 | avoid marking commerce/workflow done |
| ADK sidecar | Correct MVP shape | Mastra -> HTTP -> `ADK_GROUNDING_URL` | medium | 86 | formalize package after MVP |
| Grounding Lite | Working | sidecar returns source `grounding-lite`; attribution rendered | medium | 88 | quota/fallback policy hardening |
| Places API New | Not implemented | cache schema exists only | medium | 0 | MAP-004 with `X-Goog-FieldMask` |
| Maps renderer | Correct | vis.gl map, Map ID guard, AdvancedMarker path | low | 90 | keep |
| Pin ownership | Correct | pins flow through `MapContext` merge/pan APIs | low | 90 | keep direct `setPins` private |
| Legacy runtime avoidance | Correct in app | no app `HttpAgent`, `ai-chat`, `ai-router`, `functions/v1` | low | 95 | clean stale docs only |

# Overlap / Duplicate Task Audit

| Overlap | Files/tasks | Problem | Recommendation |
|---|---|---|---|
| SCREEN-005 vs F24 | `tasks/screens/SCREEN-005-*`, `tasks/real-estate/F24-*`, `src/components/copilot/rental-card.tsx` | RentalCard exists, but F24 remains Not Started | Close F24 as superseded/absorbed by SCREEN-005 or convert to visual polish only |
| MAP-007 vs MAP-007B | `tasks/maps/MAP-007*`, `MAP-007B*` | original task is superseded but still present | mark MAP-007 closed/superseded everywhere |
| MASTRA-001 status drift | `tasks/mastra/MASTRA-001*`, tests/scripts | runtime smoke proof exists but task says Not Started | update task with evidence or split "dedicated runtime smoke" |
| Ticket functions source drift | live Supabase functions vs `tasks/events/EVT-01*` | live functions exist, but mdeai repo task says not ported | decide canonical source, commit mdeai copies or document live external source |
| Legacy AI docs | `plan/**`, `tasks/backup/**`, stale drafts | many references to `ai-chat`/`ai-router`; app is clean | do not delete backups, but label draft docs stale/non-authoritative |
| Screen evidence naming | `tasks/audit/25a-mde-audit.md`, previous `25-mde-audit.md` | old `25` was screen-only; new request requires full audit | this file supersedes old `25`; keep `25a` as screen-specific |
| `/chat` docs vs implementation | docs/tasks call `/chat`; app redirects to `/` | not wrong but can confuse verification | document `/` canonical, `/chat` alias |

# Failure Points / Blockers

1. **G2 Camila lead capture is blocked.** The rental card opens a schedule modal, but `ScheduleViewingModal` disables every field and submit button until F47. Camila cannot create a real `leads` row from UI.
2. **G1 Andrés ticket purchase is blocked.** Ticket tables/RPCs/functions exist, but there is no event detail route, checkout modal, or My Tickets QR route in `mdeapp/src/app`.
3. **G3 Roberto host publish is blocked.** `/host/event/new` is an auth placeholder; no `EventDraftState`, `hostEventAgent`, wizard, approval panel, or approval commit edge is implemented.
4. **Screen Done gates are not met.** SCREEN-001-005 have code but lack per-screen Playwright specs, screenshots, and Chrome DevTools/MCP evidence required by `SCREEN-TESTING-STANDARD.md`.
5. **Places API New is not ready.** MAP-004 is Not Started; no server Places client/field-mask enforcement exists yet.
6. **Fallback mocks can hide production search failures.** `search-rentals` falls back to mock data on DB errors; this is useful for local dev but unsafe as a silent production behavior.
7. **Task/progress truth has drift.** Progress is directionally honest now, but task statuses still conflict with code for MASTRA-001/F24 and with screen code partials.
8. **Production proof is incomplete.** Local gates are strong; live Vercel/G1/G2/G3 proof was not produced in this audit.
9. **Moderate dependency advisories exist.** `npm audit --audit-level=high` exits 0, but `postcss` and `uuid` advisories remain.
10. **Workspace root warning can bite CI.** Next detects multiple lockfiles and chooses `/home/sk/package-lock.json`; tighten `turbopack.root`.

# Correct Implementation Order

| Order | Task | Why now | Depends on | Verify command | Status |
|---:|---|---|---|---|---|
| P0-0 | Fix workspace/root warnings + stale DB artifacts | avoid noisy CI/prod storage confusion | none | `npm run build`, `rg "mastra-agent-memory.db"` | Partial |
| P0-1 | SCREEN-001 home chat chrome proof | visible product foundation | F48/MAP-007B | `npm run verify:console`, Playwright screenshots | In Progress |
| P0-2 | SCREEN-003 query chips | Camila can steer searches | SCREEN-001/F50 | Playwright chips + `npm test` | In Progress |
| P0-3 | SCREEN-004 workflow strip | search feels alive | F49 | tool-status e2e | In Progress |
| P0-4 | SCREEN-005 rental card polish | Camila sees usable cards | F49/F50 | `npm run smoke:map-pins`, `npm run smoke:f50-pin-sync` | In Progress |
| P0-5 | F47 + SCREEN-008 lead submit | MVP G2 | F12, SCREEN-005 | curl edge + UI submit + `leads` row | Blocked |
| P0-6 | F25 + SCREEN-006 event cards | prerequisite to event detail | F15/F49 | event card smoke | Not Started |
| P0-7 | SCREEN-014 event detail | prerequisite to checkout | SCREEN-006 | route 200 + DB read | Not Started |
| P0-8 | F11 + EVT-01 + SCREEN-009 checkout | MVP G1 | Stripe secrets, event detail | Stripe test + `event_orders.status=paid` | Blocked |
| P0-9 | SCREEN-015 My tickets QR | completes ticket buyer loop | SCREEN-009/EVT-01 | QR render + order lookup | Blocked |
| P0-10 | F33 EventDraftState | host flow foundation | MAP-001/F09 | typecheck + schema tests | Not Started |
| P0-11 | F34 hostEventAgent | Roberto agent | F33/F13 | agent tests + registry grep | Not Started |
| P0-12 | F36 host wizard | Roberto UI | F34 | `/host/event/new` e2e | Placeholder |
| P0-13 | F37/F38 HITL publish | MVP G3 | F36 + approval RPC | `renderAndWaitForResponse` e2e + approval row | Blocked |
| P1 | SCREEN-019/020 | production UX/a11y | P0 flows | console + keyboard/axe | Not Started |
| P1 | MASTRA-004/005 | observability/PR gates | P0 flows | ai_runs coverage + PR gate | Partial |
| P1 | MAP-004 | Places field-mask client | screen P0 stable | unit + field-mask tests | Not Started |
| P2 | MAP-005/006/009/010 | map depth | MAP-004 | integration tests | Not Started |
| P2 | SCREEN-011/012/013 | retention/trips | saved/trips workflow | route/e2e | Not Started |
| P3 | MAP-011/012, ADK 002A/002D, dashboards/admin, automations | advanced | MVP shipped | evals + production proof | Deferred |

# Production Readiness

| Dimension | Score | Band | Rationale |
|---|---:|---|---|
| Architecture correctness | 92 | Green | locked runtime preserved |
| Task correctness | 74 | Yellow | many tasks accurate, but drift and blockers remain |
| Dependency correctness | 78 | Yellow | CopilotKit pinned, Mastra beta risk, audit advisories |
| Screen readiness | 32 | Red | most UI is not implemented/proven |
| Backend readiness | 70 | Yellow | data/search/logging work; commerce/host flows incomplete |
| Supabase readiness | 84 | Yellow | schema/RLS strong; flow proof missing |
| Maps readiness | 88 | Yellow/Green | MVP map proof passes; Places depth absent |
| CopilotKit readiness | 82 | Yellow | generative UI works; HITL missing |
| Mastra readiness | 84 | Yellow | agents/storage good; host agent missing |
| ADK readiness | 76 | Yellow | sidecar works; formal package/search grounding deferred |
| Stripe readiness | 45 | Red | live functions exist; mdeapp UI/evidence absent |
| MVP readiness | 58 | Orange | core chat/maps green, product loops blocked |

# Final Recommendations

## Critical Fixes

1. Do not call MVP ready until G1, G2, and G3 have live proof.
2. Execute F47 + SCREEN-008 first: Camila must be able to submit a viewing lead and prove a `leads` row.
3. Execute F11 + EVT-01 + SCREEN-009/015 next: Andrés must complete a Stripe test ticket and see QR.
4. Execute F33-F38 after the buyer/lead loops: Roberto must publish through typed state and HITL, not silent mutation.
5. Keep MAP-004+ deferred until the screen/product loops are not red.

## Quick Wins

- Add `turbopack.root` or resolve the multiple-lockfile warning.
- Delete or ignore stale `mdeapp/src/mastra/public/mastra-agent-memory.db*`.
- Update MASTRA-001 and F24 status to match code truth.
- Add a production guard so `search-rentals` cannot silently serve mock listings when `NODE_ENV=production`.
- Create dedicated `e2e/screens/SCREEN-001-*.spec.ts` and screenshot evidence to close the first screen task.

## What Not To Work On

- Do not build MAP-009 clustering, MAP-011 routes, MAP-012 neighborhood intelligence, trips/saved, dashboards, automations, OpenClaw, or full ADK package work before G1/G2/G3.
- Do not reintroduce legacy `ai-chat`, `ai-router`, custom SSE, `HttpAgent`, Leaflet, Mapbox, or public Places keys.
- Do not use `npm audit fix --force`; it proposes breaking downgrades.

## Next Five Tasks

1. SCREEN-001 visual proof and `e2e/screens` scaffold.
2. F47 + SCREEN-008 lead capture submit.
3. F25 + SCREEN-006 event card with Buy CTA.
4. SCREEN-014 + EVT-01 + SCREEN-009 Stripe checkout.
5. F33 + F34 + F36 + F37 + F38 host wizard/HITL chain.

## Exact Verification Commands

```bash
cd /home/sk/mdeai/mdeapp
npm run lint
npm run typecheck
npm run build
npm test
npm run verify:grounding
npm run smoke:map-pins
npm run smoke:f50-pin-sync
npm run smoke:grounding-attribution
npm run verify:console
npm run floor
rg "functions/v1|ai-chat|ai-router|HttpAgent|service_role|SUPABASE_SERVICE_ROLE" /home/sk/mdeai/mdeapp -n
rg "CopilotKit|useCopilotAction|useCoAgent|renderAndWaitForResponse" /home/sk/mdeai/mdeapp/src -n
rg "search-rentals|search-events|search-grounded-places" /home/sk/mdeai/mdeapp/src/mastra -n
rg "GOOGLE_MAPS|GOOGLE_PLACES|GOOGLE_GENERATIVE_AI|NEXT_PUBLIC" /home/sk/mdeai/mdeapp -n
```

## Final Answer

- **Are the tasks 100% correct?** No. The architecture tasks are mostly correct; the screen/product/MVP tasks are not complete and several statuses are stale.
- **Will the plan succeed?** Yes, if executed in the corrected P0 order and if Done means tested product behavior, not file existence.
- **What must be fixed first?** Lead capture and ticket checkout proof, after finishing the visible shell evidence. These are the MVP user loops.
- **Which tasks should be modified?** MASTRA-001, F24, MAP-007, SCREEN-001-005 evidence, EVT-01 source-of-truth, F47 integration.
- **Which tasks should be deferred?** MAP-005-012, MAP-002A/002D, saved/trips, dashboards/admin, automations, advanced ADK, clustering/routes/neighborhood intelligence.
- **Is the architecture still correct?** Yes: Browser -> CopilotKit -> `/api/copilotkit` -> Mastra -> Gemini -> ADK sidecar -> Google Maps/Supabase is preserved in app code.
- **Is the project production-ready?** No. The core runtime is healthy; the MVP product loops are not.
