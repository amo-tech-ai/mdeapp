# CORE Foundation Forensic Audit — 2026-06-08

**Source:** [`linear/markdown/core.md`](../markdown/core.md) (21 issues)  
**Verified against:** `mdeapp/src/**` · `e2e/**` · `.github/workflows/**` · `tasks/testing/**` · `tasks/events/**` · skills (`copilotkitV1`, `gemini`, `mastra`, `mde-maps`, `mde-supabase`, `stripe-best-practices`, `task-verifier`)

**Legend:** 🟢 Complete · 🟡 In progress / partial · ⚪ Not started (grey) · 🔴 Failed / dup / blocker

**% Correct** = spec accuracy (40%) + status vs disk (40%) + stack alignment (20%)  
**Score** = round(% Correct) · **Grade:** A+≥95 · A≥90 · B≥80 · C≥70 · D≥60 · F<60

---

## Executive Verdict

| Metric | Tracker says | Forensic | Grade |
|--------|-------------|----------|-------|
| **Overall CORE** | 57/100 · 43% done | **64/100 · spec 81%** | D |
| **Section: Auth** | 70 C | 88 B | Strong |
| **Section: Database** | 100 A+ | 100 A+ | Accurate |
| **Section: Maps** | 51 F | 72 C | SAN-368 WIP OK |
| **Section: Agents** | 47 F | 58 F | SAN-548 mis-scored |
| **Section: Testing** | 28 F | 52 F | SAN-546 partial |
| **Section: Production** | 20 F | 42 F | **Under-scoped** |

**One-line:** Database and auth are launch-grade; **payments + journey matrix + thread evidence** are the CORE holes — not maps.

---

## Tracker Errors (meta red flags)

| # | Error | Impact |
|---|-------|--------|
| 1 | **No Payments section** — SAN-115/116 absent; only SAN-178 | Andrés G1 invisible on CORE board |
| 2 | **SAN-548 ⚪ Todo** while `storage.ts` Postgres shipped (F13) | False blocker; needs 🟡 + evidence |
| 3 | **SAN-100 🔴 dup** still listed in summary counts | Inflates 🔴; should be excluded |
| 4 | **SAN-546 ⚪** while 4-query prod synthetic ✅ (SAN-462) | Under-credits partial work |
| 5 | **SAN-95 ⚪** while `evaluationAgent` on disk | Stale status |
| 6 | **SAN-460 tech = Google Maps JS** | Wrong label — CI/security |
| 7 | **Agent tech = Mastra + LibSQL** | Prod uses **Postgres** (`@mastra/pg`) |
| 8 | **Implementation order** omits Payments between Testing → Production | Wrong P0 pull |
| 9 | **J05–J08** claimed in `09-prod-live-journey-matrix.md` but `prod-venues-journey.spec.ts` **missing** | Doc/disk drift |

---

## Red Flags · Failure Points · Blockers

| Sev | ID | Failure mode | Persona |
|-----|-----|--------------|---------|
| 🔴 | **SAN-178** | Live paid ticket unproven on prod | Andrés |
| 🔴 | **SAN-115** | EVP-001 ledger missing from `core.md` entirely | Patricia |
| 🔴 | **SAN-546** | J09–J20 unpaid/automated; J05–J08 spec file missing | Lucía |
| 🔴 | **SAN-407** | `rental-clarify-copy.ts` canned bypass still live | Camila |
| 🟡 | **SAN-548** | Code ~85%; prod turn-11 evidence 0% | Camila |
| 🟡 | **SAN-368** | ADK prod env incomplete; fallback masks outage | Tourist |
| 🟡 | **SAN-458** | `floor.yml` exists; branch protection unverified | Sofía |
| 🔴 | **SAN-100** | Duplicate of SAN-462 — cancel in Linear | — |
| 🟡 | **SAN-406** | Blocked SAN-412/407; overlaps CHAT SAN-823 | Camila |

---

## Critical Fixes (ordered)

| # | Fix | Verify |
|---|-----|--------|
| 1 | Add **Payments & Launch Proof** section to `core.md`: SAN-115, SAN-116, SAN-178 | Regenerate tracker |
| 2 | Run **Andrés G1** on prod → `tasks/notes/EVP-001-proof-ledger.md` | Stripe webhook + `/me/tickets` QR |
| 3 | **SAN-546**: create `e2e/prod-journey-j05-j20.spec.ts` (doc claims file exists — it does not) | J05–J20 PASS on mdeai.co |
| 4 | **SAN-548**: turn-11 cold-start Playwright + prod screenshot | `tasks/evidence/` |
| 5 | **SAN-407** + **SAN-823**: remove canned rental clarify path | `apartments in laureles` <45s |
| 6 | Cancel **SAN-100** in Linear | Dedupe SAN-462 |
| 7 | Flip **SAN-548** → 🟡 In Progress in Linear | Match disk |
| 8 | Flip **SAN-95** → 🟡 (agent on disk; Vercel preset TBD) | task-verifier |
| 9 | **SAN-460**: pin `actions/checkout@<sha>` | Supply-chain |
| 10 | Fix **SAN-460** tech label → `GitHub Actions` | Hygiene |

