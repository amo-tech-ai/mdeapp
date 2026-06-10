I'll research Linear's official docs across all those URLs concurrently before synthesizing recommendations.

Good research back. Let me also read the current project state before synthesizing.

Here is the full production-ready Linear design for mdeai/mdeapp, grounded in verified feature availability from official docs.

---

## mdeai — Linear Setup: Production-Ready Design

---

### Tier Reality Check First

|Feature|Free|Basic|**Business**|Enterprise|
|---|:-:|:-:|:-:|:-:|
|Issues|250|∞|∞|∞|
|Teams|2|5|∞|∞|
|Insights (analytics)|✗|✗|**✓**|✓|
|Dashboards|✗|✗|✗|**✓ only**|
|Triage Intelligence (AI)|✗|✗|**✓**|✓|
|Linear Agent automations|✗|✗|**✓**|✓|
|GitHub integration|✓|✓|✓|✓|
|Milestones|✓|✓|✓|✓|
|Initiatives|✓|✓|✓|✓|
|Cycles|✓|✓|✓|✓|
|Custom views|✓|✓|✓|✓|

> **Minimum recommended tier: Business ($16/user/mo).** Insights alone justifies the upgrade — it's the only way to see cycle time, lead time, and burn-up charts without manual tracking.

---

### 1. Best Linear Hierarchy

```
Workspace
└── Initiative: "mdeai Phase 1 — MVP Launch" (mdeai.co north star)
    ├── Project: MDEAPP (existing — keep)
    │   ├── Milestone: "TIER 1 — P0 Exit"         (MAP-002B, AUTH-011, EVT-003/013)
    │   ├── Milestone: "TIER 1C — UX Production"  (UX-007, UX-020/023/024)
    │   ├── Milestone: "TIER 1D — PR Remediation" (PR-01 → PR-15 train)
    │   ├── Milestone: "TIER 2 — P1 Polish"       (EVT-014, AUTH-005)
    │   └── Milestone: "TIER 3 — Intelligence"    (INT-001 → INT-005)
    │
    └── Project: DATA Foundation (separate — different timeline)
        ├── Milestone: "4A Venues"
        └── Milestone: "4B Rentals / 4C Trips"
```

**Why this shape:**

- One **Initiative** = one launch narrative. Linear's Initiative health auto-rolls up from project updates.
- **MDEAPP project** already exists — don't restructure it, add milestones to it.
- **Milestones map directly to your TIER system** — you get % complete + timeline on the Initiative view for free.
- Split DATA into a separate project because its completion criteria differ from MVP exit.

---

### 2. Best Views & Filters

|View Name|Filter|Purpose|
|---|---|---|
|**MVP EXECUTION** ✅ existing|`project:MDEAPP label:phase:launch`|Daily operator surface|
|**BLOCKERS** ✅ existing|`project:MDEAPP has:blocked-by state:Todo,"In Progress"`|P0 every morning|
|**PRODUCTION READINESS** 🆕|`project:MDEAPP label:phase:launch state:!Done milestone:"TIER 1*" priority:urgent,high`|Pre-ship gate view|
|**PR TRAIN** 🆕|`label:track:pr state:!Done,!Cancelled`|PR-01→15 sequence|
|**FLOOR FAILURES** 🆕|`project:MDEAPP label:status:blocked-tests`|Test gate failures|
|**DONE THIS WEEK** 🆕|`project:MDEAPP state:Done completed:>-7d`|Changelog source|
|**IN REVIEW** 🆕|`project:MDEAPP state:"In Review"`|PRs awaiting merge|
|**INTELLIGENCE CORE** ✅ existing|`project:MDEAPP label:prefix:INT`|TIER 3 tracking|
|**POST-MVP** ✅ existing|`label:phase:post-mvp`|Backlog quarantine|

**Save views at workspace level** (not team) so they survive team restructuring.

---

### 3. Dashboard / Command Center

> **Dashboards = Enterprise only.** For Business tier, use **Insights + saved views as the command center.**

**Business-tier command center (pinned sidebar order):**

```
1. MVP EXECUTION view        → "what's next right now"
2. BLOCKERS view             → "what's stopping us"
3. IN REVIEW view            → "what needs PR attention"
4. DONE THIS WEEK view       → "changelog source"
5. Initiative timeline       → "are we on track"
6. Insights: Cycle Time      → "how fast are we actually shipping"
```

**Enterprise Dashboard layout (if/when upgraded):**

|Block|Chart type|Metric|
|---|---|---|
|MVP Exit progress|Burn-up|TIER 1 issues Done vs total|
|Velocity|Bar (weekly)|Issues completed per week|
|Blockers|Table|Active blocked issues|
|Cycle time|Scatter|Time from In Progress → Done|
|PR health|Table|Open PRs by age|
|Floor failures|Count|Issues with `label:status:blocked-tests`|

