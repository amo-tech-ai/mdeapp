---
name: mde-vercel
description: "Orchestrator for Vercel platform work — deploy operations (`vercel deploy`, preview/production, rolling releases, environment variables, domain config, deployment troubleshooting) and React/Next.js performance best practices from Vercel Engineering (Server Components, data fetching patterns, bundle optimization, caching, ISR, streaming, Core Web Vitals). Use when deploying to Vercel, troubleshooting a deployment, configuring envs/domains, or writing/reviewing/refactoring React/Next.js code for performance. Triggers: vercel, vercel deploy, preview deployment, production deployment, push live, vercel.ts, vercel.json, vercel env, react performance, next.js, server component, RSC, ISR, streaming, bundle size, core web vitals. Do NOT use for: non-Vercel hosting (Netlify, Cloudflare Pages) or React patterns unrelated to performance."
paths:
  - "vercel.json"
  - "vercel.ts"
  - ".vercel/**"
  - "package.json"
  - ".vercelignore"
---

# mde-vercel — Vercel superskill

Pick the topic that matches the work, then load it.

| Intent | Read |
|--------|------|
| Deploy / preview / env / domain / rollback ops | [deploy.md](deploy.md) |
| React / Next.js performance patterns from Vercel Engineering | [react-best-practices.md](react-best-practices.md) |
| Deep references | [references/](references/) |

## Decision rule

- **"Deploy this", "preview link", env var question** → `deploy.md`
- **"Why is this slow", "optimize bundle", RSC/streaming question** → `react-best-practices.md`
