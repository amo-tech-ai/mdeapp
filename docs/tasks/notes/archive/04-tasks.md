You already have **70% of a Linear-grade system on disk** (`IMP-###`, `MVP-REQUIRED.md`, `tasks/linear/`, `mdeai-linear.mdc`) — the mess is **too many competing hubs** and **no single navigation axis**. Linear solves that with a strict hierarchy; your repo tries to express everything in flat markdown indexes.

---

## Diagnosis: why it feels chaotic

| Problem | Symptom |
|---------|---------|
| **Multiple “sources of truth”** | `INDEX.md` (496 lines), `MVP-REQUIRED.md`, `progres.md`, `todo.md`, `tasks/linear/01-linear.md`, domain INDEXes |
| **Three ID systems** | `IMP-###` (global order), domain ID (`EVP-003`), `SAN-###` (creation order) — documented in [`tasks/linear/03-numbering-system.md`](tasks/linear/03-numbering-system.md) but not visible when browsing folders |
| **Folder = vertical, not outcome** | `events/`, `maps/`, `venues/` — correct for specs, wrong for “what blocks MVP?” |
| **Phase tags exist but aren’t structural** | CORE/MVP/ADV in frontmatter/index only — not how you browse folders |
| **Linear board drift** | P0 still lists SAN-114 (SCREEN-021 A.5 Done on disk); 137 open issues, 0 Done in Linear |
| **Docs ≠ tasks** | `plan/`, `tasks/audit/`, `venues/docs/`, `events/docs/` — no clear “read this first” |

