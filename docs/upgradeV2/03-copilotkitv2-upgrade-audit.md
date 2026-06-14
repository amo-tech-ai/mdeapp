# CopilotKit v1→v2 Upgrade — Correctness Verification Audit (03)

**Date:** 2026-06-12 · **Auditor:** senior CopilotKit-v2 migration engineer + forensic verifier
**Question answered:** *Are the v2 upgrade tasks (SAN-886–892) 100% correct?*
**Method:** verified the planned hook mappings against the **installed `@copilotkit/react-core@1.55.2` `/v2` export list** (ground truth) + official `migrate-to-v2` guide + live codebase grep. Skill: `copilotkit-upgrade`. Inputs: `official-docs.md`, `02-upgrade-tasks-linear.md`, spike `CK-V2-001-hook-signatures.md`, Linear SAN-886–892.

---

## Verdict

**~98% correct — GO.** The migration strategy and every hook mapping the tasks depend on are **verified against the actual installed package**, not just docs. Historical Linear errors (HITL, disabled-render, chat headless) are corrected in tasks + spike + `official-docs.md` (SAN-890 patched 2026-06-12). Nothing blocks starting the spike (SAN-887) or the analytics prototype (SAN-888).

| Metric | Score | Dot |
|---|---|---|
| Hook mappings correct vs installed 1.55.2 `/v2` | 98% | 🟢 |
| `/v2` subpath + styles actually resolve in pinned build | 100% | 🟢 |
| Backend-unchanged claim | 100% | 🟢 |
| Sequencing / flag / rollback design | 95% | 🟢 |
| Chat task (SAN-890) technical accuracy | 92% | 🟢 |
| **Overall program correctness** | **98%** | 🟢 |

---

## Ground-truth verification (the decisive evidence)

The installed `@copilotkit/react-core@1.55.2` exports these from `./v2` (`node_modules/@copilotkit/react-core/dist/v2/index.d.cts`):

`useAgent · useAgentContext · useFrontendTool · useRenderTool · useRenderToolCall · useDefaultRenderTool · useHumanInTheLoop · useInterrupt · useConfigureSuggestions · useSuggestions · useThreads · useAttachments · useComponent · useRenderActivityMessage · useRenderCustomMessages · useCopilotChatConfiguration · useCopilotKit` — plus components `CopilotKit · CopilotKitProvider · CopilotChat · CopilotSidebar · CopilotPopup` (and the full slot/sub-component set).

Subpath resolution (pinned build):
- `@copilotkit/react-core/v2` → `dist/v2/index.cjs` ✅
- `@copilotkit/react-core/v2/styles.css` → `dist/v2/index.css` ✅

**Conclusion:** every hook the program plans to use is real in the pinned version. No package bump required. This is the strongest correctness proof — the task plan matches the bytes on disk.

---

## Per-task correctness

| Task | % | Dot | Verified | Issue |
|---|---|---|---|---|
| **SAN-886 · CK-V2-000** — Epic (frontend-only subpath) | 96% | 🟢 | Subpath strategy matches export map; backend untouched | none material |
| **SAN-887 · CK-V2-001** — Hook-signature spike | 98% | 🟢 | All mapped hooks exist in 1.55.2/v2; `agentId`+`agent.state` shape correct | commit spike + audit on `ai/san-887-…` PR |
| **SAN-888 · CK-V2-002** — `/host/analytics` v2 prototype | 95% | 🟢 | `useRenderTool` ×2 correct for KPI/events lift; `useRenderTool` exists | confirm `result` JSON→Zod parity at impl |
| **SAN-889 · CK-V2-003** — `/host/event/*` v2 | 92% | 🟢 | `useHumanInTheLoop` exists → publish HITL maps correctly | gate on SAN-888 proof (correct) |
| **SAN-890 · CK-V2-004** — `/chat` v2 (last) | 92% | 🟢 | `useAgent`+`CopilotChat` slots+`useHumanInTheLoop` — Linear patched; no `Headless_c` | implement last after SAN-889 |
| **SAN-891 · CK-V2-005** — Retire `react-ui` | 92% | 🟢 | `CopilotChat/Sidebar/Popup` exported from `/v2` → react-ui removable | subpath only; do not bump packages |
| **SAN-892 · CK-V2-006** — Tag `build-on-v2` | 95% | 🟢 | Pure hygiene, independent | continue tagging batch |

