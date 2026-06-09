---
title: Partner Hub + Partner System Forensic Audit
auditor: Cursor (Senior Software Specialist / Forensic Auditor / QA Lead)
date: 2026-06-08
scope:
  - PR #131 + PR #133 (merged)
  - SAN-692 … SAN-714 partner tasks
  - Production concierge launch (P0)
refs:
  - https://github.com/amo-tech-ai/mdeapp/pull/131
  - https://github.com/amo-tech-ai/mdeapp/pull/133
evidence:
  - tasks/testing/scripts/chat-smoke.mjs (prod)
  - Chrome MCP browser (prod www.mdeai.co)
  - curl route matrix (prod ×10)
  - disk: origin/main @ dfb77ac
  - Linear MCP (2026-06-08)
verdict: "Partner funnel green on prod after PR #133 · Concierge chat unreachable from home — P0 launch blocker · Do not start SAN-690 until concierge is fixed"
overall_score: 58
---

# Executive Verdict

| Area | Status | Score | Notes |
|---|---|---:|---|
| **Concierge launch (home → chat)** | 🔴 **P0 blocker** | **5%** | `GeoChatShell` / `chat-canvas` not mounted on `/` or `/chat`; all entry points land on marketing home |
| **Partner Hub (SAN-692)** | 🟢 Prod funnel OK | **92%** | PR #133 deployed; 8 cards → live typed signup; zero hub dead links |
| **Partner Signup (SAN-723)** | 🟢 Done | **93%** | Wizard live; venue `category` prefill + gated parsing shipped in PR #133 |
| **Partner Activate (SAN-665)** | 🟢 Done | **95%** | API live; post-signup defers `/dashboard` redirect until SAN-690 |
| **Partner landings (660–714)** | ⚪ Deferred | **40%** | Dedicated marketing routes still 404 — intentional until those tasks ship |
| **SAN-690 Dashboard** | ⚪ Not started | **0%** | `/dashboard` 404; correctly blocked |
| **Linear + design docs** | 🟡 Stale | **68%** | SAN-692 still In Progress; DESIGN-INVENTORY still says hub 🟡 / chat ✅ on `/` |
| **Overall platform readiness** | 🔴 **Not launch-safe** | **58%** | Supply funnel works; **Camila cannot open concierge from home** |

**One-line verdict:** PR #131 and PR #133 are merged and deployed — the partner hub funnel is production-green — but the D-13 marketing home replaced the concierge shell without remounting `GeoChatShell`, so **every home “Ask” path is a dead end for chat**. Fix concierge **before** SAN-690.

---

# Audit checklist (PR #133 prompt)

| # | Objective | Dot | Evidence |
|---:|---|:---:|---|
| 1 | PR #131 + #133 merged | 🟢 | #131 merged `61e3f11` · #133 merged `dfb77ac` 2026-06-08 |
| 2 | Deployed on production | 🟢 | `/partners` HTML shows typed-signup hrefs (not `/venues`, `/sponsors`, …) |
| 3 | `/partners` no dead card links | 🟢 | Prod curl: all 8 program cards → `/partners/signup?type=…` (+ `category=` for venue subtypes) |
| 4 | Cards → correct typed signup | 🟢 | Browser + HTML: host/venue/broker/sponsor/agency + restaurant/cafe/nightclub |
| 5 | Venue categories prefill | 🟢 | Prod HTML `?type=venue&category=restaurant` includes `Restaurant`; parser gates category to `type=venue` only (origin/main) |
| 6 | Invalid category ignored | 🟢 | `?type=host&category=restaurant` → Event host, not Restaurant (prod HTML) |
| 7 | Signup activation flow | 🟢 | `POST /api/partners/activate` + wizard wired (SAN-665/723 Done); login gate when anon (expected) |
| 8 | Post-signup not dead end | 🟢 | `shouldDeferDashboardRedirect("/dashboard")` → success screen, not 404 push |
| 9 | `/dashboard` before SAN-690 | 🟢 | Prod `GET /dashboard` → **404**; SAN-690 **Todo** — correct gate |
| 10 | Partner placeholder routes tracked | 🟡 | SAN-660/661/663/664/691/712/713/714 Todo or In Progress; hub cards bypass via typed signup |
| 11 | No duplicate partner tasks | 🟢 | SAN-666 canceled → SAN-690; SAN-723 split from SAN-665 cleanly |
| 12 | DESIGN-LINEAR-AUDIT + INVENTORY current | 🟡 | Files dated 2026-06-08 but INVENTORY still lists hub 🟡 and `/`+`/chat` concierge ✅ — **contradicts prod** |
| 13 | Production home concierge | 🔴 | See Concierge Launch Audit — **all entry points fail** |

