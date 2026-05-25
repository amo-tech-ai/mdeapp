export interface TenantContext {
  org_id: string | null;
  user_id: string | null;
  jwt_claims: Record<string, unknown>;
}
