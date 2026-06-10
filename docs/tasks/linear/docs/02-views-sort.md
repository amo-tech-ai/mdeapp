# MDEAPP — Views, milestones, sort strategy

**Project:** [MDEAPP](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/overview)  
**Organize script:** `node scripts/linear-organize-project.mjs`  
**Generated:** 2026-05-27

---

## Milestones (execution order)

| # | Milestone | What ships | Example issues |
|---|-----------|------------|----------------|
| 0 | **🚨 Launch Critical** | Paid proof + prod UX + smoke + maps/auth on mdeai.co | SAN-178, SAN-116, SAN-117, SAN-366, SAN-115, SAN-316…324 |
| 1 | **🎟️ Events — Polish** | Host list, checkout polish | EVT-003 / SAN-118 |
| 2 | **🍽️ Discovery — UI** | Screens, unified cards | UIX / AIA-010+ |
| 3 | **🗺️ Maps — Growth** | MAP-005+, routes, hood intel | MAP-004+ |
| 4 | **🔮 Platform — Vector** | pgvector cleanup | VEC-* |
| 5 | **🔮 Coffee tours** | Farm tours (not cafés) | CTI-* |
| 6 | **🔮 Events — Discovery** | EVP-015+ web discovery | EVT-015+ |
| 7 | **🔮 Search — Grounding** | GS-005…009 | MAP/GS deferred |
| 8 | **🔮 Automation — OpenClaw** | VPS automation | AUT-* |
| 9 | **🔮 Deferred — Contest** | CTEST frozen | SYS-* |

---

## Sort strategy (MVP first)

Linear board default sort: **Priority** (desc) → **Milestone sort order** → **Created**

| Priority | Milestone bucket | Rule |
|----------|------------------|------|
| **Urgent** | 🚨 Launch Critical | G1, webhooks, event cards, G3, EVP-001, UX P0 |
| **High** | P1 * | Events polish, screens, maps, core |
| **Medium** | Phase 2 * | Vector, CTI, events discovery |
| **Low** | Deferred * | OCL, CTEST, GS |

**Do not start** Deferred milestones until P0 is Done.

---

## Create views (Linear UI)

**Project → Views → New view**

### 1. Now — P0 MVP
```
project:MDEAPP milestone:"🚨 Launch Critical"
```
Sort: Priority · Display: List

### 2. Phase 1 active
```
project:MDEAPP (milestone:"🚨 Launch Critical" OR milestone:"🎟️ Events — Polish" OR milestone:"🍽️ Discovery — UI" OR milestone:"🗺️ Maps — Growth")
```
Sort: Priority · Group: Milestone

### 3. By track (label)
```
project:MDEAPP
```
Display: **Board** · Group by: **Labels** · Filter label group `track:*`

### 4. Blocked / ready
```
project:MDEAPP has:blocked-by
```
→ issues waiting on dependencies

```
project:MDEAPP -has:blocked-by milestone:"🚨 Launch Critical"
```
→ unblocked P0 ready to pull

### 5. Hide deferred (default team view)
```
project:MDEAPP -milestone:"Deferred — OpenClaw" -milestone:"Deferred — Contest" -milestone:"Deferred — Grounding search"
```

### 6. UX pack (label — stable)
```
project:MDEAPP label:track:ux
```
[Existing view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) — edit filter if empty.

### 7. Data pack (label — stable)
```
project:MDEAPP label:track:data
```
[Existing view](https://linear.app/sanjiovani/view/data-54425dec37b9) — edit filter if empty.

### 8. Stale WIP
```
project:MDEAPP state:"In Progress" updated:< -P7D
```

### 9. Stack Supabase / AI
```
project:MDEAPP label:stack:supabase
```
```
project:MDEAPP (label:stack:mastra OR label:stack:copilotkit OR label:stack:gemini)
```

Full copy-paste guide: [`09-views-setup.md`](09-views-setup.md)

---

## Dependencies

Applied via `scripts/linear-organize-project.mjs` from each spec's `depends_on:` frontmatter.

**Relation type:** `blocks` (blocker → blocked issue)

Re-run after new imports:
```bash
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
node scripts/linear-organize-project.mjs
```

Log: `tasks/linear/organize-log.json`

---

## P0 pull order (within milestone)

1. [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) — Prove live ticket purchase
2. [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) — Isolate Stripe webhooks
3. [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) — Fix event cards in chat
4. [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) — Prove host publish on prod
5. [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) — Fix rental price parsing
6. [SAN-320](https://linear.app/sanjiovani/issue/SAN-320) + [SAN-319](https://linear.app/sanjiovani/issue/SAN-319) — AI errors + thinking (one PR)
7. [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) — Launch proof checklist (blocked until 1–4)
8. ‖ [SAN-100](https://linear.app/sanjiovani/issue/SAN-100) · [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) · [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) · [SAN-369](https://linear.app/sanjiovani/issue/SAN-369)

Delegate to Cursor: assign **Cursor** or `@Cursor … [repo=amo-tech-ai/mdeapp]`

---

## Board hygiene

| Action | Why |
|--------|-----|
| Delete [SAN-94](https://linear.app/sanjiovani/issue/SAN-94) | Import smoke test |
| Use **Milestone** grouping on Issues tab | Matches phase plan |
| Close Linear issue when `tasks/**` status → Done | Keep board honest |
| **Todo / In Review manual sort** | Top = next implementation order — see [`03-linear-notes.md`](03-linear-notes.md) + `.cursor/rules/mdeai-linear.mdc` |
| **Events view** | [events board](https://linear.app/sanjiovani/view/events-02e135249149) — In Review stack ordered |