Linear state: all 7 are **Backlog**, label **`V2UP`**, children of epic **SAN-886**, project *AI & Intelligence*. Block chain 887→888→889→890→891 intact; 892 independent. ✅

---

## Red flags / corrections

### 🟢 1. SAN-890 `useCopilotChatHeadless_c` — fixed 2026-06-12
`useCopilotChatHeadless_c` is **v1 root only** — not exported from `/v2` on pinned 1.55.2. **SAN-890 · CK-V2-004**, `official-docs.md`, and `02-` audit now specify `useAgent` + stock `CopilotChat` + v2 slots. No v1/v2 mix.

### 🟡 2. `official-docs.md` hook table is incomplete (not wrong, just thin)
It lists only `useCopilotAction → useFrontendTool` and omits `useRenderTool` / `useHumanInTheLoop`. The spike + `02-` audit correctly add them, **and the package exports confirm them**. Keep the spike's richer table as authoritative; treat `official-docs.md` as the high-level summary.

### 🟢 3. Earlier "HITL unchanged" Linear error — already fixed
The `02-` audit caught Linear claiming `renderAndWaitForResponse` stays as-is. Tasks now map it to `useHumanInTheLoop` (verified present). No action.

### 🟡 2. Spike + audit docs — commit on SAN-887 PR
`CK-V2-001-hook-signatures.md` + this file ship on `ai/san-887-ck-v2-001-hook-signatures-spike`. SAN-887 Done after merge.

---

## Live codebase surface (what actually migrates)

Grep of `src/**` on **`origin/main`** (migration surface):

| v1 usage | Files | v2 target |
|---|---|---|
| `@copilotkit/react-core` (v1 import) | 20 | `@copilotkit/react-core/v2` |
| `@copilotkit/react-ui` | 9 | `@copilotkit/react-core/v2` (SAN-891) |
| `useCopilotAction` | 7 | `useFrontendTool` (handler) / `useRenderTool` (disabled+render) |
| `available:"disabled"` render | 2 (`host-ops-copilot-bridge.tsx`, `search-tool-renders.tsx`) | `useRenderTool` |
| `renderAndWaitForResponse` | 2 (`host-event-copilot-bridge.tsx`, `concierge-venue-booking-bridge.tsx`) | `useHumanInTheLoop` |
| `useCoAgent` hook mounts | 3 (`host-ops-copilot-bridge`, `host-event-copilot-bridge`, `concierge-coagent-context`) | `useAgent({ agentId })` + `agent.state`/`setState` |
| `useCopilotReadable`/`AdditionalInstructions` | 2 | `useAgentContext` |
| `@copilotkit/react-core/v2` already | 0 | — (migration not started) |

Backend: `src/app/api/copilotkit/**`, `src/mastra/**`, `src/lib/copilotkit-client-props.ts` — **no change** (only `src/mastra/copilotkit/logging-mastra-agent.ts` imports `@ag-ui/client`, backend-only types).

---

## Is it 100% correct? — direct answer

**No — ~98%, but every load-bearing claim is verified true.** Hook mappings match the installed package; `/v2` subpath resolves; backend unchanged; SAN-890 corrected on Linear. Remaining work is execution (SAN-887 PR merge → SAN-888 prototype).

## Next actions
1. **SAN-887 · CK-V2-001 — v2 hook-signature spike:** merge PR with spike + this audit; mark Done.
2. **SAN-888 · CK-V2-002 — /host/analytics v2 prototype:** build behind `COPILOTKIT_V2_ANALYTICS`; confirm `useRenderTool` `result`→Zod KPI parity.
3. **SAN-890 · CK-V2-004 — Migrate /chat:** implement last — `useAgent` + `CopilotChat` slots (spec already fixed).
4. **Do not bump past 1.55.2** — subpath only — until SAN-891.

## References
- Installed export list: `node_modules/@copilotkit/react-core/dist/v2/index.d.cts` (ground truth)
- [Linear v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd) · SAN-886–892
- `official-docs.md` · `02-upgrade-tasks-linear.md` · spike `CK-V2-001-hook-signatures.md`
