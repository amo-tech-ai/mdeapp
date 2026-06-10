# Linear setup — what to improve (plain English)

**Audience:** You, opening Linear daily.  
**Hub (start here):** [`linear.md`](linear/docs/linear.md) — best practices + local sync.  
**Naming / Launch table:** [`07-mvp.md`](07-mvp.md).  
**Specs stay on disk:** `tasks/**` — Linear is the **index**, not the PRD.

---

## One sentence

Your board naming is already good (`EVT-001 — …`, milestone **🚨 Launch Critical**). What broke was **saved views and scripts**, not missing work. Fix **labels + filters + GitHub links** so Linear stays a reliable window into the same truth as `todo.md`.

---

## Mental model (two layers on every issue)

Think of each issue as wearing two hats:

| Layer | Labels | Answers |
|-------|--------|---------|
| **Product** | `prefix:EVT`, `phase:launch`, milestone **🚨 Launch Critical** | *What does Camila / Roberto / Andrés get?* |
| **Engineering** | `track:ux`, `track:data`, `stack:supabase` (when added) | *Which pack or stack am I touching?* |

**Linear ID** = `SAN-###` (never changes). **Title** = `PREFIX-### — readable name` (what you scan in a list).

---

## What already works (don’t rip this out)

- **One project:** [MDEAPP](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues) — all ~275 issues live here.
- **Launch bucket:** milestone **🚨 Launch Critical** — PAY/EVT/OPS/ATH/MAP/AIA launch rows (see table in `07-mvp.md`).
- **Titles:** product codes in the title; spec IDs (`UX-003`, `EVP-013`) in the description.
- **Saved views:** MVP, UX, Data — good idea; they just need **stable filters** (below).

---

## What went wrong (why views looked “empty”)

A bulk rename script changed titles and labels. Your UX and Data views still filtered on:

- old milestone names (`P0 — MVP gates`), or
- labels that were removed (`track:ux`, `track:data`), or
- old title patterns (`UX-003` in the title)

**The tasks were never deleted** — only the view filters stopped matching.  
**Fix applied:** `track:ux` and `track:data` put back on the right SAN issues.  
**Rule going forward:** views should key off **labels**, not title text.

---

## Do this (priority order)

### 1. Fix saved views (15 minutes, no code)

Open each view → **Edit filter** → paste:

| View | Filter to use |
|------|----------------|
| **Launch / MVP** | `project:MDEAPP milestone:"🚨 Launch Critical" state:Todo,"In Progress"` |
| **UX pack** | `project:MDEAPP label:track:ux` |
| **Data pack** | `project:MDEAPP label:track:data` |
| **Blocked** | `project:MDEAPP has:blocked-by state:Todo,"In Progress"` |
| **Stale WIP** | `project:MDEAPP state:"In Progress" updated:< -P7D` |

In the view **description**, note: `Filter contract: label:track:ux` (so the next rename doesn’t surprise you).