---

# Task-by-Task Audit

| Dot | % | Task | Route | Purpose | Current State | Errors | Missing | Correction | Prod Ready |
|:---:|---:|---|---|---|---|---|---|---|:---:|
| 🟡 | 88 | **SAN-692 — MKT Partner Hub** | `/partners` | Supply funnel entry | Live on prod; PR #131 shell + PR #133 card links | Linear still **In Progress** (not Done) | Flip Linear Done + update DESIGN-INVENTORY hub row to ✅ | Mark Done after evidence ack | 🟢 |
| 🟢 | 93 | **SAN-723 — Partner Signup Wizard** | `/partners/signup` | Typed signup + activate | **Done**; wizard + API wired | — | Phase-2 6-step stepper (deferred) | — | 🟢 |
| 🟢 | 95 | **SAN-665 — Partner Activate API** | `POST /api/partners/activate` | Create partner row | **Done** | — | Dashboard shell (SAN-690) | — | 🟢 |
| 🟡 | 45 | **SAN-660 — Event Hosts Landing** | `/host` | Roberto acquisition | **In Progress**; route auth-walled / no public page | No marketing landing | `app/host/page.tsx` | Hub card bypasses to signup | ⚪ |
| ⚪ | 0 | **SAN-661 — Venues Landing** | `/venues` | Venue B2B landing | **Todo**; prod **404** | Route missing | Build landing or keep signup bypass | Hub uses signup | ⚪ |
| 🟡 | 55 | **SAN-691 — Broker/Rentals Landing** | `/partners/rentals` | Broker acquisition | **In Review**; prod **404** | Landing not built | SAN-691 page build | Hub → `?type=broker` | ⚪ |
| 🟡 | 40 | **SAN-664 — Sponsors Landing** | `/sponsors` | Sponsor B2B | **In Progress**; prod **404** | Landing missing | SAN-664 | Hub → `?type=sponsor` | ⚪ |
| 🟡 | 40 | **SAN-663 — Business AI Landing** | `/business/ai` | Agency B2B | **In Progress**; prod **404** | Landing missing | SAN-663 | Hub → `?type=agency` | ⚪ |
| ⚪ | 0 | **SAN-712 — Nightlife Partner Landing** | `/partners/nightlife` | Nightlife acquire | **Todo**; prod **404** | — | SAN-712 | Hub → `?type=venue&category=nightclub` | ⚪ |
| ⚪ | 0 | **SAN-713 — Restaurants Partner Landing** | `/partners/restaurants` | Restaurant acquire | **Todo**; prod **404** | — | SAN-713 | Hub → `?type=venue&category=restaurant` | ⚪ |
| ⚪ | 0 | **SAN-714 — Cafés Partner Landing** | `/partners/cafes` | Café acquire | **Todo**; prod **404** | — | SAN-714 | Hub → `?type=venue&category=cafe` | ⚪ |
| ⚪ | 0 | **SAN-690 — Partner Dashboard** | `/dashboard` | Post-signup home | **Todo**; prod **404** | — | Full dashboard shell | **Blocked** until concierge + funnel stable | ⚪ |
| 🔴 | 5 | **Home concierge launch** | `/` · `/chat` | Camila entry | Marketing home only; chat shell orphaned | No `chat-canvas`, no CopilotKit input on prod | Remount `GeoChatShell` or route split | **P0** — see below | 🔴 |

