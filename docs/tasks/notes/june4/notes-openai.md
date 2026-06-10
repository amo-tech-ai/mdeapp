# Switching prod AI to OpenAI (Mastra) — what's involved

**Why:** prod Gemini is denied (`AI_APICallError: Your project has been denied access`) → all prod AI (concierge chat + host wizard) is down. Use OpenAI until Gemini access is restored. Ref: <https://mastra.ai/models/providers/openai>.

**TL;DR:** it's **one file** (`src/mastra/lib/models.ts`) + one test + env + a Vercel redeploy. Use Mastra's **model-router string** (`"openai/gpt-4o-mini"`) — no `@ai-sdk/openai` install, no version conflict, doesn't trip the model-pin hook. Keep the Gemini path untouched; flip with `AI_PROVIDER=openai`.

---

## 0. Reality check on "we already added OpenAI as a fallback"
- `@ai-sdk/openai@3.0.67` **is** in `node_modules`, **but only as a transitive dep of `@copilotkit/runtime`** — it's **not in package.json** and **not used anywhere in `src/`** (0 refs). So nothing is actually on OpenAI yet.
- It's a **major version ahead** of `@ai-sdk/google@2.0.74` (the agents' provider). **Do not** import that transitive v3 module into the agents — interface mismatch with the `@ai-sdk/google@2` / `@mastra/core@1.35` stack. Use the Mastra router string instead (below), which avoids AI-SDK modules entirely.

## 1. The model wiring — one file
All 5 agents (router · ping · event · rental · host) read `FLASH_MODEL` / `PRO_MODEL` from `src/mastra/lib/models.ts`. Change only there.
- Verified: installed **`@mastra/core@1.35.0` supports the model-router string** form (`model: "openai/gpt-4o-mini"`).
- **Recommended (minimal, reversible, Gemini path byte-identical):**
  ```ts
  import { google } from "@ai-sdk/google";
  const USE_OPENAI = process.env.AI_PROVIDER === "openai";
  export const FLASH_MODEL = USE_OPENAI ? "openai/gpt-4o-mini" : google("gemini-3.5-flash");
  export const PRO_MODEL   = USE_OPENAI ? "openai/gpt-4o"      : google("gemini-3.1-pro-preview");
  // CONCIERGE/REASONING/PLANNING already alias FLASH_MODEL — no change.
  ```

## 2. Env — the actual unblock (your action)
- Mastra's router reads **`OPENAI_API_KEY`**. It's in local `.env.local` but **must be added to the Vercel prod env**, plus **`AI_PROVIDER=openai`**, then **redeploy**. That's what flips prod to OpenAI. (I can't set Vercel env or deploy.)
- Edge functions don't need it (they're DB ops, not AI).

## 3. Guardrail hook — no bypass needed (router route)
- `.claude/hooks/gemini-model-pin.mjs` only bans `import … "@ai-sdk/openai"` and the literal `openai("gpt-…")`. The **string** `"openai/gpt-4o-mini"` matches **neither**, so the router approach needs **no** flag. *(If you instead used the AI-SDK module, you'd need `MDEAI_ALLOW_MODEL_DRIFT=1` AND `npm i @ai-sdk/openai@^2` to match `@ai-sdk/google@2`.)*

## 4. Test that will break
- `src/__tests__/smoke.test.ts` L54: *"all product agents use gemini-3.5-flash"* asserts `agent.model` matches `/gemini-3.5-flash/`. Make it provider-aware (gemini when `AI_PROVIDER!=="openai"`, else openai) or it fails `npm run floor`.

## 5. Rule / docs
- CLAUDE.md hard rule "**Production AI = Gemini only**" — this is a deliberate, **env-gated** deviation (Gemini stays the default; OpenAI only when `AI_PROVIDER=openai`). Add a carve-out note so the deviation is documented, not silent.
- `src/mastra/lib/log-agent-run.ts` defaults the `ai_runs.model_name` label to `"gemini-3.5-flash"` — make it reflect the active model (cosmetic observability).

## 6. Why primary-switch, not a fallback array
- Mastra auto-failover fires on **500 / rate-limit / timeout**. The Gemini failure here is **"project denied access" (403-class)** — a fallback array `[gemini, openai]` may **not** fail over on a 403, so it could stay broken. Make OpenAI the **primary** via `AI_PROVIDER=openai` (deterministic), not merely a fallback. (A `[openai, gemini]` array is fine as a bonus once OpenAI is primary.)

## 7. Model choice
- Default: FLASH→`gpt-4o-mini`, PRO→`gpt-4o`. Confirm against your OpenAI account's available models (e.g. `gpt-4.1-mini` if preferred).

---

## Change checklist
- [ ] `src/mastra/lib/models.ts` — env-gated `FLASH_MODEL`/`PRO_MODEL` (router string for OpenAI).
- [ ] `src/__tests__/smoke.test.ts` — provider-aware model assertion.
- [ ] `src/mastra/lib/log-agent-run.ts` — dynamic model_name label (optional).
- [ ] CLAUDE.md — document the env-gated OpenAI carve-out.
- [ ] **Vercel prod env: `OPENAI_API_KEY` + `AI_PROVIDER=openai` → redeploy** (your action).
- [ ] Verify: local `AI_PROVIDER=openai npm run dev` → `/chat` answers; then prod `/chat` + host wizard → re-run SAN-366 proof.

## Verification (local, before prod)
```bash
cd mdeapp
AI_PROVIDER=openai npm run dev   # OPENAI_API_KEY already in .env.local
# open http://localhost:3001/chat → send a message → expect an OpenAI-backed reply, no AI_APICallError
npm test -- --run smoke          # smoke model assertion still green after the test update
```

**Net:** ~1 code file + 1 test (+ a doc + optional log tweak); the real switch is the 2 Vercel env vars + redeploy. No dependency install, no provider-module version juggling, no hook bypass — because Mastra's router handles OpenAI from a plain string.
