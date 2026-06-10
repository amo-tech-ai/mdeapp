---
task: D-PTR-05
title: "/sponsors — Sponsors / Sponsorship landing"
linear: SAN-664 · MKT — Sponsors / Sponsorship (/sponsors)
route: /sponsors
status_today: 404 on prod (verified 2026-06-10) — Linear In Progress
wireframe: ../../wireframes/sponsors-wireframe.html
priority: P1
signup_types: sponsor (?type=sponsor)
---

# D-PTR-05 — `/sponsors` landing

> Common contract in [INDEX.md](./INDEX.md) applies.

**Goal:** brands buy sponsorship of events and contests — featured placement in front of the nomad/expat audience.

## Sections

1. **Hero** — "Put your brand inside Medellín's events." CTA: Become a sponsor → `/partners/signup?type=sponsor` · Talk to us.
2. **Inventory grid** — featured events · contests/giveaways (ties to SAN-694 · MKT — Contests hub, later) · concierge placements (labeled + grounded — trust rule from PRD §12).
3. **AI band** — AI sponsorship matching (event ↔ brand fit) + ROI reporting.
4. **Packages teaser** — package tiers, custom pricing.
5. **Trust band + demo form + footer.**

## Components (pinned)

- **Reuse `PartnerLandingShell`** (D-PTR-02). Page-specific (top-ranked, same author as shell, install `npx shadcn@latest add "https://21st.dev/r/{author}/{slug}"`, re-token to oklch):

| Page section | 21st.dev category | URL |
|---|---|---|
| 2. Inventory grid (featured events · contests · placements) | Cards (79+) | `21st.dev/s/cards` |
| Event showcase row | Carousels (16+) — match existing EventCard visual language | `21st.dev/s/carousels` |
| 4. Packages teaser | Pricing — package cards (17+) | `21st.dev/s/pricing` |

## Acceptance criteria

- [ ] CTA carries `?type=sponsor` into the live wizard
- [ ] Sponsored-placement copy includes the "always labeled" trust line
- [ ] Tokens/motion rules + localhost 200 + floor green + Playwright smoke
- [ ] sitemap.md row flipped on ship