---

# Partner Funnel Audit

| Step | Example User | Expected Result | Actual Result | Dot |
|---|---|---|---|:---:|
| Hub → Host | Roberto clicks **Event hosts** | `/partners/signup?type=host` | Prod link present; signup page loads (login if anon) | 🟢 |
| Hub → Restaurant | Restaurateur clicks **Restaurants** | `/partners/signup?type=venue&category=restaurant` | Prod link + signup route 200; category in URL | 🟢 |
| Hub → Broker | Broker clicks **Rental brokers** | `/partners/signup?type=broker` | Prod link present | 🟢 |
| Hub → Sponsor | Sponsor clicks **Sponsors** | `/partners/signup?type=sponsor` | Prod link present | 🟢 |
| Hub → Agency | Agency clicks **Business AI** | `/partners/signup?type=agency` | Prod link present | 🟢 |
| Hub → Venue | Venue owner clicks **Venues** | `/partners/signup?type=venue` | Prod link present | 🟢 |
| Hub → Café | Café owner clicks **Cafés** | `…&category=cafe` | Prod link present | 🟢 |
| Hub → Nightlife | Club owner clicks **Nightlife** | `…&category=nightclub` | Prod link present | 🟢 |
| Dead landings | User bookmarks old URL | 404 or redirect | `/venues`, `/sponsors`, `/business/ai`, `/partners/{rentals,restaurants,cafes,nightlife}` → **404** | 🟡 expected until MKT landings ship |
| Post-activate | Signed-in partner submits wizard | Success UI or `/dashboard` | API returns `/dashboard`; wizard **defers** redirect → success state (no 404) | 🟢 |

---

# Concierge Launch Audit (audited first — P0)

| Entry Point | Expected | Actual | Error | Severity |
|---|---|---|---|:---:|
| **Home query bar → Ask** | Navigate to concierge; query submits; `chat-canvas` visible | Stays on marketing `/` or `/?q=…`; search bar prefilled only | `GeoChatShell` not imported anywhere; `HomeHero.submit` → `/chat?q=` → redirect `/?q=` with **no auto-submit** | 🔴 P0 |
| **Hero chip buttons** | Same as Ask | Same dead end | Same root cause | 🔴 P0 |
| **Start exploring** (`/chat`) | Open concierge shell | `307` → `/` marketing home | `/chat/page.tsx` is redirect-only alias | 🔴 P0 |
| **Ask the concierge FAB** (`/chat`) | Open concierge | `307` → `/` marketing home | Same | 🔴 P0 |
| **Suggestion cards** (`/chat?q=`) | Open chat with prompt | `307` → `/?q=` marketing prefill | No CopilotKit composer | 🔴 P0 |
| **Direct `/chat?q=test`** | Chat with query | Final URL `/?q=test` marketing | CDP: `chatCanvas:false`, `copilotInput:false` | 🔴 P0 |
| **CopilotKit mount** | Provider + runtime POST | Root layout mounts `MdeCopilotKitProvider` but **no chat UI** on home | Empty-body POST `/api/copilotkit` → **401** (smoke expects 400) | 🔴 P0 |
| **Console errors** | None on launch | No uncaught errors observed on load | — | 🟢 |
| **Network 404/500 on launch paths** | None | `GET /` 200 ×10; partner routes 200; no 5xx on tested paths | CK 401 on empty POST | 🟡 |

**Root cause (disk):**

```24:28:src/components/home/home-hero.tsx
  const submit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`);
  };
