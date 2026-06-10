# VEN-025 — prod nightlife routing smoke (#85)

**Merge:** PR #85 → `main` @ `f8ac95b`  
**Date:** 2026-06-06  
**Linear:** SAN-549 / VEN-025

## Prod smoke (www.mdeai.co)

| Prompt | Event cards | Nightlife/grounded | Result |
|--------|-------------|-------------------|--------|
| `popular clubs tonight in Provenza` | **0** | ≥1 nightlife/grounded | **PASS** |
| `popular venues tonight in Provenza` | **0** | ≥1 nightlife/grounded | **PASS** |

**Note:** First run ~3 min post-merge still returned 10 event cards (stale deploy). Re-run after Vercel propagation → **2/2 PASS**.

## Commands

```bash
curl -s -o /dev/null -w "GET / -> %{http_code}\n" https://www.mdeai.co/
node tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co

cd mdeapp
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/prod-ven025-nightlife-routing.spec.ts --project=chromium --workers=1
```

## Regression guard (unit, pre-merge)

`nightlife this weekend in Poblado` → still event fast-path (unchanged).

## Related

- Pre-deploy evidence: [`VEN-025-generic-venues-routing-2026-06-04.md`](../VEN-025-generic-venues-routing-2026-06-04.md)
- Prior prod gap: [`SAN-549-prod-live-RESULTS-2026-06-04.md`](../SAN-549-prod-live-RESULTS-2026-06-04.md) — generic venues hit events before #85
