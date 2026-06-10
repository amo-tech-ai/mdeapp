All three trackers are synced to disk. Summary:

### Verified truth (2026-05-20 PM — F39 shipped)

| Metric | Value |
|--------|-------|
| Screens Done | **14/20** |
| MVP score | **93/100** |
| `npm test` / floor | **143/143** · exit 0 |
| F39 | ✅ clarify + event sub-chips |
| SCREEN-006 e2e | ✅ 3/3 |
| **Active focus** | **SCREEN-011** saved collections |

---

### Verified truth (2026-05-24 evening) — superseded by PM run above

| Metric | Value |
|--------|-------|
| Screens Done | **11/20** (001, 003–009, 014–015) |
| `npm test` | **110/110** |
| G2 lead | ✅ smoke + DB row (`F47`, `SCREEN-008`) |
| G1 checkout | 🟡 wallet + Stripe session (`EVT-01`, `SCREEN-009`, `SCREEN-015`); paid webhook = manual test |
| F11 audit | ✅ Done — 🔴 identical webhook secrets need rotation |
| Active focus | **Screens UI** — SCREEN-016 host wizard (shell shipped) |
| Next screen Done | SCREEN-016 (needs F33–F38 for Done gate) |

### Files updated (commerce batch)

- **`changelog`** — F47/008/EVT-01/009 entry
- **`todo.md`**, **`tasks/progres.md`**, **`tasks/INDEX.md`**, **`tasks/INDEX-SCREEN-FIRST.md`**
- Evidence: `tasks/notes/{F47,SCREEN-008,EVT-01,SCREEN-009}-evidence.md`

### Still open

- **F11** — Stripe webhook secret separation
- **G1 paid proof** — complete Stripe test checkout → `event_orders.status=paid`
- **SCREEN-006 mobile e2e** — agent timeout flake
- **Maps depth** — MAP-004+ not started; MAP-014–017 specced from audit 27

`npm run floor` re-ran clean after edits. Authoritative execution order: [`tasks/INDEX-SCREEN-FIRST.md`](tasks/INDEX-SCREEN-FIRST.md).



You're at **8/18 screen-first tasks Done** (001–007 + 014). The Andrés ticket path is half-built: detail page ✅, checkout still a shell.

## Recommended order

### 1. **G2 — Camila leads (unblocks SCREEN-008)**
**F47** → port `chat-lead-capture` edge → wire `schedule-viewing-modal.tsx` submit.

- Persona: Camila schedules a viewing from rental card / venue sheet
- Verify: form submit → row in `leads` (or equivalent) + Playwright SCREEN-008

### 2. **G1 — Andrés pays (unblocks SCREEN-009 → 015)**
Backend first, then UI:

| Task | Why |
|------|-----|
| **F11** | Separate Stripe webhook secrets (security gate) |
| **EVT-01** | Port `ticket-checkout` edge + webhook finalize |
| **SCREEN-009** | Replace checkout shell with real Stripe redirect |
| **SCREEN-015** | `/me/tickets` + QR after purchase |

This closes the loop: chat/event card → detail → pay → ticket in wallet.

### 3. **Roberto path (after G1 or in parallel)**
**SCREEN-016** — host event wizard at `/host/event/new` (F33–F38 backend). Biggest remaining P0 surface for Phase 1 hero flow.

---

## Parallel (maps — from audit 27)

If someone else can own backend, maps hardening doesn't block tickets:

1. **MAP-017** — mock pin lifecycle cleanup  
2. **MAP-015** — restaurant/grounded card ↔ pin sync  
3. **MAP-014** — single map mount on mobile  
4. **F50b** — viewport sync on pan/zoom  

**SCREEN-010** (map panel polish) is also unblocked now that MAP-001 is Done.

---

## Small wins (low effort)

- **EventCard URLs** — add `slug` to `search-events` results → `/events/{slug}` instead of UUID (shareable links)
- **SCREEN-006 mobile e2e flake** — agent timeout on event query; add retry or seed fallback like desktop
- **Hygiene** — `tasks/screens/notes.md` still has stale baseline section below line 28

