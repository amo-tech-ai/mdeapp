# Linear issue description standard

Every MDEAPP issue in Linear must be readable without opening the spec file.

## Required sections

| Section | Content |
|---------|---------|
| **Purpose** | One paragraph — why this exists for mdeai |
| **Goals** | Outcomes + user story if present |
| **Features** | Bullets from build scope |
| **Real-world example** | Named persona (Camila, Roberto, Tourist, Patricia) |
| **Persona & surface** | Who + route/path |
| **Where to view** | Table: localhost + [mdeai.co](https://www.mdeai.co/) links |
| **Completion proof** | Evidence file path, Playwright/floor summary (if shipped) |
| **Tracking** | Task ID, spec path, repo status, depends_on |

## Scripts

```bash
# New imports (rich descriptions by default)
LINEAR_API_KEY=... node scripts/linear-import-screens.mjs

# Backfill existing issues
LINEAR_API_KEY=... node scripts/linear-enrich-descriptions.mjs

# Preview one task
node scripts/linear-enrich-descriptions.mjs --dry-run --only=SCREEN-008
```

Builder: [`scripts/lib/linear-issue-description.mjs`](../../scripts/lib/linear-issue-description.mjs)

## Done vs Linear Done

- Repo `status: Done` → Linear **In Review** + completion proof (not Linear Done until user approves).
- Screens must include **exact URLs** so reviewers open the same page on localhost and prod.

## Demo URLs (stable)

| Surface | Production | Notes |
|---------|------------|-------|
| Home / chat | https://www.mdeai.co/ | Café: prompt *Quiet cafés near Laureles* |
| Trip workspace | https://www.mdeai.co/trips/11111111-1111-1111-1111-000000000002 | QA trip (SCREEN-013) |
| Trips list | https://www.mdeai.co/trips | Auth may redirect to login |
