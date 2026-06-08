/**
 * SAN-660 — MKT For Event Hosts landing (/host).
 * Public marketing page — not auth-gated. Drives Roberto to host signup + wizard.
 * Wireframe: tasks/partners/wireframes/host-wireframe.html
 */
import { EventHostLanding } from "@/components/partners/event-host-landing";

export const metadata = {
  title: "For Event Hosts · mdeai",
  description:
    "Publish a sellable Medellín event in about 30 seconds with AI form-fill, ticketing, and map visibility. Start as a host on mdeai.",
};

export default function HostMarketingPage() {
  return <EventHostLanding />;
}
