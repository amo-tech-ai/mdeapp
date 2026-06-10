/**
 * Sponsor resource checks using the caller's JWT + RLS (user-scoped client).
 * Edge handlers must prefer this pattern over service-role reads for tenant boundaries.
 */

import { getUserClient } from "./supabase-clients.ts";

export async function sponsorApplicationAccessible(
  authHeader: string,
  applicationId: string,
): Promise<boolean> {
  const uc = getUserClient(authHeader);
  const { data, error } = await uc.schema("sponsor").from("applications").select("id").eq(
    "id",
    applicationId,
  ).maybeSingle();
  return !error && data != null;
}

export async function sponsorAssetAccessible(authHeader: string, assetId: string): Promise<boolean> {
  const uc = getUserClient(authHeader);
  const { data, error } = await uc.schema("sponsor").from("assets").select("id").eq("id", assetId).maybeSingle();
  return !error && data != null;
}

export async function sponsorOrganizationAccessible(
  authHeader: string,
  organizationId: string,
): Promise<boolean> {
  const uc = getUserClient(authHeader);
  const { data, error } = await uc.schema("sponsor").from("organizations").select("id").eq(
    "id",
    organizationId,
  ).maybeSingle();
  return !error && data != null;
}
