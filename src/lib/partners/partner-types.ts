import type { Database } from "@/lib/supabase/database.types";

export type PartnerType = Database["public"]["Enums"]["partner_type"];

export const PARTNER_TYPES = [
  "host",
  "venue",
  "broker",
  "sponsor",
  "agency",
  "vendor",
  "tour",
  "creator",
] as const satisfies readonly PartnerType[];

export const PARTNER_ACTIVATE_REDIRECT = "/dashboard" as const;
