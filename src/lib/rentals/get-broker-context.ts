import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type LandlordProfileSummary = Pick<
  Database["public"]["Tables"]["landlord_profiles"]["Row"],
  "id" | "user_id" | "display_name"
>;

export type BrokerContextUnauthorized = {
  state: "unauthorized";
  user: null;
  landlordProfile: null;
  hasBrokerProfile: false;
};

export type BrokerContextError = {
  state: "error";
  message: string;
  user: null;
  landlordProfile: null;
  hasBrokerProfile: false;
};

export type BrokerContextAuthorized = {
  state: "authorized";
  user: User;
  landlordProfile: LandlordProfileSummary;
  hasBrokerProfile: true;
};

export type BrokerContextAuthorizedNoProfile = {
  state: "authorized_no_profile";
  user: User;
  landlordProfile: null;
  hasBrokerProfile: false;
};

export type BrokerContext =
  | BrokerContextUnauthorized
  | BrokerContextError
  | BrokerContextAuthorized
  | BrokerContextAuthorizedNoProfile;

/** Shared server loader — auth user + landlord_profiles row (not apartments.landlord_id). */
export const getBrokerContext = cache(async function getBrokerContext(): Promise<BrokerContext> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return {
      state: "error",
      message: authError.message,
      user: null,
      landlordProfile: null,
      hasBrokerProfile: false,
    };
  }

  if (!user) {
    return {
      state: "unauthorized",
      user: null,
      landlordProfile: null,
      hasBrokerProfile: false,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("landlord_profiles")
    .select("id, user_id, display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    return {
      state: "error",
      message: profileError.message,
      user: null,
      landlordProfile: null,
      hasBrokerProfile: false,
    };
  }

  if (!profile) {
    return {
      state: "authorized_no_profile",
      user,
      landlordProfile: null,
      hasBrokerProfile: false,
    };
  }

  return {
    state: "authorized",
    user,
    landlordProfile: profile,
    hasBrokerProfile: true,
  };
});
