import { redirect } from "next/navigation";
import { BrokerRentalsGateError } from "@/components/host/rentals/broker-rentals-gate-error";
import { BROKER_HOME_PATH } from "@/lib/rentals/broker-route-gate";
import { getBrokerContext } from "@/lib/rentals/get-broker-context";

export const metadata = {
  title: "Broker onboarding · mdeai",
};

/** RE-WIRE-001 — loop-safe onboarding shell; wizard ships in SAN-1092. */
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
    <main
      data-testid="host-rentals-onboarding"
      className="mx-auto max-w-lg space-y-4 py-12"
    >
      <h1 className="font-serif text-2xl font-semibold">Broker onboarding</h1>
      <p className="text-sm text-muted-foreground">
        Create your broker profile to list rentals on mdeai.
      </p>
    </main>
  );
}
