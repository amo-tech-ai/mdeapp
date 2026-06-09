# MDEAI Task Evidence Ledger

Proof-Driven Delivery index. **Linear status is not proof** — see Evidence Score + proof levels.

Rule: [`.cursor/rules/mdeai-proof-driven-delivery.mdc`](../../../.cursor/rules/mdeai-proof-driven-delivery.mdc)  
**Changelog:** [`../../mdeapp/changelog.md`](../../mdeapp/changelog.md) · **Todo:** [`../../mdeapp/todo.md`](../../mdeapp/todo.md)

## Scoring

```text
Evidence Score = 0.25×Spec + 0.25×Tests + 0.20×Runtime + 0.20×Production + 0.10×Process
```

| Grade | Range | Typical status |
|-------|-------|----------------|
| A | 90–100 | Done-eligible |
| B | 75–89 | In Review |
| C | 60–74 | In Progress |
| F | <60 | Blocked |

## Proof levels

`L1` Vitest · `L2` Playwright · `L3` Browser localhost · `L4` Browser prod · `L5` Full persona journey

---

## Active tasks

| SAN | Full name | Area | Persona | Journey | PR | Prod SHA | Proof | Score | Evidence | Close? |
|-----|-----------|------|---------|---------|----|---------:|-------|------:|----------|--------|
| SAN-546 | OPS-JOURNEY — Lucía: Prod journey matrix J05–J20 | QA / Lucía | Lucía | Launch matrix | — | 85224e8 | L2✓ L4 partial | 91 | `2026-06-08/launch-readiness-sprint-RESULTS.md` | No — J14 harness |
| SAN-548 | F13 — Thread persistence across Vercel cold-start | Platform / Camila | Camila | Chat continuity | — | 0baeda7 | — | 68 | `2026-06-08/launch-readiness-sprint-RESULTS.md` | No — prod turn-11 |
| SAN-368 | MAP-002B — ADK grounding on production | Maps / Tourist | Tourist | Café grounding | — | 0baeda7 | L4 partial | 78 | `2026-06-08/launch-readiness-sprint-RESULTS.md` | No — Vercel env |

---

## Completed (archive rows here when Done-approved)

| SAN | Full name | Score | Closed |
|-----|-----------|------:|--------|
| SAN-545 | DATA-EMBED — Fix rental embed API 403 (hybrid search) | 92 | 2026-06-08 PR #136 |
| SAN-823 | UX-038 — Rentals: pattern-based fast-path (neighborhood + intent) | 88 | 2026-06-08 PR #136 |
| SAN-549 | Wire conciergeAgent intent:nightlife for search-grounded-places | 88 | 2026-06-08 re-close |
| SAN-478 | REAL-011 — Rental browse page (/rentals) | 93 | 2026-06-08 PR #132 |
| SAN-828 | UX-043 — Lucía: Prod smoke — CopilotKit empty POST contract | 91 | 2026-06-08 smoke 7eb97a1 |
| SAN-660 | For Event Hosts landing (`/host`) | 92 | PR #130 — partner scope |
