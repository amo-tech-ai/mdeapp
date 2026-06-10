---
title: "Part 2 — Partner Landing Pages + Sitemap"
updated: 2026-06-06
parent: ./00-INDEX.md
related: ../docs/marketing-pages.md
---

# Part 2 — Partner Landing Pages

All landings share the **Mindtrip B2B shell** (`venues-wireframe.html`): hero + dual CTA → value → feature/services grid → how-it-works → dark trust band → pricing teaser → demo form → footer. Below = per-page deltas. Full ranked list + grades: `../docs/marketing-pages.md`.

## Template (applies to every page)
**Secondary CTA** is always "Book a demo" or "Talk to us"; **AI benefits** + **Automation benefits** are their own band; **Conversion flow** = Landing → `/partners/signup?type=…` → AI onboarding → dashboard.

| Page | Route | Goal | Primary CTA | Features (top 3) | Pricing | AI / Automation |
|---|---|---|---|---|---|---|
| Restaurants | `/venues?v=restaurant` | Get listed + reservations | List your restaurant | Listing+map · concierge surfacing · reviews | Free → Growth | AI menu/promos · AI review replies |
| Cafés | `/venues?v=cafe` | Capture nomad demand | List your café | Remote-work tags · listing · posts | Free → Growth | AI posts (Postiz) · promos |
| Nightclubs | `/venues?v=nightclub` | Fill nights + table booking | List your venue | Event publish · table booking · listing | Growth | AI event booking · Postiz |
| Event Hosts | `/host` | Publish + sell tickets | Publish your event | AI form-fill · ticketing · reach | Free + ticket % | AI create/price/promote |
| Sponsors | `/sponsors` | Sell sponsorship | Become a sponsor | Featured events · contests · reach | Packages | AI sponsorship match |
| Real Estate Hosts | `/partners/rentals` | List units, get leads | List your rental | Listing · AI lead replies · scheduling | Lead/sub | AI listing · lead-qual |
| Tour Operators | `/partners?type=tour` | Sell experiences | List experiences | Itinerary inclusion · booking | Commission | AI itinerary placement |
| Influencers | `/partners?type=creator` | Promote + affiliate | Join creator program | Guides · affiliate links · analytics | Rev-share | AI guide builder |
| Agencies | `/business/ai` | Buy AI builds | Book a demo | AI builds · automation · Postiz/OpenClaw | Retainer | full stack |
| Brands | `/business/ai?b=brand` | Campaigns | Talk to us | Campaigns · placements | Custom | AI targeting |
| Vendors | `/partners?type=vendor` | Sell products | Open a storefront | Storefront · commission · payouts | Commission + sub | AI storefront optimize |
| Marketplace Sellers | `/partners?type=vendor` | Sell services | Start selling | Listings · bookings · reviews | Commission | AI listing/optimize |

### Example — fully expanded (Nightclubs)
- **Goal:** fill slow nights + monetize the room (events + tables).
- **Primary CTA:** List your venue · **Secondary:** Book a demo.
- **Features:** publish events (AI wizard) · table/bottle booking · appear in concierge "tonight" + map + nightlife browse.
- **Testimonials:** "Filled a Tuesday with a salsa night in 10 minutes." (placeholder until real).
- **Pricing:** Growth tier — free listing, % on tables/tickets, optional featured.
- **AI benefits:** AI drafts the event, prices tiers, writes the promo. **Automation:** Postiz auto-posts to IG/TikTok; OpenClaw ingests recurring nights.
- **Conversion flow:** `/venues` → `?type=venue` signup → AI onboarding (category=nightclub) → dashboard → first event live.

## Partner marketing sitemap

```
/partners                       hub (all partner types + signup marquee)
├── /host                       event hosts
├── /venues                     venues  (?v=restaurant|cafe|nightclub|bar|space)
│   └── /venues/features
├── /partners/rentals           real-estate hosts / brokers
├── /business/ai                agencies / brands / AI services
│   ├── /business/social        Postiz (social management)
│   └── /business/event-marketing
├── /sponsors                   sponsors / brands
├── /partners/creator           influencers / creators
├── /partners/vendor            marketplace vendors (Phase 3)
├── /partners/signup            ← one typed wizard (all of the above)
├── /pricing                    plans across partner types
└── /contact                    demo / sales
```

Conversion principle: **every landing's CTA funnels to one wizard** (`/partners/signup?type=…`), so we build the form once.
