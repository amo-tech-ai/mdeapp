# 00 — Foundations: design system, components, shared patterns

Shared layer referenced by every page file. Covers the design system, the reusable component library, conversational components, map integration patterns, **#18 AI recommendation cards**, **#19 search/filter layouts**, and global state conventions.

---

## 1. Design direction

### 1.1 Dark / light
- **Default dark, full light parity.** Map-heavy concierge + Medellín nightlife read premium dark; daytime rental/host tasks need light. CSS variables + Tailwind v4 tokens; `prefers-color-scheme` default + persisted user toggle in top-nav (`◑`).
- Surfaces (dark): `bg-900` canvas, `bg-800` panels, `bg-700` cards, `bg-600` hover. Light mirrors inverted.
- Accent = one warm "Medellín" hue (paisa orange/terracotta) for primary CTAs + selected pins; reserve green for "verified/grounded", red for errors only.

### 1.2 Typography
| Role | Font | Size / weight |
|---|---|---|
| Display (hero/H1) | Geist / Inter Display | 40–48 / 600 |
| Headers H2–H3 | Inter | 24 / 20 / 600 |
| Body | Inter | 16 / 400; 14 secondary |
| Micro (labels, attribution) | Inter | 12 / 500, uppercase tracking on labels |
| Prices / counts | tabular-nums | 16–20 / 600 |

