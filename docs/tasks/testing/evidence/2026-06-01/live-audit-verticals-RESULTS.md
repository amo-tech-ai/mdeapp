# UX-031 / UX-T-031 — live-audit-verticals (2026-06-01)

**Command:** `cd mdeapp && npm run test:e2e:live-audit`  
**Result:** 4/4 PASS (~5.5m, serial, chromium)  
**Dev:** localhost:3001 + Mastra :4111 (clean restart)

| Step | Query | Assert | Time |
|------|-------|--------|------|
| 1 | `1BR apartment in Laureles under 80 dollars per night` | rental cards + `data-result-kind="rental"` | 4.2s |
| 2 | `salsa events this weekend in Medellín` | event cards + kind | 5.0s |
| 3 | `quiet rooftop dinner in Provenza` (after events) | no `/api/events/search` hijack | 3.1m |
| 4 | `Quiet cafés near Laureles` (ADK 503 mock) | café cards, not "No places found" | 2.2m |

**Screenshots:** `tasks/testing/evidence/live-audit-verticals/01-rental.png` … `04-cafe.png`
