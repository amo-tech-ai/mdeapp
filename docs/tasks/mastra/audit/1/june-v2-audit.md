---
title: CopilotKit v2 Upgrade — Impact on the Mastra+CopilotKit Audit
date: 2026-06-05
auditor: Claude (Principal AI Architect / forensic mode)
companion: ./june5-mastra-audit.md
source: https://docs.copilotkit.ai/built-in-agent/troubleshooting/migrate-to-v2
method: migration-guide read + copilotkit-develop (v2) skill + installed node_modules inspection
verdict: v2 fixes ~0 of the audit's P0/P1 findings (those are Mastra-side). It is a frontend/runtime modernization — defer to Phase 2, gated on @ag-ui/mastra v2.
---

# CopilotKit v2 Upgrade — Audit Impact Analysis

> **Read this first:** The June-5 audit's blockers are **Mastra-side**
> (scorers, observability, output processors, checkout workflow, memory).
> CopilotKit v2 is a **frontend + runtime** change. **It improves almost none
> of the production-readiness findings.** This doc says so plainly, then maps
> exactly what v2 *does* change and what migration costs.

---

## TL;DR

| Question | Answer |
|---|---|
| **Does v2 fix the audit's 2 P0s (0 scorers, 0 tracing)?** | **No.** Both are Mastra-side. v2 touches neither. |
| **Does v2 fix the P1s (output processor, checkout workflow, memory)?** | **No** — all Mastra-side. Only the "non-prod agents exposed" P1 gets marginally cleaner. |
| **What does v2 actually improve?** | Frontend DX + permanently kills the v1/v2-mixing footgun + cleaner HITL/tools/shared-state. |
| **Is "v2" a version bump?** | **No.** `@copilotkit/react-core@1.55.2` already ships a `./v2` subpath. Two distinct "v2"s exist (see below). |
| **Should we do it now?** | **No.** Do the Mastra P0s first. Schedule the contained subpath-v2 migration for Phase 2. |
| **Hard gate** | `@ag-ui/mastra` must support the v2 runtime for full standalone-v2. |

**Net:** Upgrading to v2 would **not move the audit grade** (B−), production readiness (62%), or MVP readiness (74%) — because those numbers are dragged down by Mastra quality/observability gaps that v2 does not address. v2 is worth doing for engineering hygiene, **not** to close the audit.

---

## 1. Critical clarification — there are TWO "v2"s

Inspecting installed packages reveals the migration guide and the `copilotkit-develop` skill describe **different things**:

| | **Path A — subpath v2** | **Path B — standalone v2** |
|---|---|---|
| Import | `@copilotkit/react-core/v2` | `@copilotkit/react` + `@copilotkit/core` |
| Source | **The `./v2` subpath of 1.55.2 you already have** | New package line (not installed) |
| Version bump? | **No** — already in `node_modules` (`exports: ['.', './v2', './v2/styles.css']`) | Yes — new deps |
| Backend change? | **None** — keeps `@copilotkit/runtime@1.55.2` + `copilotRuntimeNextJSAppRouterEndpoint` | **Yes** — `createCopilotEndpoint` (Hono) replaces the Next route helper |
| `ai_runs` / `LoggingMastraAgent` hook | **Survives** (backend unchanged) | **At risk** — new endpoint/agent classes |
| Mastra gate | `@ag-ui/mastra` already exports `./copilotkit` — likely OK | **Hard-gated** on `@ag-ui/mastra` standalone-v2 |
| The URL you sent | **This one** | Not this guide |
| Effort | Frontend-only, ~24 files | Frontend + runtime + bridge rewrite |
| Risk | Low–Med | High |

**This is the single most important finding.** The migration guide you linked is **Path A** — same version, swap frontend imports, backend untouched. CLAUDE.md's "migrate in Phase 2 when Mastra ships on v2" is really about **Path B**.

**Verified from `node_modules`:**
- `@copilotkit/react-core@1.55.2` → `exports: [".", "./v2", "./v2/styles.css"]`
- `@ag-ui/mastra@0.2.1-beta.2` → `exports: [".", "./copilotkit"]`
- `@copilotkit/runtime@1.55.2` (unchanged target for Path A)
- **24 files** touch v1 hooks; `renderAndWaitForResponse` HITL in `host-event-copilot-bridge.tsx`

---

## 2. Does v2 improve each audit finding? (the honest table)

