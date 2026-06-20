---
title: Linear skill consolidation — migration report
date: 2026-06-20
owner: ai@socialmediaville.ca
status: built, review-gated (NOT committed, NOT activated)
scope: .claude/skills/ + .agents/skills/ Linear-family skills
---

# Linear skill consolidation — migration report

**Plain summary:** 22 overlapping "Linear" skills were merged into one canonical `linear`
skill (1 SKILL.md + 21 topic references). The new skill is **built but dormant** — it lives in
the un-scanned source dir (`.agents/skills/linear/`), nothing is committed, nothing is deleted,
and the live `/linear` command still points at the old user-global package. Old skills got a
deprecation banner only. **Real-world effect: none yet** — internal tooling only; no persona
(Roberto/Camila/Andrés) surface changes. Activation is a one-line symlink repoint, gated on
your review.

---

## 1. Inventory (what existed, what it became)

| Old skill | Family | Unique content | Fate |
|---|---|---|---|
| `mde-linear` | mdeai canonical wrapper | mdeai conventions, CK-V2 map, progress sync, exec issue template | **Core of new SKILL.md** + `mdeai-conventions.md`, `issue-template.md` |
| `linear` (user-global) | npm v3.2.0 pkg (`npm run ops`, SDK, GraphQL) | bulk ops scripts, varlock secrets | Folded into `backends.md`; **left in place** (shared, outside repo) |
| `linear-claude-skill` | near-dup fork of user-global | none unique | Deprecated → `backends.md` |
| `linear-tools` | EM principles prompt | PM principles, SLA, estimation | → `principles.md` |
| `linear-pm` | GraphQL catalog | iron laws, anti-patterns, rate limits | → `principles.md` |
| `linear-create` | linear-cli | `i create` flags | → `create.md` |
| `linear-update` | linear-cli | `i update` flags | → `update.md` |
| `linear-search` | linear-cli | `s issues` / `s projects` | → `search.md` |
| `linear-projects` | linear-cli | `p` commands | → `projects.md` |
| `linear-roadmaps` | linear-cli | `rm` commands | → `roadmaps.md` |
| `linear-labels` | linear-cli | `l` commands | → `labels.md` |
| `linear-statuses` | linear-cli | `st` commands | → `statuses.md` |
| `linear-sprint` | linear-cli | `sp` (burndown/velocity) | → `sprint.md` |
| `linear-triage` | linear-cli | `tr` (claim/snooze) | → `triage.md` |
| `linear-workflow` | linear-cli | `i start/stop`, `context` | → `workflow.md` |
| `linear-relations` | linear-cli | `rel` commands | → `relations.md` |
| `linear-milestones` | linear-cli | `ms` commands | → `milestones.md` |
| `linear-metrics` | linear-cli | `mt` commands | → `metrics.md` |
| `linear-pr` | linear-cli | `g pr` / `g checkout` | → `prs.md` |
| `linear-documents` | linear-cli | `d` commands | → `documents.md` |
| `linear-views` | linear-cli | `v` commands | → `views.md` |
| `linear-design` | **naming collision** (UI craft) | full 187-line design system | Copied verbatim → `design.md`; flagged to promote to standalone `ui-design-quality` |

**Overlap found:** `linear` ≈ `linear-claude-skill` (near-identical fork). The 16 `linear-cli`
topic skills were one tool sliced 16 ways. `linear-tools` + `linear-pm` were two halves of the
same PM-principles knowledge. `mde-linear` was the only mdeai-aware one.

---

## 2. Proposed folder structure (built)

```
.agents/skills/linear/
├── SKILL.md                      (223 lines — MCP-first, 4 best practices, exec checklist)
└── references/
    ├── mdeai-conventions.md      (116)  projects, labels, prefixes, CK-V2 map
    ├── issue-template.md         (123)  6-section template + A1…E5 skeleton + Mermaid
    ├── backends.md               ( 81)  MCP > bulk scripts > linear-cli > SDK/ops > GraphQL
    ├── principles.md             ( 61)  PM principles, iron laws, anti-patterns, rate limits
    ├── design.md                 (187)  UI craft (verbatim from linear-design — see note)
    ├── create.md update.md search.md projects.md
    ├── roadmaps.md labels.md statuses.md sprint.md triage.md
    ├── workflow.md relations.md milestones.md metrics.md
    └── prs.md documents.md views.md
```

