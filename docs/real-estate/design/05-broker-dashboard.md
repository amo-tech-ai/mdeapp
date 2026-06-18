---
type: page-plan
id: RE-DES-004
linear: SAN-1095
route: /host/rentals/dashboard
persona: Broker / property manager
phase: D
status: planning
design_kit: mdeai-design-system/project/ui_kits/partners/rentals-os/dashboard/RentalsDashboard.jsx
blocked_by: PTR-RENTALS-001..005, RE-DES-005
skill: mde-wireframe
---

# RE-DES-004 — Broker Dashboard data layer (rescoped — Option B)

> **⚠️ Rescoped 2026-06-16 (Concierge-first):** This page plan is **data contract only**. SAN-1095 owns SQL + `/host/rentals/dashboard` → `?mode=overview` redirect. **Layout owner = [SAN-1093 · RE-DES-002](https://linear.app/sanjiovani/issue/SAN-1093)** — do **not** ship a standalone KPI hero page from this doc or `RentalsDashboard.jsx`. See [`linear-restructure-2026-06-16.md`](../ai-native/linear-restructure-2026-06-16.md).

**Full-page wireframe (historical):** [`014-re-des-004-full-page.md`](../wireframes/014-re-des-004-full-page.md) · **Linear:** [SAN-1095 · RE-DES-004](https://linear.app/sanjiovani/issue/SAN-1095)

**Persona:** Broker · **Path:** `/host/rentals?mode=overview` (same shell as Concierge) · `/host/rentals/dashboard` redirects here  
**Hierarchy:** KPI/briefing **content** consumed by SAN-1093 center + left panels — not a separate layout.

## Goal (data layer)

Morning briefing text + KPI counts + needs-attention queue + trend inputs — every number from real SQL via `fetch-broker-dashboard.ts` or **`Data pending.`** UI rendering lives in SAN-1093 Phase B.

## Desktop wireframe (≥1360px) — **DEPRECATED layout**

The wireframe below describes the **old** standalone dashboard shell. **Do not implement.** Keep for KPI field reference only.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Host header (signed in) · standard left HostNavRail with Rentals section   │
├──────────┬──────────────────────────────────────────────┬────────────────┤
│ NAV      │ CENTER — business overview                   │ RIGHT 320px    │
│ 232px    │                                              │ AI analyst     │
│          │ ┌─ ✦ Daily briefing (dark card) ──────────┐  │                │
│ Events   │ │ Good morning. 3 items need you today.   │  │ Ask about your │
│ Rentals  │ │ · 2 listings need photos                │  │ business…      │
│ · Concierge│ │ · 3 leads waiting                     │  │                │
│ · Listings│ │ · 1 viewing to confirm                 │  │ Suggested Qs   │
│ · Dash*  │ └────────────────────────────────────────┘  │ · Why leads    │
│          │                                              │   dropped?     │
│          │ KPI row (4 cards, provenance footer each)    │                │
│          │ [Active listings][Leads 7d][Viewings][Resp]  │ Mini chat      │
│          │  3              5           2        pending │ thread         │
│          │                                              │                │
│          │ Needs attention (HITL queue rows + CTAs)     │                │
│          │                                              │                │
│          │ Performance trends · 30d (sparklines)        │                │
│          │ Occupancy | Leads | Conversion | Views       │                │
│          │ pending   | 18    | pending    | 262          │                │
└──────────┴──────────────────────────────────────────────┴────────────────┘
```

## Distinction from Concierge + Listings

| Surface | Primary question | Hero region |
|---------|------------------|-------------|
| Dashboard | "How is my business?" | Briefing + KPIs |
| Concierge | "Do this task for me" | Chat thread |
| Listings | "Which unit needs work?" | Inventory + drawer |

## Component inventory

| Component | Reuse | Planned path |
|-----------|-------|--------------|
| Nav | `HostNavRail` | extend Rentals links |
| KPI card | `HostKpiCard` + provenance footer | `rentals-kpi-panel.tsx` |
| Narrative | `HostNarrativeBanner` pattern | briefing block |
| Attention rows | host command center attention pattern | `rentals-attention-queue.tsx` |
| Trends | new sparkline cards | `rentals-trend-cards.tsx` |
| Analyst | slim CopilotChat or static Q&A | `rentals-ai-analyst-panel.tsx` |
| Shell | | `rentals-dashboard-shell.tsx` |

## States

| State | UI |
|-------|-----|
| Empty | "No business activity yet" + CTA add first listing |
| Loading | Skeleton briefing + 4 KPI skeletons |
| Result | Full layout with real/pending metrics |
| Error | "Failed to load your dashboard" + retry |

## `data-testid`

- `r1-briefing`, `r1-kpi-0..3`, `r1-attn-*`, `r1-trends`, `r1-assistant`
- `r1-asst-input`, `r1-asst-send`

## Metrics rules

| Metric | Source | If missing |
|--------|--------|------------|
| Active listings | `apartments` published count | 0 is valid |
| New leads 7d | `leads` filtered | 0 is valid |
| Viewings booked | `showings` upcoming | 0 is valid |
| Avg response time | computed from lead timestamps | **Data pending.** |
| Occupancy | needs lease data | **Data pending.** |
| Conversion | needs funnel volume | **Data pending.** |

No ROI, no invented occupancy %, no revenue rankings.

## Files to create

- `src/app/host/rentals/dashboard/page.tsx`
- `src/components/host/rentals/rentals-dashboard-shell.tsx`
- `src/components/host/rentals/rentals-kpi-panel.tsx`
- `src/components/host/rentals/rentals-ai-analyst-panel.tsx`

## Handoff

| Item | Value |
|------|-------|
| Confidence | High layout; Low-Medium data plumbing until analytics tables wired |
| Open questions | Share `hostOpsAgent` for analyst or read-only FAQ bot? |
| Verify | Empty state for new broker; no fake numbers in prod build |
| Kit | `RentalsDashboard.jsx` |
