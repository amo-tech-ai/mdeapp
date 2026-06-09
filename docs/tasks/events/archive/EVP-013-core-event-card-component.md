---
id: EVP-013-core
legacy_id: F25
title: Port EventCard + EventFilters component
status: Done
archived: 2026-06-04
priority: P0
phase: mvp
persona: andres
project: andres-commerce
milestone: P0
imp: "081"
linear: SAN-117
percent: 95
depends_on: [F07]
skill: [shadcn, react-best-practices]
vercel: LIVE
proof:
  - mdeapp/src/components/copilot/event-card.tsx
  - npm test -- event (62/62, 2026-06-04)
  - npm run test:e2e -- SCREEN-006 (9/9, 2026-06-04)
---

# EVP-013-core — EventCard (archived)

> **Shipped 2026-06-04.** Implementation lives at `mdeapp/src/components/copilot/event-card.tsx` (generative UI path), not the original spec path `components/events/EventCard.tsx`. EventFilters/preview route deferred — chat + detail surfaces cover Phase 1 north star.

## Completion proof

| Check | Result |
|-------|--------|
| Component on disk | `src/components/copilot/event-card.tsx` · `data-testid="event-card"` |
| Vitest | `event-card.test.tsx` in event suite — **62/62 pass** |
| Playwright | `SCREEN-006-event-card.spec.ts` — **9/9 pass** (cards + buy CTA + map pins) |
| Sitemap | Event detail `/events/[slug]` ✅ LIVE |
| Linear | [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) Done |

## Residual (non-blocking)

- Standalone `EventFilters` + `/events/preview` fixture route not built (EVP-014 may reuse card only)
- Production proof rolls into EVP-001 / G3

---

See original full spec in git history at `tasks/events/tasks/MVP/EVP-013-core-event-card-component.md`.
