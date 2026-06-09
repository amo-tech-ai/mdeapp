# Linear UX view sync — 2026-06-01

**View:** https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725  
**Source:** `tasks/ux/tasks/INDEX.md` + localhost e2e 2026-06-01

## Issues moved to **Done**

| SAN | Task | Notes |
|-----|------|-------|
| SAN-427 | UX-013 | venue_anchors café fallback (#25) |
| SAN-428 | UX-014 | writer.custom removed (#26) |
| SAN-429 | UX-019 | B-09 memory guard (#24) |
| SAN-430 | UX-016 | concierge-run-error e2e |
| SAN-431 | UX-031 | live-audit-verticals 4/4 e2e |
| SAN-320 | UX-015 | Error bridge (#21) |
| SAN-324 | UX-027 | RentalCard copy |
| SAN-434 | UX-021 | Card a11y data-result-kind |
| SAN-435 | UX-022 | DomainResults |
| SAN-439 | UX-025 | RestaurantCard rich |
| SAN-441 | UX-030 | card-unification e2e |
| SAN-442 | UX-026 | AttractionCard rich |
| SAN-319 | UX-005 | Merged into UX-015 |
| SAN-362 | VEN-001 | Epic child — restaurant cards |
| SAN-363 | VEN-002 | Epic child — attraction cards |
| SAN-365 | AIA-014 | Epic child — card tests |
| SAN-433 | UX-035 | G2d Q1 rental PASS on prod @ `cd7fb09` |

## Epic **Done** (2026-06-01 post-#33)

| SAN | Task | Notes |
|-----|------|-------|
| SAN-318 | UX-010 | G2c + G2d PASS @ `a8b33a2` / `259f1ef` |

## **Canceled**

| SAN | Task | Notes |
|-----|------|-------|
| SAN-432 | UX-017 | Superseded by [PR #32](https://github.com/amo-tech-ai/mdeapp/pull/32) merged `3af7ea0` — do not rebase #19 |

## Wave 1 **Done** (2026-06-01) — merged + Vercel

| SAN | Task | PR | Linear | Prod |
|-----|------|-----|--------|------|
| SAN-440 | UX-028 | [#35](https://github.com/amo-tech-ai/mdeapp/pull/35) | Done | ✅ photos proxy |
| SAN-321 | UX-032 | [#36](https://github.com/amo-tech-ai/mdeapp/pull/36) | Done | ✅ deployed |
| SAN-322 | UX-034 | [#37](https://github.com/amo-tech-ai/mdeapp/pull/37) | Done | ✅ cron + dispatch green |

**main** `c9e54b8` · Evidence: `tasks/testing/evidence/prod-synthetic-smoke-2026-06-01.md`, `visual-cards-prod/`

## Legacy UX-006 / 007 / 009

| Legacy | Successor | Status |
|--------|-----------|--------|
| UX-006 | UX-032 / SAN-321 | ✅ Done on Vercel |
| UX-009 | UX-034 / SAN-322 | ✅ Done on Vercel |
| UX-007 | UX-033 / SAN-323 | ⚪ Todo |

**UX-010** epic → **SAN-318 Done** on prod.

## Still **Todo** (backlog)

| Priority | SAN | Task |
|----------|-----|------|
| P2 | SAN-436 → SAN-437 | UX-020 CardInteractionProps → UX-023 ResultCardShell |
| P2 | SAN-438 | UX-024 hover→pin rental/event |
| P3 | SAN-323 | UX-033 stale markers |
| P3 | SAN-443 | UX-029 retire GroundedPlaceCard |
| canceled | SAN-432 | UX-017 superseded by PR #32 |

## **Backlog**

SAN-444 UX-018 (ADK Vercel Phase 2) · SAN-360/364 epic children (M0/M4 → UX-023/029)

## G2d prod smoke (2026-06-01) — **PASS**

| Query | Prod |
|-------|------|
| Rentals | ✅ |
| Events | ✅ |
| Restaurants | ✅ (Places photo proxy post-#35) |
| Cafés | ✅ (post-#33) |
| CK idle | ✅ |

**Hotfix:** https://github.com/amo-tech-ai/mdeapp/pull/33 **MERGED** · prod `a8b33a2`

## No Linear issue (disk only)

UX-036 restaurant fast path — merged #28; consider creating SAN-* or link to VEN-001.

## Evidence links

- `tasks/testing/evidence/prod-smoke-2026-06-01.md`
- `tasks/ux/tasks/audit/PR-FORENSIC-AUDIT-2026-06-01.md`
- `tasks/testing/evidence/2026-06-01/live-audit-verticals-RESULTS.md`
- `tasks/testing/evidence/2026-06-01/card-unification-RESULTS.md`
