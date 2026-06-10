## Rentals SCREEN-005 2026-05-27T20:25:46-05:00

Running 3 tests using 1 worker

(node:2549775) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:2549775) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  1 [chromium] › e2e/screens/SCREEN-005-rental-card.spec.ts:24:9 › SCREEN-005 rental card polish › desktop › cards show CTAs and schedule modal opens (3.3s)
  ✓  2 [chromium] › e2e/screens/SCREEN-005-rental-card.spec.ts:46:9 › SCREEN-005 rental card polish › desktop › card click selects map pin (F50 sync) (3.6s)
  ✓  3 [chromium] › e2e/screens/SCREEN-005-rental-card.spec.ts:68:9 › SCREEN-005 rental card polish › mobile › rental cards render in center chat (1.7s)

  3 passed (9.2s)

## Browser (Cursor) — 2026-05-27

**Prompt:** `Show me rentals in Laureles under $80 per night with good WiFi.`

| Assert | Result |
|--------|--------|
| `[data-testid="rental-card"]` | **5** |
| `[data-testid="results-column"]` | **0** |
| `[data-testid="rental-schedule-cta"]` | **5** |

**Verdict:** **PASS** (localhost UI)

## Prod

`POST https://www.mdeai.co/api/rentals/search` → **404** (not deployed)
exit: 0
