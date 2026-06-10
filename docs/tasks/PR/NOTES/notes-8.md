Verified against **`origin/main` = Vercel Production = `4de18f1`** (2026-06-02). Full tracker: [`tasks/PR/PROGRESS-TRACKER.md`](tasks/PR/PROGRESS-TRACKER.md) — linked from [`tasks/PR/INDEX.md`](tasks/PR/INDEX.md).

**Proof snapshot:** prod `/` **200** · CopilotKit POST **400** (alive) · `floor.yml` **success** · `main` branch protection **not set** · soak **1/3** · PR **#38** still **OPEN**.

---

## Executive rollup

| Workstream | Status | % Complete | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|------------|--------|------------|--------------|----------------------|----------------|
| **PR remediation (18)** | 🟡 | **86%** | 15/18 archived on prod | PR-16 admin; PR-18; PR-15 backlog | Branch protection → soak → PR-18 |
| **Stable Beta (SAN-462)** | 🟡 | **33%** | 1 scheduled synthetic PASS | 2/3 soak remaining | Wait 2 scheduled runs (~09:00 UTC) |
| **UX wave (14 specs)** | 🟡 | **64%** shipped / **0%** refinement | UX-010/020/028/032/034 on prod | UX-023–033 not started | After 3/3 soak |
| **DATA pack (35)** | 🟡 | **77%** | P0 venue + migrations #40–44 | DATA-028 blocked; SEARCH app open | DATA-028 webhook; close DATA-041 QA |
| **AUTH (3 open)** | 🟥 | **25%** | F08 + archived AUTH done | E2E, JWT context, prod checklist | AUTH-005 first |
| **Production sign-off** | 🟥 | **~55%** | Code = prod SHA | No merge gate; soak incomplete | SAN-462 + PR-16 admin |

**Verdict:** Wave-1 **is live on prod**; **Stable Beta is not signed off** until soak **3/3** + **`Floor / floor`** required on `main` + post-soak UX-023.

---

## PR remediation (active only)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|----------------------|----------------|
| PR-16 | Floor + review on `main` | 🟡 In Progress | 70% | `floor.yml` green on `4de18f1` | Branch not protected (GH 404) | [`docs/16-branch-protection.md`](tasks/PR/docs/16-branch-protection.md) |
| PR-18 | SHA-pin GitHub Actions | ⚪ Not Started | 0% | Spec only | After soak policy | SAN-460 post-soak |
| PR-15 | ADK smoke audit (Phase 2) | ⚪ Not Started | 0% | — | Phase 2 | Backlog SAN-444 |

**PR-01 … PR-14, PR-17:** 🟢 **100%** — archived [`tasks/PR/archive/tasks/`](tasks/PR/archive/tasks/).

---

## Product surfaces (personas)

| Surface | Persona | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|---------|---------|--------|---|--------------|----------------------|----------------|
| `/chat` | Camila, Tourist | 🟡 | 75% | `conciergeAgent`, runtime up | UX-023 shell; #38 events UI | Soak → UX-023 |
| `/rentals` | Camila | 🟡 | 70% | Search works; cards on main | SEARCH-001 app wire | Post-soak |
| `/host/event/new` | Roberto | ⚪ | 25% | Route exists (307 if logged out) | HITL wizard W3–W4 | `hostEventAgent` tools |
| `/admin/*` | Patricia | ⚪ | 0% | — | No admin routes in app | W8 |
| `/trips`, `/saved` | Camila | 🟡 | 40% | Routes exist | DATA-028 sync | Webhook |
| `/me/tickets` | Andrés | 🟡 | 40% | Route exists | Stripe W9 | Payment train |
| Mastra + CopilotKit | Sofía / platform | 🟢 | 95% | Agents + `/api/copilotkit` | — | Monitor soak |

---

## AI / automation

| Component | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next |
|-----------|--------|---|--------------|------------|--------|
| CopilotKit ↔ Mastra AG-UI | 🟢 | 95% | Prod runtime responds | — | — |
| conciergeAgent (multi-intent) | 🟡 | 70% | On main | SEARCH-002 UI (#38 open) | Merge after soak |
| Prod synthetic (nightly) | 🟡 | 33% | 1/3 scheduled green | 2 runs | SAN-462 |
| Floor CI | 🟢 | 100% | Workflow passes | Not required on merge | PR-16 admin |
| hostEventAgent + HITL wizard | ⚪ | 20% | Planned | Tools/screens W3–W4 | Roberto track |

---

## Production readiness gates

| Gate | Status | % | Proof |
|------|--------|---|--------|
| `main` = Vercel Production | 🟢 | 100% | `4de18f1` |
| `npm run floor` in CI | 🟢 | 100% | Last run success |
| Required check on `main` | 🟥 | 0% | Branch not protected |
| 3× prod synthetic | 🟡 | 33% | 1/3 |
| Auth prod checklist | 🟥 | 25% | AUTH-011 open |
| Stable Beta UX (023–033) | ⚪ | 0% | Blocked on soak |

---

## Priority queue

1. **SAN-462** — 2 more **scheduled** prod synthetics (no feature PRs during soak).  
2. **PR-16** — require **`Floor / floor`** + 1 review on `main`.  
3. **UX-023 → 024 → 029 → 033** — Camila card/map refinement.  
4. **AUTH-005 → AUTH-011** — production auth confidence.  
5. **#38 SEARCH-002** — events fast-path (after soak policy).  
6. **PR-18** — SHA-pin Actions.  
7. **DATA-028** — `trip_items` webhook.

---

**Infra (non-blocking):** Maps `BillingNotEnabledMapError` (GCP billing) · rental embed **403** (search still returns).

Want this committed to `mdeai` with the archive moves, or a shorter “Launch Critical only” view in `INDEX.md`?