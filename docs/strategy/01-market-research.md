# Chunk 01 — Market Research

> Goal: know exactly how each incumbent makes money, where they're soft, and the precise wedge MDE attacks. Use for positioning decks, fundraising, and pricing justification.

## 1.1 Master competitor matrix

| Competitor | Primary model | Take rate / commission | Subscription / ads | Lead-gen angle | Strength | Weakness | MDE exploit |
|---|---|---|---|---|---|---|---|
| **Yelp** | Ads + lead-gen | CPC (no commission) | $0–$1k+/mo ad spend | "Request a quote" leads sold per-click | Review SEO corpus | Spammy, weak LATAM | One AI answer vs 10 listings; Medellín-native |
| **Eventbrite** | Ticketing | ~3.7% + $1.79/tkt + ~2.9% pay | Eventbrite Ads, Pro | Self-serve organizers | Organizer tooling | High all-in fee, generic discovery | Lower fee + AI promotion bundle |
| **Airbnb Experiences** | Host commission | ~20% | — | Curated onboarding | Brand trust | Thin local depth, on/off strategy | Local curation + WhatsApp booking |
| **GetYourGuide** | OTA commission | ~20–30% | Supplier tools | SEO + paid | Activities inventory | Commodity, price-led | Originate supply locally, lower take |
| **Viator (Tripadvisor)** | OTA commission | ~25% typical | — | Tripadvisor funnel | Huge catalog | Squeezes operators | Direct operator deals, lower take |
| **Fever** | Ticketing + own IP | ~20–30% + Originals margin | Sponsorships | Performance marketing | Owns demand + IP | Capital-heavy | Asset-light "Fever Originals" locally |
| **OpenTable** | SaaS + cover fees | ~$1/seated cover | $149–$449/mo | Diner network | CRM lock-in | Pricey for SMBs, weak LATAM | WhatsApp reservations cheaply |
| **Tripadvisor** | Ads + Viator comm. | Hotel meta CPC; ~25% via Viator | $30–$70/mo | Review intent | Brand + reviews | Declining engagement | AI planning vs static reviews |
| **Google Maps** | Ads | CPC, hotel/flight meta | Free listings | Local intent | Default surface | Generic, not transactional | Be the transaction layer on top |
| **Airbnb** | Guest + host fees | ~15%+ effective | — | SEO + brand | Global liquidity | Generic, regulatory | Concierge + mid-term + experiences bundle |
| **Booking.com** | Hotel commission | ~15% (up to 18–25% w/ boosters) | Booster programs | Paid + SEO | Largest inventory | Commoditized, hotel resentment | Bundle hotel + experiences + transfers |
| **Local DMCs / tourism sites** | Tour resale | ~15–30% margin | Few | Hotel desks, WOM | Local knowledge | No tech, fragmented | Aggregate + give them tech & demand |
| **Fashion marketplaces** | Marketplace comm. | ~10–30% GMV | Seller fees | Influencer + content | Brand discovery | Low margin, logistics | Discovery + ticketing, not logistics |
| **Local event apps** | Ads + ticketing | <5% effective | Promo placements | Social/organic | Niche communities | Thin monetization | Monetize via AI promo, not just tickets |

## 1.2 Four monetization archetypes (and what MDE borrows from each)

| Archetype | Examples | How they win | Take/price | MDE borrows |
|---|---|---|---|---|
| **Demand aggregator (OTA)** | Viator, GYG, Booking | SEO + paid demand liquidity | 15–30% | Lower take + local supply loyalty |
| **Operator SaaS** | OpenTable | Workflow lock-in | $150–$450/mo | WhatsApp-native, SMB-priced |
| **Attention/ads** | Yelp, Maps, Tripadvisor | Capture local intent | CPC | AI answer that *books* |
| **Ticketing + IP** | Eventbrite, Fever | Self-serve + owned events | 5–30% | AI promo bundle, asset-light originals |

**Synthesis:** no Medellín player combines *operator workflow (AI marketing/automation)* with *demand origination (concierge)*. That hybrid is MDE's wedge.

## 1.3 Take-rate benchmark ladder (where MDE prices)

```
Hotels (Booking)        ████████████████  ~15–25%
Tours (Viator/GYG)      ████████████████████████  ~20–30%
Experiences (Airbnb)    ████████████████  ~20%
  └─ MDE tours/exp      ████████████  15–20%   ← undercut, win operators
Nightlife VIP (MDE)     ████████  10–15%
Tickets (Eventbrite)    ████████  ~10% all-in
  └─ MDE tickets        ████  5% + $0.40     ← buyer-paid, organizer keeps face price
```

## 1.4 SWOT → exploit map

| Cluster | Strength | Weakness | **MDE play** |
|---|---|---|---|
| Global OTAs | Liquidity, trust, conversion | High fees, English-first, no WhatsApp, no local relationship | Lower take + Spanish-first WhatsApp concierge + operator loyalty |
| Reservation SaaS | Stickiness | Price, hardware, weak LATAM support | WhatsApp reservations at SMB price |
| Discovery/ads | Reach, default behavior | Not transactional, not personalized | AI itinerary that books, not just lists |
| Local players | Ground truth, trust | No tech, no scale, no AI | Be their tech + demand layer (white-label AI) |

## 1.5 Medellín market context (why local depth wins)

| Factor | Implication for MDE |
|---|---|
| WhatsApp is the default comms channel in Colombia | WhatsApp-native concierge/automation = table stakes locally, moat vs global OTAs |
| Digital-nomad/expat surge (El Poblado, Laureles, Envigado) | USD-paying demand for mid-term rentals + experiences |
| Strong "things to do" intent (Comuna 13, Guatapé, coffee region) | High-margin experience commissions |
| Colombiamoda / fashion identity | PR + credibility flywheel |
| Fragmented, low-tech local supply | Easy to aggregate; AI tooling is a genuine leap, not an increment |
| Spanish-first expectation | Structural edge over English-first incumbents |

## 1.6 What to validate before quoting these numbers publicly

- [ ] Actual Eventbrite/Fever effective fees in COP for a sample local event.
- [ ] Real operator margins for 5 Medellín tour operators (what take leaves them whole).
- [ ] OpenTable/Resy presence and pricing in Medellín (often near-zero → green field).
- [ ] Booking/Airbnb effective take on a sample El Poblado stay.
- [ ] Local ad CPMs/CPCs for restaurants/nightlife (sets featured-listing price ceiling).

> **Output of this chunk:** a one-page positioning statement — "MDE is the AI marketing + booking layer for Medellín hospitality, undercutting OTA take-rates while giving operators tooling no incumbent offers locally."