Total: 1 SKILL.md + 21 references = **1,377 lines**. SKILL.md is under the 500-line budget;
detail lives in references (progressive disclosure).

---

## 3. Files changed

**Created (22):** `.agents/skills/linear/SKILL.md` + the 21 `references/*.md` above.

**Modified (21 — deprecation banner only, no content removed):** `mde-linear`,
`linear-claude-skill`, `linear-tools`, `linear-pm`, and the 16 `linear-cli` topic skills got a
`DEPRECATED (2026-06-20)` banner + description prefix. `linear-design` got a tailored
naming-collision banner. (Editing these touched the `.agents/skills/*` sources, since the
`.claude/skills/*` entries are symlinks to them.)

**NOT touched:** user-global `/home/sk/.claude/skills/linear` (shared across projects);
`index-skills.md`, `CLAUDE.md`, `index.md` (verified — they contain **zero** references to any
old Linear skill, so no registry edits were needed).

---

## 4. Migration summary

- MCP-first: the new skill drives the official Linear MCP (`mcp__linear__save_issue` etc.) as
  the primary backend — matching mdeai's actual day-to-day practice — with linear-cli / bulk
  scripts / SDK / GraphQL as documented fallbacks.
- The **four best practices** are preserved and elevated to a "never skip" section in SKILL.md:
  verify before Done · full task names · preserve dependencies · evidence before closing.
- mdeai conventions (SAN team, phase/track/stack labels, deprecated prefixes, branch/PR magic
  words, CK-V2 map, priority mapping) are centralized in `mdeai-conventions.md`.

## 5. Validation results

- **Command coverage:** every signature command from all 16 linear-cli topic skills was
  grep-confirmed present in its target reference (`rm list`→roadmaps, `l create`→labels,
  `st list`→statuses, `sp velocity`→sprint, `tr claim`→triage, `i start`→workflow, `rel add`→
  relations, `ms create`→milestones, `mt cycle`→metrics, `g pr`→prs, `d create`→documents,
  `v list`→views, `i create`→create, `i update`→update, `s issues`→search, `p create`→projects).
- **design.md** = the original 187 lines of `linear-design` verbatim (source is now 194 only
  because of the +7-line banner added after the copy).
- **SKILL.md reference map** links all 21 references; no dangling/missing links.
- **No content loss detected.**

## 6. Recommended cleanup plan (review-gated — DO THIS AFTER APPROVAL)

1. **Activate** the canonical skill — repoint the scan-root symlink:
   ```bash
   ln -sfn ../../.agents/skills/linear .claude/skills/linear
   ```
   This is the only step that makes `/linear` use the new skill. **Reversible:**
   `ln -sfn /home/sk/.claude/skills/linear .claude/skills/linear` restores the old package.
2. **Smoke-test** `/linear` after repoint (create + update a throwaway SAN issue, mark Done
   with evidence) to confirm MCP flow works end-to-end.
3. **Remove the deprecated symlinks** from the scan root once confident:
   ```bash
   cd .claude/skills && rm linear-claude-skill mde-linear linear-tools linear-pm \
     linear-create linear-update linear-search linear-projects linear-roadmaps \
     linear-labels linear-statuses linear-sprint linear-triage linear-workflow \
     linear-relations linear-milestones linear-metrics linear-pr linear-documents linear-views
   ```
   (Sources stay in `.agents/skills/` until you also archive them via the dated MANIFEST flow.)
4. **Promote `linear-design`** to a standalone `ui-design-quality` skill (it is UI craft, not
   Linear PM). Until then it keeps its collision banner.
5. **Archive** the deprecated sources under `.agents/skills/_archive/2026-06-NN/` with a
   MANIFEST, per the established trim process.

## 7. Recommended commit message

```
chore(skills): consolidate 22 Linear skills into canonical `linear`

Merge mde-linear, linear-claude-skill, linear-tools, linear-pm, and the 16
linear-cli topic skills into one MCP-first `linear` skill (SKILL.md + 21
references). Preserve all unique commands, the executable issue template, the
four best practices (verify-before-Done, full task names, preserve deps,
evidence-before-close), and mdeai conventions. Deprecation banners on old
skills (not deleted). linear-design flagged as a naming collision (UI craft)
for promotion to ui-design-quality. No registry/CLAUDE.md refs needed changing.

Built dormant in .agents/skills/linear/; activation (symlink repoint) and
deletion are review-gated — see docs/audits/linear-skill-consolidation-2026-06-20.md.
```
