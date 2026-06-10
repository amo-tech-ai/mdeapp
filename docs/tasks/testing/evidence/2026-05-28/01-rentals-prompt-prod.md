# 01-rentals-prompt — production verification

**Prompt:** [`tasks/testing/prompts/01-rentals-prompt.md`](../../prompts/01-rentals-prompt.md)  
**URL:** https://www.mdeai.co/  
**Deploy SHA:** `e8d2a6006f39f0eb0e1a789a2e6e74ad08fd88cf` (PR #12 merged)  
**Date:** 2026-05-28

## Tools used

| Tool | Role |
|------|------|
| **Playwright** | Automated UI gate (`e2e/prod/pr12-pin-clear-prod-gate.spec.ts`) — 2/2 pass |
| **Chrome DevTools MCP** | Interactive prod session, network + console + screenshots |
| **curl** | Direct API probes |

---

## API

| Test | Body (summary) | HTTP | `results.length` |
|------|----------------|------|------------------|
| A | Laureles, 1BR, max $80/night | 200 | ≥ 1 (3 in sample) |
| B | Laureles, 1BR, max $1/night | 200 | 0 |

---

## Test A — `1BR in Laureles under $80/night`

| Check | Playwright | Chrome DevTools |
|-------|------------|-----------------|
| Rental cards | pass | pass (5 cards + Schedule viewing CTAs) |
| Rental map pins | pass (card↔pin sync / cluster fallback) | pass (map zoomed; pins rendered) |
| Schedule viewing CTA | pass | pass |
| No duplicate `results-column` | pass | pass (not observed) |
| Critical console errors | pass | pass (none) |
| `POST /api/rentals/search` 200 | pass (fast-path) | pass (reqid 1173) |

**Screenshots:** `screenshots/01-rentals-test-a-chrome.png`, `screenshots/test-a-cards-and-pins.png`

---

## Test B — `1BR in Laureles under $1/night`

| Check | Playwright | Chrome DevTools |
|-------|------------|-----------------|
| No crash | pass | pass |
| Old rental pins clear | pass (0 rental pins) | pass (“No pins yet” / map empty) |
| Stale rental cards gone | pass (0 cards) | pass (“No rentals matched” empty state) |
| Other category pins unchanged | N/A (no other categories seeded) | N/A |
| Critical console errors | pass | pass (none) |
| API `results: []` | pass (via fast-path) | pass (second search in session) |

**Screenshots:** `screenshots/01-rentals-test-b-chrome.png`, `screenshots/test-b-after-zero-search.png`

---

## Report (prompt §5)

| Item | Result |
|------|--------|
| **Test A** | **PASS** |
| **Test B** | **PASS** |
| **Pin clear working** | **yes** |
| **Remaining blockers** | None for rental fast-path prod gate |

---

## Final verdict

**100/100 — production rental fast-path complete** per `01-rentals-prompt.md`.

Pin clear fix (PR #12 `mergePinsByCategory` replace-category) verified on live UI, not API-only.

---

## Re-run commands

```bash
# Playwright (preferred regression)
cd mdeapp
SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/prod/pr12-pin-clear-prod-gate.spec.ts --project=chromium

# API
curl -sS -X POST https://www.mdeai.co/api/rentals/search \
  -H "Content-Type: application/json" \
  -d '{"neighborhood":"Laureles","minBedrooms":1,"maxPricePerNight":80,"limit":3}'
curl -sS -X POST https://www.mdeai.co/api/rentals/search \
  -H "Content-Type: application/json" \
  -d '{"neighborhood":"Laureles","minBedrooms":1,"maxPricePerNight":1,"limit":8}'
```

**Note:** Map clustering (≥4 pins) may hide per-pin `data-testid="map-pin"`; Playwright uses card `data-pin-id` sync per SCREEN-005 pattern.
