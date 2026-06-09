# Commit planning — 2026-05-29 (PR #14 split)

| Doc | Purpose |
|-----|---------|
| [PR-14-SPLIT-FORENSIC-AUDIT.md](./PR-14-SPLIT-FORENSIC-AUDIT.md) | Full audit, file matrix, blockers, scores |
| [PR-A-copilotkit-runtime-tasks.md](./PR-A-copilotkit-runtime-tasks.md) | Runtime PR checklist |
| [PR-B-cafe-detail-flow-tasks.md](./PR-B-cafe-detail-flow-tasks.md) | Café PR checklist |
| [PR-A-RUNBOOK.md](./PR-A-RUNBOOK.md) | Exact git commands — PR A |
| [PR-B-RUNBOOK.md](./PR-B-RUNBOOK.md) | Exact git commands — PR B |
| [audit-1.md](./audit-1.md) | Forensic re-audit (15 tests) — per-doc grades, dots, corrections C1–C6 |
| [SKILLS-COMPLIANCE-AUDIT.md](./SKILLS-COMPLIANCE-AUDIT.md) | CopilotKit/Mastra/testing vs PR A/B + skill red flags |

**Source PR:** https://github.com/amo-tech-ai/mdeapp/pull/14  
**Remote HEAD (2026-05-30):** `8fa5f10` — local merge `8c99ded` may exist unpushed  
**Decision:** Do **not** merge #14 as-is. Split → merge **PR A** first, then **PR B**.

**Skills:** Load `copilotkit` → `copilotkit-integrations` (mastra.md) for PR A; `mde-maps` + `testing` for PR B. Use **mastra.md v1 mapping**, not `copilotkit-develop` v2 examples.
