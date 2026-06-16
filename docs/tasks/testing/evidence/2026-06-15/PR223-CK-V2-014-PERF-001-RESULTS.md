# PR #223 · CK-V2-014 + PERF-001 — localhost audit

**Branch:** `ai/ck-v2-014-card-render-perf-001` @ `2bc596b9`  
**Target:** `http://localhost:3001`  
**Time:** 2026-06-16T00:16:18Z  
**Preview:** blocked — Vercel SSO 401 on `mdeapp-git-ai-ck-v2-014-card-render-perf-001-mdeai.vercel.app`

## Verdict

**Localhost: PASS — safe to merge PR #223** after human confirms preview in browser (SSO-gated).

| Test | Result | Detail |
|------|--------|--------|
| PERF-001 load POSTs | PASS | **3** POSTs on `/chat` load (target ≤3) |
| Chat rentals | PASS | **5** rental-cards · **5** map pins · **2** POSTs for prompt |
| Chat events | PASS | **1** event-card · **1** map pin · **2** POSTs for prompt |
| Chat continuity | PASS | Follow-up answered · **3** POSTs total for 2-turn flow |
| Single `conciergeAgent` owner | PASS | Only `concierge-coagent-context.tsx` calls `useAgent({ agentId: "conciergeAgent" })` |
| Stream stability | PASS | No `thought_signature`, max update depth, or hydration errors |
| Preview Playwright | SKIP | HTTP 401 Vercel SSO — automated preview blocked |

## Console

Only benign Google Maps WebGL vector→raster fallback (Playwright headless). No CopilotKit or React critical errors.

## Screenshots

`docs/tasks/testing/evidence/2026-06-15/`

- `00-load-post-budget.png`
- `01-rentals.png`
- `02-events.png`
- `03-continuity.png`

## Follow-up (not in PR #223)

- `e2e/helpers/maps-layout.ts` — v2 send uses `.copilotKitInputControlButton` + `InputEvent` (local fix; commit separately for e2e suite)

## Next

1. Merge [PR #223](https://github.com/amo-tech-ai/mdeapp/pull/223)
2. Manual preview smoke (Vercel login) or post-merge prod Tier-1
3. Run **SAN-896 · CK-V2-008** evidence on fresh `origin/main`
