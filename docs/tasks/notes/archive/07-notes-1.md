What “Vercel preview” means
Vercel runs two kinds of deploys from your GitHub repo:

Type	When	URL examples	Purpose
Preview
Every push to a branch / every PR
https://mdeapp-git-main-amo100.vercel.app, https://mdeapp-<hash>-amo100.vercel.app
Test before you trust production
Production
Push to main (if production branch = main)
https://www.mdeai.co, https://mdeai.co
Live site
Preview ≠ localhost. It’s a real HTTPS URL on Vercel’s infra, with its own env vars (Preview scope in the dashboard).

Is it set up correctly? Mostly yes
From your account (amo100):

Check	Status
Vercel project mdeapp
✅ Exists
GitHub repo
✅ Connected (mdeapp-git-main-amo100.vercel.app alias)
Production deploy
✅ Ready (~10m after your push) → https://www.mdeai.co
Next.js build
✅ output: "standalone" in next.config.ts
Core env (Supabase, Gemini, Maps, DATABASE_URL)
✅ Preview + Production
Local .vercel link
Not required — project already exists in cloud
So you’re not starting from zero. Pushing main already triggered a production deploy, not only a preview.

Gaps to fix before auth/chat work on preview and prod
Variable	Vercel today	Risk
NEXT_PUBLIC_SITE_URL
Production + Development only — not Preview
Preview auth can still work (app uses request host when unset), but set Preview if you want fixed OAuth redirects
ADK_GROUNDING_URL
Missing
Grounded places fail on Vercel (defaults to localhost:8000)
COPILOTKIT_API_KEY / NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY
Missing
Same-origin chat OK without them; set if you use CopilotKit Cloud
Supabase redirect URLs
Operator
Add preview URLs, e.g. https://mdeapp-git-main-amo100.vercel.app/auth/callback and wildcard https://*.vercel.app/auth/callback if Supabase allows
Production NEXT_PUBLIC_SITE_URL should be https://www.mdeai.co (confirm in Vercel → mdeapp → Settings → Environment Variables).

Next steps (in order)
1. Confirm the deploy you care about
Open:

Preview-style: https://mdeapp-git-main-amo100.vercel.app
Production: https://www.mdeai.co
Check they show the new app (trips, login, chat), not the old 68-file shell.

2. Supabase Auth (required for Google / magic link)
Dashboard: Auth → URL configuration

Site URL: https://www.mdeai.co
Redirect URLs (add all that apply):
https://www.mdeai.co/auth/callback
https://mdeai.co/auth/callback
https://mdeapp-git-main-amo100.vercel.app/auth/callback
(optional) each preview URL you test
3. Vercel env (dashboard or CLI)
Minimum for a preview smoke test:

cd /home/sk/mdeai/mdeapp
# Preview: SITE_URL = that preview host (or rely on unset + request host)
vercel env add NEXT_PUBLIC_SITE_URL preview   # e.g. https://mdeapp-git-main-amo100.vercel.app
# Production + Preview: ADK (real endpoint, not localhost)
vercel env add ADK_GROUNDING_URL production
vercel env add ADK_GROUNDING_URL preview
Redeploy after env changes: Vercel → Deployments → ⋯ → Redeploy, or push an empty commit.

4. Preview smoke (AUTH-011 lite)
On the preview URL (not prod marketing yet):

GET /login → 200
Google sign-in → lands without ?code= stuck on /
Logged out → /trips → /login?next=/trips
Signed in → chat sends a message (CopilotKit /api/copilotkit)
5. Production promote
Only after preview + Supabase checklist pass:

Confirm www.mdeai.co auth matches preview behavior
No E2E_BYPASS_AUTH in Production
Record evidence in tasks/notes/AUTH-011-evidence.md
Practical verdict
Question	Answer
What is Vercel preview?
Auto HTTPS deploy per branch/PR, separate from www.mdeai.co
Is Vercel set up?
Yes — project linked, prod already deployed from main
What’s next?
Fix Supabase redirects + ADK_GROUNDING_URL → smoke preview URL → then treat production as live only after AUTH-011
Important: Because main is production, your last push may have already updated www.mdeai.co. Use the preview URL first for risky auth testing; use production only after the checklist passes.

I can pull exact NEXT_PUBLIC_SITE_URL / missing env values from Vercel (names only, not secrets) or draft the Supabase redirect list for your current aliases if you want that next.

The background vercel project ls run finished with exit code 134 — the CLI listed projects, then aborted when the output was piped to head (common Vercel CLI quirk). Nothing was lost: mdeapp is on Vercel, production is https://www.mdeai.co, Node 24.x.

Follow-up vercel inspect and vercel env ls completed normally, so no retry is needed for that task.