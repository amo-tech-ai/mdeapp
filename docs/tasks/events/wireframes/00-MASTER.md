---
title: AI-Native Events — Wireframe Master
date: 2026-06-08
skill: mde-wireframe
canonical_plan: ../plans/04-AI-native-system.md
diagrams: ../diagrams/00-INDEX.md
locale: en
phase: Phase 1 MVP
---

# AI-Native Events — Wireframe Master

Production-ready wireframe documentation for mdeai Events. **Goal:** chat + click + approve — not Eventbrite forms.

**Per-screen specs:** [`events/`](./events/) · **3-panel shell:** [`000-three-panel-workspace.md`](./000-three-panel-workspace.md) · **Journeys:** [`journeys/`](./journeys/) · **Audit response:** [`WIREFRAME-AUDIT-RESPONSE.md`](./WIREFRAME-AUDIT-RESPONSE.md) · **Shared state:** [`038-shared-state.md`](./038-shared-state.md)

---

## Step 1 — Competitive analysis

| Area | Luma | Eventbrite | AI-native improvement |
|------|------|------------|------------------------|
| Discovery | City feeds, clean cards | Category browse, SEO heavy | **Concierge chat** + map pins + “should I go?” |
| Event creation | Web forms, duplicate event | Long admin wizard | **NL wizard** + `hostEventAgent` + live preview 🟢 |
| Ticketing | Simple tiers, waitlist | Complex fee rules | Stripe modal + agent explains tiers |
| Checkout | Fast mobile pay | Multi-step checkout | One modal → Stripe hosted |
| Host dashboard | Tabbed guests/insights | Organizer hub tables | **`hostOpsAgent`** chat-over-data |
| Analytics | Basic charts | Reports export | Conversational KPI + forecast cards |
| CRM | Guest list export | Limited | `crmLeadScoreWorkflow` + pipeline |
| Sponsors | None native | Add-ons marketplace | `sponsorMatchWorkflow` + HITL proposals |
| Mobile UX | Excellent hero + sticky CTA | Dense marketing pages | Luma layout + AI summary (EVP-032) |
| Navigation | Bottom nav + host tabs | Global header maze | **3-panel** + host nav rail |
| Event management | Per-event tabs | Organizer backend | Single workspace: chat + context panel |

### Pain points (Luma / Eventbrite)

| Friction | AI-native fix |
|----------|---------------|
| Host re-enters data across tabs | Working memory + `HostDashboardState` |
| Attendee uncertainty (“solo OK?”) | Ask Host + AI draft |
| Analytics = export CSV | `salesInsightWorkflow` in chat |
| Sponsor outreach manual | Research + fit score drafts |
| No map intelligence on detail | Places nearby + safety cards |

---

## Step 2 — Screen inventory

