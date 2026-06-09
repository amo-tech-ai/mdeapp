---
title: AI-Native Events — Task Index (AIE)
updated: 2026-06-08-linear-sync
canonical_plan: ../../plans/04-AI-native-system.md
linear_epic: https://linear.app/sanjiovani/issue/SAN-757
linear_sync: ./LINEAR-SYNC.md
wireframes: ../../wireframes/INDEX.md
shared_state: ../../wireframes/038-shared-state.md
parent_index: ../INDEX.md
id_scheme: AIE-{NNN}-{tier}-{slug}.md
task_count: 32
persona: Roberto (host ops) · Andrés (attendee) · Patricia (admin) · Camila (discovery)
---

# AI-Native Events — AIE Task Index

**Canonical architecture:** [`04-AI-native-system.md`](../../plans/04-AI-native-system.md)  
**Wireframes:** 37 screens · [`../../wireframes/INDEX.md`](../../wireframes/INDEX.md)  
**Scope firewall:** Core = events + venues + ticketing + analytics chat. No `bookingAgent` / multi-vertical until SAN-115 green.

> **Rule:** One new agent per **proven** loop. `hostOpsAgent` before `attendeeAgent` before `sponsorAgent`.

---

## Implementation order (strict)

```text
CORE (001→012):  proof → nav → schema → ai_runs → hostOps stack → venues
MVP (013→026):   forecast → attendee → recs → sponsors → CRM → comms → Luma → admin
ADVANCED (027→032): bookingAgent → marketing split → ROI → exceptions → campaigns → WhatsApp
```

**NOW:** AIE-001 → AIE-008 (proof + hostOps analytics)  
**NEXT:** AIE-011–012 venues · AIE-013–019 MVP commerce intelligence  
**LATER:** AIE-027+ (gated on revenue + ledger)

---

## Core — ship first (001–012)

