# How to use the Rentals design files

**Class D — planning only until you port to `mdeapp/src/`.**

This folder (`docs/real-estate/design/`) is the **app-side plan**. The **visual contract** lives in the design kit at:

```text
mdeapp/mdeai-design-system/project/ui_kits/partners/
  rentals/              ← partner landing (P5)
  rentals-os/           ← broker OS
    concierge/          ← RENT-AI-001 · default /host/rentals
    dashboard/          ← R1 · /host/rentals/dashboard
    listings/           ← R2 · /host/rentals/listings
    onboarding/         ← R0 · /host/rentals/onboarding
    rentals-os.css      ← shared tokens + layout
    ros-rail.js         ← left rail + icons (dashboard/listings/onboarding)
    ros-shared.jsx      ← COP format, state helpers
```

Read [`01-design-handoff.md`](./01-design-handoff.md) for guardrails and [`INDEX.md`](./INDEX.md) for per-page wireframe plans.

---

## 1. What “using the design” means

| ✅ Do | ❌ Don't |
|-------|----------|
| Read kit **JSX/HTML + CSS** as source of truth | Copy-paste kit into `src/` |
| Port **structure, regions, copy, states, testids** into React + `DESIGN.MD` tokens | Import `rentals-os.css` or `window.RentalsConcierge` in production |
| Reuse **existing mdeapp shells** (`HostNavRail`, `HostKpiCard`, CopilotChat, HITL ack) | Invent new colors or `broker_*` tables |
| Wire **real Supabase data** with RLS | Show kit mock numbers in prod |

The kit is a **handoff prototype** (`mdeai-design-system/README.md`). Production = same **layout + behavior**, implemented with shadcn/Tailwind and app components.

---

## 2. Concierge-first Broker OS (Option B — locked 2026-06-16)

**One shell** at `/host/rentals` — [`concierge/RentalsConcierge.jsx`](../../../mdeai-design-system/project/ui_kits/partners/rentals-os/concierge/RentalsConcierge.jsx). Dashboard is **not** a second layout.

| Surface | Kit reference | Route | Production behavior |
|---------|---------------|-------|---------------------|
| **Concierge (primary)** | `concierge/RentalsConcierge.jsx` | `/host/rentals` | **Only** 3-panel shell: `rc-left` \| `rc-center` chat \| `rc-right` ctx |
| **Overview mode** | KPI/briefing content from kit dashboard | `/host/rentals?mode=overview` | Same shell — SAN-1093 Phase B wires SAN-1095 data |
| **Dashboard redirect** | — | `/host/rentals/dashboard` | Redirect → `?mode=overview` (SAN-1095 / SAN-1109) |
| **Listings** | `listings/ListingsManager.jsx` | `/host/rentals/listings` | Inventory-first grid + drawer (separate route) |

