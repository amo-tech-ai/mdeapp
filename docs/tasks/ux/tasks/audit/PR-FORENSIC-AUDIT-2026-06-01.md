---
title: PR stack + G2c/G2d forensic audit
date: 2026-06-01
auditor: Cursor (systems architect / forensic)
main_sha: cd7fb09
prod: https://www.mdeai.co
evidence: tasks/testing/evidence/prod-smoke-2026-06-01.md
---

# PR forensic audit — 2026-06-01

## Executive verdict

| Metric | Score | Dot |
|--------|------:|:---:|
| **G2c ship (code on main)** | **95%** | 🟢 |
| **G2d prod smoke (before hotfix)** | **74%** | 🟡 |
| **G2d after [#33](https://github.com/amo-tech-ai/mdeapp/pull/33) deploy** | **~88%** (projected) | 🟡 |
| **PR hygiene / stack discipline** | **82%** | 🟡 |
| **Overall release readiness** | **78%** | 🟡 |

**Go/No-Go for “G2d complete”:** **No-Go** until [#33](https://github.com/amo-tech-ai/mdeapp/pull/33) merges, deploys, and Q4 café re-smoke passes on production.

**Real-world:** Camila asks “good specialty coffee in Laureles” on [mdeai.co](https://www.mdeai.co) today → she gets friendly text but **no café cards or map pins** (like a concierge who names shops but never shows photos on the map). Rentals/events/restaurants **do** show rich cards after G2c.

---

## Verification run (2026-06-01)

| Command / check | Result | Notes |
|-----------------|:------:|-------|
| `origin/main` | 🟢 `cd7fb09` | [#30](https://github.com/amo-tech-ai/mdeapp/pull/30) merged |
| Production deploy API | 🟢 `cd7fb09` | 2026-06-01T12:04:40Z |
| `curl https://www.mdeai.co/` | 🟢 200 | |
| G2d browser smoke (4 queries) | 🟡 3/4 PASS | Café FAIL — evidence `prod-smoke-2026-06-01.md` |
| `npm run lint` (hotfix branch) | 🟢 exit 0 | `hotfix/g2d-cafe-fast-path` |
| `npm test` (hotfix branch) | 🟢 **385/385** | +4 tests vs pre-G2c |
| [#33](https://github.com/amo-tech-ai/mdeapp/pull/33) CI | 🟢 green | lint · test · build SUCCESS |
| [#33](https://github.com/amo-tech-ai/mdeapp/pull/33) mergeable | 🟢 MERGEABLE | Ready to merge |

---

## Per-PR audit (requested links)

### Merged / closed (G2c stack)

| PR | Title | State | % correct | Dot | Grade | Critical findings | Corrections / next |
|----|-------|-------|----------:|:---:|:-----:|-------------------|-------------------|
| [#29](https://github.com/amo-tech-ai/mdeapp/pull/29) | DomainResults + rich venue cards | **MERGED** `d47bf16` | **93%** | 🟢 | A | Cards-only scope; no DATA pollution | None — do not reopen |
| [#30](https://github.com/amo-tech-ai/mdeapp/pull/30) | CK stabilize + UX e2e | **MERGED** `cd7fb09` | **90%** | 🟢 | A- | Stacked on #29 correctly; POST storm fix | None — superseded #27 |
| [#27](https://github.com/amo-tech-ai/mdeapp/pull/27) | UX-031 live audit e2e | **CLOSED** | **100%** | 🟢 | — | Superseded by #30 | Keep closed |
| [#28](https://github.com/amo-tech-ai/mdeapp/pull/28) | UX-036 restaurant fast path | **MERGED** | **88%** | 🟢 | B+ | On main before G2c cards | — |
| [#26](https://github.com/amo-tech-ai/mdeapp/pull/26) | UX-014 writer.custom | **MERGED** | **90%** | 🟢 | A- | Tool envelope pattern | — |
| [#25](https://github.com/amo-tech-ai/mdeapp/pull/25) | UX-013 venue_anchors | **MERGED** | **85%** | 🟢 | B+ | Café fallback when ADK down | Prod needs fast path (#33) |
| [#24](https://github.com/amo-tech-ai/mdeapp/pull/24) | UX-019 event memory | **MERGED** | **88%** | 🟢 | B+ | B-09 follow-up routing | — |
| [#22](https://github.com/amo-tech-ai/mdeapp/pull/22) | Live-audit B-fixes | **MERGED** | **85%** | 🟢 | B | PORT pin + audit fixes | — |
| [#21](https://github.com/amo-tech-ai/mdeapp/pull/21) | G1 error bridge | **MERGED** | **85%** | 🟢 | B | UX-015 foundation | — |

### Open — action required

| PR | Title | State | % correct | Dot | Grade | Critical findings | Corrections / next |
|----|-------|-------|----------:|:---:|:-----:|-------------------|-------------------|
| [#33](https://github.com/amo-tech-ai/mdeapp/pull/33) | Café grounded fast path | **OPEN** | **92%** (code) | 🟡 | A- | **Correct fix** for B1; **not on prod yet** | **Merge → deploy → Q4 re-smoke** |
| [#32](https://github.com/amo-tech-ai/mdeapp/pull/32) | SEARCH-001/002 hybrid | **OPEN** | **N/A** | ⚪ | — | Separate search track; not G2d | Do not mix with #33 |
| [#23](https://github.com/amo-tech-ai/mdeapp/pull/23) | DATA-005 supabase track | **OPEN** | **N/A** | ⚪ | — | **Explicitly out of G2d scope** | Do not touch during hotfix |
| [#31](https://github.com/amo-tech-ai/mdeapp/pull/31) | Vercel Web Analytics | **DRAFT** | **70%** | ⚪ | C | Bot PR; 380/381 tests noted | Merge after G2d or separately |
| [#20](https://github.com/amo-tech-ai/mdeapp/pull/20) | Embedding registry DEFERRED | **OPEN** | **N/A** | ⚪ | — | Blocked on DATA-042 / MIS-M2 | Do not merge pre-gate |
| [#19](https://github.com/amo-tech-ai/mdeapp/pull/19) | MIS hybrid search | **OPEN** | **N/A** | ⚪ | — | Depends on search stack | Defer |

---

## G2c / G2d task tracker

| Task | Description | Status | % | Dot | Confirmed | Missing / failing | Next action |
|------|-------------|--------|--:|:---:|-----------|-------------------|-------------|
| **G2c merge #29** | DomainResults, RestaurantCard, AttractionCard | Done | 100% | 🟢 | `d47bf16` on main | — | None |
| **G2c merge #30** | CK stable props, UX-021, e2e gates | Done | 100% | 🟢 | `cd7fb09` on main + prod | — | None |
| **G2c localhost proof** | p0 + card-unification + live-audit | Done | 100% | 🟢 | 11/11 e2e, 385 vitest | — | None |
| **G2d deploy verify** | Prod = `cd7fb09` | Done | 100% | 🟢 | GitHub Deployments API | — | None |
| **G2d Q1 rentals** | 1BR Laureles | Done | 95% | 🟢 | 5 cards + 5 pins | 1BR filter loose | UX nit only |
| **G2d Q2 events** | salsa weekend | Done | 90% | 🟢 | 6 event cards | No salsa this weekend copy | Acceptable fallback |
| **G2d Q3 restaurants** | suggest restaurants | Partial | 75% | 🟡 | 5 RestaurantCards | Photo placeholders only | Places enrichment follow-up |
| **G2d Q4 cafés** | specialty coffee Laureles | **Failed** | 0% | 🔴 | Prose only | No cards/pins | **Merge #33** |
| **G2d CK idle POST** | ≤10 in 30s | Done | 100% | 🟢 | 0 POSTs measured | — | Re-verify post-#33 |
| **HOTFIX-G2D-B1** | Café fast path | Ready | 95% | 🟡 | PR #33 CI green | Not deployed | Merge PR |
| **SAN-318** | Card unification epic | In progress | 70% | 🟡 | G2c shipped | G2d café blocker | Close after Q4 PASS |
| **UX-035** | Rental parser prod | Done | 95% | 🟢 | Q1 PASS on prod | — | Close |
| **DATA-048 / #23** | Migrations | Deferred | — | ⚪ | — | Intentionally untouched | Separate program |

---

## Stack / system health

| System | % | Dot | Real-world example | Red flags |
|--------|--:|:---:|--------------------|-----------|
| **CopilotKit 1.55.2** | 95% | 🟢 | Chat stable; no POST storm on prod idle | Stale dev → fake storms (local only) |
| **Mastra / Gemini** | 90% | 🟢 | Rentals/events tools work when fast-path doesn’t apply | Café relied on agent tool call → flaky |
| **Fast paths (client)** | 85% | 🟡 | Restaurant query → instant cards | **Café missing until #33** |
| **DomainResults / cards** | 92% | 🟢 | Rich cards on prod for 3 verticals | Restaurant photos placeholder |
| **Maps / pins** | 88% | 🟢 | “Open map (5)” on rental query | Café pins missing (B1) |
| **ADK grounding** | 75% | 🟡 | Works via tool + venue_anchors fallback | Prod ADK URL not user-facing path for café |
| **Supabase** | 76% | 🟡 | venue_anchors backs café API | #23 migrations not in G2d |
| **pgvector / SEARCH** | 35% | ⚪ | Future semantic search | #19/#20/#32 deferred |
| **OpenClaw** | 5% | ⚪ | Phase 2 VPS automation | Not started |
| **Commerce (Stripe)** | 65% | 🟡 | Checkout code exists | PAY-001/003 proofs open |

---

## Red flags & blockers (prioritized)

| # | Severity | Item | Type |
|---|----------|------|------|
| 1 | **P0** | Café prod: prose without `grounded-card` | **Blocker** — fixed in #33, not deployed |
| 2 | P1 | G2d not complete → SAN-318 stays open | Process |
| 3 | P1 | Restaurant card photos = placeholders on prod | UX / Places |
| 4 | P2 | 6 open PRs — risk of mixing DATA + UX + search | Process |
| 5 | P2 | `tasks/progres.md` stale (2026-05-30, HEAD `a9fffe8`) | Docs |
| 6 | P3 | CodeRabbit rate limit on #33 | Tooling only |
| 7 | P3 | Long-running `npm run dev` exit 1 (CK info loop) | Local dev hygiene |

**Not red flags:** Reopening #29/#30; rollback to `d47bf16` (would drop CK fix).

---

## Critical fixes (ordered)

1. **Merge** [#33](https://github.com/amo-tech-ai/mdeapp/pull/33) → production deploy.
2. **Re-smoke** Q4 only: `good specialty coffee in Laureles` → expect `grounded-card`, pins, `grounded-fast-path-panel`.
3. Update [`prod-smoke-2026-06-01.md`](../../testing/evidence/prod-smoke-2026-06-01.md) → G2d **PASS**.
4. Linear: SAN-318 comment + UX-035 close; keep SAN-318 Done only after G2d green.
5. **Do not** merge #23 or #32 into hotfix train.

---

## Best practices applied / recommended

| Practice | Status |
|----------|--------|
| One vertical per fast-path API (`/api/rentals`, `/api/restaurants`, `/api/grounded`) | 🟢 #33 follows pattern |
| Surgical hotfix off `main` | 🟢 `hotfix/g2d-cafe-fast-path` |
| Prod browser evidence before Done | 🟢 `prod-smoke-2026-06-01.md` |
| Do not conflate localhost PASS with prod PASS | 🟢 Documented |
| Separate DATA PRs from UX release | 🟡 Enforce on #32/#23 |
| Commit ledger / small PRs | 🟢 G2c was 2 PRs |

---

## Corrections per task (verify checklist)

| Task | Was audit claim correct? | Correction |
|------|--------------------------|------------|
| G2c cards work on prod | ✅ Yes | Rentals/events/restaurants verified |
| CK POST storm fixed | ✅ Yes | 0 idle POSTs on prod |
| Café failure = card regression | ❌ No | **Routing gap**, not DomainResults bug |
| Reopen #29/#30 | ❌ Wrong | **Do not** |
| UX-035 can close | ✅ Yes | Rental Q1 prod PASS |
| SAN-318 Done now | ❌ No | Wait G2d Q4 after #33 |
| #27 should reopen | ❌ No | Stay closed |
| #23 needed for café fix | ❌ No | venue_anchors already on main via #25 |

---

## Production readiness matrix

| Persona | Journey | Pre-#33 | Post-#33 (expected) |
|---------|---------|---------|---------------------|
| **Camila** | Rental search | 🟢 | 🟢 |
| **Camila** | Café search | 🔴 | 🟢 |
| **Tourist** | Restaurants | 🟡 (no photos) | 🟡 |
| **Andrés** | Ticket checkout | 🟡 | 🟡 (unchanged) |
| **Roberto** | Host wizard | 🟡 | 🟡 (unchanged) |

---

*Next audit trigger: within 24h of #33 production deploy + Q4 screenshot `04-cafes-hotfix.png`.*
