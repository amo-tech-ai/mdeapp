---
title: UX active tasks (backlog + wave 1)
updated: 2026-06-01T14:45Z
status_snapshot: STATUS-2026-06-01.md
archive: ../archive/INDEX.md
main_sha: c9e54b8
prod_sha_g2d: a8b33a2
wave1_merged: "2026-06-01 (#35 #36 #37)"
prod: https://www.mdeai.co
linear_view: https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725
linear_sync: ../../linear/ux-linear-sync-2026-06-01.md
---

# UX active tasks — specs in `tasks/PR/ux/`

> **Canonical spec files:** [`../../PR/ux/`](../../PR/ux/README.md) (this INDEX links there).  
> **Shipped on Vercel (14 + epic):** [`../archive/INDEX.md`](../archive/INDEX.md).  
> **Production:** https://www.mdeai.co · **`origin/main`** @ **`c9e54b8`** (wave-1 #35–#37 merged 2026-06-01).  
> **Forensic audit:** [`../../PR/docs/01-06-26-audit.md`](../../PR/docs/01-06-26-audit.md)

## Status legend

| Dot | Meaning |
|-----|---------|
| 🟢 | Done on Vercel — shipped or wave-1 merged |
| 🟡 | Implemented locally — **not** on prod |
| ⚪ | Not started |
| 🔒 | Deferred separate track |

## Active backlog (7 open + wave-1 done)

| | ID | Linear | Title | P | Vercel |
|:-:|-----|--------|-------|---|--------|
| 🟢 | [UX-028](../../PR/ux/UX-028-place-result-card-fallback-upgrade.md) | [SAN-440](https://linear.app/sanjiovani/issue/SAN-440) | Restaurant Places photos | P1 | **Yes** — [#35](https://github.com/amo-tech-ai/mdeapp/pull/35) `d9ce40c` |
| 🟢 | [UX-032](../../PR/ux/UX-032-new-chat-reset-thread-and-map.md) | [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) | New chat reset | P2 | **Yes** — [#36](https://github.com/amo-tech-ai/mdeapp/pull/36) `1a51ad2` |
| 🟢 | [UX-034](../../PR/ux/UX-034-prod-synthetic-concierge-monitor.md) | [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) | Nightly prod synthetic | P2 | **Yes** — [#37](https://github.com/amo-tech-ai/mdeapp/pull/37) `c9e54b8` |
| ⚪ | [UX-020](../../PR/ux/UX-020-card-interaction-props-types.md) | [SAN-436](https://linear.app/sanjiovani/issue/SAN-436) | CardInteractionProps | P2 | — |
| ⚪ | [UX-023](../../PR/ux/UX-023-result-card-shell.md) | [SAN-437](https://linear.app/sanjiovani/issue/SAN-437) | ResultCardShell | P1 | — |
| ⚪ | [UX-024](../../PR/ux/UX-024-hover-pin-parity.md) | [SAN-438](https://linear.app/sanjiovani/issue/SAN-438) | Hover→pin | P1 | — |
| ⚪ | [UX-029](../../PR/ux/UX-029-retire-grounded-place-card.md) | [SAN-443](https://linear.app/sanjiovani/issue/SAN-443) | Retire GroundedPlaceCard | P2 | — |
| ⚪ | [UX-033](../../PR/ux/UX-033-clear-stale-advanced-markers.md) | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | Stale markers | P2 | — |
| 🔴 | [UX-017](../../PR/ux/UX-017-rebase-pr19-onto-main.md) | [SAN-432](https://linear.app/sanjiovani/issue/SAN-432) | Superseded — use PR #32 | P1 | **Canceled** |
| 🧊 | [UX-018](../../PR/ux/UX-018-adk-grounding-url-vercel.md) | [SAN-444](https://linear.app/sanjiovani/issue/SAN-444) | ADK on Vercel | P2 | Phase 2 |

## Wave 1 — **complete** (2026-06-01)

| PR | Task | Prod proof |
|----|------|------------|
| [#35](https://github.com/amo-tech-ai/mdeapp/pull/35) | UX-028 / SAN-440 | API `/api/places/photo` proxies; visual prod `01-restaurants` |
| [#36](https://github.com/amo-tech-ai/mdeapp/pull/36) | UX-032 / SAN-321 | `test:e2e:new-chat` ✅ localhost + **prod** (2026-06-01) |
| [#37](https://github.com/amo-tech-ai/mdeapp/pull/37) | UX-034 / SAN-322 | GH vars set; [workflow run 26760735915](https://github.com/amo-tech-ai/mdeapp/actions/runs/26760735915) success |

Evidence: [`prod-synthetic-smoke-2026-06-01.md`](../../testing/evidence/prod-synthetic-smoke-2026-06-01.md) · [`visual-cards-prod/`](../../testing/evidence/visual-cards-prod/)

## Do not mix

PR **#23** (DATA-048) · **#32** (SEARCH — merged to main, not UX polish) · UX-017 / #19 · ADK Phase 2.

## Supporting docs (active)

| Doc | Path |
|-----|------|
| Status snapshot | [STATUS-2026-06-01.md](STATUS-2026-06-01.md) |
| Test tasks (active) | [tests/INDEX.md](tests/INDEX.md) |
| Audits | [audit/00-INDEX.md](audit/00-INDEX.md) |
| Notes | [notes-2.md](notes-2.md) · [notes-3.md](notes-3.md) |

## Evidence

| Artifact | Path |
|----------|------|
| G2d prod smoke | [`prod-smoke-2026-06-01.md`](../../testing/evidence/prod-smoke-2026-06-01.md) |
| Visual cards (local) | [`visual-cards/`](../../testing/evidence/visual-cards/) |
| Visual cards (prod) | [`visual-cards-prod/`](../../testing/evidence/visual-cards-prod/) |
| Prod synthetic | [`prod-synthetic-smoke-2026-06-01.md`](../../testing/evidence/prod-synthetic-smoke-2026-06-01.md) |
| Linear sync | [`ux-linear-sync-2026-06-01.md`](ux-linear-sync-2026-06-01.md) |
