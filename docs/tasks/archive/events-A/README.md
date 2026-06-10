---
title: Events — archived pack A (Done core)
updated: 2026-06-04
active_backlog: ../../events/tasks/INDEX.md
---

# Events archive — pack A

**11 EVP specs + 4 Done wireframe SCRs** archived **2026-05-26** — **`status: Done`** in frontmatter with disk + Vitest proof (`npm test -- event` **54/54**).

**Active backlog:** [`../../events/tasks/INDEX.md`](../../events/tasks/INDEX.md) — EVP-001, 003, 014–016, 018–047 + G3.

**Pack B archive:** [`../../events/archive/`](../../events/archive/README.md) — EVP-013 (2026-06-04).

---

## Completion verdict

| Scope | Complete? | Notes |
|-------|:---------:|-------|
| **Archived core (002, 004–012)** | **Yes** | Agents, tools, wizard, HITL, tickets wired in `mdeapp/` + legacy `supabase/functions/` |
| **EVP-017** | **Yes** | Planning doc only — no code DoD |
| **Done wireframe SCRs** | **Yes** | Shipped surfaces referenced in SCREEN specs |
| **Full events pack (47 EVP)** | **No** | 36 specs remain — 001 proof gate, 003/013 partial, 014+ open |
| **Andrés G1 live proof** | **Partial** | EVP-002 archived; production webhook proof rolls to EVP-001 |

Do not re-execute archived specs unless regression reopens them.

---

## Archived EVP specs

| ID | File |
|----|------|
| EVP-002 | [EVP-002-core-ticket-checkout-webhook-port.md](./EVP-002-core-ticket-checkout-webhook-port.md) |
| EVP-004 | [EVP-004-core-event-agent-port.md](./EVP-004-core-event-agent-port.md) |
| EVP-005 | [EVP-005-core-event-tool-and-workflow.md](./EVP-005-core-event-tool-and-workflow.md) |
| EVP-006 | [EVP-006-core-event-clarify-gate-and-chips.md](./EVP-006-core-event-clarify-gate-and-chips.md) |
| EVP-007 | [EVP-007-core-event-agent-prompt-and-sources.md](./EVP-007-core-event-agent-prompt-and-sources.md) |
| EVP-008 | [EVP-008-core-event-draft-state-types.md](./EVP-008-core-event-draft-state-types.md) |
| EVP-009 | [EVP-009-core-host-event-agent.md](./EVP-009-core-host-event-agent.md) |
| EVP-010 | [EVP-010-core-host-event-new-wizard.md](./EVP-010-core-host-event-new-wizard.md) |
| EVP-011 | [EVP-011-core-approval-panel-hitl.md](./EVP-011-core-approval-panel-hitl.md) |
| EVP-012 | [EVP-012-core-approval-commit-edge-fn.md](./EVP-012-core-approval-commit-edge-fn.md) |
| EVP-017 | [EVP-017-mvp-event-grounding-architecture.md](./EVP-017-mvp-event-grounding-architecture.md) |

## Archived wireframes (SCR)

| File | Surface |
|------|---------|
| [003-scr-event-card-polish.md](./wireframes/003-scr-event-card-polish.md) | Event cards on `/` |
| [003-scr-event-detail-page.md](./wireframes/003-scr-event-detail-page.md) | Event detail |
| [004-scr-host-event-wizard.md](./wireframes/004-scr-host-event-wizard.md) | Roberto wizard |
| [015-scr-my-tickets-qr.md](./wireframes/015-scr-my-tickets-qr.md) | Andrés wallet QR |

**Verify:** `cd mdeapp && npm test -- event`
