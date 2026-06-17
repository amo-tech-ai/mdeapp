# AI Second Brain — Plan

**Status:** Proposal (plan only — no code changes in this PR)
**Owner persona:** Sofía (dev) + Lucía (QA) — this is a developer-accuracy tool, not a user-facing feature
**Scope:** MVP = improve Claude Code + Cursor accuracy only. No OpenClaw, no new agents, no production runtime changes.
**Created:** 2026-06-17 · Branch `claude/second-brain-plan-8gx2k6`

---

## 1. The answer first

We give Claude and Cursor a **shared, always-fresh "second brain"** so they stop re-reading the whole
repo every session, stop guessing where code lives, and stop editing the wrong file.

In plain terms: today every Claude/Cursor session starts blind and burns tokens scanning 591 source
files + 1,000+ docs to relearn the repo. This plan wires up **three memory layers** that already
partly exist, so an AI assistant looks up "where does Camila's map pin code live?" in a graph in
seconds instead of grepping for minutes — and answers from facts, not hallucination.

**What changes for the team:** Sofía spends fewer tokens and gets fewer wrong-file edits; Lucía gets
PRs that touch the right blast radius; the whole team gets a single source of repo truth that updates
itself after each commit.

**What does NOT change:** No production code, no agents, no Gemini/CopilotKit/Supabase runtime. This is
tooling that lives in `docs/`, `obsidian/`, and gitignored output dirs. Pure-doc + dev-infra only.

**Important nuance — we are not starting from zero.** Graphify is already installed and configured for
this repo (see [`docs/graphify-reference.md`](../graphify-reference.md), build script
`scripts/graphify-phase2-build.py`, output in gitignored `graphify-out/`). OpenClaw was already audited
out and archived on 2026-06-09. So Task 1 below is mostly **formalize + automate what exists**, and the
genuinely new work is the visual map (Task 2), the Obsidian vault (Task 3), and the workflow/safety
rules (Tasks 4–8).

---

## 2. How the five tools work together (Deliverable 1)

Think of it as **one rule: graph first → docs second → files third → code last.** Each tool owns one
layer of that rule.

| Tool | What it is (plain) | Layer it owns | Cost model |
|---|---|---|---|
| **Graphify** | Turns the repo into a queryable knowledge graph (every function, file, doc + the links between them) | **Fast repo map** — "where is X, what calls X, what breaks if X changes" | Local AST extraction, ~$0, ~3 min rebuild |
| **Understand Anything** | Interactive *visual* dependency graph, colour-coded by layer (API / Service / Data / UI / Util) | **Architecture picture** — see parent/child deps, dead files, blast radius | Tree-sitter + LLM summaries (run on demand) |
| **Obsidian** | A markdown vault of linked notes — the long-term project memory a human and an AI both read | **Durable memory** — decisions, concept notes, graph exports living next to source docs | Plain files in git, $0 |
| **Claude Code** | The planning + repo-execution agent (this CLI) | **Audits, plans, multi-file changes** — consults graph + docs before editing | Tokens; the whole point is to spend fewer |
| **Cursor** | The precise in-editor code editor | **Focused patches** — given the 3–8 right files, write the smallest change | Tokens; fed narrow context, not the whole repo |

### The flow, in one picture

```
                        ┌─────────────────────────────────────────┐
                        │  SOURCE OF TRUTH: the git repo (mdeapp)   │
                        │  src/ · docs/ · CLAUDE.md · sitemap.md    │
                        └───────────────┬───────────────────────────┘
                                        │  (post-commit / post-merge rebuild)
                  ┌─────────────────────┼─────────────────────┐
                  ▼                     ▼                     ▼
          ┌──────────────┐     ┌────────────────┐    ┌──────────────────┐
          │  Graphify    │     │  Understand    │    │  Obsidian vault  │
          │  graph.json  │     │  Anything      │    │  (markdown +     │
          │  (fast map)  │     │  (visual deps) │    │   graph exports) │
          └──────┬───────┘     └───────┬────────┘    └────────┬─────────┘
                 │                     │                      │
                 └─────────────┬───────┴──────────────────────┘
                               ▼
              ┌────────────────────────────────────┐
              │  Claude Code  →  plans & audits     │   "graph first → docs
              │  Cursor       →  focused patches    │    second → files third
              └────────────────────────────────────┘    → code last"
```

