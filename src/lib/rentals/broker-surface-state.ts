/** PTR-RENTALS-005 / SAN-1108 — broker UI data contracts (loading | empty | result | error) */

import { DATA_PENDING_LABEL, formatBrokerMetric } from "./data-pending";
import type { ListingWorkflowStatus } from "./listing-workflow";

export type BrokerSurfaceKind =
  | "broker_listings"
  | "broker_leads"
  | "broker_showings"
  | "publish_transition";

export type BrokerSurfaceLoading = {
  kind: BrokerSurfaceKind;
  state: "loading";
};

export type BrokerSurfaceEmpty = {
  kind: BrokerSurfaceKind;
  state: "empty";
  message: string;
};

export type BrokerSurfaceError = {
  kind: BrokerSurfaceKind;
  state: "error";
  message: string;
  retryable: boolean;
};

export type BrokerSurfaceResult<T> = {
  kind: BrokerSurfaceKind;
  state: "result";
  data: T;
};

export type BrokerSurfaceState<T> =
  | BrokerSurfaceLoading
  | BrokerSurfaceEmpty
  | BrokerSurfaceError
  | BrokerSurfaceResult<T>;

export type BrokerListingRow = {
  id: string;
  title: string;
  listingWorkflowStatus: ListingWorkflowStatus;
  neighborhood: string;
};

export type BrokerLeadRow = {
  id: string;
  apartmentId: string | null;
  status: string;
  createdAt: string;
};

export type BrokerShowingRow = {
  id: string;
  apartmentId: string;
  leadId: string;
  scheduledAt: string;
  status: string;
};

export type PublishTransitionResult = {
  apartmentId: string;
  listingWorkflowStatus: ListingWorkflowStatus;
  publishedAt: string | null;
  publishedBy: string | null;
};

export function brokerSurfaceLoading(kind: BrokerSurfaceKind): BrokerSurfaceLoading {
  return { kind, state: "loading" };
}

export function brokerSurfaceEmpty(
  kind: BrokerSurfaceKind,
  message = "Nothing here yet.",
): BrokerSurfaceEmpty {
  return { kind, state: "empty", message };
}

export function brokerSurfaceError(
  kind: BrokerSurfaceKind,
  message: string,
  retryable = true,
): BrokerSurfaceError {
  return { kind, state: "error", message, retryable };
}

export function brokerSurfaceResult<T>(
  kind: BrokerSurfaceKind,
  data: T,
): BrokerSurfaceResult<T> {
  return { kind, state: "result", data };
}

export function formatPublishAuditValue(value: string | null | undefined): string {
  return formatBrokerMetric(value);
}
