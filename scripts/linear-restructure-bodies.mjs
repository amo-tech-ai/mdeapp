/** Canonical Linear bodies — docs/real-estate/ai-native/linear-restructure-2026-06-16.md */

export const SAN_1093_DESCRIPTION = `## RE-DES-002 — Broker Concierge · **primary broker AI-native workspace**

**Persona:** Broker · **Route:** \`/host/rentals\` (default landing after gate) · **Class:** U  
**Architecture decision (2026-06-16):** **Option B — Concierge-first.** This issue owns the **only** broker three-panel shell. Do not build a parallel dashboard layout on SAN-1095.

**Labels:** \`RENTV2\` · \`D-TRACK\` · **Project:** [Real Estate](https://linear.app/sanjiovani/project/real-estate-43bea599dc09/issues)

### Purpose

**Primary broker AI-native workspace** at \`/host/rentals\`. **Owns the only broker 3-panel shell:** \`rc-left\` | \`rc-center\` | \`rc-right\`.

Chat-first broker OS: opportunities + workflows on the left, CopilotKit v2 conversation in the center, dynamic workspace + HITL on the right. KPIs and attention queue live **inside** this shell — not on a separate KPI hero page.

### Design kit (canonical — not \`explore/\`)

| Layer | Path |
|-------|------|
| **Kit** | \`mdeai-design-system/project/ui_kits/partners/rentals-os/concierge/RentalsConcierge.jsx\` |
| **Disk plan** | [\`docs/real-estate/design/03-broker-concierge.md\`](https://github.com/amo-tech-ai/mdeapp/blob/main/docs/real-estate/design/03-broker-concierge.md) |
| **Wireframe** | [\`docs/real-estate/wireframes/013-re-des-002-full-page.md\`](https://github.com/amo-tech-ai/mdeapp/blob/main/docs/real-estate/wireframes/013-re-des-002-full-page.md) |
| **Audit** | [\`docs/real-estate/ai-native/notes.md\`](https://github.com/amo-tech-ai/mdeapp/blob/main/docs/real-estate/ai-native/notes.md) |
| **Restructure** | [\`linear-restructure-2026-06-16.md\`](https://github.com/amo-tech-ai/mdeapp/blob/main/docs/real-estate/ai-native/linear-restructure-2026-06-16.md) |

### Panel contract

| Column | Content |
|--------|---------|
| **Left (\`rc-left\`)** | + New conversation · Opportunities (attention queue) · Saved workflows · Recent threads |
| **Center (\`rc-center\`)** | CopilotChat hero · onboarding empty state · prompt chips · action cards · tool results |
| **Right (\`rc-right\`)** | Dynamic workspace: listing · lead · viewing · marketing · **analytics (\`ctx-analytics\`)** · map · HITL ack |

Top tabs: Concierge* · Listings · Dashboard (Dashboard tab → \`?mode=overview\`, same shell).

**Chrome:** \`HostNavRail\` = global host nav only · \`rc-top\` tabs = Rentals OS · \`rc-left\` = opps/workflows (not a second global rail).

### Skills (≤4)

- \`copilotkitV1\`
- \`mde-wireframe\`
- \`shadcn\`
- \`task-verifier\`

### Phased delivery

#### Phase A — Static shell (no agent)

- [ ] \`rentals-concierge-shell.tsx\` — port kit grid + testids
- [ ] \`rentals-conversation-history.tsx\` — left feed (mock opps/workflows/recent)
- [ ] \`rentals-dynamic-workspace.tsx\` — \`Context()\` modes from kit
- [ ] Mobile tab bar: Feed · Chat · Workspace
- [ ] Label: **AI-ready — agent not live**
- [ ] Evidence: \`docs/tasks/testing/evidence/YYYY-MM-DD/RE-DES-002-RESULTS.md\`

#### Phase B — Data from SAN-1095

- [ ] Wire \`fetch-broker-dashboard.ts\` → left Opportunities + center cards
- [ ] Selection state → right panel (listing / lead / showing / kpi)
- [ ] \`?mode=overview\` — pre-expand KPI/action cards in center

#### Phase C — Agent (after bridge + spec)

- [ ] [SAN-1124 · RE-AI-CK-001](https://linear.app/sanjiovani/issue/SAN-1124) — \`BrokerCopilotBridge\`
- [ ] [SAN-1035 · MASTRA-RE-015](https://linear.app/sanjiovani/issue/SAN-1035) — \`brokerAgent\`
- [ ] Enable chat; HITL on publish / send / confirm

### Dependencies

**Phase A blocked by:** [SAN-1109 · RE-WIRE-001](https://linear.app/sanjiovani/issue/SAN-1109) (route gate)  
**Phase B blocked by:** [SAN-1095 · RE-DES-004](https://linear.app/sanjiovani/issue/SAN-1095) (data layer)  
**Phase C blocked by:** SAN-1124 + SAN-1126 + SAN-1035 (agent — not blockers for Phase A)

**Consumes data from:** SAN-1095 (SQL layer — no duplicate fetch)  
**Supersedes layout work on:** ~~SAN-1167~~ (merged here)

### CopilotKit references

- Layout: [strands-crm](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/strands-crm)
- Bridge: [banking](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) + \`HostOpsCopilotBridge\` on \`/host/analytics\`
- Shared state: [canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra)

### Success criteria

- [ ] \`/host/rentals\` = default broker landing with concierge shell
- [ ] Right panel swaps by selection / intent (\`ctx-*\` testids)
- [ ] No second three-panel layout elsewhere in broker routes
- [ ] Class U evidence with broker fixture
`;

