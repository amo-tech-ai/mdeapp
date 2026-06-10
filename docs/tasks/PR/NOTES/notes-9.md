Complete next steps for **Stable Beta sign-off** — ordered, with **verify → implement → test** per step. Current truth: prod @ **`4de18f1`**, soak **1/3**, branch protection **off**, UX runtime work **frozen until soak**.

---

## Phase 0 — Now (no code; parallel with soak)

### 0A · SAN-458 — Branch protection (PR-16)

| | |
|---|---|
| **Skill** | `source-command-verify-floor` / [`tasks/PR/docs/16-branch-protection.md`](tasks/PR/docs/16-branch-protection.md) |
| **Who** | Admin (you) — GitHub Settings, not agent-mergeable |

**Verify (before toggling):**
```bash
cd /home/sk/mdeai/mdeapp && npm run floor   # exit 0
gh run list --repo amo-tech-ai/mdeapp --workflow=floor.yml --limit 1 --json conclusion,displayTitle
gh api repos/amo-tech-ai/mdeapp/branches/main/protection   # expect 404 until done
```

**Implement:** GitHub → `amo-tech-ai/mdeapp` → Branches → `main` → require PR + **1 review** + status check **`Floor / floor`** (exact string).

**Test (Done gate for SAN-458):**
```bash
gh api repos/amo-tech-ai/mdeapp/branches/main/protection --jq '.required_status_checks.checks'
# Must include "Floor / floor"
```
Optional: open a trivial PR with intentional lint fail → merge blocked.

**Linear:** [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) → **Done** when protection API returns checks (not when `floor.yml` merged — that’s already done).

---

### 0B · SAN-462 — Soak gate (wait)

| | |
|---|---|
| **Skill** | `task-verifier` — treat **scheduled** runs only as evidence |
| **Do not** | Merge #38, UX-023–033, or CopilotKit/fast-path changes during soak |

**Verify (daily, no code):**
```bash
gh run list --repo amo-tech-ai/mdeapp --workflow=prod-synthetic-smoke.yml \
  --json conclusion,event,createdAt --limit 10 | jq '[.[]|select(.event=="schedule")]'
```
**Done when:** **3×** `event: schedule` + `conclusion: success` (manual `workflow_dispatch` does **not** count).

**Test:** N/A — ops gate only. Update [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) description to **3/3** and close.

---

## Phase 1 — After soak 3/3 (UX refinement train)

**Order:** SAN-437 → SAN-438 → SAN-443 → SAN-323 (Linear blockers already set).

### 1A · UX-023 — ResultCardShell (SAN-437)

| | |
|---|---|
| **Specs** | [`tasks/PR/ux/UX-023-result-card-shell.md`](tasks/PR/ux/UX-023-result-card-shell.md) |
| **Skills (load ≤5)** | `mde-task-lifecycle` → `shadcn` → `copilotkit-develop` (only if tool-render props change) → `testing` → **`task-verifier`** before Done |
| **MCP before code** | If touching agent tool UI: `mcp__copilotkit__search-docs` “render generative UI card” · Mastra only if agent tools change: `mcp__mastra__searchMastraDocs` |
| **Hard rules** | Grep [`LESSONS.md`](LESSONS.md) (duplicate cards, pin sync, POST storm) · Phase 1 CopilotKit **1.55.2 v1** only |

**Verify (pre-implement):**
```bash
cd /home/sk/mdeai/mdeapp
test -f src/components/cards/card-interaction-props.ts && echo OK
npm test -- card-interaction-props   # UX-020 baseline green
rg "CafeResultCard" src/components/copilot --files-with-matches
```

**Implement (surgical):** Extract shell per UX-023 file table — **café snapshot parity first**, then rental/event behavior-preserving.

**Test (required by `mdeai-testing.mdc`):**
```bash
# 1. Floor
cd /home/sk/mdeai/mdeapp && npm run floor

# 2. Unit
npm test -- cafe-result-card rental-card event-card card-interaction-props

# 3. Dev restart (separate kill + start)
pkill -f "next dev" 2>/dev/null; pkill -f "mastra dev" 2>/dev/null; sleep 2
npm run dev
# new terminal:
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001

# 4. Prod (after merge + Vercel promotes)
curl -s -o /dev/null -w "%{http_code}\n" https://www.mdeai.co/
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co
```

