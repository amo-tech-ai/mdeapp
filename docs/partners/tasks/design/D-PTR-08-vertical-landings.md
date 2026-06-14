---
task: D-PTR-08
title: "/partners/{restaurants,cafes,nightlife} — per-vertical landings"
linear: >
  SAN-713 · MKT — For Restaurants landing (/partners/restaurants) ·
  SAN-714 · MKT — For Cafés landing (/partners/cafes) ·
  SAN-712 · MKT — For Nightlife landing (/partners/nightlife)
route: /partners/restaurants · /partners/cafes · /partners/nightlife
status_today: 404 — not built
wireframe: none dedicated — venues-wireframe.html shell + ?v= deltas in docs/03-landing-pages.md
priority: P2 — only after D-PTR-02 ships; may be satisfied by /venues?v= redirects
---

# D-PTR-08 — vertical landings (restaurants · cafés · nightlife)

> Common contract in [INDEX.md](./INDEX.md) applies.

**Decision first, build second:** D-PTR-02's `/venues?v=` already renders per-vertical copy. These three routes exist for SEO + direct outreach links. **Option A (recommended):** thin pages that render `PartnerLandingShell` with the vertical config (unique metadata/OG per route, ~30 lines each). **Option B:** 301 to `/venues?v=…` (zero design work, weaker SEO). Confirm with owner before building — if A, this is config not design.

## Per-vertical deltas (from 03-landing-pages.md)

| Vertical | Hook | Top features | Pricing |
|---|---|---|---|
| Restaurants | Get listed + reservations | listing+map · concierge surfacing · AI review replies | Free → Growth |
| Cafés | Capture nomad demand | remote-work tags · listing · AI posts (Postiz) | Free → Growth |
| Nightlife | Fill nights + tables | AI event publish · table booking · "tonight" surfacing | Growth + % |

## Components (pinned)

None new — Option A renders `PartnerLandingShell` (D-PTR-02) with per-vertical config only. If any extra is genuinely needed, it must come from the shell's existing 21st.dev installs; new installs here are scope creep.

## Acceptance criteria

- [ ] Decision (A/B) recorded on the three Linear tasks before code
- [ ] If A: each route renders the shell with correct config + unique metadata; CTAs carry `?type=venue`
- [ ] Tokens/motion rules + localhost 200 + floor green
