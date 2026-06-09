---
title: Luma-inspired Event UX Review
updated: 2026-05-27
status: Design/task audit
screenshots: /home/sk/mdeai/screenshots/luma
design_pack: ../design/luma/00-index.md
wireframes: ../design/luma/02-wireframe-prompts.md
diagrams: ../design/luma/03-diagrams.md
live_url: https://luma.com/kge8pkoq
live_url_status: Unverified - web fetch timed out in Codex
related_tasks:
  - ../EVP-013-core-event-card-component.md
  - ../EVP-032-mvp-luma-event-detail-layout.md
  - ../EVP-033-mvp-event-vibe-ai-summary.md
  - ../EVP-034-mvp-ask-host-ai-qa.md
  - ../EVP-035-mvp-attendee-profiles-audience-breakdown.md
  - ../EVP-036-mvp-community-map-nearby.md
  - ../EVP-037-mvp-concierge-event-decision-chat.md
  - ../EVP-042-mvp-smart-recommendations-compatibility.md
  - ../EVP-043-mvp-neighborhood-safety-transit-intelligence.md
  - ../EVP-044-mvp-whatsapp-community-links.md
  - ../EVP-045-mvp-host-pricing-moderation-basics.md
  - ../EVP-046-mvp-live-event-updates.md
  - ../EVP-047-postmvp-ai-night-itinerary-builder.md
---

# Luma-inspired Event UX Review

## Executive Verdict

The current mdeai Events implementation is correctly focused on deterministic foundations: host creation, event cards, ticket checkout, Stripe webhook, wallet, and QR proof. It is not yet emotionally competitive with Luma-style event discovery.

Luma's strongest lesson is not visual polish alone. It makes an event feel like a room full of people before the user arrives:

- recognizable hosts
- attendee visibility
- themed groups
- clear vibe
- social proof
- simple mobile-first CTA
- map/location context
- community continuity

mdeai's opportunity is stronger: keep the Luma simplicity, then add AI concierge, map context, and Medellin-specific networking intelligence.

## Evidence From Current App

| Surface | Current state | Gap |
|---|---|---|
| `/events/[slug]` | Hero image, title, schedule, venue, price, ticket tiers, mobile buy bar | No host, attendees, vibe, AI summary, timeline, Q&A, community, nearby map context |
| Event cards in chat | Image, title, venue, neighborhood, time, price, buy/details/source | No "who should attend", vibe tags, host signal, attendee/social proof, compatibility |
| `/` concierge | 3-panel chat + results + map exists | Event chat is generic discovery, not "Should I go? Who will I meet?" decision support |
| Host wizard | AI-assisted event creation foundation exists | Does not yet produce Luma-quality event detail sections |
| Maps | Shared map components exist | Event page does not yet show neighborhood, nearby places, after-event options, or route context |

## Luma Patterns To Borrow

| Pattern | Why It Works | mdeai Version |
|---|---|---|
| Clean event hero | Mobile users decide fast | Big image, title, vibe tags, host, date, price, register CTA |
| Host personality | Creates trust | Host cards with bio, IG/contact, community role, language |
| Attendee visibility | Reduces uncertainty | Going count, audience breakdown, optional attendee previews |
| "Who you'll meet" | Turns event into opportunity | AI-generated audience groups: founders, creators, investors, marketers |
| "What the night feels like" | Sells the experience | Vibe tags + timeline + rituals + dress/context notes |
| Simple bottom nav | Keeps orientation | mdeai tabs: Discover, Map, Chat/Saved depending surface |
| Location reveal | Makes RSVP feel premium | Public neighborhood first; exact venue after registration when configured |

## Product Direction

Replace "browse events" with "talk to the city."

Example query:

> I want startup networking events with ambitious people this week in Poblado.

mdeai should return:

- event cards
- host personalities
- attendee vibe
- map pins
- nearby restaurants/bars
- WhatsApp/community link if approved
- who should attend
- why it matches the user

## Recommended Event Detail Structure

