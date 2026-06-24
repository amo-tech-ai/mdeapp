# Real Estate — Broker AI-Native Queue (todo)

> **Owner:** Sofía (dev) + Lucía (QA) · **Updated:** 2026-06-18 (Linear-synced)
> **Architecture:** [Option B — Concierge-first](./ai-native/notes.md) · one broker shell at `/host/rentals`
> **Plan:** [`ai-native/ai-native-planV2.md`](./ai-native/ai-native-planV2.md) · **PR audit:** [`ai-native/pull-requests.md`](./ai-native/pull-requests.md)
> **Workflow:** [lean plan](../ai-second-brain/lean-plan.md) — Classify (D/C/U/S) → Orient → Implement → Verify → Ship.

---

## The answer first

**Two PRs are ready to land today and the broker shell is the gate for everything after it.** PR #246 (host analytics) is fully green — merge it. PR #252 (broker concierge shell) is mergeable but needs one localhost screenshot before it can flip to Done. Once #252 is on `main`, the broker AI work (data wiring → CopilotKit bridge → `brokerAgent` → E2E) unblocks in order.

**What it means in the real world:** Roberto gets his "how are my sales?" analytics page the moment #246 merges. The broker gets the one AI-native workspace at `/host/rentals` (no second dashboard) the moment #252 merges — today it's still a placeholder on `main`. Nothing here moves money; it's the host/broker operating surface.

**Next step:** merge #246 (all checks green), then capture the Class U localhost proof for #252 and merge it. Everything else stays blocked until #252 is in.

---

## Active PRs — land these now

