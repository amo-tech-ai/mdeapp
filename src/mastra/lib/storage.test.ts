import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createMastraStorage,
  getMastraStorage,
  resetMastraStorageForTests,
} from "./storage";

describe("createMastraStorage", () => {
  afterEach(() => {
    resetMastraStorageForTests();
    vi.unstubAllEnvs();
  });

  it("uses PostgresStore when DATABASE_URL is set", () => {
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
});
