---
title: G2d production smoke — mdeai.co
date: 2026-06-01
main_sha_pre_hotfix: cd7fb09
main_sha_post_hotfix: a8b33a2
hotfix_commit: 259f1ef
pr29_merge: d47bf16
pr30_merge: cd7fb09
pr33_merge: a8b33a2
vercel: https://vercel.com/amo100/mdeapp
prod: https://www.mdeai.co
g2d_status: PASS
hotfix: HOTFIX-G2D-B1 — deployed
san318: Done
auditor: Cursor agent (browser MCP)
browser: Cursor IDE Browser (Chromium), desktop viewport
---

# G2d production smoke — 2026-06-01

## 1. Deployment verification

| Check | Pre-hotfix (`cd7fb09`) | Post-hotfix (#33) |
|-------|------------------------|-------------------|
| Production SHA | `cd7fb09` @ 2026-06-01T12:04:40Z | **`a8b33a2`** @ 2026-06-01T12:49:00Z |
| Hotfix commit in tree | — | **`259f1ef`** (squash content in merge commit) |
| Site health | HTTP 200 | HTTP 200 |
| CI on merge | lint · test · build SUCCESS | Same (#33) |

**Production URL:** https://www.mdeai.co/  
**G2c deploy:** `cd7fb09` (`#30`)  
**G2d hotfix deploy:** `a8b33a2` (`fix(ux): add cafe grounded fast path for production smoke (#33)`)

---

## 2. G2d query matrix (browser proof)

### Pre-hotfix (`cd7fb09`) — 2026-06-01 morning

| # | Query | Result |
|---|--------|--------|
| 1 | `1BR in Laureles under $80/night` | **PASS** |
| 2 | `salsa events this weekend` | **PASS** |
| 3 | `suggest restaurants medellin` | **PARTIAL** (photo placeholders) |
| 4 | `good specialty coffee in Laureles` | **FAIL** (prose only, 0 cards/pins) |

Screenshots: `prod-smoke/01-rentals.png` … `04-cafes.png`

### Post-hotfix Q4 re-smoke only — 2026-06-01 @ `a8b33a2`

**Session:** https://www.mdeai.co/?g2d=q4-hotfix-2026-06-01 (fresh chat)

| Criterion | Result | Proof |
|-----------|--------|-------|
| `grounded-fast-path-panel` | **PASS** | `data-testid="grounded-fast-path-panel"` present |
| Grounded cards | **PASS** | **5** × `[data-testid="grounded-card"]` |
| `data-result-kind="cafe"` | **PASS** | 5 cards, all `cafe` |
| Not prose-only | **PASS** | Assistant: “Found 5 specialty coffee shops…” **+** structured cards |
| Map pins | **PASS** | “Open map with **5** pins”; `noPinsYet: false` |
| Duplicate side panel | **PASS** | `genericDup: 0`, `duplicateSideRows: 0` |
| `POST /api/grounded/search` | **PASS** | **1** request (in-page fetch hook) |
| CK during turn | **PASS** | **0** copilotkit POSTs (fast path, no agent) |
| CK idle 32s | **PASS** | **0** additional copilotkit POSTs |
| Console | **PASS** | `consoleErrors: []` |

**Cafés named on prod:** Rituales Compañía de Café, Pergamino Café Laureles, Café Revolución, Semilla Café Coworking, Café Namazzi

**Screenshot:** `tasks/testing/evidence/prod-smoke/04-cafes-hotfix.png`

---

## 3. PR #33 forensic review (pre-merge)

| Gate | Verdict |
|------|---------|
| No DATA / Supabase / migrations | **PASS** — 0 files under `supabase/` |
| Rentals / events / restaurants unchanged | **PASS** — only café intercept + API route |
| CK reconnect regression | **PASS** — fast path bypasses `onSend`; prod idle 0 POSTs |
| Intercept order | **PASS** — rental → event → **grounded** → restaurant → agent |
| Generic restaurant not intercepted | **PASS** — vitest: `suggest restaurants medellin` → false |
| Renders via `GroundedCafeResults` | **PASS** — `GroundedFastPathPanel` |
| Pin normalization | **PASS** — `normalizeToolOutput("grounded")` + `mergePinsByCategory` |

**PR score:** **96/100** — surgical, reversible, matches rental/event/restaurant pattern.

**Files (11):** `api/grounded/search`, `cafe-search-fast-path.ts`, `use-grounded-search-fast-path.ts`, panel/context, 3-line wiring in chat shell + input, export `GroundedCafeResults`.

---

## 4. Pass-criteria checklist (final)

### Rentals — **PASS** (unchanged by #33)

### Events — **PASS**

### Restaurants — **PARTIAL** (photo placeholders — non-blocking)

### Cafés — **PASS** (post-#33)

- [x] Grounded café cards (`grounded-card` / `data-result-kind="cafe"`)
- [x] Fast-path summary (not agent-only prose)
- [x] Map pins (5)
- [x] `curatedFallback` path available server-side when ADK thin

### CopilotKit — **PASS**

| Check | Result |
|-------|--------|
| 30s idle POST count ≤ 10 | **0** |
| Reconnect storm | None |
| `/api/copilotkit` on café turn | **0** (deterministic fast path) |

---

## 5. Production readiness score (post-G2d)

| Dimension | Score | Notes |
|-----------|------:|-------|
| Deploy correctness | 100/100 | `a8b33a2` live |
| Rentals (UX-035) | 95/100 | Prod verified |
| Events | 90/100 | |
| Restaurants | 75/100 | Photo placeholders |
| Cafés / grounding | **95/100** | Fast path + cards + pins |
| CopilotKit stability | 100/100 | |
| **Overall production readiness** | **92/100** | **G2d PASS** |

---

## 6. Release decision

| Item | Verdict |
|------|---------|
| **G2d** | **PASS** |
| **SAN-318** | **Done** |
| **UX-035 (SAN-433)** | **Done** (rental prod verify) |
| **Rollback** | **Not recommended** — hotfix is additive; prior `cd7fb09` lacked café cards |
| **Next work** | UX-020/023/028/029 after brief soak; restaurant photos as separate UX fix |

### Remaining blockers (non-G2d)

| ID | Severity | Item |
|----|----------|------|
| B2 | UX | Restaurant Places photos on prod |
| B3 | Nit | Rental “1BR” filter precision |
| — | Deferred | DATA-048 / PR #23, SEARCH #32, analytics #31 |

---

## 7. Network / DevTools summary (Q4 hotfix session)

```text
POST /api/grounded/search     → 1 (200, 5 results)
POST /api/copilotkit/*        → 0 (café turn + 32s idle)
console.error                 → 0
```

Method: in-page `fetch`/`XHR` hooks (`window.__g2dEvidence`) on https://www.mdeai.co

---

## 8. Pass/fail summary

| Area | Status |
|------|--------|
| Vercel prod `a8b33a2` / `259f1ef` | PASS |
| G2d Q1 rentals | PASS |
| G2d Q2 events | PASS |
| G2d Q3 restaurants | PARTIAL |
| G2d Q4 cafés (post-#33) | **PASS** |
| CK idle POST budget | PASS |
| SAN-318 close | **YES** |
| UX-035 prod verify | **YES** |
| Ship G2d complete | **YES** |
