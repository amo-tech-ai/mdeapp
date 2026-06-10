---
title: Wireframe Audit Response
date: 2026-06-08
audits: [external audit #1, external audit #2]
overall_score: 96/100
---

# Wireframe Audit Response

**Verdict:** Audits are **mostly correct** on gaps and principles; **partially stale** on screen inventory (wrong IDs, several screens already exist).

---

## Score validation

| Audit claim | Our assessment |
|-------------|----------------|
| 94/100 (audit #1) | ✅ Fair — venue + booking product gap holds |
| 95/100 (audit #2) | ✅ Fair after sponsor/admin screens added |
| Checkout deterministic | ✅ Correct — matches [004](./events/004-checkout.md) |
| Create event best screen | ✅ Correct — [009](./events/009-create-event.md) |
| Avoid agents in Core | ✅ Aligns with [04-AI-native-system](../plans/04-AI-native-system.md) |

---

## Audit errors (inventory numbering)

Audit #1 used **011–015** for different screens than our pack:

| Audit said missing | Actual status |
|--------------------|---------------|
| 013 Host Analytics | ✅ Exists: [013-revenue-dashboard](./events/013-revenue-dashboard.md), [014-event-analytics](./events/014-event-analytics.md) |
| 014 Attendee Inbox | 🟡 Partial: [024-inbox](./events/024-inbox.md) = **host**; added [036-attendee-inbox](./events/036-attendee-inbox.md) |
| 015 Notifications | ✅ Exists: [023-notifications](./events/023-notifications.md) |
| Sponsor Dashboard | ✅ Exists: [015–018](./events/015-sponsor-dashboard.md) |
| CRM Pipeline | ✅ Exists: [017-sponsorship-crm](./events/017-sponsorship-crm.md) |
| Approval Center | ✅ Exists: [021-approval-center](./events/021-approval-center.md) |
| AI Recommendations | 🟡 Partial: [028](./events/028-ai-recommendations.md) overlay; added [035](./events/035-recommendations-hub.md) route |

---

## Confirmed gaps (audit correct)

| Gap | Priority | Added |
|-----|----------|-------|
| Venue Explorer `/venues` | P0 Core | [029](./events/029-venue-explorer.md) |
| Venue Detail `/venues/[slug]` | P0 Core | [030](./events/030-venue-details.md) |
| Host bookings `/host/bookings` | P1 MVP | [031](./events/031-host-bookings.md) |
| Event health dashboard | P1 MVP | [032](./events/032-event-health.md) |
| Sponsor ROI | P2 | [033](./events/033-sponsor-roi.md) |
| Exception center | P1 | [034](./events/034-exception-center.md) |
| Standalone recommendations hub | P1 | [035](./events/035-recommendations-hub.md) |
| Attendee inbox `/inbox` | P1 | [036](./events/036-attendee-inbox.md) |
| Global UX patterns (⌘K, FAB, pills, tasks) | P1 | [037](./events/037-global-ux-patterns.md) |
| Shared state TypeScript docs | P1 | [038-shared-state.md](./038-shared-state.md) |
| Data schema appendix | P1 | [00-MASTER §data](./00-MASTER.md) |

**Note:** [025-venue-comparison](./events/025-venue-comparison.md) covers **wizard compare** — not public `/venues` browse.

---

## Data architecture (audit correct)

Future tables documented in [038-shared-state.md](./038-shared-state.md) + master:

`venues`, `venue_bookings`, `sponsors`, `sponsor_deals`, `sponsor_opportunities`, `sponsor_proposals`, `crm_leads`, `crm_activities`, `notifications`, `messages`, `approval_logs`, `workflow_runs`, `event_views`, `visitor_sessions`

Existing on disk: `ai_runs`, tool span RPCs, `events`, `ticket_tiers`, `orders`, `tickets`

---

## UX improvements accepted

| Suggestion | Implementation |
|------------|----------------|
| ⌘K command bar | [037-global-ux-patterns](./events/037-global-ux-patterns.md) |
| Floating AI FAB | [037](./events/037-global-ux-patterns.md) |
| Context pills above chat | [037](./events/037-global-ux-patterns.md) |
| Copilot Tasks panel | [037](./events/037-global-ux-patterns.md) |

---

## Updated implementation order (post-audit)

```text
P0: 013–014 hostOps analytics (code)
P0: 029–030 venue explorer + detail (wire → VEN specs)
P1: 031 host bookings · 021 approvals polish · 036 inbox
P1: 035 recommendations hub · 032 event health
P2: 033 sponsor ROI · 034 exception center
```

---

## Revised scorecard (post-fix)

| Area | Was | Now |
|------|----:|----:|
| Venue features | 🔴 | 🟡 (specced 029–030) |
| Analytics readiness | 80 | 92 (013–014 + event_views) |
| CRM/Sponsors readiness | 70 | 90 (015–018 + schema) |
| Operations readiness | 82 | 88 (034 exceptions) |
| **Overall** | 94–95 | **96/100** |
