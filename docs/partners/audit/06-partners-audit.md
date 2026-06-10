---
title: "Partners project — task audit (forensic)"
audited: 2026-06-06
auditor: task-verifier protocol
project: Partners (partners-032df556f9f9) · epic SAN-667
method: ".claude/skills/task-verifier — source-of-truth → current-state → dependency → scope → anti-fake-done"
---

# Partners — task audit

> **Verdict:** 🟡 **Healthy planning set, not yet execution-ready.** 28 issues under epic SAN-667, all correctly **un-started** (no fake-Done risk). Dependency graph is **acyclic and matches the Gantt**. Anti-overengineering holds. **4 fixable issues:** (1) SAN-662 About is orphaned; (2) ~10 Linear bodies still link the deleted SAN-666; (3) workstream/vertical issues are one-line stubs that need full task specs before any build; (4) minor status/blocker hygiene.

## Scope audited
Epic **SAN-667** + 28 children in the Partners project: pages (660·661·663·664·665·690), workstreams (668–673·683–689), per-partner verticals (675–682), UX pack (674). All `PTR`-labeled. Cross-checked against the on-disk blueprint (`tasks/design/partners/**`, verified to exist) and CLAUDE.md hard rules.

## Anti-fake-done — ✅ PASS
**Nothing is marked Done.** Statuses are Todo (7) or Backlog (21). No issue claims completion → **zero fake-done risk**; gate 9 (localhost proof) is N/A until build. Correct state for a design-phase backlog.

## Findings

### 🟡 1. SAN-662 (About page) is orphaned
Not parented to SAN-667, not in the Partners project, no `PTR` label — created in the first MKT batch and **missed** when 660/661/663/664/665/666 were moved. Stranded in the UX project.
**Fix:** set `project=Partners`, `parentId=SAN-667`, add `PTR` (no `ptr:*` — it's cross-type).

### 🟡 2. Dangling SAN-666 links inside Linear issue bodies
Docs were swept (0 refs), **but the Linear descriptions were not.** Still link the deleted SAN-666 inline:
- Epic **SAN-667** (bare "666 /dashboard")
- **SAN-674** ("created off the SAN-666 thread")
- Verticals **SAN-675–682** (8 issues — "Dashboard tabs … SAN-666" in each checklist)
**Fix:** replace SAN-666 → SAN-690 in those ~10 bodies (one batch).

### 🟡 3. Execution-readiness gap (by design, but must close before build)
Workstreams (668–673, 683–689) and verticals (675–682) are **one-line stubs pointing at design docs** — they lack DoD commands + expected output, disk/MCP probes, RLS/enum specifics, and the 1–10 task template. Per the rubric: **B for spec intent / D–F for execution readiness**. **None is safe to flip Done** until promoted to a full spec.
**Fix:** before building any, run it through `mde-task-lifecycle` Phase 1 (esp. SAN-683 schema — needs concrete table DDL + RLS policies + the `agent_type`/enum decision).

### 🟡 4. Status / blocker hygiene
- **SAN-665 signup** and **SAN-690 dashboard** are **Todo** but `blockedBy` **SAN-683 (Backlog)** — a startable task blocked by not-yet-started work. Recommend: **move SAN-683 → Todo** (it's the P1 unblocker).
- **SAN-669 (AI services)** isn't `blockedBy 683` though it likely reads `partner_services`. Low risk (catalog can start on paper) — flag only.

### 🟢 Passing checks
| Check | Result |
|---|---|
| No fake-Done | ✅ nothing Done |
| Dependency graph acyclic | ✅ 683→665/690→668→675→{676-682}; no cycle |
| Matches Gantt sequence | ✅ schema→onboarding/dashboard→revenue→host→verticals |
| Anti-overengineering | ✅ marketplace P3/Low; one platform; "config not new platform" in epic |
| Label hygiene | ✅ PTR everywhere; ptr:* on type-specific; type:data/stack:*/CHATW/prefix:CONT applied |
| Hard rules in specs | ✅ Gemini-only · HITL on money/public · FieldMask · service-role F13 carve-out |
| Phase-1 English-only | ✅ no Spanish/Lingui |
| Referenced design docs exist | ✅ all `tasks/design/partners/**` present + 37 SVGs rendered |
| Priorities vs roadmap | ✅ P0 host/nightclub/broker High; marketplace Low |

## Dependency graph (as wired)

```
SAN-683 schema ─┬─ 665 signup ──┐
                ├─ 690 dashboard ┴─ 668 revenue ── 675 host ─┬─ 676/677/678/679/680
                ├─ 684 lead-gen                               └─ 681/682 (+669 AI svcs)
                ├─ 685 copilot · 688 data · 689 comms
                └─ 686 booking (←690)
Pages 660/661/663/664 — no deps (buildable anytime)
```
Valid. Only nit: 669 could also be `blockedBy 683`.

## Spec scores (task-verifier rubric)

| Group | Spec intent | Execution readiness | Note |
|---|:--:|:--:|---|
| Pages (660/661/663/664/665/690) | B (AC + wireframe) | C | need DoD commands |
| Workstreams (668–673, 683–689) | C+ (point to design docs) | D | need full specs |
| Verticals (675–682) | C (checklist only) | D | depend on platform; spec at build time |
| Epic 667 / UX pack 674 | A (tracking) | n/a | tracking issues |

## Recommendations (priority order)
1. **Fix orphan + dangling refs** (findings 1–2) — quick Linear cleanup.
2. **Promote SAN-683 (schema) to a real spec + Todo** — it's the unblocker; everything sits on it.
3. **Spec SAN-665 + SAN-690** (signup + dashboard) next — they're the platform.
4. Leave verticals as stubs until the platform spec lands; spec each at build time via `mde-task-lifecycle`.
5. Keep marketplace (672) + Phase-3+ items frozen.

## Persona impact
Nothing user-visible yet — backlog hygiene. First persona payoff lands when **SAN-675 (host)** ships: Roberto onboards via the wizard and publishes a sellable event end-to-end.
