---
task: D-PTR-06
title: "/pricing — Partner pricing across types"
linear: SAN-695 · MKT — Partner pricing (/pricing)
route: /pricing
status_today: 404 — not built
wireframe: ../../wireframes/pricing-wireframe.html (authored 2026-06-10); tier source of truth docs/08-ai-services.md + revenue/04-commerce-payments.md
priority: P1
signup_types: all (CTA per column)
---

# D-PTR-06 — `/pricing`

> Common contract in [INDEX.md](./INDEX.md) applies.

**Goal:** one page, all partner types — what's free, what's commission, what's subscription. Kills the #1 demo-call question.

## Sections (updated 2026-06-10 — Mindtrip Packages pattern, contact-gated)

1. **Hero** — "Start free. Pay when you earn." + partner-type switcher (tabs: Hosts · Venues · Rentals · Sponsors · AI services). Gradient hero band per the INDEX high-end bar.
2. **Three package cards** — Free / Growth / Custom, middle card dark/highlighted (Mindtrip's "Premium" treatment). **No public prices** — each card lists what's included + "Contact us for pricing" (Free card may say "Free"). This follows Mindtrip exactly and the notes' "pricing comes after interest" rule.
3. **Feature comparison table** — checkmark matrix across the three tiers (rows: listing, AI services, lead routing, bookings, social automation, reporting, support). Capability rows from `docs/08-ai-services.md`; no invented numbers anywhere.
4. **FAQ accordion** — fees model (commission vs subscription, in words), payouts (Stripe), cancellation.
5. **Closing dark demo band** with embedded lead form (INDEX rule 1); each tab's signup CTA still carries its `?type=`.

## Components (pinned)

shadcn/ui: `tabs` `table` `accordion` `badge` `button`.

21st.dev (top-ranked per category, ONE author page-wide, install `npx shadcn@latest add "https://21st.dev/r/{author}/{slug}"`, re-token to oklch):

| Page section | 21st.dev category | URL |
|---|---|---|
| 2. Pricing table w/ partner-type switcher | Pricing (17+) | `21st.dev/s/pricing` |
| Tier comparison rows | Comparisons (6+) | `21st.dev/s/comparisons` |
| Tab switcher (5 partner types) | Tabs (38+) | `21st.dev/s/tabs` |
| 3. FAQ | Accordions (40+) | `21st.dev/s/accordions` |
| 4. CTA band | CTA (34+) | `21st.dev/s/cta` |

## Acceptance criteria

- [ ] 5 tabs render; each CTA carries the right `?type=`
- [ ] **Zero public prices on the page** — package cards say "Contact us for pricing"; comparison table is capabilities-only (Mindtrip pattern, INDEX rule 7)
- [ ] Tokens/motion rules + localhost 200 + floor green + Playwright smoke
