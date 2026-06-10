---
task: D-PTR-10
title: "/about — About mdeai"
linear: SAN-662 · MKT — About page (/about)
route: /about
status_today: 404 — not built (⚫ POST in sitemap)
wireframe: ../../wireframes/about-wireframe.html
priority: P2
signup_types: n/a
---

# D-PTR-10 — `/about`

> Common contract in [INDEX.md](./INDEX.md) applies.

**Goal:** credibility page for partners doing due diligence before signing up — what mdeai is, the AI-concierge thesis, the team, the city focus.

## Sections (per wireframe)

1. **Hero** — mission line ("Medellín's AI concierge — one assistant for everything the city offers").
2. **Story band** — why Medellín, why AI-first, demand side already live (consumer surfaces as proof).
3. **Numbers band** — events listed · venues · rentals (pull real counts at build time, no fake stats).
4. **Team / contact** — minimal; link `/contact`.

## Components (pinned)

shadcn/ui: `card` `avatar` `separator`.

21st.dev (top-ranked, install `npx shadcn@latest add "https://21st.dev/r/{author}/{slug}"`, re-token to oklch):

| Page section | 21st.dev category | URL |
|---|---|---|
| 1–2. Hero + story band | Heroes (73+) · Texts (58+) | `21st.dev/s/hero` · `21st.dev/s/texts` |
| 3. Numbers band (real counts only) | Numbers — animated counters (18+) | `21st.dev/s/numbers` |
| 4. Team | Avatars (17+) | `21st.dev/s/avatars` |

## Acceptance criteria

- [ ] All stats real or omitted — no invented numbers
- [ ] Tokens/motion rules + localhost 200 + floor green + Playwright smoke
