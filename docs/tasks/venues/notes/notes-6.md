## Skill review (copilotkit + VEN-031b)

**Router skill (`copilotkit/SKILL.md`)** — Correct for this task. It should route to **copilotkit-debug** (dual DOM / message sources) and **copilotkit-develop** (`appendMessage`), not setup/upgrade. Task frontmatter listing those skills is right.

**CopilotKit MCP** — `search-docs` failed (`Not connected` / session error). Audit used disk: `CafeDetailPanel` + `@copilotkit/react-ui` `UserMessage` + your `ConciergeChatMessages` comment. Re-run MCP when the bridge is up before changing APIs.

**Best practice verdict** — Product code was already correct. `useCopilotChat().appendMessage(new TextMessage({ role: MessageRole.User, … }))` is the right v1.55.2 pattern for detail-panel follow-ups. Fast-path `showExchange()` is a separate, intentional layer (no runtime round-trip on search). The bug was **test semantics**, not CopilotKit wiring.

---

## Root cause

`ConciergeChatMessages` renders **CopilotKit thread first**, then **local fast-path** bubbles (same `.copilotKitUserMessage` class). SCREEN-021 used `.last()`, which always hit the café retry nudge (`waitForCafeGroundedCards`), not the ask-prompt from `appendMessage`.

---

## What we implemented

| Change | Why |
|--------|-----|
| E2E: `filter({ hasText })` on `[data-testid="concierge-user-message"], .copilotKitUserMessage` inside `copilot-chat-region` | Matches real DOM order; no `.last()` |
| `ConciergeUserMessage` wrapper + `data-testid="concierge-user-message"` on local user bubbles | Stable hook for both paths (task option 1) |
| **No** change to `cafe-detail-panel.tsx` | Keep `appendMessage` — don’t duplicate into `showExchange` only |

---

## Verification

| Gate | Result |
|------|--------|
| `SCREEN-021-cafe-listings.spec.ts` (chromium) | **4/4** pass |
| `npm run lint` | pass |

Evidence: [`tasks/venues/tasks/evidence/VEN-031b-verify-2026-06-02.md`](tasks/venues/tasks/evidence/VEN-031b-verify-2026-06-02.md)  
Task: **VEN-031b → Done**

**Grade: A-** — Correct diagnosis and minimal fix; MCP not verified live this run.

---

## Next steps

1. **Commit** in `mdeapp/` when you want (2 files + planning docs).
2. **VEN-012 / VEN-013** — still **In Review** until prod sign-off (unchanged).
3. **VEN-014** — Places cache (your stated next implementation phase).
4. Optional: add a vitest or comment in `concierge-chat-messages.tsx` that e2e must not use `.last()` on user bubbles when `localMessages.length > 0`.

**Note:** Spec said “6/6” but the file has **4** tests; all pass. Short `"salsa bars in Poblado"` → event fast path is a separate routing follow-up, not 031b.