---

## Missing from CORE (should be added)

| Proposed | SAN / ID | Why CORE |
|----------|----------|----------|
| EVP-001 proof ledger | SAN-115 | P0 north star gate |
| Stripe webhook audit | SAN-116 | Done — must appear on CORE |
| JWT → Mastra RequestContext | SAN-547 | Tool auth on server |
| Rental embed 403 fix | SAN-545 | Hybrid search blocker |
| CopilotKit smoke contract | SAN-828 | Prod monitor 401 |
| CHAT validation gate | SAN-829 | Launch 8.3→9.0 |

---

## Per-Task Audit (21) — % Correct · Score · Grade

### 🔐 Auth, Security & RLS (3) — section avg **88%**

| Dot | ID | Title | % Correct | Score | Grd | Red flag / disk proof |
|-----|-----|-------|----------:|------:|-----|------------------------|
| 🟢 | SAN-339 | search_path hardening batch | 100 | 100 | A+ | Migrations `set search_path` ✓ |
| 🟢 | SAN-367 | Production auth checklist | 100 | 100 | A+ | Jun 06 evidence ✓ |
| ⚪ | SAN-531 | SECURITY DEFINER RPC hardening | 74 | 74 | C | Follow-on to 339; valid Medium |

### 🗄️ Database, Schema & Data (4) — section avg **100%**

| Dot | ID | Title | % Correct | Score | Grd | Red flag / disk proof |
|-----|-----|-------|----------:|------:|-----|------------------------|
| 🟢 | SAN-340 | Edge function freeze matrix | 100 | 100 | A+ | Guest-lead guard ✓ |
| 🟢 | SAN-404 | Turn-1 intent schema | 100 | 100 | A+ | Routing schema ✓ |
| 🟢 | SAN-462 | Beta soak gate (3× prod synthetic) | 100 | 100 | A+ | `prod-synthetic-smoke.spec.ts` + cron ✓ |
| 🟢 | SAN-459 | Migration-filename lint CI | 100 | 100 | A+ | CI hook ✓ |

### 🗺️ Maps & Grounding (4) — section avg **72%**

| Dot | ID | Title | % Correct | Score | Grd | Red flag / disk proof |
|-----|-----|-------|----------:|------:|-----|------------------------|
| 🟢 | SAN-369 | Map ID on production | 100 | 100 | A+ | `getGoogleMapsMapId()` ✓ |
| 🟡 | SAN-368 | ADK grounding on production | 70 | 70 | C | `adk-grounding-client.ts` + fallback tests; prod env WIP |
| ⚪ | SAN-406 | Neighborhood clarify routing | 80 | 80 | B | Spec OK; blocked 412/407; overlaps CHAT |
| ⚪ | SAN-460 | SHA-pin GitHub Actions | 28 | 28 | F | **Wrong tech tag**; still `checkout@v4` not SHA |

### 🤖 Agent Infrastructure (6) — section avg **58%**

| Dot | ID | Title | % Correct | Score | Grd | Red flag / disk proof |
|-----|-----|-------|----------:|------:|-----|------------------------|
| 🟢 | SAN-405 | Rental budget + June dates parse | 100 | 100 | A+ | Parser tests ✓ |
| 🟢 | SAN-408 | Hero query regression suite | 100 | 100 | A+ | Vitest regression ✓ |
| ⚪ | SAN-407 | Remove canned rental clarify bypass | 86 | 86 | B | **Spec A; impl 0%** — `rental-clarify-copy.ts` live |
| 🟡 | SAN-548 | Thread persistence cold-start | **64** | 64 | D | **Tracker wrong** — Postgres `storage.ts` ✓; turn-11 proof ✗ |
| 🟡 | SAN-95 | Port evaluationAgent + scorers | **52** | 52 | F | **Tracker wrong** — `evaluation.ts` on disk; allowlist excludes from CK ✓ |
| ⚪ | SAN-96 | Auto-review calibration | 68 | 68 | D | Dev tooling; post-launch OK |

### 🧪 Testing & CI (3) — section avg **55%**

| Dot | ID | Title | % Correct | Score | Grd | Red flag / disk proof |
|-----|-----|-------|----------:|------:|-----|------------------------|
| 🟡 | SAN-458 | Floor + branch protection | 80 | 80 | B | `.github/workflows/floor.yml` ✓; GH branch rules TBD |
| 🟡 | SAN-546 | Prod journey J05–J20 | **38** | 38 | F | **4/20 auto** (462); `live-audit-verticals` partial; **J05–J08 spec missing** |
| 🔴 | SAN-100 | Production smoke matrix | 0 | 0 | F | **Dup SAN-462** — cancel |

### 🚀 Production & Launch (1) — section avg **42%**

