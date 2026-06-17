import { EmptyState } from "@/components/empty/empty-state";

const GENERIC_DESCRIPTION =
  "We couldn't confirm your broker profile. Try again in a moment, or sign out and sign back in.";

/** Broker gate failed to load profile context — no raw backend errors in UI. */
export function BrokerRentalsGateError() {
  return (
    <EmptyState
      testId="host-rentals-gate-error"
      title="Couldn't verify broker access"
      description={GENERIC_DESCRIPTION}
    />
  );
}
