---
task: D-PTR-01
title: "/partners — Partner hub marketing page"
linear: SAN-692 · MKT — Partner hub marketing page (/partners)
route: /partners
status_today: basic page live (200) — src/app/partners/page.tsx; no type cards, no funnel
wireframe: ../../wireframes/partners-hub-wireframe.html (authored 2026-06-10; sections annotated with 21st.dev categories)
priority: P0
signup_types: all (hub routes to each)
---

# D-PTR-01 — `/partners` hub

> Common contract in [INDEX.md](./INDEX.md) applies (DESIGN.MD, shadcn + 21st.dev, CTA funnel, Done gate).

**Goal:** one page that answers "I run a business in Medellín — what does mdeai do for me?" and routes each partner type to its landing or straight into the signup wizard.

## Sections (deltas from shared shell)

1. **Hero** — "Grow your business with Medellín's AI concierge" + dual CTA (Become a partner → `/partners/signup` · Book a demo). 21st.dev hero with stats band (partners, events published, leads routed).
2. **Partner-type card grid** (the core of this page) — 6 cards: Event Hosts → `/host` · Venues (restaurant/café/nightclub) → `/venues` · Rentals & Brokers → `/partners/rentals` · Sponsors → `/sponsors` · Agencies & AI services → `/business/ai` · Creators → signup `?type=partner`. Each card: icon, one-line value, top revenue model, CTA.
3. **"The AI does the work" band** — 3 columns: AI drafts (events/listings/posts) · AI replies (leads/reviews) · AI surfaces you (concierge + map). This is the differentiator vs a directory.
4. **How it works** — 3 steps: Sign up (typed wizard) → AI onboarding → live on the concierge.
5. **Trust band (dark)** — testimonials placeholder + logo cloud.
6. **Pricing teaser** → `/pricing` (link can land later; hide band until SAN-695 ships if needed).
7. **Demo form / footer CTA** → `/contact` or mailto fallback.

## Components (pinned)

shadcn/ui (install `npx shadcn@latest add <name>` if absent): `card` `badge` `button` `separator` `skeleton`.

21st.dev sections — pick the **top-ranked** component in each category below; prefer ONE primary author (`shadcnblockscom` for marketing blocks; `tailark`/`kokonutd` accents) across the whole page for visual coherence; install as source `npx shadcn@latest add "https://21st.dev/r/{author}/{slug}"`, then re-token to `globals.css` oklch vars:

| Page section | 21st.dev category | URL |
|---|---|---|
| 1. Hero + stats band | Heroes (73+) + Numbers (18+) | `21st.dev/s/hero` · `21st.dev/s/numbers` |
| 2. Partner-type 6-card grid | Features — bento grid (36+) | `21st.dev/s/features` |
| 3. "AI does the work" band | Features — 3-col icon list | `21st.dev/s/features` |
| 5. Trust band | Testimonials (15+) + Clients/logo cloud (16+) | `21st.dev/s/testimonials` · `21st.dev/s/clients` |
| 6–7. Pricing teaser + demo CTA | Calls to Action (34+) | `21st.dev/s/cta` |
| Footer | Footers (14+) | `21st.dev/s/footers` |

## Acceptance criteria

- [ ] All 6 type cards link to the correct landing/signup target (Playwright asserts hrefs)
- [ ] Hero primary CTA → `/partners/signup` (200, wizard renders)
- [ ] No hardcoded gray-*/hex; oklch tokens only; `prefers-reduced-motion` honored
- [ ] Mobile: cards stack 1-col, CTAs thumb-reachable
- [ ] Localhost 200 + console clean + floor green
