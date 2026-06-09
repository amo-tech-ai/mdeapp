---
title: UX active test tasks
updated: 2026-06-01
parent: ../INDEX.md
archived_tests: ../../archive/shipped-on-vercel/tests/
---

# UX test tasks — active only

**Shipped test specs** (UX-T-013…037, CK, CU, etc.) → [`../../archive/shipped-on-vercel/tests/`](../../archive/shipped-on-vercel/tests/).

## Active test / platform specs

| Spec | Status | Notes |
|------|--------|-------|
| [UX-T-MA](UX-T-MA-mastra-mvp-tests.md) | 🟡 partial | Mastra CI |
| [UX-T-SB](UX-T-SB-supabase-mvp-tests.md) | 🟡 partial | Supabase |
| [UX-T-GM](UX-T-GM-maps-adk-grounding-mvp-tests.md) | 🟡 partial | Maps/ADK |
| [UX-T-RW](UX-T-RW-real-world-catalog.md) | ⚪ backlog | Post wave-1 |
| [AGENT-PROMPT](AGENT-PROMPT-chrome-playwright.md) | — | MCP exploratory |

## Commands (wave-1 + regression)

```bash
cd mdeapp && npm run dev
npm run test:e2e:visual-cards      # 4 vertical screenshots
npm run test:e2e:new-chat          # UX-032 (after merge)
npm run test:e2e:prod-synthetic    # UX-034 (needs PROD_SMOKE_BASE_URL)
npm run test:e2e:p0-focused
```

Archived implementations: `e2e/live-audit-verticals.spec.ts`, `e2e/card-unification.spec.ts`, `e2e/concierge-run-error.spec.ts`, etc. on `main`.
