"use server";

import { redirect } from "next/navigation";
import {
  type BrokerOnboardingFormInput,
  type BrokerOnboardingSubmitResult,
  brokerNeighborhoodProfileFields,
  validateBrokerOnboardingInput,
} from "@/lib/rentals/broker-onboarding-validate";
import { BROKER_LISTINGS_PATH } from "@/lib/rentals/broker-route-gate";
import { createClient } from "@/lib/supabase/server";

export type { BrokerOnboardingFormInput, BrokerOnboardingSubmitResult };

function parseRpcJson(value: unknown): { apartment_id?: string; landlord_profile_id?: string } {
  if (!value || typeof value !== "object") return {};
  const row = value as Record<string, unknown>;
  return {
    apartment_id: typeof row.apartment_id === "string" ? row.apartment_id : undefined,
    landlord_profile_id:
      typeof row.landlord_profile_id === "string" ? row.landlord_profile_id : undefined,
  };
}

/** PTR-RENTALS-004 RPC + broker-scoped listing PATCH (SAN-1092). */
export async function submitBrokerOnboarding(
  input: BrokerOnboardingFormInput,
): Promise<BrokerOnboardingSubmitResult> {
  const validation = validateBrokerOnboardingInput(input);
  if (!validation.ok) return validation;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Sign in to complete onboarding." };
  }

  const displayName = input.displayName.trim();
  const neighborhoodFields = brokerNeighborhoodProfileFields(input.neighborhoods);
  const primaryNeighborhood = neighborhoodFields.primary_neighborhood;
  const listingTitle = input.address.trim();
  const whatsapp = input.whatsapp.trim();
  const photo = input.photoUrl.trim();

  const { data: rpcData, error: rpcError } = await supabase.rpc("create_broker_onboarding_draft", {
    p_display_name: displayName,
    p_listing_title: listingTitle,
    p_neighborhood: primaryNeighborhood,
  });

  if (rpcError) {
    return { ok: false, message: rpcError.message };
  }

  const { apartment_id: apartmentId, landlord_profile_id: landlordProfileId } =
    parseRpcJson(rpcData);

  if (!apartmentId || !landlordProfileId) {
    return { ok: false, message: "Onboarding draft was not created. Try again." };
  }

  const profilePatch: Record<string, string> = {
    primary_neighborhood: neighborhoodFields.primary_neighborhood,
    notes: neighborhoodFields.notes,
  };
  if (whatsapp) profilePatch.whatsapp_e164 = whatsapp;

  const { error: profileError } = await supabase
    .from("landlord_profiles")
    .update(profilePatch)
    .eq("id", landlordProfileId);

  if (profileError) {
    return { ok: false, message: profileError.message };
  }

  const apartmentPatch: {
    address: string;
    bedrooms: number;
    bathrooms: number;
    price_monthly: number;
    currency: string;
    images?: string[];
  } = {
    address: listingTitle,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    price_monthly: input.monthlyRentCop,
    currency: "COP",
  };
  if (photo) apartmentPatch.images = [photo];

  const { error: apartmentError } = await supabase
    .from("apartments")
    .update(apartmentPatch)
    .eq("id", apartmentId);

  if (apartmentError) {
    return { ok: false, message: apartmentError.message };
  }

  redirect(BROKER_LISTINGS_PATH);
}
