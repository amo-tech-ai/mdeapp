---
title: Production-ready ship checklist — 26 May 2026
repo: /home/sk/mdeai/mdeapp
base_sha: a4c1ecb
branch: ship/may27-maps-events
updated: 2026-05-27T04:46
skills: ../../../index-skills.md
ledger: ../COMMIT-LEDGER.md
---

# 26 May — Progress Task Tracker

**Legend:** 🟢 complete · 🟡 conditional / in progress · 🔴 failed / blocker · ⚪ not started

**Overall ship readiness: 72/100** — code strong; **3/7 commits** on branch; push/deploy not done.

| Metric | Value | Dot |
|--------|------:|:---:|
| Commits on branch | **3 / 7** (43%) | 🟡 |
| Code on disk (full stack) | ~100% | 🟢 |
| Git ship complete | 43% | 🟡 |
| Push / Vercel / prod | 0% | ⚪ |

---

## Five-step audit (ship stack C-000 → C-006)

| Step | Question | Status |
|------|----------|--------|
| **1. Examine** | What is done on disk vs committed? | 3 SHAs on branch; ~62 paths still uncommitted |
| **2. Verify** | Each commit scoped and tested? | C-000–C-002 verified; C-003–006 pending |
| **3. Validate** | Proof (commands + SHAs)? | Below per commit |
| **4. Measure** | % complete per commit? | Table below |
| **5. Identify** | Missing / failing for 100%? | [Path to 100%](#path-to-100-ship-ready) |

---

## Summary table (top)

| Area | % | Dot | Notes |
|------|--:|:---:|-------|
| **Ship commits (git)** | **43%** | 🟡 | C-000–C-002 done |
| Code on disk | 100% | 🟢 | Full stack present |
| Unit tests (tip + disk) | 100% | 🟢 | 263/263 |
| Lint / build / floor (disk) | 100% | 🟢 | Pass before C-003 commit |
| Junk guard | 100% | 🟢 | C-000 `f993b81` — `supabase/.temp/` ignored |
| Places / maps (committed slices) | 94% | 🟢 | C-001 + C-002 verified |
| Grounding (committed) | 0% | ⚪ | C-003 next |
| Chat + events (committed) | 0% | ⚪ | C-004–C-005 |
| Rental map smokes | 0% | 🔴 | Waive in PR or fix |
| Push / preview / prod | 0% | ⚪ | After C-006 + floor |

---

## Per-commit audit (Examine → Verify → Validate → Measure)

| ID | SHA | Examine | Verify | Validate (proof) | % | Dot | Prod |
|----|-----|---------|--------|------------------|--:|:---:|-----:|
| **C-000** | `f993b81` | `.gitignore` only; 1 file | No map files; chore scope | `git check-ignore supabase/.temp/cli-latest` → match; `npm run lint` exit 0 | **100%** | 🟢 | 98 |
| **C-001** | `fec2a8f` | 29 files maps/platform | Unit pass; forbidden paths excluded | `npm test` map-clustering/map-pin/clustered — 20 tests; rental smoke **FAIL** (agent, not maps) | **95%** | 🟢 | 88 |
| **C-002** | `ef8c540` | 17 files Places only | Field masks; proxy `/api/places/photo`; no frontend `key=` URLs | `npm test` places/parse-grounded/places-photo — **36 tests**; lint exit 0 | **100%** | 🟢 | **94** |
| **C-003** | — | **32 paths** staged (corrected) | Router + ADK server-only; **exclude** fetch/sync + chat/events/renders | 31 unit tests + `build` + `smoke:grounding-attribution` PASS (2026-05-27) | **98%** ready | 🟢 | 90 |
| **C-004** | — | ~18 paths on disk | Needs C-001–003; S1/S2 tool names | *Pending:* `npm run build`; `curl :3001/`; POST `/api/copilotkit` | **80%** ready | 🟡 | 78 |
| **C-005** | — | ~11 paths on disk | Fast path; perf script | *Pending:* `perf-events-chat-latency.mjs` PASS on disk | **86%** ready | 🟡 | 86 |
| **C-006** | — | package, lock, `.env.example`, docs | Placeholders only; last commit | *Pending:* `npm run floor` on tip | **90%** ready | 🟡 | 90 |

**Stack commit progress:** **43%** (3/7). **Weighted ship-ready:** **72/100**.

---

## C-002 verdict (confirmed)

Your **94/100** score is correct.

| Check | Dot | Proof |
|-------|:---:|-------|
| Places-only scope (17 files) | 🟢 | `ef8c540` — no chat/grounding/events |
| `X-Goog-FieldMask` | 🟢 | `google-places-client.ts` + tests |
| Photo proxy (no browser key) | 🟢 | `placesPhotoProxyUrl` → `/api/places/photo` |
| Rate limit | 🟢 | `places-photo-rate-limit` + tests |
| 36 tests + lint | 🟢 | 2026-05-27 run |
| Push | 🔴 | 4 commits remain |

---

## C-003 — next (GO with checks)

**Readiness: 82–85/100** before commit — correct assessment.

| Risk | Sev | Mitigation |
|------|:---:|------------|
| ~35 files | 🟡 | One domain only; optional C-003a/b split |
| ADK sidecar | 🟡 | Smoke CONDITIONAL if sidecar down |
| `ENABLE_SEARCH_GROUNDING=0` default | 🟢 | Safe — enable only in env |
| Staging chat / `search-tool-renders` | 🔴 | **Exclude** — C-004 |
| Staging `.env.local` / `.env.example` | 🔴 / 🟡 | Never / C-006 |
| ADK token in browser | 🔴 | Server env only (`mde-supabase`, ADK skill) |

### Staging paths (from [COMMIT-LEDGER](../COMMIT-LEDGER.md) § C-003)

Include: ledger § C-003 (32 files). **Exclude:** `event-web-citation-fetch.tsx`, `event-web-citation-sync.tsx` → **C-004** (need `webCitations` on `event-search-results-context.tsx` or build fails).

Include: scripts, `e2e/maps-grounding.spec.ts`, `src/app/api/grounding/`, mastra agent/lib/tools, `web-citation-list.tsx`, `web-citations-display.ts`.

**Must include:** `src/mastra/tools/search-grounded-places.ts` (left unstaged after C-002).

### Pre-commit commands

```bash
cd /home/sk/mdeai/mdeapp
# stage C-003 paths only (see ledger)
git diff --cached --name-only

git diff --cached --name-only | grep -E '(^\.env|supabase/\.temp|^tmp/|src/components/chat|search-tool-renders|src/app/api/events)' && echo "STOP" || echo "OK"

npm test -- --run attach-web-grounding search-intent search-web-grounded concierge adk-grounding
SMOKE_GROUNDING_QUERY="list cafes in medellin" npm run smoke:grounding-attribution
npm run lint

git commit -m "feat(agent): search router, ADK grounding, and concierge tools (C-003)"
```

---

## Global gates

| # | Gate | Result | Dot | % |
|---|------|--------|:---:|--:|
| G1 | Code on disk | ~62 paths left | 🟢 | 100% |
| G2 | `npm test -- --run` | 263/263 | 🟢 | 100% |
| G3 | `npm run lint` | exit 0 | 🟢 | 100% |
| G4 | `npm run floor` (disk) | exit 0 | 🟢 | 100% |
| G5 | Branch `ship/may27-maps-events` | exists | 🟢 | 100% |
| G6 | Commits + SHAs | **3/7** in ledger | 🟡 | 43% |
| G7 | Grounding smoke (disk) | PASS (prior) | 🟢 | 100% |
| G8 | Events perf (disk) | PASS (prior) | 🟢 | 100% |
| G9 | Rental map smokes | FAIL | 🔴 | 0% |
| G10 | Gate 9 localhost | partial | 🟡 | 80% |
| G11 | Push + Vercel | not done | ⚪ | 0% |
| G12 | Junk guard | `git check-ignore` OK | 🟢 | 100% |

---

## Pre-push checklist

| Step | Done | Dot |
|------|:----:|:---:|
| Branch `ship/may27-maps-events` | ☑ | 🟢 |
| C-000 `f993b81` | ☑ | 🟢 |
| C-001 `fec2a8f` | ☑ | 🟢 |
| C-002 `ef8c540` | ☑ | 🟢 |
| C-003 | ☐ | 🟡 **next** |
| C-004 | ☐ | ⚪ |
| C-005 | ☐ | ⚪ |
| C-006 | ☐ | ⚪ |
| SHAs in COMMIT-LEDGER | ☐ | 🟡 3/7 |
| `npm run floor` on tip | ☐ | 🟡 |
| Rental smoke waiver in PR | ☐ | 🔴 |
| ADK/Gemini Vercel preview env doc | ☐ | 🟡 |
| `git push -u origin ship/may27-maps-events` | ☐ | ⚪ |
| Vercel preview HTTP 200 | ☐ | ⚪ |

---

## Path to 100% (ship-ready)

| # | Requirement | Owner | Dot |
|---|-------------|-------|:---:|
| 1 | Commit **C-003** with staged-file review + tests/smoke | next | 🟡 |
| 2 | Commit **C-004** — verify CopilotKit runtime + tool names | | ⚪ |
| 3 | Commit **C-005** — perf script on tip | | ⚪ |
| 4 | Commit **C-006** — floor on tip; `.env.example` placeholders only | | ⚪ |
| 5 | `git status` clean (only intentional untracked outside stack) | | ⚪ |
| 6 | `npm run floor` exit 0 on branch tip | | 🟡 on disk now |
| 7 | PR: rental smoke **waiver** or fix documented | | 🔴 |
| 8 | PR: Vercel preview env (`ADK_*`, `GOOGLE_GENERATIVE_AI_API_KEY`) | | ⚪ |
| 9 | Push branch; CI green; preview ● Ready | | ⚪ |
| 10 | Merge + prod verify (out of scope for local commits) | | ⚪ |

**100% local ship stack** = rows 1–6 complete. **100% production** = all 10 + merge gate.

---

## Red flags (open)

| Flag | Sev | Dot | Status |
|------|:---:|:---:|--------|
| C-003 staging mistakes | 🔴 | 🟡 | Review `git diff --cached` |
| C-001/C-003 file count | 🟡 | 🟡 | Document in PR |
| Rental smokes | 🟡 | 🔴 | Not blocking C-003 |
| ADK off by default | 🟡 | 🟢 | Correct for safety |
| Service role in `src/mastra` | 🟡 | 🟡 | No expansion in this PR |

---

## Stack SHAs (proof log)

```text
branch:     ship/may27-maps-events
base:       a4c1ecb (origin/main)
C-000:      f993b81  chore: ignore supabase CLI temp cache (C-000)
C-001:      fec2a8f  feat(maps): category markers, clustering, and pin sync (C-001)
C-002:      ef8c540  feat(places): Places client, photo proxy, and grounded cards (C-002)
remaining:  ~62 paths (chat, grounding, events, chore)
npm test:   263/263 (2026-05-27)
git check-ignore supabase/.temp/cli-latest → .gitignore:60
```

---

## GO / NO-GO

| Action | Verdict |
|--------|---------|
| **C-003 commit** | 🟢 **GO** with staged-file + forbidden-path checks |
| Push | 🔴 **NO-GO** |
| Production | 🔴 **NO-GO** |
| Your C-002 / C-003 analysis | 🟢 **Correct** |

---

## CTI (separate track)

Coffee Tour Intelligence specs ~**92/100** — not part of this ship PR. See [../../audit/31-agent-tasks.md](../../audit/31-agent-tasks.md) and [26-may-notes.md](./26-may-notes.md).

---

## Related docs

| Doc | Use |
|-----|-----|
| [../COMMIT-LEDGER.md](../COMMIT-LEDGER.md) | Staging paths + SHA |
| [../CHECKLIST.md](../CHECKLIST.md) | Per-commit gate probes |
| [../audits/C-003-grounding.md](../audits/C-003-grounding.md) | C-003 forensic |
| [26-may-notes.md](./26-may-notes.md) | Short notes + CTI |
