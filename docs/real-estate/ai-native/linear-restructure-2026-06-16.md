# Broker OS Linear restructure — Concierge-first (Option B)

> **Verdict:** Option B · **88/100** · Audit: [`notes.md`](./notes.md)  
> **Applied to Linear:** 2026-06-18 (sync: `npm run linear:rentals-queue`)  
> **Do not use** `ui_kits/explore/` for broker work — Camila consumer only.

---

## Summary

| Issue | New role | Route |
|-------|----------|-------|
| [SAN-1093 · RE-DES-002](https://linear.app/sanjiovani/issue/SAN-1093) | **Primary broker AI-native workspace** — owns the single 3-panel shell | `/host/rentals` |
| [SAN-1095 · RE-DES-004](https://linear.app/sanjiovani/issue/SAN-1095) | **Data layer + overview mode** — SQL KPIs, briefing, attention feed; no second layout | `/host/rentals/dashboard` → redirect or `?mode=overview` |
| [SAN-1167 · RE-AI-REF-001](https://linear.app/sanjiovani/issue/SAN-1167) | **Canceled / merged** into SAN-1093 Phase A | — |

**One shell:** `rc-left` \| `rc-center` \| `rc-right` from `rentals-os/concierge/RentalsConcierge.jsx`.

---

## SAN-1093 · RE-DES-002 — Broker Concierge (PRIMARY)

**Paste target:** Linear issue description (canonical after restructure)

```markdown
## RE-DES-002 — Broker Concierge · **primary broker AI-native workspace**

**Persona:** Broker · **Route:** `/host/rentals` (default landing after gate) · **Class:** U  
**Architecture decision (2026-06-16):** **Option B — Concierge-first.** This issue owns the **only** broker three-panel shell. Do not build a parallel dashboard layout on SAN-1095.

**Labels:** `RENTV2` · `D-TRACK` · **Project:** Real Estate

### Purpose

Chat-first broker OS: opportunities + workflows on the left, CopilotKit v2 conversation in the center, dynamic workspace + HITL on the right. KPIs and attention queue live **inside** this shell — not on a separate KPI hero page.

### Design kit (canonical — not `explore/`)

| Layer | Path |
|-------|------|
| **Kit** | `mdeai-design-system/project/ui_kits/partners/rentals-os/concierge/RentalsConcierge.jsx` |
| **Disk plan** | [`docs/real-estate/design/03-broker-concierge.md`](https://github.com/amo-tech-ai/mdeapp/blob/main/docs/real-estate/design/03-broker-concierge.md) |
| **Wireframe** | [`docs/real-estate/wireframes/013-re-des-002-full-page.md`](https://github.com/amo-tech-ai/mdeapp/blob/main/docs/real-estate/wireframes/013-re-des-002-full-page.md) |
| **Audit** | [`docs/real-estate/ai-native/notes.md`](https://github.com/amo-tech-ai/mdeapp/blob/main/docs/real-estate/ai-native/notes.md) |

### Panel contract

| Column | Content |
|--------|---------|
| **Left (`rc-left`)** | + New conversation · Opportunities (attention queue) · Saved workflows · Recent threads |
| **Center (`rc-center`)** | CopilotChat hero · onboarding empty state · prompt chips · action cards · tool results |
| **Right (`rc-right`)** | Dynamic workspace: listing · lead · viewing · marketing · **analytics (`ctx-analytics`)** · map · HITL ack |

Top tabs: Concierge* · Listings · Dashboard (Dashboard tab → `?mode=overview`, same shell).

### Phased delivery

#### Phase A — Static shell (no agent)

- [ ] `rentals-concierge-shell.tsx` — port kit grid + testids
- [ ] `rentals-conversation-history.tsx` — left feed (mock opps/workflows/recent)
- [ ] `rentals-dynamic-workspace.tsx` — `Context()` modes from kit
- [ ] Mobile tab bar: Feed · Chat · Workspace
- [ ] Evidence: `docs/tasks/testing/evidence/YYYY-MM-DD/RE-DES-002-RESULTS.md`

#### Phase B — Data from SAN-1095

- [ ] Wire [`fetch-broker-dashboard.ts`](https://github.com/amo-tech-ai/mdeapp/blob/main/src/lib/rentals/fetch-broker-dashboard.ts) → left Opportunities + center cards
- [ ] Selection state → right panel (listing / lead / showing / kpi)
- [ ] `?mode=overview` — pre-expand KPI/action cards in center; chat stays enabled in Phase C

#### Phase C — Agent (after bridge + spec)

- [ ] [SAN-1124 · RE-AI-CK-001](https://linear.app/sanjiovani/issue/SAN-1124) — `BrokerCopilotBridge` (pattern: `/host/analytics` + banking CK ref)
- [ ] [SAN-1035 · MASTRA-RE-015](https://linear.app/sanjiovani/issue/SAN-1035) — `brokerAgent`
- [ ] Enable chat; starters become agent suggestions; HITL on publish / send / confirm

### Dependencies

**Blocked by:** SAN-1109 · SAN-1092 · SAN-1104 · SAN-1124 · SAN-1126 · SAN-1035 (agent Phase C only)

**Consumes data from:** [SAN-1095 · RE-DES-004](https://linear.app/sanjiovani/issue/SAN-1095) (SQL layer — no duplicate fetch)

**Supersedes layout work on:** ~~SAN-1167~~ (merged here)

### CopilotKit references

- Layout: [strands-crm](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/strands-crm)
- Bridge: [banking](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) + `HostOpsCopilotBridge` on `/host/analytics`
- Shared state: [canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra)

### Success criteria

- [ ] `/host/rentals` = default broker landing with concierge shell
- [ ] Right panel swaps by selection / intent (`ctx-*` testids)
- [ ] No second three-panel layout elsewhere in broker routes
- [ ] Class U evidence with broker fixture
```

---

## SAN-1095 · RE-DES-004 — Broker data layer + overview mode

**Paste target:** Linear issue description (rescoped — not a standalone dashboard UI)

```markdown
## RE-DES-004 — Broker OS **data layer + overview mode** (not a separate layout)

**Persona:** Broker · **Route:** `/host/rentals/dashboard` → **redirect** to `/host/rentals?mode=overview` (same shell as SAN-1093)  
**Class:** C (data) + thin redirect/route PR  
**Architecture decision (2026-06-16):** **Option B — Concierge-first.** This issue **does not** own a second three-panel UI. Layout lives on [SAN-1093 · RE-DES-002](https://linear.app/sanjiovani/issue/SAN-1093).

**Labels:** `RENTV2` · `D-TRACK` · **Project:** Real Estate

### Purpose

Deliver **truthful broker metrics** and attention signals that feed the concierge shell:

- SQL-backed KPI counts and attention rows
- Briefing narrative input (`brokerBriefingWorkflow` later)
- Right-panel KPI provenance (`ctx-analytics`)
- Overview deep link / redirect — **not** a KPI hero page

### In scope (keep / finish)

| Deliverable | Path / behavior |
|-------------|-----------------|
| SQL loader | `src/lib/rentals/fetch-broker-dashboard.ts` |
| View model | `src/lib/rentals/build-broker-dashboard-view.ts` |
| Unit tests | `src/lib/rentals/__tests__/build-broker-dashboard-view.test.ts` |
| Overview mode contract | `?mode=overview` on `/host/rentals` — consumed by SAN-1093 shell |
| Route redirect | `/host/rentals/dashboard` → `/host/rentals?mode=overview` |
| Data rules | Real counts only; unsupported → **Data pending.** |

### Out of scope (moved to SAN-1093)

- ~~`rentals-dashboard-layout.tsx`~~ → `rentals-concierge-shell.tsx`
- ~~`rentals-broker-workspace.tsx`~~ → center column of concierge shell
- ~~`rentals-broker-context-panel.tsx`~~ → `rentals-dynamic-workspace.tsx`
- ~~HostNavRail-only dashboard chrome~~ → kit top tabs + `rc-left` feed
- ~~Disabled chat dashboard fork~~ → chat is center hero on SAN-1093

### Phases

#### Phase A — Data + redirect (this issue)

- [ ] Merge / land SQL layer if not on `main`
- [ ] Export types for SAN-1093 consumption (`BrokerDashboardView`, attention rows, KPI cards)
- [ ] Add `/host/rentals/dashboard` redirect (or rewrite in `next.config` / page.tsx)
- [ ] Vitest green on `src/lib/rentals`
- [ ] Evidence row: SQL counts + redirect HTTP proof (no layout screenshots required here)

#### Phase B — Briefing workflow (follow-on)

- [ ] [SAN-1131 · RE-AI-070](https://linear.app/sanjiovani/issue/SAN-1131) — `brokerBriefingWorkflow` narrative from SQL counts
- [ ] Consumed in concierge center thread (SAN-1093 Phase B/C)

### Dependencies

**Blocked by:** SAN-1104 (landlord_id) · SAN-1105 (RLS) for prod truth  
**Unblocks:** SAN-1093 Phase B (data wiring)  
**Related:** SAN-1164 epic (CK refs apply to SAN-1093 shell, not a duplicate layout)

### Success criteria

- [ ] Every KPI traceable to SQL or **Data pending.**
- [ ] No standalone dashboard layout merged to `main`
- [ ] `/host/rentals/dashboard` resolves to overview mode in concierge shell
- [ ] PR description links SAN-1093 as layout owner
```

---

## SAN-1167 · RE-AI-REF-001 — Canceled (merged into SAN-1093)

**Paste target:** Linear issue — set **Canceled**, **Duplicate of SAN-1093**

```markdown
## RE-AI-REF-001 — **Canceled** · merged into SAN-1093

**Reason (2026-06-16):** Concierge-first restructure ([`linear-restructure-2026-06-16.md`](https://github.com/amo-tech-ai/mdeapp/blob/main/docs/real-estate/ai-native/linear-restructure-2026-06-16.md)). A separate "dashboard 3-column shell" duplicated the canonical [`RentalsConcierge.jsx`](https://github.com/amo-tech-ai/mdeapp/blob/main/mdeai-design-system/project/ui_kits/partners/rentals-os/concierge/RentalsConcierge.jsx) layout.

**Layout + selection + context panel** → [SAN-1093 · RE-DES-002](https://linear.app/sanjiovani/issue/SAN-1093) Phase A–B.

**SQL KPI loader + overview redirect** → [SAN-1095 · RE-DES-004](https://linear.app/sanjiovani/issue/SAN-1095) Phase A.

**Do not implement** `rentals-dashboard-layout.tsx` on this issue.

### CK references (still valid — implement on SAN-1093)

- [strands-crm](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/strands-crm) — workspace + context panel
- [banking](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) — SAN-1169
- [canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) — SAN-1173
```

---

## Execution order (updated)

```text
SAN-1109 (gate) → SAN-1092 (onboarding) → SAN-1095 Phase A (data + redirect)
                                          → SAN-1093 Phase A (concierge shell)
                                          → SAN-1093 Phase B (wire 1095 data)
                                          → SAN-1124 + SAN-1035 → SAN-1093 Phase C
```

**Not:** SAN-1095 layout before SAN-1093 shell.
