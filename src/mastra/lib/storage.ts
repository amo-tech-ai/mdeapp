/**
 * Mastra storage — Postgres on Vercel/prod (DATABASE_URL), in-memory LibSQL locally.
 * Never use `file:` LibSQL on serverless (read-only FS → ConnectionFailed).
 */
import { LibSQLStore } from "@mastra/libsql";
import { PostgresStore } from "@mastra/pg";

function normalizeDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  return raw.replace(/^"|"$/g, "");
}

export function createMastraStorage(id: string) {
  const connectionString = normalizeDatabaseUrl();
  if (connectionString) {
    return new PostgresStore({
      id,
      connectionString,
      max: 3,
      idleTimeoutMillis: 10_000,
    });
  }
  return new LibSQLStore({ id, url: ":memory:" });
}

let sharedStorage: ReturnType<typeof createMastraStorage> | undefined;
let storageModeLogged = false;

function logStorageMode(mode: "postgres" | "libsql-dev") {
  if (storageModeLogged) return;
  storageModeLogged = true;
  if (mode === "postgres") {
    console.info("[mastra-storage] using Postgres");
  } else {
    console.info("[mastra-storage] using local dev LibSQL");
  }
}

/** Singleton storage for Mastra core + agent thread memory. */
export function getMastraStorage() {
  if (!sharedStorage) {
    const connectionString = normalizeDatabaseUrl();
    sharedStorage = createMastraStorage("mastra-storage");
    logStorageMode(connectionString ? "postgres" : "libsql-dev");
  }
  return sharedStorage;
}

/** Test helper — reset singleton between Vitest cases. */
export function resetMastraStorageForTests() {
  sharedStorage = undefined;
  storageModeLogged = false;
}
