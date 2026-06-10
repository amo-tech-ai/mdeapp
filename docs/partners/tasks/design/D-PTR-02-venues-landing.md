---
task: D-PTR-02
title: "/venues — For Venues landing (restaurant · café · nightclub · space)"
linear: SAN-661 · MKT — For Venues landing (/venues)
route: /venues (?v=restaurant|cafe|nightclub|space)
status_today: 404 — not built
wireframe: ../../wireframes/venues-wireframe.html (THE shared B2B shell — build this first, others reuse)
priority: P0
signup_types: venue (?type=venue, category from ?v=)
---

# D-PTR-02 — `/venues` landing

> Common contract in [INDEX.md](./INDEX.md) applies.

**Goal:** get restaurants, cafés, nightclubs, and event spaces listed + taking reservations/bookings. This page IS the master template — its sections become the reusable `PartnerLandingShell` the other landings configure.

## Sections (per wireframe + 03-landing-pages.md)

1. **Hero** — "Fill your tables. Fill your nights." dual CTA (List your venue → `/partners/signup?type=venue` · Book a demo). `?v=` switches hero copy + accent: restaurant (terracotta) / café / nightclub / space.
2. **Value props** — listing + map pins · concierge surfacing ("tonight" queries) · reviews/reservations.
3. **Features grid** — per-vertical top 3 from the master table (e.g. nightclub: AI event publish · table/bottle booking · nightlife browse presence).
4. **AI + Automation band** — AI menu/promos, AI review replies, Postiz auto-posting, OpenClaw ingest of recurring nights.
5. **How it works** — list → AI onboarding (category preset from `?v=`) → first booking.
6. **Trust band** — placeholder testimonial ("Filled a Tuesday with a salsa night in 10 minutes.").
7. **Pricing teaser** — Free → Growth; % on tables/tickets; featured optional.
8. **Demo form + footer.**

## Build notes

- Extract `PartnerLandingShell` (hero/value/features/how/trust/pricing/demo as composable slots) into `src/components/partners/` — D-PTR-03/04/05/08 reuse it. Build once, configure many (PRD principle).
- `?v=` handled server-side (searchParams) — SSG the 4 variants if trivial, else SSR.

## Components (pinned)

shadcn/ui: `tabs` `card` `badge` `button` `accordion` `skeleton`.

21st.dev — top-ranked per category, ONE primary author (`shadcnblockscom` for marketing blocks; `tailark`/`kokonutd` accents) page-wide, install `npx shadcn@latest add "https://21st.dev/r/{author}/{slug}"`, re-token to oklch:

| Page section | 21st.dev category | URL |
|---|---|---|
| 1. Hero (split, image right, `?v=` accent) | Heroes (73+) | `21st.dev/s/hero` |
| 2–3. Value props + features grid | Features (36+) | `21st.dev/s/features` |
| 4. AI + Automation band | Features — icon columns | `21st.dev/s/features` |
| 6. Trust band | Testimonials (15+) | `21st.dev/s/testimonials` |
| 7. Pricing teaser (Free → Growth) | Pricing (17+) | `21st.dev/s/pricing` |
| FAQ | Accordions (40+) | `21st.dev/s/accordions` |
| 8. Demo form CTA + footer | CTA (34+) · Footers (14+) | `21st.dev/s/cta` · `21st.dev/s/footers` |

These installs become the slot internals of `PartnerLandingShell` — downstream pages (D-PTR-03/04/05/08) configure, never re-install.

## User stories (2026-06-10)

- **Carlos, restaurant owner (El Poblado):** spending $800/mo on an agency — wants to be the concierge's answer to "where to eat tonight" and get bookings without ads. → hero, value props, features
- **Luisa, café owner (Laureles):** wants remote-work tags + AI-written posts so nomads find her without daily Instagram work. → `?v=cafe`, AI/Automation band
- **Mateo, nightclub manager (Provenza):** empty Tuesdays — wants AI event publish in minutes + table bookings. → `?v=nightclub`, how-it-works
- **Valentina, event-space manager:** wants booking *requests* she approves (HITL), keeping calendar control. → booking feature card
- **All:** want a cost signal before talking to anyone. → contact-gated pricing teaser

## Copy spec (EN, Phase 1)

- **Hero:** kicker `FOR RESTAURANTS · CAFÉS · NIGHTLIFE · SPACES` · H1 **"Fill your tables. Fill your nights."** · sub "mdeai puts your venue inside Medellín's AI concierge — where visitors already ask what to do, where to eat, and where to go out." · CTAs `List your venue` → `/partners/signup?type=venue` + ghost `Book a demo` (DemoBand anchor)
- **Value props (3):** Be the answer · Bookings, not browsing (your approval) · Marketing that writes itself
- **Features (6):** AI event publish · table/reservation booking (HITL) · listing + map · AI social posts (Postiz) · review replies · weekly reporting
- **How it works (5-step TIMELINE, owner review 2026-06-10):** 1. List venue → 2. AI creates listing → 3. Travelers discover venue → 4. Owner approves booking → 5. Customer arrives. Render as a numbered timeline component (see INDEX picks), not plain cards.
- **Pricing teaser:** "Free to list. Growth when you grow." — contact-gated, no public numbers.

### `?v=` variant matrix (copy + accent swap only)

| Variant | H1 | Accent |
|---|---|---|
| default | Fill your tables. Fill your nights. | brand |
| restaurant | Be the answer to "where should we eat?" | terracotta (match `/restaurants`) |
| cafe | Where Medellín's nomads work next. | café token |
| nightclub | Slow Tuesdays are a software problem. | nightlife token |
| space | Your space, booked by AI. | brand |

## Graphics & imagery plan

- Hero = CSS gradient (oklch) + oversized type; **no stock photos**; max one restrained illustrated accent from the page's single 21st.dev author.
- **Product proof over decoration:** 2 real UI screenshots — concierge chat showing a venue card + map pin, and the host event wizard — in browser/device frames, `next/image` AVIF/WebP, explicit dimensions (no CLS).
- **Gallery rail (`gallery4`) = mdeai PRODUCT screenshots, not venue photos** (owner ruling): concierge chat · booking approval · event publish wizard · venue dashboard · map discovery. The page sells mdeai; venue photos (via `/api/places/photo` proxy only, never hotlinked) may appear sparingly in feature tiles as supporting texture.
- **Logo wall: hidden entirely in Phase 1; Phase 2 real logos only — no placeholders ever** (supersedes the trust-band placeholder note above).
- Alt text everywhere; `prefers-reduced-motion` disables animation; LCP target = hero text, not an image.

> Linear note: this content was posted as a comment on SAN-661 · MKT — For Venues landing — the Linear API silently rejected two description updates, so the comment + this file are canonical.

## Acceptance criteria

- [ ] `?v=restaurant|cafe|nightclub` switches hero copy + accent (Playwright x3)
- [ ] Primary CTA carries `?type=venue` into signup wizard
- [ ] `PartnerLandingShell` exported and consumed by this page (proven reusable)
- [ ] Tokens/motion/skeleton rules + localhost 200 + floor green
