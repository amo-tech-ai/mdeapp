# PR #12 — pin clear production gate (100%)

**Date:** 2026-05-28  
**Deployed commit:** `e8d2a6006f39f0eb0e1a789a2e6e74ad08fd88cf` (`main` after PR #12)  
**Production URL:** https://www.mdeai.co/  
**PR stack:** [#10](https://github.com/amo-tech-ai/mdeapp/pull/10) feature · [#11](https://github.com/amo-tech-ai/mdeapp/pull/11) safety · [#12](https://github.com/amo-tech-ai/mdeapp/pull/12) pin clear

## Final verdict

**100/100 — rental fast-path production complete** (API + UI Test A + UI Test B).

---

## Production API

| Test | Request body | HTTP | `results.length` |
|------|--------------|------|------------------|
| A — happy | `Laureles`, `minBedrooms: 1`, `maxPricePerNight: 80`, `limit: 3` | 200 | 3 |
| B — empty | `Laureles`, `minBedrooms: 1`, `maxPricePerNight: 1`, `limit: 8` | 200 | 0 |

```bash
# A
curl -sS -X POST https://www.mdeai.co/api/rentals/search \
  -H "Content-Type: application/json" \
  -d '{"neighborhood":"Laureles","minBedrooms":1,"maxPricePerNight":80,"limit":3}'

# B
curl -sS -X POST https://www.mdeai.co/api/rentals/search \
  -H "Content-Type: application/json" \
  -d '{"neighborhood":"Laureles","minBedrooms":1,"maxPricePerNight":1,"limit":8}'
```

---

## Production UI (Playwright)

**Runner:** `SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 npx playwright test e2e/prod/pr12-pin-clear-prod-gate.spec.ts --project=chromium`  
**Result:** 2/2 passed (13.4s)

| Test | Chat query | Verified |
|------|------------|----------|
| **A** | `1BR in Laureles under $80/night` | Rental cards visible (≥1); rental map pins ≥1; schedule CTA visible; no `results-column`; no critical console errors |
| **B** | `1BR in Laureles under $1/night` (after A) | Rental pins cleared to **0**; rental cards **0**; no crash; no critical console errors |

Parser confirms both queries fast-path with expected API params (`maxPricePerNight` 80 vs 1).

### Screenshots

| File | Description |
|------|-------------|
| [test-a-cards-and-pins.png](screenshots/test-a-cards-and-pins.png) | Test A — cards + pins |
| [test-b-before-zero-search.png](screenshots/test-b-before-zero-search.png) | Test B — pins present after query A |
| [test-b-after-zero-search.png](screenshots/test-b-after-zero-search.png) | Test B — rental pins cleared after query B |

Also on disk: `mdeapp/tmp/screenshots/PR12-PROD-GATE/`

---

## Local gates (post-merge `main`)

| Gate | Result |
|------|--------|
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `mergePinsByCategory` unit tests | 4/4 pass |

---

## Score

| Phase | Score |
|-------|-------|
| Pre-merge PR #12 | 96/100 |
| Post-merge API only | 98/100 |
| **Post-merge API + UI** | **100/100** |

---

## Linear (completed)

SAN-242 / SAN-243 — rental fast-path complete:

- PR #10 feature
- PR #11 CodeRabbit fixes
- PR #12 stale pin hotfix (`mergePinsByCategory` replace-category)
- Production cards + pins verified (Test A)
- Zero-result pin clear verified (Test B)

**Next P0:** G1 paid Stripe proof.
