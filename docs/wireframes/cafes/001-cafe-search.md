# Cafe Search
> Route: `/cafes`  
> User: Consumer (digital nomads primary)  
> Phase: MVP · P2

---

## Page Goal
Help digital nomads find the right cafe to work from — not by stars and photos but by wifi speed, noise level, hours, and outlet availability. Chat-first with map pins.

---

## Desktop Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Cafes                                                   🔔           │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  ☕ Cafes  ←   │  AI: "4 work-friendly cafes in        │  ┌─────────────────┐  │
│  ─────────────  │  El Poblado open past 9pm with        │  │  🗺️ El Poblado  │  │
│  Work Setup     │  fast wifi."                         │  │                 │  │
│  ✓ Wifi 100Mbps+│                                      │  │  [●] Pergamino  │  │
│  ✓ Outlets      │  ┌─────────────────────────────┐    │  │  [●] Amor Perfec│  │
│  ─────────────  │  │ ☕ Pergamino Café             │    │  │  [●] Velvet     │  │
│  Noise Level    │  │ El Poblado · Specialty Coffee │    │  │  [●] Azahar     │  │
│  ● Quiet        │  │ 200Mbps · Outlets ✓ · Quiet  │    │  │                 │  │
│  ○ Moderate     │  │ Open until 10pm              │    │  └─────────────────┘  │
│  ─────────────  │  │ ⭐ AI: "Best wifi in area"   │    │                       │
│  Hours          │  │ [View] [Save ♡]              │    │  ┌─────────────────┐  │
│  ● Open now     │  └─────────────────────────────┘    │  │  Work Filters   │  │
│  ● Open 9pm+    │                                      │  │  ─────────────  │  │
│  ─────────────  │  ┌─────────────────────────────┐    │  │  ✓ Wifi 100+    │  │
│  Neighborhood   │  │ ☕ Amor Perfecto              │    │  │  ✓ Open 9pm+    │  │
│  • El Poblado   │  │ Laureles · Specialty Coffee  │    │  │  ✓ Quiet        │  │
│  • Laureles     │  │ 150Mbps · Outlets ✓ · Quiet  │    │  │  ○ Outdoor      │  │
│  • Envigado     │  │ Open until 9pm               │    │  └─────────────────┘  │
│                 │  │ [View] [Save ♡]              │    │                       │
│                 │  └─────────────────────────────┘    │                       │
│                 │  ┌──────────────────────────────┐   │                       │
│                 │  │ 💬 Where do you need to work?│   │                       │
│                 │  └──────────────────────────────┘   │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Components
- `CafeCard` — photo, name, wifi speed badge, noise badge, hours, outlets indicator
- `WifiBadge` — color-coded: 🟢 200Mbps+ / 🟡 50–200Mbps / 🔴 <50Mbps
- `NoiseBadge` — quiet / moderate / busy
- `OpenNowBadge` — green "Open until Xpm" or red "Closed"
- `MapPanel` — cafe pins with color-coded wifi indicators

---

## AI Features
- Understands: "I need to do a 4-hour video call" → prioritizes quiet + strong wifi + outlets
- Remembers neighborhood + noise preference from past searches
- "Pergamino closes at 10pm — Velvet next door is open until midnight if you need more time"