| Dot | ID | Title | % Correct | Score | Grd | Red flag / disk proof |
|-----|-----|-------|----------:|------:|-----|------------------------|
| ⚪ | SAN-178 | Live ticket purchase on production | 42 | 42 | F | Checkout modal + API on disk ✓; **prod paid proof 0%** |

*Missing rows: SAN-115 (ledger), SAN-116 (webhook Done)*

---

## Summary Table (corrected vs tracker)

| Section | Issues | 🟢 | 🟡 | ⚪ | 🔴 | Tracker Score | **Forensic %** | **Forensic Score** | Grd |
|---------|-------:|---:|---:|---:|---:|-------------:|---------------:|-------------------:|-----|
| Auth | 3 | 2 | 0 | 1 | 0 | 70 | 88 | 88 | B |
| Database | 4 | 4 | 0 | 0 | 0 | 100 | 100 | 100 | A+ |
| Maps | 4 | 1 | 1 | 2 | 0 | 51 | 72 | 72 | C |
| Agents | 6 | 2 | **2** | 2 | 0 | 47 | 58 | 58 | F |
| Testing | 3 | 0 | **2** | 0 | 1 | 28 | 55 | 55 | F |
| Production | 1 | 0 | 0 | 1 | 0 | 20 | 42 | 42 | F |
| **TOTAL** | **21** | **9** | **5** | **6** | **1** | **57** | **81** spec / **64** weighted | **D** |

**Completion (forensic):** 9 Done + 5 Partial = **67% started**, **43% fully Done** (matches tracker Done count but 5 should be 🟡)

---

## Skill Compliance (CORE-relevant)

| Skill | CORE tasks | Pass | Fail |
|-------|------------|------|------|
| **mde-supabase** | 339, 340, 367, 531 | 🟢 RLS + search_path | SAN-531 open |
| **mde-maps** | 369, 368, 406 | 🟢 mapId + field masks | ADK prod WIP |
| **gemini** | 405, 407, 408, 95, 96 | 🟢 flash-only agents | SAN-407 bypass |
| **mastra** | 405, 407, 548, 95 | 🟢 Postgres storage | 548 evidence |
| **copilotkitV1** | 548 | 🟡 threadId + provider | cold-start proof |
| **stripe-best-practices** | 178 | 🟡 Sessions on disk | G1 prod proof |
| **task-verifier** | all 🟢 | 7/9 gates on Done rows | 548, 95, 546 status wrong |

---

## Improvements (CORE-specific)

1. **Restructure `core.md`** → 7 sections: Auth · DB · Maps · Agents · Testing · **Payments** · Production
2. **Status sync script** — disk probe → suggest Linear state (548, 95, 546)
3. **SAN-546 scope split** — SAN-462 = J01–J04 Done; SAN-546 = J05–J20 only (reduce confusion)
4. **Evidence links** on every 🟢 row (path to `tasks/testing/evidence/`)
5. **Dependency graph** — SAN-178 blocked_by SAN-115 in tracker
6. **Remove SAN-100** from issue count in summary generator
7. **Tech column fix** in `generate.py` for SAN-460, agent Postgres label
8. **P0 blockers list** — insert SAN-115 above SAN-178

---

## Correct P0 Pull Order (CORE only)

```
SAN-115 EVP-001 ledger
  → SAN-178 G1 prod paid ticket
  → SAN-546 J05–J20 (fix missing spec file first)
  → SAN-548 turn-11 evidence (close or Done)
  → SAN-407 + SAN-406 clarify (or SAN-823 CHAT)
  → SAN-368 ADK prod env
  → SAN-458 branch protection merge gate
  → SAN-531, SAN-460, SAN-95, SAN-96 (post-launch / hygiene)
```

---

## Final Questions

| Q | Answer |
|---|--------|
| Critical missing? | **Partial** — tracker patched 2026-06-08; still need J05–J20 spec + aie-001 ledger evidence |
| Tracker accurate? | **~82%** post-sync — statuses fixed; SAN-115/116/547 in Core Foundation; SAN-178 blockedBy SAN-115 |
| Implementation order? | **Partially wrong** — payments omitted |
| Launch without CORE gaps? | **No** — Andrés + Lucía gates open |
| Top 3 actions? | SAN-115 ledger · SAN-178 prod pay · SAN-546 spec+run |

---

**CORE forensic score: 64/100 (D)** · **Spec quality: 81/100 (B)** · **Disk alignment: 55/100 (F)**

## 12. Linear sync — 2026-06-08

| Action | Issues |
|--------|--------|
| 🟡 → In Progress | SAN-548, SAN-95, SAN-546 |
| Added to [Core Foundation](https://linear.app/sanjiovani/project/core-foundation-3a69b76c57ca/issues) | SAN-115, SAN-116, SAN-547 |
| blockedBy SAN-115 | SAN-178 |
| `core.md` patched | Payments section · SAN-547 auth · status/score corrections |

*Pair with [`june-8-audit-tasks.md`](./june-8-audit-tasks.md) for MVP*