**Linear:** [SAN-1093 · RE-DES-002](https://linear.app/sanjiovani/issue/SAN-1093) owns layout · [SAN-1095 · RE-DES-004](https://linear.app/sanjiovani/issue/SAN-1095) owns SQL + redirect only.

**Do not** port `dashboard/RentalsDashboard.jsx` as a standalone KPI hero page. **Do not** use `ui_kits/explore/` for broker.

Per-page plans: [`03-broker-concierge.md`](./03-broker-concierge.md) · [`04-broker-listings-map.md`](./04-broker-listings-map.md) · [`05-broker-dashboard.md`](./05-broker-dashboard.md) (data contract only).

---

## 3. Workflow for implementers

### Step A — Pick one page plan

Open the matching doc in [`INDEX.md`](./INDEX.md) (e.g. `03-broker-concierge.md`).

### Step B — Read the kit file(s) top to bottom

Example for Concierge:

```bash
# From mdeapp repo root
mdeai-design-system/project/ui_kits/partners/rentals-os/concierge/RentalsConcierge.jsx
mdeai-design-system/project/ui_kits/partners/rentals-os/concierge/concierge.css
mdeai-design-system/project/ui_kits/partners/rentals-os/concierge/index.html
```

Follow every import. Note:

- Region widths (`rc-left`, `rc-center`, `rc-right`)
- `data-testid` values (`rc-*`, `ctx-*`, `r1-*`, `r2-*`)
- State switcher targets: `empty` | `loading` | `result` | `error`
- HITL: `ctx-publish-ack`, checkbox gates Confirm

### Step C — Map kit → mdeapp components

| Kit pattern | mdeapp target |
|-------------|---------------|
| `ROS_Rail` | `HostNavRail` + Rentals links |
| `rc-grid` / chat thread | `CopilotChat` + `rentals-concierge-shell.tsx` |
| `Context()` right panel | `rentals-dynamic-workspace.tsx` |
| `dx-brief` + `ros-kpi` | `HostNarrativeBanner` + `HostKpiCard` |
| `dx-asst` | `rentals-ai-analyst-panel.tsx` |
| Listing drawer / publish ack | listings drawer + shared HITL primitive |
| `MapPin` | existing map components + `mapId` |

### Step D — Tokens and guardrails (from handoff §“Using the Rentals design”)

1. Accent: `--pin-rental` (cartography blue) — map from `DESIGN.MD` / globals, not kit CSS file.
2. Gold (`--accent`): **✦ and ★ only** — never a button.
3. Numbers: **provenance data cards only**; unknown → **"Data pending."**
4. HITL on publish / send / confirm / schedule.
5. Images: user upload slots — AI does not generate listing photos.
6. Data: `apartments.landlord_id`, `leads`, `showings` — no `broker_*` tables.

### Step E — Verify

- Kit state parity: empty / loading / result / error
- `data-testid` from page plan
- Class U browser matrix when persona-visible
- Two-user RLS negative test before real broker data

---

## 4. File map (design folder ↔ kit ↔ route)

| Plan doc | Kit | Prod route (planned) |
|----------|-----|----------------------|
| `02-consumer-rentals-browse.md` | listings pattern (inventory only) | `/rentals` |
| `03-broker-concierge.md` | `rentals-os/concierge/` | `/host/rentals` |
| `04-broker-listings-map.md` | `rentals-os/listings/` | `/host/rentals/listings` |
| `05-broker-dashboard.md` | `rentals-os/dashboard/` | `/host/rentals/dashboard` |
| `06-broker-onboarding.md` | `rentals-os/onboarding/` | `/host/rentals/onboarding` |
| `07-partners-rentals-landing.md` | `rentals/` | `/partners/rentals` |

Master sequencing: [`design-plan.md`](./design-plan.md) §4 — see **§8 below** for full order including backend gate.

---

## 8. Task ID map (do not mix namespaces)

Two ID systems — **never swap them**:

| ID prefix | Where | Meaning |
|-----------|-------|---------|
| **RE-DES-00N** | `docs/real-estate/design/0N-*.md` | **Page / UI plan** (wireframe + file list) |
| **PTR-RENTALS-00N** | [`01-design-handoff.md`](./01-design-handoff.md) §5 | **Backend / RLS / app-side gate** (migrations, policies, tests) |

### RE-DES — page plans

| ID | Doc | Route |
|----|-----|-------|
| **RE-DES-001** | [`02-consumer-rentals-browse.md`](./02-consumer-rentals-browse.md) | `/rentals` |
| **RE-DES-002** | [`03-broker-concierge.md`](./03-broker-concierge.md) | `/host/rentals` |
| **RE-DES-003** | [`04-broker-listings-map.md`](./04-broker-listings-map.md) | `/host/rentals/listings` |
| **RE-DES-004** | [`05-broker-dashboard.md`](./05-broker-dashboard.md) | `/host/rentals/dashboard` |
| **RE-DES-005** | [`06-broker-onboarding.md`](./06-broker-onboarding.md) | `/host/rentals/onboarding` |
| **RE-DES-006** | [`07-partners-rentals-landing.md`](./07-partners-rentals-landing.md) | `/partners/rentals` |
| **UX-NAV-001** | [`08-nav-rail-mindtrip-cleanup.md`](./08-nav-rail-mindtrip-cleanup.md) | `/` · `/chat` · shared browse shell |

### PTR-RENTALS — backend prerequisites (app repo)

| ID | What | Blocks |
|----|------|--------|
| **PTR-RENTALS-001** | Ownership on `apartments.landlord_id` (no new tables) | All broker OS data |
| **PTR-RENTALS-002** | Broker RLS + **two-user negative test** | Real listings/leads/showings in UI |
| **PTR-RENTALS-003** | Publish state machine + audit columns (`published_at`, `published_by`, …) | HITL publish in listings drawer |
| **PTR-RENTALS-004** | Onboarding writes (profile + verify + first draft) | **RE-DES-005** gate |
| **PTR-RENTALS-005** | Empty / loading / error states in shared broker components | Happy-path-only screens |

Partial work exists (`landlord_id` column, `acting_landlord_ids()` for landlord inbox) — **PTR-RENTALS-002** is not done until broker-scoped SELECT/UPDATE on `apartments` + derived leads/showings pass the negative test.

### Recommended build order (IDs aligned)

| Step | Task | Notes |
|------|------|-------|
| 0 | **UX-NAV-001** | Mindtrip sidebar cleanup — blocks RE-DES-001 |
| 1 | **RE-DES-001** | Consumer `/rentals` explorer — improve in place |
| 2 | **PTR-RENTALS-001…005** | Backend gate — before broker UI with real data |
| 3 | **RE-DES-005** | Onboarding wizard + redirect rules |
| 4 | **RE-DES-002** | Concierge (default `/host/rentals`) |
| 5 | **RE-DES-003** | Listings — **grid default**, split map optional |
| 6 | **RE-DES-004** | Dashboard (`/host/rentals/dashboard`) |
| 7 | **RE-DES-006** | Partners landing (can parallel step 1) |

Do **not** label PTR backend work as RE-DES-006.

---

## 5. Preview the kit locally (optional)

Open HTML entry points in a browser **only when you need visual confirmation** — structure and testids should come from source:

```text
mdeai-design-system/project/ui_kits/partners/rentals-os/concierge/index.html
mdeai-design-system/project/ui_kits/partners/rentals-os/dashboard/index.html
```

Do not treat screenshots as source of truth; read JSX/CSS.

---

## 6. What is not built in mdeapp yet

As of the design pass: **no** `src/app/host/rentals/**` routes. `/rentals` (Camila) exists; broker OS is plan + kit only. Backend gate: ownership/RLS/publish state machine ([`01-design-handoff.md`](./01-design-handoff.md) §3.1) before live broker data.

---

## 7. Quick checklist before you claim “matches design”

- [ ] Correct shell for the page (Concierge top-nav vs Dashboard left-rail)
- [ ] Hero region matches (chat vs briefing vs inventory)
- [ ] All four states implemented
- [ ] Kit `data-testid` preserved or documented if renamed
- [ ] 0 gold buttons; ✦ only on AI affordances
- [ ] No fabricated metrics in production build
