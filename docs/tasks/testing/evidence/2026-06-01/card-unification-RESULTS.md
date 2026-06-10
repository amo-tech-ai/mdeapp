# UX-030 / UX-T-030 — card-unification (2026-06-01)

**Command:** `cd mdeapp && npm run test:e2e:card-unification`  
**Result:** 4/4 PASS (~6.5m, serial)  
**Also:** `npm run test:e2e:p0-focused` 3/3 PASS (~50s)

| Domain | `data-result-kind` | Side panel dup |
|--------|-------------------|----------------|
| Rental | rental | suppressed |
| Event | event | suppressed |
| Restaurant | restaurant | suppressed |
| Café | cafe (ADK 503 → venue_anchors fallback) | suppressed |
