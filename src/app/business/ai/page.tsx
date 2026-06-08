/**
 * SAN-663 — MKT AI Services for companies (/business/ai).
 * Placeholder stub so the SAN-692 partner hub "Agency" card does not 404.
 * Full landing (services, packages, demo form) is built under SAN-663.
 * Note: /business/ai is also a child of the /business hub (SAN-726).
 */
import { PartnerLandingPlaceholder } from "@/components/partners/partner-landing-placeholder";

export const metadata = {
  title: "AI Services for Business · mdeai",
  description:
    "AI builds, automation, and social management for Medellín companies and agencies. Full AI services landing coming soon.",
};

export default function BusinessAiPage() {
  return (
    <PartnerLandingPlaceholder
      partnerLabel="AI services for business"
      tagline="AI builds and automation for Medellín companies and agencies."
      description="A landing for agencies and brands buying AI services is on the way. We build the automations, run the social, and put an AI concierge in front of your customers — so your team ships faster."
      highlights={[
        "Custom AI builds and workflow automation",
        "Social management and content automation",
        "Concierge experiences embedded for your audience",
      ]}
      signupType="agency"
      linearRef="SAN-663 — MKT AI Services for companies"
    />
  );
}
