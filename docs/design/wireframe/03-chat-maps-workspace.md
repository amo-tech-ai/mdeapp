# 03 — Chat · Maps+Cards · Trip Workspace

The heart of mdeai. Covers **#7 Conversational search**, **#14 Concierge chat interface**, **#8 Maps + cards experience**, **#9 AI itinerary/trip workspace**. Shared components in [00-foundations.md](00-foundations.md) §3–4, §6.

---

## #14 + #7 Concierge chat / Conversational search  ·  `/chat`  ·  persona: Camila + Tourist

**Goals:** one conversational surface that routes any Medellín intent (rental/food/nightlife/event/neighborhood) to grounded, map-placed cards and lets the user act (lead/ticket) without leaving. This is the MVP product shape (3-panel, MAP-007).

### Desktop — 3-panel

```text
┌──────────┬───────────────────────────────────┬────────────────────┐
│ LEFT     │ CENTER (conversation + cards)      │ RIGHT (map)        │
│ rail     │                                    │ [Map][Saved] tabs  │
│ ◌ New    │ you: cafés to work, Laureles       │                    │
│ ─ Threads│ mde ⠿ handing off to food agent…   │    ●② ●④           │
│  · Cafés │     ⠿ scanning 40 cafés…           │   ●①  ◉③           │ pins sync to
│  · Rental│  3 laptop-friendly spots:          │  (cluster 12)      │ cards (00 §4)
│ ─ Saved  │  ┌rec①┐ ┌rec②┐ ┌rec③┐              │                    │
│  · 12    │  ▣ from Google Maps · 2d ago       │  ▣ Google Maps     │
│ ─ Verticals  [Show cheaper][Compare ①③][Map] │                    │
│  Rentals │                                    │  [Search area]     │
│  Food    │  you: which is quietest?           │                    │
│  Night   │  mde: ② Café Vibe — "quiet, …"     │                    │
│  Events  │                                    │                    │
│ ─ Profile│  [ type a message…        🎤  ➤ ]  │                    │
└──────────┴───────────────────────────────────┴────────────────────┘
```

### Mobile

```text
┌───────────────────────┐   tap [Map ◍] → map full + BottomSheet of cards
│ ‹ mde   Cafés…    ◌ + │   thread switch via top sheet
├───────────────────────┤
│ you: cafés to work     │
│ mde ⠿ scanning…        │
│ ┌rec①┐ →h-scroll       │ inline card carousel
│ ▣ Google Maps          │
│ [Cheaper][Map][Compare]│ follow-up chips
│ …                      │
├───────────────────────┤
│ [ type…        🎤  ➤ ] │ docked input
│ Chat  Explore Saved Me │ bottom tab
└───────────────────────┘
```

| Region | Behavior |
|---|---|
| Left rail | New chat · thread history · Saved count · vertical shortcuts · profile. Collapsible to icons (desktop), top-sheet (mobile). |
| Center | Message stream (00 §3): user bubble → `ThinkingTrace` → streamed text → inline `ResultCard`s (compact) → `GroundingAttribution` → follow-up `Chips`. Multi-intent → multiple card groups. |
| Right | `MapCanvas` (default tab) / Saved tab. Pins ↔ cards. Mobile = bottom sheet. |
| Input | `ConciergeInput` docked; mic (Phase 2 voice); `/` slash for quick verticals. |

