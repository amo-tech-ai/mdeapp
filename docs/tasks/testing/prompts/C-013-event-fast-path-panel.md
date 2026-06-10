# C-013 — event fast-path inline cards

**After C-012 merged** — rebase before opening PR.  
**Task:** [`tasks/commit/may-27/tasks/C-013-event-fast-path-panel.md`](../../commit/may-27/tasks/C-013-event-fast-path-panel.md)  
**Skills:** `copilotkit-integrations`, `testing`

## Localhost

1. Open `/`
2. Tap **Events** chip or query: `music events this weekend`
3. Verify:
   - ≥1 `[data-testid="event-card"]` **in chat** (not map list only)
   - Map shows event pins
   - No duplicate generic "Map results" column
   - Click card → pin focus on map

## Playwright

```bash
cd /home/sk/mdeai/mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-006-event-card.spec.ts --project=chromium
PW_SKIP_WEBSERVER=1 npx playwright test e2e/rich-card-dedup.spec.ts -g event --project=chromium
```

## Classifier regression (PR #7)

After C-013, confirm rental/café still **not** hijacked:

```bash
npm test -- --run src/lib/__tests__/event-query-classifier.test.ts
```

Queries: `1BR in Laureles`, `quiet cafés in Poblado` → **not** event fast-path.

## Pass matrix

| # | Check | Pass |
|---|-------|:----:|
| 1 | **BLOCKING:** SCREEN-006 3/3 | |
| 2 | ≥1 `event-card` in chat (not map-only) | |
| 3 | Rich-card dedup (events) | |
| 4 | Classifier tests — rental/café not hijacked | |
| 5 | No duplicate generic Map results | |
| 6 | `npm run floor` green | |
| 7 | C-012 already on `main` | |

## Evidence

`tasks/testing/evidence/YYYY-MM-DD/C-013-RESULTS.md`