| PR | Task | Class | Linear | CI / mergeable | Do this |
|----|------|-------|--------|----------------|---------|
| [#246](https://github.com/amo-tech-ai/mdeapp/pull/246) | SAN-729 · AIE-008 — Host analytics initial KPI load | **U** | In Progress | floor ✅ · DeepSource ✅ · Vercel ✅ · CodeRabbit ✅ · **MERGEABLE** | **Merge.** Then flip SAN-729 → Done with browser evidence. Bridge pattern brokers will clone for SAN-1124. |
| [#252](https://github.com/amo-tech-ai/mdeapp/pull/252) | SAN-1093 · RE-DES-002 — Broker concierge Phase A shell | **U** | In Progress | **MERGEABLE** | Capture **Class U localhost proof** (`/host/rentals` + `?mode=overview`) → `RE-DES-002-RESULTS.md`, then merge. Unblocks the whole broker chain below. |

---

## Broker chain — canonical execution order

```text
#242  SAN-1109 · RE-WIRE-001     Route gate + (broker)/ tree     ✅ Done (merged)
#243  SAN-1092 · RE-DES-005      Onboarding wizard               ✅ Done (merged)
#244  SAN-1095 · RE-DES-004      Data layer + overview redirect  ✅ Done (merged)
#241  SAN-1094 · RE-DES-003      Listings + map                  🟡 PR merged · Linear Todo (verify Done gate)
#252  SAN-1093 · RE-DES-002      Concierge shell Phase A         🔵 In Progress ← MERGE NEXT
      SAN-1124 · RE-AI-CK-001    Broker CopilotKit v2 bridge     ⚪ Todo (blocked by 1093+1095)
      SAN-1035 · MASTRA-RE-015   brokerAgent                     ⚪ Todo (blocked by 1124)
      SAN-1111 · RE-WIRE-003     Broker data hooks + Class U E2E ⚪ Todo (blocked by 1093/1095/1094)
```

### Status detail (live Linear, 2026-06-18)

| Task | Title | Class | Status | Blocked by | Notes |
|------|-------|-------|--------|------------|-------|
| SAN-1109 · RE-WIRE-001 | Route tree + broker gate | C | ✅ Done | — | On `main` (#242) |
| SAN-1092 · RE-DES-005 | Broker onboarding wizard UI | U | ✅ Done | — | On `main` (#243) |
| SAN-1095 · RE-DES-004 | Broker OS data layer + overview redirect | C | ✅ Done | — | On `main` (#244). `fetch-broker-dashboard.ts` + `build-broker-dashboard-view.ts`. **Data only — no layout.** |
| SAN-1094 · RE-DES-003 | Broker Listings + map | U | 🟡 Todo | — | PR #241 merged but Linear bounced to Todo — **verify Done gate + evidence**. Blocks SAN-1111. |
| SAN-1093 · RE-DES-002 | Broker concierge Phase A shell | U | 🔵 In Progress | — | PR #252 mergeable. Owns the **only** three-panel shell (`rc-left \| rc-center \| rc-right`). Closes after localhost proof. |
| SAN-1124 · RE-AI-CK-001 | Broker CopilotKit v2 bridge | U | ⚪ Todo | SAN-1093, SAN-1095 | Clone `HostOpsCopilotBridge` (from #246). **v2 imports only**; no new `/api/copilotkit` route. |
| SAN-1035 · MASTRA-RE-015 | Broker ops agent (`brokerAgent`) | U | ⚪ Todo | SAN-1124 | One agent key only — no third product agent. Read/draft tools first; HITL on every write. |
| SAN-1111 · RE-WIRE-003 | Broker data hooks + Class U proof | U | ⚪ Todo | SAN-1093, SAN-1095, SAN-1094 | Playwright matrix on the static shell — **not blocked by the agent**. |

---

## Phased delivery (what each phase ships)

| Phase | Owner | What lands for the broker |
|-------|-------|---------------------------|
| **A** | SAN-1093 (#252) | Static concierge shell — disabled composer, empty/context right panel, `?mode=overview` KPI placeholders. **In flight.** |
| **B** | SAN-1093 + SAN-1095 | Wire real SQL counts → left opportunities feed + center cards + overview analytics. |
| **C** | SAN-1124 | CopilotKit v2 bridge on `/host/rentals` — chat panel mounts, render tools, HITL cards. |
| **D** | SAN-1035 | `brokerAgent` live — broker asks "which leads need follow-up?" and gets scoped answers. |
| **E** | SAN-1111 | Class U Playwright proof of the full broker journey. |

---

## Out of scope (hard — do not build)

```text
Standalone dashboard shell (rentals-dashboard-layout.tsx, rentals-dashboard-shell.tsx)
A second three-panel app at /host/rentals/dashboard  (it only redirects → ?mode=overview)
brokerAgent or CopilotKit bridge inside Phase A (SAN-1035 / SAN-1124)
Live chat send before SAN-1124 + SAN-1035
Consumer /rentals AI shell (SAN-1089)
Fake LLM briefing or invented KPI numbers — unsupported metrics render "Data pending."
Service-role key in client code
SAN-1167 dashboard shell (canceled — folded into SAN-1093 Phase A)
```

---

## Health check (the only dashboard — checked weekly, ~2 min)

| Metric | Target | Now |
|--------|--------|-----|
| Open broker PRs | < 10 | 2 (#246, #252) ✅ |
| Failed CI on active PRs | 0 | 0 ✅ |
| P0 blockers | < 3 | 1 — SAN-1093 shell not yet on `main` |
| Prod incidents | 0 | 0 ✅ |

All green except the shell gap, which #252 closes.

---

## Verification gates (per lean plan, by class)

- **Class C** (SAN-1095, SAN-1109): vitest subset + `npm run dev` boots + curl — output inline, no separate file.
- **Class U** (SAN-1093, SAN-1094, SAN-1124, SAN-1035, SAN-1111, SAN-729): + Browser/Playwright + screenshot + one `docs/tasks/testing/evidence/YYYY-MM-DD/<SPEC>-RESULTS.md`.
- No task flips **Done** without a clean localhost boot AND the surface responding.

---

## Broker Concierge Implementation Queue

> Added by **RE-PLAN-001 — Real Estate Design → Implementation Audit** (2026-06-19). Full design→build mapping in [`design/design-inventory.md`](design/design-inventory.md) · roadmap in [`implementation-roadmap.md`](implementation-roadmap.md).
> **Status legend:** ✅ Done · 🟢 Ticketed (live, not Done) · 🔴 Design-only (no Linear issue — file before building). The `RENT-NNN` IDs are V3-spec design labels; proposed Linear IDs continue the live `RE-DES-*` family.

| Order | Task Name | Status | Design Source |
|---|---|---|---|
| 1 | `SAN-1095 · RE-DES-004 — Broker OS data layer + overview redirect` | ✅ Done | `design/01-design-handoff.md` |
| 2 | `SAN-1093 · RE-DES-002 — Broker Concierge` (shell) | ✅ Done | `design/03-broker-concierge.md` + `concierge/*.html` |
| 3 | `SAN-1111 · RE-WIRE-003 — Broker data hooks + Class U proof` | 🟢 Todo | `wireframes/019-re-wire-002-primitives.md` |
| 4 | `SAN-1124 · RE-AI-CK-001 — Broker CopilotKit v2 bridge` | 🟢 Todo | V3 spec §10 (SAN-1093 alignment) |
| 5 | `SAN-1035 · MASTRA-RE-015 — Broker ops agent` | 🟢 Todo | V3 spec §04 (agent behaviors) |
| 6 | `SAN-1133 · RE-AI-073 — HITL write guard (listings + leads)` | 🟢 Backlog | V3 spec §02 (rule 5: human approves) |
| 7 | `SAN-1211 · RE-DES-011 — Operator Today Home` | 🟢 Backlog | `prototypes/RENT-017 Operator Today Home.html` |
| 8 | `SAN-1212 · RE-DES-012 — Unified Inbox` | 🟢 Backlog | `prototypes/RENT-018 Unified Inbox.html` |
| 9 | `SAN-1213 · RE-DES-013 — Approval Queue` | 🟢 Backlog | V3 §04 |
| 10 | `SAN-1215 · RE-DES-015 — Global Search & Command Bar` | 🟢 Backlog | V3 §04 + `Command` primitive |
| 11 | `SAN-1218 · RE-DES-018 — Notifications Center` | 🟢 Backlog | V3 §04 |
| 12 | `SAN-1219 · RE-DES-019 — Tasks & Follow-Ups` | 🟢 Backlog | V3 §04 |
| 13 | `SAN-1214 · RE-DES-014 — Owner Communications` | 🟢 Backlog | V3 §04 |
| 14 | `SAN-1216 · RE-DES-016 — AI Activity Timeline` | 🟢 Backlog | V3 §04 |
| 15 | `SAN-1217 · RE-DES-017 — Universal Activity Feed` | 🟢 Backlog | V3 §04 |
| 16 | `SAN-1220 · RE-DES-020 — Lead Detail Workspace` | 🟢 Backlog | V3 §05 |
| 17 | `SAN-1221 · RE-DES-021 — Listing Workspace` | 🟢 Backlog | V3 §05 |
| 18 | `SAN-1222 · RE-DES-022 — Viewings Command Center` | 🟢 Backlog | V3 §04 (reconcile `SAN-1206 · RE-DES-010`) |

> The RENT-000 Workspace Contract shell is covered by `SAN-1093 · RE-DES-002 — Broker Concierge` (Done) — no separate ticket.

**Gate:** orders 7–18 are now ticketed (`SAN-1211…1222`, filed by `SAN-1210 · RE-PLAN-001`). None can flip Done without the CK bridge (`SAN-1124`) landing first + Class U localhost evidence.
