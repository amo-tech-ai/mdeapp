## LibSQL setup audit (vs Mastra docs)

Compared `src/mastra/lib/storage.ts` + usage to [libSQL storage reference](https://mastra.ai/reference/storage/libsql), [Memory storage overview](https://mastra.ai/docs/memory/storage), and [Memory with LibSQL](https://mastra.ai/docs/v0/memory/storage/memory-with-libsql).

### Verdict: **Correct for Phase 1 dev/prod split** — matches official patterns with one known dev tradeoff.

---

### What you’re doing right

| Practice (docs) | mdeapp |
|-------------------|--------|
| **`:memory:` for local dev** | `LibSQLStore({ id, url: ":memory:" })` when `MASTRA_DEV_LIBSQL=1` or no `DATABASE_URL` — [explicitly recommended for dev](https://mastra.ai/reference/storage/libsql) |
| **Never `file:` on serverless** | Comment + prod path uses `PostgresStore` only — aligns with [serverless warning](https://mastra.ai/reference/storage/libsql) |
| **Instance-level storage** | `Mastra({ storage: getMastraStorage() })` in `src/mastra/index.ts` — [recommended default](https://mastra.ai/docs/memory/storage) |
| **Agents share same store** | `createThreadMemory()` + `pingAgent` all call `getMastraStorage()` — one backend per Node process |
| **`id` on store** | `id: "mastra-storage"` — matches constructor shape in docs |
| **Prod = durable DB** | `NODE_ENV=production` → `PostgresStore` + pool limits — correct for Vercel |
| **HMR singleton** | `globalThis` cache — same idea as [Postgres + Next.js HMR guidance](https://mastra.ai/reference/storage/postgresql) (applies to LibSQL too) |
| **No semantic recall** | No `LibSQLVector` / embedder — `:memory:` is enough; [semantic recall needs a vector DB](https://mastra.ai/docs/memory/storage) (not in W1 scope) |

`init()` is not called manually — fine; Mastra runs it when storage is passed to `Mastra` ([storage docs](https://mastra.ai/docs/memory/storage)).

---

### Intentional tradeoff (not a bug)

**Studio (`:4111`) vs Next (`:3001`) don’t share memory**

[Mastra storage docs](https://mastra.ai/docs/memory/storage) say that for `mastra dev` + your app to share one DB, use a **single absolute file path**:

```typescript
url: 'file:/absolute/path/to/project/mastra.db'
```

You use **`:memory:` per process**, so:

- Each restart wipes thread history (docs: [in-memory resets when the process changes](https://mastra.ai/reference/storage/libsql)).
- Studio and the Next CopilotKit runtime have **separate** in-memory DBs.

That’s the right tradeoff for **EMAXCONN avoidance** and simplicity. Camila’s chat on `/` only needs the **Next** process store.

**Optional upgrade** (if you want persistent local threads + Studio parity):

```typescript
// dev only, when MASTRA_DEV_LIBSQL=1
url: `file:${path.join(process.cwd(), '.mastra', 'dev.db')}`  // absolute path
```

Keep `MASTRA_DEV_LIBSQL=1`; do not use `file:` on Vercel.

---

### Small gaps (non-blocking)

| Item | Severity | Note |
|------|----------|------|
| **`pingAgent` uses inline `Memory`** | Low | Other agents use `createThreadMemory()` — same `getMastraStorage()`, behavior OK |
| **No composite storage** | Future | Docs suggest LibSQL memory + PG workflows for heavy prod; single `PostgresStore` is fine for Phase 1 |
| **`MASTRA_DEV_LIBSQL` only `"1"`** | Low | Documented in `.env.example`; not `true`/`yes` |
| **Turso remote libSQL** | N/A | Only needed for remote libSQL prod; you use Supabase Postgres instead — correct |

---

### Env checklist

```bash
# mdeapp/.env.local (local)
MASTRA_DEV_LIBSQL=1          # → LibSQL :memory:
DATABASE_URL=...             # still used by prod logic / other tools; Mastra memory skips PG in dev

# Vercel (prod/preview)
# Do NOT set MASTRA_DEV_LIBSQL
# DATABASE_URL set → PostgresStore (NODE_ENV=production)
```

---

### Summary

| Layer | Status |
|-------|--------|
| **Package** | `@mastra/libsql` installed |
| **Dev LibSQL** | `:memory:` via `MASTRA_DEV_LIBSQL=1` — **doc-aligned** |
| **Prod storage** | `PostgresStore` — **doc-aligned** (not LibSQL on serverless) |
| **CopilotKit Pattern 1** | Unchanged; storage is behind `mastra` singleton |
| **Best-practice gap** | Shared **file** DB for Studio+Next — optional, not required for stable dev |

**Bottom line:** LibSQL is set up correctly for “dev = ephemeral, prod = Postgres.” The PR #3 approach matches Mastra’s `:memory:` dev guidance; the only “best practice” you’re not using is a shared `file:` DB for cross-process persistence — worth adding only if Roberto/Camila need thread history across `mastra dev` restarts or Studio debugging.