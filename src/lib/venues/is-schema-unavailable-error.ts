/** True when Supabase/Postgres errors mean SAN-492 tables or columns are not deployed yet. */
export function isSchemaUnavailableError(
  error: { code?: string; message?: string } | null | undefined,
): boolean {
  if (!error) return false;
  const msg = (error.message ?? "").toLowerCase();
  const code = error.code ?? "";
  if (
    code === "42P01" ||
    code === "42703" ||
    code === "PGRST205" ||
    code === "PGRST204"
  ) {
    return true;
  }
  if (msg.includes("does not exist")) return true;
  if (msg.includes("schema cache")) return true;
  if (msg.includes("could not find")) return true;
  return false;
}
