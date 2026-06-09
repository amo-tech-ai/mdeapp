---
title: DESIGN-INVENTORY — mdeai Master UI/UX Inventory
updated: 2026-06-08
owner: sanjiovani
status: canonical
scope: Every website page, marketing page, dashboard, admin/host/partner page, chat/copilot surface, modal, drawer, wizard, detail panel, mobile screen, and flow across the mdeai platform.
sources:
  - sitemap.md (53 routes)
  - DESIGN.MD (design system)
  - tasks/design/** (D-01…D-14, wireframes, screen specs)
  - tasks/design/website-pages.md (partner-pages status — narrower companion doc)
  - tasks/{partners,events,real-estate,venues,trips,maps,ecommerce,chatwoot,core}/**
  - Linear projects: UX (108), Partners (49), Trips (27), Events Platform (73), Venues (40) — 297 issues
---

# DESIGN-INVENTORY.md — mdeai Master UI/UX Inventory

> **Single canonical source of truth** for every designable surface on the mdeai platform.
> Cross-references `sitemap.md` (route status), `DESIGN.MD` (system), `tasks/design/index-design.md` (D-track), `tasks/design/website-pages.md` (partner-pages detail), and Linear (issue truth).

**Legend**

| Symbol | Wireframe / Spec / Designed / Built columns |
|---|---|
| ✅ | Exists / Done / Live on prod |
| 🟡 | Partial / In progress / In review |
| ⚠️ | Shell or stub only |
| ❌ | Missing / does not exist |
| — | Not applicable |

**Priority:** `P0` = blocks MVP launch · `P1` = MVP polish · `POST` = post-MVP (Phase 1 W6–W10) · `P2` = Phase 2.

---

# Executive Summary

| Metric | Count | Notes |
|---|---:|---|
| **Total distinct designable surfaces** | **~118** | Routes + overlays + cards + panels + B2B wizards + mobile variants |
| Website / consumer pages (routes) | 32 | From sitemap consumer + supply + auth |
| Marketing / landing pages | 22 | Partners project `MKT —*` (1 live, 3 shells, 18 todo/backlog) |
| Dashboards | 7 | Host events ✅ · Partner ⬚ · Vendor ⬚ · 5× Admin ⬚ |
| Admin / ops pages | 8 | `/admin/*` (0 built) + `/admin/venues` + `/admin/chatwoot` |
| Chat / copilot surfaces | 9 | Chat chrome, nav rail, query bar, AI band, map workspace, progress strip |
| Modals / drawers / sheets | 13 | Checkout, schedule-viewing, create-trip, proposal, booking sheet, compare drawer… |
| Wizards | 4 | Host event wizard ✅ · Partner signup ✅ · Onboarding ⬚ · Host venue-step ⬚ |
| Detail panels / sheets | 9 | Venue/rental/event detail, restaurant/nightlife/café panels, offerings panel |
| Result-card families | 8 | Restaurant, café, nightlife, rental, event, attraction, product, coffee-tour |
| Mobile-specific screens/tracks | 10 | Shell ✅ ([SAN-489 — SCREEN-018 Mobile Responsive 3-Panel Shell](https://linear.app/sanjiovani/issue/SAN-489)); 9 backlog (chat, cards, map, checkout, PWA, perf, a11y…) |
| **Total MISSING designs (no wireframe/spec done)** | **~55** | Mostly Partners marketing, Admin, B2B venue-booking, mobile, Phase-2 |
| **Total MISSING wireframes** | **~36** | Most `MKT —*` partner pages, admin screens, ecommerce, contest screens |
| **Total MISSING Linear tasks (orphan surfaces)** | **~9** | `/legal/*`, `/restaurants/[slug]`, `/nightlife/[slug]`, broker/*, `/admin/listings`, `/admin/users`, `/admin/cost`, `/whatsapp` |

**Headline:** The **consumer concierge core is largely designed + built** (home, chat, 4 browse routes, event detail, tickets, host wizard). The **three biggest design holes are (1) the Partners marketing site (22 pages — 1 live, 3 shells, rest undesigned), (2) the Admin/Ops suite (8 pages, 0 built), and (3) the B2B event-venue-booking UI set (12+ Linear issues, 0 built).** Mobile has a shipped shell but 9 backlog tracks. Trips is shells-only.

---

# Screen Inventory (master table)

## A. Consumer — public pages

| Area | Task Name | Task ID | Route | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Consumer | D-13 Re-skin Home | [SAN-579 — D-13 Re-skin Home (/)](https://linear.app/sanjiovani/issue/SAN-579) / [SAN-232 — SCREEN-001 Home Chat Chrome](https://linear.app/sanjiovani/issue/SAN-232) | `/` | Home (hero + verticals + chat) | ✅ home-wireframe.html (14 bands) | ✅ | ✅ | ✅ | ✅ | — | P0 |
| Consumer | Chat alias | [SAN-488 — SCREEN-002 Chat Nav Rail + Thread List](https://linear.app/sanjiovani/issue/SAN-488) | `/chat` | Concierge (alias → `/`) | ✅ | ✅ | ✅ | ✅ | ✅ | — | P0 |
| Consumer | REAL-011 Rental browse | [SAN-478 — REAL-011 Rental browse page](https://linear.app/sanjiovani/issue/SAN-478) | `/rentals` | Rental catalog browse | ✅ 009-wire | ✅ | ✅ | ✅ | 🟡 In progress | Catalog build (redirects to /chat today) | P0 |
| Consumer | REAL-012 Rental detail | [SAN-479 — REAL-012 Rental detail page](https://linear.app/sanjiovani/issue/SAN-479) | `/rentals/[id]` | Rental detail page | ✅ wire | ✅ | ✅ | ✅ | ❌ | Page doesn't exist — cards link nowhere | P1 |
| Consumer | SCREEN-027 Events browse | [SAN-518 — SCREEN-027 Events browse listing](https://linear.app/sanjiovani/issue/SAN-518) / [SAN-585 — SPEC-027 Author events browse scr+wire](https://linear.app/sanjiovani/issue/SAN-585) / [SAN-587 — D-09b Re-skin /events browse](https://linear.app/sanjiovani/issue/SAN-587) | `/events` | Events catalog | ✅ | ✅ | ✅ | ✅ | ✅ | — | P0 |
| Consumer | SCREEN-014 Event detail | [SAN-237 — SCREEN-014 Event Detail Page](https://linear.app/sanjiovani/issue/SAN-237) | `/events/[slug]` | Event detail + ticket tiers | ✅ 003-wire | ✅ | ✅ | ✅ | ✅ | — | P0 |
| Consumer | EVT-017 Luma-style detail | [SAN-135 — EVT-017 Luma-style event detail](https://linear.app/sanjiovani/issue/SAN-135) | `/events/[slug]` | Luma-style event layout (v2) | 🟡 | 🟡 | ✅ In Review | 🟡 | 🟡 | Layout upgrade | P1 |
| Consumer | SCREEN-023 Restaurants | [SAN-490 — SCREEN-023 Restaurant Listings Page](https://linear.app/sanjiovani/issue/SAN-490) / [SAN-575 — D-09 Re-skin discovery surfaces](https://linear.app/sanjiovani/issue/SAN-575) | `/restaurants` | Restaurant browse + filters | ✅ | ✅ | ✅ | ✅ | ✅ | — | P0 |
| Consumer | Restaurant detail | — | `/restaurants/[slug]` | Restaurant detail page | ❌ | ❌ | ❌ (route) | ❌ | ❌ | Route-page orphan — no task/folder on disk. In-chat detail covered by panel [SAN-293 — VEN-014 RestaurantDetailPanel](https://linear.app/sanjiovani/issue/SAN-293) | POST |
| Consumer | SCREEN-028 Cafés | [SAN-519 — SCREEN-028 Cafes browse listing](https://linear.app/sanjiovani/issue/SAN-519) | `/cafes` | Café browse catalog | ✅ | ✅ | ✅ Backlog | ✅ | ✅ | — | P0 |
| Consumer | SCREEN-022 Nightlife | [SAN-491 — SCREEN-022 Nightlife Listings + Map](https://linear.app/sanjiovani/issue/SAN-491) / [SAN-575 — D-09 Re-skin discovery surfaces](https://linear.app/sanjiovani/issue/SAN-575) | `/nightlife` | Nightlife browse + map | ✅ | ✅ | ✅ | ✅ | ✅ | — | P0 |
| Consumer | Nightlife detail | — | `/nightlife/[slug]` | Nightlife venue detail | ❌ | ❌ | ❌ (route) | ❌ | ❌ | Route-page orphan — no task/folder on disk. In-chat detail covered by panel [SAN-296 — VEN-017 NightlifeDetailPanel + mobile sheet](https://linear.app/sanjiovani/issue/SAN-296) | POST |
| Consumer | VEN-012 Coffee tour detail | [SAN-175 — VEN-012 /tours/[slug] detail page](https://linear.app/sanjiovani/issue/SAN-175) | `/tours/[slug]` | Coffee tour detail page | ❌ | 🟡 | ✅ Todo | ❌ | ❌ | Whole coffee-tour vertical unbuilt | POST |
| Consumer | SCREEN-011 Saved | [SAN-253 — SCREEN-011 Saved Collections Page](https://linear.app/sanjiovani/issue/SAN-253) / [SAN-278 — TRP-014 Saved collections page](https://linear.app/sanjiovani/issue/SAN-278) | `/saved` | Saved places + collections | ✅ 014-wire | ✅ | ✅ | ✅ | 🟡 (TRP-014 rebuild) | Collections page rebuild | P1 |
| Consumer | SCREEN-012 Trips dashboard | [SAN-255 — SCREEN-012 Trips Dashboard](https://linear.app/sanjiovani/issue/SAN-255) / [SAN-274 — TRP-010 Trips dashboard polish](https://linear.app/sanjiovani/issue/SAN-274) | `/trips` | Trips list + create | ✅ 012-wire | ✅ | ✅ In Review | ✅ | ⚠️ Shell | Create modal + polish | POST |
| Consumer | SCREEN-013 Trip workspace | [SAN-251 — SCREEN-013 Itinerary Panel](https://linear.app/sanjiovani/issue/SAN-251) / [SAN-276 — TRP-012 Trip workspace shell](https://linear.app/sanjiovani/issue/SAN-276) | `/trips/[id]` | Trip workspace (4 tabs) | ✅ 012-wire | ✅ | ✅ In Review | ✅ | ⚠️ Shell | Map/Ideas/Bookings tabs stub | POST |
| Consumer | SCREEN-015 Ticket wallet | [SAN-259 — SCREEN-015 My Tickets + QR](https://linear.app/sanjiovani/issue/SAN-259) | `/me/tickets` | Ticket wallet | ✅ 015-wire | ✅ | ✅ In Review | ✅ | ✅ | — | P0 |
| Consumer | Ticket detail + QR | [SAN-259 — SCREEN-015 My Tickets + QR](https://linear.app/sanjiovani/issue/SAN-259) | `/me/tickets/[id]` | Single ticket + QR | ✅ | ✅ | ✅ | ✅ | ✅ | — | P0 |
| Consumer | SCREEN-026 Profile | [SAN-517 — SCREEN-026 User profile / account](https://linear.app/sanjiovani/issue/SAN-517) | `/me/profile` | AI memory / account | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | No wireframe; not built | POST |
| Consumer | WIRE-023 Onboarding | [SAN-269 — WIRE-023 Onboarding Wizard](https://linear.app/sanjiovani/issue/SAN-269) | `/onboarding` | Post-signup preferences wizard | 🟡 wire only | 🟡 | ✅ Backlog | 🟡 | ❌ | Not built | POST |
| Consumer | WIRE-025 Notifications | [SAN-271 — WIRE-025 Notifications](https://linear.app/sanjiovani/issue/SAN-271) | `/notifications` | In-app notification centre | 🟡 025-wire | 🟡 | ✅ Backlog | 🟡 | ❌ | Phase 2 | P2 |
| Auth | Login/signup polish | [SAN-112 — UX-012 Login and signup polish](https://linear.app/sanjiovani/issue/SAN-112) | `/login`, `/signup` | Auth screens | ✅ 024-wire | ✅ | ✅ In Review | ✅ | ✅ (polish pending) | Visual polish | P1 |
| Auth | OAuth callback | — | `/auth/callback` | Handler (no UI) | — | — | — | — | ✅ | — | — |
| Auth | Sign-out | — | `/auth/signout` | Handler (no UI) | — | — | — | — | ✅ | — | — |

## B. Marketing / Partners landing pages

> Source: Linear **Partners** project + `tasks/partners/wireframes/*` + companion `tasks/design/website-pages.md`. `MKT —*` = marketing page. Only the signup wizard is **Live**; `/partners/rentals`, `/sponsors`, `/business/ai` have wireframes + **shell** placeholders. Remaining pages: bundled wireframes in [SAN-674 — PTR Partner UX pack (wireframes + SVGs)](https://linear.app/sanjiovani/issue/SAN-674) (Partner UX pack), itself `Todo`.

| Area | Task Name | Task ID | Route | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Marketing | Partner signup wizard | [SAN-665 — PTR POST /api/partners/activate](https://linear.app/sanjiovani/issue/SAN-665) / [SAN-723 — MKT Partner signup wizard (/partners/signup)](https://linear.app/sanjiovani/issue/SAN-723) | `/partners/signup` | Typed signup wizard | ✅ partner-signup-wire | ✅ | ✅ Done | ✅ | ✅ Live | Phase-2 6-step stepper + copilot | P0 |
| Marketing | Partner hub | [SAN-692 — MKT Partner hub (/partners)](https://linear.app/sanjiovani/issue/SAN-692) | `/partners` | Partner hub landing | ❌ | 🟡 03-landing | ✅ Todo | ❌ | 🟡 (current branch) | Wireframe + design | P1 |
| Marketing | For Rentals/Brokers | [SAN-691 — MKT For Rentals / Brokers landing (/partners/rentals)](https://linear.app/sanjiovani/issue/SAN-691) | `/partners/rentals` | Real-estate host landing | ✅ partners-rentals-wire | 🟡 | ✅ Todo | 🟡 | ⚠️ Shell | Full design + build | P1 |
| Marketing | Sponsors | [SAN-664 — MKT Sponsors / Sponsorship (/sponsors)](https://linear.app/sanjiovani/issue/SAN-664) | `/sponsors` | Sponsorship landing | ✅ sponsors-wire | 🟡 | ✅ Todo | 🟡 | ⚠️ Shell | Full design + build | P1 |
| Marketing | AI Services | [SAN-663 — MKT AI Services for companies (/business/ai)](https://linear.app/sanjiovani/issue/SAN-663) | `/business/ai` | AI services for companies | ✅ business-ai-wire | 🟡 | ✅ Todo | 🟡 | ⚠️ Shell | Full design + build | P1 |
| Marketing | Event Hosts landing | [SAN-660 — MKT For Event Hosts landing (/host)](https://linear.app/sanjiovani/issue/SAN-660) | `/host` | Event host landing | 🟡 host-wireframe.html | 🟡 | ✅ Todo | 🟡 | ❌ | Design + build | P1 |
| Marketing | For Venues landing | [SAN-661 — MKT For Venues landing (/venues)](https://linear.app/sanjiovani/issue/SAN-661) | `/venues` | Venues landing (3 variants) | 🟡 venues-wireframe.html | 🟡 | ✅ Todo | 🟡 | ❌ | Design + build | P1 |
| Marketing | For Restaurants | [SAN-713 — MKT For Restaurants landing (/partners/restaurants)](https://linear.app/sanjiovani/issue/SAN-713) | `/partners/restaurants` | Restaurant partner landing | ❌ | 🟡 | ✅ Todo | ❌ | ❌ | Wireframe + build | P1 |
| Marketing | For Cafés | [SAN-714 — MKT For Cafés landing (/partners/cafes)](https://linear.app/sanjiovani/issue/SAN-714) | `/partners/cafes` | Café partner landing | ❌ | 🟡 | ✅ Todo | ❌ | ❌ | Wireframe + build | P1 |
| Marketing | For Nightlife | [SAN-712 — MKT For Nightlife landing (/partners/nightlife)](https://linear.app/sanjiovani/issue/SAN-712) | `/partners/nightlife` | Nightlife partner landing | ❌ | 🟡 | ✅ Todo | ❌ | ❌ | Wireframe + build | P1 |
| Marketing | Creator program | [SAN-696 — MKT Creator program landing (/partners/creator)](https://linear.app/sanjiovani/issue/SAN-696) | `/partners/creator` | Influencer/creator landing | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Wireframe + build | POST |
| Marketing | Marketplace vendor | [SAN-702 — MKT Marketplace vendor landing (/partners/vendor)](https://linear.app/sanjiovani/issue/SAN-702) | `/partners/vendor` | Vendor landing | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Wireframe + build | POST |
| Marketing | Business hub | [SAN-726 — MKT mdeai for Business hub (/business)](https://linear.app/sanjiovani/issue/SAN-726) | `/business` | Partner-type cards overview | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Wireframe + build | POST |
| Marketing | Event marketing svc | [SAN-701 — MKT Event marketing (/business/event-marketing)](https://linear.app/sanjiovani/issue/SAN-701) | `/business/event-marketing` | Event marketing services | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Wireframe + build | POST |
| Marketing | Social services | [SAN-697 — MKT Postiz social services (/business/social)](https://linear.app/sanjiovani/issue/SAN-697) | `/business/social` | Postiz social services | ❌ | ❌ | ✅ Backlog | ❌ | ❌ | Spec + wireframe | POST |
| Marketing | Contact / demo | [SAN-693 — MKT Contact / Book a demo (/contact)](https://linear.app/sanjiovani/issue/SAN-693) | `/contact` | Contact / book a demo | ❌ | ❌ | ✅ Todo | ❌ | ❌ | Spec + wireframe + build | P1 |
| Marketing | Pricing | [SAN-695 — MKT Partner pricing (/pricing)](https://linear.app/sanjiovani/issue/SAN-695) | `/pricing` | Partner pricing | ❌ | ❌ | ✅ Backlog | ❌ | ❌ | Spec + wireframe + build | POST |
| Marketing | Contests hub | [SAN-694 — MKT Contests / Giveaways hub (/contests)](https://linear.app/sanjiovani/issue/SAN-694) | `/contests` | Contests / giveaways hub | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Wireframe + build | POST |
| Marketing | Venue features | [SAN-703 — MKT Venue features deep-dive (/venues/features)](https://linear.app/sanjiovani/issue/SAN-703) | `/venues/features` | Venue features deep-dive | ❌ | ❌ | ✅ Backlog | ❌ | ❌ | Spec + wireframe | POST |
| Marketing | About | [SAN-662 — MKT About page (/about)](https://linear.app/sanjiovani/issue/SAN-662) | `/about` | About mdeai | ❌ | ❌ | ✅ Todo | ❌ | ❌ | Spec + wireframe + build | P1 |
| Marketing | Privacy policy | — | `/legal/privacy` | Privacy policy | ❌ | ❌ | ❌ | ❌ | ❌ | Orphan — no task | P1 |
| Marketing | Terms of service | — | `/legal/terms` | Terms of service | ❌ | ❌ | ❌ | ❌ | ❌ | Orphan — no task | P1 |

## C. Dashboards (host / partner / vendor)

| Area | Task Name | Task ID | Route | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Host | EVT-014 Host events list | [SAN-118 — EVT-014 Host events list page](https://linear.app/sanjiovani/issue/SAN-118) | `/host/events` | Roberto's events dashboard | ✅ EVP-014-wire | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Partner | Partner dashboard | [SAN-690 — MKT Partner dashboard (/dashboard)](https://linear.app/sanjiovani/issue/SAN-690) | `/dashboard` | Role-aware partner dashboard (Overview/Leads/Bookings/Revenue/Campaigns/AI/Analytics/Reviews) | 🟡 06-dashboards.md | ✅ | ✅ Todo | 🟡 | ❌ | Wireframe + build (large) | P1 |
| Vendor | ECOM-M-004 Vendor dashboard | ECOM-M-004 | `/vendors/dashboard` | Vendor admin (catalog/orders/analytics) | ❌ | 🟡 | ❌ (no SAN) | ❌ | ❌ | Spec + wireframe + Linear | POST |

## D. Admin / Ops pages

> Entire suite is `⚫ POST` in sitemap and `Backlog` in Linear. **0 built, 0 wireframes.**

| Area | Task Name | Task ID | Route | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Admin | Ops command centre | — | `/admin` | Patricia ops home | ❌ | ❌ | ❌ | ❌ | ❌ | Orphan — no task | POST |
| Admin | SCREEN-025 Leads CRM | [SAN-516 — SCREEN-025 Admin Leads / CRM](https://linear.app/sanjiovani/issue/SAN-516) | `/admin/leads` | Leads pipeline CRM | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Wireframe + build | POST |
| Admin | SCREEN-024 Events admin | [SAN-515 — SCREEN-024 Admin Events dashboard](https://linear.app/sanjiovani/issue/SAN-515) | `/admin/events` | Event moderation queue | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Wireframe + build | POST |
| Admin | VEN-032 Booking queue | [SAN-311 — VEN-032 Admin booking queue](https://linear.app/sanjiovani/issue/SAN-311) / [SAN-514 — EVT-055 Wire: Admin event booking queue](https://linear.app/sanjiovani/issue/SAN-514) | `/admin/bookings` | Venue booking approval queue | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Wireframe + build | POST |
| Admin | EVT-043 Event request queue | [SAN-502 — EVT-043 Patricia admin queue (event requests)](https://linear.app/sanjiovani/issue/SAN-502) | `/admin/bookings` (events) | Patricia event-request queue | ❌ | 🟡 | ✅ Todo | ❌ | ❌ | Merge w/ venue queue | POST |
| Admin | Listing approval | — | `/admin/listings` | Listing approval queue | ❌ | ❌ | ❌ | ❌ | ❌ | Orphan — no task | POST |
| Admin | User directory | — | `/admin/users` | Users + AI memory viewer | ❌ | ❌ | ❌ | ❌ | ❌ | Orphan — no task | POST |
| Admin | Cost panel | — | `/admin/cost` | Gemini + Places spend | ❌ | ❌ | ❌ | ❌ | ❌ | Orphan — no task | POST |
| Admin | Chatwoot inbox | CW-1 | `/admin/chatwoot` | Agent inbox (Chatwoot native) | — | ✅ prd-chatwoot | ❌ (no SAN) | — | ❌ | Self-hosted UI; no new mdeai screen | POST |

## E. Supply — broker (POST-MVP, all unbuilt)

| Area | Task Name | Task ID | Route | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Broker | Broker dashboard | — | `/broker` | Venue operator dashboard | ❌ | ❌ | ❌ | ❌ | ❌ | Orphan — no task | POST |
| Broker | Lead inbox | — | `/broker/leads` | AI-drafted reply inbox (HITL) | ❌ | 🟡 (real-estate-prd) | ❌ | ❌ | ❌ | Spec→wireframe→build | POST |
| Broker | Listings manage | — | `/broker/listings` | Manage rental/venue listings | ❌ | ❌ | ❌ | ❌ | ❌ | Orphan — no task | POST |
| Broker | Payouts | — | `/broker/payouts` | Commission + payout accounting | ❌ | ❌ | ❌ | ❌ | ❌ | Orphan — no task | POST |

## F. Chat / Copilot surfaces

| Area | Task Name | Task ID | Route/Context | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Chat | SCREEN-001 Home chat chrome | [SAN-232 — SCREEN-001 Home Chat Chrome](https://linear.app/sanjiovani/issue/SAN-232) | `/` | Chat chrome integration | ✅ 001-scr | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Chat | SCREEN-002 Nav rail | [SAN-488 — SCREEN-002 Chat Nav Rail + Thread List](https://linear.app/sanjiovani/issue/SAN-488) | `/` | Chat nav rail + thread list | ✅ 002-wire | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Chat | SCREEN-003 Query bar | [SAN-234 — SCREEN-003 Chat Query Bar + Filter Chips](https://linear.app/sanjiovani/issue/SAN-234) | `/` | Query bar + filter chips | ✅ 002-wire | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Chat | SCREEN-004 Progress strip | [SAN-263 — SCREEN-004 Workflow Progress Strip](https://linear.app/sanjiovani/issue/SAN-263) | `/` | Workflow progress strip | ✅ 017-scr | ✅ | ✅ In Review | ✅ | 🟡 | Verify in review | P1 |
| Chat | SCR-002b Sidebar nav enable | [SAN-584 — SCR-002b Explore sidebar enable nav](https://linear.app/sanjiovani/issue/SAN-584) | `/` | Explore sidebar nav links | — | ✅ | ✅ In Progress | ✅ | 🟡 | Enable at browse Done | P1 |
| Chat | D-11 Map workspace | [SAN-577 — D-11 Map workspace (pins↔cards)](https://linear.app/sanjiovani/issue/SAN-577) | `/`, browse | Pins ↔ cards sync | ✅ map-workspace-wire | ✅ | ✅ Done | ✅ | 🟡 | Build (design done) | P1 |
| Chat | D-12 Concierge AI band | [SAN-578 — D-12 Concierge surface (grounded AI band)](https://linear.app/sanjiovani/issue/SAN-578) | browse routes | Grounded AI band | ✅ D-05 section | ✅ | ✅ Backlog | ✅ | ❌ | Build (blocked on D-09) | P1 |
| Chat | UX-011 Map exploration panel | [SAN-111 — UX-011 Map exploration panel](https://linear.app/sanjiovani/issue/SAN-111) / [SAN-247 — WIRE-008 Map Exploration Panel](https://linear.app/sanjiovani/issue/SAN-247) | `/` | Map exploration panel | ✅ 011-wire | ✅ | ✅ In Review (247 Canceled) | ✅ | 🟡 | Verify | P1 |
| Chat | TRP-006 Coffee-tour chips | [SAN-174 — TRP-006 Coffee tour intent chips](https://linear.app/sanjiovani/issue/SAN-174) | `/` | Coffee-tour intent chips | ❌ | 🟡 | ✅ Todo | ❌ | ❌ | Design + build | POST |

## G. Result cards (in-thread generative UI)

| Area | Task Name | Task ID | Context | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Cards | D-08 Shared browse system | [SAN-574 — D-08 Shared browse system](https://linear.app/sanjiovani/issue/SAN-574) | all browse | VenueCard + BrowseLayout + ResultCardShell | ✅ D-05 | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Cards | VEN-013 Restaurant card | [SAN-292 — VEN-013 RestaurantResultCard](https://linear.app/sanjiovani/issue/SAN-292) / [SAN-439 — UX-025 RestaurantCard rich](https://linear.app/sanjiovani/issue/SAN-439) | `/` | RestaurantResultCard | ✅ | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Cards | CAF-001 Café card | [SAN-114 — CAF-001 Café discovery cards](https://linear.app/sanjiovani/issue/SAN-114) | `/` | Café result card | ✅ | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Cards | Nightlife card | [SAN-292 — VEN-013 RestaurantResultCard](https://linear.app/sanjiovani/issue/SAN-292)/[SAN-491 — SCREEN-022 Nightlife Listings + Map](https://linear.app/sanjiovani/issue/SAN-491) | `/` | Nightlife card | ✅ | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Cards | SCREEN-005 Rental card | [SAN-242 — SCREEN-005 Rental Card Polish + CTAs](https://linear.app/sanjiovani/issue/SAN-242) | `/` | RentalCard + CTAs | ✅ 009-wire | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Cards | SCREEN-006 Event card | [SAN-236 — SCREEN-006 Event Card In-Thread Polish](https://linear.app/sanjiovani/issue/SAN-236) / [SAN-117 — EVT-013 Event cards in AI chat](https://linear.app/sanjiovani/issue/SAN-117) | `/` | Event card in-thread | ✅ | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Cards | VEN-002 Attraction card | [SAN-363 — VEN-002 Rich attraction result cards](https://linear.app/sanjiovani/issue/SAN-363) / [SAN-442 — UX-026 AttractionCard rich](https://linear.app/sanjiovani/issue/SAN-442) | `/` | AttractionCard | ✅ | ✅ | ✅ Done | ✅ | ✅ | — | P1 |
| Cards | ECOM-C-014 Product card | ECOM-C-014 | `/` | Generative product card | ❌ | 🟡 | ❌ (no SAN) | ❌ | ❌ | Spec→wireframe→Linear→build | POST |
| Cards | VEN-008 Coffee-tour card | [SAN-165 — VEN-008 CoffeeTourCard render](https://linear.app/sanjiovani/issue/SAN-165) | `/` | CoffeeTourCard | ❌ | 🟡 | ✅ Todo | ❌ | ❌ | Design + build | POST |

## H. Detail panels / sheets

| Area | Task Name | Task ID | Context | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Panel | SCREEN-007 Venue/listing detail | [SAN-245 — SCREEN-007 Venue/Listing Detail Sheet](https://linear.app/sanjiovani/issue/SAN-245) | overlay | Venue / rental / event detail sheet | ✅ | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Panel | VEN-014 Restaurant panel | [SAN-293 — VEN-014 RestaurantDetailPanel](https://linear.app/sanjiovani/issue/SAN-293) | overlay | RestaurantDetailPanel | ✅ | ✅ | ✅ Todo | ✅ | 🟡 | Build | P1 |
| Panel | VEN-017 Nightlife panel | [SAN-296 — VEN-017 NightlifeDetailPanel + mobile sheet](https://linear.app/sanjiovani/issue/SAN-296) | overlay | NightlifeDetailPanel + mobile sheet | ✅ | ✅ | ✅ Done | ✅ | ✅ | — | P1 |
| Panel | EVT-036 Offerings panel | [SAN-495 — EVT-036 Event offerings detail panel](https://linear.app/sanjiovani/issue/SAN-495) / [SAN-510 — EVT-051 Wire: Event offerings panel](https://linear.app/sanjiovani/issue/SAN-510) | overlay | Event offerings detail panel | 🟡 wire | 🟡 | ✅ Todo | 🟡 | ❌ | Design + build | POST |
| Panel | EVT-039 Venue match panel | [SAN-498 — EVT-039 AI venue match score panel](https://linear.app/sanjiovani/issue/SAN-498) / [SAN-512 — EVT-053 Wire: Venue match panel + compare](https://linear.app/sanjiovani/issue/SAN-512) | overlay | AI venue match score panel | 🟡 wire | 🟡 | ✅ Todo | 🟡 | ❌ | Design + build | POST |
| Panel | EVT-040 Compare venues | [SAN-499 — EVT-040 Compare venues side-by-side](https://linear.app/sanjiovani/issue/SAN-499) | overlay | Compare venues side-by-side | ❌ | 🟡 | ✅ Todo | ❌ | ❌ | Design + build | POST |

## I. Modals / drawers / wizards

| Area | Task Name | Task ID | Context | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Wizard | SCREEN-016 Host event wizard | [SAN-240 — SCREEN-016 Host Event Wizard UI](https://linear.app/sanjiovani/issue/SAN-240) | `/host/event/new` | 4-step CopilotKit wizard (HITL) | ✅ 004-wire | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Wizard | Partner signup wizard | [SAN-723 — MKT Partner signup wizard (/partners/signup)](https://linear.app/sanjiovani/issue/SAN-723) | `/partners/signup` | Typed signup wizard | ✅ partner-signup-wire | ✅ | ✅ Done | ✅ | ✅ | Phase-2 stepper | P0 |
| Wizard | EVT-041 Host venue step | [SAN-500 — EVT-041 Host wizard venue step](https://linear.app/sanjiovani/issue/SAN-500) / [SAN-513 — EVT-054 Wire: Host wizard venue step](https://linear.app/sanjiovani/issue/SAN-513) | `/host/event/new` | Venue-selection wizard step | 🟡 | 🟡 | ✅ Todo | 🟡 | ❌ | Design + build | POST |
| Wizard | WIRE-023 Onboarding | [SAN-269 — WIRE-023 Onboarding Wizard](https://linear.app/sanjiovani/issue/SAN-269) | `/onboarding` | Post-signup wizard | 🟡 | 🟡 | ✅ Backlog | 🟡 | ❌ | Build | POST |
| Modal | SCREEN-008 Schedule viewing | [SAN-262 — SCREEN-008 Schedule Viewing Modal (HITL Lead)](https://linear.app/sanjiovani/issue/SAN-262) | overlay | Schedule-viewing modal (HITL lead) | ✅ 017-scr | ✅ | ✅ In Review | ✅ | ✅ | Verify | P0 |
| Modal | SCREEN-009 Booking checkout | [SAN-248 — SCREEN-009 Booking Checkout Modal + Stripe](https://linear.app/sanjiovani/issue/SAN-248) | overlay | Stripe checkout modal | ✅ | ✅ | ✅ Done | ✅ | ⚠️ Shell | Webhook finalize (P0 blocker) | P0 |
| Modal | Checkout states | [SAN-715 — FE Checkout states (decline/3DS/wallet/empty)](https://linear.app/sanjiovani/issue/SAN-715) | overlay | Decline / 3DS / wallet / empty | ✅ | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Modal | Lead-submitted confirm | [SAN-716 — FE "Lead submitted" confirmation state](https://linear.app/sanjiovani/issue/SAN-716) | overlay | "Lead submitted" state | 🟡 | ✅ | ✅ Todo | 🟡 | ❌ | Build | P1 |
| Modal | TRP-011 Create trip | [SAN-275 — TRP-011 Create trip modal](https://linear.app/sanjiovani/issue/SAN-275) | overlay | Create-trip modal | ✅ 012-wire | ✅ | ✅ Todo | ✅ | ❌ | Build | POST |
| Modal | TRP-015 Add-to-trip | [SAN-279 — TRP-015 Add-to-trip from cards](https://linear.app/sanjiovani/issue/SAN-279) | card action | Add-to-trip from cards | 🟡 | ✅ | ✅ Todo | 🟡 | ❌ | Build | POST |
| Modal | EVT-037 Request proposal | [SAN-496 — EVT-037 Request proposal modal (HITL)](https://linear.app/sanjiovani/issue/SAN-496) / [SAN-511 — EVT-052 Wire: Request proposal modal](https://linear.app/sanjiovani/issue/SAN-511) | overlay | Request-proposal modal (HITL) | 🟡 | 🟡 | ✅ Todo | 🟡 | ❌ | Design + build | POST |
| Drawer | VEN-021 Venue booking sheet | [SAN-300 — VEN-021 VenueBookingSheet component](https://linear.app/sanjiovani/issue/SAN-300) / [SAN-304 — VEN-025 VenueBookingSheet + DB persist](https://linear.app/sanjiovani/issue/SAN-304) | overlay | VenueBookingSheet | 🟡 | ✅ | ✅ Done(304)/Todo(300) | 🟡 | 🟡 | Finish build | POST |
| Drawer | TRP-005 Coffee-tour compare | [SAN-173 — TRP-005 CoffeeTourCompareDrawer](https://linear.app/sanjiovani/issue/SAN-173) | overlay | CoffeeTourCompareDrawer | ❌ | 🟡 | ✅ Todo | ❌ | ❌ | Design + build | POST |

## J. Mobile-specific screens / tracks

> Source: Linear UX `MOB-*` / `AIM-*` / `PWA-*` / `PERF-*` / `A11Y-*`. Shell shipped; rest backlog.

| Area | Task Name | Task ID | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Mobile | SCREEN-018 Responsive shell | [SAN-489 — SCREEN-018 Mobile Responsive 3-Panel Shell](https://linear.app/sanjiovani/issue/SAN-489) | Mobile 3-panel shell | ✅ | ✅ | ✅ Done | ✅ | ✅ | — | P0 |
| Mobile | MOB-CHAT-001 Chat composer | [SAN-522 — MOB-CHAT-001 Mobile chat composer](https://linear.app/sanjiovani/issue/SAN-522) | Mobile chat composer + keyboard | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Design + build | POST |
| Mobile | MOB-CARD-001 Card system | [SAN-525 — MOB-CARD-001 Mobile card system](https://linear.app/sanjiovani/issue/SAN-525) | Mobile cards (touch + carousels) | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Design + build | POST |
| Mobile | MAP-011-M Map interaction | [SAN-524 — MAP-011-M Mobile map interaction](https://linear.app/sanjiovani/issue/SAN-524) | Mobile map interaction | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Design + build | POST |
| Mobile | PAY-005 Mobile checkout | [SAN-526 — PAY-005 Mobile checkout UX](https://linear.app/sanjiovani/issue/SAN-526) | Mobile checkout (Apple/Google Pay) | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Design + build | POST |
| Mobile | AIM-010 Mobile concierge UX | [SAN-523 — AIM-010 Mobile AI concierge UX](https://linear.app/sanjiovani/issue/SAN-523) | Mobile AI chips + prompts | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Design + build | POST |
| Mobile | AUTH-006 Mobile auth | [SAN-527 — AUTH-006 Mobile auth stability](https://linear.app/sanjiovani/issue/SAN-527) | Mobile auth stability | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Build | POST |
| Mobile | PWA-001 Install experience | [SAN-529 — PWA-001 Mobile install experience](https://linear.app/sanjiovani/issue/SAN-529) | PWA manifest + offline | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Build | POST |
| Mobile | PERF-001 Mobile perf | [SAN-528 — PERF-001 Mobile performance](https://linear.app/sanjiovani/issue/SAN-528) | LCP/CLS/INP | — | 🟡 | ✅ Backlog | — | ❌ | Tuning | POST |
| Mobile | A11Y-001 Mobile a11y | [SAN-530 — A11Y-001 Mobile accessibility audit](https://linear.app/sanjiovani/issue/SAN-530) | VoiceOver/TalkBack audit | — | 🟡 | ✅ Backlog | — | ❌ | Audit | POST |

## K. Ecommerce flow (Medusa — POST-MVP)

| Area | Task Name | Task ID | Route | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Ecom | Stripe checkout | ECOM-C-004 | `/checkout` | Product checkout | ❌ | 🟡 | ❌ | ❌ | ❌ | Spec→wireframe→Linear→build | POST |
| Ecom | Cart UI | ECOM-C-015 | overlay | Cart state UI | ❌ | 🟡 | ❌ | ❌ | ❌ | Design + Linear + build | POST |
| Ecom | Vendor dashboard | ECOM-M-004 | `/vendors/dashboard` | Vendor admin | ❌ | 🟡 | ❌ | ❌ | ❌ | Design + Linear + build | POST |

## L. Contest flow (Events Platform — CTEST, Backlog)

| Area | Task Name | Task ID | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| Contest | CTEST-006 Screens/routes | [SAN-538 — CTEST-006 Contest screens/routes/wireframes](https://linear.app/sanjiovani/issue/SAN-538) | Contest screens + wireframes | 🟡 | 🟡 | ✅ Backlog | 🟡 | ❌ | Design + build | POST |
| Contest | CTEST-004 Workspace cards | [SAN-536 — CTEST-004 Contest workspace + approval cards](https://linear.app/sanjiovani/issue/SAN-536) | CopilotKit contest workspace + approval | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Design + build | POST |
| Contest | CTEST-010 Public voting page | [SAN-542 — CTEST-010 Public contestant voting page](https://linear.app/sanjiovani/issue/SAN-542) | Public contestant voting page | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Design + build | POST |
| Contest | CTEST-009 Profile editor | [SAN-541 — CTEST-009 Contestant profile editor](https://linear.app/sanjiovani/issue/SAN-541) | Contestant profile editor + AI coach | ❌ | 🟡 | ✅ Backlog | ❌ | ❌ | Design + build | POST |

## M. Phase 2 — WhatsApp

| Area | Task Name | Task ID | Route | Screen Name | Wireframe | Spec | Linear | Designed | Built | Missing | Priority |
|---|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|:--:|
| P2 | WhatsApp landing | — | `/whatsapp` | QR / open-WA-chat landing | ❌ | 🟡 | ❌ | ❌ | ❌ | Orphan — Phase 2 | P2 |
| P2 | WhatsApp transport | — | WA Business | Cards/pins/voice in WA | ❌ | 🟡 | ❌ | — | ❌ | Phase 2 | P2 |

---

# Missing Tasks (proposed)

> Surfaces that exist in sitemap/PRD/code but have **no Linear issue**. Do not create duplicates — these are net-new.

| Task Name | Suggested Task ID / Area | Reason | Priority |
|---|---|---|:--:|
| Restaurant detail page `/restaurants/[slug]` | UX / VEN | Linked from `/restaurants` cards but route is orphan POST with no task | POST |
| Nightlife venue detail `/nightlife/[slug]` | UX / VEN | Orphan POST route; nightlife cards have nowhere to deep-link | POST |
| Privacy policy `/legal/privacy` | Marketing / Legal | Required for launch (Stripe/Supabase ToS); no task | P1 |
| Terms of service `/legal/terms` | Marketing / Legal | Required for launch; no task | P1 |
| Admin ops home `/admin` | Admin / OPS | Sitemap POST root with no Linear issue | POST |
| Listing approval queue `/admin/listings` | Admin / OPS | Sitemap POST; no task | POST |
| User directory `/admin/users` | Admin / OPS | Sitemap POST; no task | POST |
| Cost panel `/admin/cost` | Admin / OPS | Gemini/Places spend dashboard; no task | POST |
| Broker dashboard + listings + payouts `/broker/*` | Supply / BROKER | 3 sitemap POST routes (only leads has partial PRD) with no Linear | POST |
| Ecommerce checkout `/checkout` + cart UI | Ecom / ECOM | Spec'd in ECOM-C-004/015 but no Linear SAN issue | POST |
| Vendor dashboard `/vendors/dashboard` | Ecom / ECOM-M-004 | Spec only; no Linear | POST |
| Product card (generative) | Ecom / ECOM-C-014 | Spec only; no Linear | POST |
| WhatsApp landing `/whatsapp` | Phase 2 / WA | Sitemap P2; no task | P2 |

---

# Missing Wireframes

> Tasks/routes with a Linear issue and/or spec but **no wireframe**. Most are the Partners marketing site (blocked behind [SAN-674 — PTR Partner UX pack (wireframes + SVGs)](https://linear.app/sanjiovani/issue/SAN-674) UX pack) and the Admin suite. (`/partners/rentals`, `/sponsors`, `/business/ai` already HAVE wireframes — excluded.)

| Screen | Route | Related Task | Priority |
|---|---|---|:--:|
| Partner hub | `/partners` | [SAN-692 — MKT Partner hub (/partners)](https://linear.app/sanjiovani/issue/SAN-692) | P1 |
| For Restaurants | `/partners/restaurants` | [SAN-713 — MKT For Restaurants landing (/partners/restaurants)](https://linear.app/sanjiovani/issue/SAN-713) | P1 |
| For Cafés | `/partners/cafes` | [SAN-714 — MKT For Cafés landing (/partners/cafes)](https://linear.app/sanjiovani/issue/SAN-714) | P1 |
| For Nightlife | `/partners/nightlife` | [SAN-712 — MKT For Nightlife landing (/partners/nightlife)](https://linear.app/sanjiovani/issue/SAN-712) | P1 |
| Sponsors deep design (beyond shell wire) | `/sponsors` | [SAN-664 — MKT Sponsors / Sponsorship (/sponsors)](https://linear.app/sanjiovani/issue/SAN-664) | P1 |
| About | `/about` | [SAN-662 — MKT About page (/about)](https://linear.app/sanjiovani/issue/SAN-662) | P1 |
| Contact / demo | `/contact` | [SAN-693 — MKT Contact / Book a demo (/contact)](https://linear.app/sanjiovani/issue/SAN-693) | P1 |
| Partner dashboard | `/dashboard` | [SAN-690 — MKT Partner dashboard (/dashboard)](https://linear.app/sanjiovani/issue/SAN-690) | P1 |
| Creator / Vendor / Business hub / Pricing / Contests | `/partners/creator`, `/partners/vendor`, `/business`, `/pricing`, `/contests` | [SAN-696 — MKT Creator program landing (/partners/creator)](https://linear.app/sanjiovani/issue/SAN-696)/[SAN-702 — MKT Marketplace vendor landing (/partners/vendor)](https://linear.app/sanjiovani/issue/SAN-702)/[SAN-726 — MKT mdeai for Business hub (/business)](https://linear.app/sanjiovani/issue/SAN-726)/[SAN-695 — MKT Partner pricing (/pricing)](https://linear.app/sanjiovani/issue/SAN-695)/[SAN-694 — MKT Contests / Giveaways hub (/contests)](https://linear.app/sanjiovani/issue/SAN-694) | POST |
| Leads CRM | `/admin/leads` | [SAN-516 — SCREEN-025 Admin Leads / CRM](https://linear.app/sanjiovani/issue/SAN-516) | POST |
| Events admin | `/admin/events` | [SAN-515 — SCREEN-024 Admin Events dashboard](https://linear.app/sanjiovani/issue/SAN-515) | POST |
| Venue booking queue | `/admin/bookings` | [SAN-311 — VEN-032 Admin booking queue](https://linear.app/sanjiovani/issue/SAN-311) / [SAN-514 — EVT-055 Wire: Admin event booking queue](https://linear.app/sanjiovani/issue/SAN-514) / [SAN-502 — EVT-043 Patricia admin queue (event requests)](https://linear.app/sanjiovani/issue/SAN-502) | POST |
| Profile / AI memory | `/me/profile` | [SAN-517 — SCREEN-026 User profile / account](https://linear.app/sanjiovani/issue/SAN-517) | POST |
| Compare venues | overlay | [SAN-499 — EVT-040 Compare venues side-by-side](https://linear.app/sanjiovani/issue/SAN-499) | POST |
| Coffee-tour card + compare drawer | `/`, overlay | [SAN-165 — VEN-008 CoffeeTourCard render](https://linear.app/sanjiovani/issue/SAN-165) / [SAN-173 — TRP-005 CoffeeTourCompareDrawer](https://linear.app/sanjiovani/issue/SAN-173) | POST |
| Product card + checkout + cart | `/`, `/checkout` | ECOM-C-014/004/015 | POST |
| Mobile chat/cards/map/checkout/concierge | mobile | [SAN-522 — MOB-CHAT-001 Mobile chat composer](https://linear.app/sanjiovani/issue/SAN-522)/[SAN-525 — MOB-CARD-001 Mobile card system](https://linear.app/sanjiovani/issue/SAN-525)/[SAN-524 — MAP-011-M Mobile map interaction](https://linear.app/sanjiovani/issue/SAN-524)/[SAN-526 — PAY-005 Mobile checkout UX](https://linear.app/sanjiovani/issue/SAN-526)/[SAN-523 — AIM-010 Mobile AI concierge UX](https://linear.app/sanjiovani/issue/SAN-523) | POST |
| Contest workspace / voting / profile | contest routes | [SAN-536 — CTEST-004 Contest workspace + approval cards](https://linear.app/sanjiovani/issue/SAN-536)/[SAN-542 — CTEST-010 Public contestant voting page](https://linear.app/sanjiovani/issue/SAN-542)/[SAN-541 — CTEST-009 Contestant profile editor](https://linear.app/sanjiovani/issue/SAN-541) | POST |

---

# Missing Screen Specs

> Routes/surfaces with no detailed screen spec on disk (beyond a one-line PRD mention).

| Screen | Route | Related Task | Priority |
|---|---|---|:--:|
| Social services | `/business/social` | [SAN-697 — MKT Postiz social services (/business/social)](https://linear.app/sanjiovani/issue/SAN-697) | POST |
| Venue features deep-dive | `/venues/features` | [SAN-703 — MKT Venue features deep-dive (/venues/features)](https://linear.app/sanjiovani/issue/SAN-703) | POST |
| Pricing | `/pricing` | [SAN-695 — MKT Partner pricing (/pricing)](https://linear.app/sanjiovani/issue/SAN-695) | POST |
| Contact / demo | `/contact` | [SAN-693 — MKT Contact / Book a demo (/contact)](https://linear.app/sanjiovani/issue/SAN-693) | P1 |
| About | `/about` | [SAN-662 — MKT About page (/about)](https://linear.app/sanjiovani/issue/SAN-662) | P1 |
| Privacy / Terms | `/legal/*` | (no task) | P1 |
| Admin ops home / listings / users / cost | `/admin/*` | (no task) | POST |
| Broker dashboard / listings / payouts | `/broker/*` | (no task) | POST |
| Restaurant / Nightlife detail | `/restaurants/[slug]`, `/nightlife/[slug]` | (no task) | POST |
| WhatsApp landing | `/whatsapp` | (no task) | P2 |

---

# Duplicate Screens

> Real duplicates / overlaps found across sources. Recommendation = which to keep canonical.

| Screen A | Screen B | Recommendation |
|---|---|---|
| `/dashboard` Partner dashboard — **[SAN-690 — MKT Partner dashboard (/dashboard)](https://linear.app/sanjiovani/issue/SAN-690)** (Todo) | `/dashboard` Partner dashboard — **[SAN-666 — MKT Partner dashboard (/dashboard) [canceled dup]](https://linear.app/sanjiovani/issue/SAN-666)** (Canceled) | Keep [SAN-690 — MKT Partner dashboard (/dashboard)](https://linear.app/sanjiovani/issue/SAN-690); [SAN-666 — MKT Partner dashboard (/dashboard) [canceled dup]](https://linear.app/sanjiovani/issue/SAN-666) already canceled ✅ |
| `/cafes` live — **[SAN-519 — SCREEN-028 Cafes browse listing](https://linear.app/sanjiovani/issue/SAN-519)** | "Cafés page → live" — **[SAN-558 — CAF Cafés page → live](https://linear.app/sanjiovani/issue/SAN-558)** (Duplicate) | Keep [SAN-519 — SCREEN-028 Cafes browse listing](https://linear.app/sanjiovani/issue/SAN-519); [SAN-558 — CAF Cafés page → live](https://linear.app/sanjiovani/issue/SAN-558) marked Duplicate ✅ |
| ResultCardShell extract — **[SAN-360 — AIA-011 Extract shared result card shell](https://linear.app/sanjiovani/issue/SAN-360)** (Duplicate) | Extract shared card shell — **[SAN-437 — UX-023 Extract ResultCardShell](https://linear.app/sanjiovani/issue/SAN-437)** (Duplicate) | Both superseded by D-08 ([SAN-574 — D-08 Shared browse system](https://linear.app/sanjiovani/issue/SAN-574)) ✅ — close both |
| Admin booking queue (venues) — **[SAN-311 — VEN-032 Admin booking queue](https://linear.app/sanjiovani/issue/SAN-311) / [SAN-514 — EVT-055 Wire: Admin event booking queue](https://linear.app/sanjiovani/issue/SAN-514)** | Admin event-request queue (events) — **[SAN-502 — EVT-043 Patricia admin queue (event requests)](https://linear.app/sanjiovani/issue/SAN-502) / [SAN-514 — EVT-055 Wire: Admin event booking queue](https://linear.app/sanjiovani/issue/SAN-514)** | **Merge** — one `/admin/bookings` with venue + event tabs, not two routes |
| Venue-booking wizard step — **[SAN-500 — EVT-041 Host wizard venue step](https://linear.app/sanjiovani/issue/SAN-500)** (events) | Host wizard venue step — **[SAN-513 — EVT-054 Wire: Host wizard venue step](https://linear.app/sanjiovani/issue/SAN-513)** (Wire) | Same surface; [SAN-513 — EVT-054 Wire: Host wizard venue step](https://linear.app/sanjiovani/issue/SAN-513) is the wire of [SAN-500 — EVT-041 Host wizard venue step](https://linear.app/sanjiovani/issue/SAN-500) — keep as design→build pair |
| `/chat` route | `/` Home | Intentional alias (verified) — **not** a true duplicate; keep alias for bookmarks/F19 |
| `/venues` (Partners landing, [SAN-661 — MKT For Venues landing (/venues)](https://linear.app/sanjiovani/issue/SAN-661)) | `/venues/features` ([SAN-703 — MKT Venue features deep-dive (/venues/features)](https://linear.app/sanjiovani/issue/SAN-703)) | Distinct (hub vs deep-dive) — keep both; ensure consistent IA |
| Map exploration panel — **[SAN-111 — UX-011 Map exploration panel](https://linear.app/sanjiovani/issue/SAN-111)** (In Review) | WIRE-008 Map panel — **[SAN-247 — WIRE-008 Map Exploration Panel](https://linear.app/sanjiovani/issue/SAN-247)** (Canceled) | Keep [SAN-111 — UX-011 Map exploration panel](https://linear.app/sanjiovani/issue/SAN-111); [SAN-247 — WIRE-008 Map Exploration Panel](https://linear.app/sanjiovani/issue/SAN-247) canceled ✅ |
| Saved collections — **[SAN-253 — SCREEN-011 Saved Collections Page](https://linear.app/sanjiovani/issue/SAN-253)** (Done) | TRP-014 Saved collections — **[SAN-278 — TRP-014 Saved collections page](https://linear.app/sanjiovani/issue/SAN-278)** (Todo) | Overlap: [SAN-253 — SCREEN-011 Saved Collections Page](https://linear.app/sanjiovani/issue/SAN-253) = original, [SAN-278 — TRP-014 Saved collections page](https://linear.app/sanjiovani/issue/SAN-278) = Trips-track rebuild. Confirm [SAN-278 — TRP-014 Saved collections page](https://linear.app/sanjiovani/issue/SAN-278) supersedes; avoid building twice |

---

# MVP Coverage Audit

**MVP north star:** Camila on `/` (cards + pins) · Andrés paid ticket · Roberto host publish @ mdeai.co.

## ✅ MVP screens complete (designed + built + live)

| Screen | Route | Task |
|---|---|---|
| Home (cards + chat) | `/` | [SAN-579 — D-13 Re-skin Home (/)](https://linear.app/sanjiovani/issue/SAN-579)/[SAN-232 — SCREEN-001 Home Chat Chrome](https://linear.app/sanjiovani/issue/SAN-232) |
| Chat chrome / nav rail / query bar | `/` | [SAN-232 — SCREEN-001 Home Chat Chrome](https://linear.app/sanjiovani/issue/SAN-232)/[SAN-488 — SCREEN-002 Chat Nav Rail + Thread List](https://linear.app/sanjiovani/issue/SAN-488)/[SAN-234 — SCREEN-003 Chat Query Bar + Filter Chips](https://linear.app/sanjiovani/issue/SAN-234) |
| All result cards (restaurant/café/nightlife/rental/event/attraction) | `/` | [SAN-574 — D-08 Shared browse system](https://linear.app/sanjiovani/issue/SAN-574) + family |
| Restaurants / Cafés / Nightlife / Events browse | `/restaurants` `/cafes` `/nightlife` `/events` | [SAN-490 — SCREEN-023 Restaurant Listings Page](https://linear.app/sanjiovani/issue/SAN-490)/[SAN-519 — SCREEN-028 Cafes browse listing](https://linear.app/sanjiovani/issue/SAN-519)/[SAN-491 — SCREEN-022 Nightlife Listings + Map](https://linear.app/sanjiovani/issue/SAN-491)/[SAN-518 — SCREEN-027 Events browse listing](https://linear.app/sanjiovani/issue/SAN-518) |
| Event detail + ticket tiers | `/events/[slug]` | [SAN-237 — SCREEN-014 Event Detail Page](https://linear.app/sanjiovani/issue/SAN-237) |
| Ticket wallet + QR | `/me/tickets` | [SAN-259 — SCREEN-015 My Tickets + QR](https://linear.app/sanjiovani/issue/SAN-259) |
| Host event wizard + approval | `/host/event/new` | [SAN-240 — SCREEN-016 Host Event Wizard UI](https://linear.app/sanjiovani/issue/SAN-240) |
| Host events list | `/host/events` | [SAN-118 — EVT-014 Host events list page](https://linear.app/sanjiovani/issue/SAN-118) |
| Venue/listing detail sheet | overlay | [SAN-245 — SCREEN-007 Venue/Listing Detail Sheet](https://linear.app/sanjiovani/issue/SAN-245) |
| Schedule-viewing modal | overlay | [SAN-262 — SCREEN-008 Schedule Viewing Modal (HITL Lead)](https://linear.app/sanjiovani/issue/SAN-262) |
| Mobile responsive shell | mobile | [SAN-489 — SCREEN-018 Mobile Responsive 3-Panel Shell](https://linear.app/sanjiovani/issue/SAN-489) |
| Partner signup wizard | `/partners/signup` | [SAN-723 — MKT Partner signup wizard (/partners/signup)](https://linear.app/sanjiovani/issue/SAN-723) |
| Login / signup | `/login` `/signup` | [SAN-112 — UX-012 Login and signup polish](https://linear.app/sanjiovani/issue/SAN-112) (polish pending) |

## 🟡 MVP screens in flight

| Screen | Route | Gap | Task |
|---|---|---|---|
| Rental browse | `/rentals` | Catalog build (redirects to /chat today) | [SAN-478 — REAL-011 Rental browse page](https://linear.app/sanjiovani/issue/SAN-478) In Progress |
| Booking checkout | overlay | Stripe **webhook finalize** missing | [SAN-248 — SCREEN-009 Booking Checkout Modal + Stripe](https://linear.app/sanjiovani/issue/SAN-248) / `/api/tickets/webhook` |
| Workflow progress strip | `/` | In review | [SAN-263 — SCREEN-004 Workflow Progress Strip](https://linear.app/sanjiovani/issue/SAN-263) |
| Partner hub | `/partners` | Current branch ([SAN-692 — MKT Partner hub (/partners)](https://linear.app/sanjiovani/issue/SAN-692)) | [SAN-692 — MKT Partner hub (/partners)](https://linear.app/sanjiovani/issue/SAN-692) |

## ❌ MVP screens / blockers missing

| Blocker | Route | Why it blocks launch | Priority |
|---|---|---|:--:|
| **Stripe webhook finalize** | `/api/tickets/webhook` | Andrés can't get a *confirmed paid* ticket without it — north-star blocker | **P0** |
| **Rental detail page** | `/rentals/[id]` | Camila's rental cards link nowhere | P1 |
| **Lead-submitted confirmation** | overlay | Closes Camila's schedule-viewing loop | P1 |
| **Legal pages** | `/legal/privacy`, `/legal/terms` | Compliance gate for public launch | P1 |
| **Partner hub design** | `/partners` | Roberto/venue acquisition funnel; no wireframe | P1 |

**MVP verdict:** Consumer concierge + ticketing UI is **launch-ready except the Stripe webhook finalize (P0)** and rental detail (P1). Everything Partners/Admin/B2B is correctly POST-MVP.

---

# Final Scorecard

> Coverage = (designed + built, weighted) across the area's known surfaces. Grades reflect MVP-relevance: consumer/chat are near-complete; supply-side marketing/admin are intentionally early.

| Area | Coverage % | Grade | Notes |
|---|:--:|:--:|---|
| **Marketing** | ~10% | **F** | 22 pages: 1 live + 3 shells; rest undesigned (blocked on [SAN-674 — PTR Partner UX pack (wireframes + SVGs)](https://linear.app/sanjiovani/issue/SAN-674)) |
| **Partners** | ~15% | **F** | Signup wizard + activate API done; 3 landing shells; hub + dashboard undesigned |
| **Events** | ~60% | **C+** | Consumer (detail/wizard/tickets/cards) ✅; B2B venue-booking UI (12 issues) 0 built |
| **Venues** | ~65% | **B−** | 3 browse + cards + 2 panels live; booking sheets partial; coffee tours 0 |
| **Trips** | ~25% | **D** | Dashboard + workspace shells only; map/ideas/bookings tabs stub; saved rebuild pending |
| **Real Estate** | ~45% | **C−** | Cards + schedule modal live; `/rentals` in progress; detail + broker missing |
| **Admin** | ~3% | **F** | 8 pages, 0 built, 0 wireframes; all POST |
| **Chat** | ~88% | **A−** | Chrome/nav/query/cards/panels done; AI band + map workspace pending build |
| **Mobile** | ~20% | **D** | Responsive shell ✅; 9 backlog tracks (chat/cards/map/checkout/PWA/perf/a11y) |
| **Dashboards** | ~30% | **D+** | Host events ✅; partner dashboard designed-not-built; vendor + admin 0 |
| **Overall** | **~43%** | **C−** | Consumer MVP core strong; supply/marketing/admin/mobile are the long tail |

---

# Appendix — Source cross-reference

- **D-track (design system + re-skin):** `tasks/design/index-design.md` — D-01…D-14, epic [SAN-566 — Design Track — light-luxury re-skin (D-01–D-14)](https://linear.app/sanjiovani/issue/SAN-566), 8/14 spec-done, D-09/D-13 unblocked 2026-06-06.
- **Flagship wireframes (HTML):** `tasks/design/wireframe/{home,explore,dashboard,map-workspace,rentals-browse,venues,host,partner-signup}-wireframe.html`.
- **Partner wireframes:** `tasks/partners/wireframes/{partner-signup,partners-rentals,sponsors,business-ai}-wireframe.html` (per `website-pages.md`).
- **Legacy ASCII specs:** `tasks/design/wireframes/screens/*` (001–025) — superseded by D-track but still spec-of-record for chat chrome, auth, loading/empty/error (SCREEN-019), a11y (SCREEN-020).
- **Partner program:** Linear **Partners** project ([SAN-660 — MKT For Event Hosts landing (/host)](https://linear.app/sanjiovani/issue/SAN-660)…726) + `tasks/partners/{03-landing-pages,06-dashboards,13-roadmap}.md` — separate track from D-01…D-14.
- **B2B event-venue booking:** Linear **Events Platform** EVT-033…055 ([SAN-492 — EVT-033 Event venue + offerings schema](https://linear.app/sanjiovani/issue/SAN-492)…514) — distinct from consumer event flow.
- **Coffee tours:** Linear **Venues** VEN-001…012 + **Trips** TRP-001…008 — whole vertical unbuilt.
- **Route status of record:** `sitemap.md` (53 routes). **Design system of record:** `DESIGN.MD`.
- **Companion doc:** `tasks/design/website-pages.md` — narrower partner-website implementation status (kept; not superseded).

> **Maintenance:** when a route flips status in `sitemap.md` or a Linear issue changes state, update the matching row here. This doc is the canonical UI/UX inventory; keep it in sync at each design-track milestone.

---

# Linear task links

> Workspace: `linear.app/sanjiovani` (team SAN). Click any ID. Non-SAN IDs (`ECOM-*`, `CW-1`, `ECOM-M-004`) have **no Linear issue yet** — see *Missing Tasks*.

[SAN-111 — UX-011 Map exploration panel](https://linear.app/sanjiovani/issue/SAN-111) · [SAN-112 — UX-012 Login and signup polish](https://linear.app/sanjiovani/issue/SAN-112) · [SAN-114 — CAF-001 Café discovery cards](https://linear.app/sanjiovani/issue/SAN-114) · [SAN-117 — EVT-013 Event cards in AI chat](https://linear.app/sanjiovani/issue/SAN-117) · [SAN-118 — EVT-014 Host events list page](https://linear.app/sanjiovani/issue/SAN-118) · [SAN-135 — EVT-017 Luma-style event detail](https://linear.app/sanjiovani/issue/SAN-135) · [SAN-165 — VEN-008 CoffeeTourCard render](https://linear.app/sanjiovani/issue/SAN-165) · [SAN-173 — TRP-005 CoffeeTourCompareDrawer](https://linear.app/sanjiovani/issue/SAN-173)  
[SAN-174 — TRP-006 Coffee tour intent chips](https://linear.app/sanjiovani/issue/SAN-174) · [SAN-175 — VEN-012 /tours/[slug] detail page](https://linear.app/sanjiovani/issue/SAN-175) · [SAN-232 — SCREEN-001 Home Chat Chrome](https://linear.app/sanjiovani/issue/SAN-232) · [SAN-234 — SCREEN-003 Chat Query Bar + Filter Chips](https://linear.app/sanjiovani/issue/SAN-234) · [SAN-236 — SCREEN-006 Event Card In-Thread Polish](https://linear.app/sanjiovani/issue/SAN-236) · [SAN-237 — SCREEN-014 Event Detail Page](https://linear.app/sanjiovani/issue/SAN-237) · [SAN-240 — SCREEN-016 Host Event Wizard UI](https://linear.app/sanjiovani/issue/SAN-240) · [SAN-242 — SCREEN-005 Rental Card Polish + CTAs](https://linear.app/sanjiovani/issue/SAN-242)  
[SAN-245 — SCREEN-007 Venue/Listing Detail Sheet](https://linear.app/sanjiovani/issue/SAN-245) · [SAN-247 — WIRE-008 Map Exploration Panel](https://linear.app/sanjiovani/issue/SAN-247) · [SAN-248 — SCREEN-009 Booking Checkout Modal + Stripe](https://linear.app/sanjiovani/issue/SAN-248) · [SAN-251 — SCREEN-013 Itinerary Panel](https://linear.app/sanjiovani/issue/SAN-251) · [SAN-253 — SCREEN-011 Saved Collections Page](https://linear.app/sanjiovani/issue/SAN-253) · [SAN-255 — SCREEN-012 Trips Dashboard](https://linear.app/sanjiovani/issue/SAN-255) · [SAN-259 — SCREEN-015 My Tickets + QR](https://linear.app/sanjiovani/issue/SAN-259) · [SAN-262 — SCREEN-008 Schedule Viewing Modal (HITL Lead)](https://linear.app/sanjiovani/issue/SAN-262)  
[SAN-263 — SCREEN-004 Workflow Progress Strip](https://linear.app/sanjiovani/issue/SAN-263) · [SAN-269 — WIRE-023 Onboarding Wizard](https://linear.app/sanjiovani/issue/SAN-269) · [SAN-271 — WIRE-025 Notifications](https://linear.app/sanjiovani/issue/SAN-271) · [SAN-274 — TRP-010 Trips dashboard polish](https://linear.app/sanjiovani/issue/SAN-274) · [SAN-275 — TRP-011 Create trip modal](https://linear.app/sanjiovani/issue/SAN-275) · [SAN-276 — TRP-012 Trip workspace shell](https://linear.app/sanjiovani/issue/SAN-276) · [SAN-278 — TRP-014 Saved collections page](https://linear.app/sanjiovani/issue/SAN-278) · [SAN-279 — TRP-015 Add-to-trip from cards](https://linear.app/sanjiovani/issue/SAN-279)  
[SAN-292 — VEN-013 RestaurantResultCard](https://linear.app/sanjiovani/issue/SAN-292) · [SAN-293 — VEN-014 RestaurantDetailPanel](https://linear.app/sanjiovani/issue/SAN-293) · [SAN-296 — VEN-017 NightlifeDetailPanel + mobile sheet](https://linear.app/sanjiovani/issue/SAN-296) · [SAN-300 — VEN-021 VenueBookingSheet component](https://linear.app/sanjiovani/issue/SAN-300) · [SAN-304 — VEN-025 VenueBookingSheet + DB persist](https://linear.app/sanjiovani/issue/SAN-304) · [SAN-311 — VEN-032 Admin booking queue](https://linear.app/sanjiovani/issue/SAN-311) · [SAN-360 — AIA-011 Extract shared result card shell](https://linear.app/sanjiovani/issue/SAN-360) · [SAN-363 — VEN-002 Rich attraction result cards](https://linear.app/sanjiovani/issue/SAN-363)  
[SAN-437 — UX-023 Extract ResultCardShell](https://linear.app/sanjiovani/issue/SAN-437) · [SAN-439 — UX-025 RestaurantCard rich](https://linear.app/sanjiovani/issue/SAN-439) · [SAN-442 — UX-026 AttractionCard rich](https://linear.app/sanjiovani/issue/SAN-442) · [SAN-478 — REAL-011 Rental browse page](https://linear.app/sanjiovani/issue/SAN-478) · [SAN-479 — REAL-012 Rental detail page](https://linear.app/sanjiovani/issue/SAN-479) · [SAN-488 — SCREEN-002 Chat Nav Rail + Thread List](https://linear.app/sanjiovani/issue/SAN-488) · [SAN-489 — SCREEN-018 Mobile Responsive 3-Panel Shell](https://linear.app/sanjiovani/issue/SAN-489) · [SAN-490 — SCREEN-023 Restaurant Listings Page](https://linear.app/sanjiovani/issue/SAN-490)  
[SAN-491 — SCREEN-022 Nightlife Listings + Map](https://linear.app/sanjiovani/issue/SAN-491) · [SAN-492 — EVT-033 Event venue + offerings schema](https://linear.app/sanjiovani/issue/SAN-492) · [SAN-495 — EVT-036 Event offerings detail panel](https://linear.app/sanjiovani/issue/SAN-495) · [SAN-496 — EVT-037 Request proposal modal (HITL)](https://linear.app/sanjiovani/issue/SAN-496) · [SAN-498 — EVT-039 AI venue match score panel](https://linear.app/sanjiovani/issue/SAN-498) · [SAN-499 — EVT-040 Compare venues side-by-side](https://linear.app/sanjiovani/issue/SAN-499) · [SAN-500 — EVT-041 Host wizard venue step](https://linear.app/sanjiovani/issue/SAN-500) · [SAN-502 — EVT-043 Patricia admin queue (event requests)](https://linear.app/sanjiovani/issue/SAN-502)  
[SAN-510 — EVT-051 Wire: Event offerings panel](https://linear.app/sanjiovani/issue/SAN-510) · [SAN-511 — EVT-052 Wire: Request proposal modal](https://linear.app/sanjiovani/issue/SAN-511) · [SAN-512 — EVT-053 Wire: Venue match panel + compare](https://linear.app/sanjiovani/issue/SAN-512) · [SAN-513 — EVT-054 Wire: Host wizard venue step](https://linear.app/sanjiovani/issue/SAN-513) · [SAN-514 — EVT-055 Wire: Admin event booking queue](https://linear.app/sanjiovani/issue/SAN-514) · [SAN-515 — SCREEN-024 Admin Events dashboard](https://linear.app/sanjiovani/issue/SAN-515) · [SAN-516 — SCREEN-025 Admin Leads / CRM](https://linear.app/sanjiovani/issue/SAN-516) · [SAN-517 — SCREEN-026 User profile / account](https://linear.app/sanjiovani/issue/SAN-517)  
[SAN-518 — SCREEN-027 Events browse listing](https://linear.app/sanjiovani/issue/SAN-518) · [SAN-519 — SCREEN-028 Cafes browse listing](https://linear.app/sanjiovani/issue/SAN-519) · [SAN-522 — MOB-CHAT-001 Mobile chat composer](https://linear.app/sanjiovani/issue/SAN-522) · [SAN-523 — AIM-010 Mobile AI concierge UX](https://linear.app/sanjiovani/issue/SAN-523) · [SAN-524 — MAP-011-M Mobile map interaction](https://linear.app/sanjiovani/issue/SAN-524) · [SAN-525 — MOB-CARD-001 Mobile card system](https://linear.app/sanjiovani/issue/SAN-525) · [SAN-526 — PAY-005 Mobile checkout UX](https://linear.app/sanjiovani/issue/SAN-526) · [SAN-527 — AUTH-006 Mobile auth stability](https://linear.app/sanjiovani/issue/SAN-527)  
[SAN-528 — PERF-001 Mobile performance](https://linear.app/sanjiovani/issue/SAN-528) · [SAN-529 — PWA-001 Mobile install experience](https://linear.app/sanjiovani/issue/SAN-529) · [SAN-530 — A11Y-001 Mobile accessibility audit](https://linear.app/sanjiovani/issue/SAN-530) · [SAN-536 — CTEST-004 Contest workspace + approval cards](https://linear.app/sanjiovani/issue/SAN-536) · [SAN-538 — CTEST-006 Contest screens/routes/wireframes](https://linear.app/sanjiovani/issue/SAN-538) · [SAN-541 — CTEST-009 Contestant profile editor](https://linear.app/sanjiovani/issue/SAN-541) · [SAN-542 — CTEST-010 Public contestant voting page](https://linear.app/sanjiovani/issue/SAN-542) · [SAN-558 — CAF Cafés page → live](https://linear.app/sanjiovani/issue/SAN-558)  
[SAN-566 — Design Track — light-luxury re-skin (D-01–D-14)](https://linear.app/sanjiovani/issue/SAN-566) · [SAN-574 — D-08 Shared browse system](https://linear.app/sanjiovani/issue/SAN-574) · [SAN-575 — D-09 Re-skin discovery surfaces](https://linear.app/sanjiovani/issue/SAN-575) · [SAN-577 — D-11 Map workspace (pins↔cards)](https://linear.app/sanjiovani/issue/SAN-577) · [SAN-578 — D-12 Concierge surface (grounded AI band)](https://linear.app/sanjiovani/issue/SAN-578) · [SAN-579 — D-13 Re-skin Home (/)](https://linear.app/sanjiovani/issue/SAN-579) · [SAN-584 — SCR-002b Explore sidebar enable nav](https://linear.app/sanjiovani/issue/SAN-584) · [SAN-585 — SPEC-027 Author events browse scr+wire](https://linear.app/sanjiovani/issue/SAN-585)  
[SAN-587 — D-09b Re-skin /events browse](https://linear.app/sanjiovani/issue/SAN-587) · [SAN-660 — MKT For Event Hosts landing (/host)](https://linear.app/sanjiovani/issue/SAN-660) · [SAN-661 — MKT For Venues landing (/venues)](https://linear.app/sanjiovani/issue/SAN-661) · [SAN-662 — MKT About page (/about)](https://linear.app/sanjiovani/issue/SAN-662) · [SAN-663 — MKT AI Services for companies (/business/ai)](https://linear.app/sanjiovani/issue/SAN-663) · [SAN-664 — MKT Sponsors / Sponsorship (/sponsors)](https://linear.app/sanjiovani/issue/SAN-664) · [SAN-665 — PTR POST /api/partners/activate](https://linear.app/sanjiovani/issue/SAN-665) · [SAN-666 — MKT Partner dashboard (/dashboard) [canceled dup]](https://linear.app/sanjiovani/issue/SAN-666)  
[SAN-674 — PTR Partner UX pack (wireframes + SVGs)](https://linear.app/sanjiovani/issue/SAN-674) · [SAN-690 — MKT Partner dashboard (/dashboard)](https://linear.app/sanjiovani/issue/SAN-690) · [SAN-691 — MKT For Rentals / Brokers landing (/partners/rentals)](https://linear.app/sanjiovani/issue/SAN-691) · [SAN-692 — MKT Partner hub (/partners)](https://linear.app/sanjiovani/issue/SAN-692) · [SAN-693 — MKT Contact / Book a demo (/contact)](https://linear.app/sanjiovani/issue/SAN-693) · [SAN-694 — MKT Contests / Giveaways hub (/contests)](https://linear.app/sanjiovani/issue/SAN-694) · [SAN-695 — MKT Partner pricing (/pricing)](https://linear.app/sanjiovani/issue/SAN-695) · [SAN-696 — MKT Creator program landing (/partners/creator)](https://linear.app/sanjiovani/issue/SAN-696)  
[SAN-697 — MKT Postiz social services (/business/social)](https://linear.app/sanjiovani/issue/SAN-697) · [SAN-701 — MKT Event marketing (/business/event-marketing)](https://linear.app/sanjiovani/issue/SAN-701) · [SAN-702 — MKT Marketplace vendor landing (/partners/vendor)](https://linear.app/sanjiovani/issue/SAN-702) · [SAN-703 — MKT Venue features deep-dive (/venues/features)](https://linear.app/sanjiovani/issue/SAN-703) · [SAN-712 — MKT For Nightlife landing (/partners/nightlife)](https://linear.app/sanjiovani/issue/SAN-712) · [SAN-713 — MKT For Restaurants landing (/partners/restaurants)](https://linear.app/sanjiovani/issue/SAN-713) · [SAN-714 — MKT For Cafés landing (/partners/cafes)](https://linear.app/sanjiovani/issue/SAN-714) · [SAN-715 — FE Checkout states (decline/3DS/wallet/empty)](https://linear.app/sanjiovani/issue/SAN-715)  
[SAN-716 — FE "Lead submitted" confirmation state](https://linear.app/sanjiovani/issue/SAN-716) · [SAN-723 — MKT Partner signup wizard (/partners/signup)](https://linear.app/sanjiovani/issue/SAN-723) · [SAN-726 — MKT mdeai for Business hub (/business)](https://linear.app/sanjiovani/issue/SAN-726)
