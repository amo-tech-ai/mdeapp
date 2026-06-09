# PR #14 — Skills compliance audit (CopilotKit + release tags)

**Date:** 2026-05-30  
**PR:** https://github.com/amo-tech-ai/mdeapp/pull/14  
**Skills scanned:** `.claude/skills/` → `.agents/skills/` (`copilotkit`, `copilotkit-develop`, `copilotkit-integrations`, `mastra`, `testing`, `mde-worktree-pr-flow`, `mde-task-lifecycle`, `mde-maps`)  
**Cross-check:** [audit-1.md](./audit-1.md) (15-test forensic pass)

---

## Executive verdict

| Area | Compliance | Score |
|------|------------|------:|
| **PR A runtime (`8fa5f10`) vs CopilotKit/Mastra skills** | **Pass** (with follow-ups) | **88%** |
| **PR B café vs mde-maps / testing** | **Pass** (e2e now green; CI pending) | **85%** |
| **PR #14 combined vs skills** | **Fail** (scope + host debt) | **55%** |
| **Split plan (`may29/`) vs skills** | **Pass** | **90%** |

**Conclusion:** Split plan aligns with skills. **Do not merge #14 as-is.** Land PR A first; PR B after. Café e2e is **green on a fresh server** (5/5) — the only remaining open P0 is the **floor CI workflow** (land with PR A).

---

## CopilotKit / Mastra / AG-UI (PR A — `8fa5f10`)