| June-5 finding | Severity | Does v2 help? | Why |
|---|---|---|---|
| **0 scorers** (§5) | 🔴 P0 | ❌ **No** | Scorers are a **Mastra** runtime concern. CopilotKit has no scorers. |
| **0 observability / tracing** (§7) | 🔴 P0 | ❌ **No** (Path A); ⚠️ **regresses** (Path B) | Tracing = Mastra telemetry. Worse: Path B's new endpoint can **break** the `ai_runs` `LoggingMastraAgent` hook — your only current signal. |
| **Non-prod agents reachable on runtime** (§1) | 🟡 P1 | 🟗 **Marginal** | v2 still needs an allowlist; but per-component `agentId`/`useAgent` makes intended bindings more explicit. Doesn't auto-fix. |
| **No output processor** (§8) | 🟡 P1 | ❌ **No** | Output processors are Mastra-side. |
| **No checkout workflow** (§3, §10) | 🟡 P1 | ❌ **No** | Mastra workflow. |
| **`search-venue-anchors.ts` orphan** (§2) | 🟡 P1 | ❌ **No** | Mastra tool. |
| **`conciergeRoutingWorkflow` registered vs rule** (§3) | 🟡 P1 | ❌ **No** | Mastra workflow. |
| **Memory gaps (resource/semantic)** (§6) | 🟡 P2 | ❌ **No** | Mastra memory. |
| **rentalAgent/eventAgent redundant** (§1) | 🟡 P2 | ❌ **No** | Mastra agents. |
| **v1/v2 mixing footgun** (LESSONS.md) | 🟡 latent | ✅ **Yes** | Going fully v2 **eliminates** the mixing risk permanently. |
| **POST-storm workaround** (single `useCoAgent` mount) | 🟡 latent | ✅ **Likely** | v2 `useAgent` shared-state model is cleaner; may remove the manual single-mount guard. |

**Score:** v2 closes **1 latent footgun outright** and **marginally helps 1 P1**. It closes **0 of 2 P0s** and **0 of the 5 substantive P1s**. On Path B it can *regress* observability.

---

## 3. What v2 genuinely improves (the real upside)

These are DX / correctness wins, not audit-grade movers:

| v1 today (mdeapp) | v2 equivalent | Benefit |
|---|---|---|
| `useCoAgent({ name })` + manual single mount to avoid POST storm | `useAgent` | Cleaner shared-state; likely native dedup → removes the POST-storm workaround |
| `useCopilotAction({ available:"disabled", render })` for cards | `useRenderTool` / `useComponent` | Purpose-built gen-UI API; less boilerplate (F15/F17/F49 cards) |
| `useCopilotAction({ handler, parameters })` for `focusMapPin` | `useFrontendTool` | Explicit frontend-tool contract (F50) |
| `useCopilotReadable` | `useAgentContext` | Clearer "context vs tool" separation (F19) |
| `renderAndWaitForResponse` HITL | `useHumanInTheLoop` (or `useInterrupt`) | Cleaner suspend/resume for Roberto's wizard + approval tools |
| `@copilotkit/react-ui` + `@copilotkit/react-core` split imports | single `@copilotkit/react-core/v2` (Path A) or `@copilotkit/react` (Path B) | One import surface; ends v1/v2 confusion |
| Headless UI = Phase-2/license-gated | Available in v2 | Full design control (DESIGN.MD ambitions) |

**Persona impact:** Roberto's host wizard (`useHumanInTheLoop`) and Camila's map (`useFrontendTool focusMapPin`) get cleaner code — but **no behavior the user can see changes**. This is refactor value, not feature value.

---

## 3.1 VERIFIED v2 export surface (ground truth — `node_modules`, 2026-06-05)

`require.resolve('@copilotkit/react-core/v2')` → `dist/v2/index.cjs` ✅ **the path resolves; Path A is real and ready.** `@copilotkit/react` (Path B) is **not installed** — confirmed unavailable today.

Enumerated the actual exports of `@copilotkit/react-core/v2`. The mapping below is **confirmed against the installed build**, not inferred:

