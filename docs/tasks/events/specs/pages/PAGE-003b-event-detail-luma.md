---
id: PAGE-003b
title: Event detail — Luma-style UX (upgrade)
route: /events/[slug]
status: Spec-only
linear: SAN-135
persona: camila
phase: mvp
depends_on: [PAGE-003, EVP-016, EVP-033, EVP-034, EVP-035, EVP-036, EVP-043]
updated: 2026-06-08
implementation:
  page: mdeapp/src/app/events/[slug]/page.tsx
  components:
    - mdeapp/src/components/events/event-detail-view.tsx
wireframe: ../../wireframes/003-wire-event-detail-page.md
luma_wireframe: ../../design/luma/screens/03-event-detail.md
ux_review: ../../docs/luma-inspired-event-ux-review.md
luma_pack: ../../design/luma/00-index.md
design: ../../../../DESIGN.MD
---

# PAGE-003b — Luma-style `/events/[slug]`

## Purpose

Upgrade commerce-first detail into an **emotionally competitive** event room: who hosts it, who's going, why it matters, how to get there — while keeping **sticky buy** as the revenue path.

**Today (PAGE-003):** hero image, about, ticket tiers, mobile buy bar — **70% commerce**.

## Persona & real-world example

**Camila** opens *Visionarios Night: Medellín Edition* on phone → sees host avatar, vibe chips, *42 going*, map pin, *Should I go?* summary → taps **Buy tickets** without leaving scroll context.

## Route & auth

| Field | Value |
|-------|-------|
| Route | `/events/[slug]` |
| Auth | Public read; buy may require login at checkout |
| Data | `getPublicEvent(slug)` + future enrichment APIs |

## Layout — target (mobile-first)

```text
┌─────────────────────────────────────┐
│ [← Back]              [Share]       │
├─────────────────────────────────────┤
│ HERO 16:10 image + gradient scrim   │
│ Category badge · date chip          │
├─────────────────────────────────────┤
│ H1 Event title                      │
│ 📍 Venue · neighborhood · time      │
├─────────────────────────────────────┤
│ HOST BLOCK                          │
│ [avatar] Hosted by {name} · follow  │
├─────────────────────────────────────┤
│ VIBE TAGS (chips)                   │
│ #networking #startup #casual        │
├─────────────────────────────────────┤
│ AI SUMMARY (italic muted)           │
│ "Why this matches you…"             │
├─────────────────────────────────────┤
│ ATTENDEE SOCIAL PROOF               │
│ avatars + "42 going" + breakdown    │
├─────────────────────────────────────┤
│ ABOUT (existing description)        │
├─────────────────────────────────────┤
│ TICKET TIERS (existing)             │
├─────────────────────────────────────┤
│ ASK HOST                            │
│ FAQ accordion + ask AI button         │
├─────────────────────────────────────┤
│ MAP + NEARBY                        │
│ mini map + 2–3 café pins after      │
├─────────────────────────────────────┤
│ SAFETY · TRANSIT · WEATHER          │
│ compact info cards (Medellín)       │
├─────────────────────────────────────┤
│ STICKY MOBILE BUY BAR (existing)    │
└─────────────────────────────────────┘

Desktop: two-column — left narrative stack, right sticky ticket card (current pattern enhanced)
```

## Section specs

| Section | Linear | Data | Phase |
|---------|--------|------|-------|
| Hero + title/meta | SAN-135 | `PublicEventDetail` | P1 |
| Host block | SAN-135 | `organizer` profile join | P1 |
| Ticket tiers + sticky CTA | existing | tickets table | ✅ |
| Vibe tags | SAN-136 | AI + manual tags | P2 |
| AI summary | SAN-136 | Gemini cached | P2 |
| Attendees | SAN-138 | opt-in profiles | P2 |
| Ask Host | SAN-137 | Q&A table | P2 |
| Map/nearby | SAN-139 | Places + mapId | P2 |
| Safety/transit/weather | SAN-146 | context API | P3 |
| WhatsApp link | SAN-147 | host-controlled URL | P3 |
| Live updates feed | SAN-149 | host posts | P3 |

## Components (planned)

| Component | Role |
|-----------|------|
| `EventDetailHero` | Image, badges, scrim |
| `EventHostBlock` | Avatar, name, link |
| `EventVibeTags` | Chip row |
| `EventAiSummary` | Gemini blurb |
| `EventAttendeeStrip` | Avatars + count |
| `EventTicketTiers` | **existing** |
| `EventAskHost` | Accordion + chat entry |
| `EventDetailMap` | Map panel + nearby |
| `EventContextCards` | Safety/transit/weather |
| `BookingCheckoutModal` | **existing** |

## UI states

| State | testId | Behavior |
|-------|--------|----------|
| Loading | `event-detail-skeleton` | Route `loading.tsx` — skeleton hero + tiers |
| Not found | Next `notFound()` | 404 page |
| Sold out | tier copy | Disabled buy, waitlist Phase 2 |
| Partial enrichment | per-section | Hide section if data null (no lorem) |

## Mobile behavior

- Sticky bottom buy bar **remains** (`event-detail-mobile-buy-bar`)
- Host + vibe above fold before scroll to tiers
- Map section collapses to static image + "Open in Maps" if map heavy

## Accessibility

- Hero: `alt` from event name when meaningful
- Host block: heading level h2
- Ask Host: accordion `aria-expanded`
- Buy bar: does not trap focus; modal checkout uses `useModalA11y`
- `prefers-reduced-motion`: no parallax on hero

## Test plan

| Layer | Spec |
|-------|------|
| Playwright | Extend `SCREEN-014-event-detail.spec.ts` per section testids |
| Visual | `san-518-events-visual-evidence` pattern |
| Prod | Tier 2 matrix event detail prompt |

## Acceptance criteria (SAN-135 slice)

- [ ] Hero + host block shipped with semantic tokens
- [ ] Desktop sticky ticket column preserved
- [ ] Mobile bottom CTA unchanged functionally
- [ ] No hardcoded gray/zinc
- [ ] Loading skeleton on navigation
- [ ] Share button wired or removed (today: disabled Phase 2)

## Implementation PR slices

1. **PR-A:** Hero polish + host block + skeleton (`SAN-135`)
2. **PR-B:** Vibe + AI summary (`SAN-136`) — needs backend
3. **PR-C:** Attendees + Ask Host (`SAN-137`, `SAN-138`)
4. **PR-D:** Map + context (`SAN-139`, `SAN-146`)

## Design rules

Dark city-map aesthetic; amber primary CTA; dense cards; AI summary in `text-sm italic text-muted-foreground` per DESIGN.MD §3.
