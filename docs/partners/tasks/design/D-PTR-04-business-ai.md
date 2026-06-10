---
task: D-PTR-04
title: "/business/ai — AI Services for companies"
linear: SAN-663 · MKT — AI Services for companies (/business/ai)
route: /business/ai (?b=brand variant)
status_today: 404 on prod (verified 2026-06-10) — Linear In Progress
wireframe: ../../wireframes/business-ai-wireframe.html
priority: P1
signup_types: agency (?type=agency)
---

# D-PTR-04 — `/business/ai` landing

> Common contract in [INDEX.md](./INDEX.md) applies.

**Goal:** agencies, companies, and brands buy AI builds, automation, and marketing services on retainer. Highest-ticket offer; tone = capability proof, not feature list.

## Sections

1. **Hero** — "Agency-grade AI, built on the stack that runs mdeai." CTA: Book a demo (primary here — high-touch sale) · Become a partner.
2. **Services grid** — AI builds (copilots, agents) · marketing automation (Postiz social, lifecycle) · data intelligence (OpenClaw + Places enrichment) · campaigns/placements (`?b=brand` view).
3. **Proof band** — the mdeai concierge itself as the case study: grounded answers, maps, bookings.
4. **Engagement model** — Free consult → scoped build → retainer (Free/Growth/Pro/Custom tiers from 08-ai-services.md).
5. **Trust band + demo form + footer.**

## Components (pinned)

- **Reuse `PartnerLandingShell`** (D-PTR-02). Page-specific 21st.dev extras (top-ranked, same author as shell, install `npx shadcn@latest add "https://21st.dev/r/{author}/{slug}"`, re-token to oklch):

| Page section | 21st.dev category | URL |
|---|---|---|
| 3. Proof band (concierge case study) | Features — showcase/bento (36+) | `21st.dev/s/features` |
| Client logos | Clients — logo cloud (16+) | `21st.dev/s/clients` |
| 4. Engagement tiers (Free/Growth/Pro/Custom) | Pricing — tiered cards (17+) | `21st.dev/s/pricing` |

## Acceptance criteria

- [ ] Primary CTA → `/contact` demo flow (or mailto fallback until SAN-693 ships)
- [ ] `?b=brand` switches copy to campaigns/placements
- [ ] Tokens/motion rules + localhost 200 + floor green + Playwright smoke
- [ ] sitemap.md row flipped on ship