**Why this order matters (grounded in the references):**

- **Claude Code memory docs** ([code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory))
  say CLAUDE.md is *context, not enforced config*, every session starts fresh, and files should stay
  under ~200 lines for good adherence. So we keep CLAUDE.md lean and push the *bulk* knowledge into the
  graph + Obsidian, which load on demand — not into context every session.
- **Graphify** ([github.com/safishamsi/graphify](https://github.com/safishamsi/graphify)) is the
  "don't re-read everything" layer: AST-based, local, self-updating via a git hook, exposes
  `query` / `path` / `explain` / `affected`.
- **Understand Anything** ([github.com/Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything))
  is the "see the blast radius before you edit" layer — colour-coded layers + diff impact analysis.
- **The memory-setup reference** ([github.com/lucasrosati/claude-code-memory-setup](https://github.com/lucasrosati/claude-code-memory-setup))
  is exactly this three-layer pattern (Obsidian + Graphify + chat import) and is where the folder
  structure in Task 3 comes from.
- **Cursor search** ([cursor.com/docs/agent/tools/search](https://cursor.com/docs/agent/tools/search))
  pairs grep (exact) + semantic search (by meaning); combining them is ~12.5% more accurate than grep
  alone on 1,000+ file repos. We feed Cursor the graph's shortlist so its semantic search starts narrow.

---

## 3. Implementation plan — tasks (Deliverables 2–8)

> Naming: these are **proposed spec IDs** under the existing `prefix:OPS` track (dev-infra/ops), to be
> minted as Linear `SAN-NNN` issues when scheduled. Allowed prefixes are listed in
> [`linear.md`](../../linear.md) §Allowed prefixes — `OPS` is the right home for dev tooling. Each task
> carries a friendly `Task N` number (matching the original brief) and a full title, per CLAUDE.md.

| # | Spec ID | Title | New or existing? | Depends on |
|---|---|---|---|---|
| 1 | `OPS-SB-1` | Formalize & auto-update the Graphify repo map | Mostly **exists** — formalize | — |
| 2 | `OPS-SB-2` | Stand up the Understand Anything visual architecture map | **New** | 1 |
| 3 | `OPS-SB-3` | Create the Obsidian second-brain vault | **New** | 1 |
| 4 | `OPS-SB-4` | Claude Code workflow + slash commands | **New** | 1, 2, 3 |
| 5 | `OPS-SB-5` | Cursor focused-edit workflow | **New** | 1, 2 |
| 6 | `OPS-SB-6` | Auto-update rules (post-commit / post-merge / branch change) | **New** | 1, 2, 3 |
| 7 | `OPS-SB-7` | Safety rules (stale docs, hallucinated architecture, wrong files, scope creep) | **New** | all |
| 8 | `OPS-SB-8` | Success metrics + 2-week measurement | **New** | all |

---

### Task 1 · `OPS-SB-1` — Formalize & auto-update the Graphify repo map

**Goal:** a fast map so Claude finds the right file instead of re-reading everything.

**Reality check:** Graphify is already built for this repo (17,080 nodes, 19,416 edges, 0 import
cycles, $0). This task is to **pin the index/ignore lists** and **make rebuilds automatic**, not to set
it up from scratch.

**Index (keep these in the corpus):**

| Path | Why |
|---|---|
| `src/` (591 TS/TSX) | The code Claude edits — AST extraction, zero LLM cost |
| `docs/` (incl. `docs/tasks/`, `docs/prd/`) | PRDs, ARCHITECTURE, task specs, audits |
| `CLAUDE.md`, `AGENTS.md`, `DESIGN.MD`, `sitemap.md`, `linear.md`, `LESSONS.md` | The always-on guardrail docs |
| `supabase/migrations/` (current only) | Live schema shape |
| `scripts/`, `e2e/` | Build/test surface |

**Ignore (never index — noise, bloat, or derived):**

```
node_modules/
.next/  dist/  build/  coverage/
graphify-out/                 # the graph's own output — never re-index it
test-results/  playwright-report/  screenshots/
supabase/migrations/old/      # superseded migrations
docs/**/_archive/             # already filtered by the build script
tasks/design/                 # 11 GB of images (per graphify-reference.md safeguard)
tasks/archive/  tasks/backup/ # noise without value
*.lock  package-lock.json     # 900 KB, no semantic value
public/                       # static assets
commerce/                     # standalone sub-apps, separate concern
```

**Steps:**
1. Move the index/ignore lists above into the build script's `DOC_DIRS` + ignore filters so they're the
   committed source of truth (today they're partly implicit).
2. Run a clean rebuild; confirm `graph.json`, `GRAPH_REPORT.md` regenerate and import cycles stay at 0.
3. Document the four `graphify` query verbs (`query` / `path` / `explain` / `affected`) in the vault
   (Task 3) so any teammate can use them.

**Definition of done:** index/ignore lists committed in the build script; a fresh `graphify-out/` builds
clean; verbs documented. (Output stays gitignored.)

---

### Task 2 · `OPS-SB-2` — Stand up the Understand Anything visual architecture map

**Goal:** a colour-coded picture of parent/child dependencies, dead-file candidates, and blast radius —
the thing Graphify's text graph can't show at a glance.

**Index (architecture-critical source only — keep it tight):**

| Path | Why |
|---|---|
| `src/mastra/` | The agent core — agents, tools, working memory |
| `src/app/api/` | Route handlers (incl. `/api/copilotkit`) |
| `src/components/` | UI, incl. CopilotKit generative-UI mirrors |
| `src/platform/` + maps code | Maps/places integration, pin rendering |
| `src/lib/`, `src/hooks/` | Shared utilities + React hooks |

**Steps:**
1. Run Understand Anything over the paths above (NOT the whole repo — keep the picture legible).
2. Export the dependency graph + layer assignments into the Obsidian vault (Task 3, folder `01-architecture/`).
3. Capture the first read: dead-file candidates, unexpected cross-layer edges, the highest-blast-radius
   nodes. Cross-check against Graphify's "god nodes" before trusting any "dead code" call (static
   analysis misses dynamic imports + Next.js routing — see safety rules, Task 7).

**Definition of done:** a visual map exists, exported into the vault, with a short written read of the
top findings. No file deleted on the strength of the map alone.

---

### Task 3 · `OPS-SB-3` — Create the Obsidian second-brain vault

**Goal:** durable, linked memory that both a human and an AI can read — concept notes sitting **next to
the source docs** so Claude can verify a claim instead of inventing one.

**Folder structure** (lives at repo path `obsidian/mdeai-second-brain/`, gitignored output dirs noted):

```
obsidian/mdeai-second-brain/
  00-start-here/          # vault README, the "graph→docs→files→code" rule, query cheat-sheet
  01-architecture/        # data-flow notes + Understand Anything exports (Task 2)
  02-events/              # Roberto — /host/event/new wizard, hostEventAgent, ticket tiers
  03-rentals/             # Camila — /rentals + /chat, search, map pins, working memory
  04-maps/                # Places API, X-Goog-FieldMask, mapId rules, pin rendering
  05-copilotkit-mastra/   # v2 API, agent-name match, HITL, runtime wiring
  06-prds/                # PRD concept notes, each linked to the canonical doc
  07-audits/              # audit summaries (graphify audit, RLS audit, scope audits)
  08-decisions/           # ADR-style "why we chose X" notes (e.g. Gemini-only, v2 pin)
  09-graph-imports/
    graphify-mdeapp/      # Graphify GRAPH_REPORT.md + graph exports (gitignored if large)
    understand-anything/  # visual map exports (Task 2)
```

**Rules (from the memory-setup reference):** one concept per note; every concept note **links to its
source doc** (so facts are verifiable, not memorized); YAML frontmatter with `source:` and `last-verified:`;
auto-generated graph imports are **never hand-edited**.

**Steps:**
1. Create the folder tree + `00-start-here/README.md` (the cheat-sheet + the core rule).
2. Write ~1 concept note per persona surface (events, rentals, maps, copilotkit-mastra), each pointing
   at the real source (`sitemap.md`, `docs/ARCHITECTURE.md`, `LESSONS.md`, the relevant `src/` path).
3. Drop Graphify + Understand Anything exports into `09-graph-imports/`.
4. Add `obsidian/**/09-graph-imports/**` (large exports) to `.gitignore`; keep hand-written notes in git.

**Definition of done:** vault tree exists; start-here note + the four persona notes written with verified
source links; graph exports landing in `09-graph-imports/`.

---

### Task 4 · `OPS-SB-4` — Claude Code workflow + slash commands

**Goal:** make "graph first, code last" the default for Claude, so it stops editing the wrong file.

**Pre-edit checklist Claude follows (the workflow):**
1. **Locate** — query Graphify (`graphify query` / `path` / `explain`) to find the *exact* files.
2. **Check blast radius** — `graphify affected "X"` + the Understand Anything map.
3. **Read the guardrails** — `CLAUDE.md` always; plus `sitemap.md` + `DESIGN.MD` if touching a route or
   UI; `LESSONS.md` for CopilotKit/Mastra/Maps/Supabase work.
4. **Propose the smallest safe change** — name the files, then edit only those.

**Proposed slash commands** (thin wrappers over the existing build script + verbs; no new agents):

| Command | Does | Wraps |
|---|---|---|
| `/sb-locate <thing>` | Find the real file/symbol for a concept | `graphify query` + `path` |
| `/sb-impact <symbol>` | Show what breaks if this changes | `graphify affected` |
| `/sb-refresh` | Rebuild graph + visual map after big changes | `scripts/graphify-phase2-build.py` |
| `/sb-verify` | Cross-check a claim against the graph + source doc before stating it | read-only |

**Steps:** add the checklist as a short pointer in CLAUDE.md (keep it lean — link out to this PLAN, don't
inline it); add the commands as `.claude/commands/` markdown in a **later** PR (this PR is plan-only).

**Definition of done:** the workflow + command spec is written here; CLAUDE.md gets a one-line pointer in
the follow-up implementation PR.

---

### Task 5 · `OPS-SB-5` — Cursor focused-edit workflow

**Goal:** Cursor writes precise patches, never broad rewrites, because we hand it the right narrow context.

**The pattern (grounded in Cursor's search docs):**
1. Get the file shortlist from Graphify first (`/sb-locate`).
2. Give Cursor only those **3–8 files** via explicit `@file` references — plus `@Docs` for the relevant
   guardrail doc.
3. Use `@Codebase` only *after* the graph has narrowed scope, never as the opening move on a broad
   question (its semantic search is strongest when the target set is already small).
4. Ask Cursor for a **patch, not a rewrite**.

**Why:** Cursor combines exact grep + semantic embeddings; combining them beats grep alone by ~12.5% on
1,000+ file repos. Feeding it the graph's shortlist keeps that search on-target and cheap.

**Steps:** write a `.cursorrules` / Cursor rules note (in the follow-up PR) encoding "graph shortlist →
3–8 files → patch not rewrite"; document the pattern in the vault `00-start-here/`.

**Definition of done:** the Cursor pattern is documented here + in the vault; `.cursorrules` lands in the
follow-up implementation PR.

---

### Task 6 · `OPS-SB-6` — Auto-update rules (keep graphs fresh)

**Goal:** the brain is never stale — it refreshes after commits, merges, and branch changes.

| Trigger | Action | How |
|---|---|---|
| Small commit (code only) | Incremental code-AST rebuild | `graphify update src/` (fast, skips docs) |
| Merge to a feature branch / big commit | Full rebuild (code + docs) | `scripts/graphify-phase2-build.py` (~3 min) |
| Docs added/archived | Full rebuild | same build script |
| Branch change | Note the active branch in the vault's start-here so exports are never read as the wrong branch's truth | manual / hook |
| Architecture change | Re-run Understand Anything (Task 2) + update `01-architecture/` notes | manual |

**Important guardrail (from `docs/graphify-reference.md`):** do **NOT** run `graphify hook install` or
`graphify claude install` — those auto-edit CLAUDE.md / `.claude/settings.json`. Instead add a **plain
git `post-merge` / `post-commit` hook** that calls the build script, kept under our control in a
follow-up PR. Rebuild output stays gitignored.

**Definition of done:** the trigger table is the agreed policy; the git hook + incremental wiring land in
the follow-up implementation PR, not here.

---

### Task 7 · `OPS-SB-7` — Safety rules (no stale docs, no hallucinated architecture, no wrong files, no scope creep)

**Goal:** the second brain must never make Claude *more* confidently wrong.

| Risk | Rule | Enforced by |
|---|---|---|
| **Stale docs** | Every concept note carries `last-verified:`; a note older than its source doc's last edit is flagged before use | Task 3 frontmatter + `/sb-verify` |
| **Hallucinated architecture** | Never state an architecture fact without a graph hit *or* a source-doc citation. "Graph first → docs second → files third → code last." | Task 4 workflow |
| **Wrong-file edits** | No edit without a `graphify query`/`path` hit naming the file; confirm blast radius with `affected` | Task 4 checklist |
| **Dead-code false positives** | A degree-0 node is a *candidate*, not a verdict — static analysis misses dynamic imports + Next.js routing. Cross-check before deleting. | Task 2 + `graphify-reference.md` safeguard |
| **Scope creep** | Run the existing `pr-scope-reviewer` agent before any PR; building a `✅ LIVE` route (per `sitemap.md`) is scope creep; building `⚫ POST` is out-of-phase | existing agent + `sitemap.md` |
| **Auto-edit of guardrails** | Never run `graphify hook install` / `claude install` / `uninstall --purge` | Task 6 |
| **Index bloat** | The ignore list (Task 1) is the contract; adding `tasks/design/` (11 GB) or archives is banned | Task 1 |

**Definition of done:** these rules are written into the vault `00-start-here/` and referenced from the
follow-up CLAUDE.md pointer.

---

### Task 8 · `OPS-SB-8` — Success metrics + 2-week measurement

**Goal:** prove the brain pays for itself — fewer tokens, faster audits, fewer failed edits, better PRs.

| Metric | Baseline (capture before rollout) | Target | How measured |
|---|---|---|---|
| **Tokens per task** | Tokens to answer "where/what calls/blast radius" by grepping | ↓ via graph lookup | Session token counts, before vs after |
| **Repo-scan time** | Time/turns to locate the right file cold | ↓ noticeably | Turns-to-first-correct-file |
| **Failed/wrong-file edits** | Edits later reverted or to the wrong file per week | → near zero | Count reverted/misplaced edits in PRs |
| **Audit speed** | Wall-clock for an architecture/RLS audit | ↓ | Time a graph-backed audit vs the last manual one |
| **PR quality** | Scope-creep flags + review rounds per PR | ↓ | `pr-scope-reviewer` flags + review-round count |

**Steps:** capture baselines in week 1; re-measure after 2 weeks of use; record results in `07-audits/`.

**Definition of done:** baseline + 2-week follow-up numbers recorded in the vault.

---

## 4. What's in / out of scope (MVP guardrail)

**In:** repo map (Graphify), visual map (Understand Anything), Obsidian memory, Claude+Cursor workflow,
auto-update rules, safety rules, metrics. All dev-accuracy tooling.

**Out (explicitly):** OpenClaw (already archived 2026-06-09 — do not reintroduce), any new agent, any
production runtime change (Gemini/CopilotKit/Mastra/Supabase/Stripe stay untouched), Spanish/i18n,
new product surfaces.

---

## 5. Next step

**One thing I need from you:** approve this plan (or flag any task to cut). On approval, the follow-up
implementation PR will (a) commit the index/ignore lists into the build script, (b) create the
`obsidian/mdeai-second-brain/` tree + start-here notes, (c) add the `.claude/commands/` + `.cursorrules`
files, and (d) add the plain git hook for auto-rebuild — each small and scoped, no production code touched.

This PR is **plan-only**: it adds this one markdown file and changes nothing else.