Links: [UX view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) · [Data view](https://linear.app/sanjiovani/view/data-54425dec37b9) · [MVP view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207)

---

### 2. After any bulk Linear script

```bash
cd /home/sk/mdeai
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
node scripts/linear-restore-track-labels.mjs
```

Restores `track:ux` / `track:data` if a script strips them again.  
Do **not** re-run `linear-apply-prefix-catalog.mjs` casually — it rewrites titles.

---

### 3. Add `stack:*` labels (optional but useful)

So you can filter “everything that touches Supabase” without reading 275 titles.

Examples: `stack:mastra`, `stack:copilotkit`, `stack:supabase`, `stack:maps`, `stack:stripe`.  
Put **1–3** stack labels per issue, **in addition to** `prefix:*`.

Run after fetch:

```bash
node scripts/linear-apply-stack-labels.mjs
```

Log: [`stack-labels-apply-log.json`](stack-labels-apply-log.json). Details in `07-mvp.md`.

---

### 4. GitHub ↔ Linear (stops double bookkeeping)

In **Settings → Integrations → GitHub** for `amo-tech-ai/mdeapp`:

| When | Linear should |
|------|----------------|
| Branch / PR mentions `SAN-316` or `ai/san-316-…` | Link to the issue |
| PR opened | **In Review** (code ready, not shipped) |
| PR merged to `main` | **Done** |

You already use branch names like `ai/san-316-rnt-001-…` — wire the integration so status follows the PR.

---

### 5. Initiative + target date (roadmap layer)

Linear has **Projects** (MDEAPP) and optionally **Initiatives** (bigger goal above the project).

Create something like: **“Phase 1 — mdeai MVP launch”** → attach MDEAPP → target date from your plan (~mid-June **estimate**).  
That gives you a timeline bar in Linear; it does **not** replace milestones inside the project.

---

### 6. Pin links on the project (Resources)

**Project → Overview → Resources → +**  
Add GitHub links already listed in `07-mvp.md`: PRD index, `todo.md`, `mdeapp/docs/ARCHITECTURE.md`, this playbook.  
So nobody hunts paths in chat.

---

### 7. Issue templates (3–4 is enough)

When you create an issue, a template pre-fills the description:

| Template | Include |
|----------|---------|
| **Launch blocker** | Persona, route (`/chat`), spec path in `tasks/`, acceptance bullets, `phase:launch` |
| **UX fix** | `track:ux`, link to `tasks/ux/UX-*.md`, proof command |
| **Data / Supabase** | `track:data`, migration file, RLS yes/no |
| **Prod bug** | Sentry link, repro URL, who on prod sees it |

Paste from [`templates/`](./templates/) (`launch-blocker.md`, `ux-fix.md`, `data-supabase.md`, `prod-bug.md`) into **Team settings → Templates**.

---

### 8. Cycles — only for launch (optional)

**Cycles** = Linear’s sprints. For a tiny team: one cycle **“Launch”** containing only **🚨 Launch Critical** issues.  
Do **not** put all 275 issues in cycles — that feels like Jira again.

---

### 9. Weekly project update (5 bullets)

**Initiative updates** (changelog) — not the same as issue Activity:

| Surface | Use for |
|---------|---------|
| **Initiative → Updates tab** | Weekly progress narrative (health + 5 bullets) — **primary changelog** |
| **Issue → Activity** | Per-SAN comments, status changes, PR links |
| **Project → Updates** | Optional; **not enabled** for MDEAPP in this workspace — enable in Settings → Projects if desired |

Post on [Phase 1 initiative](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8/overview) (`Shift+U`). Template: [`templates/initiative-update.md`](initiative-update.md). Full mapping: [`12-linear-official-practices.md`](12-linear-official-practices.md).

1. Done this week  
2. Doing next  
3. Blocked  
4. MVP gates (PAY-001 SAN-178? EVT-001 SAN-115? UX-002/005 green?)  
5. Link to evidence under `tasks/testing/evidence/` or `tasks/notes/`

Async status without another doc.

---

### 10. Triage rule (keep inbox clean)

**Statuses to use:** Triage → Backlog → Todo → In Progress → In Review → Done.

- Random new stuff → **Triage** first.  
- Only real launch work → **Todo** + milestone **🚨 Launch Critical** + `phase:launch`.

---

### 11. Extra integrations (when you have time)

| Tool | Why |
|------|-----|
| **Sentry** | Prod `RUN_ERROR` → new issue tagged `prefix:AIA` |
| **Vercel** | Failed deploy → OPS issue |
| **Slack** | Post project updates to `#eng` |

---

### 12. Simplify labels over time

**Keep using:** `prefix:*`, `phase:launch` / `phase:post-mvp`, `track:ux`, `track:data`, `stack:*` (once added), `ux-order:*` / `data-order:*` on those packs only.

**Stop adding:** duplicate `area:*` when it means the same as `prefix:*`; `imp:*` on every issue (IMP belongs in description / `todo.md`).

---

## Don’t do this

| Don’t | Why |
|-------|-----|
| Filter views on `title~"UX-"` | Titles are now `AIA-002`, `RNT-001`, etc. |
| Filter views on old milestone names | Renamed to **🚨 Launch Critical**, **🍽️ Discovery — UI**, … |
| Copy the whole PRD into Linear Docs | Drifts from `plan/prd/` and `tasks/**` |
| Add 8+ custom statuses | Linear is built for a short workflow |
| Re-run prefix catalog without `--dry-run` | Overwrites titles |

---

## This week (checklist)

- [ ] UX view filter = `project:MDEAPP label:track:ux` — steps in [`09-views-setup.md`](09-views-setup.md)
- [ ] Data view filter = `project:MDEAPP label:track:data`
- [ ] Create **Blocked** and **Stale WIP** views (filters in `09-views-setup.md`)
- [ ] Connect GitHub → `mdeapp` (PR merge → Done) — [`GITHUB-LINEAR-SETUP.md`](GITHUB-LINEAR-SETUP.md)
- [x] Initiative [**Phase 1 — mdeai MVP launch**](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8) + target **2026-06-17** (estimate)
- [x] First Initiative status update posted (2026-05-30, **At risk**) — [Updates tab](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8/activity#initiative-update-c717252f)
- [x] Latest Initiative update (2026-05-31) — [clean UX branch + gate table](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8/activity#initiative-update-14cde205)
- [x] Project description links to playbook + `todo.md` (MCP 2026-05-30)
- [x] Launch milestone target date ~2026-06-17 (estimate)
- [x] `track:ux` / `track:data` restore script
- [x] `stack:*` apply script
- [x] Issue templates on disk under [`templates/`](./templates/)
- [x] Refresh [`01-linear.md`](01-linear.md)

---

## References

- [Linear Method — introduction](https://linear.app/method/introduction)  
- [Initiative & project updates](https://linear.app/docs/initiative-and-project-updates)  
- [Project milestones](https://linear.app/docs/project-milestones)  
- [Issue workflow](https://linear.app/docs/configuring-workflows)  
- Internal: [`12-linear-official-practices.md`](12-linear-official-practices.md) · [`07-mvp.md`](07-mvp.md) · [`docs/timeline.md`](../../docs/timeline.md) (forensic dates — estimates only)

---

## Scripts (repo)

| Script | When |
|--------|------|
| `scripts/linear-restore-track-labels.mjs` | After bulk label/title migration |
| `scripts/linear-apply-stack-labels.mjs` | (Re)apply `stack:*` from `prefix:*` |
| `scripts/linear-fetch-all-issues.mjs` | Refresh snapshot before scripts |
