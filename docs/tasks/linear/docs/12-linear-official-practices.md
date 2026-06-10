---
title: Linear official practices (MDEAPP mapping)
updated: 2026-05-31
sources: linear.app/docs + linear.app/method
---

# Linear official practices → MDEAPP

Canonical mapping from [Linear docs](https://linear.app/docs) + [Linear Method](https://linear.app/method/introduction) to how **mdeai** uses [MDEAPP](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues).

**Hub:** [`linear.md`](linear/docs/linear.md) · Operator checklist: [`08-linear-improve.md`](08-linear-improve.md)

## Quick reference

| Question | Answer |
|----------|--------|
| Where is the weekly changelog? | [Initiative → Updates tab](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8/overview) (`Shift+U`) |
| Project updates? | **Disabled** in workspace — use Initiative; enable in Settings → Projects if needed |
| SAN ↔ spec lookup | [`mvp-queue.json`](mvp-queue.json) · [`mvp-canonical-titles.json`](mvp-canonical-titles.json) |
| Post update via MCP | `save_status_update` — `type: initiative`, `initiative: Phase 1 — mdeai MVP launch` |
| Edit existing update | Same MCP with `id: <update-uuid>` |
| Done gate | User only — [`04-completion-approval.md`](04-completion-approval.md) |

---

## Three layers (Linear Method)

| Linear layer | mdeai instance | What lives here |
|--------------|----------------|-----------------|
| **Initiative** | [Phase 1 — mdeai MVP launch](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8/overview) | Target **2026-06-17** (estimate); weekly **Initiative updates** = changelog |
| **Project** | [MDEAPP](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/overview) | ~275 issues; milestones = product buckets |
| **Issues** | `SAN-###` | Queue index; spec truth on disk in `tasks/**` |

**Rule:** PRD + task specs stay on disk. Linear = index, status, blockers, PR links, progress narrative.

---

## Official doc index

| Topic | Linear doc | mdeai use |
|-------|------------|-----------|
| Method intro | [method/introduction](https://linear.app/method/introduction) | Purpose-built workflow; write changelog; small issues |
| Continuous planning | [now/continuous-planning](https://linear.app/now/continuous-planning-in-linear) | Initiative → project → milestone → issue alignment |
| Initiatives | [docs/initiatives](https://linear.app/docs/initiatives) | Phase 1 initiative above MDEAPP |
| Project status | [docs/project-status](https://linear.app/docs/project-status) | MDEAPP = **In Progress** (manual; not auto from issue Done) |
| Project priority | [docs/project-priority](https://linear.app/docs/project-priority) | Launch Critical milestone > post-MVP buckets |
| Project graph | [docs/project-graph](https://linear.app/docs/project-graph) | Timeline + dependency lines (initiative view) |
| Project dependencies | [docs/project-dependencies](https://linear.app/docs/project-dependencies) | Use **issue** `blocked-by`; sub-projects later if split |
| Milestones | [docs/project-milestones](https://linear.app/docs/project-milestones) | 🚨 Launch Critical, Discovery UI, etc. — [`02-views-sort.md`](02-views-sort.md) |
| Issue workflow | [docs/configuring-workflows](https://linear.app/docs/configuring-workflows) | Todo → In Progress → In Review → Done |
| **Updates / changelog** | [docs/initiative-and-project-updates](https://linear.app/docs/initiative-and-project-updates) | **Initiative Updates tab** (project updates disabled in workspace) |

---

## Activity vs Updates vs Changelog

| Surface | Where | mdeai |
|---------|-------|-------|
| **Issue Activity** | Each issue → Activity | Comments, status flips, PR links (e.g. forensic audit sync) |
| **Initiative Updates** | Initiative → **Updates** tab | **Weekly progress changelog** — health + markdown body |
| **Project Updates** | Project → Updates tab | **Not enabled** for MDEAPP — use Initiative instead |
| **Milestone progress** | Project overview / timeline | % complete per milestone (issue Done counts) |

**Keyboard:** `Shift+U` on project/initiative page to draft an update.

---

## Issue workflow (official + mdeai)

Linear default: Backlog → Todo → In Progress → Done (+ Canceled, Duplicate).

**mdeai Sanjiovani team:**

```text
Backlog / Todo  →  In Progress  →  In Review  →  Done
```

| Transition | Who | When |
|------------|-----|------|
| → **In Progress** | Agent / you | Branch opened, ≤3 WIP |
| → **In Review** | Agent | Floor green + evidence path in comment + PR open |
| → **Done** | **User only** | [`04-completion-approval.md`](04-completion-approval.md) |

Do **not** add custom statuses beyond **In Review** — Linear Method: short workflow.

**Import rule:** disk `Done` → Linear **In Review**, not Done.

---

## Milestones (official + mdeai)

Per [project milestones](https://linear.app/docs/project-milestones):

- One project (MDEAPP), many milestones — **not shared across projects**
- Target dates on milestones (Launch Critical ≈ 2026-06-17)
- Filter: `milestone:"🚨 Launch Critical"` or `label:phase:launch` in views
- Group board by milestone for weekly sync
- Yellow “current” milestone icon = next incomplete — ignore if running parallel packs

**Do not** filter views on title text — use **labels** (`track:ux`, `prefix:EVT`).

---

## Dependencies

| Level | Linear feature | mdeai today |
|-------|----------------|-------------|
| **Issue** | Blocked by / Blocking | `has:blocked-by` view; `mvp-queue.json` deps |
| **Project** | Project dependencies (timeline) | Single MDEAPP project — defer until split (e.g. legacy freeze) |

Issue blockers = day-to-day. Project dependencies = roadmap timeline (Phase 2).

---

## Initiative & project updates (changelog)

Per [initiative-and-project-updates](https://linear.app/docs/initiative-and-project-updates):

1. Pick health: **On track** · **At risk** · **Off track**
2. Body: Done / Doing / Blocked / MVP gates / evidence links
3. Post on **Initiative Overview** → appears in **Updates** tab (chronological)
4. Optional: Workspace Settings → enable project update reminders + Slack `#initiative-updates`

**Template:** [`templates/initiative-update.md`](initiative-update.md) · optional MDEAPP slice: [`templates/project-update.md`](project-update.md) (requires enabling project updates)

**Agent/API:** `save_status_update` MCP — `type: initiative`, `initiative: Phase 1 — mdeai MVP launch`

---

## Weekly operator cadence (Linear Method)

| When | Action | Where |
|------|--------|-------|
| **Start of week** | Read [`MVP-EXECUTION.md`](MVP-EXECUTION.md) + Todo column | Linear MVP view |
| **Mid-week** | Post Initiative update (5 bullets) | Initiative → Update |
| **Per slice** | Issue comment + evidence path | Issue Activity |
| **PR open** | SAN in branch + **In Review** | GitHub ↔ Linear |
| **After bulk script** | `linear-restore-track-labels.mjs` | Terminal |

---

## Workspace settings checklist (UI — one-time)

| Setting | Path | Recommendation |
|---------|------|----------------|
| Initiative updates | Settings → Initiatives | Weekly reminder Wed 10:00 |
| Project updates | Settings → Projects | Enable if you want MDEAPP-level updates too |
| Slack | Settings → Integrations | `#initiative-updates` for Phase 1 posts |
| GitHub | Settings → Integrations | PR open → In Review; merge → Done — [`GITHUB-LINEAR-SETUP.md`](GITHUB-LINEAR-SETUP.md) |
| Issue statuses | Settings → Teams → Sanjiovani | Keep **In Review**; no status sprawl |

---

## mdeai anti-patterns (still valid)

| Don't | Do |
|-------|-----|
| Copy full PRD into Linear Docs | Link to `tasks/**` + comment |
| Mark Done on audit pass alone | In Review until merged + user approval |
| Filter `title~"UX-"` | `label:track:ux` |
| Run `linear-apply-prefix-catalog.mjs` without `--dry-run` | Dry-run first; prefer [`mvp-canonical-titles.json`](mvp-canonical-titles.json) |
| One giant PR | Ledger slices + SAN comments |

---

## References

- [Linear docs home](https://linear.app/docs)
- [Linear Method — introduction](https://linear.app/method/introduction)
- [Continuous planning in Linear](https://linear.app/now/continuous-planning-in-linear)
- Internal: [`09-views-setup.md`](09-views-setup.md) · [`GITHUB-LINEAR-SETUP.md`](GITHUB-LINEAR-SETUP.md)
