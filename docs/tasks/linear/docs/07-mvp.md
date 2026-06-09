# MDEAPP — Product roadmap & Linear naming

**Board:** [MVP view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) · **Project:** [MDEAPP](https://linear.app/sanjiovani/project/mdeapp-099cd7795071)

**Applied 2026-05-30:** `scripts/linear-apply-prefix-catalog.mjs` · Registry: [`prefix-catalog.json`](prefix-catalog.json)

---

## Naming system

| Layer | Format | Example | Notes |
|-------|--------|---------|--------|
| **Product code** | `PREFIX-### — Human title` | `EVT-001 — Fix event cards inside AI chat` | **Linear title** — scan-friendly |
| **Linear ID** | `SAN-###` | `SAN-117` | Auto-assigned, **immutable** |
| **Engineering spec** | `EVP-013-core`, `UX-003`, `F32` | In description + disk | Never in title |
| **IMP** | `079`…`102` | Ledger only | [`implementation-order.json`](implementation-order.json) |

### Prefixes

| Prefix | Domain | Examples |
|--------|--------|----------|
| **EVT** | Events & ticketing | Host publish, event cards, discovery |
| **PAY** | Payments & Stripe | G1 proof, webhook isolation |
| **MAP** | Maps & grounding | Map ID, ADK deploy, pins, routes |
| **CAF** | Cafés | SCREEN-021 discovery cards |
| **VEN** | Restaurants & venues | Booking, nightlife, venue cards |
| **TRP** | Trips | Itinerary, saved trips, coffee tours |
| **RNT** | Rentals | Parser, rental cards, search |
| **AIA** | AI assistant / concierge | Errors, thinking, unified cards |
| **ATH** | Authentication | Prod auth checklist |
| **OPS** | Production & launch ops | Smoke tests, proof ledger, monitors |
| **UIX** | UI / screens / wireframes | Login polish, map panel, wireframes |
| **SYS** | Foundation & platform | F01–F20, vector, Mastra infra |
| **AUT** | Automation (OpenClaw) | Deferred VPS agents |
| **ADM** | Admin | Patricia `/admin/*` (Phase 2) |

---

## Milestones (product language)

| Milestone | Purpose |
|-----------|---------|
| **🚨 Launch Critical** | MVP exit — Andrés pays, Roberto publishes, Tourist chat works on prod |
| **🎟️ Events — Polish** | Host list, checkout polish after launch |
| **🍽️ Discovery — UI** | Screens, café UI, unified cards (UX-010) |
| **🗺️ Maps — Growth** | MAP-005+, hood intel, routes (post-MVP) |
| **🍽️ Venues — Phase 2** | Restaurant/nightlife booking product |
| **🏠 Trips — Phase 2** | Saved trips, itinerary |
| **🔮 Events — Discovery** | EVP-015+ web discovery |
| **🔮 Platform — Vector** | pgvector cleanup |
| **🔮 Automation — OpenClaw** | VPS agents (deferred) |
| **🔮 Search — Grounding** | GS research pack |
| **🔮 Deferred — Contest** | Frozen |

---

## Launch Critical — execution order

Manual sort in [MVP view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) (top = next).

| Code | SAN | Title |
|------|-----|--------|
| PAY-001 | [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) | Prove live ticket purchase on production |
| PAY-002 | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) | Isolate ticket vs sponsor Stripe webhooks |
| EVT-001 | [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) | Fix event cards inside AI chat |
| EVT-002 | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | Prove Roberto can publish an event on production |
| RNT-001 | [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) | Fix rental price parsing (“$500 a night”) |
| AIA-002 | [SAN-320](https://linear.app/sanjiovani/issue/SAN-320) | Show retryable errors when AI chat fails |
| AIA-003 | [SAN-319](https://linear.app/sanjiovani/issue/SAN-319) | Add AI chat thinking indicator |
| OPS-001 | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | Sign off MVP launch proof checklist |
| OPS-002 | [SAN-100](https://linear.app/sanjiovani/issue/SAN-100) | Run production smoke tests on mdeai.co |
| ATH-001 | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) | Verify production login and Vercel env |
| MAP-001 | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | Deploy grounded place search to production |
| MAP-002 | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) | Verify Google Maps pins on production |
| OPS-003 | [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) | Add production AI chat health monitor |
| AIA-004 | [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) | Reset chat and map on “New chat” |
| MAP-003 | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | Clear ghost map pins after empty search |
| UIX-001 | [SAN-324](https://linear.app/sanjiovani/issue/SAN-324) | Fix confusing Save button tooltip |

**Done:** AIA-001 [SAN-315](https://linear.app/sanjiovani/issue/SAN-315) · CAF-001 [SAN-114](https://linear.app/sanjiovani/issue/SAN-114)

---

## Board views & filters

### 1. Launch Critical (default MVP)

```text
project:MDEAPP milestone:"🚨 Launch Critical" state:Todo,"In Progress"
```

**Group by:** `phase:launch` or prefix label (`prefix:EVT`, `prefix:PAY`, …)

### 2. Post-MVP — hide from daily pull

```text
project:MDEAPP label:phase:post-mvp
```

### 3. By product area

```text
project:MDEAPP
```

Display: **Board** · Group: **Labels** → `prefix:*`

### 4. Blocked launch work

```text
project:MDEAPP milestone:"🚨 Launch Critical" has:blocked-by
```

### 5. UX tasks view ([ux-tasks](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725))

**Why it looked empty:** `linear-apply-prefix-catalog.mjs` replaced labels and dropped `track:ux`. Issues stayed on [MDEAPP → Issues](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues).

**Fix (pick one):**

```text
project:MDEAPP label:track:ux
```

Fallback if the view still filters on old titles:

```text
project:MDEAPP (label:track:ux OR label:prefix:AIA OR label:prefix:UIX OR label:prefix:RNT)
```

Re-apply labels after any bulk label script:

```bash
node scripts/linear-restore-track-labels.mjs
```

### 6. Data view ([data](https://linear.app/sanjiovani/view/data-54425dec37b9))

**Why it looked empty:** same migration removed `track:data` from SAN-325…359.

**Fix:**

```text
project:MDEAPP label:track:data
```

Or by product code in title:

```text
project:MDEAPP title~"DATA-"
```

(Auth pack is separate — use `label:prefix:ATH` or milestone **🚨 Launch Critical** for ATH-001.)

**Do not** rely on old milestone names in view filters (`P0 — MVP gates`, `P1 — Screens & café`) — renamed to **🚨 Launch Critical**, **🍽️ Discovery — UI**, etc.

---

## Labels (scaling)

| Label | Use |
|-------|-----|
| `phase:launch` | On every Launch Critical issue |
| `phase:post-mvp` | Everything else active |
| `prefix:EVT` … `prefix:AUT` | Filter/group by product domain |
| `area:*` (legacy) | Optional cross-cut with area labels from prior pass |
| `track:events`, `track:ux`, `track:maps` | Engineering track (imports) |
| `mvp`, `phase-1` | Phase 1 scope |

**Rule:** Add new work with the right `prefix:*` + `phase:launch` or `phase:post-mvp`. Next code = increment `PREFIX-###` in [`prefix-catalog.json`](prefix-catalog.json).

---

## Duplicates & hygiene

| Issue | Action | Canonical |
|-------|--------|-----------|
| SAN-272 WIRE-026 | **Duplicate** of café work | SAN-114 / CAF-001 |
| SAN-317 UX-004 | **Canceled** (concierge green) | — |
| SAN-248 SCREEN-009 checkout | Polish only; **G1 proof = PAY-001** | Don’t duplicate Stripe proof |
| SAN-117 EVT-001 vs UX-010 M1 | **117 first** (launch); card architecture after C-012 | AIA-010 family |

---

## Issue descriptions

Every issue description now starts with:

```markdown
## Product code
**EVT-001** — Fix event cards inside AI chat

| Traceability | Value |
|--------------|-------|
| Linear | SAN-117 |
| Spec | `EVP-013-core` |
| Prefix | EVT |

---
(legacy spec body below)
```

---

## Re-apply / refresh

```bash
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
node scripts/linear-fetch-all-issues.mjs
node scripts/linear-apply-prefix-catalog.mjs --dry-run   # preview
node scripts/linear-apply-prefix-catalog.mjs             # apply
```

**Do not re-run blindly** after manual edits — it overwrites titles. Update `EXPLICIT` in the script for launch rows, then run.

---

## Best setup — two axes (product + stack)

Linear works best when **one issue carries two independent tag families**:

| Axis | Labels | Answers | Who uses it |
|------|--------|---------|-------------|
| **Product** | `prefix:EVT`, `phase:launch`, milestone | *What ships for users?* | PM, investors, MVP board |
| **Stack** | `stack:mastra`, `stack:supabase`, … | *What tech do I touch?* | Sofía, stack owners |
| **Agent** (optional) | `agent:concierge`, `agent:hostEvent` | *Which Mastra agent?* | AI / CopilotKit work only |

Do **not** replace PREFIX titles or SAN ids. Add stack labels **on top**.

### Source of truth (mdeai — not `/docs` alone)

| Layer | Path | Role |
|-------|------|------|
| **Executable specs** | `tasks/**` (`*.md` frontmatter) | Done gates, IMP, `linear: SAN-*` — **canonical for work** |
| **PRD** | `plan/prd/README.md` (10 chunks) | Strategy, personas, contracts |
| **Execution order** | `todo.md`, `plan.md`, `tasks/linear/core-mvp-order.json` | What to build next |
| **App onboarding** | `mdeapp/docs/ARCHITECTURE.md` | How the repo runs |
| **Navigation index** | `docs/index.md`, `docs/prd.md` | Human-friendly index → links into `plan/` + `tasks/` |

Avoid a second PRD tree under `/docs` that diverges from `plan/prd/`. Either symlink/index from `docs/` or add **Linear Resources** pointing at GitHub paths below.

### Linear project → Resources (link GitHub, not “local only”)

**Project → Overview → Resources → +**

| Resource name | GitHub URL (mdeai repo) |
|---------------|-------------------------|
| PRD index | `https://github.com/amo-tech-ai/mdeai/blob/main/plan/prd/README.md` |
| MVP execution | `https://github.com/amo-tech-ai/mdeai/blob/main/todo.md` |
| Architecture (app) | `https://github.com/amo-tech-ai/mdeai/blob/main/mdeapp/docs/ARCHITECTURE.md` |
| Maps / grounding | `https://github.com/amo-tech-ai/mdeai/blob/main/plan/prd/04-maps-grounding.md` |
| Events / ticketing | `https://github.com/amo-tech-ai/mdeai/blob/main/plan/prd/05-events-ticketing.md` |
| Mastra | `https://github.com/amo-tech-ai/mdeai/blob/main/plan/mastra/index-mastra.md` |
| Supabase / RLS | `https://github.com/amo-tech-ai/mdeai/blob/main/plan/prd/09-operations-security.md` |
| Linear playbook | `https://github.com/amo-tech-ai/mdeai/blob/main/tasks/linear/07-mvp.md` |

Use **`amo-tech-ai/mdeai`** for planning; **`amo-tech-ai/mdeapp`** only for app code + `mdeapp/docs/`.

### Stack labels (create in Linear — group `stack`)

| Label | View filter | Typical tasks |
|-------|-------------|---------------|
| `stack:mastra` | `label:stack:mastra` | Agents, tools, workflows, memory |
| `stack:copilotkit` | `label:stack:copilotkit` | Runtime, HITL, generative UI, `/api/copilotkit` |
| `stack:nextjs` | `label:stack:nextjs` | App Router, layouts, RSC, Vercel |
| `stack:supabase` | `label:stack:supabase` | RLS, migrations, edge functions, auth |
| `stack:maps` | `label:stack:maps` | Places, mapId, ADK grounding, markers |
| `stack:stripe` | `label:stack:stripe` | Checkout, webhooks, G1 proof |
| `stack:gemini` | `label:stack:gemini` | Models, prompts (Phase 1 prod AI) |
| `stack:playwright` | `label:stack:playwright` | E2E, SCREEN-* specs |
| `stack:whatsapp` | `label:stack:whatsapp` | Phase 2 — venue handoff |
| `stack:openclaw` | `label:stack:openclaw` | Deferred VPS automation |

**Rule:** Every issue gets **1–3** stack labels (primary + secondary). Example:

```text
EVT-001 — Fix event cards inside AI chat
  prefix:EVT · phase:launch
  stack:copilotkit · stack:mastra · stack:nextjs
  agent:concierge (if Tourist path)
```

### Area labels — align with PREFIX (avoid a third naming scheme)

Prefer **`prefix:*`** for product area (already applied). If you add `area:*`, **map 1:1**:

| `area:*` | Same as `prefix:` |
|----------|-------------------|
| `area:events` | `prefix:EVT` |
| `area:cafes` | `prefix:CAF` |
| `area:rentals` | `prefix:RNT` |
| `area:trips` | `prefix:TRP` |
| `area:venues` | `prefix:VEN` |

Do not maintain separate `CAF-001` ids *and* unrelated `area:cafes` without linking — use **PREFIX in title**, `area:*` only as optional filter alias.

### Agent labels (Mastra agent names only)

| Label | Mastra / UI name |
|-------|------------------|
| `agent:concierge` | `conciergeAgent` — Tourist `/` |
| `agent:hostEvent` | `hostEventAgent` — Roberto wizard |
| `agent:rental` | rental search path — Camila |
| `agent:router` | Phase 2 routing |

Skip `agent:*` on pure UI/DB tasks.

### Recommended views (create in Linear UI)

| View | Filter | Group by |
|------|--------|----------|
| **🚨 Launch Critical** | `milestone:"🚨 Launch Critical"` | `prefix:*` |
| **🤖 Mastra** | `project:MDEAPP label:stack:mastra` | milestone |
| **CopilotKit** | `label:stack:copilotkit` | milestone |
| **Supabase** | `label:stack:supabase` | milestone |
| **Maps & Places** | `label:stack:maps` | milestone |
| **Stripe / PAY** | `label:stack:stripe` OR `prefix:PAY` | state |
| **Next.js / UI** | `label:stack:nextjs` | milestone |
| **Playwright / QA** | `label:stack:playwright` | milestone |
| **☕ Cafés** | `prefix:CAF` OR `label:area:cafes` | state |
| **🎟️ Events** | `prefix:EVT` | state |
| **🏠 Rentals** | `prefix:RNT` | state |
| **Post-MVP hide** | `label:phase:post-mvp -milestone:"🔮*"` | prefix |

Hide **🔮 Automation — OpenClaw** and **🔮 Deferred — Contest** from default team view.

### What is *not* the best primary split

| Avoid as primary | Why |
|------------------|-----|
| Only `stack:*` views | Loses launch order and persona outcomes |
| Only `/docs` without `tasks/**` | No Done gates, IMP, or verifier path |
| Renaming SAN → EVT in Linear | Team key stays SAN; use PREFIX in **title** |
| Duplicate PRDs in `/docs` | Drift from `plan/prd/` |

**Best combo:** `tasks/**` spec on disk → issue title `PREFIX-### — …` → labels `prefix:*` + `stack:*` + `phase:*` → views by milestone (when) and stack (who).

---

## Related docs

- [`todo.md`](../../todo.md) — disk execution order
- [`core-mvp-order.json`](core-mvp-order.json) — IMP ↔ SAN ↔ spec
- [`02-views-sort.md`](02-views-sort.md) — pull order (update milestone filter to 🚨 Launch Critical)
- [`01-linear.md`](01-linear.md) — import/sync scripts
- [`docs/index.md`](../../docs/index.md) — repo-first doc index
