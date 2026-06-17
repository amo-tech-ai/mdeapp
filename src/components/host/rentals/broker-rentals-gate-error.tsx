import { EmptyState } from "@/components/empty/empty-state";

/** Broker gate failed to load profile context. */
export function BrokerRentalsGateError({ message }: { message: string }) {
  return (
    <EmptyState
      testId="host-rentals-gate-error"
      title="Couldn't verify broker access"
      description={message}
    />
  );
}
