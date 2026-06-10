# Nightclub Discovery + VIP Booking
> Routes: `/nightlife` · `/nightlife/[id]/vip`  
> User: Consumer  
> Phase: MVP · P2

---

## Page Goal
Discover nightlife by music genre, crowd vibe, and event night — not by star ratings. VIP table booking happens in chat with HITL confirmation.

---

## Desktop Wireframe — Discovery

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Nightlife · Friday Night                               🔔           │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  🌙 Nightlife ← │  AI: "3 places open tonight with     │  ┌─────────────────┐  │
│  ─────────────  │  reggaeton + salsa. Sorted by crowd." │  │  🗺️ Party Zone  │  │
│  Music Genre    │                                      │  │                 │  │
│  ● Reggaeton    │  ┌─────────────────────────────┐    │  │  [●] Vintrash   │  │
│  ○ Salsa        │  │ 🌙 Vintrash                 │    │  │  [●] Theatron   │  │
│  ○ Electronic   │  │ El Centro · Reggaeton+Electro│    │  │  [●] La Octava  │  │
│  ○ Hip Hop      │  │ Open 10pm–4am · $15 cover   │    │  │                 │  │
│  ─────────────  │  │ VIP tables available         │    │  └─────────────────┘  │
│  Tonight Only   │  │ ⭐ Busy tonight — 3 friends  │    │                       │
│  ● Open now     │  │ are going                    │    │  ┌─────────────────┐  │
│  ─────────────  │  │ [Guestlist] [VIP Table]     │    │  │  Tonight's Picks│  │
│  Cover Range    │  └─────────────────────────────┘    │  │  ─────────────  │  │
│  [$0–$30]       │                                      │  │  🔥 Vintrash    │  │
│  ─────────────  │  ┌─────────────────────────────┐    │  │  Busy + trending│  │
│  Dress Code     │  │ 🌙 Theatron                 │    │  │                 │  │
│  ○ Smart casual │  │ El Centro · Mixed genres     │    │  │  📍 La Octava   │  │
│  ○ Formal       │  │ Open 9pm–5am · Free          │    │  │  Salsa night    │  │
│  ● Any          │  │ LGBT+ · No VIP               │    │  └─────────────────┘  │
│                 │  │ [Guestlist] [Get Directions] │    │                       │
│                 │  └─────────────────────────────┘    │                       │
│                 │  ┌──────────────────────────────┐   │                       │
│                 │  │ 💬 What are you into tonight?│   │                       │
│                 │  └──────────────────────────────┘   │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

## VIP Table Booking Flow (HITL)

```
┌──────────────────────────────────────────┐
│  🌙 Book VIP Table — Vintrash            │
│                                          │
│  Table: VIP Booth (4 seats) · $200 min  │
│  Date:  Tonight, Friday Jan 10           │
│  Time:  11pm arrival                     │
│  Party: 4 people                         │
│                                          │
│  Bottle service minimum: $200            │
│  Deposit (50%): $100 now                │
│                                          │
│  [✅ Book VIP — Pay $100] [✕ Cancel]   │
└──────────────────────────────────────────┘
```

---

## AI Features
- "3 of your friends are going to Vintrash tonight" — social signal from platform data
- Guestlist add: "You're on Vintrash's guestlist — show this to the door"
- Agent remembers music preferences: "You've been to 3 reggaeton events this month"
