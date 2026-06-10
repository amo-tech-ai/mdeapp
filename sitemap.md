---
title: mdeai — Sitemap
updated: 2026-06-06
app: src/app/ (Next.js App Router, repo root)
prod: https://www.mdeai.co
---

# mdeai Sitemap

## Legend

```
✅  LIVE     route exists + functional (page.tsx / route.ts shipped, tested)
⚠️  SHELL    route exists but barely implemented — broken or stub only
🔵  MVP      planned for MVP launch (P0 = blocks launch · P1 = polish)
⚫  POST     planned post-MVP (Phase 1 W6–W10)
💫  PHASE 2  advanced / WhatsApp / Phase 2+
```

---

## Consumer — public-facing pages

```
/                                    ✅ LIVE    Marketing home — hero search, FAB, discovery rails (handoff → /chat)
│
├── /chat                            ✅ LIVE    Concierge — GeoChatShell (chat + cards + map); canonical AI surface
│   ├── [overlay] venue-detail-sheet ✅ LIVE    Venue / rental / event detail slides over chat
│   └── [overlay] schedule-viewing  ✅ LIVE    Camila books a rental viewing (HITL lead capture)
│
├── /rentals                         ✅ LIVE    Rental browse catalog — **REAL-011 (SAN-478)** shipped (prod 200, no redirect)
│   └── /rentals/[id]                🔵 MVP P1  Rental detail page (REAL-012 / SAN-479)
│
├── /events                          ✅ LIVE    Public events catalog — **SCREEN-027 (SAN-518)** + **SAN-586** API · nav enabled (SAN-584)
│   └── /events/[slug]               ✅ LIVE    Event detail — ticket tiers + Buy CTA
│       └── [overlay] booking-checkout  ⚠️ SHELL   Stripe checkout (session works; webhook finalize missing)
│
├── /restaurants                     ✅ LIVE    Restaurant browse + filters (SAN-490)
│   └── /restaurants/[slug]          ⚫ POST    Restaurant detail page
│
├── /cafes                           ✅ LIVE    Café browse catalog — **SAN-519** · nav enabled (SAN-584 cafés flip)
│
├── /nightlife                       ✅ LIVE    Nightlife browse — curated venue_anchors + chat panels (SCREEN-022)
│   └── /nightlife/[slug]            ⚫ POST    Nightlife venue / event detail
│
├── /saved                           ✅ LIVE    Saved places + collections
│
├── /trips                           ⚠️ SHELL   Trips dashboard (page exists, incomplete)
│   └── /trips/[id]                  ⚠️ SHELL   Trip workspace + itinerary panel
│
├── /me
│   ├── /me/tickets                  ✅ LIVE    Ticket wallet — all purchases (Andrés)
│   │   └── /me/tickets/[id]         ✅ LIVE    Single ticket + QR code (scan at door)
│   └── /me/profile                  ⚫ POST    AI memory & personalization — view / edit / delete
│
├── /notifications                   💫 PHASE 2 In-app notification centre
├── /onboarding                      ⚫ POST    Post-signup wizard (preferences + neighborhood)
│
├── /login                           ✅ LIVE    Login (functional, visual polish pending)
├── /signup                          ✅ LIVE    Signup (functional, visual polish pending)
│
├── /about                           ⚫ POST    Marketing — about mdeai
├── /partners                        ⚠️ SHELL   Basic hub live (200) — full type-card hub SAN-692 In Progress; design task D-PTR-01
│   ├── /partners/signup             ✅ LIVE    Typed partner signup wizard (?type=…) — SAN-723 merged (#115); calls SAN-665 activate API
│   ├── /partners/rentals            🔵 MVP P1  **404 on prod** (verified 2026-06-10, shell never deployed) — Broker landing SAN-691 In Review; wireframe done
│   ├── /partners/creator            ⚫ POST    Influencer / creator program (SAN-700)
│   └── /partners/vendor             💫 PHASE 2 Marketplace vendor onboarding (SAN-698/702)
├── /sponsors                        🔵 MVP P2  **404 on prod** (verified 2026-06-10, shell never deployed) — Sponsor landing SAN-664 In Progress; wireframe done
├── /business/ai                     🔵 MVP P2  **404 on prod** (verified 2026-06-10, shell never deployed) — Agency landing SAN-663 In Progress; wireframe done (child of /business SAN-726)
│   ├── /business/social             ⚫ POST    Postiz social management (SAN-697)
│   └── /business/event-marketing    ⚫ POST    Event marketing services (SAN-701)
├── /venues                          🔵 MVP P0  Venue landing (?v=restaurant|cafe|nightclub|space) — **SAN-661 build-ready** (wireframe + copy + pinned components, D-PTR-02); ships PartnerLandingShell
│   └── /venues/features             ⚫ POST    Venue features deep-dive (SAN-703)
├── /pricing                         ⚫ POST    Partner pricing across types (SAN-695)
├── /contact                         ⚫ POST    Book a demo / sales (SAN-693)
└── /legal
    ├── /legal/privacy               ⚫ POST    Privacy policy
    └── /legal/terms                 ⚫ POST    Terms of service
```

