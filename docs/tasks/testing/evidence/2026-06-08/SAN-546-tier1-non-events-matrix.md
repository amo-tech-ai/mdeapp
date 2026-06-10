# SAN-546 — Production journey matrix (non-events, J05–J20)

**URL:** https://www.mdeai.co/  
**Date:** 2026-06-08  
**Scope:** Rentals, cafés, restaurants, nightlife, map pins, detail panels, platform health. **Events excluded.**

## PASS / FAIL rule

```text
PASS = all journeys J05–J20 green on production
FAIL = any journey: no cards when expected, missing pins, crash, 5xx, critical console error
```

Retry: 1 automatic retry per flaky journey; if still fail → manual browser check + log blocker.

---

## Journey matrix

| Journey | Persona | Query / action | Expected | Automated? |
|---------|---------|----------------|----------|------------|
| J05 | Camila | `2BR Laureles` | Rental cards ≥1 + map pins | Playwright / API |
| J06 | Camila | `furnished studio Poblado` | Rental cards + pins | Fast-path test + browser |
| J07 | Camila | `cafés to work in Laureles` | Café grounded cards, `data-result-kind="cafe"` | prod-synthetic ✅ |
| J08 | Tourist | `restaurants in Provenza` | Restaurant cards + pins | prod-synthetic ✅ |
| J09 | Carlos | `nightlife in Provenza` | Nightlife cards + pins (not café) | prod-venues / manual |
| J10 | Camila | Open rental detail panel | Detail panel visible | Manual |
| J11 | Camila | Schedule viewing CTA | Modal/sheet opens | Manual (G2) |
| J12 | Tourist | Open café detail | Detail panel | Manual |
| J13 | Tourist | Map pin click | Card sync / highlight | Manual |
| J14 | Tourist | Card hover/click | Pin sync | Manual |
| J15 | Camila | Nonsense rental query | Helpful empty state | Manual |
| J16 | Platform | Reload `/chat` | No crash, composer ready | Browser |
| J17 | Platform | Mobile 390px chat | Composer + send usable | Playwright mobile |
| J18 | Platform | Console on `/` load | No uncaught errors | CDP / Playwright |
| J19 | Platform | Network | No 500 on search APIs | chat-smoke |
| J20 | Platform | Evidence package | Screenshots + trace + PASS table | This file |

---

## 2026-06-08 post-merge validation run (19:08–19:18 UTC)

**Blocker:** PR #136 (**SAN-545** + **SAN-823**) **not merged** — prod SHA `b8d19b0` (SAN-660 only).

| Journey | Status | Evidence |
|---------|--------|----------|
| J05 | ⚠️ PARTIAL | hybridUsed=true; `embedStatus` null until PR #136 — `post-merge-SAN-545-823-RESULTS.md` §2 |
| J06 | ❌ BLOCKED | **SAN-823 — Rentals Fast-Path** not on prod — `post-merge-san823/results.json` |
| J07 | ✅ PASS | prod-synthetic cafés 5 cards (prior 2026-06-08) |
| J08 | ✅ PASS | prod-synthetic restaurants 5 cards (prior 2026-06-08) |
| J09 | ✅ API PASS | SAN-549 API 6/6; browser slow — `post-merge-SAN-545-823-RESULTS.md` §4 |
| J19 | ⚠️ PARTIAL | chat-smoke CopilotKit 401 — **SAN-828 — CopilotKit 401 vs 400 Audit** |

## 2026-06-08 earlier run results

| Journey | Status | Evidence |
|---------|--------|----------|
| J05 | ✅ PASS (pre-#136) | `POST /api/rentals/search` hybridUsed=true; prod-synthetic rentals |
| J06 | ✅ PASS (branch only) | Parser fast-path tests green; prod rental API 200 |
| J07 | ✅ PASS | prod-synthetic cafés 5 cards |
| J08 | ✅ PASS | prod-synthetic restaurants 5 cards |
| J09 | ⚠️ PARTIAL | SAN-549 tests green; prior `SAN-549-prod-live-RESULTS-2026-06-04.md` — re-run browser after deploy |
| J10 | ⏸ MANUAL | Not run this session |
| J11 | ⏸ MANUAL | Schedule viewing — preserve HITL |
| J12 | ⏸ MANUAL | Café detail panel |
| J13 | ⏸ MANUAL | Pin click sync |
| J14 | ⏸ MANUAL | Card hover sync |
| J15 | ⏸ MANUAL | Empty state |
| J16 | ✅ PASS | `GET /chat` 200, `chat-canvas` in HTML |
| J17 | ⏸ MANUAL | Mobile viewport |
| J18 | ✅ PASS | Playwright prod smoke — no console failures in report |
| J19 | ⚠️ PARTIAL | Rentals/events/places APIs PASS; `POST /api/copilotkit` empty → **401** (chat-smoke expects 400) |
| J20 | ✅ PASS | `prod-live-RESULTS.md`, `prod-chrome-verify/report.json`, this matrix |

### Rental hybrid proof (SAN-545)

```bash
curl -s -X POST https://www.mdeai.co/api/rentals/search \
  -H 'Content-Type: application/json' \
  -d '{"queryText":"2BR near Estadio","neighborhood":"Estadio","minBedrooms":2,"limit":4}'
```

**2026-06-08 prod response:** `hybridUsed: true`, `source: supabase`, results ≥1.

Telemetry fields (`embedStatus`, `embedFailureReason`) ship with next deploy.

---

## Required evidence checklist

| Evidence | Path |
|----------|------|
| Production URL | https://www.mdeai.co/ |
| Timestamp | 2026-06-08 |
| Screenshots | `tasks/testing/evidence/2026-06-08/prod-chrome-verify/` |
| Playwright trace | prod-synthetic run (2.7m) |
| Console log | `prod-chrome-verify/report.json` |
| Network log | `chat-smoke-prod.txt` |
| Final PASS table | This file |

## Blockers before full SAN-546 close

1. **J09** — browser re-proof nightlife routing post-deploy  
2. **J10–J15** — manual UX journeys not automated in this session  
3. **J19** — align `chat-smoke.mjs` copilotkit empty-body expectation (401 vs 400) or document auth gate
