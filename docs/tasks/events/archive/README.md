---
title: Events — archived shipped specs
updated: 2026-06-04
active_backlog: ../tasks/INDEX.md
---

# Events archive — shipped on Vercel

Specs moved here when **code is LIVE** on [mdeai.co](https://www.mdeai.co) (per `sitemap.md`) **and** Vitest/Playwright proof is green.

| Pack | Location | Count | Archived |
|------|----------|------:|----------|
| **A** | [`../../archive/events-A/`](../../archive/events-A/README.md) | 11 EVP + 4 SCR | 2026-05-26 |
| **B** | this folder | 1 EVP | 2026-06-04 |

**Do not re-open** unless regression or prod proof fails.

---

## Pack B (2026-06-04)

| ID | File | Vercel surface | Proof |
|----|------|----------------|-------|
| EVP-013 | [EVP-013-core-event-card-component.md](./EVP-013-core-event-card-component.md) | `/` chat generative UI · `/events/[slug]` | Vitest `event-card.test.tsx` · SCREEN-006 **9/9** (2026-06-04) |

**Verify:** `cd mdeapp && npm test -- event && npm run test:e2e -- SCREEN-006`

---

## Pack A summary (legacy path)

EVP-002, 004–012, 017 — see [`../../archive/events-A/README.md`](../../archive/events-A/README.md).

Live surfaces: `/host/event/new`, `/api/approval-commit`, `/events/[slug]`, `/api/tickets/checkout`, Mastra `eventAgent` + `hostEventAgent`.