**Evidence:** `tasks/testing/evidence/ux-023-result-card-shell-YYYY-MM-DD.md` (screenshots or Playwright log).

**Done gate:** `task-verifier` anti-fake-done: dev boot + `/chat` café cards + prod smoke + floor green.

---

### 1B · UX-024 hover→pin (SAN-438)

**Depends:** UX-023 merged.

**Verify:** `rg "onMouseEnter" src/components/copilot/cafe-result-card.tsx` (reference) vs rental/event cards.

**Test:** Vitest hover mock + Browser: hover rental card → pin highlights on `/chat`.

---

### 1C · UX-029 retire GroundedPlaceCard (SAN-443)

**Verify:** `rg "GroundedPlaceCard" mdeapp/src` — only tests/orphan before delete.

**Test:** `npm run floor` + chat-smoke (café path still uses `CafeResultCard`).

---

### 1D · UX-033 stale markers (SAN-323)

**Verify:** Reproduce on `/chat` — empty search → inspect `gmp-advanced-marker` in DevTools.

**Test:** Playwright regression or manual evidence screenshot.

---

## Phase 2 — After Stable Beta signed (process + product)

| Step | Task | Skill / MCP | Verify → Test |
|------|------|-------------|-------------|
| **2A** | PR-18 SHA-pin Actions (SAN-460) | `mde-vercel` / deployments | `rg 'uses:.*@v[0-9]' .github/workflows/` empty → `npm run floor` |
| **2B** | SEARCH-002 / PR #38 | `mastra`, `copilotkit-integrations` | MCP CopilotKit + Mastra docs for fast-path · **do not** mix with soak |
| **2C** | AUTH-005 Playwright auth | `playwright-cli`, Supabase skill | E2E login path · `tasks/wireframes/screens/017-scr-login-signup-polish.md` if UI changes |
| **2D** | DATA-028 trip_items webhook | `mde-supabase` MCP schema | `get_logs` edge + integration test |

---

## Phase 3 — Optional parallel (not soak-blocked if docs-only)

You have [`017-scr-login-signup-polish.md`](tasks/wireframes/screens/017-scr-login-signup-polish.md) open — safe as **spec/wireframe** work; **runtime login changes** should wait until AUTH-005 is scheduled and soak is done if they touch `/login` CopilotKit shell.

---

## What **not** to do next

| Action | Why |
|--------|-----|
| Start UX-023 before **3/3** soak | Violates SAN-462 / frozen train |
| Merge PR **#38** during soak | SEARCH-002 touches fast-path |
| Mark PR-16 Done on CI alone | Branch protection still **404** |
| Skip prod verification | `mdeai-testing.mdc` + `task-verifier` require `mdeai.co` after merge |

---

## One-line status (today)

```text
Prod 4de18f1 ✅ | Floor CI ✅ | Branch protection ❌ | Soak 1/3 ⏳ | UX code 🔒
```

**Your two human actions today:** (1) enable **`Floor / floor`** on `main`, (2) wait for **2 scheduled** synthetic greens — then run Phase 1A with the test block above.

---

## Verification run — 2026-06-02 (executed)

Evidence: [`tasks/testing/evidence/2026-06-02-stable-beta-verification.md`](../../testing/evidence/2026-06-02-stable-beta-verification.md)

| Check | Result |
|-------|--------|
| `npm run floor` | ✅ 436 tests |
| Prod `chat-smoke.mjs` | ✅ |
| Local `chat-smoke.mjs` (dev :3001) | ✅ (slow cold-start WARN) |
| Local grounded + restaurants POST | ✅ 5 results each |
| UX-020 vitest | ✅ |
| Branch protection | 🔴 still 404 |
| Soak scheduled | 🟡 1/3 |

**No UX-023 code** — soak policy respected.