### 1.3 Spacing / grid
- 4px base scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`.
- Card = 16 padding, 12 radius, 1px hairline border (dark `bg-600`).
- 3-panel widths (desktop ≥1280): **left 280** · center fluid (min 480) · **right 40%** (map).
- Content max-width on marketing pages 1200; gutters 24 (desktop) / 16 (mobile).

### 1.4 Animation / microinteractions (all <200ms, respect `prefers-reduced-motion`)
| Interaction | Motion |
|---|---|
| AI streaming | token reveal + caret; handoff steps fade-in sequentially |
| Card hover/focus | lift `translateY(-2px)` + shadow; **paired pin bounces** |
| Pin select | scale 1.15 + recolor accent; card scrolls into view |
| Save (heart) | fill + spring pop |
| Mobile sheet | spring drag (peek↔half↔full) |
| Skeletons | shimmer sweep on load |
| Filter apply | map re-query w/ soft pin cross-fade (augment, don't blank) |

---

## 2. Reusable component library

Tier: **DS** design-system · **DOM** domain-shared · **PAGE** page-specific. Build DOM in `src/platform/`.

| Component | Tier | Purpose | Notes |
|---|---|---|---|
| `TopNav` | DS | global nav + theme toggle + concierge launcher | sticky; collapses to bottom-tab on mobile |
| `ConciergeInput` | DOM | the global chat input | on home (hero) + docked in `/chat`; voice mic (Phase 2) |
| `Chips` | DS | intent seeds / quick replies | horizontal scroll on mobile |
| `ResultCard` | DOM | unified card (variants below) | UX-010 unified arch; **every card has a pin id** |
| `MapCanvas` | DOM | vis.gl map + `mapId` | clusters, InfoWindow, bidirectional highlight |
| `MapPin` | DOM | price pin / glyph pin | rentals=price, food/night=glyph, selected=accent |
| `GroundingAttribution` | DOM | "from Google Maps" + freshness | trust currency; on every grounded fact |
| `ThinkingTrace` | DOM | streaming handoff steps | "scanning 40 cafés…" |
| `FilterBar` | DOM | pills + "More filters" sheet | see §5 |
| `SaveButton` / `CollectionPicker` | DOM | retention | Post-MVP durable |
| `BottomSheet` | DS | mobile map+list | peek/half/full |
| `PriceBreakdown` | DOM | total incl fees | rentals/tickets — beats GuideGeek hallucination |
| `ReviewSynthesis` | DOM | "what people say" themes (grounded, labeled AI) | trust |
| `HITLApprovalPanel` | DOM | renderAndWaitForResponse host publish + outreach | approve/edit/reject |
| `LeadForm` | DOM | Schedule viewing → leads | name/phone/date |
| `StripeCheckout` | DOM | ticket payment | total + QR on success |
| `EmptyState` / `ErrorBanner` / `Skeleton*` | DS | global states | §6 |
| `WAMessageRenderer` | DOM | card → WA list/button | Phase 2 |

---

## 3. Conversational components

```text
┌─ message rhythm (center panel / chat) ──────────────────────┐
│  [you]  cafés to work from in Laureles                       │  user bubble (right)
│                                                              │
│  [mde]  ⠿ handing off to food concierge…                     │  ThinkingTrace
│         ⠿ scanning 40 cafés near coworking…                  │
│         Here are 3 great laptop-friendly spots:              │  streamed text
│         ┌─rec card─┐ ┌─rec card─┐ ┌─rec card─┐               │  inline ResultCards
│         from Google Maps · checked 2d ago                    │  GroundingAttribution
│         [ Show cheaper ] [ Compare #1 & #3 ] [ On the map ]  │  suggested follow-ups (Chips)
│                                                              │
│  [ type a message…                              🎤  ➤ ]      │  ConciergeInput (docked)
└──────────────────────────────────────────────────────────────┘
```

Patterns: streaming reveal (ChatGPT), visible thinking (Mindtrip), suggested follow-ups as chips, regenerate/edit on hover of an AI message, **never a bare blank prompt** — always cold-start ramps. Multi-intent ("cheap rental near good coffee") renders two card groups + both pin sets without wiping.

---

## 4. Map integration patterns

```text
RIGHT PANEL (desktop) / BOTTOM SHEET (mobile)
┌───────────────────────────────┐      mobile sheet states:
│  [Map] [Saved] tabs            │      ┌───────────┐  peek  (handle + 1 card)
│                                │      ├───────────┤  half  (map + scroll cards)
│     ● $1.2M    ● café          │      └───────────┘  full  (list)
│   ●━━━━━━━●  (cluster 12)      │
│        ◉ selected (accent)     │   • card hover → pin bounce
│                                │   • pin tap → card scrolls in + InfoWindow
│  ▣ from Google Maps            │   • new results augment pins (cross-fade)
└───────────────────────────────┘   • empty = city overview w/ neighborhood labels
```

Rules (hard): `mapId` on every `<Map>`; `X-Goog-FieldMask` on Places calls; photos/hours fetched **on open only** (cost); never invent coords/price/hours; clustering ≥ ~15 pins (MAP-009).

---

## 5. #19 Search / filter layouts

```text
DESKTOP filter bar (sticky under nav on discovery pages)
┌──────────────────────────────────────────────────────────────┐
│ [Neighborhood ▾] [Price ▾] [Beds ▾] [Vibe ▾] [More filters]   │  pills
│ ── active: "Laureles ✕"  "≤$1.5M ✕"  "laptop-friendly ✕" ──   │  active chips (removable)
└──────────────────────────────────────────────────────────────┘

"More filters" → right sheet (desktop) / full sheet (mobile)
  Price range slider · beds/baths · amenities · rating ≥ · open now ·
  verified only ☑ · distance from [pin/metro]

MOBILE: single [ Filters ⚙ ] button → full BottomSheet; active count badge.
```
Rules: pills over walls; **instant map re-query** on change; "verified only" + "open now" are one-tap; vibe filters are semantic (pgvector, Post-MVP). Search = `ConciergeInput` (NL) *or* structured pills — both feed the same query.

---

## 6. #18 AI recommendation cards (the universal results unit)

```text
┌─ ResultCard (RENTAL) ──────────┐  ┌─ ResultCard (RESTAURANT) ─────┐
│ [▢ photo carousel ●●○]      ♡ │  │ [▢ photo]                  ♡  │
│ ① Laureles · Studio            │  │ ② Café Vibe · Laureles         │
│ ★4.8 (212) · ✔ Verified        │  │ ★4.6 (180) · ☕ laptop-friendly │
│ $1,200/mo  ·  total $1,320     │  │ "Best for: focus work, espresso"│  AI "best-for" line
│ 10 min from metro · 350m coffee│  │ Open now · from Google Maps    │  grounding
│ [ Schedule viewing ] [ Save ]  │  │ [ Add to trip ] [ Directions ] │
└────────────────────────────────┘  └────────────────────────────────┘

┌─ ResultCard (EVENT) ───────────┐  ┌─ ResultCard (NIGHTLIFE) ──────┐
│ [▢ poster]                  ♡  │  │ [▢ photo]                  ♡  │
│ ③ Salsa Night · Provenza       │  │ ④ Rooftop X · El Poblado       │
│ Fri Jun 6 · 9pm                │  │ Tonight · cover $20 · ★4.7      │
│ from $25  ·  124 going         │  │ vibe: lively, rooftop, mixed   │
│ [ Buy tickets ]  [ Save ]      │  │ [ View · Reserve ] [ Save ]    │
└────────────────────────────────┘  └────────────────────────────────┘
```

| Anatomy slot | Rule |
|---|---|
| Pin index ①②③ | matches map pin number — the link |
| Photo | carousel (rentals/venues), single (events); skeleton on load |
| Price | **always show total/fees** (`PriceBreakdown`) — anti-GuideGeek |
| Trust line | ✔ Verified · ★rating(count) · grounding source + freshness |
| AI line | one "best-for"/why line (semantic), labeled as AI |
| Primary CTA | Rental=**Schedule viewing**; Event=**Buy tickets**; Resto=**Add to trip/Reserve**; Night=**Reserve/View** — never external-OTA-primary |
| Save ♡ | always present (retention hook even pre-Saved-feature) |

Compact variant (chat inline) = photo + title + price + 1 CTA. Full variant (discovery list) = above. WA variant = list-message row (title · price · "open full view" deep link).

---

## 7. Global state conventions

| State | Pattern |
|---|---|
| **Loading** | `Skeleton*` cards (shimmer) in list; map shows neighborhood overview + spinner; `ThinkingTrace` in chat |
| **Empty** | Illustration + reason + recovery CTA. e.g. rentals: "No verified rentals match — try widening price or neighborhood" + [Reset filters]. Chat: cold-start chips, never blank. |
| **Error** | Inline `ErrorBanner` (non-blocking) + Retry; chat shows user-facing error text (UX-002), never silent fail; map degrades to last-good pins |
| **Offline/grounding-down** | Disable grounded chips (UX-004), show "live data unavailable, showing saved info" |
| **Success (booking)** | Confirmation card + QR (ticket) / lead-received (rental) + next-step chips |

---

## 8. Sticky / nav / footer behavior (global)

- **Header (`TopNav`)**: sticky top; logo · verticals · Saved · `[Host]` CTA · profile · `◑`. On `/chat` it's slim (brand + new-chat + thread switch).
- **Footer**: marketing pages only (About, verticals, host, partners, legal, WhatsApp link). App surfaces (`/chat`, dashboards) have no footer.
- **Mobile**: header collapses to brand + hamburger; **bottom tab bar** (Chat · Explore · Saved · Profile) + docked `ConciergeInput` above it on `/chat`.
- **AI assistant placement**: the assistant *is the center panel* on `/chat`; on every other page a **docked launcher / `ConciergeInput`** routes into `/chat` with context. CopilotKit `<CopilotSidebar>` only for ancillary surfaces.
