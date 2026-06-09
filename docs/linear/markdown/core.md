# 🏗️ CORE Foundation — Implementation Tracker
> Phase 1 Critical Path | Updated: 2026-06-08 (audit patch) | Cycle 1: Jun 8–22 2026

**Legend:** 🟢 Complete · 🟡 In Progress · ⚪ Not Started · 🔴 Failed/Canceled/Duplicate

> **Correct implementation order:** Auth → DB/Schema → Maps → Agents → Testing → **Payments** → Production proof

**Audit:** [`linear/audit/08-core-audit.md`](../audit/08-core-audit.md) · **Linear:** [Core Foundation project](https://linear.app/sanjiovani/project/core-foundation-3a69b76c57ca/issues)

---

## 🔐 Auth, Security & RLS
> 4 issues · 🟢 2 done · 🟡 0 WIP · ⚪ 2 not started · Score: **78/100 C**

| Status | ID | Title / Purpose | Tech | Priority | % OK | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-----:|------:|-------|-------|
| 🟢 | [SAN-339](https://linear.app/sanjiovani/issue/SAN-339) | Postgres function search_path hardening batch | PostgreSQL | Urgent | 100 | 100 | A+ | ✓ May 30 |
| 🟢 | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) | Production auth checklist | Supabase Auth | High | 100 | 100 | A+ | ✓ Jun 06 |
| ⚪ | [SAN-547](https://linear.app/sanjiovani/issue/SAN-547) | JWT → Mastra RequestContext for tools | Supabase Auth | Urgent | 42 | 42 | F | Blocks VEN-019 HITL |
| ⚪ | [SAN-531](https://linear.app/sanjiovani/issue/SAN-531) | Harden SECURITY DEFINER / mutable-search_path RPCs… | PostgreSQL | Medium | 74 | 74 | C | Follow-on to SAN-339 |

## 🗄️ Database, Schema & Data
> 4 issues · 🟢 4 done · 🟡 0 WIP · ⚪ 0 not started · Score: **100/100 A+**

| Status | ID | Title / Purpose | Tech | Priority | % OK | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-----:|------:|-------|-------|
| 🟢 | [SAN-340](https://linear.app/sanjiovani/issue/SAN-340) | Edge function MVP freeze matrix + guest-lead abuse… | PostgreSQL | Urgent | 100 | 100 | A+ | ✓ May 30 |
| 🟢 | [SAN-404](https://linear.app/sanjiovani/issue/SAN-404) | Turn-1 chat routing — one intent schema for rental… | PostgreSQL | Urgent | 100 | 100 | A+ | ✓ Jun 01 |
| 🟢 | [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) | Stable Beta soak gate (3× scheduled prod synthetic… | PostgreSQL | Urgent | 100 | 100 | A+ | ✓ Jun 05 · J01–J04 |
| 🟢 | [SAN-459](https://linear.app/sanjiovani/issue/SAN-459) | Migration-filename lint in CI | PostgreSQL | Medium | 100 | 100 | A+ | ✓ Jun 01 |

## 🗺️ Maps & Grounding
> 4 issues · 🟢 1 done · 🟡 1 WIP · ⚪ 2 not started · Score: **68/100 D**

| Status | ID | Title / Purpose | Tech | Priority | % OK | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-----:|------:|-------|-------|
| 🟢 | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) | Map ID on production | Google Maps JS | High | 100 | 100 | A+ | ✓ Jun 03 |
| 🟡 | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | ADK grounding on production | Google Maps JS | High | 70 | 70 | C | Cloud Run + Vercel env WIP |
| ⚪ | [SAN-406](https://linear.app/sanjiovani/issue/SAN-406) | Neighborhood clarify — not generic budget/dates re… | Gemini 3.5 Flash | Urgent | 80 | 80 | B | Blocked: SAN-412, SAN-407 · CHAT SAN-823 |
| ⚪ | [SAN-460](https://linear.app/sanjiovani/issue/SAN-460) | SHA-pin GitHub Actions | GitHub Actions | Medium | 28 | 28 | F | After SAN-462 ✓ |

## 🤖 Agent Infrastructure
> 6 issues · 🟢 2 done · 🟡 2 WIP · ⚪ 2 not started · Score: **62/100 D**

| Status | ID | Title / Purpose | Tech | Priority | % OK | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-----:|------:|-------|-------|
| 🟢 | [SAN-405](https://linear.app/sanjiovani/issue/SAN-405) | Parse Camila's monthly rental budget + June dates … | Mastra + Postgres | Urgent | 100 | 100 | A+ | ✓ Jun 01 |
| 🟢 | [SAN-408](https://linear.app/sanjiovani/issue/SAN-408) | Regression suite — hero queries never hit wrong pa… | Gemini 3.5 Flash | Urgent | 100 | 100 | A+ | ✓ Jun 01 |
| ⚪ | [SAN-407](https://linear.app/sanjiovani/issue/SAN-407) | Remove canned rental clarify bypass before concier… | Gemini 3.5 Flash | Urgent | 86 | 86 | B | `rental-clarify-copy.ts` still live |
| 🟡 | [SAN-548](https://linear.app/sanjiovani/issue/SAN-548) | Thread persistence across Vercel cold-start | CopilotKit 1.55.2 | Urgent | 64 | 64 | D | Postgres `storage.ts` ✓ · turn-11 prod proof open |
| 🟡 | [SAN-95](https://linear.app/sanjiovani/issue/SAN-95) | Port evaluationAgent + scorers + Vercel deploy pre… | Gemini 3.5 Flash | High | 52 | 52 | F | Agent on disk · Vercel preset TBD |
| ⚪ | [SAN-96](https://linear.app/sanjiovani/issue/SAN-96) | Auto-review — manual calibration (rules + subagent… | Gemini 3.5 Flash | High | 68 | 68 | D | Post-MVP dev tooling |

## 🧪 Testing & CI
> 2 active · 🟢 0 done · 🟡 2 WIP · ⚪ 0 not started · Score: **86/100 B**

| Status | ID | Title / Purpose | Tech | Priority | % OK | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-----:|------:|-------|-------|
| 🟡 | [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) | Floor + review branch protection | Vitest + Playwright | High | 80 | 80 | B | `floor.yml` ✓ · GH branch rules TBD |
| 🟡 | [SAN-546](https://linear.app/sanjiovani/issue/SAN-546) | Prod live journey matrix J05–J20 | Vitest + Playwright | Urgent | 91 | 91 | B+ | J15/J17 PASS prod · J14 harness flake · PR #140 |

> 🔴 **Archived duplicate:** [SAN-100](https://linear.app/sanjiovani/issue/SAN-100) Production smoke matrix — dup [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) · excluded from counts

## 🛒 Payments & Launch Proof
> 3 issues · 🟢 1 done · 🟡 0 WIP · ⚪ 2 not started · Score: **47/100 F**

| Status | ID | Title / Purpose | Tech | Priority | % OK | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-----:|------:|-------|-------|
| ⚪ | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | EVP-001 production proof ledger (G1+G2+G3) | Stripe + Next.js | Urgent | 45 | 45 | F | **#1 launch gate** · blocks SAN-178 |
| 🟢 | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) | Stripe webhook secret isolation | Stripe + Next.js | Urgent | 100 | 100 | A+ | ✓ Jun 06 |
| ⚪ | [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) | Live ticket purchase on production (G1 Andrés) | Stripe + Next.js | Urgent | 42 | 42 | F | Checkout on disk · **prod paid proof 0%** |

---

## 📊 Core Foundation Summary

| Section | Issues | 🟢 Done | 🟡 WIP | ⚪ Not Started | 🔴 Dup | Avg Score | Grade |
|---------|--------|---------|--------|--------------|--------|-----------|-------|
| 🔐 Auth, Security & RLS | 4 | 2 | 0 | 2 | 0 | 78 | C |
| 🗄️ Database, Schema & Data | 4 | 4 | 0 | 0 | 0 | 100 | A+ |
| 🗺️ Maps & Grounding | 4 | 1 | 1 | 2 | 0 | 68 | D |
| 🤖 Agent Infrastructure | 6 | 2 | 2 | 2 | 0 | 62 | D |
| 🧪 Testing & CI | 2 | 0 | 2 | 0 | 1† | 86 | B |
| 🛒 Payments & Launch Proof | 3 | 1 | 0 | 2 | 0 | 47 | F |
| **TOTAL (active)** | **23** | **10** | **5** | **8** | — | **74** | **C** |

† SAN-100 duplicate excluded from active totals

**Overall Score: 74/100 — Grade: C | Completion: 43% Done · 65% started (incl. WIP)**


### 🔴 Top Blockers (P0 pull order)

1. ⚪ **SAN-115** — EVP-001 production proof ledger `Urgent` · **start here**
2. ⚪ **SAN-178** — Live ticket purchase on production `Urgent` · blocked by SAN-115
3. 🟡 **SAN-546** — Prod live journey matrix J05–J20 `Urgent`
4. 🟡 **SAN-548** — Thread persistence prod evidence `Urgent`
5. ⚪ **SAN-407** — Remove canned rental clarify bypass `Urgent`
6. ⚪ **SAN-406** — Neighborhood clarify routing `Urgent`
7. ⚪ **SAN-547** — JWT → Mastra RequestContext `Urgent`
8. 🟡 **SAN-368** — ADK grounding on production `High`
9. 🟡 **SAN-458** — Floor + branch protection `High`

### ✅ Ready to start (unblocked)

- **SAN-115** — Create `tasks/testing/evidence/…/aie-001-ledger.md`
- **SAN-546** — Add `e2e/prod-journey-j05-j20.spec.ts` (doc referenced file missing)
- **SAN-548** — Turn-11 cold-start Playwright + prod screenshot
- **SAN-407** — Remove `RENTAL_CLARIFY_MESSAGE` fast-path
