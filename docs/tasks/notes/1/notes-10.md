Updated [`tasks/notes/audit-linear.md`](tasks/notes/audit-linear.md) with structured scoring and cross-doc sync. Summary of changes:

### What changed in `audit-linear.md`

1. **YAML frontmatter** — `overall_linear_sync: 58`, `overall_grade: F`, `launch_path_sync: 62`, companion doc links.

2. **Executive scorecard** (top) — 11 metrics with **%, dot, letter grade** (A–F scale).

3. **Launch path by pillar** — 7 pillars (platform, auth, maps, discovery UX, mobile, venues, payments) with sync %, dot, grade, top gap.

4. **Issue sync matrix** — `tasks.md` row ↔ Linear SAN ↔ status ↔ **sync %** ↔ dot ↔ fix action.

5. **Shipped-but-stale table** — SAN-295–298 vs aligned Done issues.

6. **Proper markdown** — all sections use headers and tables (replacing the broken plain-text dump).

7. **Cross-doc sync checklist** — `sync-tasks-queue-hints.mjs`, `verify:task`, re-audit triggers; links to [`audit-01-tasks.md`](tasks/notes/audit-01-tasks.md) and [`improve.md`](tasks/notes/improve.md).

### Sync fixes elsewhere

| File | Change |
|------|--------|
| `tasks.md` | Added `linear_audit:` link; **row 42** SCREEN-018 → 🟢 100% + **SAN-489** (was wrongly SAN-521 @ 55%) |
| `improve.md` | Companion list includes `audit-linear.md` |
| `audit-01-tasks.md` | Sources cite Linear sync 58% |

### Top-line scores (from the doc)

| Metric | % | Dot | Grade |
|--------|--:|:---:|:-----:|
| **Overall Linear sync** | **58** | 🔴 | **F** |
| Launch path (7 pillars) | 62 | 🟡 | D |
| In Progress = active | 80 | 🟡 | B |
| Docs cross-sync | 52 | 🔴 | F |

**Best next task unchanged:** SAN-367 (AUTH-011) + PR #56; parallel SAN-462 soak + MAP env gates.

Want me to commit the audit doc + sync fixes as a separate `docs(audit): linear sync scorecard` commit?