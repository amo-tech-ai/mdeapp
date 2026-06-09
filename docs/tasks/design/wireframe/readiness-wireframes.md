---
title: Design-Readiness Wireframes — 6 highest-risk screens
updated: 2026-06-08
owner: sanjiovani
scope: Annotated ASCII wireframes + shadcn/21st component plan for the 6 unblocked-but-undesigned screens
covers:
  - SAN-692 — MKT Partner hub (/partners)
  - SAN-690 — MKT Partner dashboard (/dashboard)
  - SAN-693 — MKT Contact / Book a demo (/contact)
  - SAN-712 — MKT For Nightlife landing (/partners/nightlife)
  - SAN-713 — MKT For Restaurants landing (/partners/restaurants)
  - SAN-714 — MKT For Cafés landing (/partners/cafes)
shells: ./../COMPONENT-SHELLS.md
tokens: DESIGN.MD (light luxury · oklch · teal primary + gold accent)
---

# Design-Readiness Wireframes

> These are **design artifacts, not code.** Every screen composes the reusable shells in [`COMPONENT-SHELLS.md`](../COMPONENT-SHELLS.md). Light tokens only (no hardcoded `gray-*`), skeletons + `prefers-reduced-motion`, WCAG 2.2 AA (24px min target, visible focus). English only (Phase 1).
>
> **Label note:** SAN-712 = **Nightlife**, SAN-713 = **Restaurants**, SAN-714 = **Cafés** (the prompt's labels were swapped — Linear is authoritative).

---

## 1 · SAN-692 — Partner hub (`/partners`)

**Persona:** any supply-side partner (Roberto/venue owner/broker/sponsor/agency). **Goal:** route each partner type to its landing or typed signup. **Reference:** Mindtrip-for-Business. **Shell:** `MarketingPageShell`.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ NAV   mdeai   Explore  Events  Rentals        [Log in]  [List with us ►]  │  ← MarketingNav (sticky, transparent→solid on scroll)
├─────────────────────────────────────────────────────────────────────────┤
│  HERO (gold radial accent, light bg)                                      │
│     Grow your business with Medellín's AI concierge                       │  ← H1 (Geist, 56/64)
│     Get in front of every traveler & local who asks our AI where to go.   │
│     [ List with us ► ]   [ Book a demo ]                                   │  ← primary (gold) + ghost
│     ▸ trust strip: "120+ venues · 4.8★ · grounded in real Medellín data"  │
├─────────────────────────────────────────────────────────────────────────┤
│  PARTNER-TYPE CARD GRID  ("Choose how you grow")        5 cards, 3-up     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                            │
│  │ 🎤 Event   │ │ 🍽 Venues  │ │ 🏠 Rentals │   each PartnerTypeCard:    │
│  │   Hosts    │ │            │ │  /Brokers  │   icon · title · 1-liner  │
│  │ Publish &  │ │ Reservations│ │ Booked     │   · "Learn more →"        │
│  │ sell tix   │ │ + bookings │ │ viewings   │   → /host /venues          │
│  │ →/host ✅  │ │ →/venues✅ │ │ →/partners/│     /partners/rentals      │
│  └────────────┘ └────────────┘ │  rentals   │                            │
│  ┌────────────┐ ┌────────────┐ └────────────┘                            │
│  │ 🎟 Sponsors│ │ 🤖 Agencies│                                            │
│  │ →/sponsors │ │ →/business/ai                                           │
│  └────────────┘ └────────────┘                                            │
│  ⚠ guard: Broker/Sponsor/Agency 404 until 691/664/663 ship → render as    │
│     "Coming soon" teaser cards (no dead links) per SAN-692 AC             │
├─────────────────────────────────────────────────────────────────────────┤
│  VALUE BAND  "Why partner with mdeai"   3 benefit tiles (icon+head+body)  │
│   More bookings · AI does the work · One concierge in front of everyone   │
├─────────────────────────────────────────────────────────────────────────┤
│  SOCIAL PROOF   logo marquee  +  Real-Results stat band (content-managed) │
├─────────────────────────────────────────────────────────────────────────┤
│  CTA BAND   "See mdeai for Business in action"   [ Book a demo ► ]        │  → /contact (lead source=partners)
├─────────────────────────────────────────────────────────────────────────┤
│  FOOTER (shared MarketingFooter: product · partners · legal · social)     │
└─────────────────────────────────────────────────────────────────────────┘
MOBILE: cards stack 1-up; hero CTAs full-width stacked; marquee → 2-row wrap.
```

**shadcn/ui:** `card` · `button` · `badge` · `separator` · `navigation-menu` (nav) · `skeleton`.
**21st.dev:** Hero-with-radial · Bento/feature-card grid · Logo-marquee · Stats band · CTA section · Footer.
**Deps:** [SAN-674](https://linear.app/sanjiovani/issue/SAN-674) (UX pack marquee) · `blockedBy` [SAN-665](https://linear.app/sanjiovani/issue/SAN-665). Card destinations 691/664/663 stubbed-or-teaser.

---

## 2 · SAN-690 — Partner dashboard (`/dashboard`)

**Persona:** any partner post-signup (role-aware). **Goal:** one shell, tabs render per enabled service. **Source:** `tasks/partners/06-dashboards.md`. **Shell:** `DashboardShell` + `DataTable` + `FormKit`.

```
┌──────────────┬────────────────────────────────────────────────────────────┐
│ SIDEBAR      │  TOPBAR  Acme Rooftop ▾   completion ◔ 70%   [✦ Ask AI]  ◍ │
│ (shadcn      ├────────────────────────────────────────────────────────────┤
│  sidebar)    │  TAB: Overview  | Leads | Bookings | Revenue | Campaigns |  │  ← role-aware tab set
│              │       Analytics | Reviews | Automations | ✦ AI | Opportun.  │
│ ◉ Overview   ├────────────────────────────────────────────────────────────┤
│ ◦ Leads      │  KPI ROW  ┌ Leads 24 ┐┌ Live 8 ┐┌ Views 1.2k ┐┌ Rev $4.1k ┐ │  ← StatCard ×4
│ ◦ Bookings   │           └──────────┘└────────┘└────────────┘└───────────┘ │
│ ◦ Revenue    │  COMPLETION RING + "Next best actions" (AI)                  │
│ ◦ Campaigns  │   • Add 3 photos  • Reply to lead #12  • Connect Stripe      │
│ ◦ Analytics  │  ACTIVITY FEED (recent leads/bookings/posts)                 │
│ ◦ Reviews    │                                                             │
│ ◦ Automations│  ── on "Leads" tab ──────────────────────────────────────   │
│ ◦ ✦ AI       │  DataTable: source · status · value · date  → row drawer    │
│ ◦ Opportun.  │     drawer = HITL: AI-drafted reply → [Edit][Approve & send] │
│              │  ── on "Revenue" tab ── chart (gross/net/fees) + payouts     │
│ [⚙ Settings] │  ── on "✦ AI" tab ── full co-pilot pane (continues signup)   │
└──────────────┴────────────────────────────────────────────────────────────┘
Module visibility matrix (who sees what) → tasks/partners/06-dashboards.md.
Every tab: loading skeleton · empty state · error state (DESIGN.MD rule).
MOBILE: sidebar → off-canvas drawer (hamburger); tabs → horizontal scroll; table → stacked cards.
```

**shadcn/ui:** `sidebar` ✅ · `tabs` ✅ · `card` · `table` (→DataTable) · `chart` · `avatar` ✅ · `dropdown-menu` · `sheet`/`drawer` (row HITL + mobile nav) · `progress` (completion ring) · `skeleton` · `sonner` ✅.
**21st.dev:** Dashboard sidebar layout · KPI/stat-card row · Data-table-with-row-actions · Analytics chart card · AI-assistant pane.
**Deps:** `blockedBy` [SAN-723](https://linear.app/sanjiovani/issue/SAN-723) ✅, [SAN-716](https://linear.app/sanjiovani/issue/SAN-716), [SAN-683](https://linear.app/sanjiovani/issue/SAN-683) ✅. **This is the canonical `DashboardShell` + `DataTable` consumer — build the shells here first.**

---

## 3 · SAN-693 — Contact / Book a demo (`/contact`)

**Persona:** high-touch supply + B2B not ready for self-serve. **Goal:** capture lead (`source=contact`). **Shell:** `MarketingPageShell` (slim) + `FormKit`.

```
┌─────────────────────────────────────────────────────────────────┐
│ NAV (shared)                                                      │
├───────────────────────────────┬─────────────────────────────────┤
│  LEFT — pitch                  │  RIGHT — FormKit card            │
│   Talk to us                   │  ┌─────────────────────────────┐ │
│   Book a 20-min demo; we'll    │  │ Name*        [__________]   │ │
│   show your venue inside the    │  │ Work email*  [__________]   │ │
│   concierge.                    │  │ Partner type*[ Select ▾ ]   │ │  ← host/venue/broker/sponsor/agency
│   • avg reply < 1 business day  │  │ Message      [          ]   │ │
│   • Patricia (ops) follows up   │  │              [          ]   │ │
│   trust: "120+ partners"        │  │ [ Send message ► ]          │ │
│                                 │  │ success → inline confirm ✓  │ │
│                                 │  └─────────────────────────────┘ │
└───────────────────────────────┴─────────────────────────────────┘
States: idle · submitting (button spinner) · success (inline card) · error (field + alert).
MOBILE: single column, form below pitch.
```

**shadcn/ui:** `card` · `form` + `input` + `textarea` + `select` + `label` (→FormKit) · `button` · `alert` · `sonner`.
**21st.dev:** Split contact (pitch│form) · success-state card.
**Deps:** `relatedTo` [SAN-684](https://linear.app/sanjiovani/issue/SAN-684) (lead store). **Spec gap:** no detailed screen spec — this wireframe + AC below close it.

---

## 4–6 · Venue-type landings — ONE template, three skins

> SAN-712/713/714 all use the **same `MarketingPageShell`** (the Linear bodies say "reuse the shared landing template — do not fork"). Only the accent, copy, and CTA query differ. Build the template once; pass props.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ NAV (shared)                                                              │
├─────────────────────────────────────────────────────────────────────────┤
│  HERO  {VERTICAL_HEADLINE}                                                │
│        {VERTICAL_SUBHEAD}                                                 │
│        [ {PRIMARY_CTA} ► ]  [ Book a demo ]   → /partners/signup?type=…   │
│        ▸ proof strip ({vertical-specific stat})                          │
├─────────────────────────────────────────────────────────────────────────┤
│  VALUE / FEATURES grid  (3–4 FeatureCards: {VERTICAL_FEATURES})           │
├─────────────────────────────────────────────────────────────────────────┤
│  HOW IT WORKS  (3 steps: List → Get discovered in chat → Get {outcome})  │
├─────────────────────────────────────────────────────────────────────────┤
│  PRICING TEASER  ({VERTICAL_REVENUE_MODEL})  → /pricing                   │
├─────────────────────────────────────────────────────────────────────────┤
│  DEMO CTA  → form (source={vertical})    +    FOOTER (shared)            │
└─────────────────────────────────────────────────────────────────────────┘
MOBILE: features 1-up; hero CTAs stacked full-width.
```

| Prop | SAN-712 Nightlife (`/partners/nightlife`) | SAN-713 Restaurants (`/partners/restaurants`) | SAN-714 Cafés (`/partners/cafes`) |
|---|---|---|---|
| Accent | magenta `oklch(0.65 0.22 330)` | terracotta `oklch(0.70 0.17 40)` | caramel `oklch(0.80 0.13 85)` |
| Headline | "Fill your tables every night" | "Turn searches into reservations" | "Get discovered by every remote worker in Medellín" |
| Primary CTA | "List your venue / Get VIP bookings" | "Get diners / Manage reservations" | "Get discovered / Launch loyalty" |
| Signup query | `?type=venue&category=nightclub` | `?type=venue&category=restaurant` | `?type=venue&category=cafe` |
| Features | VIP table booking · guest list · featured placement · "Tonight" event tie-in | reservations · featured placement · AI marketing retainer · review mgmt | featured placement · loyalty program · happy-hour promos |
| Revenue model | 10–15% table fee | featured/subscription | low-cost high-frequency tiers |

**shadcn/ui (all three):** `card` · `button` · `badge` · `accordion` (FAQ, optional) · `separator` · `form` (demo) · `skeleton`.
**21st.dev:** Hero · Feature/bento grid · How-it-works steps · Pricing-teaser · CTA band · Footer.
**Deps:** all `blockedBy` [SAN-665](https://linear.app/sanjiovani/issue/SAN-665) ✅ · parented to epic [SAN-667](https://linear.app/sanjiovani/issue/SAN-667) ✅. **Existing source:** consumer browse specs in `tasks/partners/wireframes/pages/{nightlife,restaurants,cafes}.md` are for the *consumer* routes — content cues (accent, vibe) reused, but the landing structure above is acquisition-first.

---

## Per-screen readiness after these wireframes

| Task | Wireframe | Shell | shadcn ready | 21st ready | Build-ready |
|---|:--:|---|:--:|:--:|:--:|
| [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) Partner hub | ✅ (this doc) | MarketingPageShell | ✅ | ✅ | **Yes** (stub teaser cards) |
| [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) Partner dashboard | ✅ | DashboardShell+DataTable | ✅ | ✅ | **Yes** (build shells here) |
| [SAN-693](https://linear.app/sanjiovani/issue/SAN-693) Contact | ✅ | MarketingPageShell+FormKit | ✅ | ✅ | **Yes** |
| [SAN-712](https://linear.app/sanjiovani/issue/SAN-712) Nightlife | ✅ | MarketingPageShell | ✅ | ✅ | **Yes** |
| [SAN-713](https://linear.app/sanjiovani/issue/SAN-713) Restaurants | ✅ | MarketingPageShell | ✅ | ✅ | **Yes** |
| [SAN-714](https://linear.app/sanjiovani/issue/SAN-714) Cafés | ✅ | MarketingPageShell | ✅ | ✅ | **Yes** |
