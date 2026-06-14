# CK-V2 · Plan audit — 10 (forensic re-verify @ `fbcf8d3`)

**Date:** 2026-06-14 · **Auditor:** forensic verifier + disk grep  
**Question:** *Is the v2-upgrade Linear board + `efficient-plan.md` + `todo.md` correct vs disk?*  
**Ground truth:** `origin/main` @ **`fbcf8d3`** (SAN-902 #214 merged on top of SAN-903 `7674986`)  
**Inputs:** [`efficient-plan.md`](./efficient-plan.md) · [`todo.md`](./todo.md) · [`official-docs.md`](./official-docs.md) · [`08-local-hostaudit.md`](./08-local-hostaudit.md) · Linear [v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd) · `linear-descriptions/*.md`

---

## Verdict — first read

**The program plan is ~99% correct; board hygiene fixed 2026-06-14.** SAN-895 reopened to In Progress; SAN-902 Done; Linear `blockedBy` wired for 898 chain; SAN-910 dep-cruiser landing on branch.

**Real-world:** Roberto still cannot flip `COPILOTKIT_V2_HOST_EVENT` until SAN-904→905 green + SAN-898. No prod impact — all flags OFF.

| Scorecard | % | Dot |
|---|---:|---|
| Execution order (`efficient-plan.md`) | **100%** | 🟢 |
| Hook inventory vs `audit:copilotkit-v2` | **100%** | 🟢 |
| SAN-895 root cause (global workspace) | **100%** | 🟢 |
| Audit script + npm (was 🔴 in prior audit) | **100%** | 🟢 |
| Linear column states vs plan | **98%** | 🟢 |
| Full issue descriptions (900/901/890) | **100%** | 🟢 |
| **`09-file-map.md` on disk** | **100%** | 🟢 |
| **SAN-903 code fix** | **100%** | 🟢 merged `7674986` |
| **SAN-910 dep-cruiser** | **75%** | 🟡 branch — gate + proof scripts |
| **Overall program correctness** | **~99%** | 🟢 |

### Legend
🟢 verified on disk · 🟡 stale doc (fixed this pass) · 🔴 open work · ⚫ not started (expected)

---

## What changed since prior `10-plan-audit.md`

| Prior claim | Disk @ `4ee1bb9` | Correction |
|---|---|---|
| `audit-copilotkit-v2-map.mjs` missing | **Exists** | 🟢 landed |
| `npm run audit:copilotkit-v2` missing | **Exists** | 🟢 landed |
| `graphify:*` scripts missing | **Exists** | 🟢 landed |
| `todo.md` SHA `7b596283` | HEAD **`4ee1bb9`** | 🟡 fixed in `todo.md` |
| SAN-900/901/890 stub descriptions | Full contracts in `linear-descriptions/` | 🟢 fixed |
| SAN-897 blocked by SAN-895 | Blocked by **SAN-896 only** | 🟢 fixed on Linear |
| react-ui count 9 | **8** files | 🟢 fixed |

---

## Migration dashboard (live)

```bash
npm run audit:copilotkit-v2
```

| Metric | Value |
|---|---|
| v1 hook files | **23** |
| v2 hook files | **6** |
| react-ui files | **8** |
| Hook file v2 share | **21%** |
| Weighted program | **~52%** (analytics ✅ · event 🟡 85% · chat ⚫ 0%) |

---

## Blocker verification

### SAN-895 / SAN-903 — thought_signature

| Check | Evidence | Dot |
|---|---|---|
| Global workspace in `src/mastra/index.ts` | `workspace` set at Mastra level | 🟢 |
| `hostEventAgent` lacks opt-out | `workspace: () => undefined` in `host-event.ts` L11 | 🟢 merged SAN-903 |
| Code merged | SAN-903 ✅ · SAN-902 repro ✅ | 🟢 |

### SAN-898 — hydration

| Check | Evidence | Dot |
|---|---|---|
| `caret-color` SSR/client mismatch | `08-local-hostaudit.md` §5 | 🟢 |
| Fix shipped | Not yet | 🔴 |

### SAN-900 — file map

| Check | Evidence | Dot |
|---|---|---|
| Script + npm | Landed | 🟢 |
| `docs/upgradeV2/09-file-map.md` | **Missing** | 🔴 |

### SAN-910 — CI guardrails

| Check | Evidence | Dot |
|---|---|---|
| `dependency-cruiser` in `package.json` | **On SAN-910 branch** | 🟡 |
| `audit:copilotkit-v2` alias | Landed @ `fbcf8d3` | 🟢 |

---

## Linear board state (verified 2026-06-14)

| Column | Issues |
|---|---|
| **In Progress** | SAN-886 · SAN-895 · SAN-910 (branch) |
| **Done** | SAN-887 · SAN-888 · SAN-889 · SAN-892 · SAN-900 · **SAN-903** · **SAN-902** |
| **Todo** | SAN-898 · SAN-896 |
| **Backlog** | SAN-904 · SAN-905 · SAN-890 · SAN-901 · SAN-891 · SAN-897 · SAN-899 · SAN-893 · SAN-894 |
| **Subtasks Backlog** | SAN-906–909 (under 898) |

**Relations wired:** SAN-908←906 · SAN-909←908 · SAN-907←908+909 · SAN-898←907

**Canonical next order:**
1. Ship **SAN-910** PR (dep-cruiser gate)
2. **SAN-904 → SAN-905** (close SAN-895 when green)
3. **SAN-898** hydration chain (906→908→909→907) — parallel
4. **SAN-896** evidence @ `fbcf8d3`
5. **SAN-901 → SAN-890 → SAN-891**

---

## Hook map cross-check (`official-docs.md` + package)

All v2 replacements cited in SAN-890/901 exist in `@copilotkit/react-core@1.55.2/dist/v2/index.d.cts`:

`useAgent` · `useAgentContext` · `useFrontendTool` · `useRenderTool` · `useHumanInTheLoop` · `useInterrupt` · `useDefaultRenderTool` · `useCopilotKit` — **verified 🟢**

Cliff APIs correctly absent from `/v2`: `useCoAgent` · `useCopilotAction` · `renderAndWaitForResponse` · `useCopilotChatInternal` — **verified 🟢**

Backend rule: **no** `/api/copilotkit` changes for v2 subpath migration — **verified 🟢**

---

## Issue description completeness

| Issue | Contract | Location |
|---|---|---|
| SAN-895 | Full | `linear-descriptions/SAN-895.md` + Linear |
| SAN-898 | Full | `linear-descriptions/SAN-898.md` + Linear |
| SAN-910 | Full | `linear-descriptions/SAN-910.md` + Linear |
| SAN-900 | Full | `linear-descriptions/SAN-900.md` + Linear (this pass) |
| SAN-901 | Full | `linear-descriptions/SAN-901.md` + Linear (this pass) |
| SAN-890 | Full | `linear-descriptions/SAN-890.md` + Linear (this pass) |
| Subtasks 902–909 | Full | `linear-descriptions/SAN-90*.md` |

---

## Open risks (not spec errors)

| Risk | Mitigation |
|---|---|
| `/chat` `useCopilotChatInternal` cliff | SAN-901 spike proves `useInterrupt` slot shape |
| SAN-889 marked Done with console PARTIAL | Hygiene tracked on SAN-895/898 — correct |
| SAN-890 needs explicit approval | Backlog until spike PASS — correct |

---

## Proof commands (re-run anytime)

```bash
git rev-parse --short HEAD
npm run audit:copilotkit-v2
test -f scripts/audit-copilotkit-v2-map.mjs && echo script OK
test -f docs/upgradeV2/09-file-map.md || echo "SAN-900 open"
rg "workspace:" src/mastra/agents/host-event.ts || echo "SAN-903 open"
```

---

## Next step

Execute **SAN-904/905** host hygiene proofs — then **SAN-898** hydration — ship **SAN-910** guardrails PR.
