import { redirect } from "next/navigation";
import { HostRentalsShell } from "@/components/host/rentals/host-rentals-shell";
import { BROKER_ONBOARDING_PATH } from "@/lib/rentals/broker-route-gate";
import { getBrokerContext } from "@/lib/rentals/get-broker-context";

/** RE-WIRE-001 — broker shell + profile gate for inventory routes. */
export default async function HostRentalsBrokerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getBrokerContext();

  if (ctx.state === "unauthorized") {
    redirect("/login?next=/host/rentals");
  }

  if (ctx.state === "error") {
    redirect(BROKER_ONBOARDING_PATH);
  }

  if (!ctx.hasBrokerProfile) {
    redirect(BROKER_ONBOARDING_PATH);
  }

  return <HostRentalsShell>{children}</HostRentalsShell>;
}
