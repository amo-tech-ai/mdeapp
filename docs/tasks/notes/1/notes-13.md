---
title: Session log — Linear sync batch prep
updated: 2026-06-03
companion: audit-linear.md · notes-16.md
---

> **Summary:** Session notes from the Linear audit — what was committed, proposed sync batches (not applied yet), and recommended next code task. Historical; check disk before acting.

## Part 1 — Docs commit status

**Committed:** `c216f7c` on branch `docs/venues-index-canonical-order`

```
docs(audit): add Linear sync scorecard and queue fixes
```

| File | Change |
|------|--------|
| `tasks/notes/audit-linear.md` | **New** — scorecard, pillar sync, issue matrix, shipped-but-stale, checklist |
| `tasks/notes/audit-01-tasks.md` | **New** — forensic queue audit companion |
| `tasks.md` | `linear_audit` link; **row 42** SCREEN-018 → 🟢 100% + **SAN-489** |
| `tasks/notes/improve.md` | Companion link to `audit-linear.md` |

**Verified:** no `mdeapp/src/**` changes · no Linear edits · planning-only diff (+669 / −2)

**Note:** `notes-12-audit-linear.md` / `notes-9-audit-tasks.md` are duplicates of the canonical files — left unstaged. Safe to delete or symlink later.

---

## Part 2 — Proposed Linear sync batches (NOT applied — awaiting your approval)

### Batch 0 — Create missing labels (run first)

| Label | Status | Action |
|-------|--------|--------|
| `track:discovery-beta` | **Missing** | Create (blue) |
| `track:commerce-exit` | **Missing** | Create — `track:commerce` exists but is not the same |
| `phase:deferred` | **Missing** | Create — or reuse `phase:phase2` + `phase:post-mvp` |
| `gate:soak` | **Missing** | Create |
| `launch-critical` | **Missing** | Create — milestone `🚨 Launch Critical` exists on SAN-115 |

**Existing substitutes:** `area:launch`, `phase:launch`, `phase:phase2`, `track:commerce`

---

### Batch 1 — Mark shipped Done (proof: merged PRs)

| Issue | Current | Proof | Proposed |
|-------|---------|-------|----------|
| **SAN-295** (VEN-012) | In Review | PR #48 `269c436` | → **Done** |
| **SAN-296** (VEN-013) | In Review | PR #48 | → **Done** (or In Progress if polish-only — body says shipped) |
| **SAN-297** (VEN-014) | In Review | PR #50 | → **Done** |
| **SAN-298** (VEN-015) | In Review | Migration live | → **Done** |

`save_issue` calls: `state: "Done"` on each; add link to PR if missing.

---

### Batch 2 — Defer Commerce MVP Exit

| Issue | Current | Cycle | Proposed |
|-------|---------|-------|----------|
| **SAN-178** PAY-001 | Todo Urgent + `phase:launch` | Cycle 1 | priority **3**, `cycle: null`, add `track:commerce-exit` + `phase:deferred`, remove `phase:launch` |
| **SAN-116** PAY-003 | **In Progress** Urgent | Cycle 1 | → **Todo**, priority **3**, same labels, `cycle: null` |
| **SAN-366** EVT-002 | Todo High + `phase:launch` | Cycle 1 | priority **3**, defer labels, `cycle: null` |
| **SAN-115** EVT-001 | Todo Urgent SLA + `phase:launch` | Cycle 1 | priority **4**, defer labels, `cycle: null`, clear SLA noise |

---

### Batch 3 — Missing issues: create vs skip

| Task | Linear today | Proposed |
|------|--------------|----------|
| **F13** | Not found | **CREATE** — Core Foundation, P0, `track:discovery-beta` |
| **DATA-EMBED** | Not found | **CREATE** — Platform Infra, P1 |
| **OPS-JOURNEY** | Not found (SAN-462 covers soak only) | **CREATE** — Core, P0, link `blockedBy: SAN-462` |
| **AUTH-009** | Not found (SAN-195 is OpenClaw AUT-009) | **CREATE** — Core, P0, before VEN-019 |
| **SCREEN-023** | **SAN-490 exists** | **SKIP create** — normalize SAN-490 (add labels, P0); update `tasks.md` row 21 → SAN-490 |
| **VEN-031** | **SAN-314** maps to VEN-031 Playwright spec | **SKIP create** — retitle/prioritize SAN-314; SAN-310 is wrong spec (WhatsApp) |

---

### Batch 4 — Tag Discovery Beta P0 active queue

Add `track:discovery-beta` (+ `gate:soak` on soak-blocked) to:

