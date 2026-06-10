---
id: MAP-002E
title: Gemini Maps fallback — production runbook + observability
status: Done
priority: P2
phase: Post-MVP ops
effort: 1-2h
owner: claude
depends_on: [MAP-002]
blocks: []
skill: [mde-maps, mde-supabase]
checklist_ref: ../../maps-checklist.md §1b G4
prd_ref: ../../../plan/ADK/maps-adk-prd.md
parent_task: MAP-002-grounding-attribution.md
related_code:
  - /home/sk/mdeai/services/adk-grounding/gemini_maps_grounding.py
  - /home/sk/mdeai/services/adk-grounding/main.py
  - /home/sk/mdeai/mdeapp/src/mastra/lib/grounding-quota.ts
target_files:
  - /home/sk/mdeai/services/adk-grounding/README.md
  - /home/sk/mdeai/tasks/ADK/docs/14-cloud-run-reference.md
  - /home/sk/mdeai/plan/ADK/sidecar-api-contract.md
playbook_ref:
  guide: ../../grounding-search/docs/00-playbook-guide.md
  primary: ../../grounding-search/docs/01-playbook.md
  sections: [maps_grounding — read only, not prod default]
  not_for: [google_search — see MAP-002D + 02-playbook]
---

# MAP-002E — Gemini Maps fallback runbook

> **Before coding:** [00-playbook-guide.md](../../grounding-search/docs/00-playbook-guide.md) · Grep [01-playbook.md](../../grounding-search/docs/01-playbook.md) `#maps_grounding` for API shape — **production path stays Grounding Lite MCP** per MAP-002; Gemini Maps is fallback only.

## At a glance

**Description:** Production **operations documentation** + light **observability** for when Grounding Lite MCP fails and the sidecar falls back to Gemini `googleMaps` — or fails closed.

**Purpose:** **Patricia** and **Sofía** can debug invoke failures without reading Python source. **Not** a new grounding path — criteria already ship in [**MAP-002 § G4**](./MAP-002-grounding-attribution.md#post-ship-follow-ons-maps-checklist-2026-05-26).

| Who | Effect |
|-----|--------|
| **Patricia** | Knows when fallback is healthy vs MCP misconfigured |
| **Sofía** | Runbook steps for Cloud Run + quota triage |
| **Camila** | Fewer empty search turns when MCP key is referrer-blocked |

> **Distinction:** This is **Gemini Maps** fallback — **not** [**MAP-002D**](./MAP-002D-search-grounding-enable.md) (Google **Search** grounding for web/events).

## Fallback rules (canonical — must match code)

| Condition | Action | `metadata.source` |
|-----------|--------|-------------------|
| MCP **403** / referrer restriction | Retry `search_via_gemini_maps()` | `gemini-maps-grounding` |
| MCP success but **0 pins** | Same Gemini retry | `gemini-maps-grounding` |
| MCP **429** / quota exhausted | **No** silent fallback — return error + quota hint | `grounding-lite` |
| Mastra quota cap (pre-HTTP) | Empty result before ADK call | — |
| Gemini retry fails | Fail-closed empty + `metadata.reason` | — |

**Primary path (always):** Grounding Lite MCP → Places Details enrich (018B) — never replace with Gemini on every turn.

## Deliverables

### 1. Runbook doc

Add **`services/adk-grounding/RUNBOOK.md`** (or section in README) covering:

- Decision flowchart (MCP → fallback → fail-closed)
- Required env vars: `GOOGLE_MAPS_SERVER_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `GEMINI_GROUNDING_MODEL`
- Common failures: referrer key on server, missing Gemini key, MCP 429 vs 403
- Rollback: fix MCP key vs disable fallback (document only — no feature flag required for MVP)
- Link from [`tasks/ADK/docs/14-cloud-run-reference.md`](../ADK/docs/14-cloud-run-reference.md)

### 2. Logging contract

Document + verify sidecar logs on every invoke:

| Field | Example |
|-------|---------|
| `source` | `grounding-lite` \| `gemini-maps-grounding` |
| `reason` | null \| `adk_error` \| `place_url_missing` |
| `tool` | `search_grounded_places` |
| `pin_count` | `5` |
| `duration_ms` | `1234` |

Structured JSON logs preferred (Cloud Logging query examples in runbook).

### 3. Observability (minimal — no new SaaS required)

| Signal | Threshold | Action |
|--------|-----------|--------|
| `source=gemini-maps-grounding` rate | **>10%** of daily invokes | Alert Patricia — likely MCP key misconfiguration |
| `reason=adk_error` spike | **>5%** over 1h | Check MCP quota + Cloud Run errors |
| Zero pins with no reason | Any sustained | Review query + locationBias |

**Optional:** Supabase view on `grounding_quota_log` grouped by day — document SQL in runbook; implementation only if table already has `source` column (add migration if missing — smallest change).

### 4. Sidecar contract update

Add `metadata.source` + fallback note to [`plan/ADK/sidecar-api-contract.md`](../../../plan/ADK/sidecar-api-contract.md).

## Acceptance criteria

1. Runbook exists; Patricia can triage a failed invoke in <10 min using doc alone.
2. Fallback rules in runbook **match** `main.py` behavior (grep-verified).
3. Cloud Logging query examples return `source` field on staging invoke.
4. MAP-002D cross-link clarifies Search ≠ Maps (no doc contradiction).
5. No new production code paths — docs + optional log field only unless `source` logging missing in code (then surgical add).

## Verification checklist

> Evidence: `tasks/notes/MAP-002E-evidence.md`

- [ ] RUNBOOK.md linked from ADK README + Cloud Run doc
- [ ] Staging invoke with bad MCP referrer key → `gemini-maps-grounding` in logs (redacted evidence)
- [ ] Staging invoke with MCP 429 → **no** fallback (documented curl or log snippet)
- [ ] Sidecar contract updated

## Cookbook references

| Playbook | Use for MAP-002E |
|----------|------------------|
| [00-playbook-guide.md](../../grounding-search/docs/00-playbook-guide.md) | **Do not** conflate Maps fallback with Search — section map |
| [01-playbook.md](../../grounding-search/docs/01-playbook.md) | Grep `maps_grounding` / `googleMaps` — compare to `gemini_maps_grounding.py` only |
| [02-playbook.md](../../grounding-search/docs/02-playbook.md) | **Not used** — Search is MAP-002D |

## Out of scope

- Enabling Gemini Maps on every Mastra turn (checklist G2 — Phase 2)
- Google Search grounding (**MAP-002D** — use [02-playbook](../../grounding-search/docs/02-playbook.md))
- Sentry/Datadog integration — note as Phase 2 in runbook only
- Automatic paging — manual Patricia checklist for Phase 1

## Definition of Done

Runbook + contract + evidence; optional log/`grounding_quota_log` column if needed. Commit: `docs(adk): Gemini Maps fallback runbook + observability (MAP-002E)`.
