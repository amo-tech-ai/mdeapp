/** Medellín neighborhood proper names (English UI — geographic labels, not translated copy). */
export const BROKER_ONBOARDING_NEIGHBORHOODS = [
  "Laureles",
  "El Poblado",
  "Envigado",
  "La Florida",
  "Manila",
  "Los Colores",
  "Belen",
  "Armenia",
] as const;

export type BrokerOnboardingNeighborhood = (typeof BROKER_ONBOARDING_NEIGHBORHOODS)[number];