---

### 4. GitHub Automation Strategy

**Branch naming convention** (implement immediately — zero cost, works on all tiers):

```bash
# Pattern: {SAN-###}-{kebab-slug}
git checkout -b SAN-409-rental-date-filters
git checkout -b SAN-425-routing-confidence
```

Linear auto-links the branch to the issue. PR open → issue moves to "In Review". PR merged → issue moves to "Done".

**PR description magic words** (use closing form to auto-close issues):

```markdown
Closes SAN-409
Fixes SAN-425
Part of SAN-401 (non-closing — keeps issue open)
```

**Branch-specific automation rules** (set in Settings → Team → Issue statuses & automations):

|Branch pattern|Event|Linear action|
|---|---|---|
|`main`|PR merged|→ Done|
|`main`|PR opened|→ In Review|
|any|PR drafted|→ In Progress|
|any|PR merged|→ Done (fallback)|

**Triage Intelligence** (Business tier): Enable on MDEAPP team. AI auto-suggests labels, assignees, and priorities when issues land in Triage. Cuts the "newly opened issue sits unlabelled for 3 days" problem.

---

### 5. Progress Tracking Workflow

**Weekly rhythm:**

|Day|Action|Where|
|---|---|---|
|Mon|Review BLOCKERS view — clear or escalate all|Linear|
|Daily|Move issues through state as work happens (never batch)|Linear|
|On PR merge|Verify issue auto-closed by GitHub automation|Linear|
|Weekly|Post **Project Update** on MDEAPP project|Linear|
|Milestone complete|Convert TIER milestone to Done, post initiative update|Linear|

**Progress states** (map your existing dot system to Linear states):

|Your dot|Linear state|Label|
|---|---|---|
|⚪ Not Started|Backlog / Todo|—|
|🟡 In Progress|In Progress|—|
|🟡 In Review|In Review|—|
|🟢 Complete|Done|—|
|🔴 Blocked|In Progress|`status:blocked`|
|🔴 Test failure|In Progress|`status:blocked-tests`|

> Don't create custom statuses for blocked — use a label + the existing state. Linear's `has:blocked-by` filter handles blocker views without a custom status.

---

### 6. Changelog Strategy

**Use Linear Project Updates as the source of truth:**

1. Every Friday (or milestone completion): open MDEAPP project → **New Update**
2. Template:

```markdown
## Week of {date} — {milestone focus}

### ✅ Shipped
- SAN-### Task name (PR #N)
- SAN-### Task name

### 🟡 In Progress
- SAN-### Task name — {what's remaining}

### 🔴 Blocked
- SAN-### Task name — blocker: {reason}

### 📊 Floor
- Vitest: {N} passing / {N} failing
- Build: clean / broken

### 🎯 Next week
- {top 3 priorities}
```

3. Initiative status auto-derives from project update health (On Track / At Risk / Off Track).
4. Export to `tasks/changelog` via the "Done This Week" view → export CSV → append to `changelog` file.

---

### 7. Status Workflow

**Recommended state machine** (configure in Settings → Team → Workflow):

```
Backlog → Todo → In Progress → In Review → Done
                     ↑                        ↓
                 (unblock)      Cancelled ←→ Done
```

**Rules:**

- **Only "Done" issues count toward milestone %** — never leave issues in "In Review" long-term.
- **Cancelled** = explicitly out of scope (not just deprioritized — those stay in Backlog).
- **Anti-pattern to avoid:** closing issues via label rather than state. State drives all Insights metrics.

**Custom workflow for floor gates:**

Add a "Blocked - Tests" workflow state (separate from "In Progress") only if you want Insights to surface it. Otherwise use the label approach above.

---

### 8. Operational KPIs

**Available on Business tier via Insights:**

|KPI|Linear metric|Target|
|---|---|---|
|Velocity|Issues completed / week|≥ 8 issues/week (current pace)|
|Cycle time|In Progress → Done|< 2 days for P0; < 5 days for P1|
|Lead time|Created → Done|< 7 days for P0|
|Blocker resolution|Blocked → unblocked|< 24 hours for P0 blockers|
|Floor health|Issues with `status:blocked-tests`|0 at any ship gate|
|PR age|Open PR age in "In Review"|< 3 days|
|MVP exit %|Done / total in TIER 1 milestone|100% = ship gate|

**Manual KPIs** (free, track in weekly update):

