# CopilotKit v2 upgrade — review for mdeapp

**Source:** [Migrate to V2](https://docs.showcase.copilotkit.ai/built-in-agent/troubleshooting/migrate-to-v2) (official frontend migration guide)

**Plain English:** v2 is mainly a **frontend package cleanup** — one import path for chat UI + hooks. Your **Mastra backend route** (`/api/copilotkit`) stays the same shape. mdeapp is **not ready to flip today** because Phase 1 is pinned on **1.55.2 v1 APIs** and Discovery Beta is mid-soak.

---

## Current setup (examined 2026-06-04)

| Item | What we have today |
|------|---------------------|
| **Pinned version** | `@copilotkit/react-core`, `react-ui`, `runtime` → **1.55.2** |
| **AG-UI bridge** | `@ag-ui/client@0.0.52`, `@ag-ui/mastra@beta` |
| **Runtime pattern** | **Pattern 1 in-process** — `CopilotRuntime` + `getLocalAgentsWithLogging(mastra)` in `src/app/api/copilotkit/[[...path]]/route.ts` |
| **Client routing** | Same-origin only — `runtimeUrl="/api/copilotkit"` (no CopilotKit Cloud key; see comment in `copilotkit-client-props.ts`) |
| **Agents exposed** | `conciergeAgent` (home/chat), `hostEventAgent` (host wizard) |
| **v2 export on disk** | **None** — `node_modules/@copilotkit/react-core/v2` does not exist at **1.55.2** → upgrade requires **newer `@copilotkit/*` version**, not import-path change alone |

### Where CopilotKit lives in `mdeapp/src` (~20 production files)

| Area | Files / pattern |
|------|-----------------|
| **Root provider** | `copilot-kit-provider.tsx` — `<CopilotKit>` + `threadId` + `onError` |
| **Second mount** | `app/host/event/layout.tsx` — separate `<CopilotKit>` for `hostEventAgent` |
| **Shared state** | `concierge-coagent-context.tsx` — single `useCoAgent` (POST storm guard) |
| **Host wizard** | `host-event-copilot-bridge.tsx` — `useCoAgent` + `useCopilotReadable` + `useCopilotAction` + **`renderAndWaitForResponse`** HITL |
| **Generative UI tools** | `search-tool-renders.tsx` — many `useCopilotAction({ available: "disabled", render })` mirroring Mastra tools |
| **Custom headless chat** | `concierge-chat-messages.tsx`, `concierge-chat-input.tsx` — **`useCopilotChatInternal`**, **`runtime-client-gql`** (`TextMessage`, `MessageRole`) |
| **UI shell** | `chat-center-panel.tsx`, `host-event-shell.tsx` — `<CopilotChat>` from `react-ui` |
| **Styles** | `app/layout.tsx` — `@copilotkit/react-ui/styles.css` |
| **Other hooks** | `useCopilotChat`, `useCopilotAdditionalInstructions`, `useCopilotContext`, `useDefaultTool`, `useCopilotAction` (map pin, citations) |
| **Tests / guards** | `copilotkit-client-props.test.ts`, `copilotkit-request-budget.spec.ts`, `agent-registration.test.ts`, `mastra-tool-action-names.test.ts` |

### Hard rules already in repo

- **CLAUDE.md:** Phase 1 = **1.55.2 v1 only** — migrate v2 in **Phase 2** when Mastra ships on v2.
- **LESSONS.md:** Never mix v1/v2 imports (caused POST storms + wrong docs).
- **UX-001 lesson:** CopilotKit Cloud / v2 runtime **timed out** vs in-process Mastra — must keep same-origin Pattern 1.

---

## What the official v2 guide changes (frontend only)

From [Migrate to V2](https://docs.showcase.copilotkit.ai/built-in-agent/troubleshooting/migrate-to-v2):

| Before (v1 — us today) | After (v2) |
|--------------------------|------------|
| `@copilotkit/react-core` | `@copilotkit/react-core/v2` |
| `@copilotkit/react-ui` | **Merged into** `@copilotkit/react-core/v2` |
| `@copilotkit/react-ui/styles.css` | `@copilotkit/react-core/v2/styles.css` |
| `<CopilotKit>` | `<CopilotKitProvider>` |
| `@copilotkit/runtime` (backend) | **No change required** (per guide) |
| `CopilotRuntime` config | **No change required** (per guide) |

Optional: bump `@ag-ui/client@latest` if imported directly (we use `0.0.52` today).

**Important:** The public guide is a **minimal** migration (provider + UI imports). mdeapp also needs a **hook-by-hook** map — see below.

---

## v1 → v2 hook map (mdeapp-specific)

From `.agents/skills/copilotkit-integrations/references/integrations/mastra.md` + our usage:

| v1 (1.55.2 — current) | v2 (target) | mdeapp touch surfaces |
|------------------------|-------------|------------------------|
| `<CopilotKit>` | `<CopilotKitProvider>` | `copilot-kit-provider.tsx`, `host/event/layout.tsx` |
| `useCoAgent` | `useAgent` | Concierge state, host draft, fast-path panels |
| `useCopilotAction` (handler) | `useFrontendTool` | `focus-map-pin-action`, host wizard tools |
| `useCopilotAction` (render only) | `useRenderTool` / `useComponent` | `search-tool-renders.tsx` (~700 lines) |
| `renderAndWaitForResponse` | `useHumanInTheLoop` (v2 pattern) | `host-event-copilot-bridge` publish approval |
| `useCopilotReadable` | v2 context / agent state pattern | Host draft readable |
| `useCopilotChat` / `useCopilotChatInternal` | v2 chat hooks (verify in upgrade skill) | Custom chat composer + messages |
| `MessageRole`, `TextMessage` from `runtime-client-gql` | **Verify** — may move under v2 AG-UI client | `concierge-chat-input`, `chat-query-bar`, café panel |
| `useCopilotAdditionalInstructions` | v2 equivalent (verify) | `chat-filter-copilot-instructions.tsx` |
| `useDefaultTool` | v2 tool render API | `event-web-citation-sync.tsx` |
| `useCopilotContext` + `onError` | v2 error/inspector API | `concierge-agent-error-bridge.tsx` |
| `CopilotChat`, `AssistantMessage`, `UserMessage` | Same names from `/v2` | Chat shells + message overrides |

**Invariants that must not break:**

1. `useAgent({ name })` / `useCoAgent({ name })` **must match** Mastra registry key (`conciergeAgent`, `hostEventAgent`).
2. Frontend tool/action **names must match** Mastra tool ids (`mastra-tool-action-names.ts` + hook tests).
3. **Single** concierge `useCoAgent` mount (avoid duplicate sync POSTs).
4. Stable `headers` / `properties` objects on provider (see `copilotkit-client-props.ts`).

---

## Benefits of upgrading to v2

| Benefit | Why it matters for mdeai |
|---------|-------------------------|
| **One frontend package** | Fewer version skew bugs between `react-core` and `react-ui` |
| **Docs + skills align** | Public CopilotKit docs and MCP default to v2 — less “wrong API” risk for agents |
| **Cleaner agent API** | `useAgent` replaces `useCoAgent` + some readable/action split |
| **Modern generative UI** | `useRenderTool`, `useHumanInTheLoop`, A2UI path for richer cards |
| **Headless UI (licensed)** | Full custom chat without fighting `CopilotChat` internals — if we want Mindtrip-grade UI later |
| **Future features** | Built-in agent, MCP apps, threads — on CopilotKit roadmap |
| **Backend unchanged (claimed)** | Mastra + AG-UI route can stay Pattern 1 — lower backend risk *if* `@ag-ui/mastra` supports target version |

---

## Costs, risks, and blockers

| Risk | Detail |
|------|--------|
| **Phase timing** | Discovery Beta soak (SAN-462), ADK prod, booking HITL — **do not migrate mid-gate** |
| **Large diff** | ~20 `src` files + e2e + vitest mocks; `search-tool-renders.tsx` alone is high blast radius |
| **Custom chat stack** | We bypass stock `CopilotChat` in places via `useCopilotChatInternal` + GQL message types — **highest migration risk** |
| **HITL** | Roberto publish + future VEN-019 booking approval depend on `renderAndWaitForResponse` |
| **POST budget** | `e2e/copilotkit-request-budget.spec.ts` — must re-baseline after provider/hook changes |
| **Package bump** | Need target `@copilotkit/*` version that ships `/v2` **and** works with `@ag-ui/mastra@beta` — **verify before branch** |
| **Mixed imports** | One v2 file in a v1 app = subtle runtime bugs (LESSONS hook) |
| **Cloud runtime trap** | Must **keep** same-origin `/api/copilotkit` — do not enable Cloud v2 runtime without Mastra bridge |

---

## What is needed to upgrade (checklist)

### 0 — Gate (before any code)

- [ ] Discovery Beta exit: SAN-462 **3/3**, MAP-002B, venues stop — see [`notes-2-progress.md`](notes-2-progress.md)
- [ ] Create Linear issue (e.g. CKV-030) + ledger row; branch `ai/san-NNN-copilotkit-v2-migration`
- [ ] Pick target version: `@copilotkit/react-core`, `runtime` **same semver** (likely **≥1.56** with `/v2` export — confirm via npm + CopilotKit MCP)
- [ ] Verify `@ag-ui/mastra` + Mastra beta compatibility at that version (smoke `/api/copilotkit` + one tool render)

### 1 — Package + styles (mechanical)

- [ ] Bump `@copilotkit/react-core`, `@copilotkit/runtime` to target version
- [ ] Remove or stop importing `@copilotkit/react-ui` (merged into v2)
- [ ] `layout.tsx`: `@copilotkit/react-core/v2/styles.css`
- [ ] Optionally bump `@ag-ui/client@latest` if still direct-imported

### 2 — Provider layer

- [ ] `CopilotKit` → `CopilotKitProvider` in both mounts
- [ ] Port `getCopilotKitClientProps` props to v2 provider API (verify `useSingleEndpoint`, `threadId`, `onError` names)
- [ ] Keep **same-origin** `runtimeUrl="/api/copilotkit"` — no Cloud key

### 3 — Hooks (by priority)

1. **Low risk:** `CopilotChat`, `AssistantMessage`, `UserMessage` imports → `/v2`
2. **Medium:** `useCoAgent` → `useAgent` (concierge + host)
3. **Medium:** `useCopilotAction` handlers → `useFrontendTool`
4. **High:** `search-tool-renders.tsx` → `useRenderTool` / disabled render pattern
5. **High:** `renderAndWaitForResponse` → `useHumanInTheLoop` (host + future VEN-019)
6. **Highest:** `useCopilotChatInternal` + `runtime-client-gql` custom chat — read `copilotkit-upgrade` skill + upstream example; consider **keeping** `CopilotChat` v2 shell instead of porting internals

### 4 — Backend (expect minimal)

- [ ] Re-run `npm run check:mastra` + agent name tests
- [ ] Confirm `CopilotRuntime` + `ExperimentalEmptyAdapter` unchanged unless release notes say otherwise
- [ ] No service-role or Cloud runtime switch

### 5 — Verification (production-ready)

| Step | Command / proof |
|------|-----------------|
| Unit | `npm test -- --run` (include `copilotkit-client-props`, `agent-registration`, `mastra-tool-action-names`) |
| Floor | `npm run floor` |
| POST budget | `npm run test:e2e:copilot-budget` |
| Concierge | `npm run test:e2e:concierge-run-error` + prod synthetic 4-query |
| Host wizard | Manual Roberto flow + HITL publish panel |
| Tool cards | Rental / event / café / restaurant tool renders in chat |
| Dev boot | `npm run dev` — `/` + `/chat` + `/host/event/new` HTTP 200 |

Evidence folder: `tasks/testing/evidence/YYYY-MM-DD/copilotkit-v2-migration.md`

---

## Recommended timing

| When | Action |
|------|--------|
| **Now (Phase 1 / Discovery Beta)** | **Stay on 1.55.2 v1.** Use v1 mapping table when reading v2 docs. |
| **After Beta stop** | Spike branch: bump packages + provider + one `useAgent` surface only |
| **Phase 2 slice 1** | Provider + `useAgent` + tool renders |
| **Phase 2 slice 2** | Custom chat internals OR replace with v2 headless/CopilotChat |
| **Phase 2 slice 3** | HITL migration + full e2e + prod smoke |

**Do not** load upstream [CopilotKit/skills](https://github.com/CopilotKit/skills) v2 examples into Phase 1 agents without mapping through [`mastra.md`](../../../.agents/skills/copilotkit-integrations/references/integrations/mastra.md).

---

## Summary table

| Question | Answer |
|----------|--------|
| **Can we only change imports?** | **No** — 1.55.2 has no `/v2`; need package upgrade + hook migrations |
| **Does backend change?** | **Officially no** — our Mastra route likely stays; still verify AG-UI compat |
| **Biggest mdeapp risk?** | Custom chat (`useCopilotChatInternal` + GQL messages) + `search-tool-renders.tsx` |
| **Biggest benefit?** | Aligned APIs, single package, easier generative UI + HITL going forward |
| **Ship now?** | **No** — conflicts with Phase 1 pin + active soak gates |

---

*Refs: [`CLAUDE.md`](../../../CLAUDE.md) · [`LESSONS.md`](../../../docs/LESSONS.md) · [`tasks/copilotkit/copilotkit-skills.md`](../../copilotkit/copilotkit-skills.md) · [`tasks/venues/docs/13-copilotkit-venues-routing.md`](../../venues/docs/13-copilotkit-venues-routing.md) (CKV-030 Phase 2)*
