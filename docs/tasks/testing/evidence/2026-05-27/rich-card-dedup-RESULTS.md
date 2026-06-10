## Rich-card dedup 2026-05-27T20:30:13-05:00

Running 3 tests using 1 worker

(node:2557809) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:2557809) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  1 [chromium] › e2e/rich-card-dedup.spec.ts:24:7 › Rich card dedup — one listing surface per vertical › cafés — cards only, no Map results or sources list (9.9s)
  ✘  2 [chromium] › e2e/rich-card-dedup.spec.ts:37:7 › Rich card dedup — one listing surface per vertical › events — chat cards only, no Map results or panel card dupes (3.0m)
(node:2563006) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:2563006) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  3 [chromium] › e2e/rich-card-dedup.spec.ts:49:7 › Rich card dedup — one listing surface per vertical › rentals — cards only, no Map results strip (5.7s)


  1) [chromium] › e2e/rich-card-dedup.spec.ts:37:7 › Rich card dedup — one listing surface per vertical › events — chat cards only, no Map results or panel card dupes 

    [31mTest timeout of 180000ms exceeded.[39m

    Error: locator.waitFor: Test timeout of 180000ms exceeded.
    Call log:
    [2m  - waiting for locator('[data-testid="event-card"]').first() to be visible[22m


       at helpers/maps-layout.ts:152

      150 |       "Call search-events for salsa nightlife this weekend in Medellín and show ticketed events.",
      151 |     );
    > 152 |     await card.waitFor({ state: "visible", timeout: 120_000 });
          |                ^
      153 |   }
      154 | }
      155 |
        at waitForEventCards (/home/sk/mdeai/mdeapp/e2e/helpers/maps-layout.ts:152:16)
        at /home/sk/mdeai/mdeapp/e2e/rich-card-dedup.spec.ts:43:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/rich-card-dedup-Rich-card--89797-results-or-panel-card-dupes-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/rich-card-dedup-Rich-card--89797-results-or-panel-card-dupes-chromium/error-context.md

  1 failed
    [chromium] › e2e/rich-card-dedup.spec.ts:37:7 › Rich card dedup — one listing surface per vertical › events — chat cards only, no Map results or panel card dupes 
  2 passed (3.3m)
exit: 1
