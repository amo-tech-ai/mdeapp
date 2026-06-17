/** Medellín neighborhoods for broker onboarding multi-select (RE-DES-005). */
export const BROKER_ONBOARDING_NEIGHBORHOODS = [
  "Laureles",
  "El Poblado",
  "Envigado",
  "La Florida",
  "Manila",
  "Los Colores",
  "Belén",
  "Armenia",
] as const;

export type BrokerOnboardingNeighborhood = (typeof BROKER_ONBOARDING_NEIGHBORHOODS)[number];
