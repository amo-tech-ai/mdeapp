# Archived Linear skills — 2026-06-20

These 20 skills were **consolidated** into the canonical `linear` skill
(`.agents/skills/linear/`, live via `.claude/skills/linear`). They are archived here — **not
deleted** — after the activation smoke tests passed. See:

- `docs/audits/linear-skill-consolidation-2026-06-20.md` (merge inventory)
- `docs/audits/linear-skill-activation-2026-06-20.md` (activation + smoke tests)

## What moved

Each entry was a real source folder at `.agents/skills/<name>` with a depth-1 symlink at
`.claude/skills/<name>`. The symlink was removed (so the skill no longer loads) and the source
folder moved here. Content is unchanged from its deprecated state (each still carries its
`DEPRECATED (2026-06-20)` banner).

| Skill | Folded into |
|---|---|
| `mde-linear` | core of `linear/SKILL.md` + `references/mdeai-conventions.md`, `issue-template.md` |
| `linear-claude-skill` | `references/backends.md` |
| `linear-tools`, `linear-pm` | `references/principles.md` |
| `linear-create` | `references/create.md` |
| `linear-update` | `references/update.md` |
| `linear-search` | `references/search.md` |
| `linear-projects` | `references/projects.md` |
| `linear-roadmaps` | `references/roadmaps.md` |
| `linear-labels` | `references/labels.md` |
| `linear-statuses` | `references/statuses.md` |
| `linear-sprint` | `references/sprint.md` |
| `linear-triage` | `references/triage.md` |
| `linear-workflow` | `references/workflow.md` |
| `linear-relations` | `references/relations.md` |
| `linear-milestones` | `references/milestones.md` |
| `linear-metrics` | `references/metrics.md` |
| `linear-pr` | `references/prs.md` |
| `linear-documents` | `references/documents.md` |
| `linear-views` | `references/views.md` |

## NOT archived (intentional)

- `linear` — the canonical skill (live).
- `linear-design` — naming collision; it is UI craft, not Linear PM. Preserved at
  `linear/references/design.md`; recommended to promote to a standalone `ui-design-quality`
  skill before retiring the `linear-design` name.
- user-global `~/.claude/skills/linear` — separate scan root, outside this repo.

## Restore one skill

```bash
cd /home/sk/mdeai/mdeapp/.claude/skills
mv archive/linear/<name> ../../.agents/skills/<name>
ln -s ../../.agents/skills/<name> <name>
```