| v1 hook/API (mdeapp) | In v2 entry? | v2 replacement (confirmed present) |
|---|---|---|
| `useCoAgent` | ❌ **absent** | **`useAgent`** ✅ |
| `useCopilotAction` (handler form) | ❌ absent | **`useFrontendTool`** ✅ |
| `useCopilotAction` (disabled render) | ❌ absent | **`useRenderTool`** ✅ / **`useComponent`** ✅ / `useDefaultRenderTool` |
| `useCopilotReadable` | ❌ absent | **`useAgentContext`** ✅ |
| `renderAndWaitForResponse` (HITL) | ❌ absent | **`useHumanInTheLoop`** ✅ (closest analog) / `useInterrupt` ✅ |
| `<CopilotKit>` provider | — | `CopilotKit` ✅ **and** `CopilotKitProvider` ✅ (both exported — rename optional) |
| `CopilotSidebar`/`Popup`/`Chat` (from `react-ui`) | — | all exported from `react-core/v2` ✅ (drop `@copilotkit/react-ui`) |
| — (new in v2) | — | `useThreads`, `useSuggestions`, `useCoAgentStateRender`, `defineToolCallRenderer`, MCP-Apps renderer |

**Two corrections to the earlier draft, now verified:**
1. **HITL → `useHumanInTheLoop`** (not `useInterrupt`). Both exist; `useHumanInTheLoop` is the direct `renderAndWaitForResponse` analog, `useInterrupt` is the lower-level primitive. Pick `useHumanInTheLoop` for Roberto's wizard.
2. **No v1→v2 passthrough aliases.** The v1 hooks are **physically absent** from the `/v2` entry — you cannot `import { useCoAgent } from "@copilotkit/react-core/v2"`. This is a *feature*: it structurally **prevents v1/v2 mixing inside a v2 import**, hard-enforcing the LESSONS.md no-mix rule at the type level. Migration is a clean per-file swap, not a gradual alias drift.

---

## 4. Changes needed — Path A (recommended, contained)

Scope: **frontend only, backend untouched, no version bump.** ~24 files.

### 4.1 Imports (mechanical, every CK file)
```diff
- import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
- import { CopilotSidebar } from "@copilotkit/react-ui";
- import "@copilotkit/react-ui/styles.css";
+ import { useAgent, useRenderTool, useFrontendTool, useInterrupt } from "@copilotkit/react-core/v2";
+ import { CopilotSidebar } from "@copilotkit/react-core/v2";
+ import "@copilotkit/react-core/v2/styles.css";
```

### 4.2 Hook rewrites (per the mapping in §3)
- `concierge-coagent-context.tsx` — `useCoAgent<ConciergeWorkingMemory>` → `useAgent`. Re-verify the single-mount POST-storm guard is still needed (likely not).
- All gen-UI cards (F15/F17/F49) — disabled-action render → `useRenderTool`/`useComponent`.
- `focusMapPin` (F50) — `useCopilotAction` handler → `useFrontendTool`.
- `host-event-copilot-bridge.tsx` — `renderAndWaitForResponse` → `useHumanInTheLoop` (verified export; `useInterrupt` is the lower-level fallback).
- Provider — keep `<CopilotKit>` (still exported from `react-core/v2`), only the import source moves; `CopilotKitProvider` also available if you prefer the new name.

### 4.3 Backend — **NO CHANGE**
- `src/app/api/copilotkit/[[...path]]/route.ts` stays as-is.
- `getLocalAgentsWithLogging` / `LoggingMastraAgent` / `ai_runs` hook **survive** — this protects the audit's one observability signal.
- `@copilotkit/runtime@1.55.2` unchanged.

### 4.4 Update guardrails
- CLAUDE.md hard rule "v1 imports only" → rewrite to "v2 imports only (`@copilotkit/react-core/v2`)".
- `copilotkit-check` skill + any hook enforcing v1 → flip to enforce v2 (no mixing).
- LESSONS.md v1/v2-mixing entry → mark resolved.

---

## 5. Changes needed — Path B (full standalone v2, Phase 2 only)

> **Verified 2026-06-05:** `@copilotkit/react` and `@copilotkit/core` are **not installed** — Path B is **not available today** without adding new package lines. Path B is a genuine Phase-2 effort, not a config flip.

Everything in Path A **plus** a runtime rewrite — **do not attempt until gated items clear**:

| Change | Risk |
|---|---|
| `@copilotkit/react` + `@copilotkit/core` deps (new) | Med |
| Route: `copilotRuntimeNextJSAppRouterEndpoint` → `createCopilotEndpoint` (Hono) | **High** |
| **Re-wire `ai_runs` logging** to the new endpoint/agent classes | **High — this is the audit's only observability** |
| Confirm `@ag-ui/mastra` exposes a **v2-compatible** MastraAgent (not just `./copilotkit` v1 bridge) | **Hard gate** |
| Re-verify auth gate (`assertCopilotKitAuthorized`), catch-all GET/POST, `RequestContext`/`resourceId` threading | Med |
| `<CopilotKit>` → `<CopilotKitProvider>` | Low |

