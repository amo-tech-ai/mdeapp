---
title: Website pages — marketing + dashboards implementation status
updated: 2026-06-08
scope: All marketing / landing / dashboard surfaces (partners · venues · rentals · events · business) mapped to wireframes, Linear, and live routes
canonical_inventory: ./DESIGN-INVENTORY.md
---

# Website pages — marketing & dashboards

Status of every **marketing / landing page** and **dashboard** across the partner ecosystem and the four supply verticals (partners · venues · rentals · events). Consumer concierge pages (`/`, `/chat`, browse, detail) live in [`DESIGN-INVENTORY.md`](./DESIGN-INVENTORY.md) §A.

**Status legend:** **Live** = shipped to prod · **Shell** = placeholder route on disk · **Wireframe** = HTML/MD wire exists, not built · **Spec** = doc only · **Todo/Backlog** = Linear only.

---

## 1. Partner hub & onboarding

| Route | Linear | Status | Wireframe | Implementation |
|---|---|---|---|---|
| `/partners` | [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) | **Todo** | — (hub; uses partner-type cards) | Partner hub landing — entry funnel to all partner types |
| `/partners/signup` | [SAN-665](https://linear.app/sanjiovani/issue/SAN-665) / [SAN-723](https://linear.app/sanjiovani/issue/SAN-723) | **Live (MVP)** | `partner-signup-wireframe.html` | `PartnerSignupTypePicker` + `PartnerSignupWizard` |
| `/partners/signup?type=*` | [SAN-723](https://linear.app/sanjiovani/issue/SAN-723) | **Live (MVP)** | wireframe views ②–④ | Auth gate · step-1 form · success |
| `/business` | [SAN-726](https://linear.app/sanjiovani/issue/SAN-726) | Backlog | — | "mdeai for Business" hub — partner-type cards overview |
| `/contact` | [SAN-693](https://linear.app/sanjiovani/issue/SAN-693) | **Todo** | — | Contact / book a demo |
| `/pricing` | [SAN-695](https://linear.app/sanjiovani/issue/SAN-695) | Backlog | — | Partner pricing tiers |
| `/about` | [SAN-662](https://linear.app/sanjiovani/issue/SAN-662) | **Todo** | `about-wireframe.html` | About mdeai (wire exists) |

## 2. Venues marketing (restaurants · cafés · nightlife · venue spaces)

| Route | Linear | Status | Wireframe | Implementation |
|---|---|---|---|---|
| `/venues` | [SAN-661](https://linear.app/sanjiovani/issue/SAN-661) | **Todo** | `venues-wireframe.html` | For Venues landing (restaurant/café/nightclub variants via `?v=`) |
| `/venues/features` | [SAN-703](https://linear.app/sanjiovani/issue/SAN-703) | Backlog | — | Venue features deep-dive |
| `/partners/restaurants` | [SAN-713](https://linear.app/sanjiovani/issue/SAN-713) | **Todo** | `wireframes/pages/restaurants.md` | For Restaurants landing |
| `/partners/cafes` | [SAN-714](https://linear.app/sanjiovani/issue/SAN-714) | **Todo** | `wireframes/pages/cafes.md` | For Cafés landing |
| `/partners/nightlife` | [SAN-712](https://linear.app/sanjiovani/issue/SAN-712) | **Todo** | `wireframes/pages/nightlife.md` | For Nightlife landing |

## 3. Rentals / real-estate marketing

| Route | Linear | Status | Wireframe | Implementation |
|---|---|---|---|---|
| `/partners/rentals` | [SAN-691](https://linear.app/sanjiovani/issue/SAN-691) | **Shell** | `partners-rentals-wireframe.html` | For Rentals / Brokers landing — placeholder |

## 4. Events marketing (hosts · sponsors · event marketing)

| Route | Linear | Status | Wireframe | Implementation |
|---|---|---|---|---|
| `/host` | [SAN-660](https://linear.app/sanjiovani/issue/SAN-660) | **Todo** | `host-wireframe.html` | For Event Hosts landing |
| `/sponsors` | [SAN-664](https://linear.app/sanjiovani/issue/SAN-664) | **Shell** | `sponsors-wireframe.html` | Sponsors / sponsorship landing — placeholder |
| `/business/event-marketing` | [SAN-701](https://linear.app/sanjiovani/issue/SAN-701) | Backlog | — | Event marketing services (agency) |
| `/contests` | [SAN-694](https://linear.app/sanjiovani/issue/SAN-694) | Backlog | — | Contests / giveaways hub |

## 5. Business / agency / creator / vendor marketing

| Route | Linear | Status | Wireframe | Implementation |
|---|---|---|---|---|
| `/business/ai` | [SAN-663](https://linear.app/sanjiovani/issue/SAN-663) | **Shell** | `business-ai-wireframe.html` | AI services for companies — placeholder |
| `/business/social` | [SAN-697](https://linear.app/sanjiovani/issue/SAN-697) | Backlog | — | Postiz social services |
| `/partners/creator` | [SAN-696](https://linear.app/sanjiovani/issue/SAN-696) | Backlog | — | Influencer / creator program landing |
| `/partners/vendor` | [SAN-702](https://linear.app/sanjiovani/issue/SAN-702) | Backlog | — | Marketplace vendor landing |

## 6. Dashboards

> **One role-aware partner dashboard** (`/dashboard`, [SAN-690](https://linear.app/sanjiovani/issue/SAN-690)) — tabs render per enabled service. Spec: [`tasks/partners/06-dashboards.md`](../partners/06-dashboards.md). Built on shadcn `sidebar` + `tabs`; the signup co-pilot continues here.

| Route | Linear | Status | Wireframe | Implementation |
|---|---|---|---|---|
| `/dashboard` | [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) | **Todo** | `06-dashboards.md` (module specs) | Role-aware partner dashboard shell |
| `/host/events` | [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) | **Live** | `EVP-014-wire-host-events-list.md` | Roberto's host events dashboard ✅ |
| `/vendors/dashboard` | ECOM-M-004 | Spec | — | Marketplace vendor admin (catalog/orders/analytics) |
| `/admin/leads` | [SAN-516](https://linear.app/sanjiovani/issue/SAN-516) | Backlog | — | Patricia leads CRM |
| `/admin/events` | [SAN-515](https://linear.app/sanjiovani/issue/SAN-515) | Backlog | — | Event moderation queue |
| `/admin/bookings` | [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) / [SAN-502](https://linear.app/sanjiovani/issue/SAN-502) | Backlog | — | Venue + event booking approval queue |

### `/dashboard` — modules (tabs, render per partner type)

| Module | Restaurant | Café | Nightclub | Host | Broker | Sponsor | Vendor |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Overview (KPIs, completion, next actions) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Leads (table → HITL reply) | ✅ | ◑ | ✅ | ◑ | ✅ | ✅ | ✅ |
| Bookings (calendar + Stripe status) | ✅ | ◑ | ✅ | ✅ | — | — | ✅ |
| Revenue (gross/net/fees, payouts) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Campaigns (Postiz scheduler) | ✅ | ✅ | ✅ | ✅ | ◑ | ✅ | ✅ |
| AI Assistant (co-pilot pane) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Automations (HITL on money actions) | ✅ | ✅ | ✅ | ✅ | ✅ | ◑ | ✅ |
| Analytics (funnel + heatmaps) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reviews (inbox + AI-drafted replies) | ✅ | ✅ | ✅ | ◑ | ◑ | — | ✅ |
| Marketplace | — | — | — | — | — | — | ✅ |
| Opportunities (AI-suggested) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

✅ default · ◑ optional/limited · — hidden

---

## `/partners/signup` — shipped slices

| View | Component | shadcn |
|---|---|---|
| Type picker landing | `partner-signup-type-picker.tsx` | `card` `badge` `separator` `accordion` `button` |
| Nav shell | `partner-signup-nav.tsx` | `button` + `Link` (`nativeButton={false}`) |
| Auth gate | `partner-signup-wizard.tsx` | `card` `badge` `button` |
| Activate form | same | `card` `input` `label` `button` |
| Success | same | `card` `badge` |

**Phase 2 (not started):** 6-step stepper, CopilotKit co-pilot, photos/location — see `tasks/partners/audit/05-signup-wizard.md`.

---

## Coverage snapshot

| Group | Pages | Live | Shell | Wireframe-only | Todo/Backlog (no wire) |
|---|:--:|:--:|:--:|:--:|:--:|
| Partner hub & onboarding | 7 | 1 | 0 | 1 (about) | 5 |
| Venues marketing | 5 | 0 | 0 | 4 | 1 |
| Rentals marketing | 1 | 0 | 1 | 0 | 0 |
| Events marketing | 4 | 0 | 1 | 1 (host) | 2 |
| Business/agency/creator/vendor | 4 | 0 | 1 | 1 (business-ai) | 2 |
| Dashboards | 6 | 1 | 0 | 0 (specs only) | 5 |
| **Total** | **27** | **2** | **3** | **11** | **15** |

**Build priority (P1 marketing, pre-launch funnel):** `/partners` hub → `/host` → `/venues` → `/partners/rentals` → `/sponsors` → `/business/ai` → `/about` + `/contact`. Wireframes for restaurants/cafes/nightlife already drafted (`wireframes/pages/*.md`); hub + dashboard need wireframes (bundled in [SAN-674](https://linear.app/sanjiovani/issue/SAN-674) Partner UX pack).

**Verify locally:** `http://localhost:3001/partners/signup` · `?type=host`
