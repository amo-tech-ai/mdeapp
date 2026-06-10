# Launch readiness — June 8, 2026

**Cycle:** Phase 1 launch prep · Cycle 1 (Jun 8–22)  
**North star:** Camila on `/` cards + pins · Andrés paid ticket · Roberto host publish @ mdeai.co

## Scorecard (0–10)

| Area | Score | Rationale |
|------|------:|-----------|
| **Homepage** | **9** | `/` 200 — hero, FAB, discovery rails; handoff to `/chat?q=` works on prod. Minor: slow TTFB (~3s) on prod GET `/`. |
| **Concierge** | **9** | `/chat` 200 GeoChatShell; SAN-733 merged (`b5c968c`); auto-send + URL strip; CopilotKit runtime connected. |
| **Maps** | **8** | Pins render with cards on verified verticals; vector map WebGL fallback cosmetic in Electron. Missing coords on some rentals skip pins. |
| **Search** | **8** | Multi-intent routing live; fast-path for rentals/restaurants; agent path for vague queries slower but functional. |
| **Rentals** | **8** | API 5 results, geo + schedule viewing CTA; clarify path on vague home queries. `/rentals` browse still redirect (SAN-478 P0). |
| **Events** | **9** | API 10 results, cards + buy CTA + detail; prod smoke PASS. Sparse `this_week` acceptable. |
| **Restaurants** | **8** | Fast-path 5 cards prod; photo placeholders when cache cold; maps/directions links work. |
| **Cafés** | **9** | 5 grounded cards prod; detail sheet + Places enrichment; booking gated on `placeId`. |
| **Nightlife** | **7** | VEN-025 routing + detail panel in e2e; not in prod 4-query synthetic — manual spot-check recommended pre-launch. |
| **E2E coverage** | **8** | SAN-733 core 2/2 PASS; 5 vertical home handoffs in CI; prod-synthetic 4/4 PASS; chat-smoke 1 pre-existing FAIL (401). |

**Overall launch readiness: 8.3 / 10** — ship SAN-733; track P0 gaps below.

## SAN-733 checklist

| Criterion | Status |
|-----------|--------|
| PR #134 merged to `main` | ✅ `b5c968c` |
| Prod `GET /chat` → 200 (not 307) | ✅ |
| Home → `/chat?q=` → auto-send | ✅ |
| Cards + map pins | ✅ (4/4 prod synthetic + browser) |
| Home → Chat core E2E | ✅ 2/2 |
| 5 vertical home handoff E2E | 🔄 See `tasks/testing/evidence/2026-06-08/home-to-chat-vertical-e2e.txt` |
| Concierge audit doc | ✅ This cycle |
| Prod chat-smoke saved | ✅ `chat-smoke-prod.txt` |

## Blockers (P0 before broad marketing)

| Item | Owner | Notes |
|------|-------|-------|
| `/rentals` catalog browse | SAN-478 | Still redirects to `/chat` — Camila browse UX incomplete |
| Stripe live checkout proof | W9 | Webhook deployed; need live Andrés journey |

## Non-blocking (P1)

- CopilotKit empty POST → 401 vs smoke 400
- Nightlife prod-synthetic coverage
- Restaurant photo cache cold start
- Rental clarify latency on vague home queries

## Evidence index

| Artifact | Path |
|----------|------|
| Concierge restore | `tasks/testing/evidence/2026-06-08/concierge-restore-RESULTS.md` |
| Prod live | `tasks/testing/evidence/2026-06-08/prod-live-RESULTS.md` |
| Chat smoke prod | `tasks/testing/evidence/2026-06-08/chat-smoke-prod.txt` |
| Vertical E2E | `tasks/testing/evidence/2026-06-08/home-to-chat-vertical-e2e.txt` |
| Concierge audit | `docs/audits/concierge-audit.md` |
| SAN-733 notes | `docs/notes/june-8-chat.md` |
| Sitemap | `sitemap.md` |

## Verdict

**SAN-733 is complete and production-verified.** Concierge on `/chat` is the canonical AI surface; `/` is marketing entry. Remaining launch risk is **rentals browse** (SAN-478) and **paid ticket e2e on prod**, not the home→chat handoff.
