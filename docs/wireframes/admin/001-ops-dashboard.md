# Admin Operations Dashboard
> Route: `/admin`  
> User: Admin (Patricia persona)  
> Phase: MVP · P1

---

## Page Goal
Replace the "everything is a table" ops dashboard with an AI exception surface. Patricia opens this and sees only what needs action — not 500 rows of data. She manages the platform from chat.

---

## Desktop Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Admin Operations                                        🔔  Patricia│
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  📊 Dashboard ← │  Good morning, Patricia 👋            │  ┌─────────────────┐  │
│  👥 CRM         │  Today's platform health:            │  │  Platform Health │  │
│  📅 Events      │  ─────────────────────────────────   │  │  ─────────────  │  │
│  🏠 Rentals     │                                      │  │  Events: 🟢 24  │  │
│  👤 Users       │  🔴 Payment failed — 2 transactions  │  │  Rentals: 🟢 47 │  │
│  ⚙️ Settings    │  Miguel Torres · $50 · Jazz Night    │  │  Bookings: 🟡 3 │  │
│  ─────────────  │  [View] [Retry] [Notify user]        │  │  Users: 🟢 1,204│  │
│  AI Summary     │                                      │  └─────────────────┘  │
│  "2 P0 items    │  🟡 Event capacity warning            │                       │
│  need attention"│  Jazz Night — 2 seats remaining      │  ┌─────────────────┐  │
│  "3 new hosts   │  [Notify waitlist] [Expand cap]      │  │  Revenue Today  │  │
│  need approval" │                                      │  │  $2,840         │  │
│                 │  🟡 New host approval needed (3)      │  │  ─────────────  │  │
│                 │  Carlos M · Diego R · Ana T          │  │  [Bar chart     │  │
│                 │  [Review All] [Approve All]           │  │   last 7 days]  │  │
│                 │                                      │  └─────────────────┘  │
│                 │  ─────────────────────────────────   │                       │
│                 │                                      │  ┌─────────────────┐  │
│                 │  Today's Activity                    │  │  Quick Actions  │  │
│                 │  ─────────────────────────────────   │  │  ─────────────  │  │
│                 │  ✅ 34 bookings confirmed             │  │  [Retry Payments│  │
│                 │  ✅ 8 new user registrations          │  │  [Approve Hosts │  │
│                 │  ✅ 3 events published                │  │  [Export Report │  │
│                 │                                      │  └─────────────────┘  │
│                 │  ┌──────────────────────────────┐   │                       │
│                 │  │ 💬 Ask about the platform [▶]│   │                       │
│                 │  └──────────────────────────────┘   │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Components
- `ExceptionWidget` — P0 items (payment failures, capacity overflows, auth anomalies) with action buttons
- `PlatformHealthGrid` — green/yellow/red traffic light per domain (right panel)
- `RevenueChart` — 7-day revenue bar chart (right panel)
- `QuickActions` — one-click common admin tasks (right panel)
- `ActivityFeed` — today's positive signals (bookings, registrations, publishes)
- `AdminChat` — `adminOpsAgent` + `analyticsAgent` via chat

---

## Data Sources
| Widget | Source |
|---|---|
| Payment failures | Stripe webhook events |
| Capacity warnings | Supabase `events` sold/capacity |
| New host approvals | Supabase `users` WHERE role=host AND approved=false |
| Revenue | Stripe payouts + Supabase bookings |
| Platform health | Supabase health queries |

---

## AI Features
- `adminOpsAgent` scans all domains hourly and surfaces only the top 5 exceptions
- "Retry Payments" action sends retry request to Stripe and notifies affected users
- Agent answers: "How many tickets sold today?" → live chart in chat
- "Why did revenue drop Thursday?" → agent queries data and explains trend
