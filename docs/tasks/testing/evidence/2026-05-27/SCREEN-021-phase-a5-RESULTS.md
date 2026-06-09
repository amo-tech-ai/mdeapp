# SCREEN-021 Phase A.5 — localhost verify (2026-05-27)

## Dev restart

```bash
pkill -f "next dev"; pkill -f "mastra dev"; sleep 2
cd /home/sk/mdeai/mdeapp && npm run dev
curl GET / -> 200
node tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001 -> All checks passed
```

## Playwright (`PW_SKIP_WEBSERVER=1`, fresh dev)

| Test | Result |
|------|--------|
| cards + map sync + detail panel + booking | **PASS** |
| ask prompt keeps panel open | **PASS** |
| mobile overflow | **PASS** |
| best cafes medellin no JSON leak | **PASS** |

**4/4 passed** (42s, `--workers=1`)

## Browser MCP (sample prompt)

**Prompt:** `Quiet cafés near Laureles`

| Step | Result |
|------|--------|
| Cards in center chat | **PASS** (4 candidates, `grounded-card`) |
| Click Details | **PASS** `data-right-column-mode="detail"` |
| CafeDetailPanel + Overview tab | **PASS** |
| Close (×) | **PASS** → `data-right-column-mode="map"` |

## Rule added

`.cursor/rules/mdeai-localhost-verify.mdc` — restart dev + browser/Playwright before Done.

## Test pack

`tasks/testing/03-cafe-detail-smoke.md`