| Order | Task | Linear | Wire | Status |
|------:|------|--------|------|--------|
| — | **Epic** | [SAN-757](https://linear.app/sanjiovani/issue/SAN-757) | — | 🟢 Synced |
| 1 | [AIE-001](./Core/AIE-001-core-production-proof-gates.md) | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | — | 🟥 Blocked |
| 2 | [AIE-002](./Core/AIE-002-core-host-nav-enable.md) | [SAN-730](https://linear.app/sanjiovani/issue/SAN-730) | 008 | 🟡 Todo |
| 3 | [AIE-003](./Core/AIE-003-core-observability-schema.md) | [SAN-758](https://linear.app/sanjiovani/issue/SAN-758) | 038 | ⚪ Not Started |
| 4 | [AIE-004](./Core/AIE-004-core-ai-runs-prod-writes.md) | [SAN-704](https://linear.app/sanjiovani/issue/SAN-704) | — | 🟡 Todo |
| 5 | [AIE-005](./Core/AIE-005-core-hostops-agent-state.md) | [SAN-760](https://linear.app/sanjiovani/issue/SAN-760) | 038 | 🔴 P0 |
| 6 | [AIE-006](./Core/AIE-006-core-hostops-read-tools.md) | [SAN-762](https://linear.app/sanjiovani/issue/SAN-762) | 013 | 🔴 P0 |
| 7 | [AIE-007](./Core/AIE-007-core-sales-insight-workflow.md) | [SAN-759](https://linear.app/sanjiovani/issue/SAN-759) | 013 | 🔴 P0 |
| 8 | [AIE-008](./Core/AIE-008-core-host-analytics-page.md) | [SAN-729](https://linear.app/sanjiovani/issue/SAN-729) | 013–014 | 🔴 P0 |
| 9 | [AIE-009](./Core/AIE-009-core-generative-kpi-cards.md) | [SAN-761](https://linear.app/sanjiovani/issue/SAN-761) | 013 | 🔴 P0 |
| 10 | [AIE-010](./Core/AIE-010-core-event-analytics-funnel.md) | [SAN-763](https://linear.app/sanjiovani/issue/SAN-763) | 014 | ⚪ Not Started |
| 11 | [AIE-011](./Core/AIE-011-core-venue-explorer.md) | [SAN-765](https://linear.app/sanjiovani/issue/SAN-765) | 029 | 🔴 P0 |
| 12 | [AIE-012](./Core/AIE-012-core-venue-details.md) | [SAN-764](https://linear.app/sanjiovani/issue/SAN-764) | 030 | 🔴 P0 |

**Core exit gate:** Roberto asks *"how are sales?"* on `/host/analytics` → grounded KPI answer + chart card. Venues browseable at `/venues`.

---

## MVP — after Core loop proven (013–026)

| Order | Task | Linear | Wire | Status |
|------:|------|--------|------|--------|
| 13 | [AIE-013](./MVP/AIE-013-mvp-revenue-forecast-workflow.md) | [SAN-766](https://linear.app/sanjiovani/issue/SAN-766) | 026 | ⚪ Not Started |
| 14 | [AIE-014](./MVP/AIE-014-mvp-attendee-agent.md) | [SAN-767](https://linear.app/sanjiovani/issue/SAN-767) | 005 | ⚪ Not Started |
| 15 | [AIE-015](./MVP/AIE-015-mvp-recommendations-hub.md) | [SAN-769](https://linear.app/sanjiovani/issue/SAN-769) | 035 | ⚪ Not Started |
| 16 | [AIE-016](./MVP/AIE-016-mvp-sponsor-match-workflow.md) | [SAN-770](https://linear.app/sanjiovani/issue/SAN-770) | 016 | ⚪ Not Started |
| 17 | [AIE-017](./MVP/AIE-017-mvp-sponsor-pipeline-screens.md) | [SAN-768](https://linear.app/sanjiovani/issue/SAN-768) | 015–018 | ⚪ Not Started |
| 18 | [AIE-018](./MVP/AIE-018-mvp-crm-lead-score-workflow.md) | [SAN-771](https://linear.app/sanjiovani/issue/SAN-771) | 017 | ⚪ Not Started |
| 19 | [AIE-019](./MVP/AIE-019-mvp-approval-notifications-inbox.md) | [SAN-772](https://linear.app/sanjiovani/issue/SAN-772) | 021,023–024 | ⚪ Not Started |
| 20 | [AIE-020](./MVP/AIE-020-mvp-host-bookings.md) | [SAN-773](https://linear.app/sanjiovani/issue/SAN-773) | 031 | ⚪ Not Started |
| 21 | [AIE-021](./MVP/AIE-021-mvp-event-health-dashboard.md) | [SAN-774](https://linear.app/sanjiovani/issue/SAN-774) | 032 | ⚪ Not Started |
| 22 | [AIE-022](./MVP/AIE-022-mvp-global-ux-patterns.md) | [SAN-775](https://linear.app/sanjiovani/issue/SAN-775) | 037 | ⚪ Not Started |
| 23 | [AIE-023](./MVP/AIE-023-mvp-attendee-inbox.md) | [SAN-777](https://linear.app/sanjiovani/issue/SAN-777) | 036 | ⚪ Not Started |
| 24 | [AIE-024](./MVP/AIE-024-mvp-luma-event-detail.md) | [SAN-135](https://linear.app/sanjiovani/issue/SAN-135) | 003 | 🟡 In Review |
| 25 | [AIE-025](./MVP/AIE-025-mvp-admin-dashboard-moderation.md) | [SAN-778](https://linear.app/sanjiovani/issue/SAN-778) | 019–020 | ⚪ Not Started |
| 26 | [AIE-026](./MVP/AIE-026-mvp-admin-ai-runs-observability.md) | [SAN-779](https://linear.app/sanjiovani/issue/SAN-779) | 022 | ⚪ Not Started |

**MVP exit gate:** Sponsor fit scores live · CRM pipeline · attendee assistant on wallet · Luma detail shipped.

---

## Advanced — gated (027–032)

| Order | Task | Linear | Wire | Status |
|------:|------|--------|------|--------|
| 27 | [AIE-027](./Advanced/AIE-027-advanced-booking-agent.md) | [SAN-781](https://linear.app/sanjiovani/issue/SAN-781) | — | ⚪ FROZEN |
| 28 | [AIE-028](./Advanced/AIE-028-advanced-marketing-agents-split.md) | [SAN-782](https://linear.app/sanjiovani/issue/SAN-782) | 027 | ⚪ FROZEN |
| 29 | [AIE-029](./Advanced/AIE-029-advanced-sponsor-roi.md) | [SAN-783](https://linear.app/sanjiovani/issue/SAN-783) | 033 | ⚪ FROZEN |
| 30 | [AIE-030](./Advanced/AIE-030-advanced-exception-center.md) | [SAN-784](https://linear.app/sanjiovani/issue/SAN-784) | 034 | ⚪ FROZEN |
| 31 | [AIE-031](./Advanced/AIE-031-advanced-campaign-center.md) | [SAN-785](https://linear.app/sanjiovani/issue/SAN-785) | 027 | ⚪ FROZEN |
| 32 | [AIE-032](./Advanced/AIE-032-advanced-whatsapp-reminders.md) | [SAN-786](https://linear.app/sanjiovani/issue/SAN-786) | — | ⚪ FROZEN |

**Advanced gate:** Core + MVP signed · revenue tracked · no agent cap breach (max 12).

---

## Cross-links to EVP backlog

| AIE task | Related EVP | Notes |
|----------|-------------|-------|
| AIE-001 | EVP-001, G3 | Same SAN-115 ledger |
| AIE-002 | EVP-014 | Host nav polish |
| AIE-011–012 | EVP-016, VEN-* | Venue specs in `specs/venue-booking/` |
| AIE-015 | EVP-042 | Smart recommendations |
| AIE-024 | EVP-032 | Luma detail layout |
| AIE-017 | EVP-029 | Sponsor CRM-lite |

---

## Agent cap tracker

| Phase | Max agents | On disk today | After pack |
|-------|----------:|---------------|------------|
| Core | 5 | 4 (+ router) | +`hostOpsAgent` |
| MVP | 8 | — | +`attendeeAgent`, `sponsorAgent`, `adminOpsAgent` |
| Advanced | 12 | — | +`bookingAgent`, `campaignAgent`, `contentAgent`, `socialAgent` |

**Never add:** `eventPlannerAgent`, `ticketingAgent`, `analyticsAgent`, `revenueAgent`, `marketingAgent` (monolith).

---

## Progress summary

| Tier | Tasks | Linear | Shipped | P0 open |
|------|------:|--------|--------:|--------:|
| Epic | 1 | SAN-757 | — | — |
| Core | 12 | SAN-115…765 | 0 | 7 |
| MVP | 14 | SAN-766…779 + 135 | 0 | 0 |
| Advanced | 6 | SAN-781…786 | 0 | 0 |
| **Total** | **33** | **✅ synced** | **0** | **7** |

**North star:** Discover → Create → Publish → Sell → Attend → **Analyze** → Forecast

---

## Lifecycle

Each AIE task follows [`mde-task-lifecycle`](../../../../.claude/skills/mde-task-lifecycle/SKILL.md): Plan → Research → Implement → Test → Ship.  
**No Done** without: `npm run floor` on touched paths · Browser/Playwright evidence · prompt `status: Done` · ledger row.
