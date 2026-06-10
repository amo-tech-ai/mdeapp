# Rental Details
> Route: `/rentals/[id]`  
> User: Consumer  
> Phase: Core · P0

---

## Desktop Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  ← Rentals            Apto El Estadio · Laureles        🔔           │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  ← Rentals      │  [Photo grid: 1 large + 4 small]     │  ┌─────────────────┐  │
│  ─────────────  │                                      │  │ Contact Host    │  │
│  Property       │  Apto El Estadio · Furnished         │  │ $950 / month    │  │
│  2BR · 1BA      │  2BR · 1BA · 75m² · Floor 8         │  │ ─────────────── │  │
│  $950/mo        │  Laureles · Medellín                 │  │ Move-in Date    │  │
│  Laureles       │                                      │  │ [Jan 15 ▾]      │  │
│  ─────────────  │  ──── Highlights ────               │  │                 │  │
│  Amenities      │  ✓ 300Mbps fiber   ✓ Pet-friendly   │  │ [Schedule View] │  │
│  ✓ 300Mbps wifi │  ✓ Covered parking ✓ Gym & Pool     │  │                 │  │
│  ✓ Gym          │  ✓ Balcony        ✓ A/C             │  │ [Send Inquiry]  │  │
│  ✓ Pool         │                                      │  │                 │  │
│  ✓ Parking      │  ──── About ────                     │  │ ─────────────── │  │
│  ✓ A/C          │  Fully furnished 2-bedroom on 8th    │  │ ⚡ AI Match      │  │
│  ✓ Balcony      │  floor with mountain views. 300Mbps  │  │ 92% match       │  │
│  ─────────────  │  fiber. Walk to Parque El Estadio.  │  │ "Matches your   │  │
│  Host           │  Building has gym, pool, 24h         │  │ budget, beds,   │  │
│  [Avatar] Diego │  reception.                          │  │ and wifi req."  │  │
│   4.9 ⭐ · 48mo  │                                      │  └─────────────────┘  │
│  Response: <2h  │  ──── Location ────                  │                       │
│                 │  [Google Map — Laureles]              │  ┌─────────────────┐  │
│                 │  Walk: Parque 3min, Metro 8min        │  │ Nearby          │  │
│                 │                                       │  │ ─────────────── │  │
│                 │  ──── AI Chat ────                    │  │ ☕ Pergamino 5m │  │
│                 │  ┌──────────────────────────────┐   │  │ 🛒 Éxito 10min  │  │
│                 │  │ 💬 Ask about this property...│   │  │ 🚇 Metro 8min   │  │
│                 │  └──────────────────────────────┘   │  └─────────────────┘  │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Components
- `PhotoGrid` — 1 hero + 4 thumbnail grid
- `AmenityBadges` — icons for wifi speed, gym, pool, parking, A/C
- `LocationMap` — embedded Google Map with walk-time annotations
- `HostCard` — avatar, rating, tenure, response time
- `ContactPanel` — move-in date picker, Schedule Viewing, Send Inquiry CTA (right panel)
- `AIMatch` — score + reason from working memory (right panel)
- `NearbyPlaces` — cafe, grocery, metro distances (right panel)
- `PropertyChat` — agent answers questions ("Is parking included?", "Are pets allowed?")

---

## AI Features
- Agent reads property via `useCopilotReadable` — answers any question instantly
- Match score from working memory
- Nearby places auto-generated from Google Places API
- After scheduling viewing: "I'll remind you the day before and send directions"

---

## Viewing Scheduling Flow

```
┌──────────────────────────────────────────┐
│  📅 Schedule a Viewing                   │
│                                          │
│  Available slots (host confirmed):       │
│                                          │
│  ○ Tuesday Jan 7 · 3:00pm               │
│  ● Wednesday Jan 8 · 10:00am            │
│  ○ Thursday Jan 9 · 6:00pm              │
│                                          │
│  [Confirm Wednesday 10am]               │
└──────────────────────────────────────────┘
```
