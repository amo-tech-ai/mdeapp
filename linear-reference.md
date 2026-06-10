---
title: Linear reference — milestones, initiatives, updates
updated: 2026-06-02
sources:
  - https://linear.app/docs/project-milestones
  - https://linear.app/docs/initiatives
  - https://linear.app/docs/initiative-and-project-updates
plan: Business tier
---

# Linear reference — milestones, initiatives & updates

Best practices from Linear docs applied to mdeai. Companion to [`linear.md`](linear.md).

---

## 1. Initiatives

### What they are

> "An Initiative is a manually curated list of projects with an accompanying document. Their purpose is to express the goals and objectives an organization aims to achieve and to monitor progress towards those aims."

Initiatives sit above projects. They answer "what is this launch for?" — projects answer "what are we building?".

> "If you want to group and filter projects automatically — but they don't align with clear organizational goals or need close progress tracking — we recommend using project views instead."

**Rule of thumb:** if the work has a delivery date and a north star, use an Initiative. If it's just a filter, use a saved view.

### mdeai initiative

| Field | Value |
|-------|-------|
| **Name** | Phase 1 — mdeai MVP launch |
| **Link** | [linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8) |
| **Target date** | 2026-06-17 (estimate) |
| **Projects linked** | Platform Infrastructure · Events Platform · AI & Intelligence · Trips · Venues · Discovery Platform · Real Estate |
| **Owner** | S K |

### Initiative properties

Linear manages on the overview page: **Status · Owner · Target Date · Resources · Latest update · Description · Project list.**

### Health rollup

> "Initiative Health shows whether the latest initiative update indicated work was on track, at risk, or off track."

> "Active Projects rolls up data for individual projects in the initiative based on each project's latest project update" — color coded green / yellow / red / gray.

If you never post a project update, the initiative health shows gray (unknown). Post project updates → health auto-rolls up to the initiative.

### How to enable

Settings → Initiatives → enable → Initiatives page appears in the sidebar.

### Best practices for mdeai

| Practice | Why |
|----------|-----|
| Keep one initiative per phase | "Phase 1 — MVP launch" = Cycle 1 scope. Phase 2 gets its own initiative after MVP ships. |
| Link all 7 projects to the initiative | Health rollup only works for linked projects. |
| Set target date on the initiative | Timeline view becomes meaningful; shows if you are on track. |
| Post initiative update weekly | Drives the health indicator; auto-notifies stakeholders. |
| Use initiative description as the north star doc | "Camila on cards + pins · Andrés paid ticket · Roberto host publish @ mdeai.co" belongs here. |

---

## 2. Project Milestones

### What they are

> "Project milestones represent different stages in a project's lifecycle."

> "Progress towards project milestones is also visible from Initiatives and project views on a timeline."

Milestones divide a project into sequential delivery stages. Issues inside a project belong to a milestone; the milestone auto-tracks % complete based on issues moved to Done.

### Creating milestones

Three ways:
- Click `+` in the project details pane
- Command menu (`Ctrl K` on Windows / `Cmd K` on Mac)
- Right-click on a date in the project timeline

> "While assigning a date to a milestone is optional, you can add one at any time after the milestone has been created."

### Milestone fields

| Field | Notes |
|-------|-------|
| **Name** | Short, phase-descriptive — e.g. "🚨 Launch Critical", "🍽️ Phase 2 — Venues" |
| **Target date** | Click calendar icon. Shows on initiative timeline. |
| **Description** | Put exit criteria here so Done is unambiguous. |
| **Status** | Diamond icon changes color. Yellow = current focus milestone. |
| **% complete** | Auto-calculated: `Done issues / total issues in milestone × 100` |

### Adding issues to milestones

> "If an issue belongs to a project that contains milestones, you can add a milestone to the issue from the command menu" — shortcut `Shift M` on the issue.

Or drag issues onto milestones in the project timeline view.

### Current milestones in mdeai

| Milestone | Project | Exit criteria |
|-----------|---------|---------------|
| 🚨 **Launch Critical** | Platform Infra · Events Platform | All 8 P0 issues Done; EVT-001 signed off; live on mdeai.co |
| 🍽️ **Venues — Phase 2** | Venues | Café / restaurant / nightlife cards live; booking flow shipped |
| 🎟️ **Events — Polish** | Events Platform | Host events list; post-MVP discovery tasks Done |
| 🗺️ **Maps — Growth** | Discovery Platform | Places proxy live; nearby search; cache warm |
| 🏠 **Rental Cards MVP** | Real Estate | Rental search indexes; Camila cards on prod |

