# SAN-546 · OPS-JOURNEY — post-merge verification (2026-06-09)

**Prod SHA:** `main` @ `2835cf2` (PR #145 merged)  
**URL:** https://www.mdeai.co/

## Tier 1 — quick smoke

| Check | Result |
|-------|--------|
| GET `/` | PASS 200 |
| chat-smoke.mjs | PASS (rentals, events, copilotkit 400, places 400) |

## CI / deploy

| Check | Result |
|-------|--------|
| Floor on `2835cf2` | PASS ([run 27230615181](https://github.com/amo-tech-ai/mdeapp/actions/runs/27230615181)) |
| npm audit (shell-quote override) | PASS exit 0 |

## Prod Playwright — core journeys

| Journey | Spec | Result | Duration |
|---------|------|--------|----------|
| **J14** rental follow-up | `SAN-546-j14-j15-prod.spec.ts` | **PASS** | ~1.9m (with J15) |
| **J15** pin clear | `SAN-546-j14-j15-prod.spec.ts` | **PASS** | rental pins cleared post-café |
| **J17** mobile map FAB | `SAN-577B-rentals-map.spec.ts` | **PASS** | 13.8s |

### J14 stability (5 consecutive prod runs)

All **5/5 PASS** (spec file runs J14+J15 each invocation; no flake observed).

Evidence: `san-546-prod/j14-turn1-rentals.png`, `j14-turn2-followup.png`, `j15-after-cafe.png`

## Full journey suite `prod-journey-j05-j20.spec.ts`

**16/16 PASS** on prod (5.2m) — after J10/J17 harness patch (2026-06-09T21:20Z)

| ID | Result | Notes |
|----|--------|-------|
| J05–J20 | PASS | J10: login redirect (SCREEN-016); J17: café @ 390px + `map-sheet-trigger` (SCREEN-018) |

Evidence: `prod-journey/j05-restaurants.png` … `j20-saved.png`, `j10-host-wizard.png`, `j17-mobile-map.png`

## Linear

SAN-546 **reopened → In Progress** (2026-06-09) until 16/16 green. Suite now **16/16 PASS** — ready for Done gate (user approval).

## Scores (post-verify)

| Metric | Score |
|--------|------:|
| SAN-860 pin clear | 100% |
| J15 production | 100% |
| SAN-861 harness (J14) | 100% (5/5 prod) |
| SAN-862 journey suite | 88% (14/16; J10/J17 spec gaps) |
| SAN-546 closure | 92% |
| Launch readiness (G2 matrix) | ~75% |

## Commands (repro)

```bash
# Tier 1
curl -s -o /dev/null -w "%{http_code}\n" https://www.mdeai.co/
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co

# Core
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/screens/SAN-546-j14-j15-prod.spec.ts --project=chromium

PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/screens/SAN-577B-rentals-map.spec.ts --project=chromium --grep mobile

# Full matrix
npm run test:e2e:prod-journey-j05-j20
```