---

## Supply — host & broker

```
/host
├── /host/event/new                  ✅ LIVE    Roberto's AI publish wizard (HITL, CopilotKit)
│   └── [overlay] approval-panel    ✅ LIVE    Roberto approves AI-drafted event before publish
└── /host/events                     ✅ LIVE    Host event list — Roberto sees published events (**SAN-118**, **SAN-366**)

/broker                              ⚫ POST    Broker / venue operator dashboard
├── /broker/leads                    ⚫ POST    Lead inbox (AI-drafted replies, HITL approve/send)
├── /broker/listings                 ⚫ POST    Manage rental / venue listings
└── /broker/payouts                  ⚫ POST    Commission + payout accounting
```

---

## Ops — internal / admin

```
/admin                               ⚫ POST    Patricia: ops command centre (W8)
├── /admin/leads                     ⚫ POST    Leads CRM — pipeline (New → Contacted → Won/Lost)
├── /admin/listings                  ⚫ POST    Listing approval queue (verify before going live)
├── /admin/events                    ⚫ POST    Event moderation queue
├── /admin/users                     ⚫ POST    User directory + AI memory viewer
└── /admin/cost                      ⚫ POST    Gemini + Places spend panel (FieldMask / cost levers)
```

---

## Auth (internal — no UI page)

```
/auth
├── /auth/callback                   ✅ LIVE    Supabase OAuth callback handler
└── /auth/signout                    ✅ LIVE    Sign-out + session clear
```

---

## API routes

```
/api

  ── AI runtime ──────────────────────────────────────────────────────────────────
  /api/copilotkit/[[...path]]        ✅ LIVE    CopilotKit → Mastra bridge (all agent turns)
  /api/approval-commit               ✅ LIVE    Roberto HITL — commit approved event draft

  ── Events ──────────────────────────────────────────────────────────────────────
  /api/events/[id]/public            ✅ LIVE    Fetch a published event by ID (RLS public)
  /api/events/search                 ✅ LIVE    In-thread event search (Mastra tool)
  /api/grounding/event-web           ✅ LIVE    Web-grounded event discovery (Gemini + Places)

  ── Places / map ────────────────────────────────────────────────────────────────
  /api/grounded/search               ✅ LIVE    Grounded place search (restaurants, cafés, nightlife)
  /api/places/detail                 ✅ LIVE    Single place detail (Places API New, FieldMask-gated)
  /api/places/photo                  ✅ LIVE    Photo proxy — avoids CORS on client

  ── Rentals ─────────────────────────────────────────────────────────────────────
  /api/rentals/search                ✅ LIVE    Rental search (Mastra tool → Supabase)

  ── Restaurants ─────────────────────────────────────────────────────────────────
  /api/restaurants/search            ✅ LIVE    Restaurant search + browse page (deploy pending)

  ── Tickets / payments ──────────────────────────────────────────────────────────
  /api/tickets/checkout              ✅ LIVE    Create Stripe checkout session → returns sessionUrl
  /api/tickets/wallet                ✅ LIVE    List buyer's purchased tickets
  /api/tickets/webhook               🔵 MVP P0  Stripe webhook → finalize order (EVP-003, blocked 🚨)

  ── Leads ───────────────────────────────────────────────────────────────────────
  /api/leads/schedule-viewing        ✅ LIVE    Camila submits a viewing request → leads table

  ── Admin / broker (proposed) ───────────────────────────────────────────────────
  /api/admin/approve-listing         ⚫ POST    Patricia approves a listing
  /api/broker/leads                  ⚫ POST    Broker lead management

  ── Phase 2 ─────────────────────────────────────────────────────────────────────
  /api/whatsapp/webhook              💫 PHASE 2 WhatsApp Business API inbound handler
  /api/ai/memory                     💫 PHASE 2 Read / update Camila's AI preference profile
```

