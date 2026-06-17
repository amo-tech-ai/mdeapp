import { redirect } from "next/navigation";
import { BrokerRentalsGateError } from "@/components/host/rentals/broker-rentals-gate-error";
import { brokerLoginNextPath } from "@/lib/rentals/broker-route-gate";
import { getBrokerContext } from "@/lib/rentals/get-broker-context";

export const metadata = {
  title: "Rentals host · mdeai",
};

/** RE-WIRE-001 — auth gate only; shell lives under `(broker)/layout`. */
export default async function HostRentalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getBrokerContext();

  if (ctx.state === "unauthorized") {
    const next = brokerLoginNextPath("/host/rentals");
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  if (ctx.state === "error") {
    return <BrokerRentalsGateError message={ctx.message} />;
  }

  return children;
}
