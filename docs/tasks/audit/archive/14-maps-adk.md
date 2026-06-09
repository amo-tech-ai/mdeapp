---
id: audit-13
title: Maps + ADK task system audit (corrected)
date: 2026-05-20
auditor: task-verifier
scope: tasks/maps/INDEX.md · MAP-001–012 · MAP-002D · MAP-013 · F48–F50
canonical: plan/ADK/maps-adk-prd.md
supersedes_notes: tasks/audit/09-maps-audit.md (stale MVP %), 12-adk-maps-audit.md (MAIC historical)
---

# Verification report — 2026-05-20 · maps + ADK

## Summary

| Dimension | Score /100 |
|-----------|----------:|
| Architecture correctness | **94** |
| Task ordering & dependencies | **92** (↑ after INDEX fixes) |
| Google ADK / Maps / Gemini alignment | **91** |
| Security / env hygiene (specs) | **90** |
| Execution clarity | **88** |
| Implementation on disk | **46** |
| **Overall plan correctness** | **92** |
| **Overall execution readiness** | **46** |

**Verdict:** Audit suggestions were **correct**. Doc corrections applied below. **Not 100%** until F49 + MAP-002 + MAP-013 run on disk.

---

## Architecture — ✅ correct

```text
CopilotKit UI → Mastra (product OS) → ADK sidecar → Grounding Lite MCP / Search (stub→002D) / Gemini
→ strict JSON → cards + pins + GroundingAttribution
```

Matches [`tasks/maps/INDEX.md`](../maps/INDEX.md) and [`plan/ADK/maps-adk-prd.md`](../../plan/ADK/maps-adk-prd.md).

---

## Corrections applied (this pass)

| # | Suggestion | Action |
|---|------------|--------|
| 1 | MAP-011 inline grounding client | ✅ Wording → `adk-grounding-client.ts` + ADK `compute_routes` |
| 2 | MAP-004 MCP drift | ✅ Removed MCPClient §; Places-only SDK drift |
| 3 | MAP-005 mega-task | ✅ Core 3 tables; deferred tables → MAP-006/010/012 |
| 4 | MAP-008 before prod | ✅ INDEX step **4b** MVP-hardening; phase updated |
| 5 | MAP-002D Search enable | ✅ New [`MAP-002D-search-grounding-enable.md`](../maps/MAP-002D-search-grounding-enable.md) |
| 6 | MAP-013 env gate | ✅ New [`MAP-013-env-key-verification.md`](../maps/MAP-013-env-key-verification.md) |
| 7 | F50 in INDEX | ✅ Already step 3b (prior pass) |

---

## Per-task status

| Task | Spec OK? | Exec | Blocker |
|------|:--------:|:----:|---------|
| MAP-001 | ✅ | Done | — |
| F48 | ✅ | Done | — |
| F49 | ✅ | In progress | Pin proof |
| F50 | ✅ | Not started | After F49 |
| MAP-013 | ✅ | Not started | **Before MAP-002 smoke** |
| MAP-002 | ✅ | Not started | After F49 |
| MAP-008 | ✅ | Not started | Before Vercel prod |
| MAP-004 | ✅ | Not started | After MAP-002 |
| MAP-005 | ✅ | Not started | Shrunk scope |
| MAP-011 | ✅ | Not started | ADK path fixed |
| MAP-002D | ✅ | Phase 2 | After MAP-002 |

---

## 🔴 Execution blockers (unchanged)

1. **Finish F49** — rental cards → pins (VERIFICATION X2).
2. **MAP-013** — remove `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` from `mdeapp/.env.local`.
3. **MAP-002A/B/C** — `services/adk-grounding/` + Mastra bridge + attribution.

---

## 🟡 Remaining warnings

| Item | Note |
|------|------|
| Playwright X1–X5 | Deferred until wired — checklist honest |
| `places-mask-checklist.md` | Promote from drafts at MAP-004 start |
| `tasks/audit/09-maps-audit.md` | Historical — use this file |

---

## Stop condition

> **🛑 Not ready to call task system 100%.** Specs are **~92%** and architecture **~94%**.  
> **✅ Safe to execute next:** F49 → MAP-013 → MAP-002 → MAP-004.

### Next steps (execution order)

```text
1. Finish F49 pin/card proof + F49-evidence.md
2. MAP-013 env/key verification (grep + fix .env.local)
3. MAP-002A ADK service (:8000)
4. MAP-002B adk-grounding-client.ts + search-grounded-places tool
5. MAP-002C GroundingAttribution + useCopilotAction
6. MAP-004 Places client + field masks
7. MAP-008 before production Vercel (step 4b)
8. MAP-007 mobile polish (after F50)
```

Phase 2: **MAP-002D** Search grounding. Post-MVP: MAP-005 → 012.

---

*Corrections synced to INDEX, NUMBERING, MAP-004/005/008/011, MAP-002D, MAP-013.*