| # | Screen | Route | User | Phase | Wireframe |
|---|--------|-------|------|-------|-----------|
| 001 | Home discovery | `/`, `/chat` | Camila | Core 🟢 | [001](./events/001-home-discovery.md) |
| 002 | Search results | `/events` | Andrés | Core 🟢 | [002](./events/002-search-results.md) |
| 003 | Event details | `/events/[slug]` | Andrés | Core 🟡 | [003](./events/003-event-details.md) |
| 004 | Checkout | modal + Stripe | Andrés | Core 🟢 | [004](./events/004-checkout.md) |
| 005 | Ticket wallet | `/me/tickets` | Andrés | Core 🟢 | [005](./events/005-ticket-wallet.md) |
| 006 | Saved events | `/saved` | Camila | MVP | [006](./events/006-saved-events.md) |
| 007 | Profile | `/me` | All | MVP | [007](./events/007-profile.md) |
| 008 | Host dashboard | `/host/events` | Roberto | Core 🟢 | [008](./events/008-host-dashboard.md) |
| 009 | Create event | `/host/event/new` | Roberto | Core 🟢 | [009](./events/009-create-event.md) |
| 010 | Edit event | `/host/events/[id]/edit` | Roberto | MVP | [010](./events/010-edit-event.md) |
| 011 | Ticket management | host event tab | Roberto | Core 🟡 | [011](./events/011-ticket-management.md) |
| 012 | Attendee management | `/host/events/[id]/guests` | Roberto | MVP | [012](./events/012-attendee-management.md) |
| 013 | Revenue dashboard | `/host/analytics` | Roberto | Core 🔴 | [013](./events/013-revenue-dashboard.md) |
| 014 | Event analytics | `/host/analytics` | Roberto | Core 🔴 | [014](./events/014-event-analytics.md) |
| 015 | Sponsor dashboard | `/host/sponsors` | Roberto | MVP | [015](./events/015-sponsor-dashboard.md) |
| 016 | Sponsor opportunities | `/host/sponsors/opportunities` | Roberto | MVP | [016](./events/016-sponsor-opportunities.md) |
| 017 | Sponsorship CRM | `/host/crm` | Roberto | MVP | [017](./events/017-sponsorship-crm.md) |
| 018 | Proposal center | `/host/sponsors/proposals` | Roberto | MVP | [018](./events/018-proposal-center.md) |
| 019 | Admin dashboard | `/admin` | Patricia | MVP | [019](./events/019-admin-dashboard.md) |
| 020 | Moderation | `/admin/events` | Patricia | MVP | [020](./events/020-moderation.md) |
| 021 | Approval center | `/host/approvals` | Roberto | MVP | [021](./events/021-approval-center.md) |
| 022 | Admin operations | `/admin/ops` | Patricia | Advanced | [022](./events/022-admin-operations.md) |
| 023 | Notifications | `/me/notifications` | All | MVP | [023](./events/023-notifications.md) |
| 024 | Host inbox | `/host/inbox` | Roberto | MVP | [024](./events/024-inbox.md) |
| 025 | Venue comparison | wizard / host | Roberto | MVP | [025](./events/025-venue-comparison.md) |
| 026 | Revenue forecast | analytics sub | Roberto | MVP | [026](./events/026-revenue-forecast.md) |
| 027 | Campaign center | `/host/marketing` | Roberto | Advanced | [027](./events/027-campaign-center.md) |
| 028 | AI recommendations overlay | `/` overlay | Camila | MVP | [028](./events/028-ai-recommendations.md) |
| 029 | Venue explorer | `/venues` | Roberto | Core | [029](./events/029-venue-explorer.md) |
| 030 | Venue details | `/venues/[slug]` | Roberto | Core | [030](./events/030-venue-details.md) |
| 031 | Host bookings | `/host/bookings` | Roberto | MVP | [031](./events/031-host-bookings.md) |
| 032 | Event health | `/host/events/[id]/health` | Roberto | MVP | [032](./events/032-event-health.md) |
| 033 | Sponsor ROI | `/host/sponsors/[id]/roi` | Roberto | Advanced | [033](./events/033-sponsor-roi.md) |
| 034 | Exception center | `/admin/exceptions` | Patricia | MVP | [034](./events/034-exception-center.md) |
| 035 | Recommendations hub | `/recommendations` | Camila | MVP | [035](./events/035-recommendations-hub.md) |
| 036 | Attendee inbox | `/inbox` | Andrés | MVP | [036](./events/036-attendee-inbox.md) |
| 037 | Global UX patterns | all routes | All | MVP | [037](./events/037-global-ux-patterns.md) |

---

## Data schema appendix (wireframe → Supabase)

| Table | Screens | Phase |
|-------|---------|-------|
| `events`, `ticket_tiers`, `orders`, `tickets` | 003–005, 011 | Core 🟢 |
| `ai_runs`, `mastra_threads` | all agent surfaces | Core 🟡 SAN-704 |
| `approval_logs` | 021, 009 HITL | Core design |
| `workflow_runs` | analytics, sponsors | MVP design |
| `event_views`, `visitor_sessions` | 014 funnel | MVP design |
| `venues`, `venue_bookings` | 029–031, 025 | Core/MVP |
| `sponsors`, `sponsor_deals`, `sponsor_opportunities`, `sponsor_proposals` | 015–018, 033 | MVP |
| `crm_leads`, `crm_activities` | 017 | MVP |
| `notifications`, `messages` | 023, 024, 036 | MVP |

