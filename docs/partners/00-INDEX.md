---
title: "MDEAI Partner Ecosystem — Master Plan Index"
updated: 2026-06-06
owner: sanjiovani
status: blueprint — feeds Linear PTR epic
process: follows tasks/design/docs/design-process.md (Journey → IA → Wireframe → Map → Build), code-first, reuse-first
related:
  - ./1-partners-prompt.md
  - ./partner-journeys.md           # earlier journeys (stakeholders + URL map) — still valid, superset here
  - ../docs/marketing-pages.md      # ranked marketing pages
  - ../wireframe/partner-signup-wireframe.html
  - ../wireframe/venues-wireframe.html
  - ../wireframe/host-wireframe.html
---

# MDEAI Partner Ecosystem — Master Plan

> **One line:** mdeai's demand side (Camila/Andrés/Tourist) is ~built; this blueprint designs the **supply + B2B + marketplace side** — how partners are acquired, onboarded (one AI signup wizard), given dashboards, and monetized — aligned to the current stack (CopilotKit · Mastra · Supabase · Maps) and **without overengineering**.

## Document map

| # | Doc | Part | Has Mermaid |
|---|---|---|:--:|
| 00 | this index + master tables | — | — |
| 1 | [1-partners-prompt.md](./1-partners-prompt.md) | brief | — |
| 02 | [02-stakeholder-audit.md](./02-stakeholder-audit.md) | 1 | — |
| 03 | [03-landing-pages.md](./03-landing-pages.md) | 2 | — |
| 04 | [04-journey-maps.md](./04-journey-maps.md) | 3 | ✅ ×10 |
| 05 | [05-signup-wizard.md](./05-signup-wizard.md) | 4 | ✅ |
| 06 | [06-dashboards.md](./06-dashboards.md) | 5 | ✅ |
| 07 | [07-revenue.md](./07-revenue.md) | 6 | ✅ |
| 08 | [08-ai-services.md](./08-ai-services.md) | 7 | — |
| 09 | [09-marketing-automation.md](./09-marketing-automation.md) | 8 | ✅ |
| 10 | [10-contests-growth.md](./10-contests-growth.md) | 9 | ✅ |
| 11 | [11-marketplace.md](./11-marketplace.md) | 10 | ✅ |
| 12 | [12-concierge-model.md](./12-concierge-model.md) | 11 | ✅ |
| 13 | [13-roadmap.md](./13-roadmap.md) | 12 | ✅ |

## Master table — stakeholders × everything (the one-screen view)

| Stakeholder | Side | Landing | Signup type | Top revenue | AI service | Phase |
|---|---|---|---|---|---|---|
| Tourist / Nomad / Expat / Local | Demand | `/`, guides | `/signup` | (indirect: GMV) | concierge | 1 |
| Event attendee (Andrés) | Demand | `/events` | `/signup` | ticket fee | — | 1 |
| **Event host** (Roberto) | Supply | `/host` | `?type=host` | ticket % + featured | AI event create/price/promo | 1 |
| **Restaurant** | Supply | `/venues` | `?type=venue` | reservation/featured | menu·reviews·promos | 1–2 |
| **Café** | Supply | `/venues` | `?type=venue` | featured/booking | promos·posts | 2 |
| **Nightclub / Bar** | Supply | `/venues` | `?type=venue` | events·featured·table booking | event booking·Postiz | 1–2 |
| **Venue / event space** | Supply | `/venues` | `?type=venue` | booking commission | AI event booking | 2 |
| **Real-estate host / broker** | Supply | `/partners/rentals` | `?type=broker` | lead/booking fee | listing·lead-qual·scheduling | 1–2 |
| Property manager | Supply | `/partners/rentals` | `?type=broker` | subscription | portfolio automation | 2–3 |
| Tour / activity operator | Supply | `/partners` | `?type=partner` | booking commission | itinerary inclusion | 2–3 |
| Coworking / hotel | Supply | `/venues`,`/partners` | `?type=venue` | featured/referral | listing·promos | 2–3 |
| **Sponsor / brand** | B2B | `/sponsors` | `?type=sponsor` | sponsorship $ | sponsorship match·campaign | 2 |
| Agency / company | B2B | `/business/ai` | `?type=agency` | AI services retainer | builds·automation | 2–3 |
| Influencer / creator | B2B | `/partners` (creator) | `?type=partner` | affiliate/commission | guide builder | 3 |
| Marketplace vendor | Supply | `/partners` | `?type=vendor` | product commission + sub | storefront optimize | 3–4 |
| Tourism board | B2B | `/partners` | `?type=partner` | channel deal | co-promo | 3 |
| Admin/Ops/Sales/Success/Mktg | Internal | — | — | (cost center) | ops copilots | 1–4 |

## How it aligns to the design process

Per `design-process.md`: **Journey → IA → Wireframe → component-map → build**, code-first, 70/20/10. The partner work reuses existing surfaces (CopilotKit concierge, Mastra agents, `/broker/*`, Stripe, Maps) — **most of this is configuration + landing pages + one signup wizard, not net-new infra.** Revenue-first guardrail still holds: Track A (consumer North Star) leads; partner ecosystem layers on.

## Linear

Epic **PTR — Partner Ecosystem** + workstream tasks (label `PTR`). Page tasks already exist: SAN-660 `/host` · 661 `/venues` · 663 `/business/ai` · 664 `/sponsors` · 665 `/partners/signup` · 690 `/dashboard`. See [13-roadmap.md](./13-roadmap.md) for sequencing.
