# Bucket verification prompts — 2026-05-27

Use with [`tasks/testing/00-agent-testing-mandate.md`](../00-agent-testing-mandate.md).  
One bucket per session; restart dev between buckets if CopilotKit state is stale.

---

## PR1 — C-008 CopilotKit inspector

**Pre:** `cd mdeapp && npm run dev` → GET `/` 200  
**Browser:** Hard refresh `/` — no `ChunkLoadError` for `copilotkit_web-inspector`  
**Commands:** `npm run typecheck`

---

## PR2 — C-009 rich-card dedup

**Unit:**
```bash
npm test -- --run src/platform/copilot/__tests__/rich-card-results.test.ts \
  src/components/chat/__tests__/center-panel-map-results-slot.test.tsx
```
**Playwright:**
```bash
PW_SKIP_WEBSERVER=1 npx playwright test e2e/rich-card-dedup.spec.ts -g "cafés|rentals" --project=chromium
```
**Browser (manual):** After rental or café query, assert `[data-testid="results-column"]` count **0** when cards visible.

**Known fail (do not gate PR2):** `rich-card-dedup` **events** case — blocked on C-013.

---

## PR3 — C-010 + C-011 rentals (SAN-242, SAN-243)

**Prompt (Playwright + browser):**
```text
1BR apartment in Laureles under 80 dollars per night
```

**Unit:**
```bash
npm test -- --run src/lib/__tests__/rental-display.test.ts \
  src/lib/__tests__/rental-search-fast-path.test.ts \
  src/lib/__tests__/sanitize-assistant-chat-content.test.ts
```

**API:**
```bash
curl -s -X POST http://localhost:3001/api/rentals/search \
  -H 'Content-Type: application/json' \
  -d '{"neighborhood":"Laureles","minBedrooms":1,"maxPricePerNight":80}' | jq '.results|length'
# expect >= 1 (5 on current seed)
```

**Playwright:**
```bash
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-005-rental-card.spec.ts --project=chromium
```

**Assert:** ≥3 `[data-testid="rental-card"]`; 0× `What I searched for`; schedule modal opens.

**Prod (post-deploy only):**
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://www.mdeai.co/api/rentals/search \
  -H 'Content-Type: application/json' -d '{"neighborhood":"Laureles"}'
# must be 200 JSON — not 404
```

**Linear:** Keep SAN-242 / SAN-243 **In Review** until prod 200.

---

## PR4 — C-012 café UI

**Prompt:**
```text
Quiet cafés near Laureles
```
or pack [`03-cafe-detail-smoke.md`](../03-cafe-detail-smoke.md).

**Unit:**
```bash
npm test -- --run src/components/copilot/__tests__/cafe-result-card.test.ts \
  src/lib/place-details.test.ts \
  src/mastra/tools/__tests__/search-grounded-places-quality.test.ts
```

**Playwright:**
```bash
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts e2e/maps-grounding.spec.ts --project=chromium
```

**Maps MCP:** Field mask on Places New API calls (see `.cursor/rules/mdeai-google-maps.mdc`).

---

## PR5 — C-013 events fast-path

**Prompt:** Events chip → **Show all** OR:
```text
salsa events this weekend in Medellín
```

**Playwright (expect FAIL until EventFastPathPanel ships):**
```bash
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-006-event-card.spec.ts --project=chromium
PW_SKIP_WEBSERVER=1 npx playwright test e2e/rich-card-dedup.spec.ts -g events --project=chromium
```

**Pass criteria:** `[data-testid="event-card"]` in `#copilot-chat-region`; map list hidden.

---

## PR6 — docs / evidence only

No app tests. Verify evidence files exist under `tasks/testing/evidence/2026-05-27/`.
