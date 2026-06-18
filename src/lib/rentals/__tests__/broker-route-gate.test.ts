import { describe, expect, it } from "vitest";
import {
  BROKER_HOME_PATH,
  BROKER_LISTINGS_PATH,
  BROKER_ONBOARDING_PATH,
  brokerLoginNextPath,
  resolveBrokerRouteGate,
} from "@/lib/rentals/broker-route-gate";

describe("resolveBrokerRouteGate", () => {
  it("redirects anonymous users to login", () => {
    expect(
      resolveBrokerRouteGate({
        isAuthenticated: false,
        hasBrokerProfile: false,
        pathname: BROKER_LISTINGS_PATH,
      }),
    ).toBe("redirect_login");
  });

  it("allows authenticated users without profile on onboarding only", () => {
    expect(
      resolveBrokerRouteGate({
        isAuthenticated: true,
        hasBrokerProfile: false,
        pathname: BROKER_ONBOARDING_PATH,
      }),
    ).toBe("allow");
  });

  it("redirects authenticated users without profile away from broker routes", () => {
    expect(
      resolveBrokerRouteGate({
        isAuthenticated: true,
        hasBrokerProfile: false,
        pathname: BROKER_LISTINGS_PATH,
      }),
    ).toBe("redirect_onboarding");
    expect(
      resolveBrokerRouteGate({
        isAuthenticated: true,
        hasBrokerProfile: false,
        pathname: BROKER_HOME_PATH,
      }),
    ).toBe("redirect_onboarding");
  });

  it("allows brokers on inventory routes", () => {
    expect(
      resolveBrokerRouteGate({
        isAuthenticated: true,
        hasBrokerProfile: true,
        pathname: BROKER_LISTINGS_PATH,
      }),
    ).toBe("allow");
    expect(
      resolveBrokerRouteGate({
        isAuthenticated: true,
        hasBrokerProfile: true,
        pathname: "/host/rentals/dashboard",
      }),
    ).toBe("allow");
  });

  it("redirects brokers away from onboarding to avoid loops", () => {
    expect(
      resolveBrokerRouteGate({
        isAuthenticated: true,
        hasBrokerProfile: true,
        pathname: BROKER_ONBOARDING_PATH,
      }),
    ).toBe("redirect_broker_home");
  });
});

describe("brokerLoginNextPath", () => {
  it("preserves broker paths for login return", () => {
    expect(brokerLoginNextPath("/host/rentals/listings")).toBe("/host/rentals/listings");
    expect(brokerLoginNextPath("/host/rentals/dashboard")).toBe("/host/rentals/dashboard");
  });

  it("falls back to rentals home for non-broker paths", () => {
    expect(brokerLoginNextPath("/host/events")).toBe(BROKER_HOME_PATH);
  });
});