Linear’s model ([Concepts](https://linear.app/docs/conceptual-model)): **Workspace → Teams → Issues**, grouped by **Projects** (outcomes), **Milestones** (checkpoints), **Initiatives** (quarters). Issues are the unit of work; everything else is **views and filters**, not duplicate ledgers.

---

## Map Linear → mdeai (use this everywhere)

```text
Initiative     Phase 1 — MVP Exit          Phase 2 — Expand
    │
Project        Andrés Commerce             Camila Discovery
               Roberto Host                Platform Core
               Sofía Ops
    │
Milestone      P0 gates · P1 polish        Vector · CTI · Discovery
    │
Issue          EVP-003-core                MAP-005
    │
Sub-issue      Rotate sponsor secret       Add SCREEN-006 E2E proof
```

| Linear entity | mdeai disk | Existing file |
|---------------|------------|---------------|
| **Initiative** | CORE / MVP / ADV | `MVP-REQUIRED.md` § tags |
| **Project** (outcome) | Persona flow or vertical bundle | **Missing** — add 4–6 project hubs |
| **Milestone** | P0 / P1 / Phase 2 / Deferred | `tasks/linear/02-views-sort.md` |
| **Issue** | One spec file | `tasks/**/{ID}.md` |
| **Sub-issue** | Checklist / acceptance rows | Inside spec or Linear sub-issues ([parent/sub-issues](https://linear.app/docs/parent-and-sub-issues)) |
| **Label** | `track:*`, phase, persona, type | Partial — extend per [`linear-claude-skill`](.agents/skills/linear-claude-skill/SKILL.md) |
| **View** | Custom INDEX slice | **Missing** — persona + phase views |

**Rule from Linear + your skills:** every issue → project → initiative ([linear-claude-skill](.agents/skills/linear-claude-skill/SKILL.md)). On disk: every open spec → one **Project** row in a hub → one **Initiative** (CORE/MVP/ADV).

---

## Recommended taxonomy: 3 axes (pick view, not folder)

Don’t physically move 926 files yet. Add **view indexes** that link into existing paths.

### Axis 1 — Phase (when)

| Tag | Linear milestone bucket | Pull when |
|-----|-------------------------|-----------|
| **CORE** | P1 Maps & core (infra) | Platform / auth / smoke |
| **MVP** | P0 + P1 Events/Screens | **Now** — [`MVP-REQUIRED.md`](tasks/MVP-REQUIRED.md) |
| **ADV** | Phase 2 + Deferred | After P0 all 🟢 |

### Axis 2 — Persona / use case (why) — **add this layer**

Organize **projects by outcome**, not folder name ([Morgen/Linear best practice](https://www.morgen.so/blog-posts/linear-project-management)):

| Project | Persona | Exit criterion | Specs |
|---------|---------|----------------|-------|
| **Andrés Commerce** | Andrés | G1 paid ticket + QR | G1 ops, EVP-003, EVP-013, checkout |
| **Camila Discovery** | Camila | G2 cards + pins + lead | SCREEN-001–009, CAF-A5, F47 |
| **Roberto Host** | Roberto | G3 publish + `/host/events` | EVP-009–012, EVP-014, MAP-010 |
| **Sofía Platform** | Sofía | Floor + prod smoke + auth | F32, AUTH-011, CK-* |
| **Tourist Venues+** | Tourist | Phase 2 venues depth | venues 01–24, VEC-* |
| **Events Discovery+** | Camila/Tourist | Post-MVP browse | EVP-015+ |

### Axis 3 — Vertical (how) — keep current folders

`events/`, `maps/`, `venues/`, `core/` stay as **implementation namespaces**. Domain owners edit here; nobody uses this for “what’s next.”

---

## Doc hub: collapse to 4 entry points

| Role | File | Job |
|------|------|-----|
| **“What’s next?”** | [`MVP-REQUIRED.md`](tasks/MVP-REQUIRED.md) | P0/P1 ordered table + dots (done) |
| **“Where is spec X?”** | [`tasks/README.md`](tasks/) *(new)* | 1-page router: phase → persona → vertical |
| **“What’s on the board?”** | [`tasks/linear/01-linear.md`](tasks/linear/01-linear.md) | SAN map, IMP order, sync scripts |
| **“What shipped?”** | [`tasks/archive/README.md`](tasks/archive/README.md) | Done packs only |

**Slim `INDEX.md`** to ~100 lines: metrics snapshot + links to the four hubs. Move the legacy cross-vertical table to `tasks/archive/INDEX-legacy.md` or delete after link check.

---

## Linear board fixes (align with disk)

Per [`mdeai-linear.mdc`](.cursor/rules/mdeai-linear.mdc) and [Linear priority/labels docs](https://linear.app/docs/priority):

1. **Close / Done in Linear** everything IMP-001–078 (shipped on disk) — today Linear shows **0 Done** while disk shows ~78 shipped; that’s the main confusion.
2. **Update P0 pull order** to match `MVP-REQUIRED.md`:
   ```
   G1 → EVP-003 → EVP-013 → G3 proof → EVP-001 → F32 → AUTH-011
   ```
   Drop SAN-114 from P0 (CAF-A5 Done).
3. **Mark blocked relations** in Linear: EVP-001 **blocked by** EVP-003, EVP-013, G1 ([issue relations](https://linear.app/docs/conceptual-model)).
4. **Labels (label groups, not status spam)**:
   - `phase:core|mvp|adv`
   - `persona:camila|andres|roberto|patricia|sofia`
   - `type:feature|bug|chore|spike` (one per issue)
   - Keep existing `track:events|maps|…`
5. **Views** ([custom views](https://linear.app/docs/custom-views)):
   - **Now — MVP blockers** — milestone P0, sort Manual by IMP
   - **By persona** — group label `persona:*`
   - **Blocked** — `has:blocked-by`
   - **Hide deferred** — exclude OCL/CTEST/GS milestones

6. **Re-run sort** after sync:
   ```bash
   node scripts/linear-build-implementation-order.mjs
   node scripts/linear-apply-imp-numbers.mjs
   node scripts/linear-sort-todo.mjs
   ```

---

## Spec file standard (one template, all domains)

Extend existing frontmatter (`mdeai-task-numbering.mdc`) — every open spec gets:

```yaml
id: EVP-003-core
phase: mvp          # core | mvp | adv
persona: patricia   # primary
project: andres-commerce  # Linear project slug
milestone: p0-mvp-gates
linear: SAN-116
status: Partial
percent: 60
blocked_by: [stripe-secret-rotation]
```

**Status ↔ dots** (your convention, enforce in INDEX generators):

| `status` + evidence | Dot | % |
|---------------------|-----|---|
| Done + evidence | 🟢 | 100 |
| Partial / Ready | 🟡 | estimate |
| Not Started | ⚪ | 0 |
| `blocked_by` unresolved | 🟥 | — |

Never duplicate status in prose — table columns derive from frontmatter.

---

## Sub-issues for fat specs

Use Linear sub-issues ([docs](https://linear.app/docs/parent-and-sub-issues)) for multi-proof parents:

**EVP-001-core** (parent)
- Sub: G1 paid row evidence
- Sub: G2 lead modal prod
- Sub: G3 publish → Supabase row
- Sub: Consolidated `EVP-001-evidence.md`

Same pattern for **AUTH-011** (checklist sections = sub-issues). Parent auto-closes when subs Done (team setting).

---

## What not to do

- ❌ Another mega-INDEX — use **views** instead
- ❌ Rename `SAN-*` or domain IDs — use `[IMP-NNN]` in titles only
- ❌ Folder-per-phase physical move — breaks links and git history
- ❌ Labels that mirror status (`in-progress`, `done`) — use workflow columns
- ❌ Linear Done without `tasks/evidence/` + `task-verifier`

---

## Concrete next steps (ordered)

| # | Action | Owner | Verify |
|---|--------|-------|--------|
| 1 | Add `tasks/README.md` — phase × persona router linking to MVP-REQUIRED + vertical INDEXes | Sofía | One screen, all paths |
| 2 | Sync Linear P0 + mark IMP-001–078 Done | Agent + Patricia | Board matches MVP table |
| 3 | Add `phase` + `persona` + `linear` to P0 spec frontmatter (6 files) | Next implementer | `grep phase: tasks/events/EVP-003*` |
| 4 | Create 4 Linear **Projects** (Andrés / Camila / Roberto / Platform) under Initiative “Phase 1 MVP” | Patricia | Every P0 issue has project |
| 5 | Slim `INDEX.md` — link out, don’t duplicate MVP table | Docs pass | INDEX < 150 lines |
| 6 | Persona view files: `tasks/views/camila.md`, `andres.md`, `roberto.md` | Optional | Each lists only that flow’s specs |

---

## Bottom line

**Disk stays vertical** (`events/`, `maps/`). **Navigation becomes Linear-shaped**: Initiative (CORE/MVP/ADV) → Project (persona outcome) → Milestone (P0/P1/…) → Issue (spec) → Sub-issue (proof slice). You already built IMP + Linear import — the fix is **closing the Done gap**, **persona project hubs**, and **one router doc** so nobody opens a 500-line INDEX to find Andrés’s next task.

Want me to implement step 1+5 (`tasks/README.md` + slim `INDEX.md`) and refresh `tasks/linear/01-linear.md` P0 order to match `MVP-REQUIRED.md`?