### Milestone → cycle alignment

| Cycle | Milestone | Target |
|-------|-----------|--------|
| Cycle 1 (Jun 8–22) | 🚨 Launch Critical | EVT-001 signed off |
| Cycle 2 (Jun 23–Jul 6) | 🍽️ Venues Phase 2 + 🏠 Rental MVP | Camila full experience live |
| Cycle 3+ | 🎟️ Events Polish · 🗺️ Maps Growth | Post-MVP module polish |

### Best practices for mdeai

| Practice | Why |
|----------|-----|
| One milestone per delivery wave | 🚨 Launch Critical = Cycle 1. 🍽️ Venues = Cycle 2+. Never mix delivery waves into one milestone. |
| Set a target date on every active milestone | Appears on the initiative timeline; shows slip immediately. |
| Put exit criteria in the milestone description | Removes ambiguity about when Done means Done. |
| Only mark milestone Done when all issues are Done | Linear auto-tracks %; you flip the milestone status manually when the % hits 100. |
| Use `Shift M` to assign issues fast | Faster than editing issues one by one from the board. |
| Keep milestone names emoji-prefixed | Makes the initiative timeline scannable at a glance. |
| Never skip state transitions on issues | The milestone % depends on accurate Backlog → Todo → In Progress → In Review → Done flow. |

---

## 3. Initiative and Project Updates

### What updates are

> "Updates can be created from the Project Overview or Initiative Overview page."

> "Updates consist of a health indicator that provides high-level signal of the current state and a rich text description for deeper insights into status, challenges, and next steps."

**Health indicator — three options:**

| Status | When to use |
|--------|-------------|
| **On track** | Shipping at pace, no active blockers |
| **At risk** | A blocker exists or the milestone date is in danger |
| **Off track** | Milestone will slip; needs escalation |

This single field drives the initiative health rollup. It is the most important field.

### Who posts

> "The owner or lead is responsible for posting the first update, after which any workspace member can write subsequent updates."

For mdeai: S K posts project updates on each active project. Initiative health auto-derives from those project updates.

### Auto-progress block

When drafting a project update, Linear auto-generates a progress section showing delays, target date changes, lead assignment changes, and milestone progress.

> "If progress appears when drafting a project update, you can choose to exclude it from posting by clicking Hide details."

Keep it — it becomes the changelog source.

### Where updates appear

> "The most recent update is displayed on the Project Overview or Initiative Overview page. To view previous updates, click on the Updates tab."

On the Initiative overview each project shows its latest health color + last update summary. No update = gray = invisible to stakeholders.

### Frequency reminders

Admins can configure update reminders: weekly, biweekly, or custom. Follow-up nudges fire 1 and 2 working days after the first reminder if no update was posted.

---

## 4. mdeai update workflow

### When to post

| Trigger | What to post | Where |
|---------|-------------|-------|
| Friday weekly | Full project update (template below) | Each active project |
| Milestone completes | Initiative update: milestone Done + next focus | Initiative overview |
| Blocker appears | Project update: At Risk + blocker detail | Affected project |
| Cycle opens / closes | Initiative update: cycle scope + carry-overs | Initiative overview |

### Project update template

Navigate to: **Project Overview → click pencil icon**

```
## Week of {DATE} — {MILESTONE FOCUS}

Health: On track / At risk / Off track

### Shipped
- SAN-### Task name (PR #N merged)

### In Progress
- SAN-### Task name — {what remains}

### Blocked
- SAN-### Task name — blocker: {reason}

### Floor
- Vitest: {N} passing (floor {N})
- Build: clean / broken

### Next
- Top 3 priorities for next week
```

### Initiative update template

Navigate to: **Initiative Overview → click pencil icon**

```
## Phase 1 — Week of {DATE}

Health: On track / At risk / Off track

### This week
- {Milestone}: {N}% complete — {what shipped}
- {Milestone}: blocked on {reason}

### Milestone status
| Milestone         | % Done | Target | Health |
|-------------------|--------|--------|--------|
| Launch Critical   |   N%   | Jun 22 | green / yellow / red |
| Venues Phase 2    |   N%   | Jul 6  | green / yellow / red |

### North star check
- Camila cards + pins: {live / in progress / blocked}
- Andres paid ticket: {live / in progress / blocked}
- Roberto host publish: {live / in progress / blocked}
```

