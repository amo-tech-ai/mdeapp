---
title: Phase 2 — Research
impact: MEDIUM
impactDescription: Question→source→decision; audit before non-trivial edits
tags: mde-task-lifecycle, research, audit
---

# Phase 2 — Research

Coordinator. Owns the question→source→decision loop. Detailed audit checklists live in [references/audit-checklist.md](references/audit-checklist.md).

---

## Table of contents

1. [Entry / exit criteria](#entry--exit-criteria)
2. [When to research](#when-to-research)
3. [Workflow checklist](#workflow-checklist)
4. [Source prioritization](#source-prioritization)
5. [Validation criteria](#validation-criteria)
6. [Output format](#output-format)
7. [Anti-patterns](#anti-patterns)
8. [Routing](#routing)

---

## Entry / exit criteria

| | Criterion |
|---|---|
| **Entry** | Prompt exists OR is being drafted, AND ≥1 of: external API behavior unknown, current code state unverified, dependency drift suspected, security/RLS implications unclear. |
| **Exit** | Audit notes saved (inline in prompt body, in [docs/audits/](../../../docs/audits/), or as comment block) covering: facts validated, sources cited, risks ranked, assumptions explicit, decision recorded. |

---

## When to research

| Trigger | Insert before |
|---------|---------------|
| New external integration (Shopify, Gadget, Stripe, Google Routes) | Phase 1 — informs the plan |
| Edits inside an unfamiliar module | Phase 3 — informs the wiring |
| Migration touches existing rows | Phase 3 — informs rollback |
| Refactor of a hook used in >5 places | Phase 3 — informs blast radius |
| AI agent / prompt change | Phase 4 — informs eval set |
| Suspected breaking change since last touch | Phase 5 — informs release notes |

Skip research when: wiring plan is fully concrete, every referenced file is in working memory, and the change is ≤3 file edits.

---

## Workflow checklist

```
[ ] 1.  State the question in one sentence.
[ ] 2.  List candidate sources in priority order.
[ ] 3.  For each source: capture URL/path, accessed-on date, verbatim quote.
[ ] 4.  Reconcile contradictions (newer source wins; note the conflict).
[ ] 5.  Walk the codebase: grep for the symbol, read 2-3 callsites.
[ ] 6.  Run forensic checks (see references/audit-checklist.md).
[ ] 7.  Rank risks: likelihood × blast-radius (matrix in audit-checklist.md).
[ ] 8.  List assumptions explicitly.
[ ] 9.  Decide: green-light / blocked / replan.
[ ] 10. Write the audit note (Output format below).
```

For full forensic checks (secrets, RLS, schema drift, deps, env hygiene, AI specifics), red-flag patterns, and the risk-analysis matrix, see [references/audit-checklist.md](references/audit-checklist.md).

---

## Source prioritization

Lower-ranked sources cannot override higher ones.

1. **Official docs** — Supabase, Vercel, Vite, React, Tailwind, shadcn/ui, Anthropic, Gemini, Shopify, Gadget. Always link the URL.
2. **Project rules** — [CLAUDE.md](../../../CLAUDE.md), [.claude/rules/](../../rules/), [tasks/tasks-template.md](../../../tasks/tasks-template.md), [prd.md](../../../prd.md).
3. **Recent commits / PRs** — `git log --since=…`, [CHANGELOG.md](../../../CHANGELOG.md).
4. **Repo code** — actual current state (read the file, do not infer).
5. **Stack Overflow / blog posts** — only when 1-4 are silent. Cite URL and date.
6. **LLM memory** — last resort. Always flag as "unverified, needs source".

Never trust LLM memory for: API surface area, version compatibility, security defaults, deprecation timelines.

---

## Validation criteria

Research is "done" when all hold:

- Every fact has a source link or grep-verified codepath.
- Every assumption is named and either confirmed or flagged.
- Every risk has a likelihood × blast-radius rating.
- The decision (green-light / blocked / replan) is explicit.
- A reader who hasn't seen the codebase could verify claims from the note alone.

---

## Output format

Audit notes go in one of these places:

| Location | When |
|----------|------|
| Inline in prompt body under `## Research notes` | Most common; keeps spec + research together |
| `docs/audits/<YYYY-MM-DD>-<topic>.md` | Multi-task research |
| Comment block at top of implementation file | Single-file refactor |

Required structure:

```markdown
## Research notes — <topic> (<YYYY-MM-DD>)

**Question:** <one sentence>

**Sources**
- <URL or path> (accessed YYYY-MM-DD) — <takeaway>

**Findings**
1. <claim> — <source ref>

**Risks**
| Risk | Likelihood | Blast | Mitigation |
|------|-----------|-------|------------|
| ... | Med | High | ... |

**Assumptions**
- <named assumption>

**Decision:** Green-light / Blocked / Replan — <one sentence why>
```

---

## Anti-patterns

| Anti-pattern | Fix |
|--------------|-----|
| Researching forever without a decision | Time-box to 30 minutes; if undecided, escalate to user. |
| Citing LLM memory as a source | Replace with official URL or grep result. |
| Reading one file and concluding | Read ≥3 callsites for non-trivial symbols. |
| Ignoring project rules for generic best practices | [CLAUDE.md](../../../CLAUDE.md) wins for this repo. |
| Trusting Stack Overflow >2 years old | Re-verify against current official docs. |
| Researching after Phase 3 starts | Move research before code edits. Discovery during code = replan. |

---

## Routing

| Need | Route to |
|------|----------|
| Forensic checks (secrets, RLS, schema, deps, dead code) | [references/audit-checklist.md](references/audit-checklist.md) |
| Migration safety review | [references/migration-safety.md](references/migration-safety.md) |
| Stuck mid-investigation | **`systematic-debugging`** — see [CLAUDE.md](../../../CLAUDE.md) (Skills) |
| Need to update PRD based on findings | [`mde-writing-plans`](../mde-writing-plans/SKILL.md) |

Hand off to [implementation.md](implementation.md) once the audit note is written and decision = green-light.
