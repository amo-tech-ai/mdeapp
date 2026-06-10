---
title: UX fixes — live-site QA remediation (UX-001…010)
updated: 2026-05-31
owner: claude
plan: ../../plan.md
imp_range: IMP-093…102
source_qa: ../testing/evidence/2026-05-28/live-site-qa-checklist.md
source_audit: ../testing/evidence/2026-05-28/ux-audit-report.md
prod: https://www.mdeai.co
---

# UX fixes — live-site QA remediation

> **Active backlog:** [`tasks/INDEX.md`](tasks/INDEX.md) (UX-028…034 + polish) · **Shipped on Vercel:** [`archive/INDEX.md`](archive/INDEX.md) (UX-013…036, epic UX-010) · **Linear:** [UX tasks view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725)
> **Evidence:** [`live-site-qa-checklist.md`](../testing/evidence/2026-05-28/live-site-qa-checklist.md) (findings F-1…F-6) · [`ux-audit-report.md`](../testing/evidence/2026-05-28/ux-audit-report.md) (production-readiness **48/100**).
> **Headline:** the rental fast-path works end-to-end; **conciergeAgent (café/events/restaurants/attractions/day-trips) is dead on prod** with a silent `RUN_ERROR (EAUTHTIMEOUT)/INCOMPLETE_STREAM`, plus an undeployed `$500 a night` price-parsing bug.

## Guiding rules (from the request)

1. **Fix failure visibility first** — surface errors (UX-002) and show progress (UX-005) before chasing the root cause (UX-001), so users are never left in silence.
2. **Do not rewrite the UI.** Each task is a targeted change (an error bubble, a flag, a copy string, a regex), not a redesign.
3. **Do not touch the working rental fast-path** — *only* UX-003 may edit `rental-query-parser.ts`.
4. **Every task ships with tests** and **requires real evidence before Done** (CLAUDE.md localhost/prod runtime-proof gate).
5. **Beginner-friendly** specs — each file has a "Beginner explanation" and a "Do not overbuild" section.

> **Execution order:** [`../../plan.md`](../../plan.md) **Tier 1C** (P0 priority, ‖ MVP exit Sequence B) · router: [`../INDEX.md`](../INDEX.md)

## Build order (corrected 2026-05-29)

```text
IMP-093 UX-003 → IMP-094 UX-002 + IMP-095 UX-005 (same PR) → IMP-101 UX-009
  → IMP-098 UX-006 + IMP-099 UX-007 → IMP-100 UX-008
IMP-097 UX-001 🟢 (shipped PR #13)
IMP-096 UX-004 optional — skip if concierge stays green
IMP-102 UX-010 M0→M5 after C-012 merge (separate PRs)
```

## Tasks