### Per-project update cadence

| Project | Frequency | Condition |
|---------|-----------|-----------|
| Platform Infrastructure | Weekly | Always during Cycle 1 |
| Events Platform | Weekly | Always during Cycle 1 |
| AI & Intelligence | Weekly | While INT-003/004/009/010 are active |
| Trips | On milestone progress | When TRIP-001+ starts |
| Venues | Weekly | While VEN-009+ is active |
| Discovery Platform | On milestone progress | When MAP-005+ starts |
| Real Estate | On milestone progress | When REAL-001+ starts |

---

## 5. Initiative timeline — how to read it

The initiative timeline shows:
- All linked projects as horizontal bars
- Milestones as diamond markers on each project bar
- Current focus milestone highlighted in yellow
- % complete shown next to each milestone diamond

**Reading signals:**
- Diamond past its target date and not at 100% → project slipping → flip health to At Risk
- Yellow diamond → current active milestone
- Gray project bar → no recent update posted → go post one
- All diamonds green → milestone Done; move to next

**mdeai reading key:**

| Signal | Meaning | Action |
|--------|---------|--------|
| 🚨 Launch Critical diamond past Jun 22 | EVT-001 not Done | Escalate; identify blocker |
| 🍽️ Venues diamond yellow | VEN-009+ is current focus | Ship DATA-035 first (unblocks seed) |
| Gray project bar | No update this week | Post project update immediately |
| Initiative health yellow | At least one project is At Risk | Find and clear that blocker |

---

## 6. Linear hierarchy for mdeai (full map)

```
Workspace: sanjiovani
└── Initiative: Phase 1 — mdeai MVP launch (target: Jun 17, 2026)
    │   Health: derives from project updates
    │
    ├── Project: Platform Infrastructure
    │   ├── Milestone: 🚨 Launch Critical   (PAY-001, PAY-003, OPS-002, AUTH-011, MAP-002B, MAP-008B)
    │   └── Milestone: 🗺️ Maps — Growth     (MAP-005→010, DATA-007→008 — post-MVP)
    │
    ├── Project: Events Platform
    │   ├── Milestone: 🚨 Launch Critical   (EVT-002, EVT-001)
    │   └── Milestone: 🎟️ Events — Polish   (EVT-014+ post-MVP)
    │
    ├── Project: AI & Intelligence
    │   └── (initiative-level tracking — no milestone subdivisions yet)
    │
    ├── Project: Trips
    │   └── (no named milestones yet — add when TRIP-001 starts)
    │
    ├── Project: Venues
    │   └── Milestone: 🍽️ Venues — Phase 2  (DATA-035, VEN-009→030)
    │
    ├── Project: Discovery Platform
    │   └── Milestone: 🗺️ Maps — Growth     (MAP-005→010)
    │
    └── Project: Real Estate
        └── Milestone: 🏠 Rental Cards MVP  (REAL-001→003 + search indexes)
```

---

## 7. Anti-patterns

| Do not | Do instead |
|--------|-----------|
| Leave health blank on updates | Always set On track / At risk / Off track — blank = gray = invisible |
| Create a new initiative per sprint | One initiative per phase. Cycles are not initiatives. |
| Use milestones as labels | Milestones are sequential phases within one project. Labels are cross-cutting. |
| Put all issues into one milestone | Split by delivery wave — milestone % becomes meaningless otherwise. |
| Skip posting when blocked | Post At Risk immediately — that is the entire point of the health indicator. |
| Post initiative update without posting project updates first | Initiative health derives from project updates. Do projects first. |
| Assign an issue to a milestone from a different project | Milestones are project-scoped. Issue and milestone must be in the same project. |
| Flip milestone to Done manually before all issues are Done | Let the % reach 100 first; then mark Done. |

---

## 8. Sources

| Doc | URL |
|-----|-----|
| Project milestones | https://linear.app/docs/project-milestones |
| Initiative and project updates | https://linear.app/docs/initiative-and-project-updates |
| Initiatives | https://linear.app/docs/initiatives |
| Insights | https://linear.app/docs/insights |
| Dashboards (Enterprise only) | https://linear.app/docs/dashboards |