---

## Step 9 — CopilotKit features by screen

| Screen | CopilotKit feature | Benefit |
|--------|-------------------|---------|
| 001 Home | `useCoAgent` + disabled render cards | Inline discovery without leaving chat |
| 009 Create | `renderAndWaitForResponse` publish | Safe publish gate |
| 013–014 Analytics | `useCoAgent` `hostOpsAgent` | Chat over KPIs |
| 004 Checkout | modal only (no agent) | Deterministic money path |
| 021 Approvals | HITL history + `respond` pattern | Audit trail |
| 028 Recommendations | `useCopilotReadable` user context | Personalized cards |
| 029–030 Venues | `useCoAgent` + map + generative compare | Venue product |
| 035 Hub | `conciergeAgent` + saved history | Standalone `/recommendations` |
| 037 Global | ⌘K + FAB + Copilot Tasks | Cross-surface AI |

---

## Step 10 — Mastra features by screen

| Screen | Agent | Workflow | Memory |
|--------|-------|----------|--------|
| 001 | `conciergeAgent` | `eventDiscoveryWorkflow` | `MdeState` |
| 003 | — | — | — |
| 009 | `hostEventAgent` | wizard tools | `EventDraftState` |
| 013–014 | `hostOpsAgent` | `salesInsightWorkflow` | `HostDashboardState` |
| 005 | `attendeeAgent` (MVP) | — | thread |
| 015–018 | `sponsorAgent` | `sponsorMatchWorkflow` | sponsor context |
| 026 | `hostOpsAgent` | `revenueForecastWorkflow` | date range |
| 028–035 | `conciergeAgent` | recommend engine | saves + history |
| 029–030 | `hostEventAgent` / concierge | venue search tools | `MdeState` |
| 032 | `hostOpsAgent` | health score workflow | `HostDashboardState` |
| 034 | — | retry webhooks workflow | ops logs |

---

## Step 11 — Additional screens (ranked, post-audit)

| Screen | Value | Priority | Status |
|--------|------:|----------|--------|
| 029–030 Venue browse/detail | 98 | P0 | ✅ wire |
| 013 Revenue dashboard | 95 | P0 | 🔴 code |
| 032 Event health | 90 | P1 | ✅ wire |
| 037 Global UX patterns | 90 | P1 | ✅ wire |
| 031 Host bookings | 88 | P1 | ✅ wire |
| 035 Recommendations hub | 86 | P1 | ✅ wire |
| 036 Attendee inbox | 85 | P1 | ✅ wire |
| 034 Exception center | 84 | P2 | ✅ wire |
| 033 Sponsor ROI | 75 | P2 | ✅ wire |
| 027 Campaign center | 70 | P3 | ✅ wire |

---

## Step 12 — Implementation order (post-audit)

```text
P0 code:  013–014 hostOpsAgent · SAN-730 · SAN-704 ai_runs
P0 wire:  029–030 venue explorer + detail (VEN-004–006)
P1:       031 bookings · 036 attendee inbox · 035 recommendations hub
P1:       032 event health · 037 global UX patterns
P2:       033 sponsor ROI · 034 exception center
Then:     003 Luma (EVP-032) · 015–018 sponsor build
```

**Principles:** Simplicity · speed · AI assistance · SAN-115 proof before scope creep.

---

## Legacy wire specs (still valid)

| Legacy file | Maps to |
|-------------|---------|
| [003-wire-event-discovery](./003-wire-event-discovery.md) | 001 |
| [003-wire-event-detail-page](./003-wire-event-detail-page.md) | 003 |
| [004-wire-host-event-wizard](./004-wire-host-event-wizard.md) | 009 |
| [015-wire-my-tickets-qr](./015-wire-my-tickets-qr.md) | 005 |
| [EVP-014-wire-host-events-list](./EVP-014-wire-host-events-list.md) | 008 |
