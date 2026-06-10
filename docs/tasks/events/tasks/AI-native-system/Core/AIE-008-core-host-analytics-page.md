---
id: AIE-008-core
title: /host/analytics + HostOpsCopilotBridge
status: Not Started
priority: P0
phase: core
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-002, AIE-007]
blocks: [AIE-009, AIE-010]
depends_on: [AIE-005]
wireframe: ../../wireframes/events/013-revenue-dashboard.md, 014-event-analytics.md
spec: ../../../specs/pages/missing/PAGE-M02-host-analytics.md
---

# AIE-008-core — Host analytics page

## Objective

Ship `/host/analytics` — 3-panel layout with `hostOpsAgent` chat center and KPI/charts right column.

## Scope

- `src/app/host/analytics/page.tsx`
- `HostOpsCopilotBridge` — `useCoAgent({ name: "hostOpsAgent" })`
- Event selector · date range · host nav entry (AIE-002)
- No AI inside Stripe paths

## Acceptance criteria

- `npm run dev` → route 200
- Prompt *"revenue vs last week"* returns tool-backed answer
- Browser evidence screenshot in `tasks/testing/evidence/`
- sitemap.md updated to LIVE when shipped