```

```7:11:src/app/chat/page.tsx
/** Canonical chat is `/` — keep `/chat` as alias for bookmarks and F19 docs. */
export default async function ChatPage({ searchParams }: Props) {
  const { q } = await searchParams;
  redirect(q ? `/?q=${encodeURIComponent(q)}` : "/");
}
```

`GeoChatShell` (exports `ChatCanvas` with `data-testid="chat-canvas"`) has **zero imports** in `src/app/**` — the Mindtrip concierge shell is orphaned while D-13 marketing home ships on `/`.

**E2E regression:** `e2e/helpers/maps-layout.ts` `gotoHome()` waits for `[data-testid="chat-canvas"]` on `/` — **will fail** against current prod/home architecture.

---

# Test matrix

| Test | Result | Notes |
|---|---|:---:|
| Unit — `npm test -- partner` | 🟢 66/66 pass | Local disk @ PR #131; origin/main reports **74/74** with PR #133 |
| TypeScript `tsc --noEmit` | 🟡 | Aborted in audit env (Node crash); PR #133 CI claimed clean |
| ESLint partner paths | 🟢 | Clean on partner dirs |
| Playwright route tests (partner) | ⚪ | **No partner e2e spec** on disk |
| Playwright visual smoke | 🔴 | `gotoHome` expects `chat-canvas` — incompatible with marketing `/` |
| Chrome MCP prod browser | 🔴 | Home + `/?q=` + FAB: no concierge shell |
| Console error check | 🟢 | No app errors on `/` or `/partners` load |
| Network 404/500 check | 🟡 | Partner landings 404 (expected); CK empty POST 401 |
| Mobile viewport (375px) | 🟡 | Not re-run; marketing home renders; concierge still missing |
| Tablet viewport (768px) | 🟡 | Not re-run | 
| Desktop viewport (≥1360px) | 🔴 | Concierge shell absent at all breakpoints |
| **10× prod smoke `GET /`** | 🟢 | 10/10 → 200 |
| Prod route matrix | 🟢 | `/partners`, `/partners/signup`, typed variants → 200 |
| `chat-smoke.mjs` prod | 🟡 | Rentals/events OK; **FAIL** empty POST `/api/copilotkit` → 401 |

---

# Errors / Red Flags

| Severity | Issue | Evidence | Fix |
|---|---|---|---|
| 🔴 **P0** | Concierge unreachable from production home | CDP `chatCanvas:false`; browser snapshot has no chat regions; `GeoChatShell` unmounted | Remount shell on `/chat` (or query-gated `/`); auto-submit `?q=`; update sitemap + DESIGN-INVENTORY |
| 🔴 **P0** | Playwright prod synthetic / concierge specs incompatible | `gotoHome` waits `chat-canvas` on `/` | Align e2e with routing decision before claiming green CI |
| 🟡 | SAN-692 Linear **In Progress** despite prod-valid funnel | Linear MCP 2026-06-08 | Mark **In Review** with this audit; Done after user approval |
| 🟡 | DESIGN-INVENTORY rows `/` + `/chat` = ✅ Built | Prod contradicts | Update consumer rows: marketing home live, concierge shell **not** on `/` |
| 🟡 | Local `main` behind `origin/main` | HEAD `61e3f11` (PR #131 only); PR #133 not pulled | `git pull origin main` on dev machines |
| 🟡 | Dedicated partner landings 404 | curl 404 on `/venues`, `/sponsors`, … | Expected; track under SAN-660–714 — not hub blockers post-#133 |
| 🟡 | `chat-smoke` CK empty POST → 401 not 400 | prod tier-1 script | Investigate auth middleware on empty CK body (separate from shell bug) |

---

# Critical Fixes

| Priority | Fix | Owner Task | Why |
|---|---|---|---|
| **P0** | Restore concierge shell reachable from home (mount `GeoChatShell` on `/chat` or hybrid `/` when `?q=` present; wire Ask/FAB/suggestions) | **New or SAN-579/D-13 follow-up** | Camila north star blocked — marketing home with no chat is worse than 404 partner cards |
| **P0** | Update `sitemap.md` + DESIGN-INVENTORY: `/` = marketing, `/chat` = concierge (not alias-to-marketing) | Docs + SAN-579 | Prevents false ✅ claims |
| **P1** | Mark **SAN-692** In Review → Done (user approval) after acknowledging this audit | SAN-692 | Linear drift |
| **P1** | `git pull` PR #133 on all dev checkouts | Sofía | Local hub config still has pre-#133 dead hrefs |
| **P2** | Add partner hub Playwright spec (card hrefs + signup prefill) | SAN-692 test slice | No e2e partner coverage today |
| **Blocked** | **Do not start SAN-690** | SAN-690 | Dashboard 404 + concierge P0 — post-signup UX depends on both |

---

# Missing Work

| Dot | Task | Missing Item | Impact |
|:---:|---|---|---|
| 🔴 | Concierge routing | `GeoChatShell` mount + `?q=` auto-send | Launch blocker for Camila |
| ⚪ | SAN-690 — Partner Dashboard | `/dashboard` page | Post-signup destination |
| ⚪ | SAN-660–714 | Marketing landings | Long-form acquire pages (hub bypasses via signup) |
| ⚪ | Partner e2e | Playwright partner funnel spec | Regression guard for PR #133 |
| 🟡 | DESIGN-INVENTORY | `/partners` hub row still 🟡 | Planning drift |
| 🟡 | DESIGN-LINEAR-AUDIT §SAN-692 | Still says “cards 404 until landings” | Superseded by PR #133 typed-signup bypass |

---

# Scores

| Area | % Correct | Grade |
|---|---:|---|
| Partner Hub | 92 | A- |
| Partner Signup | 93 | A |
| Partner Activate API | 95 | A |
| Partner Routes (landings) | 40 | F |
| Partner UX (funnel) | 90 | A- |
| Partner Tests | 80 | B |
| Linear Accuracy | 68 | D+ |
| Production Funnel (hub→signup) | 92 | A- |
| **Concierge Launch** | **5** | **F** |
| **Overall** | **58** | **F** |

---

# Final Recommendation

| Question | Answer |
|---|---|
| **Will the partner task chain succeed?** | **Yes** for M1 acquire (hub → typed signup → activate). Landings (660–714) can ship later without breaking the funnel. |
| **Is it production ready?** | **Partner funnel: yes** (post PR #133). **Platform launch: no** — concierge from home is broken. |
| **What must be fixed before SAN-690?** | 1) **P0 concierge shell** reachable from `/`, `/chat`, and all CTAs. 2) Acknowledge SAN-692 Done in Linear. 3) Pull PR #133 locally. 4) Update DESIGN-INVENTORY + sitemap truth. |
| **What can be deferred?** | SAN-660–714 dedicated landings, SAN-690 dashboard, partner Playwright e2e, CK empty-POST 401 investigation, mobile/tablet re-screenshots. |

---

## Evidence log

| Check | When | Result |
|---|---|---|
| PR #131/#133 merge state | gh CLI | Both **MERGED** to `main` |
| Prod `/partners` card hrefs | curl HTML | All typed signup; no dead hub hrefs |
| Prod dead landing routes | curl | 8 routes → 404 (expected) |
| Prod concierge DOM | Chrome CDP | `chat-canvas` / `copilotKitInput` **false** |
| Prod browser UX | Chrome MCP | Ask/FAB/`/?q=` → marketing only |
| Partner unit tests | vitest local | 66/66 pass |
| Prod 10× smoke | curl | 10/10 `GET /` → 200 |
| Linear SAN-692/690/723/665 | MCP | 692 In Progress · 723/665 Done · 690 Todo |

*Audit performed without code changes per scope. Next engineering slice: concierge routing fix (not SAN-690).*