| Skill rule | Source | Disk / PR A | Verdict |
|------------|--------|-------------|---------|
| Pattern 1 in-process only | `copilotkit-integrations` mastra.md | `MastraAgent.getLocalAgents`, `/api/copilotkit` | ✅ |
| CopilotKit **1.55.2**, v1 hooks only | mastra.md, CLAUDE.md | `useCoAgent`, `useCopilotAction`, no v2 imports | ✅ |
| `useCopilotAction({ available: "disabled", render })` for Mastra tools | mastra.md F49 | Module-level `*ToolRender` + `useDisabledToolRender` | ✅ **fixes render-deps loop** |
| Tool `name` === Mastra `createTool({ id })` | mastra.md | `MASTRA_TOOL_IDS` / `MASTRA_COPILOT_TOOL_ACTIONS` | ✅ |
| Same-origin `runtimeUrl` (no Cloud key in prod) | mastra.md, UX-001 | `getCopilotKitClientProps` → `/api/copilotkit` | ✅ (main #13 + PR A `useSingleEndpoint`) |
| `useSingleEndpoint: true` | PR A + anti-spam audit | `copilotkit-client-props.ts` | ✅ **required** — do not drop on merge |
| Catch-all GET+POST on runtime route | PR A | `[[...path]]/route.ts` exports GET+POST | ✅ |
| `showDevConsole: false` | mastra / UX | client props | ✅ |
| Stable `useCopilotAction` for frontend tools | copilotkit-debug agent-debugging | `focus-map-pin-action.tsx` ref-stable | ✅ |
| MCP verify before API drift | copilotkit SKILL | Not re-run this pass | ⚠️ optional for PR A review |
| Nested `<CopilotKit>` per tree | UX audit 02, **not** in #14 | Still on `main` + host layout | ❌ **out of PR A** — separate task after A |

### Skill gaps PR A does **not** close (document as follow-ups)

| Item | Skill | Track in |
|------|-------|----------|
| Host nested providers | provider-architecture, route-groups | `tasks/ux/audit/02-copilotkit-next-steps.md` |
| `host-event-copilot-bridge` inline HITL handlers | copilotkit-integrations (stable actions) | Post–provider-split |
| Hydration in `concierge-chat-messages.tsx` | hydration-debugging | UX P1, not PR A |

---

## Café / Maps / Testing (PR B)

| Tag / skill | Rule | PR B | Verdict |
|-------------|------|------|---------|
| **google-places-api** / mde-maps | Field masks on Places New | **`mastra/lib/google-places-client`** (`getPlaceDetails`→`X-Goog-FieldMask`; `validatePlacesFieldMask` rejects `["*"]`). `place-details.ts`/`/api/places/detail` only normalize + delegate — verify the **client** | ✅ |
| **maps-grounding** | ADK grounding + map pins | `search-grounded-places.ts`, tool render | ✅ |
| **B1 attribution** | Join by `placeUri` ↔ `mapsUrl` after filter | Present in `76abde1` (inline, not exported helper) | ✅ |
| **testing** | Floor before ship | 313/313 vitest, floor green | ✅ |
| **playwright-testing** | SCREEN-021 + maps-grounding | **5/5 chromium PASS** on fresh `:3001` (2026-05-30): grounding 1/1 + SCREEN-021 4/4, exit 0. Prior "5/5 fail" = stale-server false negative (reuseExistingServer:true) | ✅ |
| **production-readiness** | Preview smoke | Vercel 401 = deployment protection, not build fail | ⚠️ localhost fallback |
| Booking stub honesty | product | "No request is sent yet" in sheet | ✅ |

---

## Cross-cutting tags

| Tag | PR #14 / plan | Notes |
|-----|---------------|-------|
| **nextjs-app-router** | Catch-all route, `layout.tsx` Script in `<head>` | ✅ PR A |
| **react-performance** | Stable tool renders stop render storms | ✅ PR A |
| **typescript-strict** | `tsc` exit 0 | ✅ |
| **runtime-stability** | 60s idle POST delta 0 (prior session) | ✅ **re-verified 2026-05-30** — fresh `:3001` `GET /` 200, `POST /api/copilotkit` mounts (route present, not stale-404) |
| **provider-architecture** | 6 contexts on `/`; nested CK on host | ❌ not in split |
| **route-groups** | Recommended in UX-02; not in #14 | Follow-up after PR A |
| **vercel-deployment** | Preview Ready; access 401 | Use bypass or localhost |
| **release-management** | Split A→B→close #14 | ✅ plan |
| **git-cherry-pick** / **pr-splitting** | `8fa5f10` atomic; PR-B order documented | ✅ |
| **git-worktree** | audit-1 dry-run used worktree | ✅ |
| **forensic-audit** | audit-1 + this doc | ✅ |
| **mde-task-lifecycle** | C-012 + UX-COPILOT-RUNTIME-001 | Link ledger rows |

---

## PR #14 vs skills — red flags

| Severity | Finding | Skill violated | Fix |
|----------|---------|----------------|-----|
| **P0** | Mixed runtime + café in one PR | release-management, pr-splitting | Split (may29 plan) |
| **P0** | `mergeable: CONFLICTING` | — | PR A onto clean `main` |
| **P0** | No `.github/workflows/` floor CI | testing, production-readiness | Add workflow (audit-1 C3) |
| ~~P1~~ ✅ | E2E café flow ~~unproven~~ **proven green** (5/5 fresh `:3001`, 2026-05-30) | testing, playwright-testing | resolved — keep fresh-server step 0 in PR-B runbook |
| **P1** | `copilotkit-develop` describes **v2** APIs; mdeapp is **v1.55.2** | copilotkit-develop | Route to `copilotkit-integrations` mastra.md mapping table |
| **P2** | `copilotkit-debug` not in `.claude/skills/` scan root | copilotkit router | Symlink or invoke via `.agents/skills/` |
| **P2** | Host HITL unstable handlers | copilotkit-integrations | After provider split |

---

## Is [audit-1.md](./audit-1.md) correct?

**Overall: yes — 92% plan correctness stands** after this re-check.

| audit-1 claim | Re-verified (2026-05-30) | Status |
|---------------|---------------------------|--------|
| Split decision correct | PR still CONFLICTING, mixed scope | ✅ |
| `8fa5f10` = 8 files | `git show 8fa5f10 --stat` | ✅ |
| Skip `b8d9f92` (dup #13) | `9956277` on main | ✅ |
| Skip `991db97` | Removed in `76abde1` | ✅ |
| B1 in `76abde1` | inline `placeUri` join in file | ✅ |
| 313/313 tests | `npm test` now | ✅ |
| No CI | `.github` absent | ✅ |
| restore-wip not “hardcoded” | dynamic `ROOT` | ✅ **C1 correction valid** |
| HEAD `8c99ded` on branch | **`origin/feat/c012` = `8fa5f10` only** | ⚠️ **C7:** merge commit local-only unless pushed |
| E2E unproven | **5/5 chromium PASS on fresh server** (2026-05-30) | ✅ **C6 resolved** — prior fail was stale-server |
| Live POST info 404 | Stale dev server — **confirmed**; fresh `:3001` mounts route | ✅ resolved |

**Apply audit-1 corrections C1–C6 to all may29 task docs** (done in INDEX + runbooks below).

---

## Recommended doc / task updates

1. **INDEX.md** — link this file + note audit-1 verified. ✅ done.
2. **PR-14-SPLIT-FORENSIC-AUDIT.md** — fix B-06 reason (C1), add B-02 CI (C3), 313 tests (C2).
3. **PR-A/B runbooks** — fresh dev boot step 0 (C9) ✅; CI gate (C3) ✅; remote-head note (C7) ✅; worktree cherry-pick (C10) ✅. **PR-B cherry-pick order: verified against git topology — matches, no fix needed (C4 non-issue).**
4. **COMMIT-LEDGER** (optional row): `C-CK-RUNTIME-001` / `C-012-split` — user can add when executing.

---

## Merge order (skills-aligned)

```text
1. Add floor CI workflow (or with PR A)
2. PR A: fix/copilotkit-runtime-stability (cherry-pick 8fa5f10)
3. Merge A → main
4. PR B: feat/cafe-detail-flow (café commits, rebase on main)
5. E2E green + preview smoke → merge B
6. Close #14
7. Next: host route-group split (copilotkit-integrations + UX-02)
```
