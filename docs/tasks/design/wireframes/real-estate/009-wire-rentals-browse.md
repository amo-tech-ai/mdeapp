---
type: wireframe
id: WIRE-015
number: "015"
title: Rentals Browse (catalog)
persona: Camila
path: /rentals
priority: P1
build_status: Ready for REAL-011 (SAN-478)
screens:
  - ../../real-estate/009-scr-rentals-browse-page.md
screen_ids:
  - REAL-011
  - WIRE-015
skill:
  - mde-wireframe
phase: Phase 2+
---
# Wireframe: Rentals Browse (catalog)

**Source:** legacy `Apartments.tsx`, `ThreePanelLayout.tsx`, `Rentals.tsx`  
**Persona:** Camila · **Path:** `/rentals`, `/rentals/:id`  
**Layout:** Catalog 3-panel — **not** chat canvas (slide-in detail, not persistent map)

> Distinct from [02-rental-search.md](02-rental-search.md) (in-thread). User lands here from nav, marketing, or chat action "See all on map →".

## Desktop — list + slide-in detail

```text
┌────────────┬──────────────────────────────────────┬─────────────────────┐
│ LEFT 280px │ CENTER — results                     │ RIGHT 500px (slide) │
│ Site nav   │ Filters: [Laureles▼][2BR▼][≤2.5M▼]  │ ┌ Listing detail ─┐ │
│ · Chat     │ [Grid ▼] [Map split ▼]  Sort: rank   │ │ gallery         │ │
│ · Explore  │ ┌──────┐ ┌──────┐ ┌──────┐         │ │ #2 Laureles…    │ │
│ · Rentals* │ │ img  │ │ img  │ │ img  │         │ │ $2.3M/mo        │ │
│ · Events   │ │ $2.1M│ │ $2.3M│ │ $2.5M│         │ │ [Schedule view] │ │
│ · Trips    │ └──────┘ └──────┘ └──────┘         │ │ [Save] [Chat ↩] │ │
│            │ 24 results · page 1                  │ └─────────────────┘ │
└────────────┴──────────────────────────────────────┴─────────────────────┘
```

## Map split mode (center)

```text
┌ CENTER ─────────────────────────────────────────┐
│ ┌─ list 50% ─────────┐ ┌─ map 50% ─────────────┐ │
│ │ cards scroll       │ │ pins + cluster       │ │
│ │ hover → highlight  │ │ click → open detail  │ │
│ └────────────────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Chat deep-link

`/rentals?q={"neighborhood":"Laureles","beds":2,"maxPrice":2500000}` — pre-fills filters from `useCopilotAction` "open rental results".

## Not-a-Fit table (legacy transparency)

When AI shortlists in chat, rejected listings show in-thread:

```text
┌─ Not a good fit ─────────────────────────────────────┐
│ Listing          │ Reason                           │
│ Charlee Hotel    │ Over budget ($180/n)             │
│ Hostel XYZ       │ Shared room — you asked private  │
└──────────────────────────────────────────────────────┘
```

On catalog page: optional "Why not shown" expand on zero-result state.

## Components

| Component | Legacy | Tables |
|-----------|--------|--------|
| ThreePanelLayout | `explore/ThreePanelLayout` | — |
| Filter bar | `apartments/*` | `apartments`, `neighborhoods` |
| Listing card | apartment cards | `apartments` |
| Detail panel | `ApartmentDetail` | `leads` on CTA |

## Mobile

Full-width list → tap card → full-screen detail sheet. **BackToChatBar** if arrived from chat.

## States

| State | UI |
|-------|-----|
| Loading | Skeleton grid |
| Results | Grid + optional map |
| Empty | "Adjust filters" + link to chat |
| Error | Retry + support |
