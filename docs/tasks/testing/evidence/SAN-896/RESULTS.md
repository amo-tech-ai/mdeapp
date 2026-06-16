# SAN-896 · CK-V2-008 — Refresh post-cutover v2 evidence

**Run:** 2026-06-16 (localhost @ `2d9c8ed6` after [#225](https://github.com/amo-tech-ai/mdeapp/pull/225) CK-V2-015 merge)  
**SHA:** `2d9c8ed6` (= `origin/main` post #225)  
**Verdict:** **Localhost sign-off PASS** — events chip, Roberto host agent fill, host analytics all green. Prod evidence @ `4f43390a` remains valid for core cutover; refresh prod after #225 deploy optional.

---

## Executive matrix

| Check | Persona / surface | `4f43390a` | @ `2d9c8ed6` localhost |
|-------|-------------------|:----------:|:---------------------:|
| v2-only imports, no react-ui, no flags | Sofía / CI | 🟢 PASS | 🟢 PASS |
| `npm run audit:copilotkit-v2` | Sofía | 🟢 PASS | 🟢 PASS (v2 hooks **18**) |
| `/chat` Events chip → agent | Tourist | 🔴 empty state | 🟢 **PASS** (#225) |
| `/host/event/new` shell signed-in | Roberto | ⚫ login only | 🟢 PASS |
| `/host/event/new` agent fill | Roberto | 🔴 v1 send selectors | 🟢 **PASS** (v2 `copilot-chat-textarea` send) |
| `/host/analytics` signed-in + sales prompt | Roberto | ⚫ unproven | 🟢 PASS (KPI grid) |
| Playwright `san-896-ck-v2-evidence.spec.ts` | Lucía | — | 🟢 **4/4** @ 2026-06-16 |

---

## Root cause — host agent e2e false fail (fixed)

`san-896-ck-v2-evidence.spec.ts` used v1 CopilotKit selectors (`.copilotKitInput textarea`). v2 `CopilotChat` exposes `data-testid="copilot-chat-textarea"` + `copilot-send-button`. Message stayed in composer → 180s timeout with no form fill.

**Fix:** align `sendHostChat()` with `san-889-localhost-proof.mjs` / `host-analytics-seed-verify.mjs` v2 pattern.

---

## Playwright (localhost)

```bash
infisical run --silent --env=dev --path=/ -- npm run dev:ui
infisical run --silent --env=dev --path=/ -- \
  env PW_SKIP_WEBSERVER=1 npx playwright test e2e/san-896-ck-v2-evidence.spec.ts --project=chromium
```

| Test | Result | Duration |
|------|--------|----------|
| B — Events chip + salsa | ✅ | ~2.1m |
| A — wizard shell | ✅ | ~2.6s |
| A — agent fill or HITL | ✅ | ~13s |
| A — analytics sales | ✅ | ~26s |

Screenshots: `docs/tasks/testing/evidence/SAN-896/screenshots/`

---

## Cosmetic follow-up (post #225)

Duplicate JSDoc removed in:

- `src/mastra/lib/intelligence-event-search.ts` (`resolveEventCategoryForQuery`)
- `src/components/chat/concierge-copilot-chat-view.tsx` (`ConciergeChatViewInner`)

---

## Linear / Done gate

- **CK-V2-015** shipped in #225 — closes events chip empty-state for Tourist on `/chat`.
- **SAN-896 · CK-V2-008** localhost matrix green @ `2d9c8ed6` — ready for **In Review** / **Done** on user OK.
- Prod re-smoke after #225 deploy: optional Tier-1 events chip on mdeai.co.

---

## Related evidence

- Prod sign-off @ `4f43390a`: [`SAN-896-CK-V2-008-RESULTS.md`](./SAN-896-CK-V2-008-RESULTS.md)
- Audit: [`docs/upgradeV2/16-copilotkitv2-audit.md`](../../../upgradeV2/16-copilotkitv2-audit.md)
- CK-V2-015 detail: [`../2026-06-15/CK-V2-015-events-chip-agent-path-RESULTS.md`](../2026-06-15/CK-V2-015-events-chip-agent-path-RESULTS.md)
