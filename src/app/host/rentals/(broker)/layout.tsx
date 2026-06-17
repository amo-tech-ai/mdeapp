import { redirect } from "next/navigation";
import { HostRentalsShell } from "@/components/host/rentals/host-rentals-shell";
import { BROKER_ONBOARDING_PATH, brokerLoginNextPath } from "@/lib/rentals/broker-route-gate";
import { getBrokerContext } from "@/lib/rentals/get-broker-context";
import { getBrokerRequestPathname } from "@/lib/rentals/get-broker-request-path";

/** RE-WIRE-001 — broker shell + profile gate for inventory routes. */
export default async function HostRentalsBrokerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getBrokerContext();

  if (ctx.state === "unauthorized") {
    const next = brokerLoginNextPath(await getBrokerRequestPathname());
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  if (ctx.state === "error") {
    redirect(BROKER_ONBOARDING_PATH);
  }

  if (!ctx.hasBrokerProfile) {
    redirect(BROKER_ONBOARDING_PATH);
  }

  return <HostRentalsShell>{children}</HostRentalsShell>;
}
