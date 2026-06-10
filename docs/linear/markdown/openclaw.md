# 🤖 OpenClaw — OCL task tracker
> Spec pack: [`docs/tasks/openclaw/`](../../tasks/openclaw/index-ocl.md) · Plan: [`100-openclaw-plan.md`](../../tasks/openclaw/docs/100-openclaw-plan.md) · Updated: 2026-06-09 · Canonical: `ADV.md` § 🔮 Automation — OpenClaw

**Legend:** ⚪ Not Started · 🧊 Deferred (no Linear) · All `phase:post-mvp` · `stack:openclaw`

**Role:** Patricia approves background crawls on Hostinger VPS — **not** Camila's chat brain (CopilotKit + Mastra + ADK).

---

## core (OCL-001…007) → SAN-187–193

| Status | Spec | Linear | Title | Tracker |
|--------|------|--------|-------|---------|
| ⚪ | OCL-001 | [SAN-187](https://linear.app/sanjiovani/issue/SAN-187) | Gateway health stub | ADV.md |
| ⚪ | OCL-002 | [SAN-188](https://linear.app/sanjiovani/issue/SAN-188) | `openclaw_jobs` + `automation_approvals` | ADV.md |
| ⚪ | OCL-003 | [SAN-189](https://linear.app/sanjiovani/issue/SAN-189) | Mastra approval workflow | ADV.md |
| ⚪ | OCL-004 | [SAN-190](https://linear.app/sanjiovani/issue/SAN-190) | ClawHub safety — no unvetted skills | ADV.md |
| ⚪ | OCL-005 | [SAN-191](https://linear.app/sanjiovani/issue/SAN-191) | `OPENCLAW_DISABLED` kill switch | ADV.md |
| ⚪ | OCL-006 | [SAN-192](https://linear.app/sanjiovani/issue/SAN-192) | VPS Gemini provider + routing | ADV.md |
| ⚪ | OCL-007 | [SAN-193](https://linear.app/sanjiovani/issue/SAN-193) | Rotate gateway token | ADV.md |

## mvp (OCL-008…013, 042) → SAN-194–199, 226

| Status | Spec | Linear | Title | Tracker |
|--------|------|--------|-------|---------|
| ⚪ | OCL-008 | [SAN-194](https://linear.app/sanjiovani/issue/SAN-194) | Admin approvals UI | ADV.md |
| ⚪ | OCL-009 | [SAN-195](https://linear.app/sanjiovani/issue/SAN-195) | Gemini `web_search` grounding | ADV.md |
| ⚪ | OCL-010 | [SAN-196](https://linear.app/sanjiovani/issue/SAN-196) | `mde-tour-enrich` SKILL.md pack | ADV.md |
| ⚪ | OCL-011 | [SAN-197](https://linear.app/sanjiovani/issue/SAN-197) | `enqueueOpenClawJob` Mastra tool | ADV.md |
| ⚪ | OCL-012 | [SAN-198](https://linear.app/sanjiovani/issue/SAN-198) | E2E — reject job without approval | ADV.md |
| ⚪ | OCL-013 | [SAN-199](https://linear.app/sanjiovani/issue/SAN-199) | Coffee tour source crawler | ADV.md · spec in `venues/post-mvp/` |
| ⚪ | OCL-042 | [SAN-226](https://linear.app/sanjiovani/issue/SAN-226) | ClawEvents Medellín ingest worker | ADV.md |

## post-mvp verticals (OCL-014…021) → SAN-200–207

| Status | Spec | Linear | Title | Vertical |
|--------|------|--------|-------|----------|
| ⚪ | OCL-014 | [SAN-200](https://linear.app/sanjiovani/issue/SAN-200) | Restaurant menu PDF/HTML extraction | Restaurants |
| ⚪ | OCL-015 | [SAN-201](https://linear.app/sanjiovani/issue/SAN-201) | Café Instagram / creator crawl | Cafés |
| ⚪ | OCL-016 | [SAN-202](https://linear.app/sanjiovani/issue/SAN-202) | Event venue intelligence enrich | Events / Roberto |
| ⚪ | OCL-017 | [SAN-203](https://linear.app/sanjiovani/issue/SAN-203) | Event directory / calendar import | Events |
| ⚪ | OCL-018 | [SAN-204](https://linear.app/sanjiovani/issue/SAN-204) | Rental listing enrichment crawl | Camila / RE |
| ⚪ | OCL-019 | [SAN-205](https://linear.app/sanjiovani/issue/SAN-205) | Sponsor prospect research | Marketing |
| ⚪ | OCL-020 | [SAN-206](https://linear.app/sanjiovani/issue/SAN-206) | Local SEO / competitor monitor | Marketing |
| ⚪ | OCL-021 | [SAN-207](https://linear.app/sanjiovani/issue/SAN-207) | Correlation IDs Mastra ↔ OpenClaw | Platform |

## advanced WA / contests (OCL-022…027) → SAN-208–213

| Status | Spec | Linear | Title | Notes |
|--------|------|--------|-------|-------|
| ⚪ | OCL-022 | [SAN-208](https://linear.app/sanjiovani/issue/SAN-208) | WA templates + number allowlist | G1–G5 gate |
| ⚪ | OCL-023 | [SAN-209](https://linear.app/sanjiovani/issue/SAN-209) | T-24h event reminder WA drafts | — |
| ⚪ | OCL-024 | [SAN-210](https://linear.app/sanjiovani/issue/SAN-210) | Sponsor ROI browser screenshots | — |
| ⚪ | OCL-025 | [SAN-211](https://linear.app/sanjiovani/issue/SAN-211) | External publish draft (outbox) | — |
| ⚪ | OCL-026 | [SAN-212](https://linear.app/sanjiovani/issue/SAN-212) | Contest WA leaderboard drafts | No votes/payments |
| ⚪ | OCL-027 | [SAN-213](https://linear.app/sanjiovani/issue/SAN-213) | Postiz approved post handoff | — |
| 🧊 | OCL-028 | — | Paperclip gates | **Deferred** — no Linear |
| 🧊 | OCL-029 | — | Paperclip WA | **Deferred** — no Linear |

## post-mvp events expansion (OCL-030…040) → SAN-214–224

| Status | Spec | Linear | Title |
|--------|------|--------|-------|
| ⚪ | OCL-030 | [SAN-214](https://linear.app/sanjiovani/issue/SAN-214) | Apify plugin sandbox |
| ⚪ | OCL-031 | [SAN-215](https://linear.app/sanjiovani/issue/SAN-215) | Sponsor decision-maker map |
| ⚪ | OCL-032 | [SAN-216](https://linear.app/sanjiovani/issue/SAN-216) | Sponsor proposal draft pack |
| ⚪ | OCL-033 | [SAN-217](https://linear.app/sanjiovani/issue/SAN-217) | Vendor recruitment research |
| ⚪ | OCL-034 | [SAN-218](https://linear.app/sanjiovani/issue/SAN-218) | Instagram/Facebook social intelligence |
| ⚪ | OCL-035 | [SAN-219](https://linear.app/sanjiovani/issue/SAN-219) | Approved WA/Postiz/social campaigns |
| ⚪ | OCL-036 | [SAN-220](https://linear.app/sanjiovani/issue/SAN-220) | Repo + skill intake audit gate |
| ⚪ | OCL-037 | [SAN-221](https://linear.app/sanjiovani/issue/SAN-221) | Event planner checklist adapter |
| ⚪ | OCL-038 | [SAN-222](https://linear.app/sanjiovani/issue/SAN-222) | Public event source connectors |
| ⚪ | OCL-039 | [SAN-223](https://linear.app/sanjiovani/issue/SAN-223) | Source health + drift monitor |
| ⚪ | OCL-040 | [SAN-224](https://linear.app/sanjiovani/issue/SAN-224) | Event page QA crawler |

## advanced live ops (OCL-041) → SAN-225

| Status | Spec | Linear | Title |
|--------|------|--------|-------|
| ⚪ | OCL-041 | [SAN-225](https://linear.app/sanjiovani/issue/SAN-225) | Live ops ticker + role-specific updates |

---

## Cross-pack OpenClaw (not OCL-* prefix)

| Status | Spec | Linear | Title | Owner pack |
|--------|------|--------|-------|------------|
| ⚪ | EVP-030 | [SAN-133](https://linear.app/sanjiovani/issue/SAN-133) | OpenClaw/Postiz approval sandbox | events · ADV |
| ⚪ | EVP-031 | [SAN-134](https://linear.app/sanjiovani/issue/SAN-134) | OpenClaw automation plan (doc only) | events · ADV |
| ⚪ | CTEST-011 | [SAN-543](https://linear.app/sanjiovani/issue/SAN-543) | Firecrawl + OpenClaw discovery sandbox | contest · ADV |
| ⚪ | VEB-018 | [SAN-509](https://linear.app/sanjiovani/issue/SAN-509) | Venue enrichment plan only | venues · ADV |
| ⚪ | — | [SAN-688](https://linear.app/sanjiovani/issue/SAN-688) | Data intelligence / enrichment (OpenClaw + Places) | partners · ADV |

---

## Critical path

```text
OCL-001 → … → 007 → 008 → … → 012 → 013 (coffee tours MVP)
OCL-042 (ClawEvents) blocked on event commerce SAN-125/123
```

**Prerequisites (mdeapp, not OCL):** CTI-001A → CTI-003 (≥3 `place_id`) for OCL-013 · MAP-002 for grounded chat.

**Verdict:** **40/40** filed OCL specs in Linear · **40/40** in ADV.md · **2/2** deferred (028/029) intentional · **5/5** cross-pack SANs in ADV.
