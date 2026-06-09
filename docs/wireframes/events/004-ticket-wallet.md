# Ticket Wallet
> Route: `/me/tickets`  
> User: Consumer  
> Phase: Core · P1

---

## Desktop Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  My Tickets                                              🔔           │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  🎟️ Tickets ← │  Upcoming (2)   Past (7)              │  ┌─────────────────┐  │
│  ─────────────  │  ─────────────────────────────────   │  │  Next Up         │  │
│  Upcoming       │                                      │  │  ─────────────  │  │
│  • Jazz Night   │  ┌─────────────────────────────┐    │  │  🎵 Jazz Night  │  │
│  • Salsa Social │  │  🎵 Jazz Night · Casa Bali   │    │  │  Fri Jan 10     │  │
│  ─────────────  │  │  Fri Jan 10 · 9pm            │    │  │  9pm · El Pobl. │  │
│  Past           │  │  2× GA  · Booking #JN-0089   │    │  │                 │  │
│  • 6 events     │  │                               │    │  │  Starts in:     │  │
│                 │  │  [QR CODE         ]           │    │  │  2 days 4 hrs   │  │
│                 │  │                               │    │  │                 │  │
│                 │  │  [Add to Wallet] [Share]      │    │  │  [Get directions│  │
│                 │  └─────────────────────────────┘    │  └─────────────────┘  │
│                 │                                      │                       │
│                 │  ┌─────────────────────────────┐    │  ┌─────────────────┐  │
│                 │  │  💃 Salsa Social · Laureles  │    │  │  ⚡ AI           │  │
│                 │  │  Sat Jan 11 · 8pm            │    │  │  "Jazz Night    │  │
│                 │  │  1× Free · Booking #SS-0112  │    │  │  ends at 1am.   │  │
│                 │  │                               │    │  │  Want me to     │  │
│                 │  │  [QR CODE         ]           │    │  │  find a late    │  │
│                 │  │  [Add to Wallet] [Share]      │    │  │  dinner nearby?"│  │
│                 │  └─────────────────────────────┘    │  └─────────────────┘  │
│                 │                                      │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Components
- `TicketCard` — event name, date/time, QR code, booking ID, add to Apple/Google Wallet
- `CountdownBadge` — "Starts in 2 days 4 hours"
- `DirectionsButton` — opens Google Maps with venue address
- `AIPostBooking` — agent cross-sells (late dinner, transport)
- `PastTickets` — collapsed list with "Leave Review" CTA

---

## AI Features
- Agent proactively surfaces transport options before event day
- Cross-sell: "Jazz Night ends at 1am — want me to find a late dinner nearby?"
- Review reminder: "You attended Salsa Social 3 days ago — leave a review?"
