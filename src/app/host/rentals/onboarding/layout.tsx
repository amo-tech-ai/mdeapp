import { RentalsOnboardingMinimalChrome } from "@/components/host/rentals/rentals-onboarding-minimal-chrome";

/** RE-DES-005 — minimal chrome (no HostNavRail). */
export default function HostRentalsOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RentalsOnboardingMinimalChrome>{children}</RentalsOnboardingMinimalChrome>;
}
