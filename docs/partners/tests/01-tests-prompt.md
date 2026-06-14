---
title: SAN-692 — MKT Partner Hub — Post-Merge Validation Prompt (10× cycle)
updated: 2026-06-08
target: https://www.mdeai.co
scope: Validate the SAN-692 partner funnel on production before starting SAN-690 — MKT Partner Dashboard
tools: Chrome MCP (claude-in-chrome / chrome-devtools) + Playwright MCP — real Chrome, production
report: ./02-tests-report.md
rules: No code changes · no task creation · no SAN-690 work · validate + report only
---

# Post-Merge Validation — SAN-692 — MKT Partner Hub

**Goal:** stress-test the production partner funnel 10× before starting **SAN-690 — MKT Partner Dashboard**.

## Procedure (per cycle ×10)
1. Open Chrome (real browser, not headless).
2. Navigate to `https://www.mdeai.co/partners`.
3. Verify: HTTP 200 · page renders · no console errors · no React errors · no hydration errors · no 404 assets · no a11y blockers.
4. Validate **SAN-692 — MKT Partner Hub**: hero visible · partner cards visible · footer visible · footer contains only live routes · no dead links.
5. Test every partner path — expect **HTTP 200** for `/partners` and `/partners/signup` (live); expect **HTTP 404** for `/partners/rentals`, `/sponsors`, `/business/ai` (not built yet — planned landings SAN-691 · MKT — For Rentals/Brokers, SAN-664 · MKT — Sponsors, SAN-663 · MKT — AI Services). For all: no console errors · no broken navigation. The 404s are a known funnel gap, not a SAN-692 regression.
6. Test signup flow — `/partners/signup?type=host|venue|broker` — verify type preselected · form loads · validation works · no JS errors.
7. Performance: LCP · CLS · INP · network failures · slow requests.
8. Accessibility: keyboard nav · focus states · landmark structure · missing labels · contrast.
9. Screenshots: desktop · tablet · mobile.
10. Repeat ×10.

## Output sections
Cycle Results · Route Status · Performance · Screenshots · Findings (Critical/High/Medium/Low) · Final Grade.

---

## ⚠️ Prompt verification (run-correctness review, 2026-06-08)

The prompt runs correctly **with three corrections** found while executing it:

1. **Step 5 expectation is wrong for current prod.** `/partners/rentals`, `/sponsors`, `/business/ai` are **not built yet** — they return **404** (10/10), not 200. They are planned M1 landings (**SAN-691 — MKT For Rentals/Brokers**, **SAN-664 — MKT Sponsors**, **SAN-663 — MKT AI Services**). Expected status for these = **404 until those tasks ship**. The hub's 8 funnel cards also point at these → their RSC prefetches 404. Treat as a known funnel gap, not a regression of **SAN-692** / the MarketingPageShell.
2. **Step 6 "validation works"** can't be fully exercised headlessly here — the signup page blocked JS injection (CopilotKit context); form *load* + field presence + type preselection were verified via DOM text extraction, but client-side field validation was not driven. Use Playwright form-fill to exercise validation.
3. **Step 7 INP** cannot be measured without a real interaction; LCP/CLS are measurable from the Performance API on load. INP requires a scripted click/keypress (Playwright) to record.

Otherwise steps 1–4 and 8–10 run as written. Environment caveat: `chrome-devtools` MCP (Lighthouse) was unavailable (shared browser-profile lock); perf captured via the Performance API instead.
