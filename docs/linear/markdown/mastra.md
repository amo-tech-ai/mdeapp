# 🤖 Mastra — AGT + MIS + AGT-PTR tracker
> Spec pack: [`docs/tasks/mastra/`](../../tasks/mastra/INDEX.md) · AGT roadmap: [`plan/index-mastra.md`](../../tasks/mastra/plan/index-mastra.md) · Partners AI: [`partners/AGT-PTR-INDEX.md`](../../tasks/mastra/partners/AGT-PTR-INDEX.md) · Updated: 2026-06-09 · Canonical CSV: [`AI & Intelligence › Issues.csv`](../CSV/AI%20%26%20Intelligence%20%E2%80%BA%20Issues.csv)

**Legend:** 🟢 Complete · 🟡 In Progress · ⚪ Not Started · — No Linear (disk-only design gate)

**Epic:** [SAN-588](https://linear.app/sanjiovani/issue/SAN-588) AGT-00 — Mastra Agent Feature Adoption · **25 Linear issues** (AGT-00…17)

---

## Phase 0 — Production Safety

| Status | AGT | Linear | Title | Tracker |
|--------|-----|--------|-------|---------|
| 🟢 | 00C | [SAN-589](https://linear.app/sanjiovani/issue/SAN-589) | Telemetry & AI tracing | mvp.md · CHAT.md |
| 🟢 | 00A | [SAN-590](https://linear.app/sanjiovani/issue/SAN-590) | Hallucination / faithfulness scorer | mvp.md |
| 🟢 | 00B | [SAN-605](https://linear.app/sanjiovani/issue/SAN-605) | Grounding-coverage scorer | mvp.md |
| 🟢 | 00D | [SAN-591](https://linear.app/sanjiovani/issue/SAN-591) | Runtime agent allowlist | mvp.md |

## Phase 1 — Core Reliability

| Status | AGT | Linear | Title | Tracker |
|--------|-----|--------|-------|---------|
| ⚪ | 03 | [SAN-592](https://linear.app/sanjiovani/issue/SAN-592) | Structured output (scorer judge) | mvp.md |
| ⚪ | 04A | [SAN-606](https://linear.app/sanjiovani/issue/SAN-606) | Grounding-assertion output processor | mvp.md · CHAT.md |
| ⚪ | 05 | [SAN-593](https://linear.app/sanjiovani/issue/SAN-593) | Input-processor coverage | mvp.md |
| ⚪ | 06 | [SAN-594](https://linear.app/sanjiovani/issue/SAN-594) | ResponseCache + CostGuard | mvp.md |
| ⚪ | 01 | [SAN-595](https://linear.app/sanjiovani/issue/SAN-595) | Native tool-approval | mvp.md |
| ⚪ | 04B | [SAN-596](https://linear.app/sanjiovani/issue/SAN-596) | SystemPromptScrubber | mvp.md |
| ⚪ | 04C | [SAN-598](https://linear.app/sanjiovani/issue/SAN-598) | PII protection | mvp.md |
| ⚪ | 17 | [SAN-611](https://linear.app/sanjiovani/issue/SAN-611) | Golden query evaluation suite | mvp.md · blockedBy 590/605 |

## Phase 2 — Business Workflows

| Status | AGT | Linear | Title | Tracker |
|--------|-----|--------|-------|---------|
| ⚪ | 15 | [SAN-607](https://linear.app/sanjiovani/issue/SAN-607) | Workflow error handling + compensation | ADV.md |
| ⚪ | 11 | [SAN-601](https://linear.app/sanjiovani/issue/SAN-601) | Checkout workflow | ADV.md · blockedBy SAN-178 |
| ⚪ | 12 | [SAN-602](https://linear.app/sanjiovani/issue/SAN-602) | Host publish workflow | ADV.md |
| ⚪ | 02 | [SAN-597](https://linear.app/sanjiovani/issue/SAN-597) | Resource-scoped working memory | ADV.md · CHAT.md |
| ⚪ | 14 | [SAN-608](https://linear.app/sanjiovani/issue/SAN-608) | Suspend & resume (host event) | ADV.md |
| ⚪ | 16 | [SAN-609](https://linear.app/sanjiovani/issue/SAN-609) | Progressive tool streaming | ADV.md · CHAT.md |
| ⚪ | 09 | [SAN-600](https://linear.app/sanjiovani/issue/SAN-600) | Background tasks | ADV.md · CHAT.md |
| ⚪ | 07 | [SAN-599](https://linear.app/sanjiovani/issue/SAN-599) | Tool output shaping + activeTools | ADV.md |

## Phase 3 — Advanced

| Status | AGT | Linear | Title | Tracker |
|--------|-----|--------|-------|---------|
| ⚪ | 13 | [SAN-610](https://linear.app/sanjiovani/issue/SAN-610) | Memory processors | ADV.md · CHAT.md |
| ⚪ | 08 | [SAN-603](https://linear.app/sanjiovani/issue/SAN-603) | Semantic recall (pgvector) | ADV.md · CHAT.md |
| ⚪ | 10 | [SAN-604](https://linear.app/sanjiovani/issue/SAN-604) | Interop spike (Channels + A2A) | ADV.md |

---

## MIS × Mastra crossover ([`MIS-TASKS-INDEX.md`](../../tasks/mastra/MIS-TASKS-INDEX.md))

| Spec | Linear | Status | In markdown | Notes |
|------|--------|--------|-------------|-------|
| MASTRA-MIS-001 | [SAN-426](https://linear.app/sanjiovani/issue/SAN-426) | Done | CHAT.md | Concierge-only prod routing |
| SEARCH-003 | [SAN-388](https://linear.app/sanjiovani/issue/SAN-388) | Done | ADV.md | Restaurant hybrid |
| SEARCH-001 | [SAN-386](https://linear.app/sanjiovani/issue/SAN-386) | Not Started | mvp.md | Rental hybrid |
| SEARCH-002 | [SAN-387](https://linear.app/sanjiovani/issue/SAN-387) | Not Started | mvp.md | Event hybrid |
| AI-003 | [SAN-395](https://linear.app/sanjiovani/issue/SAN-395) | Not Started | ADV.md | Signal enrichment |
| AI-004 | [SAN-396](https://linear.app/sanjiovani/issue/SAN-396) | Not Started | ADV.md | Grounding verify |
| DATA-046 | [SAN-384](https://linear.app/sanjiovani/issue/SAN-384) | Not Started | ADV.md | Golden queries v2 |

## Shipped archive (no per-task Linear)

[`docs/tasks/archive/mastra-A/`](../../tasks/archive/mastra-A/README.md): MASTRA-001–005 Done (W1 foundation).

---

## AGT-PTR — Partners AI ([`AGT-PTR-INDEX.md`](../../tasks/mastra/partners/AGT-PTR-INDEX.md))

Parent: [SAN-685](https://linear.app/sanjiovani/issue/SAN-685) · Schema blocker: [SAN-683](https://linear.app/sanjiovani/issue/SAN-683)

| Status | Spec | Linear | Title | Tracker |
|--------|------|--------|-------|---------|
| — | AGT-PTR-00 | — | CopilotKit route architecture (design gate) | Disk only |
| ⚪ | AGT-PTR-01 | [SAN-705](https://linear.app/sanjiovani/issue/SAN-705) | partnerAgent foundation | ADV.md |
| ⚪ | AGT-PTR-02 | [SAN-706](https://linear.app/sanjiovani/issue/SAN-706) | Partner-scoped Supabase tools | ADV.md |
| ⚪ | AGT-PTR-03 | [SAN-709](https://linear.app/sanjiovani/issue/SAN-709) | Onboarding copilot (/partners/signup) | ADV.md |
| ⚪ | AGT-PTR-04 | [SAN-707](https://linear.app/sanjiovani/issue/SAN-707) | Dashboard copilot shell | ADV.md |
| ⚪ | AGT-PTR-05 | [SAN-708](https://linear.app/sanjiovani/issue/SAN-708) | Lead qualification + HITL | ADV.md |
| ⚪ | AGT-PTR-06 | [SAN-711](https://linear.app/sanjiovani/issue/SAN-711) | Partner HITL policy module | ADV.md |
| ⚪ | AGT-PTR-07 | [SAN-710](https://linear.app/sanjiovani/issue/SAN-710) | Concierge lead partner_id attribution | ADV.md |

## Discovery backlog (CHAT-adjacent, not AGT roadmap)

| Linear | Title | Tracker |
|--------|-------|---------|
| [SAN-749](https://linear.app/sanjiovani/issue/SAN-749) | AGT-eventAgent backlog | CHAT.md |
| [SAN-750](https://linear.app/sanjiovani/issue/SAN-750) | AGT-rentalAgent backlog | CHAT.md |
| [SAN-742](https://linear.app/sanjiovani/issue/SAN-742) | AGT-routerAgent / routing workflow | CHAT.md |
| [SAN-748](https://linear.app/sanjiovani/issue/SAN-748) | AGT-adminOps | ADV.md |
| [SAN-751](https://linear.app/sanjiovani/issue/SAN-751) | AGT-crmAgent | ADV.md |
