# 01 — Marketing: Homepage & AI Concierge Landing

Shared design system + components → [00-foundations.md](00-foundations.md). Per-page below: goals, ASCII (desktop + mobile), sections, CTAs, states, retention/monetization.

---

## #1 Homepage  ·  path `/`  ·  persona: all (entry), primary Camila + Tourist

**Goals:** in one screen, say what mdeai is, prove it knows Medellín, and drop the user into the concierge with zero friction. The search bar **is** the product. No form walls, no account-first.

### Desktop

```text
┌──────────────────────────────────────────────────────────────────┐
│ mdeai   Rentals  Restaurants  Nightlife  Events   Saved  [Host] ◑ │ sticky TopNav
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│     Ask anything about Medellín.                                   │ H1 (display)
│     Get answers on the map.                                        │
│                                                                    │
│   ┌──────────────────────────────────────────────┐  [ ➤ ]         │ ConciergeInput
│   │ Find a furnished rental in Laureles under $1.5M │               │  (autofocus)
│   └──────────────────────────────────────────────┘               │
│   [Rentals in Laureles] [What's on this weekend?]                  │ Chips (cold-start)
│   [Best cafés to work from] [Provenza nightlife tonight]           │
│                                                                    │
│   ┌──────────── live mini-map · 5 real pins ────────────┐          │ MapCanvas teaser
│   │   ● $1.2M   ● café   ● event   ◉ rooftop            │          │ (read-only, taps→/chat)
│   │   ▣ from Google Maps                                │          │
│   └─────────────────────────────────────────────────────┘         │
├──────────────────────────────────────────────────────────────────┤
│  [ 🏠 Rentals ]   [ 🍽 Restaurants ]   [ 🌃 Nightlife ]  [ 🎟 Events ]│ verticals strip → L1
├──────────────────────────────────────────────────────────────────┤
│  ✔ Grounded in Google Maps   ✔ Verified listings   ✔ No scams      │ trust band
│  3.2k places · 180 verified rentals · updated daily                │ (real counts)
├──────────────────────────────────────────────────────────────────┤
│  Hosting an event?  Publish in 30 seconds with AI →  [ Get started ]│ Roberto CTA band
├──────────────────────────────────────────────────────────────────┤
│  How it works:   1 Ask    2 See it on the map    3 Save or Book    │ 3-step
├──────────────────────────────────────────────────────────────────┤
│  Footer · About · Verticals · For hosts · Partners · WhatsApp · ⚖  │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile

```text
┌───────────────────────┐
│ mdeai            ☰  ◑ │
├───────────────────────┤
│ Ask anything about     │
│ Medellín.              │
│ ┌───────────────────┐ │
│ │ Find a rental…  🎤│ │ ConciergeInput (full-width)
│ └───────────────────┘ │
│ [Laureles] [Weekend]   │ chips (h-scroll)
│ [Cafés] [Nightlife]    │
│ ┌─── mini-map ───────┐ │
│ │  ● ● ◉            │ │
│ └────────────────────┘ │
│ [Rentals][Food]        │ verticals (2x2)
│ [Night][Events]        │
│ ✔ Grounded · No scams  │ trust
│ Host an event → [Go]   │
├───────────────────────┤
│ Chat  Explore Saved Me │ bottom tab
└───────────────────────┘
```

| Section | Detail |
|---|---|
| Hero | H1 + `ConciergeInput` (autofocus desktop) + 4 chips. Submitting → `/chat?q=…` |
| Mini-map | Real pins, read-only; tap → `/chat` with that vertical |
| Verticals strip | 4 entries → discovery pages |
| Trust band | Grounding + verified + live counts (pulls real numbers) |
| Host band | Single Roberto conversion → `/host/event/new` |
| How it works | Ask → Map → Save/Book |

**CTA placement:** primary = the input (above fold). Secondary = vertical cards + Host band. **Monetization:** Host band (supply acquisition) + downstream tickets/leads. **Retention:** Save ♡ visible from first results; "updated daily" freshness signal. **Sticky:** TopNav; mobile bottom tab.

### States
| View | Default | Loading | Empty | Error |
|---|---|---|---|---|
| Mini-map | 5 pins | skeleton map + spinner | "Explore the map →" | hide map, keep hero |
| Counts | live numbers | "—" placeholder | hide line | hide line |

---

## #2 AI Concierge landing page  ·  path `/concierge` (or `/` variant)  ·  persona: all

**Goals:** explain the concierge capability deeper for visitors who want proof before chatting (SEO + conversion); show example conversations, the map+card payoff, and the WhatsApp future. Converts to `/chat`.

### Desktop

```text
┌──────────────────────────────────────────────────────────────────┐
│ TopNav                                                             │
├──────────────────────────────────────────────────────────────────┤
│  Your Medellín concierge.                  ┌── example chat ──────┐│ split hero
│  One chat for rentals, food,               │ you: rooftop bar +   ││ (left copy,
│  nightlife & events — grounded             │      late dinner     ││  right live
│  in real places, shown on a map.           │ mde: ⠿ 3 picks… ▢▢▢  ││  demo thread)
│  [ Start chatting → ]                       │      ▣ Google Maps   ││
│  [ Chat on WhatsApp (soon) ]               └──────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  What you can ask:                                                 │ capability grid
│  ┌Rentals──┐ ┌Restaurants┐ ┌Nightlife─┐ ┌Events──┐ ┌Neighborhoods┐│ (5 tiles, each w/
│  │"furnished│ │"best arepas│ │"Provenza │ │"salsa  │ │"Laureles vs │ │  example prompt)
│  │ Laureles"│ │ near me"   │ │ tonight" │ │ Fri"   │ │ Poblado?"   ││
│  └──────────┘ └────────────┘ └──────────┘ └────────┘ └─────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  See it on the map, not a list of links.   [▢ map+cards mockup]    │ map payoff
│  (vs GuideGeek: "open Google Maps yourself")                        │ differentiator
├──────────────────────────────────────────────────────────────────┤
│  Grounded & honest:  ✔ real prices  ✔ verified  ✔ sourced          │ trust deep-dive
│  "We show $1,320 total — not a teaser that balloons at checkout."  │
├──────────────────────────────────────────────────────────────────┤
│  [ Start chatting → ]    Footer                                     │ repeat CTA
└──────────────────────────────────────────────────────────────────┘
```

### Mobile: stack — hero copy → [Start chatting] → looping demo thread → capability tiles (1-col) → map payoff image → trust → CTA.

| Section | Detail |
|---|---|
| Split hero | Left value prop + dual CTA (web now, WhatsApp "soon"); right = autoplaying scripted demo thread (cards + grounding) |
| Capability grid | 5 tiles, each a real prompt → tapping seeds `/chat` |
| Map payoff | The anti-GuideGeek visual: cards synced to pins |
| Trust deep-dive | Total-price honesty + grounding + verified |

**CTA:** "Start chatting" (×2) → `/chat`. **Monetization:** funnels to transactional verticals. **Retention:** WhatsApp opt-in capture (Phase 2 waitlist). **Empty/Loading:** demo thread is canned (no live dependency); if `/chat` link target down → show waitlist form.

### Copy/avoid notes
- **Copy GuideGeek:** "text like a friend", multilingual-ready framing, persona warmth.
- **Avoid GuideGeek:** don't promise booking you can't complete in-surface; don't show mapless results.
- **Copy Airbnb:** trust language + total-price honesty front-and-center.
