# Session update — 2026-06-09 · docs rebase + forensic audit

> Plain-language log of what this session changed, decided, and left open. Pairs every task number with its name (per the new CLAUDE.md rule).

## Goal

Two threads: (1) make **mdeapp** self-contained as the project root and fix the docs that still pointed at the old parent layout; (2) run a forensic audit of the launch-queue tasks and act on what it found.

## What shipped

**[PR #144 — docs: rebase planning docs to mdeapp root + naming/clarity rules + June-8 forensic audit](https://github.com/amo-tech-ai/mdeapp/pull/144)** (branch `chore/mdeapp-docs-root-rebase`, commit `163f85d`, docs-only, +2,294 lines):

- **Docs rebased to mdeapp root** — `CLAUDE.md`, `DESIGN.MD`, `sitemap.md`, `linear.md`, `index-skills.md`. Paths fixed: `mdeapp/src/**` → `src/**`, `tasks/` → `docs/tasks/`, `plan/` → `../plan/` (sibling planning repo), commands now run from repo root.
- **`index.md` (new)** — repository index: top-level map, source/docs maps, where-to-look-first.
- **`LESSONS.md` (new)** — copied into the repo so CLAUDE.md's `./LESSONS.md` link resolves.
- **Two new CLAUDE.md rules** (user request):
  1. Always pair a task number with its title — never a bare `SAN-NNN`.
  2. Responses must be plain and real-world (short sentences, name the persona + surface, show numbers with their meaning).
- **`docs/linear/audit/june-8/02-tasks-audit-verified.md` (new)** — the canonical, probe-cited forensic audit (see below).

**Linear:** filed **SAN-856 · AIE — ai_runs token/cost capture regression (dead since 2026-05-08) + blind error logging** (High, Core Foundation, linked to SAN-548/828/115).

## Audit results (probe-cited)

| Task | Status | Grade | Headline |
|---|---|---|---|
| SAN-828 · UX-043 — CopilotKit empty POST 401 vs 400 | Done (today) | A− / 91 | Route is auth-first → 401 is correct; smoke aligned |
| SAN-548 · F13 — Thread persistence across cold-start | In Progress | B / 83 | Persistence proven live; cold-start journey proof missing |
| SAN-546 · OPS-JOURNEY — Prod journey matrix J05–J20 | In Progress | C+ / 72 | Automated `prod-journey-j05-j20.spec.ts` does not exist |
| SAN-368 · MAP-002B — ADK grounding on prod | In Progress | C− / 65 | Client code shipped; Cloud Run + Vercel env unproven |
| SAN-178 · PAY-001 — Live ticket purchase on prod | Todo | F / 42 | The real P0 — no prod paid-ticket proof |
| SAN-115 · AIE-001 — Production proof ledger | Todo | F / 45 | Blocked by SAN-178; ledger can't close |

**Verified cleared:** SAN-462 · OPS-001 (soak gate), SAN-369 · MAP-008B (Map ID), SAN-823 · UX-038, SAN-545 · DATA-EMBED, SAN-549 (nightlife intent), SAN-828 · UX-043.

## Key findings

- **The big `ai_runs` numbers are not a leak or spike.** 432 threads / 1,066 messages / 908 runs = historical dev/QA traffic — ~85% from a May 23–26 dev burst (May 24 alone = 194), 89% anonymous, "real users" = a single dev UUID.
- **F13 splits in two:** persistence (`mastra_threads` / `mastra_messages`) is genuinely live ✅; observability is broken 🔴 — token/cost capture died after **2026-05-08** (726 runs since with zero tokens), and 37/37 errors since May 15 have no `error_message`. That's SAN-856.
- **SAN-856 overlaps SAN-704 · AIE-004 — ai_runs prod write fix.** Rows ARE being written, so SAN-704's premise ("not writing") is wrong — reconcile or fold into SAN-856; don't keep two Urgent issues.

## Environment hazard observed

The shared mdeapp working tree **switched branches ≥6× during the session** (parallel agents): `san-731` → `san-545-823` → `san-135` → `main` → `san-492` → `san-860-861-862`. A parallel agent also overwrote `01-tasks-audit.md` mid-session (hence the clean rebuild as `02-tasks-audit-verified.md`). Consequence: build/test could not be re-run against a stable branch, so runtime claims in the audit are marked *Reported, not re-verified*. This session's commits were isolated via a dedicated branch + a temporary git worktree to avoid the churn. (See memory `project-shared-worktree-parallel-agent`.)

## Open items

1. **Merge PR #144** → makes the root docs permanent on every branch and ends the clobber risk.
2. **SAN-178 · PAY-001** prod paid ticket → unblocks **SAN-115 · AIE-001** ledger (the MVP exit gate).
3. **SAN-856 · AIE** — thread `usage` + `error.message` into `ai_runs` inserts; reconcile with **SAN-704 · AIE-004**.
4. **SAN-546 · OPS-JOURNEY** — create `e2e/prod-journey-j05-j20.spec.ts` (or descope) + run manual J10–J15.
5. **SAN-548 · F13** — capture the turn-11-after-cold-start proof.
6. **SAN-368 · MAP-002B** — decide Phase 1 vs 2, then deploy Cloud Run sidecar + set Vercel env.
7. **Evidence migration (C2)** — cited evidence still lives in the parent repo (`../tasks/testing/evidence/`); move into `docs/tasks/` so links don't escape mdeapp.
