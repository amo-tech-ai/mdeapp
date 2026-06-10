---
screen: Event List
screenshots: [Events-list-1.png]
route: /events
persona: Andrés
mdeai_status: live
linear: SCREEN-027
---

# Wireframe — Luma Event List

## Goals

Browse many events with date/category filters without AI chat.

## ASCII — mobile

```text
┌─────────────────────────────────────┐
│ [←] Events in Medellín    [Filter]  │
├─────────────────────────────────────┤
│ [This week ▼] [All categories ▼]    │
├─────────────────────────────────────┤
│ SAT May 31                          │
│ ┌──────┬──────────────────────────┐ │
│ │ img  │ Salsa Social             │ │
│ │      │ 8pm · Laureles · $15     │ │
│ └──────┴──────────────────────────┘ │
│ SUN Jun 1                           │
│ ┌──────┬──────────────────────────┐ │
│ │ img  │ Startup Breakfast        │ │
│ └──────┴──────────────────────────┘ │
└─────────────────────────────────────┘
```

## Component inventory

| Component | Type | Purpose |
|-----------|------|---------|
| DateGroupHeader | page | Chronological sections |
| EventBrowseCard | domain | Row with thumb |
| FilterSheet | composite | Weekend, category, hood |

## States

| State | Behavior |
|-------|----------|
| Default | Grouped list |
| Loading | Skeleton |
| Empty | Adjust filters CTA |
| Filtered | Chip row + count |

## mdeai mapping

**LIVE:** `mdeapp/src/app/events/page.tsx`, `EventBrowseView`.

**Delta:** Luma-style date grouping + horizontal featured row (optional polish).

## Wireframe prompt

Attach `Events-list-1.png` — compare to SCREEN-027 wireframe.
