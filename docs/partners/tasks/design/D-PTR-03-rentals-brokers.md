---
task: D-PTR-03
title: "/partners/rentals — For Rentals / Brokers landing"
linear: SAN-691 · MKT — For Rentals / Brokers landing (/partners/rentals)
route: /partners/rentals
status_today: 404 on prod (verified 2026-06-10) — Linear says In Review; reconcile branch state before building
wireframe: ../../wireframes/partners-rentals-wireframe.html
priority: P0
signup_types: broker (?type=broker)
---

# D-PTR-03 — `/partners/rentals` landing

> Common contract in [INDEX.md](./INDEX.md) applies. **First step: check the In-Review branch/PR for SAN-691 — work may exist unmerged; finish it rather than restart.**

**Goal:** real-estate hosts, brokers, and property managers list units and receive qualified leads. This is a P0 vertical (the rental lead funnel on `/rentals` + `/chat` is already live — Camila's side works; this page recruits the supply side).

## Sections

1. **Hero** — "Your listings, in front of every nomad in Medellín." CTA: List your rental → `/partners/signup?type=broker` · Book a demo.
2. **Value props** — listings on `/rentals` + map · AI lead replies · viewing scheduling (the live schedule-viewing flow).
3. **Features grid** — AI listing drafts (photos → copy) · lead qualification + routing · calendar/scheduling.
4. **AI + Automation band** — AI drafts the listing, qualifies the lead, books the viewing; broker approves (HITL).
5. **How it works** — sign up → AI builds your first listing → leads land in your inbox.
6. **Pricing teaser** — per-lead fee / booking fee; property-manager subscription (P2).
7. **Trust band + demo form + footer.**

## Components (pinned)

- **Reuse `PartnerLandingShell` from D-PTR-02** (if not merged yet, coordinate — don't fork the shell). shadcn/ui already in shell: `card badge button accordion skeleton`.
- Page-specific 21st.dev extras (top-ranked, same author as shell, install `npx shadcn@latest add "https://21st.dev/r/{author}/{slug}"`):

| Page section | 21st.dev category | URL |
|---|---|---|
| 6. Success metrics band (leads routed, viewings booked) | Numbers — animated counters (18+) | `21st.dev/s/numbers` |
| 5. How-it-works step timeline | Features — steps/timeline (36+) | `21st.dev/s/features` |
| Trust band | Testimonials (15+) | `21st.dev/s/testimonials` |

## Acceptance criteria

- [ ] CTA carries `?type=broker` into the live wizard
- [ ] Page references real surfaces (rentals browse, schedule-viewing) — no vapor features
- [ ] Tokens/motion/skeleton rules + localhost 200 + floor green + Playwright smoke
- [ ] sitemap.md row flipped to ✅ LIVE on ship