**Path B is the one CLAUDE.md means by "when Mastra ships on v2."** Until `@ag-ui/mastra` confirms standalone-v2 support, Path B is blocked.

---

## 6. Gate checklist (before any v2 work)

- [ ] **Do the Mastra P0s first** — hallucination scorer + telemetry exporter. v2 doesn't touch them; doing v2 first delays the things that actually move the grade.
- [ ] Confirm via MCP/npm the **exact** v2 package + hook names (migration guide says `@copilotkit/react-core/v2`; develop skill says `@copilotkit/react` — version drift; **verify before coding**).
- [ ] Confirm `@ag-ui/mastra` v2 support (Path B gate).
- [ ] Branch + feature-flag the migration; **all 445+ Vitest + Playwright e2e green** before/after.
- [ ] Re-prove `ai_runs` logging still fires on a real turn (especially Path B).
- [ ] Re-prove Roberto HITL (`useInterrupt`) and Camila `focusMapPin` (`useFrontendTool`) end-to-end.

---

## 7. Final verdict (brutally honest)

1. **Will upgrading to v2 improve the audit?** **No, not meaningfully.** It closes 0 of 2 P0s and 0 of the 5 substantive P1s — every one of those is Mastra-side. The grade stays **B−** after a v2 migration unless you *also* do the Mastra work.

2. **So why do it at all?** Engineering hygiene: it **permanently removes the v1/v2-mixing footgun** (a recurring LESSONS.md risk), cleans up HITL/tools/shared-state, likely retires the POST-storm workaround, and unlocks headless UI. Real value — just not *audit* value.

3. **Which path?** **Path A** (`@copilotkit/react-core/v2` subpath — the guide you linked). No version bump, backend untouched, `ai_runs` preserved, ~24 frontend files. **Avoid Path B** until `@ag-ui/mastra` ships standalone-v2.

4. **When?** **Phase 2.** Sequence: (1) Mastra P0s (scorer + tracing) → these move the grade. (2) Path A v2 as a contained frontend modernization. (3) Path B only when the `@ag-ui/mastra` gate clears.

5. **What NOT to do:** Don't migrate to v2 hoping it fixes production readiness. Don't do Path B now (it can *regress* your only observability signal). Don't mix v1 and v2 imports mid-migration (the exact footgun v2 is supposed to end).

6. **What a top-1% architect would say:** "v2 is a frontend refactor mislabeled in your head as a fix. Your launch risk is unmeasured AI quality and zero traces — neither has anything to do with CopilotKit's version. Ship the scorer and the exporter first; do the clean Path-A swap in Phase 2 when it's a calm, well-tested refactor, not a launch-blocking gamble."

---

### Appendix — evidence

| Claim | Source |
|---|---|
| `react-core@1.55.2` ships `./v2` subpath | `node_modules/@copilotkit/react-core/package.json` exports |
| `@copilotkit/react-core/v2` resolves | `require.resolve(...)` → `dist/v2/index.cjs` |
| v2 entry exports `useAgent/useFrontendTool/useRenderTool/useComponent/useHumanInTheLoop/useInterrupt/useAgentContext/CopilotKit/CopilotKitProvider/CopilotSidebar` | enumerated `dist/v2/index.mjs` export list |
| v1 hooks (`useCoAgent/useCopilotAction/useCopilotReadable/renderAndWaitForResponse`) **absent** from v2 entry | enumerated `dist/v2/index.mjs` (no-mix enforced) |
| `@copilotkit/react` (Path B) **not installed** | `ls node_modules/@copilotkit/react` → not found |
| `@ag-ui/mastra@0.2.1-beta.2` exports `./copilotkit` | `node_modules/@ag-ui/mastra/package.json` |
| Runtime pinned `@copilotkit/runtime@1.55.2` | `mdeapp/package.json` |
| 24 files touch v1 hooks; HITL in host bridge | `grep useCopilotAction\|useCoAgent\|renderAndWaitForResponse src/**` |
| Path A = frontend-only, backend compatible | migrate-to-v2 guide ("no backend migration required") |
| Path B runtime = `createCopilotEndpoint` | `copilotkit-develop` SKILL.md |
| v1→v2 hook mapping | `copilotkit-integrations/.../mastra.md` v2 table + develop skill |
| Audit findings are Mastra-side | `./june5-mastra-audit.md` §5–§8 |
