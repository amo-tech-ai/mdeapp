# Initiative update template — Phase 1 mdeai MVP launch

**Where:** [Phase 1 initiative](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8/overview) → **Update** (`Shift+U`)

**Health:** On track | At risk | Off track

**MCP (agents):** `save_status_update` — `type: initiative`, `initiative: Phase 1 — mdeai MVP launch`, `health`, `body` (markdown). Omit `id` to create; pass `id` to edit.

---

## Done this week

- …
- …

## Doing next

- …
- …

## Blocked

- … (`SAN-###` + why)

## MVP gates

Use [`mvp-queue.json`](../mvp-queue.json) for authoritative SAN ↔ spec. Common launch rows:

| Gate | Spec | SAN | Status |
|------|------|-----|--------|
| Live ticket purchase | PAY-001 | SAN-178 | … |
| Webhook secrets | PAY-003 | SAN-116 | … |
| Event cards in chat | EVT-013 | SAN-117 | … |
| Host publish proof | EVT-002 | SAN-366 | … |
| Launch proof ledger | EVT-001 | SAN-115 | … |
| Chat error bubble | UX-002 | SAN-320 | … |
| Thinking indicator | UX-005 | SAN-319 | … |
| Unified result cards | UX-010 | SAN-318 | … |
| Restaurant hybrid | SEARCH-003 | SAN-388 | … |
| Rental hybrid | SEARCH-001 | SAN-386 | … |
| Event hybrid | SEARCH-002 | SAN-387 | … |
| Prod smoke | OPS-002 | SAN-100 | … |

## Intelligence (parallel)

| Spec | SAN | Status |
|------|-----|--------|
| INT-001 routing | SAN-404 | … |
| INT-002 rental parser | SAN-405 | … |
| DATA-041 venue QA | SAN-379 | … |

## Evidence

- `tasks/testing/evidence/…`
- `tasks/commit/MAY-30/…`
- `tasks/ux/tests/` (PR audits) · `tasks/ux/audit/` (UX track) · `tasks/intelligence/audit/`
- PR links (mention `SAN-###`)

---

**Health guide**

| Health | When |
|--------|------|
| **On track** | Launch Critical Todo shrinking; no P0 blockers >48h |
| **At risk** | PR split needed, browser fail, migration missing, or premature Done on Linear |
| **Off track** | Floor red, prod outage, or launch date slip >1 week |