| Section | MVP Content | Post-MVP Content |
|---|---|---|
| Hero | Image, title, date, price, host, vibe tags, register CTA | Compatibility score |
| AI Summary | "Best for..." and "Why this matters" | Personalized to user profile |
| Who You'll Meet | 3-5 audience groups | Real attendee role breakdown |
| Ask Host | Common Q&A + AI draft answer | Host voice notes, quick replies |
| Timeline | Arrival, networking, talks, social | Live schedule updates |
| Location | Neighborhood, map, weather | Exact location unlock, routes, safety notes |
| Nearby | Cafes, bars, coworking, after-event options | AI after-plan builder |
| Community | Host/community card, recurring group | WhatsApp circles, relationship graph |

## Current Task Gap

| Need | Covered Today? | Existing Task | New Task |
|---|---|---|---|
| Commerce-safe event page | Partially | EVP-002, EVP-013 | EVP-032 |
| Luma-style detail layout | No | EVP-013 | EVP-032 |
| AI "should I go?" event chat | Partially | EVP-004, EVP-005 | EVP-037 |
| Ask Host / AI Q&A | No | none | EVP-034 |
| Attendee breakdown | No | none | EVP-035 |
| Vibe tags + AI summary | No | none | EVP-033 |
| Nearby map intelligence | Partially | EVP-016, MAP tasks | EVP-036 |
| Smart recommendations / compatibility | No | eventAgent search only | EVP-042 |
| Neighborhood, safety, transit, weather | Partially | MAP/Places tasks | EVP-043 |
| WhatsApp/community links | No | none | EVP-044 |
| Pricing suggestions / moderation | No | host wizard only | EVP-045 |
| Live event updates | No | none | EVP-046 |
| Matchmaking / icebreakers | No | none | EVP-038 |
| Live event chat | No | none | EVP-039 |
| Post-event follow-up | No | none | EVP-040 |
| Full night itinerary builder | No | trips shell exists | EVP-047 |
| Community graph | No | none | EVP-041 |

## Wireframe Direction

```text
Mobile event detail

[Hero image]
[Back]                         [Share]

Visionarios Night: Medellin Vol. IV
Parceros Community
Thu, May 28 · 6:30 PM - 9:00 PM
[Ambitious] [Startup-heavy] [International] [Come solo]

[Register] [Ask Host] [Save]

AI summary
"Best for founders, creators, investors, and ambitious nomads
looking for high-quality networking in El Poblado."

Who you'll meet
[32 founders] [12 marketers] [8 AI builders] [5 investors]

Ask Host
Can I come solo?       AI draft: Yes, this is designed for solo attendees.
Is English OK?         AI draft: Likely yes; host confirms.

Timeline
6:30 Welcome drink
7:00 Networking circles
7:45 Founder intros
8:30 Rooftop social

Location
El Poblado, Medellin
[Map]
Nearby: cafe before · rooftop after · safe pickup point

Community
Parceros Community · recurring networking nights

[Sticky Register]
```

## MVP Recommendation

Do not rebuild the entire event system around Luma immediately. Fix the existing event-card blocker first, then add the emotional layer in thin slices:

1. EVP-013: make event cards reliably render and pass E2E.
2. EVP-032: upgrade event detail layout without new AI complexity.
3. EVP-033: add vibe tags and AI summary fields.
4. EVP-034: add Ask Host with AI draft answers but no autonomous send.
5. EVP-035: add attendee/social proof.
6. EVP-036/037: connect map + concierge decision support.
7. EVP-042-046: add recommendations, neighborhood/transit/safety, community links, pricing/moderation, and live updates.
8. EVP-047: turn single-event pages into full-night Medellin plans.

## Non-Negotiable Boundaries

- Supabase owns event, ticket, host, attendee, and Q&A truth.
- Stripe owns money.
- AI drafts summaries, answers, matches, and icebreakers.
- Hosts or admins approve public Q&A and campaign content.
- OpenClaw/Postiz/WhatsApp stay advanced and approval-gated.
