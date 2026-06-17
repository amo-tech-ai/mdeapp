/** RE-WIRE-001 / SAN-1109 — broker route access decisions (pure, testable). */

export const BROKER_ONBOARDING_PATH = "/host/rentals/onboarding" as const;
export const BROKER_LISTINGS_PATH = "/host/rentals/listings" as const;
export const BROKER_HOME_PATH = "/host/rentals" as const;

export type BrokerRouteGateAction =
  | "allow"
  | "redirect_login"
  | "redirect_onboarding"
  | "redirect_broker_home";

export type BrokerRouteGateInput = {
  isAuthenticated: boolean;
  hasBrokerProfile: boolean;
  pathname: string;
};

function isOnboardingPath(pathname: string): boolean {
  return (
    pathname === BROKER_ONBOARDING_PATH ||
    pathname.startsWith(`${BROKER_ONBOARDING_PATH}/`)
  );
}

/** Resolve gate action for a broker rentals path (no I/O). */
export function resolveBrokerRouteGate(input: BrokerRouteGateInput): BrokerRouteGateAction {
  if (!input.isAuthenticated) return "redirect_login";
  const onOnboarding = isOnboardingPath(input.pathname);

  if (!input.hasBrokerProfile) {
    return onOnboarding ? "allow" : "redirect_onboarding";
  }

  if (onOnboarding) return "redirect_broker_home";
  return "allow";
}

/** Login redirect target preserving intended broker path. */
export function brokerLoginNextPath(pathname: string): string {
  if (pathname.startsWith("/host/rentals")) return pathname;
  return BROKER_HOME_PATH;
}
