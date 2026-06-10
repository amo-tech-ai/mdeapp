# Venue Owner Dashboard
> Route: `/host/venues`  
> User: Venue Owner  
> Phase: MVP · P1

---

## Desktop Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Venue Dashboard                                         🔔  Diego  │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  🏢 Venues ←   │  Good morning, Diego 👋               │  ┌─────────────────┐  │
│  ─────────────  │                                      │  │  This Month     │  │
│  My Venues      │  ── Booking Requests (2) ──          │  │  Bookings: 4    │  │
│  Casa Bali      │                                      │  │  Revenue: $1,920│  │
│  Sky Top        │  ┌─────────────────────────────┐    │  │  Occupancy: 62% │  │
│  ─────────────  │  │ 🎵 Jazz Night request        │    │  └─────────────────┘  │
│  Actions        │  │ Roberto M · Jan 10 · 250 cap │    │                       │
│  [+ Add Venue]  │  │ 4 hours · Est: $480          │    │  ┌─────────────────┐  │
│  ─────────────  │  │ Catering req: yes             │    │  │  Calendar       │  │
│  AI Summary     │  │ [Approve] [Counter] [Decline] │    │  │  Jan 2026       │  │
│  "2 bookings    │  └─────────────────────────────┘    │  │  [calendar grid]│  │
│  need response" │                                      │  │  10: Roberto ●  │  │
│  "62% occupancy │  ┌─────────────────────────────┐    │  │  15: Open       │  │
│  this month"    │  │ 💼 Corporate event request   │    │  │  20: Inquiry    │  │
│  "Raise price   │  │ Empresa X · Jan 18 · 100 cap │    │  └─────────────────┘  │
│  for weekends"  │  │ 6 hours · Est: $570          │    │                       │
│                 │  │ [Approve] [Counter] [Decline] │    │  ┌─────────────────┐  │
│                 │  └─────────────────────────────┘    │  │  ⚡ AI           │  │
│                 │                                      │  │  "Weekends are  │  │
│                 │  ── Confirmed Bookings ──            │  │  underpriced    │  │
│                 │  📅 Jan 5: Birthday · $360           │  │  vs comparable  │  │
│                 │  📅 Jan 8: Workshop · $285           │  │  venues.        │  │
│                 │  ┌──────────────────────────────┐   │  │  Suggest $140/hr│  │
│                 │  │ 💬 Ask about your venue  [▶] │   │  │  on weekends"   │  │
│                 │  └──────────────────────────────┘   │  └─────────────────┘  │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Booking Approval Flow (HITL)

```
┌──────────────────────────────────────────┐
│  🏢 Respond to Booking Request           │
│                                          │
│  Requester: Roberto M                    │
│  Event:     Jazz Night                   │
│  Date:      Friday Jan 10                │
│  Time:      9pm – 1am (4 hours)          │
│  Guests:    250                          │
│  Catering:  Required                     │
│  Est. fee:  $480 (4hrs × $120)           │
│                                          │
│  [✅ Approve]  [Counter-offer]  [Decline]│
└──────────────────────────────────────────┘
```

---

## AI Features
- Dynamic pricing suggestion: "Weekends are underpriced vs comparable venues"
- Calendar conflict detection: "Jan 10 already has an inquiry — confirm priority?"
- Occupancy analysis: "62% occupancy this month — industry average is 71%"
- Counter-offer template: agent drafts counter with adjusted price/hours