|KPI|Source|
|---|---|
|Vitest pass count|`npm run test` output|
|Build clean|`npm run build` exit code|
|Localhost proof|`curl :3001/api/copilotkit`|
|Floor count|`tasks/progres.md`|

---

### 9. Proof/Testing Verification Best Practices

**Gate model — 3 levels, no shortcuts:**

|Gate|Trigger|Check|Linear action|
|---|---|---|---|
|**G1 — Unit**|Before "In Review"|`npm run test` all pass|Move to In Review|
|**G2 — Integration**|Before "Done"|`curl` proof + localhost boot|Move to Done|
|**G3 — Prod**|Before milestone Done|mdeai.co live test (Andrés ticket, Roberto publish, Camila cards)|Mark milestone Done|

**Anti-fake-done rule** (from your existing checklist):

- No issue moves to Done without a recorded proof artifact (curl output, screenshot, or PR link).
- Link the proof in the issue comment before closing.
- Pure-doc issues: note "N/A - no source change" explicitly.

**Linear Issue → PR → Proof chain:**

```
Issue SAN-### → branch SAN-###-slug → PR with "Closes SAN-###"
→ PR description includes proof screenshot/curl
→ PR merged → Linear auto-closes → Done
```

---

### 10. AI-Assisted Development Workflow

**Linear + Claude Code integration patterns:**

|Pattern|How|
|---|---|
|**Task intake**|Issues created in Linear → Claude reads `tasks/` markdown (canonical) → ships → PR closes issue|
|**Milestone planning**|Use Linear milestone % as floor check — if < 80% at mid-milestone, escalate in project update|
|**Triage Intelligence**|Business tier: AI auto-labels new issues (reduces "what is this?" friction)|
|**Linear Agent**|Business tier: configure to auto-move issues when PR opened/merged (already covered in GitHub rules)|
|**Session context**|Each Claude session starts with: open BLOCKERS view → pick top priority → work top-to-bottom|
|**Changelog generation**|"Done This Week" view → select all → copy → paste into project update (30 sec)|
|**Scope control**|One issue = one PR = one branch. Linear's PR link on the issue is the scope boundary.|

**Anti-pattern to avoid:** Creating Linear issues for every subtask. Sub-issues work, but only for things that independently ship. Internal steps stay in the parent issue description.

---

### Implementation Checklist

|Task|Status|%|✅ Confirmed|⚠️ Missing|💡 Next Action|
|---|---|--:|---|---|---|
|Initiative "Phase 1 MVP" created|⚪|0%|MDEAPP project exists|Initiative wrapper|Create Initiative, link MDEAPP + DATA projects|
|Milestones map to TIERs|⚪|0%|TIER system in tasks/INDEX.md|Milestones in Linear|Add 5 milestones to MDEAPP project (TIER 1–3 + 1C/1D)|
|PRODUCTION READINESS view|⚪|0%|Existing MVP view|Filtered to TIER 1 urgent|Create view with milestone + priority filter|
|DONE THIS WEEK view|⚪|0%|—|New|Create with `completed:>-7d` filter|
|GitHub branch naming convention|🟡|50%|Branch `SAN-409` on commits|No team convention doc|Add convention to CLAUDE.md / LESSONS.md|
|PR description magic words|🟢|100%|PRs reference SAN-###|—|Already working|
|Branch automation rules|⚪|0%|—|main/staging rules|Configure in Team Settings|
|Weekly Project Update habit|⚪|0%|—|No template|Use template above, every Friday|
|`status:blocked` label|⚪|0%|`phase:*` labels exist|No blocker label|Add to workspace labels|
|`status:blocked-tests` label|⚪|0%|—|—|Add to workspace labels|
|Insights enabled|⚪|0%|—|Requires Business tier|Upgrade or use manual KPI tracking|
|TIER milestone % on Initiative|⚪|0%|—|Milestones not set|After milestone creation, auto-tracks|

---

### Quick-Win Order (do these today)

1. **Create Initiative** "mdeai Phase 1 — MVP Launch" → link MDEAPP project
2. **Add 5 milestones** to MDEAPP: TIER 1, TIER 1C, TIER 1D, TIER 2, TIER 3 — set target dates
3. **Create "DONE THIS WEEK" view** (`state:Done completed:>-7d`) — instant changelog
4. **Create "PRODUCTION READINESS" view** (milestone:TIER-1 priority:urgent,high state:!Done)
5. **Add `status:blocked` label** at workspace level — then update BLOCKERS view to also filter by it
6. **Set GitHub branch automation**: main PR open → In Review; main PR merged → Done
7. **Post first Project Update** using the template above

This gives you milestone-based progress tracking, a working changelog, GitHub-driven state changes, and a single Initiative health indicator — all on the free/basic tier except Insights.