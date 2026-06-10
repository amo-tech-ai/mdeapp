# Venue Details
> Route: `/venues/[id]`  
> User: Consumer + Event Host  
> Phase: Core · P1

---

## Desktop Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  ← Venues                 Casa Bali · Rooftop Venue      🔔          │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  ← Venues       │  [Photo gallery — hero + 5 thumbs]   │  ┌─────────────────┐  │
│  ─────────────  │                                      │  │  Book This Venue│  │
│  Venue Info     │  Casa Bali · Rooftop Event Space     │  │  ─────────────  │  │
│  Rooftop        │  El Poblado · Medellín               │  │  Date:          │  │
│  Cap: 50–300    │                                      │  │  [Fri Jan 10 ▾] │  │
│  $120/hr        │  ── Capacity ──                      │  │  Time:          │  │
│  ⭐ 4.8 · 24rev │  Min 50 guests / Max 300 guests       │  │  [9pm–1am ▾]    │  │
│  ─────────────  │  Setup included for 150+             │  │  Guests:        │  │
│  Amenities      │                                      │  │  [250 ▾]        │  │
│  ✓ Catering     │  ── Amenities ──                     │  │  ─────────────  │  │
│  ✓ Full Bar     │  ✓ Full catering kitchen             │  │  Est. cost:     │  │
│  ✓ AV System    │  ✓ Full bar service                  │  │  4hrs × $120    │  │
│  ✓ Stage        │  ✓ PA/AV system + screen             │  │  = $480         │  │
│  ✗ Parking      │  ✓ Dedicated stage + lighting        │  │                 │  │
│  ─────────────  │  ✗ On-site parking (street nearby)   │  │ [Request Booking│  │
│  Owner          │                                      │  │       ▶]        │  │
│  [Avatar] Diego │  ── Pricing ──                       │  │                 │  │
│  ⭐4.9 · 36 bkgs│  Mon–Thu: $95/hr                     │  │ ─────────────── │  │
│  Response < 1h  │  Fri–Sun: $120/hr                    │  │ ⚡ AI: "92%     │  │
│                 │  Min 3 hours. Deposit: 30%            │  │ match for your  │  │
│                 │                                      │  │ jazz event"     │  │
│                 │  ── AI Chat ──                        │  └─────────────────┘  │
│                 │  ┌──────────────────────────────┐   │                       │
│                 │  │ 💬 Ask about availability... │   │                       │
│                 │  └──────────────────────────────┘   │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Booking Request HITL

```
┌──────────────────────────────────────────┐
│  🏢 Confirm Booking Request              │
│                                          │
│  Venue:    Casa Bali Rooftop             │
│  Date:     Friday January 10             │
│  Time:     9pm – 1am (4 hours)           │
│  Guests:   250                           │
│  Est. fee: $480 + 30% deposit = $144     │
│                                          │
│  This sends a request to Diego.          │
│  You'll be charged deposit on approval.  │
│                                          │
│  [✅ Send Request]  [✕ Cancel]          │
└──────────────────────────────────────────┘
```

---

## AI Features
- Agent pre-fills booking request from event context (Roberto's event date, capacity)
- Answers availability questions: "Is July 4th available?" → checks against booking calendar
- Cost estimate calculated live as user adjusts date/time/guests
