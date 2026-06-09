/**
 * Credential material for rules-engine cron / internal callers:
 * prefers `x-rules-engine-secret`, otherwise `Authorization: Bearer <opaque secret>`.
 */
export function extractRulesEngineSecretCandidate(headers: Headers): string {
  const hdr = headers.get("x-rules-engine-secret");
  if (hdr != null && hdr.length > 0) return hdr.trim();
  const auth = headers.get("Authorization");
  if (auth?.match(/^Bearer\s+/i)) return auth.replace(/^Bearer\s+/i, "").trim();
  return "";
}
