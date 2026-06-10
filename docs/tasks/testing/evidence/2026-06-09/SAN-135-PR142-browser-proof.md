# SAN-135 · PR #142 — Browser proof before merge

**Date:** 2026-06-09  
**PR:** [#142](https://github.com/amo-tech-ai/mdeapp/pull/142) — `fix(events): normalize host display snapshot (SAN-135)`  
**Branch:** `ai/san-135-normalize-host-display`  
**Event:** `/events/reina-de-antioquia-2026-finals`

---

## PR scope verified

| File | Change |
|------|--------|
| `supabase/functions/approval-commit/build-event-insert.ts` | `avatar_url?.trim() \|\| null` |
| `src/__tests__/build-event-insert.test.ts` | whitespace avatar test |
| `src/lib/events/get-public-event.ts` | remove unused `venue_id` from `EventRow` |

No migration · no UI layout · no SAN-492.

---

## Automated tests

| Command | Result |
|---------|--------|
| `npm test -- --run event` | **113/113** pass |
| SCREEN-014 (excl. pre-existing 404) | **4/5** pass — mobile buy bar flaky once; structured mobile smoke **PASS** |

---

## Preview note

| URL | HTTP | Note |
|-----|------|------|
| `mdeapp-git-ai-san-135-normalize-host-display-amo100.vercel.app/...` | **401** | Vercel Deployment Protection (SSO login wall) |
| `http://localhost:3001/...` on PR branch | **200** | **Code-equivalent preview** — same commit as PR head |

---

## Browser proof matrix

| Check | Preview (localhost PR branch) | Production |
|-------|--------------------------------|------------|
| HTTP 200 | ✅ desktop + mobile | ✅ desktop + mobile |
| host block | ✅ | ✅ Ana Martinez |
| venue section | ✅ | ✅ Hotel Intercontinental — Salón Real |
| tickets (≥1 tier) | ✅ 4 tiers | ✅ 4 tiers |
| checkout modal | ✅ desktop Buy + mobile bar CTA | ✅ desktop + mobile |
| mobile buy bar | ✅ @390×844 | ✅ @390×844 |
| console errors | ✅ 0 | 🟡 1 (pre-existing; not PR regression) |
| network 5xx | ✅ 0 | ✅ 0 |

**Browser MCP (prod desktop):** Hosted by + Venue + Buy tickets → checkout modal with Full name / Email / Pay with Stripe.

---

## Screenshots

- `SAN-135-PR142-preview-desktop.png`
- `SAN-135-PR142-preview-mobile.png`
- `SAN-135-PR142-prod-desktop.png`
- `SAN-135-PR142-prod-mobile.png`

---

## CI context

| Check | Result |
|-------|--------|
| cubic | ✅ pass (migration removed) |
| Vercel | ✅ pass |
| CodeRabbit | ✅ pass |
| floor | ❌ `npm audit` pre-existing vulns (not PR #142) |

---

## Verdict

**🟢 MERGE-READY** — runtime normalization only; persona-visible event detail unchanged; preview code proof + prod proof PASS.

Post-merge: redeploy `approval-commit` edge function.

---

## Post-merge (2026-06-09)

| Step | Result |
|------|--------|
| Squash merge PR #142 | ✅ `8936927` on `main` |
| `approval-commit` redeploy | ✅ `zkwcbyxiwklihegjhuql` |
| Prod chat-smoke | ✅ All checks passed |
| Prod event detail GET | ✅ 200 |
