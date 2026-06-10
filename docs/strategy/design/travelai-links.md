---
title: mdeai — Design Inspiration Index (scored)
updated: 2026-06-04
purpose: categorized, scored reference of sites/apps to copy patterns from — by vertical + by craft
scoring: /100 = how much mdeai should learn from it (design + UX + relevance to a Medellín AI concierge), not how big the company is
related: ./README.md · ./pages/{cafes,restaurants,nightlife}.md · ./docs/design-plan.md
legend: 🔥 must-study · ✅ solid · ◻ niche/partial
---

# mdeai — Design Inspiration Index

**How to use this:** each row = one pattern worth stealing, not a site to admire. Score = relevance to mdeai's build (chat ↔ map ↔ browse concierge for Medellín). The "Steal this" column is the actionable part. Categories map to the user's request: **travel · rentals · real estate · restaurants · cafés · nightlife/events · AI product craft · mobile · design tools/templates.**

> Original `travelai-links.md` stub links are all preserved below, folded into **AI travel concierges** and **showcases**. Deep per-competitor teardown lives in [`docs/design-plan.md`](docs/design-plan.md).

---

## 1. AI travel concierges — the direct competitors

| | Site | Score | Steal this |
|---|---|---|---|
| 🔥 | [Mindtrip](https://mindtrip.ai) | **92** | The benchmark: chat ↔ map ↔ itinerary **living sync** (hover a card → pin lights). mdeai's #1 target pattern. |
| 🔥 | [Wanderlog](https://wanderlog.com/) | **90** | Map+list duality · save-to-collection · "add place" 1-click · trip timeline. User-cited. |
| ✅ | [Layla](https://layla.ai/) | 80 | Playful conversational tone; personality in an AI travel chat. |
| ✅ | [TripPlanner.ai](https://tripplanner.ai/) | 74 | Fast itinerary generation UX; clean result cards. |
| ✅ | [iMean.ai](https://www.imean.ai/) | 70 | Agentic "do it for me" framing. |
| ✅ | [Stardrift](https://stardrift.ai/) | 70 | Clean dark visual system. |
| ◻ | [Wonderplan](https://wonderplan.ai/) | 72 | Day-by-day plan layout. |
| ◻ | [Roam Around](https://roamaround.app/) | 68 | Minimal generator; lesson in *not* over-scoping. |
| ◻ | [EasyTrip AI](https://www.easytripai.com/) | 66 | Onboarding funnel. |
| ◻ | [Travo](https://travo.me/) · [Travelry](https://travelry.ai/) · [Faroway](https://www.faroway.ai/) | — | Smaller AI-travel entrants; scan for hero/onboarding ideas. |
| ✅ | Airial · RoutePerfect | 78 / 70 | Route-first planning (covered in design-plan.md audit). |

**Verdict:** Mindtrip + Wanderlog are the only two to study deeply. Everyone else is a generator with a thin UI — mdeai's chat+map+local-grounding already beats most.

---

## 2. Travel & discovery (non-AI, design-notable)

| | Site | Score | Steal this |
|---|---|---|---|
| 🔥 | [Airbnb](https://airbnb.com) | **95** | Card image treatment · sticky filter bar · map+grid toggle · the global card grammar mdeai's `VenueCard` should echo. |
| 🔥 | [Atlas Obscura](https://atlasobscura.com) | 85 | Discovery/editorial framing — makes browsing feel like exploring, not searching. |
| ✅ | [Hopper](https://hopper.com) | 84 | Mobile-first, color, "price confidence" microcopy. |
| ✅ | [Google Things to do](https://google.com/travel/things-to-do) | 82 | Map+list for a destination; chip filters. |
| ✅ | [Culture Trip](https://theculturetrip.com) | 80 | City editorial + listicles — content layer mdeai lacks. |

---

## 3. Rentals & real estate (for `/rentals`)

| | Site | Score | Steal this |
|---|---|---|---|
| 🔥 | [Zillow](https://zillow.com) | **90** | The gold standard for **map+list property browse**: pins with price labels, draw-to-search, sticky map. |
| 🔥 | [Airbnb](https://airbnb.com) | 95 | Furnished short-stay card + photo carousel + "what this place offers." |
| ✅ | [Redfin](https://redfin.com) | 88 | Tight map↔list hover sync; fast filters. |
| ✅ | [Blueground](https://theblueground.com) | 86 | Design-forward furnished rentals — clean, premium, exactly mdeai's Camila persona. |
| ✅ | [Sonder](https://sonder.com) | 84 | Branded stay imagery + minimal chrome. |
| ◻ | [Booking.com](https://booking.com) | 80 | Filter depth + (over)use of urgency — study what *not* to overdo. |

---

## 4. Restaurants (for `/restaurants`)

| | Site | Score | Steal this |
|---|---|---|---|
| 🔥 | [Resy](https://resy.com) | **90** | Mood photography + reservation flow + city editorial. The restaurant-card bar. |
| ✅ | [The Infatuation](https://theinfatuation.com) | 86 | Opinionated reviews + "best for…" framing → great for AI-reason text. |
| ✅ | [Beli](https://beliapp.com) | 84 | Social ranking + personal shortlist — the `[♥ Save]` future. |
| ✅ | [OpenTable](https://opentable.com) | 82 | Open-now / time-slot surfacing on cards. |
| ◻ | [Yelp](https://yelp.com) | 70 | Filter taxonomy reference (price, open now, outdoor). |

---

## 5. Cafés & coworking (for `/cafes`)

| | Site | Score | Steal this |
|---|---|---|---|
| ✅ | [Workfrom](https://workfrom.co) | **82** | **Laptop-friendly / wifi / outlet / noise** filters — the digital-nomad facets mdeai cafés need. |
| ✅ | [European Coffee Trip](https://europeancoffeetrip.com) | 80 | Warm specialty-coffee imagery + city café guides. |
| ◻ | [Beanhunter](https://beanhunter.com) | 76 | Café review taxonomy. |
| ◻ | [Foursquare/Swarm](https://foursquare.com) | 72 | "Near me, open now" discovery. |

---

## 6. Nightlife & events (for `/nightlife`)

| | Site | Score | Steal this |
|---|---|---|---|
| 🔥 | [Resident Advisor](https://ra.co) | **90** | **Genre/vibe-first** filtering + dark night-mood imagery + "tonight" listings. The nightlife bar. |
| 🔥 | [Dice.fm](https://dice.fm) | 88 | Clean event cards · "tonight/this week" · ticket flow → mdeai's club×event tie-in. |
| ✅ | [Fever](https://feverup.com) | 86 | Experience cards, mobile-first, strong imagery. |
| ✅ | [Bandsintown](https://bandsintown.com) | 78 | "What's on near me tonight." |
| ◻ | [Citizine](https://citizine.com) | 74 | City nightlife editorial. |

---

## 7. AI product craft (not travel — pure design/UX bar)

| | Site | Score | Steal this |
|---|---|---|---|
| 🔥 | [Linear](https://linear.app) | **95** | The product-design bar: dark theme, oklch-grade color, motion restraint, keyboard-first. |
| 🔥 | [Perplexity](https://perplexity.ai) | 88 | Chat-result UI: streaming, source chips, follow-up suggestions — directly applicable to mdeai chat. |
| ✅ | [Raycast](https://raycast.com) | 90 | Command palette + dark surfaces + crisp typography. |
| ✅ | [Vercel](https://vercel.com) | 90 | Geist type system (mdeai already uses Geist) + restrained dark UI. |
| ✅ | [Arc / Dia](https://arc.net) | 86 | Playful-but-premium motion; onboarding delight. |

---

## 8. Mobile patterns (mdeai is mobile-bound for tourists)

| | App | Score | Steal this |
|---|---|---|---|
| 🔥 | [Mobbin](https://mobbin.com) | **must-use** | Not an app — the pattern *library*. Search "map list," "filter sheet," "chat" → real iOS/Android screens. Use before designing any mobile flow. |
| 🔥 | Airbnb iOS | 92 | Bottom-sheet map↔list, filter sheet, card carousels. |
| ✅ | [Citymapper](https://citymapper.com) | 90 | Map-as-home, dark, glanceable — mdeai's "city map" north star, mobile. |
| ✅ | Hopper | 88 | Color + delight + price microcopy on mobile. |
| ✅ | Spotify | 88 | Duotone editorial imagery (the nightlife card treatment). |

---

## 9. Design tools, templates & showcases

| | Resource | Use it for |
|---|---|---|
| 🔥 | [shadcn/ui](https://ui.shadcn.com) + [blocks](https://ui.shadcn.com/blocks) | **Component source** — mdeai already uses base-nova. Sidebar-filter, gallery, card-grid blocks ≈ the browse system. |
| 🔥 | [Mobbin](https://mobbin.com) | Mobile/web pattern reference (see §8). |
| ✅ | Figma + official **Figma MCP** (in `.mcp.json`) | Design→code both ways; matches the repo. |
| ✅ | [Vercel Geist](https://vercel.com/geist) | Type + color reference (Geist already in use). |
| ✅ | [Land-book](https://land-book.com) · [Godly](https://godly.website) | Landing-page inspiration for `/`, `/about`, `/partners`. |
| ◻ | [screensdesign.com/showcase/wanderlog-travel-planner](https://screensdesign.com/showcase/wanderlog-travel-planner) | *(from stub)* Wanderlog mobile screen teardown. |
| ◻ | [aitravel.tools/wanderlog-review](https://aitravel.tools/wanderlog-review/) | *(from stub)* AI-travel tool directory + reviews. |

---

## 10. Bottom line

**Don't buy a template — build the component system** on shadcn/base-nova + Tailwind v4 + oklch (you already have it). Study **four** sites deeply and copy their *patterns*, not their pixels:

1. **Mindtrip** → chat ↔ map living sync (mdeai's unbuilt advantage)
2. **Wanderlog** → map+list duality + save-to-collection
3. **Airbnb / Zillow** → the card + sticky-filter + map-pin grammar
4. **Resident Advisor / Resy** → per-vertical mood imagery (night vs. warm)

Everything else here is a spot reference for one facet. Per-page application is in [`pages/`](pages/).
