---
screen: Host Guests
screenshots: [host guests tab — capture needed]
route: /host/events/[id]/guests (planned)
persona: Roberto
mdeai_status: not-built
phase: post-mvp
---

# Wireframe — Luma Host Guests (CRM-lite)

## Goals

Host sees who registered, tier, check-in status, export CSV.

## ASCII

```text
┌─────────────────────────────────────┐
│ Fashion Night · Guests              │
├─────────────────────────────────────┤
│ [Search guests] [Export CSV]        │
├─────────────────────────────────────┤
│ Name          Tier    Check-in      │
│ Ana Gómez     VIP     ✓             │
│ James Lee     GA      —             │
│ …                                   │
├─────────────────────────────────────┤
│ 42 total · 38 checked in            │
└─────────────────────────────────────┘
```

## Data

| Field | Source |
|-------|--------|
| Name, email | orders + profiles |
| Tier | ticket_tiers |
| Check-in | staff scan post-MVP |

## mdeai mapping

**Not built.** MVP: query Supabase from admin/host route. AI: `hostOpsAgent` answers “how many VIP?” without full table UI.

## Wireframe prompt

Capture Luma guests tab screenshot → table columns + mobile collapse pattern.