**Conversational search specifics (#7):** NL query → Mastra router classifies intent → workflow → grounded tool → cards+pins. Visible thinking covers latency. Suggested follow-ups (Show cheaper / Compare / On the map / Schedule viewing) reduce dead-ends. Refinements keep context ("which is quietest?" re-ranks existing set). Structured pills from discovery pages and NL chat feed the **same** query layer.

**Empty/onboarding:** no blank box — greeting + cold-start chips + (Post-MVP) "import your Google Maps saved pins". **Loading:** `ThinkingTrace`. **Error:** user-facing error text (UX-002), retry; grounded chips disabled if grounding down (UX-004). **Retention:** threads persist, Save ♡, new-chat resets thread+map (UX-006). **Monetization:** every results turn surfaces a transactional CTA (lead/ticket/reserve).

---

## #8 Maps + cards experience  ·  (right panel / mobile sheet)  ·  persona: Camila + Tourist

**Goals:** make space the comprehension layer — pins prove the AI's claims; cards and pins are one object.

```text
┌── RIGHT PANEL ───────────────────────────┐   INTERACTIONS
│ [Map][Saved]                              │   • hover card  → pin bounce
│                                           │   • tap pin     → card scrolls in + InfoWindow
│   ●$1.2M   ☕                              │   • cluster tap → zoom + expand
│  ●━━━●  (12)        ◉ selected            │   • select      → pin accent + lift, route hint
│        🍽   🎟                            │   • pan         → [Search this area]
│                                           │   • new query   → pins cross-fade in (augment)
│  InfoWindow ▸ ┌──────────────┐            │
│              │ ② Café Vibe    │           │   PIN LANGUAGE
│              │ ★4.6 · Open    │           │   rentals = price pill · food/night = glyph
│              │ [Add to trip]  │           │   events = 🎟 · selected = accent + scale1.15
│              └──────────────┘             │
│  ▣ from Google Maps                       │
└───────────────────────────────────────────┘
```

| Pattern | Rule |
|---|---|
| Bidirectional highlight | card ↔ pin (both directions) |
| InfoWindow | mini-card on pin tap; full open = detail page/sheet |
| Clustering | ≥~15 pins (MAP-009); count badge |
| Grounding | `▣ from Google Maps` always visible |
| Cost | photos/hours **on open only**; `X-Goog-FieldMask`; `mapId` present |
| Mobile | bottom sheet peek(handle+1 card)/half(map+cards)/full(list) |

**States:** default pins · loading neighborhood-overview + spinner · empty city overview w/ neighborhood labels (never blank) · error degrade to last-good pins. **Differentiator:** this entire screen is what GuideGeek lacks ("open Google Maps yourself").

---

## #9 AI itinerary / Trip workspace  ·  `/trip/:id`  ·  persona: Camila + Tourist  ·  **Post-MVP**

**Goals:** convert ephemeral chat into a persistent, editable plan — the #1 retention object (Mindtrip lesson). Saved items + day timeline + bookings + map in one place.

### Desktop — tabbed workspace

```text
┌──────────┬───────────────────────────────────┬────────────────────┐
│ LEFT     │ "Medellín — Jun 5–8" ✎             │ RIGHT map (all trip │
│ rail     │ [Itinerary][Ideas][Bookings][Chat] │  pins, numbered)    │
│          │ ── Itinerary ──                     │   ①②③ day routes   │
│          │ Fri  ┌① Café Vibe  9am  ✎ ✕┐        │                    │
│          │      └② Rooftop X  9pm    ┘        │                    │
│          │ Sat  ┌③ Rental viewing 11am┐       │                    │
│          │      └ + add from Ideas ┘          │                    │
│          │ [ ⠿ ask mde to optimize the day ]  │ ▣ Google Maps      │
└──────────┴───────────────────────────────────┴────────────────────┘
```

| Tab | Contents |
|---|---|
| Itinerary | day-by-day timeline blocks (place entities); drag to reorder; AI "optimize day" |
| Ideas | saved candidates not yet scheduled (the Save ♡ bucket) |
| Bookings | tickets (QR), viewing appointments, reservations |
| Chat | trip-scoped conversation (memory per trip, not one global) |

**Schema hint (TBD, align Supabase):** `trips → trip_days → trip_items` + `saved_places`. **Monetization:** bookings tab aggregates paid actions; "complete your trip" upsells. **Retention:** the core lever — people return to a saved plan; shareable (Advanced). **Mobile:** tabs become segmented control; map = sheet. **States:** empty "Start by saving places from chat" · loading skeleton timeline · error retry.

**Avoid:** Mindtrip's complexity creep — keep MVP-adjacent version to just **Saved (Ideas) + Bookings**; full itinerary/calendar is Advanced.