export const SAN_1095_DESCRIPTION = `## RE-DES-004 — Broker OS **data layer + overview mode** (not a separate layout)

**Persona:** Broker · **Route:** \`/host/rentals/dashboard\` → **redirect** to \`/host/rentals?mode=overview\` (same shell as SAN-1093)  
**Class:** C (data) + thin redirect/route PR  
**Architecture decision (2026-06-16):** **Option B — Concierge-first.** This issue **does not** own a second three-panel UI. Layout lives on [SAN-1093 · RE-DES-002](https://linear.app/sanjiovani/issue/SAN-1093).

**Labels:** \`RENTV2\` · \`D-TRACK\` · **Project:** [Real Estate](https://linear.app/sanjiovani/project/real-estate-43bea599dc09/issues)

### Purpose

Deliver **truthful broker metrics** and attention signals that feed the concierge shell:

- SQL-backed KPI counts and attention rows
- Briefing narrative input (\`brokerBriefingWorkflow\` later)
- Right-panel KPI provenance (\`ctx-analytics\`)
- Overview deep link / redirect — **not** a KPI hero page

### In scope (keep / finish)

| Deliverable | Path / behavior |
|-------------|-----------------|
| SQL loader | \`src/lib/rentals/fetch-broker-dashboard.ts\` |
| View model | \`src/lib/rentals/build-broker-dashboard-view.ts\` |
| Unit tests | \`src/lib/rentals/__tests__/build-broker-dashboard-view.test.ts\` |
| Overview mode contract | \`?mode=overview\` on \`/host/rentals\` — consumed by SAN-1093 shell |
| Route redirect | \`/host/rentals/dashboard\` → \`/host/rentals?mode=overview\` |
| Data rules | Real counts only; unsupported → **Data pending.** |

### Out of scope (moved to SAN-1093)

- ~~\`rentals-dashboard-layout.tsx\`~~ → \`rentals-concierge-shell.tsx\`
- ~~\`rentals-broker-workspace.tsx\`~~ → center column of concierge shell
- ~~\`rentals-broker-context-panel.tsx\`~~ → \`rentals-dynamic-workspace.tsx\`
- ~~HostNavRail-only dashboard chrome~~ → kit top tabs + \`rc-left\` feed
- ~~Disabled chat dashboard fork~~ → chat is center hero on SAN-1093
- **Do not merge PR #244 KPI shell UI** — keep \`src/lib/rentals/*\` only

### Skills (≤4)

- \`mde-supabase\`
- \`mde-real-estate\`
- \`vitest\`
- \`karpathy-guidelines\`

### Phases

#### Phase A — Data + redirect (this issue)

- [ ] Merge / land SQL layer if not on \`main\`
- [ ] Export types for SAN-1093 consumption (\`BrokerDashboardView\`, attention rows, KPI cards)
- [ ] \`/host/rentals/dashboard\` redirect (shipped on SAN-1109 branch)
- [ ] Vitest green on \`src/lib/rentals\`
- [ ] Evidence: SQL counts + redirect HTTP proof

#### Phase B — Briefing workflow (follow-on)

- [ ] [SAN-1131 · RE-AI-070](https://linear.app/sanjiovani/issue/SAN-1131) — \`brokerBriefingWorkflow\`
- [ ] Consumed in concierge center thread (SAN-1093 Phase B/C)

### Dependencies

**Blocked by:** SAN-1109 (gate) · SAN-1092 (broker profile exists) · SAN-1104/1105 (RLS truth)  
**Unblocks:** SAN-1093 Phase B (data wiring)  
**Layout owner:** SAN-1093 — link in PR description

### Success criteria

- [ ] Every KPI traceable to SQL or **Data pending.**
- [ ] No standalone dashboard layout merged to \`main\`
- [ ] \`/host/rentals/dashboard\` resolves to overview mode in concierge shell
- [ ] Evidence: \`docs/tasks/testing/evidence/YYYY-MM-DD/RE-DES-004-RESULTS.md\`
`;