---

## Phase 2 — WhatsApp transport

```
WhatsApp Business (+57 XXX)          💫 PHASE 2 Same Mastra brain, WhatsApp renderer
  ├── Onboarding flow (interactive buttons)
  ├── Rental / event / restaurant cards (≤3 picks per bubble — GuideGeek pattern)
  ├── Location pins
  ├── Voice note intake
  └── Human handoff → Chatwoot (hot leads / payments)

/whatsapp                            💫 PHASE 2 Web landing — scan QR or click to open WA chat
```

---

## Summary counts

| Category | ✅ LIVE | ⚠️ SHELL | 🔵 MVP | ⚫ POST | 💫 P2 | Total |
|----------|:------:|:-------:|:-----:|:------:|:-----:|------:|
| Consumer pages | 9 | 2 | 3 | 6 | 2 | 23 |
| Supply pages | 3 | — | — | 3 | — | 6 |
| Ops pages | — | — | — | 5 | — | 5 |
| Auth routes | 2 | — | — | — | — | 2 |
| API routes | 12 | — | 1 | 2 | 2 | 17 |
| Partner marketing | 1 | 3 | — | 7 | 1 | 12 |
| **Total** | **27** | **5** | **4** | **23** | **5** | **65** |

---

## Critical gaps — MVP launch blockers

| Route / surface | Gap | Priority |
|-----------------|-----|----------|
| `ticket-payment-webhook` | Stripe finalize edge fn **deployed** (v33 ACTIVE, `verify_jwt=false`, idempotent, finalize RPC). Remaining: Stripe Dashboard event subscriptions + live checkout→finalize e2e proof | 🟡 verify |
| `/chat` nav rail | `/chat` serves GeoChatShell (SAN-733); `/` is marketing entry with `?q=` handoff. Nav-rail on concierge shell | ✅ resolved |
| Mobile bottom-sheet | SCREEN-018 mobile responsive shell shipped (SAN-489 Done, PR #51) | ✅ resolved |
| `/rentals` display | Live on prod (SAN-478 catalog browse shipped; verified 2026-06-10, HTTP 200 no redirect) | ✅ resolved |
| `/restaurants` browse | Live on prod (SAN-490 + SAN-575 re-skin) | ✅ resolved |
| `/events` browse | Live on prod (SAN-518 + SAN-586); Events nav enabled (SAN-584) | ✅ resolved |
| `/cafes` browse | Live on prod (SAN-519); Cafés nav enabled (SAN-584 pattern) | ✅ resolved |
| `/nightlife` browse | Live (SAN-491 + SAN-575 re-skin) | ✅ resolved |
| `/host/events` | Live (SAN-118 + SAN-366 Step 0); auth required (307 when logged out) | ✅ resolved |
| `/rentals/[id]` | Rental detail page doesn't exist — cards link nowhere | P1 |