| # | IMP | ID | Linear | Title | Sev | Status |
|---|----:|----|--------|-------|-----|--------|
| 1 | 093 | UX-003 | [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) | Deploy "$500 a night" price-wording parser fix | High | 🟢 → [UX-035](archive/shipped-on-vercel/specs/UX-035-rental-parser-prod-verify.md) |
| 2 | 094 | UX-002 | [SAN-320](https://linear.app/sanjiovani/issue/SAN-320) | Render user-facing error on RUN_ERROR/timeout | High | 🟢 → [UX-015](archive/shipped-on-vercel/specs/UX-015-ship-pr17-error-bridge-split-scope.md) |
| 3 | 095 | UX-005 | [SAN-319](https://linear.app/sanjiovani/issue/SAN-319) | Concierge "thinking" indicator (same PR as UX-002) | Med | 🟢 → UX-015 (archived) |
| 4 | 101 | UX-009 | [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) | Prod synthetic concierge monitor | Med | ⚪ → [UX-034](tasks/UX-034-prod-synthetic-concierge-monitor.md) |
| 5 | 098 | UX-006 | [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) | New chat resets thread + map | Med | ⚪ → [UX-032](tasks/UX-032-new-chat-reset-thread-and-map.md) |
| 6 | 099 | UX-007 | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | Clear stale AdvancedMarkers | Med | ⚪ → [UX-033](tasks/UX-033-clear-stale-advanced-markers.md) |
| 7 | 100 | UX-008 | [SAN-324](https://linear.app/sanjiovani/issue/SAN-324) | Fix Save tooltip copy | Low | 🟢 → [UX-027](archive/shipped-on-vercel/specs/UX-027-rental-card-copy-leaks.md) |
| 8 | 097 | UX-001 | [SAN-315](https://linear.app/sanjiovani/issue/SAN-315) | Restore conciergeAgent on prod | Critical | 🟢 [archived](archive/legacy/) |
| 9 | 096 | UX-004 | [SAN-317](https://linear.app/sanjiovani/issue/SAN-317) | Disable Events/Food chips (*optional*) | High | 🚫 Canceled [archived](archive/legacy/) |
| 10 | 102 | UX-010 | [SAN-318](https://linear.app/sanjiovani/issue/SAN-318) | Unified result-card architecture | High | 🟢 → [UX-010 strategy](archive/shipped-on-vercel/specs/UX-010-CARD-UNIFICATION-STRATEGY.md) |

> **UX-010 is a separate theme** from the UX-001…009 live-site remediation: it is an architecture/render-layer **audit + convergence plan** (not a prod hotfix). It depends on the café de-dup branch (`feat/c012-cafe-places-detail`) as its single-domain proof. See the doc's §7 migration order (M0→M5).

## Dependencies & couplings

- **UX-004 ↔ UX-001:** UX-004 is a *temporary* mitigation (gate `CONCIERGE_ENABLED`); UX-001's Done step flips the flag back on (or reverts UX-004).
- **UX-009 → UX-001:** the synthetic monitor goes green only once UX-001 restores the concierge; reuse the same smoke as UX-001's acceptance gate.
- **UX-002 + UX-005:** both touch the chat message surface (`concierge-chat-messages.tsx`); build together so the error and the thinking states never co-render.
- **UX-006 + UX-007:** both clear map pins; coordinate so "New chat" leaves zero residual markers.

## Scope guardrails

- Only **UX-003** edits `mdeapp/src/lib/rental-query-parser.ts` or the rental fast-path.
- Maintain CLAUDE.md hard rules throughout: Gemini-only (no `@anthropic-ai/*`), no service-role outside the `src/mastra/lib/**` carve-out, every `<AdvancedMarker>` under a `<Map mapId>`, CopilotKit pinned at 1.55.2 (no v1/v2 mixing), one-worktree-one-PR, English-only.

## Provenance

These specs were generated from real prod network/SSE captures, DOM reads, and screenshots in [`../testing/evidence/2026-05-28/`](../testing/evidence/2026-05-28/) — not assumptions. Root causes that require prod logs (UX-001) are labeled **UNKNOWN** rather than guessed.

## PR-stack remediation (UX-013…036)

**Shipped on Vercel:** [`archive/INDEX.md`](archive/INDEX.md) · **Active backlog:** [`tasks/INDEX.md`](tasks/INDEX.md)

| # | ID | Title | Vercel |
|---|-----|-------|--------|
| 1–6 | UX-013…036, epic | G2c + G2d | 🟢 archived |
| — | UX-017 | Rebase PR #19 | 🔒 active |
| — | UX-018 | ADK URL | 🧊 active |
| — | UX-028, 032, 034 | Wave 1 polish | 🟡 not on prod |

Source: [`tests/24-mde-audit.md`](tests/24-mde-audit.md) · router: [`tasks/INDEX.md`](tasks/INDEX.md)

### Card unification (UX-010 strategy + UX-020…030)

Strategy + task pack: [`tasks/UX-010-CARD-UNIFICATION-STRATEGY.md`](tasks/UX-010-CARD-UNIFICATION-STRATEGY.md) · audit [`tests/22-card-audit.md`](tests/22-card-audit.md). Parent [`UX-010-unified-result-card-architecture.md`](UX-010-unified-result-card-architecture.md) — architecture + §6.6 disk status. **Next:** UX-022 → UX-025.

### Legacy consolidation (UX-001…010)

**Execute from [`tasks/`](tasks/)** — map: [`tasks/UX-LEGACY-001-010-CONSOLIDATION.md`](tasks/UX-LEGACY-001-010-CONSOLIDATION.md)

## PR forensic audits

Open PR merge-readiness reports live in [`tests/`](tests/) (not `audit/`). Start at [`tests/README.md`](tests/README.md) or [`tests/16-PR-STACK-SUMMARY.md`](tests/16-PR-STACK-SUMMARY.md).
