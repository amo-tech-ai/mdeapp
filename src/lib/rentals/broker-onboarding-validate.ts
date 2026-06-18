export type BrokerOnboardingFormInput = {
  displayName: string;
  whatsapp: string;
  neighborhoods: string[];
  address: string;
  bedrooms: number;
  bathrooms: number;
  monthlyRentCop: number;
  photoUrl: string;
  confirmedListingRights: boolean;
};

export type BrokerOnboardingSubmitResult =
  | { ok: true }
  | { ok: false; message: string };

function trimOrEmpty(value: string): string {
  return value.trim();
}

/** landlord_profiles has single primary_neighborhood — store full multi-select in notes until array column ships. */
export function brokerNeighborhoodProfileFields(neighborhoods: string[]): {
  primary_neighborhood: string;
  notes: string;
} {
  const primary = neighborhoods[0] ?? "Medellin";
  return {
    primary_neighborhood: primary,
    notes: `service_neighborhoods:${neighborhoods.join(",")}`,
  };
}

/** Validates onboarding payload before RPC (unit-testable). */
// skipcq: JS-0067 - JS-R1005 field validation branches
// skipcq: JS-R1005
export function validateBrokerOnboardingInput(
  input: BrokerOnboardingFormInput,
): BrokerOnboardingSubmitResult {
  if (!trimOrEmpty(input.displayName)) {
    return { ok: false, message: "Display name is required." };
  }
  if (!input.neighborhoods.length) {
    return { ok: false, message: "Select at least one neighborhood you serve." };
  }
  if (!trimOrEmpty(input.address)) {
    return { ok: false, message: "Street address is required." };
  }
  if (!Number.isFinite(input.bedrooms) || input.bedrooms < 0) {
    return { ok: false, message: "Bedrooms must be a valid number." };
  }
  if (!Number.isFinite(input.bathrooms) || input.bathrooms < 0) {
    return { ok: false, message: "Bathrooms must be a valid number." };
  }
  if (!Number.isFinite(input.monthlyRentCop) || input.monthlyRentCop <= 0) {
    return { ok: false, message: "Monthly rent must be greater than zero." };
  }
  if (!input.confirmedListingRights) {
    return { ok: false, message: "Confirm you can list this property before saving." };
  }
  const photo = trimOrEmpty(input.photoUrl);
  if (photo) {
    try {
      const url = new URL(photo);
      if (!["http:", "https:"].includes(url.protocol)) {
        return { ok: false, message: "Photo URL must use http or https." };
      }
    } catch {
      return { ok: false, message: "Photo URL is not valid." };
    }
  }
  return { ok: true };
}
