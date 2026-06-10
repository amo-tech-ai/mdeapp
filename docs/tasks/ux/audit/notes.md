The café e2e job finished with **exit code 1** after ~14.5 minutes — not a shell crash, **5/5 chromium tests failed**.

**Common failure:** `waitForCafeGroundedCards` timed out (180s test / 120s wait) — `[data-testid="grounded-card"][data-result-kind="cafe"]` never showed. That hit:

- `e2e/maps-grounding.spec.ts` (1 test)
- `SCREEN-021-cafe-listings.spec.ts` (4 tests)

So this blocks **PR B preview/café verification**, not the **PR A runtime** slice. Typical causes: dev server not ready, missing `GOOGLE_*` / ADK grounding keys, agent didn’t call `search-grounded-places`, or flaky concierge latency.

Screenshots are under `mdeapp/test-results/screens-SCREEN-021-*`. Re-run when you’re executing PR B:

```bash
cd mdeapp && npx playwright install chromium
npm run dev   # clean :3001
npx playwright test e2e/maps-grounding.spec.ts e2e/screens/SCREEN-021-cafe-listings.spec.ts --project=chromium --workers=1
```
