# Venue Search
> Route: `/venues`  
> User: Consumer + Event Host  
> Phase: Core · P1

---

## Page Goal
Find venues by describing the event — not by clicking filters. Agent understands capacity, type, location, and required amenities from natural language and returns a ranked shortlist with map pins.

---

## Desktop Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Venues                                                  🔔           │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  🏢 Venues  ←  │  AI: "3 rooftop venues in El Poblado  │  ┌─────────────────┐  │
│  ─────────────  │  for 250 guests. Sorted by fit."     │  │  🗺️ El Poblado  │  │
│  Capacity       │                                      │  │                 │  │
│  ○ < 100        │  ┌─────────────────────────────┐    │  │  [●] Casa Bali  │  │
│  ● 100–300      │  │ 🏢 Casa Bali · Rooftop       │    │  │  [●] Sky Top    │  │
│  ○ 300–500      │  │ El Poblado · Cap 300         │    │  │  [●] 360 Events │  │
│  ○ 500+         │  │ $120/hr · ⭐ 4.8             │    │  │                 │  │
│  ─────────────  │  │ Catering ✓ · AV ✓ · Bar ✓   │    │  └─────────────────┘  │
│  Type           │  │ ⭐ AI pick: "Best catering"  │    │                       │
│  ● Rooftop      │  │ [View] [Shortlist] [Inquire] │    │  ┌─────────────────┐  │
│  ○ Indoor       │  └─────────────────────────────┘    │  │  Shortlist (0)  │  │
│  ○ Outdoor      │                                      │  │  ─────────────  │  │
│  ○ Hybrid       │  ┌─────────────────────────────┐    │  │  Add venues to  │  │
│  ─────────────  │  │ 🏢 Sky Top Terrace          │    │  │  compare them   │  │
│  Amenities      │  │ El Poblado · Cap 250         │    │  └─────────────────┘  │
│  ✓ Catering     │  │ $95/hr · ⭐ 4.6             │    │                       │
│  ✓ AV System    │  │ AV ✓ · Bar ✓ · Parking ✓    │    │                       │
│  ○ Parking      │  │ [View] [Shortlist] [Inquire] │    │                       │
│  ─────────────  │  └─────────────────────────────┘    │                       │
│   📌 Shortlist(0)│                                      │                       │
│                 │  ┌──────────────────────────────┐   │                       │
│                 │  │ 💬 Describe your event... [▶]│   │                       │
│                 │  └──────────────────────────────┘   │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Components
- `VenueCard` — photo, name, type, capacity, price/hr, amenity badges, AI pick reason
- `ShortlistButton` — adds to comparison shortlist (right panel)
- `ShortlistPanel` — up to 3 venues side-by-side comparison (right panel)
- `MapPanel` — venue pins with hover detail
- `InquireButton` — sends booking inquiry, starts `venueBookingWorkflow`

---

## AI Features
- Describes why each venue was ranked ("Best catering match for your event type")
- Shortlist comparison: agent scores venues against event requirements side-by-side
- HITL shortlist: "These are your top 3 venues — want me to send inquiries to all of them?"

---

## Venue Shortlist Comparison (Right Panel)

```
┌────────────────────────────────────────────────┐
│  Compare Shortlist                             │
│  ─────────────────────────────────────────    │
│              Casa Bali    Sky Top    360 Events │
│  Capacity    300          250        280       │
│  Price/hr    $120         $95        $110      │
│  Catering    ✓            ✗          ✓         │
│  AV System   ✓            ✓          ✓         │
│  Parking     ✗            ✓          ✓         │
│  Rating      ⭐4.8        ⭐4.6      ⭐4.7     │
│  AI Score    92           85         88        │
│                                                │
│  [Inquire All 3]    [Clear Shortlist]          │
└────────────────────────────────────────────────┘
```
