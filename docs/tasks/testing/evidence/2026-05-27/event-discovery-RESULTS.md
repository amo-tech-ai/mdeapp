## Events SCREEN-006 2026-05-27T20:26:25-05:00

Running 3 tests using 1 worker

(node:2551116) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:2551116) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  1 [chromium] › e2e/screens/SCREEN-006-event-card.spec.ts:28:9 › SCREEN-006 event card polish › desktop › generic event query clarifies without cards (9.8s)
  ✘  2 [chromium] › e2e/screens/SCREEN-006-event-card.spec.ts:42:9 › SCREEN-006 event card polish › desktop › event query renders cards, buy CTA, and map pins (2.5m)
  -  3 [chromium] › e2e/screens/SCREEN-006-event-card.spec.ts:86:9 › SCREEN-006 event card polish › mobile › event cards render in center chat


  1) [chromium] › e2e/screens/SCREEN-006-event-card.spec.ts:42:9 › SCREEN-006 event card polish › desktop › event query renders cards, buy CTA, and map pins 

    [31mTest timeout of 150000ms exceeded.[39m

    Error: locator.waitFor: Test timeout of 150000ms exceeded.
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
        at /home/sk/mdeai/mdeapp/e2e/screens/SCREEN-006-event-card.spec.ts:48:7

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/screens-SCREEN-006-event-c-d2362--cards-buy-CTA-and-map-pins-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/screens-SCREEN-006-event-c-d2362--cards-buy-CTA-and-map-pins-chromium/error-context.md

  1 failed
    [chromium] › e2e/screens/SCREEN-006-event-card.spec.ts:42:9 › SCREEN-006 event card polish › desktop › event query renders cards, buy CTA, and map pins 
  1 did not run
  1 passed (2.7m)
exit: 1
