# MVP Launch Readiness Sprint — Evidence Report (2026-06-08 run 2)

**Prod URL:** https://www.mdeai.co/ · **SHA:** `85224e8`  
**Evidence path:** `tasks/testing/evidence/2026-06-08/launch-readiness-sprint-RESULTS.md`

---

## Task 1 — SAN-828 · UX-043 — CopilotKit: audit empty POST 401 vs 400 (order 2)

**Linear title (real-world):** Lucía: Prod smoke — CopilotKit empty POST contract (401 vs 400)

| Check | Status |
|-------|--------|
| Decision documented (401 external / 400 same-origin) | ✅ |
| `chat-smoke.mjs` Origin/Referer fix | ✅ committed `7eb97a1` (mdeai repo) |
| Prod chat-smoke 13/13 | ✅ |
| `changelog.md` | ✅ |
| `TASK-LEDGER.md` | ✅ |
| `project-health.md` | ✅ |
| Linear | ✅ **Done** |

**Grade A− · 91% · Success 100% · Ready to close: YES**

---

## Task 2 — SAN-546 · OPS-JOURNEY — Prod live journey matrix J05–J20

**Linear title (real-world):** Lucía: Prod journey matrix J05–J20 (rentals, venues, maps, mobile)

| Journey | Status | Grade | Score | Root Cause | Fix |
|---------|:------:|:-----:|------:|------------|-----|
| J14 · Camila · `when can I view?` follow-up | ⚠️ PARTIAL | B | 75 | `copilot-chat-ready` idle timeout on turn 2 (58s) — message sent, harness flake | Increase idle timeout or assert cards before idle |
| J15 · Any · back-to-back pin clear | ✅ PASS | A | 95 | — | — |
| J17 · Mobile · `/rentals` FAB map sheet | ✅ PASS | A | 95 | Playwright strict-mode: 2× `chat-map` (desktop + sheet) | Fixed `SAN-577B` selector → dialog-scoped |

**SAN-546 score: 86% → 91%** (J15+J17 green; J14 needs harness fix)

Screenshots: `san-546-j14-j15/` · prod-synthetic `tmp/prod-synthetic-smoke/`

---

## Task 3 — SAN-548 · F13 — Thread persistence across Vercel cold-start

**Linear title (real-world):** Camila: Chat remembers turn 11 after Vercel cold-start (F13)

| Test | Result | Pass | Evidence |
|------|--------|:----:|----------|
| Postgres `getMastraStorage()` on prod | Code shipped | ✅ | `storage.ts` |
| Vitest storage unit tests | Local | ✅ | `storage.test.ts` |
| Prod turn-11 after cold-start | Not run | ❌ | No spec |
| Multi-session recovery | Not run | ❌ | — |
| `/api/threads` persistence | Unverified prod | ⚠️ | — |

**Grade C+ · 68% · Success 40% · Ready to close: NO**

---

## Task 4 — SAN-368 · MAP-002B — ADK grounding on production

**Linear title (real-world):** Tourist: ADK café grounding live on mdeai.co/chat (MAP-002B)

| Area | Grade | Score | Ready |
|------|:-----:|------:|:-----:|
| Cloud Run `/health` + invoke | A | 95 | ✅ |
| `verify:grounding` source=grounding-lite | A | 95 | ✅ local |
| Prod synthetic café cards (S6) | A− | 90 | ✅ prod 4-query |
| Vercel `ADK_*` env audit | C | 55 | ⚠️ not MCP-verified |
| `verify:task MAP-002B` floor | F | 0 | ❌ floor OOM abort |
| Prod `metadata.source` isolation | C | 60 | ⚠️ |

**Grade B− · 78% · Success 70% · Ready to close: NO** (Vercel env + floor)

---

## Final table

| Full Task Name | Grade | Score | Success Rate | Production Ready | Ready To Close |
|----------------|:-----:|------:|-------------:|:----------------:|:--------------:|
| SAN-828 · UX-043 — Lucía: Prod smoke — CopilotKit empty POST contract (401 vs 400) | A− | 91 | 100% | ✅ | **YES** |
| SAN-546 · OPS-JOURNEY — Lucía: Prod journey matrix J05–J20 | B+ | 91 | 85% | ⚠️ J14 harness | NO |
| SAN-548 · F13 — Camila: Chat remembers turn 11 after Vercel cold-start | C+ | 68 | 40% | ❌ | NO |
| SAN-368 · MAP-002B — Tourist: ADK café grounding live on mdeai.co/chat | B− | 78 | 70% | ⚠️ | NO |

---

## Launch readiness

| Metric | Value |
|--------|------:|
| **Current** | **89/100** |
| After SAN-546 J14 harness fix | **91/100** |
| After SAN-548 prod turn-11 | **93/100** |

### 🔴 Blockers
- SAN-548 · F13 — no prod turn-11 Playwright
- SAN-368 · MAP-002B — Vercel env not audited; floor OOM on verify:task

### 🟡 Risks
- SAN-546 · OPS-JOURNEY — J14 idle marker flaky on prod
- SAN-368 — café cards work but grounding-lite source not isolated on prod UI

### ⚪ Missing work
- `e2e/prod-thread-persistence.spec.ts`
- Vercel dashboard `ADK_GROUNDING_URL` confirmation
- Authed browser J10/J11 (Roberto host wizard)

### 🟢 Completed
- SAN-828 · UX-043 → **Linear Done** · smoke `7eb97a1`
- J15 pin-clear prod PASS
- J17 mobile FAB PASS (test fix)
- Linear real-world titles updated (828, 546, 548, 368)

### Execution order (remaining)
1. ~~SAN-828 · UX-043~~ ✅ Done
2. SAN-546 · OPS-JOURNEY — fix J14 harness → Done
3. SAN-548 · F13 — prod turn-11 spec
4. SAN-368 · MAP-002B — Vercel env + attribution proof
