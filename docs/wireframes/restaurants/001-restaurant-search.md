# Restaurant Search + Reservation
> Routes: `/restaurants` · `/restaurants/[id]/reserve`  
> User: Consumer  
> Phase: MVP · P1

---

## Page Goal
Conversational restaurant discovery that understands vibe, occasion, dietary needs, and noise preference — not just cuisine + stars. Reservation happens in chat without leaving the page.

---

## Desktop Wireframe — Search

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Restaurants                                             🔔           │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  🍽️ Restaurants ←  AI: "3 romantic restaurants near    │  ┌─────────────────┐  │
│  ─────────────  │  Provenza. Quiet + outdoor seating." │  │  🗺️ El Poblado  │  │
│  Cuisine        │                                      │  │                 │  │
│  • Colombian    │  ┌─────────────────────────────┐    │  │  [●] Oci.Mde    │  │
│  • Italian      │  │ 🍽️ Oci.Mde · Provenza        │    │  │  [●] El Cielo  │  │
│  • Mexican      │  │ Modern Colombian · Outdoor   │    │  │  [●] Carmen    │  │
│  • Japanese     │  │ $$$  · ⭐ 4.9 · Quiet         │    │  │                 │  │
│  • International│  │ Res. available tonight       │    │  └─────────────────┘  │
│  ─────────────  │  │ AI: "Top romantic pick"       │    │                       │
│  Vibe           │  │ [View] [Reserve Table]       │    │  ┌─────────────────┐  │
│  • Romantic     │  └─────────────────────────────┘    │  │  Reservation    │  │
│  • Business     │                                      │  │  Tonight 8pm    │  │
│  • Casual       │  ┌─────────────────────────────┐    │  │  Party of: [2▾] │  │
│  • Festive      │  │ 🍽️ El Cielo Medellín         │    │  │  ─────────────  │  │
│  ─────────────  │  │ Haute Colombian · Indoor     │    │  │  Oci.Mde  ✓ avail│  │
│  Noise Level    │  │ $$$$  · ⭐ 4.8 · Moderate    │    │  │  El Cielo ✓ avail│  │
│  ● Quiet        │  │ AI: "Best tasting menu"      │    │  │  Carmen   ✗ full │  │
│  ○ Moderate     │  │ [View] [Reserve Table]       │    │  └─────────────────┘  │
│  ─────────────  │  └─────────────────────────────┘    │                       │
│  📌 Saved       │  ─────────────────────────────────   │                       │
│                 │  ┌──────────────────────────────┐   │                       │
│                 │  │ 💬 Describe the occasion [▶] │   │                       │
│                 │  └──────────────────────────────┘   │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

## Reservation Flow (in-chat HITL)

```
┌──────────────────────────────────────────┐
│  🍽️ Confirm Reservation                 │
│                                          │
│  Restaurant: Oci.Mde                     │
│  Date:   Friday January 10               │
│  Time:   8:00pm                          │
│  Party:  2 people                        │
│                                          │
│  Special requests:                       │
│  [Outdoor seating if possible________]  │
│                                          │
│  [✅ Confirm Reservation] [✕ Cancel]   │
└──────────────────────────────────────────┘
```

---

## Components
- `RestaurantCard` — photo, name, cuisine, vibe tags, noise level, price range, AI pick reason
- `ReservationPanel` — date/time/party size with live availability (right panel)
- `NoiseBadge` — quiet / moderate / lively indicator
- `VibeTags` — romantic, business, casual, festive
- `HITLReservationCard` — `renderAndWaitForResponse` before booking
- `AIMemory` — "Remembered: you prefer outdoor + quiet" shown as context badge

---

## AI Features
- Understands vibe: "romantic + not too loud + outdoor" without clicking filters
- Remembers seating preference from previous searches (working memory)
- Live availability check integrated into card display
- After booking: "Oci.Mde is 200m from Jazz Night — good dinner option before the show"
