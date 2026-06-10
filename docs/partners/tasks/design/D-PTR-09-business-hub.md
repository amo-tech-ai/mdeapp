---
task: D-PTR-09
title: "/business — mdeai for Business hub"
linear: SAN-726 · MKT — mdeai for Business hub (/business) — partner-type cards overview
route: /business
status_today: 404 — not built
wireframe: ../../wireframes/business-hub-wireframe.html (authored 2026-06-10; mirrors Mindtrip-for-Business overview screenshot)
priority: P2
signup_types: routes to /business/ai · /sponsors · /partners
---

# D-PTR-09 — `/business` hub

> Common contract in [INDEX.md](./INDEX.md) applies.

**Goal:** B2B umbrella page (the Mindtrip-for-Business analogue) — for companies that aren't venues/hosts: AI services, social management, event marketing, sponsorships.

## Sections

1. **Hero** — "mdeai for Business." CTA: Book a demo.
2. **Offer cards** — AI services → `/business/ai` · Social management (Postiz) → `/business/social` (⚫ POST — card says "coming soon" until SAN-697 ships) · Event marketing → `/business/event-marketing` (same gate, SAN-701) · Sponsorship → `/sponsors`.
3. **How-it-works + proof band** (concierge as case study) + demo form.

## Components (pinned)

shadcn/ui: `card` `badge` (the "coming soon" gates) `button` `separator`.

21st.dev (top-ranked, ONE author page-wide, install `npx shadcn@latest add "https://21st.dev/r/{author}/{slug}"`, re-token to oklch):

| Page section | 21st.dev category | URL |
|---|---|---|
| 1. Hero | Heroes (73+) | `21st.dev/s/hero` |
| 2. Offer cards (4) | Cards (79+) | `21st.dev/s/cards` |
| 3. How-it-works + proof band | Features (36+) | `21st.dev/s/features` |
| Demo CTA | CTA (34+) | `21st.dev/s/cta` |

## Scope guard

Don't build `/business/social` or `/business/event-marketing` pages here — cards only, gated "coming soon". Pulling them forward is scope creep (PRD anti-overengineering table).

## Acceptance criteria

- [ ] Live offers link out; unshipped offers visibly gated, not dead links
- [ ] Tokens/motion rules + localhost 200 + floor green + Playwright smoke
