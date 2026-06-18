import type { BrokerListingDetail } from "./broker-listing-detail";
import { listingCompletenessChecks } from "./listing-completeness";
import { DATA_PENDING_LABEL } from "./data-pending";
import type {
  BrokerAttentionItem,
  BrokerDashboardBriefing,
  BrokerDashboardKpi,
  BrokerDashboardView,
  BrokerTrendCard,
} from "./broker-dashboard-types";

export type BrokerLeadRow = {
  id: string;
  name: string | null;
  status: string;
  created_at: string;
  last_contacted_at: string | null;
  apartment_id: string | null;
};

export type BrokerShowingRow = {
  id: string;
  apartment_id: string;
  scheduled_at: string;
  status: string;
  lead_id: string;
};

export type BuildBrokerDashboardInput = {
  displayName: string | null;
  listings: BrokerListingDetail[];
  publishedListingsCount: number;
  leads7dCount: number;
  viewingsBookedCount: number;
  apartmentCount: number;
  unansweredLeads: BrokerLeadRow[];
  upcomingShowings: BrokerShowingRow[];
  leads30dCount: number | null;
  views30dCount: number | null;
};

function greetingFor(name: string | null): string { // skipcq: JS-0067 - module-local helper
  const hour = new Date().getHours();
  const salutation = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return name?.trim() ? `${salutation}, ${name.trim()}.` : `${salutation}.`;
}

/** Pure builder — unit-tested without Supabase. */
// skipcq: JS-0067 - ES module export; not browser global scope
// skipcq: JS-0044, JS-R1005 - attention queue branches; split when SAN-1093 overview grows
export function buildBrokerDashboardView(input: BuildBrokerDashboardInput): BrokerDashboardView {
  const drafts = input.listings.filter((l) => l.listingWorkflowStatus === "draft");

  const draftsNeedingPhotos = drafts.filter((listing) => { // skipcq: JS-0067 - completeness predicate
    const photos = listingCompletenessChecks(listing).find((c) => c.key === "photos");
    return photos ? !photos.complete : listing.images.length < 3;
  });

  const kpis: BrokerDashboardKpi[] = [
    {
      id: "active_listings",
      label: "Active listings",
      value: String(input.publishedListingsCount),
      provenance: "From apartments · published",
      testId: "r1-kpi-0",
    },
    {
      id: "leads_7d",
      label: "New leads (7d)",
      value: String(input.leads7dCount),
      provenance: "From leads · last 7 days",
      testId: "r1-kpi-1",
    },
    {
      id: "viewings_booked",
      label: "Viewings booked",
      value: String(input.viewingsBookedCount),
      provenance: "From showings · upcoming",
      testId: "r1-kpi-2",
    },
    {
      id: "avg_response",
      label: "Avg response time",
      value: DATA_PENDING_LABEL,
      provenance: "Needs lead reply timestamps",
      testId: "r1-kpi-3",
    },
  ];

  const attention: BrokerAttentionItem[] = [];

  for (const listing of draftsNeedingPhotos.slice(0, 5)) {
    attention.push({
      id: `draft-${listing.id}`,
      kind: "draft_missing_photos",
      title: "Listing draft · missing photos",
      detail: listing.title || listing.address || "Untitled draft",
      href: `/host/rentals/listings?focus=${listing.id}`,
      ctaLabel: "Open listing",
      testId: `r1-attn-draft-${listing.id}`,
    });
  }

  for (const lead of input.unansweredLeads.slice(0, 5)) {
    attention.push({
      id: `lead-${lead.id}`,
      kind: "lead_unanswered",
      title: `Lead ${lead.name?.trim() || "Unknown"} · no reply yet`,
      detail: "Status: new",
      href: "/host/rentals/listings",
      ctaLabel: "Open listings",
      testId: `r1-attn-lead-${lead.id}`,
    });
  }

  for (const showing of input.upcomingShowings.filter((s) => s.status === "scheduled").slice(0, 5)) {
    const when = new Date(showing.scheduled_at).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    attention.push({
      id: `showing-${showing.id}`,
      kind: "viewing_confirm",
      title: `Viewing ${when}`,
      detail: "Confirm or decline",
      href: "/host/rentals/listings",
      ctaLabel: "Review",
      testId: `r1-attn-showing-${showing.id}`,
    });
  }

  const attentionCount = attention.length;
  const bullets: string[] = [];
  if (draftsNeedingPhotos.length > 0) {
    bullets.push(
      `${draftsNeedingPhotos.length} listing${draftsNeedingPhotos.length === 1 ? "" : "s"} need photos`,
    );
  }
  if (input.unansweredLeads.length > 0) {
    bullets.push(
      `${input.unansweredLeads.length} lead${input.unansweredLeads.length === 1 ? "" : "s"} waiting`,
    );
  }
  const pendingShowings = input.upcomingShowings.filter((s) => s.status === "scheduled").length;
  if (pendingShowings > 0) {
    bullets.push(
      `${pendingShowings} viewing${pendingShowings === 1 ? "" : "s"} to confirm`,
    );
  }

  const briefing: BrokerDashboardBriefing = {
    greeting: greetingFor(input.displayName),
    summary:
      attentionCount > 0
        ? `${attentionCount} item${attentionCount === 1 ? "" : "s"} need you today.`
        : "You're caught up on listings and leads.",
    bullets,
  };

  const trends: BrokerTrendCard[] = [
    {
      id: "occupancy",
      label: "Occupancy",
      value: DATA_PENDING_LABEL,
      testId: "r1-trend-occupancy",
    },
    {
      id: "leads",
      label: "Leads (30d)",
      value:
        input.leads30dCount === null ? DATA_PENDING_LABEL : String(input.leads30dCount),
      testId: "r1-trend-leads",
    },
    {
      id: "conversion",
      label: "Conversion",
      value: DATA_PENDING_LABEL,
      testId: "r1-trend-conversion",
    },
    {
      id: "views",
      label: "Views (30d)",
      value:
        input.views30dCount === null ? DATA_PENDING_LABEL : String(input.views30dCount),
      testId: "r1-trend-views",
    },
  ];

  const isEmpty =
    input.apartmentCount === 0 &&
    input.leads7dCount === 0 &&
    input.viewingsBookedCount === 0;

  return {
    displayName: input.displayName,
    kpis,
    attention,
    trends,
    briefing,
    isEmpty,
  };
}
