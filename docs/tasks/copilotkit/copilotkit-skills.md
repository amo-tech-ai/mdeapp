---
title: CopilotKit skills — mdeapp 1.55.2 routing & scores
updated: 2026-06-03
mdeapp_pin: "@copilotkit/* 1.55.2 (v1 hooks — not v2)"
registry: https://www.skills.sh/?q=copilotkit
canonical_pack: copilotkit/skills (symlinked under `.agents/skills/` → `.claude/skills/`)
---

# CopilotKit skills for mdeai (1.55.2)

**Version note:** mdeapp pins **CopilotKit 1.55.2** (Phase 1 “v1” line: `useCoAgent`, `useCopilotAction`, `CopilotKit` from `@copilotkit/react-core`). That is **not** CopilotKit v2 (`@copilotkit/react`, `useAgent`, `useFrontendTool`). When [skills.sh](https://www.skills.sh/?q=copilotkit) or public docs say “latest,” assume **v2 unless you map through** [`mastra.md`](../../.agents/skills/copilotkit-integrations/references/integrations/mastra.md).

## One-line answer

| Work in `mdeapp/` | Load |
|-------------------|------|
| **Default** | **`copilotkit-integrations`** → read **`references/integrations/mastra.md`** |
| Unsure which file | **`copilotkit`** (router only) |
| Broken runtime / POST storm / no cards | **`copilotkit-debug`** |
| **Do not implement from** | **`copilotkit-develop`** (v2 APIs) |

---

## Score rubric (/100 = fit for **mdeapp @ 1.55.2** today)

| Band | Score | Meaning |
|------|------:|---------|
| 🟢 | 85–100 | Safe default — load for product work |
| 🟡 | 50–84 | Load for a **narrow** task; map v2 → v1 per `mastra.md` |
| 🔴 | 0–49 | Do not load for mdeapp implementation (v2-only, wrong repo, or Phase 2) |

Dimensions: **API match** (v1 vs v2), **Mastra in-process Pattern 1**, **mdeai scan root** (`.claude/skills/`), **LESSONS alignment** ([`docs/LESSONS.md`](../../docs/LESSONS.md) §1).

---

## Official pack — `copilotkit/skills` ([skills.sh](https://www.skills.sh/?q=copilotkit) #1–9)

Already vendored in mdeai (`.agents/skills/`; enable via `.claude/skills/` symlinks per [`index-skills.md`](../../index-skills.md)).

| # | Skill | Installs | v1.55.2 score | Verdict | When to load (mdeapp) |
|---|--------|----------:|--------------:|---------|----------------------|
| 1 | **copilotkit** | 594 | **96** | 🟢 Router | First touch — picks sub-skill; does not replace `mastra.md` |
| 2 | **copilotkit-agui** | 402 | **78** | 🟡 | SSE/event ordering, HITL protocol, “why stream broke” — **not** React hook names |
| 3 | **copilotkit-debug** | 401 | **94** | 🟢 | Runtime 500, agent silent, version skew, CORS, AG-UI trace |
| 4 | **copilotkit-develop** | 398 | **22** | 🔴 | **v2 only** — reference for Phase 2; **never** primary for mdeapp edits |
| 5 | **copilotkit-integrations** | 398 | **98** | 🟢 | **Primary** — Mastra + `/api/copilotkit`; **must** open `mastra.md` |
| 6 | **copilotkit-setup** | 397 | **55** | 🟡 | Greenfield install only; mdeapp already wired |
| 7 | **copilotkit-upgrade** | 397 | **12** | 🔴 | Phase 2 v2 migration — out of phase |
| 8 | **copilotkit-self-update** | 397 | **70** | 🟡 | Refresh vendor skill text from upstream — meta, not product |
| 9 | **copilotkit-contribute** | 396 | **8** | 🔴 | Contributing to CopilotKit OSS — not mdeai product |

### Trap inside #5 (integrations)

The **top of `copilotkit-integrations/SKILL.md`** shows v2 snippets (`CopilotKitProvider`, `useAgent`, `useFrontendTool`). **Ignore for mdeapp.** Use only:

- `references/integrations/mastra.md` (Pattern 1, hook mapping table)
- `CopilotKit/examples/integrations/mastra/` on disk
- MCP `search-code` filtered for 1.55.2 / `react-core`

### v2 → 1.55.2 hook map (keep in agent context)

| v2 (develop skill / docs default) | mdeapp 1.55.2 |
|-----------------------------------|---------------|
| `CopilotKitProvider` + `@copilotkit/react` | `<CopilotKit>` + `@copilotkit/react-core` |
| `useAgent` | `useCoAgent` |
| `useFrontendTool` | `useCopilotAction` + `handler` |
| `useRenderToolCall` | `useCopilotAction({ available: "disabled", render })` |
| `renderAndWaitForResponse` (v2 name) | `useCopilotAction` + `renderAndWaitForResponse` (v1 — host wizard) |

**Tool render names:** register **`MASTRA_COPILOT_TOOL_ACTIONS`** keys (e.g. `searchRentalsTool`) **and** legacy `createTool` ids where needed — see `mdeapp/src/platform/copilot/mastra-tool-action-names.ts`.

---

## Monorepo pack — `copilotkit/copilotkit` (skills.sh #10–17, #18–20)

Duplicate or package-scoped copies of the same skill names; **prefer `copilotkit/skills`** in mdeai to avoid drift.

| Skill | v1.55.2 score | Verdict |
|-------|--------------:|---------|
| copilotkit-develop / integrations / debug / setup (copilotkit repo) | Same as #4–7 above | Use **copilotkit/skills** copy only |
| **react-core** / **runtime** | **40** | Package-oriented snippets — use **`mastra.md`** + disk, not as agent skill |
| **a2ui-renderer** | **15** | Generative UI v2 path — Phase 2+ |

---

## Workflow skills — `copilotkit/copilotkit` (#30–34, low installs)

| Skill | v1.55.2 score | Verdict |
|-------|--------------:|---------|
| **0-to-working-chat** | 45 | Generic bootstrap — mdeapp past this |
| **debug-and-troubleshoot** | 75 | Overlaps **copilotkit-debug** — prefer debug skill |
| **scale-to-multi-agent** | 50 | Conceptual; mdeai already multi-agent in Mastra |
| **go-to-production** | 55 | High-level — use **mde-vercel** + **task-verifier** |
| **v1-to-v2-migration** | **10** | **Inverse** of Phase 1 — do not load until Phase 2 CK v2 |

---

## Third-party entries (skills.sh #21+)

| Skill | Source | v1.55.2 score | Verdict |
|-------|--------|--------------:|---------|
| copilotkit | outlinedriven/odin-codex-plugin | 20 | Different product — ignore |
| copilotkit-nextjs-integration | raphaelmansuy/edgequake | 15 | Not Mastra/AG-UI mdeai stack |
| copilotkit | nihalnihalani/copilotkit-skill | 25 | Unvetted duplicate — do not install over vendor pack |
| opengenerativeui/* | copilotkit/opengenerativeui | 10 | Demos / A2UI — not Phase 1 mdeapp |
| llmock / aimock write-fixtures | copilotkit/* | 30 | Test fixtures — only if explicitly mocking CK |

---

## mdeai-only (not on skills.sh — use instead of guessing)

| Resource | Score | Role |
|----------|------:|------|
| **`copilotkit-integrations` → `mastra.md`** | **100** | Authoritative mdeapp wiring |
| **`source-command-copilotkit-check`** | **95** | 1.55.2 pin, single-mount audit, agent name match |
| **`index-skills.md` § CopilotKit** | **98** | Load cap ≤5, routing table |
| **`docs/LESSONS.md` §1** | **98** | POST storms, stable renders, no v2 docs for v1 code |
| **`mastra` skill** | **98** | Agents/tools — with integrations for CK bridge |
| **MCP `copilotkit`** (`.mcp.json`) | **85** | Live docs when connected; flaky → Mastra example on disk |

---

## Recommended load order (≤5 skills — [`mdeai-skills-best-practices`](../../.cursor/rules/mdeai-skills-best-practices.mdc))

| Task type | Load |
|-----------|------|
| Chat UI, generative cards, `useCopilotAction` | `copilotkit-integrations` (+ `mastra.md`) → `testing` |
| Runtime / Mastra bridge / route.ts | `copilotkit-integrations` → `mastra` → `copilotkit-debug` if red |
| SCREEN-* with map pins | `copilotkit-integrations` → `mde-maps` → `testing` |
| Incident | `copilotkit-debug` → `copilotkit-integrations` |
| Phase 2 prep only | `copilotkit-upgrade` + `copilotkit-develop` (still read `mastra.md` for delta) |

**Never load for mdeapp implementation:** `copilotkit-develop` alone, `copilotkit-upgrade`, third-party `copilotkit-*` from skills.sh outside `copilotkit/skills`.

---

## Hygiene checklist (quick verify)

```bash
cd mdeapp
# Pin
rg '"@copilotkit/' package.json   # all 1.55.2
# No v2 app imports
rg '@copilotkit/react"|useFrontendTool|CopilotKitProvider' src/
# Agent names
rg 'conciergeAgent|hostEventAgent' src/mastra/index.ts src/lib/copilotkit-client-props.ts
# Tests
npm test -- --run src/lib/__tests__/copilotkit-client-props.test.ts src/platform/copilot/__tests__/mastra-tool-action-names.test.ts
```

---

## Summary table (skills.sh top 9 only)

| Skill | /100 for 1.55.2 | Use in mdeapp? |
|-------|----------------:|----------------|
| copilotkit | 96 | Yes — router |
| copilotkit-agui | 78 | Yes — protocol/debug depth |
| copilotkit-debug | 94 | Yes — incidents |
| copilotkit-develop | 22 | **No** — v2 trap |
| copilotkit-integrations | 98 | **Yes — primary** |
| copilotkit-setup | 55 | Rarely (already installed) |
| copilotkit-upgrade | 12 | No (Phase 2) |
| copilotkit-self-update | 70 | Meta only |
| copilotkit-contribute | 8 | No |

**Weighted pack score (official 9, mdeapp-weighted):** **~82/100** — high value if you **never** default to `copilotkit-develop`; **~95/100** if routing rule is enforced (integrations + mastra.md only).

---

## Official GitHub sources ([CopilotKit org](https://github.com/CopilotKit))

| Repo / path | What it is | v1 (1.55.2)? |
|-------------|------------|--------------|
| [**CopilotKit/skills**](https://github.com/CopilotKit/skills) | Canonical **agent skills** pack (`npx skills add copilotkit/skills`) | **No — v2-first** (README badge: CopilotKit v2, `@copilotkit/*` v2 APIs) |
| [**CopilotKit/CopilotKit/tree/main/skills**](https://github.com/CopilotKit/CopilotKit/tree/main/skills) | Same skill folders **inside monorepo** + `react-core`, `runtime`, `a2ui-renderer` | **No** — `react-core` skill targets **v2** (`useAgent`, `CopilotKitProvider`, lib **1.56.2**) |
| [**CopilotKit/CopilotKit**](https://github.com/CopilotKit/CopilotKit) | Main SDK + examples | Mixed — see below |
| [**examples/integrations/mastra**](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | **Best upstream v1.55.2 sample** (`useCoAgent`, `useCopilotAction`, pinned **1.55.2** in `package.json`) | **Yes** |
| Local clone | `/home/sk/mdeai/CopilotKit/examples/integrations/mastra/` | **Yes** (May 2026 clone; re-fetch `main` to refresh) |

### There is no CopilotKit-published “v1 skills” pack

Upstream skills ([skills.sh](https://www.skills.sh/?q=copilotkit), [CopilotKit/skills](https://github.com/CopilotKit/skills)) are maintained for **v2**. For **mdeapp @ 1.55.2**, treat these as **v1 documentation**:

| Source | Role |
|--------|------|
| **`copilotkit-integrations` → `mastra.md`** (mdeai) | Authoritative v1 hook map + Pattern 1 |
| **`copilotkit-upgrade`** | **Inverted** — its “v1 → v2” table lists every v1 API you still use |
| **Mastra example** (GitHub or `mdeai/CopilotKit/.../mastra`) | Working code at **1.55.2** |
| **Canvas example** (`CopilotKit/examples/canvas/mastra`) | Shared-state CRUD + frontend actions — [`V1/patterns/`](../../.agents/skills/copilotkit/V1/patterns/README.md) |
| **mastra-pm workshop** (`examples/canvas/mastra-pm`) | Agent-owned WM, Sidebar, CLI — same patterns index |
| **a2a-travel showcase** (`examples/showcases/a2a-travel`) | A2A Pattern 3 + dual-pane/HITL — [`V1/showcases/a2a-travel/`](../../.agents/skills/copilotkit/V1/showcases/a2a-travel/README.md) |
| **banking showcase** | Auth readables, role gates, display + sequential HITL — [`V1/showcases/banking/`](../../.agents/skills/copilotkit/V1/showcases/banking/README.md) |
| **generative-ui showcase** | 3-lane Gen-UI taxonomy + mdeapp Phase 1 lane — [`V1/showcases/generative-ui/`](../../.agents/skills/copilotkit/V1/showcases/generative-ui/README.md) |
| **microsoft-kanban showcase** | Shared-state kanban + NL CRUD — [`V1/showcases/microsoft-kanban/`](../../.agents/skills/copilotkit/V1/showcases/microsoft-kanban/README.md) |
| **deep-agents-job-search showcase** | Upload readable + tool → side panel — [`V1/showcases/deep-agents-job-search/`](../../.agents/skills/copilotkit/V1/showcases/deep-agents-job-search/README.md) |
| **`docs.copilotkit.ai` Mastra pages** | Conceptual; site defaults to v2 — map via `mastra.md` |
| **MCP** `https://mcp.copilotkit.ai/mcp` | Live search — **filter** results through v1 mapping |
| **`copilotkit-develop` / monorepo `react-core` skill** | **v2 only** — do not use for mdeapp edits |

### `copilotkit-upgrade` v1 API checklist (what mdeapp still uses)

From [CopilotKit/skills — copilotkit-upgrade](https://github.com/CopilotKit/skills/tree/main/skills/copilotkit-upgrade): packages `@copilotkit/react-core`, `react-ui`, `runtime`; hooks `useCoAgent`, `useCopilotAction`, `useCopilotReadable`, `useCopilotChat`, etc. **Do not apply the v2 replacement column** until Phase 2.

### Install upstream skills (optional — still v2-oriented)

```bash
npx skills add copilotkit/skills --full-depth -y
```

mdeai already vendors the same skill **names** under `.agents/skills/` — prefer those + **`mastra.md`** + **[`V1/`](../.agents/skills/copilotkit/V1/README.md)** over a second install.

### Local v1 reference (mdeai-authored)

| Path | Content |
|------|---------|
| [`.agents/skills/copilotkit/V1/README.md`](../../.agents/skills/copilotkit/V1/README.md) | v1 index + mdeapp invariants |
| [`V1/components/`](../../.agents/skills/copilotkit/V1/components/README.md) | CopilotKit, CopilotChat, CopilotPopup, CopilotSidebar, CopilotTextarea |
| [`V1/hooks/`](../../.agents/skills/copilotkit/V1/hooks/README.md) | useCoAgent, useCopilotAction, useCopilotChat, … (14 hooks) |
| [`V1/patterns/`](../../.agents/skills/copilotkit/V1/patterns/README.md) | canvas/mastra + mastra-pm — 13 patterns |
| [`V1/showcases/`](../../.agents/skills/copilotkit/V1/showcases/README.md) | examples/showcases index + 5 Tier-1 showcases (~30 pattern docs) |
| Official mirror | [docs.copilotkit.ai/reference/v1](https://docs.copilotkit.ai/reference/v1) |

---

## Related

- [`index-skills.md`](../../index-skills.md) — Phase 1 pack scores
- [`tasks/venues/tasks/evidence/VEN-031-verify-2026-06-03.md`](../venues/tasks/evidence/VEN-031-verify-2026-06-03.md) — Playwright gate (CK-adjacent console hygiene)
- Upstream registry: [skills.sh CopilotKit search](https://www.skills.sh/?q=copilotkit)
