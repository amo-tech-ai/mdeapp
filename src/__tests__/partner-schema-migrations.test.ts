import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const MIGRATIONS_DIR = join(process.cwd(), "supabase/migrations");
const SEED_PATH = join(process.cwd(), "supabase/seeds/partners.seed.sql");

const PTR_MIGRATION_PREFIX = "2026060613";
const PTR_FILES = readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.startsWith(PTR_MIGRATION_PREFIX) && f.endsWith(".sql"))
  .sort();

function readMigration(name: string): string {
  return readFileSync(join(MIGRATIONS_DIR, name), "utf8");
}

function findPtr(suffix: string): string {
  const file = PTR_FILES.find((f) => f.includes(suffix));
  if (!file) throw new Error(`missing migration ${suffix}`);
  return file;
}

describe("SAN-683 partner schema migrations (static gate)", () => {
  it("includes ptr001–ptr014 partner migration chain", () => {
    expect(PTR_FILES.length).toBeGreaterThanOrEqual(14);
    expect(PTR_FILES[0]).toMatch(/ptr001/);
    expect(PTR_FILES.at(-1)).toMatch(/ptr014/);
  });

  it("enables RLS on every new partner table migration", () => {
    const tableMigrations = PTR_FILES.filter(
      (f) =>
        !f.includes("ptr001") &&
        !f.includes("ptr005") &&
        !f.includes("ptr010") &&
        !f.includes("ptr011") &&
        !f.includes("ptr012") &&
        !f.includes("ptr014"),
    );
    for (const file of tableMigrations) {
      const sql = readMigration(file);
      expect(sql.toLowerCase(), file).toContain("enable row level security");
    }
  });

  it("uses (select auth.uid()) not bare auth.uid() in ptr RLS policies", () => {
    for (const file of PTR_FILES) {
      const sql = readMigration(file).replace(/'[^']*'/g, "");
      expect(sql, file).not.toMatch(/(?<!\(select )auth\.uid\(\)/i);
    }
  });

  it("ptr010/011 extend leads/bookings without recreating tables", () => {
    const ptr010 = readMigration(findPtr("ptr010"));
    const ptr011 = readMigration(findPtr("ptr011"));
    expect(ptr010.toLowerCase()).toContain("alter table public.leads");
    expect(ptr010.toLowerCase()).not.toContain("create table public.leads");
    expect(ptr011.toLowerCase()).toContain("alter table public.bookings");
    expect(ptr011.toLowerCase()).not.toContain("create table public.bookings");
  });

  it("ptr009 scopes partner-assets storage to member folders (F2/F3)", () => {
    const ptr009 = readMigration(findPtr("ptr009"));
    expect(ptr009).toContain("partner_assets_storage_insert");
    expect(ptr009).toContain("partner_ids_for_user()");
    expect(ptr009).toContain("storage.foldername(name)");
    expect(ptr009).not.toMatch(
      /partner_assets_storage_insert[\s\S]*with check \(bucket_id = 'partner-assets'\);/i,
    );
  });

  it("ptr014 hardens column privileges (F1 partners, F4 services)", () => {
    const ptr014 = readMigration(findPtr("ptr014"));
    expect(ptr014).toContain("revoke update on public.partners from authenticated");
    expect(ptr014).toContain("grant update (settings) on public.partners");
    expect(ptr014).toContain("revoke insert, update on public.partner_services");
    expect(ptr014).toContain("grant update (enabled, config)");
  });

  it("ptr013 revenue_ledger is append-only for authenticated (F5)", () => {
    const ptr013 = readMigration(findPtr("ptr013"));
    expect(ptr013.toLowerCase()).toContain("append-only");
    expect(ptr013).not.toContain("revenue_ledger_update_admin");
    expect(ptr013).not.toContain("revenue_ledger_delete_admin");
    expect(ptr013).toContain("grant select on table public.revenue_ledger to authenticated");
  });

  it("ptr005 helpers set search_path on security definer functions", () => {
    const ptr005 = readMigration(findPtr("ptr005"));
    expect(ptr005.toLowerCase()).toContain("security definer");
    expect(ptr005.toLowerCase()).toContain("set search_path");
  });

  it("partners seed is dev-only and idempotent", () => {
    const seed = readFileSync(SEED_PATH, "utf8");
    expect(seed).toMatch(/DEV|LOCAL|BRANCH/i);
    expect(seed).toContain("ON CONFLICT");
    expect(seed).toMatch(/do not run on production/i);
  });
});