---

## If you pick one thing today

**F47 + SCREEN-008** — Camila can actually submit a viewing request; no Stripe dependency, shell already exists.

**F11 → EVT-01 → SCREEN-009** — if revenue path is the priority; Andrés gets real checkout on the page you just shipped.

Which track — **G2 leads**, **G1 tickets**, or **maps**?**SCREEN-014** is done and gated.

### Shipped (latest)

**SCREEN-014 — Event detail page**
- `/events/[slug]` — slug or UUID lookup, tier list, Buy → checkout modal shell
- `getPublicEvent` server fetch (RLS public published events + tickets)
- Evidence: `tasks/notes/SCREEN-014-evidence.md`

**SCREEN-007 / SCREEN-006** — venue sheet + event cards (see evidence files)

### Verification (SCREEN-014)

```text
npm run floor                                    → exit 0 (106 tests)
npx playwright test e2e/screens/SCREEN-014       → 5/5
curl :3001/events/reina-de-antioquia-2026-finals → 200
```

### Next in order (`INDEX-SCREEN-FIRST.md`)

1. **SCREEN-008** — Schedule modal submit (**F47** edge port)
2. **SCREEN-009** — Checkout (**F11** + **EVT-01**)
3. **SCREEN-015** — post-checkout confirmation




## Verified baseline (just now)

| Gate | Result |
|------|--------|
| `npm test` | **100/100** pass |
| `npm run floor` | **exit 0** (fixed typecheck on processor tests) |
| `e2e/screens/` | **empty** — visual Done gate still open |
| Evidence | Only `SCREEN-001-005-evidence.md` (unit/smoke; **not** per-task visual) |

**Authoritative order:** [`tasks/INDEX-SCREEN-FIRST.md`](tasks/INDEX-SCREEN-FIRST.md) (screen-first, not G2-first from `25-mde-audit`).

---

## Next 5 tasks (do in this order)

### 1. SCREEN-001 — first **Done** (Lucía gate)

**Why:** Camila needs a proven shell before anything else counts as shippable. Blocks 003/004 visual proof.

**Skills:** `task-verifier` · `playwright-cli` · `webapp-testing` · `chrome-devtools-cli` · `mde-task-lifecycle`

**Work:**
1. Create `mdeapp/e2e/screens/SCREEN-001-home-chrome.spec.ts` (extend `e2e/helpers/maps-layout.ts`)
2. Chrome DevTools MCP: navigate `/` → snapshot → `list_console_messages` → screenshots
3. Save `mdeapp/tmp/screenshots/SCREEN-001/{desktop,mobile}.png`
4. Write `tasks/notes/SCREEN-001-evidence.md` (template in `SCREEN-TESTING-STANDARD.md` §7)

**Verify:**
```bash
cd mdeapp && npm run dev   # :3001 + :4111
npm run verify:console && npm run smoke:map-pins
npm run test:e2e:desktop && npm run test:e2e:mobile
npm run test:e2e -- e2e/screens/SCREEN-001-home-chrome.spec.ts
npm run floor
```

**Done gate:** `SCREEN-TESTING-STANDARD.md` §6 — all boxes + evidence file. **Do not** flip status until then.

---

### 2. SCREEN-003 → 004 → 005 — batch visual proof

**Why:** Code exists; same pattern as 001. One PR can cover 003–005 if each gets its own spec + evidence file.

| Task | Spec to add | Extra proof |
|------|-------------|-------------|
| SCREEN-003 | `e2e/screens/SCREEN-003-query-bar.spec.ts` | Chip click → `useCoAgent` memory (Vitest already has `chat-filter-chips.test.ts`) |
| SCREEN-004 | `e2e/screens/SCREEN-004-workflow-strip.spec.ts` | Rental query → strip shows tool in-progress |
| SCREEN-005 | `e2e/screens/SCREEN-005-rental-card.spec.ts` | `npm run smoke:f50-pin-sync` + card CTA opens modal |

