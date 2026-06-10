---
title: Revenue Linear import log
updated: 2026-06-05
cleanup: 2026-06-05 — labels, priorities, blockers, overlap SAN-559/563/565/560-562; spec URLs → mdeai repo
index: INDEX-revenue.md
strategy: ../../docs/strategy/index-revenue.md
audit: ../audit/38-revenue-audit.md
---

# Revenue → Linear sync

Pilot import: **R1 (3 issues) + CW track (5 issues)**. R2+ deferred until C2 proof exists (per audit § Next actions).

## MVP-exit gate (blocks R1 + CW-1)

No umbrella issue — each revenue issue uses `blockedBy` on these four:

| Gate | Linear | Spec |
|------|--------|------|
| PAY-001 | [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) | Live ticket purchase |
| EVT-001 | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | MVP launch proof ledger |
| AUTH-011 | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) | Production auth checklist |
| MAP-002B | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | ADK grounding on production |

Track gate progress: [Linear MVP view](https://linear.app/sanjiovani/view/mvp-48ab105e7f0a)

## Imported (2026-06-05)

| Task | Linear | Project | State | Blockers |
|------|--------|---------|-------|----------|
| C13 | [SAN-550](https://linear.app/sanjiovani/issue/SAN-550) | AI & Intelligence | Backlog | SAN-178, SAN-115, SAN-368 · **blocks** 551, 552 |
| C1 | [SAN-552](https://linear.app/sanjiovani/issue/SAN-552) | Growth & Operations | Backlog | 178, 115, 368, 550 |
| C2 | [SAN-551](https://linear.app/sanjiovani/issue/SAN-551) | Commerce Platform | Backlog | 178, 115, 368, 550 |
| CW-1 | [SAN-553](https://linear.app/sanjiovani/issue/SAN-553) | Growth & Operations | Backlog | 178, 115, 368 |
| CW-2 | [SAN-554](https://linear.app/sanjiovani/issue/SAN-554) | Growth & Operations | Backlog | SAN-553 |
| CW-3 | [SAN-555](https://linear.app/sanjiovani/issue/SAN-555) | Growth & Operations | Backlog | SAN-554 |
| CW-4 | [SAN-556](https://linear.app/sanjiovani/issue/SAN-556) | Growth & Operations | Backlog | SAN-555 |
| CW-5 | [SAN-557](https://linear.app/sanjiovani/issue/SAN-557) | Growth & Operations | Backlog | SAN-556 |

## Deferred (not in Linear yet)

- **R2:** C11, C3, C12, C6, C15, C9, C10
- **R3-A:** C4, C5, C8
- **R3-B:** C7, C14
- **R4:** M1–M12
- **R5:** A1–A10 (no task files — strategy only)

## Import rules (next batch)

1. Read `linear_labels` + `linear_project` from task frontmatter.
2. `state: Backlog` until MVP-exit gates close.
3. `blockedBy` = gate SAN IDs + dependency chain from `depends_on`.
4. After create: set `linear_id` + `linear_url` in spec YAML; update [`INDEX-revenue.md`](INDEX-revenue.md) Linear column.
5. Branch naming: `ai/san-NNN-<slug>` per [`linear.md`](../../linear.md).

## Cleanup log (2026-06-05)

- Labels backfilled per task frontmatter; removed erroneous `stack:mastra`/`stack:copilotkit` from C1.
- Created workspace label **`prefix:INT`**; **`stack:whatsapp`** already existed (team Sanjiovani).
- Priorities: R1 → **Urgent**; CW → **High** (556/557 upgraded from Medium).
- **SAN-367 removed** from all gate blockers (Done); gates = 178, 115, 368 only.
- Spec GitHub links added to SAN-551, 552, 553–557.
- Overlap triage: SAN-563 → related/blocked by SAN-551 (C2); SAN-565 → C6 defer; SAN-559 → C10 defer.

## Overlap issues (not pilot — triaged)

| Linear | Overlaps | Action |
|--------|----------|--------|
| SAN-563 | C2 checkout widget | Backlog · blockedBy 551 · merge into SAN-551 |
| SAN-564 | C2 create_checkout (dup) | **Duplicate of SAN-551** · canceled 2026-06-05 |
| SAN-558 | SCREEN-028 /cafes | **Duplicate of SAN-519** · canceled 2026-06-05 |
| SAN-565 | C6 Sales Agent | Backlog · relatedTo 551 · defer until R2 C6 import |
| SAN-559 | C10 nightlife VIP | Backlog · blockedBy 551 · defer until R2 C10 import |
| SAN-560 | M7 restaurant reservations | Backlog · blockedBy 551 · defer until R4 M7 import |
| SAN-561 | C14/C15 events promo | Backlog · blockedBy 551 · defer until R2 import |
| SAN-562 | C4/C8 rental leads | Backlog · blockedBy 551 · defer until R3-A import |

## Spec URL convention (2026-06-05)

Task specs live in **`amo-tech-ai/mdeai`** (planning repo), not `mdeapp`. Linear attachments use `https://github.com/amo-tech-ai/mdeai/blob/main/tasks/...`. Legacy `mdeapp` spec links on SAN-550..557 are superseded by `(mdeai)` attachments.

## Notes

- CW issues in **Growth & Operations** — matches CW-1 frontmatter.
- C1/C2 titles use REV-C* prefix for searchability; issue IDs are authoritative.
- Blocker relations applied via MCP `save_issue`; spot-check [BLOCKERS view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207).
