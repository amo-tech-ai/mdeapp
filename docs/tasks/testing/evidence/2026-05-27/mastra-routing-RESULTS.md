## mastra-routing 2026-05-27T20:24:45-05:00
--- Vitest routing classifiers ---

PASS  Vitest rental-search-fast-path — exit 0
PASS  Vitest event-search-fast-path — exit 0
PASS  Vitest search-grounded-places-quality — exit 0

--- API fast paths (inventory) ---

PASS  CopilotKit runtime reachable — 400 623ms
PASS  Rental prompt → /api/rentals/search — 566ms
PASS  Event inventory → /api/events/search — 182ms

NOTE: Full conciergeAgent tool routing requires Browser/Playwright (see 05-mastra-copilot-routing-smoke.md).

All routing smoke checks passed
exit: 0
