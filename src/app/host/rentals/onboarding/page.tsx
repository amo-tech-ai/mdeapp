import { redirect } from "next/navigation";
import { RentalsOnboardingWizard } from "@/components/host/rentals/rentals-onboarding-wizard";
import { BrokerRentalsGateError } from "@/components/host/rentals/broker-rentals-gate-error";
import { BROKER_HOME_PATH } from "@/lib/rentals/broker-route-gate";
import { getBrokerContext } from "@/lib/rentals/get-broker-context";

export const metadata = {
  title: "Broker onboarding · mdeai",
};

/** RE-DES-005 — broker onboarding wizard (SAN-1092). */
// skipcq: JS-0067
export default async function HostRentalsOnboardingPage() {
  const ctx = await getBrokerContext();

  if (ctx.state === "unauthorized") {
    redirect("/login?next=/host/rentals/onboarding");
  }

  if (ctx.state === "error") {
    console.error("[host/rentals/onboarding] broker context error:", ctx.message);
    return <BrokerRentalsGateError />;
  }

  if (ctx.hasBrokerProfile) {
    redirect(BROKER_HOME_PATH);
  }

  return (
    <main data-testid="host-rentals-onboarding">
      <RentalsOnboardingWizard />
    </main>
  );
}
