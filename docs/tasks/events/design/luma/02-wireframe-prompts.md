---
title: Luma Wireframe Prompts — Index
date: 2026-06-08
status: active
skill: mde-wireframe
screenshots: /home/sk/mdeai/screenshots/luma
master: ./luma-analysis-master.md
diagrams: ./03-diagrams.md
---

# Luma Wireframe Prompts — One Doc Per Screen

Use this index to generate **lo-fi wireframe specs** (ASCII + component inventory + states) for each Luma surface, then map to mdeai routes.

**Skills:** `mde-wireframe` (ASCII spec handoff) · `mermaid-diagrams` (flows in [`03-diagrams.md`](03-diagrams.md))

**Evidence:** Screenshots listed in [`01-prompt-luma.md`](01-prompt-luma.md) — store under `/home/sk/mdeai/screenshots/luma/` when captured.

---

## Screen index

| # | Luma screen | Screenshot(s) | Wireframe spec | mdeai route | Persona | Linear / task |
|---|-------------|-----------------|----------------|-------------|---------|---------------|
| 01 | Discover feed | `Events-discover-1.png`, `Events-medelin1.png` | [screens/01-discover.md](01-discover.md) | `/events`, `/` chat | Camila | SAN-117, EVP-013 |
| 02 | Event list / calendar | `Events-list-1.png` | [screens/02-event-list.md](02-event-list.md) | `/events` | Andrés | SCREEN-027 |
| 03 | Event detail | `Events-details-1.png`, `E-1.png` | [screens/03-event-detail.md](03-event-detail.md) | `/events/[slug]` | Camila, Andrés | SAN-135, EVP-032, PAGE-003b |
| 04 | Checkout / pay | `Events-pay.png` | [screens/04-checkout.md](04-checkout.md) | Checkout modal + Stripe | Andrés | EVP-002, SAN-248 |
| 05 | Profile — hosting & attending | `Events-profile.png`, `me-1.png`–`me-6.png` | [screens/05-profile-me.md](05-profile-me.md) | `/me/tickets`, `/host/events` | Andrés, Roberto | EVP-014, SAN-118 |
| 06 | Host overview | Host dashboard (in me-* set) | [screens/06-host-overview.md](06-host-overview.md) | `/host/events` | Roberto | SAN-730 |
| 07 | Host guests / CRM | Guests tab | [screens/07-host-guests.md](07-host-guests.md) | `/host/events/[id]/guests` | Roberto | post-MVP |
| 08 | Host registration | Registration tab | [screens/08-host-registration.md](08-host-registration.md) | Wizard + tiers | Roberto | host wizard |
| 09 | Host blasts | Blasts / email | [screens/09-host-blasts.md](09-host-blasts.md) | `/host/marketing` | Roberto | SAN-660+ |
| 10 | Host insights / analytics | Insights tab | [screens/10-host-insights.md](10-host-insights.md) | `/host/analytics` | Roberto | SAN-729, PAGE-M02 |
| 11 | Host settings | Settings tab | [screens/11-host-settings.md](11-host-settings.md) | `/host/settings` | Roberto | post-MVP |
| 12 | Community | Community on event + profile | [screens/12-community.md](12-community.md) | Event detail section | Camila | EVP-044, SAN-147 |

---

## Reusable wireframe prompt (copy per screen)

Paste into Claude/Cursor with the screen spec + screenshot attached:

```text
You are a Senior Product Designer using the mde-wireframe skill.

Input:
- Screen spec: tasks/events/design/luma/screens/{NN}-{slug}.md
- Screenshot: /home/sk/mdeai/screenshots/luma/{filename}.png
- mdeai DESIGN.MD tokens (oklch, shadcn)
- Persona + route from spec frontmatter

Output a complete wireframe handoff:
1. ASCII layout (mobile-first, then desktop breakpoint note)
2. Component inventory table (design-system / domain / page-specific)
3. States: Default, Loading, Empty, Error
4. Interactions table (tap → result)
5. a11y notes (focus order, aria-labels on icon buttons)
6. mdeai delta — what exists on disk vs what to build
7. Open questions + confidence (image interpretation %)

Rules:
- Phase 1 English only; Medellín neighborhoods (Poblado, Laureles)
- Realistic copy — no lorem ipsum
- Sticky CTA must not cover content on mobile
- AI sections are draft-only; host approves public Q&A
- Do not fork Luma — extend mdeapp routes in spec
```

---

## Generation order (MVP)

```text
03 event detail → 04 checkout → 01 discover → 02 list → 05 profile
→ 06 host overview → 10 host insights → 12 community
→ 07–09, 11 post-MVP
```

Aligns with [`events-roadmap.md`](events-roadmap.md) Phase 1.5 (`hostOpsAgent` + analytics).

---

## Related

- [luma-analysis-master.md](luma-analysis-master.md) — forensic Luma analysis
- [03-diagrams.md](03-diagrams.md) — Mermaid IA + journeys
- [../../docs/luma-inspired-event-ux-review.md](luma-inspired-event-ux-review.md) — gap analysis
- [../../specs/pages/PAGE-003b-event-detail-luma.md](PAGE-003b-event-detail-luma.md) — implementation spec
