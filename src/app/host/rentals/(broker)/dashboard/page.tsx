import { redirect } from "next/navigation";
import { BROKER_OVERVIEW_PATH } from "@/lib/rentals/broker-route-gate";

/** SAN-1095 · RE-DES-004 — legacy dashboard URL → concierge overview mode (SAN-1093 shell). */
// skipcq: JS-0067 - Next.js App Router page default export
export default function HostRentalsDashboardPage() {
  redirect(BROKER_OVERVIEW_PATH);
}