| Issue | Notes |
|-------|-------|
| SAN-462 | + fix description (Batch 6) |
| SAN-367 | Already In Progress + Cycle 1 ✅ |
| SAN-369, SAN-368 | Bump to In Progress or top Todo P0 |
| SAN-458 | PR-16 branch protection |
| SAN-490 | `/restaurants` |
| SAN-314 | VEN-031 Playwright gate |
| NEW F13, OPS-JOURNEY, AUTH-009 | On create |

Post-soak (add `gate:soak`): SAN-387, SAN-437, SAN-323

---

### Batch 5 — Deprioritize Trips + INT polish

**TRP-* (`track:trips`, `phase:mvp`, Urgent):** bulk update ~15 issues (SAN-273–291, etc.)

- priority → **3** (Medium) or **4** (Low)
- replace `phase:mvp` → **`phase:phase2`**
- `cycle: null`
- add `phase:deferred` when label exists

**Urgent TRP examples:** SAN-273, 274, 275, 276, 282

| Issue | Current | Proposed |
|-------|---------|----------|
| **SAN-406** INT-003 | Todo **Urgent** | priority **3**, `phase:phase2` or intel backlog |
| **SAN-407** INT-004 | Todo **Urgent** | priority **3**, blocked by INT-003 |

---

### Batch 6 — Fix SAN-462 description

**Remove:** `"Parallel once PAY-001 started"`

**Replace with:**

```markdown
**Track:** Discovery Beta · **Phase:** P0 · **Gate:** gate:soak

**Purpose:** Three consecutive nightly prod synthetic PASS before merging risky chat UX (SEARCH-002 / UX-023).

**Blocks:** PR #38 merge policy · rows 11–16 UX soak · OPS-JOURNEY sign-off

**Does NOT block:** Commerce MVP Exit (PAY/EVT deferred).
```

Add labels: `track:discovery-beta`, `gate:soak`, `phase:launch` (or drop `phase:launch` once Discovery view exists)

---

### What would be skipped (no action)

| Item | Reason |
|------|--------|
| SAN-490, SAN-314 | Already exist — normalize only |
| SAN-379, 388, 304, 307, 489 | Already Done ✅ |
| SAN-100 | Duplicate of SAN-462 ✅ |
| Code / `tasks.md` Linear links | Separate docs patch after Batch 3 (rows 8–10, 21, 26, 37) |

---

### Final Discovery Beta queue (after all batches)

**P0 — parallel now**

| Order | Task | Linear |
|------:|------|--------|
| 1 | Soak gate | SAN-462 |
| 2 | Prod auth | SAN-367 (+ PR #56) |
| 3 | Map ID prod | SAN-369 |
| 4 | ADK prod | SAN-368 |
| 5 | Branch protection | SAN-458 |
| 6 | Thread persistence | **NEW F13** |
| 7 | Prod journeys J05–J20 | **NEW OPS-JOURNEY** |

**P1 — after SAN-462 3/3**

| Task | Linear |
|------|--------|
| SEARCH-002 UI | SAN-387 / PR #38 |
| ResultCardShell | SAN-437 |
| Embed 403 fix | **NEW DATA-EMBED** |

**Venues stop**

| Task | Linear |
|------|--------|
| `/restaurants` | SAN-490 |
| JWT → Mastra | **NEW AUTH-009** |
| Playwright gate | SAN-314 |

**Out of active view:** D1–D5 (SAN-178, 116, 366, 115) · all TRP-* · INT-003/004

---

## Part 3 — Next implementation task

**Next:** **SAN-367 / AUTH-011** — PR #56 is open and is the highest-leverage Discovery Beta gate after soak.

| Field | Value |
|-------|-------|
| **Branch** | `ai/san-367-auth-011-wallet-guard` (PR #56) |
| **Persona** | Camila — prod login/session on mdeai.co |
| **After merge** | Flip SAN-367 → Done with prod proof in PR body |

**Validation (before merge / Done):**

```bash
cd /home/sk/mdeai/mdeapp
npm run lint
npm run typecheck
npm run verify:task -- AUTH-011 --skip-floor
npm run floor
```

**Prod spot-check:** signup/login on `https://www.mdeai.co`, session survives refresh, `/me/tickets` wallet route no redirect loop.

**Parallel (non-code / env):** SAN-462 nightly synthetic (wait for 2/3 remaining) · SAN-369/368 Vercel env (Map ID + ADK URL).

---

**Approve Linear batches?** Reply with which batches to apply (e.g. “Batch 1+2 only” or “all”) and I’ll execute via MCP in order. I will not touch Linear until you confirm.