**Phase 1 exit bundle** (after 001–005 Done):
```bash
cd mdeapp && npm run smoke:map-pins && npm run smoke:f50-pin-sync && npm run verify:console && npm run floor
```

---

### 3. MASTRA-001 — close infra drift (parallel, small)

**Why:** 100 tests pass; task is **In Progress** only for missing evidence.

**Skills:** `mastra-smoke-test` · `task-verifier`

**Work:**
1. Add `tasks/notes/MASTRA-001-evidence.md` with `npm test` + localhost chat curl
2. Optional: `src/__tests__/mastra-router-smoke.test.ts` per spec
3. Flip **Done** only after evidence + floor

---

### 4. F47 + SCREEN-008 — **G2** (Camila lead)

**Why:** Biggest MVP gap after visual gate. F12 edge JWT is Done; UI submit is not.

**Skills:** `mde-supabase` (Supabase MCP) · `copilotkit-develop` · `task-verifier`

**Work:**
1. Wire `ScheduleViewingModal` submit → `chat-lead-capture` edge (anon OK per F12)
2. MCP: `execute_sql` → confirm `leads` row after UI submit
3. `e2e/screens/SCREEN-008-schedule-viewing.spec.ts` + evidence

**Verify:**
```bash
# After submit from UI
# Supabase MCP: SELECT id, source FROM leads ORDER BY created_at DESC LIMIT 1;
npm run floor
```

**Blocker until F47 ships:** SCREEN-008 stays Not Started/Blocked for Done.

---

### 5. SCREEN-007 → 006 → 014 → F11 + EVT-01 + 009/015 — **G1** (Andrés ticket)

**Why:** Screen-first order puts venue + event cards before checkout (per `23-screens-task-audit`).

| Step | Task | Verify |
|------|------|--------|
| a | SCREEN-007 venue sheet | Sheet opens from pin/card; `focusMapPin` |
| b | F25 + SCREEN-006 EventCard + Buy CTA | Event query → cards + pins |
| c | SCREEN-014 `/events/[slug]` | Route 200 + DB read |
| d | F11 Stripe audit | Secret separation before EVT-01 |
| e | EVT-01 + SCREEN-009 + 015 | Stripe test → `event_orders.status=paid` + QR |

**Skills:** `mde-stripe` · `mde-supabase` · `shadcn`

---

## Best practices (from skills + CLAUDE.md)

| Rule | Source |
|------|--------|
| **One worktree, one PR, one goal** | `mde-worktree-pr-flow` |
| **Done = probed, not claimed** | `task-verifier` — never trust `status:` without disk/MCP/test |
| **SCREEN Done = §6 + evidence + screenshots** | `SCREEN-TESTING-STANDARD.md` |
| **Localhost runtime proof** | CLAUDE.md anti-fake-done gate 9 |
| **MCP before external API code** | CopilotKit/Mastra/Supabase MCP when wiring F47/EVT-01 |
| **No `npm audit fix --force`** | `25-mde-audit` — breaks CopilotKit pin |
| **Defer** MAP-004+, trips/saved, ADK package, SCREEN-002/018 until P0 Done | audits agree |

---

## Do not start yet

- MAP-004 Places client · MAP-009 clustering · SCREEN-011–013 retention  
- F33–F38 Roberto chain (until G1/G2 proven)  
- Marking SCREEN-001–005 **Done** without per-task Playwright + MCP screenshots  

---

## Suggested immediate sprint (this week)

```text
Day 1–2: SCREEN-001 spec + MCP + evidence → first Done
Day 2–3: SCREEN-003/004/005 specs + evidence (batch PR)
Day 3:   MASTRA-001 evidence → Done
Day 4–5: F47 + SCREEN-008 → G2 proof (leads row)
```

**First command to run:**
```bash
cd mdeapp && npm run dev
# then create e2e/screens/SCREEN-001-home-chrome.spec.ts
```

Want me to scaffold `SCREEN-001-home-chrome.spec.ts` and the evidence template next?