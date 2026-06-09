# Analytics Dashboard — Chat with Data
> Route: `/admin/analytics`  
> User: Admin (Patricia) + Hosts  
> Phase: MVP · P2

---

## Desktop Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Analytics                                               🔔  Patricia│
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  Analytics ←   │  ┌──────────────────────────────┐   │  ┌─────────────────┐  │
│  ─────────────  │  │  Period: Jan 2026            │   │  │  KPI Summary    │  │
│  Domain         │  │  ← [This Week ▾] →           │   │  │  ─────────────  │  │
│  ● All          │  └──────────────────────────────┘   │  │  Revenue        │  │
│  ○ Events       │                                      │  │  $14,200  ↑18%  │  │
│  ○ Rentals      │  ┌──────────────────────────────┐   │  │                 │  │
│  ○ Venues       │  │  [Revenue bar chart · 7 days]│   │  │  Bookings       │  │
│  ─────────────  │  │  Mon  Tue  Wed  Thu  Fri  Sat│   │  │  234      ↑22%  │  │
│  Export         │  │  █    █    █    ██   ████  ██│   │  │                 │  │
│  [CSV Download] │  └──────────────────────────────┘   │  │  New users      │  │
│  [PDF Report]   │                                      │  │  48       ↑5%   │  │
│                 │  ── AI Q&A ──                        │  └─────────────────┘  │
│                 │                                      │                       │
│                 │  Patricia: "Why did revenue drop      │  ┌─────────────────┐  │
│                 │  on Wednesday?"                      │  │  Top Events     │  │
│                 │                                      │  │  ─────────────  │  │
│                 │  AI: "Wednesday revenue was $1,200    │  │  Jazz Night     │  │
│                 │  vs avg $2,100. 2 reasons:            │  │  $3,800 · 152tk │  │
│                 │  1. Jazz Night sold out early —       │  │                 │  │
│                 │  no new sales after 2pm.              │  │  Salsa Social   │  │
│                 │  2. 1 payment failure ($200) from     │  │  $0 · 120tk (F) │  │
│                 │  a declined card."                    │  └─────────────────┘  │
│                 │                                      │                       │
│                 │  ┌──────────────────────────────┐   │                       │
│                 │  │ [Ticket sales chart — inline] │   │                       │
│                 │  └──────────────────────────────┘   │                       │
│                 │                                      │                       │
│                 │  ┌──────────────────────────────┐   │                       │
│                 │  │ 💬 Ask about analytics...    │   │                       │
│                 │  └──────────────────────────────┘   │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## AI Chat with Data Examples

| Question | Agent Response |
|---|---|
| "How many tickets sold this week?" | Bar chart by event + total count |
| "Which event type performs best?" | Ranked list with avg revenue per type |
| "Why did revenue drop Wednesday?" | Root cause analysis + chart annotation |
| "Who are my top hosts by revenue?" | Ranked table with host names + totals |
| "What's the average ticket price?" | Calculation + comparison to last month |
| "Show me rental inquiry conversion rate" | Funnel: inquiries → viewings → signed |

---

## Components
- `PeriodSelector` — this week / this month / custom range
- `RevenueBarChart` — inline in chat (rendered via `useCopilotAction(render)`)
- `KPISummaryPanel` — revenue, bookings, new users with trend % (right panel)
- `TopEventsPanel` — ranked events by revenue (right panel)
- `AnalyticsChat` — `analyticsAgent` answers any data question; renders charts inline
- `ExportButtons` — CSV + PDF with date range filter

---

## `useCopilotReadable` Setup

```typescript
// Analytics page passes all KPI data to agent context
useCopilotReadable({
  description: "Current analytics dashboard state",
  value: {
    period: "Jan 6–12, 2026",
    revenue: { total: 14200, trend: 18 },
    bookings: { total: 234, trend: 22 },
    topEvents: [...],
    dailyRevenue: [...],
    paymentFailures: 2
  }
})
```

Agent can then answer any question about this data without additional API calls.
