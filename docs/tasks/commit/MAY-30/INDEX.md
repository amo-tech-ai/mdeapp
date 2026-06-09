# MAY-30 — MIS multi-vertical PR split

**Audit:** [FORENSIC-AUDIT-2026-05-30.md](./FORENSIC-AUDIT-2026-05-30.md)  
**Branch today:** `feat/ux-002-005-chat-error-thinking` (PR #16 — UX only; do **not** add MIS WIP here)

| PR | Ledger | Runbook | Scope |
|----|--------|---------|-------|
| **PR A** | C-014 | [PR-A-MVP-SEARCH-TASKS.md](./PR-A-MVP-SEARCH-TASKS.md) | SEARCH-001/002, INT-002, rank UI, golden smoke (search paths) |
| **PR B** | C-015 | [PR-B-EMBED-INFRA-TASKS.md](./PR-B-EMBED-INFRA-TASKS.md) | VEC-003/004, embed-worker, AI-004, migration, cache |

**Gate:** PR A merges first (uses committed `query-embedding.ts` from PR #16 / `b7265b9`). PR B stacks after A.

**Canonical audit prompt:** [RELEASE-AUDIT-PROMPT.md](./RELEASE-AUDIT-PROMPT.md)
