# Events Platform — canonical docs

**SoT path:** `mdeapp/docs/tasks/events/` (this directory)

**Compat symlink:** `docs/events/` → this directory (same files as `tasks/events/` at repo root).

| Doc | Purpose |
|-----|---------|
| [`todo.md`](./todo.md) | Execution order, readiness scores, verify packs |
| [`changelog.md`](./changelog.md) | Graded ship history (append before In Review/Done) |
| [`index-events.md`](./index-events.md) | Platform index + live status map |
| [`data/VENUE-DATA-MODEL.md`](./data/VENUE-DATA-MODEL.md) | SAN-492 venue reuse model · Appendix A = migration SQL |
| [`data/ALL-EVENTS-DATA-MODEL.md`](./data/ALL-EVENTS-DATA-MODEL.md) | Full events table map (live-probed) |
| [`data/data-model-audit.md`](./data/data-model-audit.md) | VENUE-DATA-MODEL forensic audit (SAN-492 · 85% B · E0/E1) |
| [`audit/04-data-model-audit.md`](./audit/04-data-model-audit.md) | Why `partner_venues` was killed (B1/B2/B3) |
| [`tasks/README.md`](./tasks/README.md) | EVP / AIE task backlog router |
| [`summary.md`](./summary.md) | One-page platform summary |

**Agent skill:** `.agents/skills/mde-events/` · **Router:** [`../README.md`](../README.md)
