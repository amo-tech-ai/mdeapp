---
title: Linear skill activation report
date: 2026-06-20
owner: ai@socialmediaville.ca
status: ACTIVATED (symlink repointed) · nothing deleted
follows: linear-skill-consolidation-2026-06-20.md
---

# Linear skill activation report

**Plain summary:** The canonical `linear` skill is now **live** — typing `/linear` runs the new
merged skill, and all six smoke-test workflows (search, create, update, triage, roadmap,
relations) passed against the real SAN workspace. The test issue was created and then canceled,
so the backlog is clean. Two loose ends remain: a stray GitHub issue #274 the Linear↔GitHub
sync auto-created (I was blocked from closing it), and a **duplicate `linear` skill name** still
registered from your user-global config. **Real-world effect: internal tooling only** — no
Roberto/Camila/Andrés surface changed. Nothing was deleted.

---

## 1. Validation results

### Reference + link integrity
- All **21** references present (16 topic + 5 supporting: mdeai-conventions, backends,
  issue-template, principles, design).
- Internal link audit: **0 broken links** after fixing 3 phantom links to a never-existent
  `mde-task-lifecycle/references/linear-issue-steps.md` (repointed to `issue-template.md` /
  `mde-task-lifecycle/SKILL.md`).
- All external relative links (`linear.md`, `linear-reference.md`, CK-V2 skills map,
  mde-task-lifecycle) resolve to real files.

### Activation
- `.claude/skills/linear` repointed: `/home/sk/.claude/skills/linear` → `../../.agents/skills/linear`.
- Resolves to `/home/sk/mdeai/mdeapp/.agents/skills/linear`; `name: linear` confirmed live.
- **Reversible:** `ln -sfn /home/sk/.claude/skills/linear .claude/skills/linear` restores the old package.

### Smoke tests (live SAN workspace, team "mde", id `dfea57b5…`)
| Workflow | Method | Result |
|---|---|---|
| **search** | `list_issues` query "event venue" | ✓ returned SAN-855, SAN-1115, SAN-937, SAN-1179, SAN-747 |
| **roadmap** | `list_initiatives` | ✓ 5 initiatives; "Phase 1 — mdeai MVP launch" Active, health atRisk |
| **triage** | `list_issues` assignee=null state=Triage | ✓ ran clean, empty — **team has no Triage state** (confirmed via `list_issue_statuses`) |
| **create** | `save_issue` (no id) | ✓ created **SAN-1261** (throwaway) |
| **update** | `save_issue` (id) priority+state+description | ✓ Low→Medium, Backlog→Todo, body updated |
| **relations** | `save_issue` relatedTo then removeRelatedTo | ✓ added relatedTo SAN-855, verified via `get_issue`, removed cleanly |
| **cleanup** | `save_issue` state=Canceled | ✓ SAN-1261 Canceled; SAN-855 left unmarked |

All four best practices held during the test: SAN-1261 was paired with its title throughout,
the relation was removed so no dependency leaked onto SAN-855, and the issue carried ≥2 AC items.

## 2. Confirmed: no content lost

- Every signature command from all 16 linear-cli topic skills is present in its target
  reference (re-verified during build; grep-confirmed).
- `design.md` = the original 187 lines of `linear-design` verbatim.
- `principles.md` carries the full `linear-tools` + `linear-pm` PM knowledge (iron laws,
  anti-patterns, rate limits). `backends.md` carries the user-global npm/SDK/GraphQL/varlock
  guidance. `mdeai-conventions.md` carries the `mde-linear` conventions + CK-V2 map.

## 3. Remaining risks

| Risk | Severity | Detail | Mitigation |
|---|---|---|---|
| **Duplicate `linear` skill name** | Medium | Both the project scan root (canonical) AND user-global `~/.claude/skills/linear` (old npm pkg) now register a skill named `linear` — it appears twice in the skill list. Which one wins on `/linear` is ambiguous across projects. | Remove or rename the user-global `~/.claude/skills/linear` (user-global, outside this repo — your call). Project precedence usually wins, but the collision is untidy. |
| **Deprecated skills still load** | Low | The 20 deprecated skills + linear-design still exist as symlinks in the scan root, so they still register and could still trigger despite the banners. | Archive them (section 4). Banners already steer away. |
| **Stray GitHub issue #274** | Low | Linear↔GitHub sync auto-created [amo-tech-ai/mdeapp#274](https://github.com/amo-tech-ai/mdeapp/issues/274) from the smoke test; canceling the Linear issue did **not** auto-close it. I was blocked by auto-mode from closing it. | You close it: `gh issue close 274 --repo amo-tech-ai/mdeapp`. |
| **Nothing committed** | Info | All work (canonical skill, banners, repoint, link fixes, both reports) is uncommitted on `chore/design-sync-ui-primitives`. The symlink repoint is a working-tree change. | Commit when ready (message in consolidation report). |

## 4. Archive candidates (recommend archiving immediately — but NOT yet deleted)

**Safe to archive now** (pure content dupes, fully absorbed, verified):
- `linear-claude-skill` (near-dup fork of user-global)
- `linear-tools`, `linear-pm` (→ principles.md)
- All 16 linear-cli topic skills: `linear-create`, `linear-update`, `linear-search`,
  `linear-projects`, `linear-roadmaps`, `linear-labels`, `linear-statuses`, `linear-sprint`,
  `linear-triage`, `linear-workflow`, `linear-relations`, `linear-milestones`, `linear-metrics`,
  `linear-pr`, `linear-documents`, `linear-views`
- `mde-linear` (its content is the core of the new skill — safe, canonical supersedes it)

**Do NOT archive yet:**
- `linear-design` — naming collision; it is UI craft, not Linear PM. Promote to a standalone
  `ui-design-quality` skill first, then retire the `linear-design` name.
- user-global `~/.claude/skills/linear` — separate scan root, can't archive from this repo;
  resolve the name collision there separately.

Archive = remove the scan-root symlinks + move sources to `.agents/skills/_archive/2026-06-NN/`
with a MANIFEST (per the established trim process). The 19 immediately-safe symlinks:
```bash
cd .claude/skills && rm linear-claude-skill mde-linear linear-tools linear-pm \
  linear-create linear-update linear-search linear-projects linear-roadmaps \
  linear-labels linear-statuses linear-sprint linear-triage linear-workflow \
  linear-relations linear-milestones linear-metrics linear-pr linear-documents linear-views
```

## 5. Final recommendation

**Activation succeeded — keep it.** The canonical `linear` skill is live, link-clean, and
proven end-to-end against the real workspace. Recommended next actions, in order:

1. **You close GitHub #274** (one command above) — I was blocked from doing it.
2. **Resolve the duplicate name** — remove/rename user-global `~/.claude/skills/linear`.
3. **Archive the 19 safe deprecated skills** (section 4) once you've confirmed the live skill
   behaves — banners already steer away, so this is low-urgency.
4. **Promote `linear-design`** to `ui-design-quality`, then retire that name.
5. **Commit** the branch (canonical skill + banners + repoint + link fixes + both reports).

Nothing is deleted. Steps 2–5 are review-gated and reversible.
