---
title: Phase 1 — Planning
impact: HIGH
impactDescription: Prompt authoring, INDEX, mde-writing-plans routing
tags: mde-task-lifecycle, planning, prompts, tasks
---

# Phase 1 — Planning

Coordinator. Routes prompt authoring through `mde-writing-plans`. Owns boundaries — IDs, file paths, INDEX, coverage matrix.

---

## Table of contents

1. [Entry / exit criteria](#entry--exit-criteria)
2. [Workflow checklist](#workflow-checklist)
3. [Routing](#routing)
4. [Prompt-file naming convention](#prompt-file-naming-convention)
5. [Acceptance-criteria rules](#acceptance-criteria-rules)
6. [Dependency rules](#dependency-rules)
7. [Milestone vs task vs prompt](#milestone-vs-task-vs-prompt)
8. [Validation checklist](#validation-checklist)
9. [Escalation](#escalation)

---

## Entry / exit criteria

| | Criterion |
|---|---|
| **Entry** | (a) PRD section names a feature with no prompt, OR (b) user names a capability not in [tasks/prompts/INDEX.md](../../../tasks/prompts/INDEX.md), OR (c) coverage matrix has an open `G` (gap) row. |
| **Exit** | A prompt file at `tasks/prompts/{core\|advanced\|production}/<NN><X>-name.md` matching every section in [tasks/tasks-template.md](../../../tasks/tasks-template.md). INDEX.md updated. Coverage matrix flipped if applicable. |

---

## Workflow checklist

```
[ ] 1.  Read tasks/tasks-template.md end-to-end.
[ ] 2.  Read PRD section + cross-referenced trio plan.
[ ] 3.  Read 1-2 nearby prompts in the target folder for voice match.
[ ] 4.  Read INDEX.md; pick next free ID per phase folder.
[ ] 5.  Hand off prose authoring to mde-writing-plans.
[ ] 6.  Append new prompt row to INDEX.md; bump count tables.
[ ] 7.  Flip coverage-matrix row G/P → S if applicable.
[ ] 8.  Run validation checklist below.
```

---

## Routing

| Need | Route to |
|------|----------|
| Writing the actual prose for the prompt body | [`mde-writing-plans`](../mde-writing-plans/SKILL.md) |
| Template structure questions | [references/prompt-template-cheatsheet.md](references/prompt-template-cheatsheet.md) |
| New PRD section first | [`mde-writing-plans`](../mde-writing-plans/SKILL.md), then loop back |
| Roadmap reshuffle | [`roadmap`](../roadmap/SKILL.md) |

---

## Prompt-file naming convention

```
tasks/prompts/{core|advanced|production}/<NN><X>-<kebab-name>.md
```

| Segment | Rule | Example |
|---------|------|---------|
| Folder | `core` for P0/P1, `advanced` for P2, `production` for P3 | `advanced/` |
| `NN` | Two-digit epic number, zero-padded | `17` |
| `X` | Single uppercase suffix for sub-tasks | `A`, `B`, `C` |
| `kebab-name` | Lowercase, dash-separated, ≤40 chars, action-oriented | `paperclip-bridge-docker-service` |

Full example: `advanced/17A-paperclip-bridge-docker-service.md`.

---

## Acceptance-criteria rules

| Rule | Why |
|------|-----|
| ≤10 per prompt | Forces a shippable unit. >10 → split into sibling tasks. |
| Each is observable | "X works" is not testable; "POST `/api/x` returns 200 with shape Y" is. |
| One verb per criterion | Compound criteria hide failures. |
| Tied to wiring plan | Every AC maps to ≥1 file row. |
| Loading / error / empty for UI | Per [CLAUDE.md](../../../CLAUDE.md) Architecture Rules. |

Examples and counter-examples: [references/prompt-template-cheatsheet.md](references/prompt-template-cheatsheet.md).

---

## Dependency rules

Frontmatter fields:

| Field | Meaning |
|-------|---------|
| `depends_on` | Cannot start until those task IDs are `Done`. |
| `blocks` | Cannot start downstream tasks until this one ships. Optional. |

Hard rules:
- No cycles. If A↔B both depend on each other, one is mis-decomposed.
- No upward cross-phase deps (advanced → core OK; never the reverse).
- Edge functions before UI that calls them.
- Migrations before code that reads the table.

---

## Milestone vs task vs prompt

| Concept | Granularity | Lives in |
|---------|-------------|----------|
| Milestone | Multi-week outcome | [roadmap.md](../../../roadmap.md), PRD §3 |
| Epic | Numbered group of related tasks | Coverage matrix row + multiple prompts |
| Task | One shippable unit, 1-5 days, ≤10 AC | One prompt file |
| Subtask | Item inside a prompt's checklist | Inline in prompt body |

A prompt is the contract for a task. Never split or merge mid-implementation — replan first.

---

## Validation checklist

Run before exiting Phase 1.

```
[ ] Frontmatter complete: task_id, title, phase, priority, status=Not Started,
    estimated_effort, area, schema_tables, depends_on, description.
[ ] All template sections present (or marked N/A with one-line reason).
[ ] ≤10 acceptance criteria, each observable.
[ ] Real-world examples name a persona from PRD §2.1.
[ ] Outcomes table has 3-5 concrete before/after rows.
[ ] Wiring plan has Create/Modify marker on every row.
[ ] Cross-links to PRD section and trio plan present.
[ ] INDEX.md updated; counts in header table bumped.
[ ] Coverage matrix flipped if applicable.
[ ] No "TBD" / "TODO" left in the body.
```

For common mistakes, worked examples, and template-section deep-dive, see [references/prompt-template-cheatsheet.md](references/prompt-template-cheatsheet.md).

---

## Escalation

| Situation | Route to |
|-----------|----------|
| One slice of a larger initiative with no PRD section | [`mde-writing-plans`](../mde-writing-plans/SKILL.md) — write PRD first |
| Multiple stakeholders need an architecture diagram | [tasks/trio/](../../../tasks/trio/) — diagram + prose live there |
| User asks for a roadmap, not a task | [`roadmap`](../roadmap/SKILL.md) |
| Need a new skill for a recurring pattern | [`mde-prompting`](../mde-prompting/skill-creator.md) |

Hand off to [research.md](research.md) (Phase 2) once the prompt exists.
