# Supabase Phase 1 — manual dashboard steps

Automated via MCP on 2026-05-19. Complete these in the Supabase dashboard (no MCP API).

## 1. Leaked password protection

1. [Supabase Dashboard](https://supabase.com/dashboard/project/zkwcbyxiwklihegjhuql/auth/providers) → **Authentication** → **Providers** → **Email**
2. Enable **Leaked password protection** (HIBP)
3. Save

**Verify:** `get_advisors` type=security — lint `auth_leaked_password_protection_off` should clear.

## 2. OpenAI key rotation (Phase 0.3)

If the demo `OPENAI_API_KEY` from the CopilotKit example was ever on disk:

1. https://platform.openai.com/api-keys → revoke `sk-proj-Bs21…`
2. mdeapp is Gemini-only — no replacement required unless you add OpenAI later

## 3. spatial_ref_sys RLS (accepted skip)

Migration failed: `must be owner of table spatial_ref_sys` (PostGIS extension-owned). Document as **accepted advisor warning** until Supabase support or superuser migration.
