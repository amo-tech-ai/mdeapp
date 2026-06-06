import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createMastraStorage,
  getMastraStorage,
  resetMastraStorageForTests,
  shouldUsePostgresStorage,
} from "./storage";

describe("createMastraStorage", () => {
  afterEach(() => {
    resetMastraStorageForTests();
    vi.unstubAllEnvs();
  });

  it("uses PostgresStore when DATABASE_URL is set", () => {
    vi.stubEnv("MASTRA_DEV_LIBSQL", "");
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://postgres.test:secret@aws-1-us-east-1.pooler.supabase.com:6543/postgres",
    );
    const store = createMastraStorage("test-pg");
    expect(store.constructor.name).toBe("PostgresStore");
  });

  it("uses in-memory LibSQL when DATABASE_URL is absent", () => {
    vi.stubEnv("DATABASE_URL", "");
    const store = createMastraStorage("test-mem");
    expect(store.constructor.name).toBe("LibSQLStore");
  });

  it("logs postgres mode when DATABASE_URL is set", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    vi.stubEnv("MASTRA_DEV_LIBSQL", "");
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://postgres.test:secret@aws-1-us-east-1.pooler.supabase.com:6543/postgres",
    );
    getMastraStorage();
    expect(info).toHaveBeenCalledWith("[mastra-storage] using Postgres");
    info.mockRestore();
  });

  it("logs libsql dev mode when DATABASE_URL is absent", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    vi.stubEnv("DATABASE_URL", "");
    getMastraStorage();
    expect(info).toHaveBeenCalledWith("[mastra-storage] using local dev LibSQL");
    info.mockRestore();
  });

  it("uses LibSQL when MASTRA_DEV_LIBSQL=1 even if DATABASE_URL is set", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("MASTRA_DEV_LIBSQL", "1");
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://postgres.test:secret@aws-1-us-east-1.pooler.supabase.com:6543/postgres",
    );
    expect(shouldUsePostgresStorage()).toBe(false);
    const store = createMastraStorage("test-dev-libsql");
    expect(store.constructor.name).toBe("LibSQLStore");
  });

  it("uses Postgres when NODE_ENV=production even if MASTRA_DEV_LIBSQL=1", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("MASTRA_DEV_LIBSQL", "1");
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://postgres.test:secret@aws-1-us-east-1.pooler.supabase.com:6543/postgres",
    );
    expect(shouldUsePostgresStorage()).toBe(true);
    const store = createMastraStorage("test-prod-override");
    expect(store.constructor.name).toBe("PostgresStore");
  });
});
