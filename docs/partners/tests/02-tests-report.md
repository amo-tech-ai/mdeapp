---
title: SAN-692 — MKT Partner Hub — Post-Merge Validation Report
updated: 2026-06-08 (re-run 2)
target: https://www.mdeai.co (production)
prod_deploy: 61e3f11 (PR #131 — MarketingPageShell + footer fix, merged + live)
pending_fix: PR #133 (hub cards → live typed signup) — OPEN, NOT merged/deployed
method: Real Chrome (claude-in-chrome MCP) deep DOM/console/perf pass + 10× in-page HTTP fetch stress + get_page_text signup verification + 3-viewport screenshots
caveats: chrome-devtools MCP (Lighthouse) unavailable — shared browser-profile lock; perf via Performance API; INP needs scripted interaction (not measured)
verdict: PARTIAL PASS — /partners page + signup funnel = GREEN; hub's 7 card destinations + 3 landing paths = 404 (HIGH, fix pending in PR #133)
---

# Post-Merge Validation — SAN-692 — MKT Partner Hub

## Did all tests run & pass?
**Ran: yes — 10 full cycles executed successfully. Pass: NO (partial).**
- ✅ `/partners` page + `/partners/signup` + all `?type=` routes: **10/10 green**, 0 console/React/hydration errors, footer 100% live, full a11y, CLS 0.
- ❌ **HIGH (still open):** the hub's 8 funnel cards link to **7 routes that 404** (`/venues`, `/sponsors`, `/business/ai`, `/partners/rentals`, `/partners/restaurants`, `/partners/cafes`, `/partners/nightlife`) — **10/10 404**. The fix (**PR #133** — repoint cards → live typed signup) is **OPEN, not merged/deployed**, so prod still serves the dead links. This will flip to PASS once #133 merges + Vercel deploys.

> Footer (PR #131 fix) is confirmed live & clean — 0 dead footer links. The remaining dead links are **card destinations**, addressed by the pending PR #133.

---

# Cycle Results

| Cycle | Pass | Fail | Errors |
|-------|------|------|--------|
| 1 | ⚠️ partial | card dests 404 | 0 console |
| 2 | ⚠️ partial | card dests 404 | 0 |
| 3 | ⚠️ partial | card dests 404 | 0 |
| 4 | ⚠️ partial | card dests 404 | 0 |
| 5 | ⚠️ partial | card dests 404 | 0 |
| 6 | ⚠️ partial | card dests 404 | 0 |
| 7 | ⚠️ partial | card dests 404 | 0 |
| 8 | ⚠️ partial | card dests 404 | 0 |
| 9 | ⚠️ partial | card dests 404 | 0 |
| 10 | ⚠️ partial | card dests 404 | 0 |

`/partners` shell + signup routes: **10/10 fully green** every cycle (0 console errors). "Partial" = the page is clean but its funnel cards point to 404 landings (pending PR #133).

---

# Route Status

| Route | HTTP (10×) | Console | Accessibility | Result |
|-------|-----------|---------|---------------|--------|
| `/partners` | **200 ×10** | 0 errors | landmarks ✅ · skip-link ✅ · 0 blockers | ✅ PASS |
| `/partners/signup` | **200 ×10** | 0 | form labels ✅ | ✅ PASS |
| `/partners/signup?type=host` | **200 ×10** | 0 | preselects "Event host" | ✅ PASS |
| `/partners/signup?type=venue` | **200 ×10** | 0 | preselects "Venue" | ✅ PASS |
| `/partners/signup?type=broker` | **200 ×10** | 0 | preselects "Rental broker" | ✅ PASS |
| `/partners/rentals` | **404 ×10** | n/a | n/a | ❌ unbuilt (SAN-691) |
| `/sponsors` | **404 ×10** | n/a | n/a | ❌ unbuilt (SAN-664) |
| `/business/ai` | **404 ×10** | n/a | n/a | ❌ unbuilt (SAN-663) |
| hub-card prefetch: `/venues`, `/partners/{restaurants,cafes,nightlife}` | **404** | — | — | ❌ unbuilt (SAN-661/713/714/712) |

**`/partners` deep DOM (live):** h1 "Grow your business with mdeai" · hero ✅ · **8 cards** ✅ · `data-testid="partner-hub"` ✅ · **card destinations: 7 of 8 still dead** → `cardDeadDest = [/venues, /partners/rentals, /sponsors, /business/ai, /partners/restaurants, /partners/cafes, /partners/nightlife]` · footer 11 live routes, **footerDead = []** ✅ · landmarks header/main/footer/4×nav ✅ · 0 imgs-without-alt · 0 links-without-name · skip-link ✅ · no app/React error.

**Signup flow:** type preselected correctly (host→"Event host", venue→"Venue", broker→"Rental broker"); form loads (Business name · Category · Neighborhood · "Activate partner account"). *(Client-side field validation not driven — JS injection blocked on the CopilotKit signup page; verify via Playwright form-fill.)*

---

# Performance (`/partners`, real Chrome)

| Metric | Best | Worst | Average |
|--------|------|-------|---------|
| TTFB | 493 ms | 493 ms | 493 ms |
| FCP | 1736 ms | 2972 ms (run 1) | ~2354 ms |
| LCP | **1736 ms** ✅ (run 2, warm) | 2972 ms (run 1, cold) | ~2354 ms |
| CLS | 0 | 0 | **0** ✅ |
| Load | 4227 ms | 4251 ms | ~4239 ms |
| INP | — | — | not measured (needs scripted interaction) |
| Route latency (10× fetch) | ~160 ms | ~800 ms (signup outlier) | ~220 ms |

Network: no failed assets on `/partners` itself; no 5xx in the controlled 10× fetch this run. (Run 1 saw transient 503 on RSC prefetch bursts — not reproduced here.) **LCP improved to 1.74s** (cold run 1 was 2.97s).

---

# Screenshots

Captured prod `/partners` at 3 viewports (run 1; prod visually unchanged this run — same deploy `61e3f11`). claude-in-chrome returns images inline without a project file path (path-capable chrome-devtools tool blocked by profile lock):

| Viewport | Size | ID | Observed |
|----------|------|----|----------|
| Desktop | 1440×900 | `ss_860994rlz` | hero + 4-up card grid, gold light-luxury |
| Tablet | 834×1112 | `ss_9736xwu6k` | 2-up grid, nav intact |
| Mobile | 390×844 | `ss_08428ad61` | 1-up stacked, CTAs full-width |

> To persist as files, re-run `chrome-devtools` `take_screenshot` (`filePath`) once the profile is free → `docs/partners/tests/screenshots/{desktop,tablet,mobile}.png`.

---

# Findings

## Critical
- **None.** No console/React/hydration errors; no app crash; `/partners` + signup deterministic 10/10.

## High
- **Hub funnel cards link to 7 unbuilt routes that 404** (10/10) — `cardDeadDest` confirmed live on prod. Violates SAN-692 AC "card destinations exist / no dead links at launch". **Fix is staged in PR #133** (repoint cards → `/partners/signup?type=…`), currently **OPEN — merge + deploy to resolve.** (Alt PR #123 stubs the landings — pick one approach.)

## Medium
- LCP cold-load was 2.97s (run 1); warm 1.74s (run 2). Watch under real traffic.
- Transient 503 on RSC prefetch bursts (run 1; not reproduced run 2) — Vercel edge.

## Low
- Card CTA copy ("Explore venues program →") implies a landing that 404s — also resolved by PR #133 (CTAs → "Start as …").
- Signup client-side field validation not exercised (JS injection blocked on signup page) — add a Playwright form-fill test.

---

# Final Grade

| Area | Score | Notes |
|------|-------|-------|
| Stability | **A** | 10/10 on built routes, 0 console errors, deterministic across re-runs |
| UX | **B−** | Hub + signup excellent; 7/8 card CTAs lead to 404 (pending PR #133) |
| Accessibility | **A−** | Landmarks/alt/names/skip-link clean; full contrast/axe + keyboard-tab not driven (Lighthouse blocked) |
| Performance | **B+** | CLS 0; LCP 1.74s warm / 2.97s cold; 11KB doc, fast TTFB |
| Navigation | **C** | 3/5 prompt partner paths + 7 hub-card destinations 404 (fix pending) |
| Production Readiness | **B−** | Page/shell production-ready; funnel has dead card destinations until PR #133 lands |

---

## Gate decision
- **`/partners` page + MarketingPageShell + signup funnel: PASS** (stable, clean, accessible).
- **Full funnel: NOT yet green** — blocked on **PR #133** (hub cards → live signup) merging + deploying. Re-run this validation after #133 is on prod; expected result = all card destinations 200, Navigation → A, no dead links anywhere.

**No code changed · no tasks created · SAN-690 not started — validation + report only, per instructions.**
