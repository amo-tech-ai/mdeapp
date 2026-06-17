"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { BrokerListingDetail } from "@/lib/rentals/broker-listing-detail";
import type {
  BrokerListingLeadSummary,
  BrokerListingShowingSummary,
} from "@/lib/rentals/broker-listing-detail";
import { DATA_PENDING_LABEL, formatBrokerMetric } from "@/lib/rentals/data-pending";
import { formatBrokerMonthlyRent } from "@/lib/rentals/format-broker-rent";
import {
  listingCompletenessChecks,
  listingCompletenessPercent,
} from "@/lib/rentals/listing-completeness";
import {
  publishActionLabel,
  publishRequiresAck,
} from "@/lib/rentals/resolve-publish-rpc";
import { ListingWorkflowPill } from "@/components/host/rentals/listing-workflow-pill";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type DrawerTab = "overview" | "leads" | "viewings" | "marketing" | "performance";

type RentalsListingsDrawerProps = {
  listing: BrokerListingDetail | null;
  open: boolean;
  onClose: () => void;
  onPublish: (listing: BrokerListingDetail) => Promise<void>;
  publishing: boolean;
  publishError: string | null;
};

export function RentalsListingsDrawer({
  listing,
  open,
  onClose,
  onPublish,
  publishing,
  publishError,
}: RentalsListingsDrawerProps) {
  const [tab, setTab] = useState<DrawerTab>("overview");
  const [ack, setAck] = useState(false);
  const [leads, setLeads] = useState<BrokerListingLeadSummary[]>([]);
  const [showings, setShowings] = useState<BrokerListingShowingSummary[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailLoadedFor, setDetailLoadedFor] = useState<string | null>(null);

  const loadDetail = useCallback(async (apartmentId: string): Promise<boolean> => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await fetch(`/api/host/rentals/listings/${apartmentId}/detail`);
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Failed to load listing detail");
      }
      const body = (await res.json()) as {
        leads: BrokerListingLeadSummary[];
        showings: BrokerListingShowingSummary[];
      };
      setLeads(body.leads ?? []);
      setShowings(body.showings ?? []);
      return true;
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : "Failed to load detail");
      return false;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleTabChange = (next: DrawerTab) => {
    setTab(next);
    if (!listing) return;
    if (
      (next === "leads" || next === "viewings" || next === "performance") &&
      detailLoadedFor !== listing.id
    ) {
      void loadDetail(listing.id).then((ok) => {
        if (ok) setDetailLoadedFor(listing.id);
      });
    }
  };

  if (!open || !listing) return null;

  const completeness = listingCompletenessPercent(listing);
  const checks = listingCompletenessChecks(listing);
  const actionLabel = publishActionLabel(listing.listingWorkflowStatus);
  const needsAck = publishRequiresAck(listing.listingWorkflowStatus);
  const publishDisabled =
    !actionLabel || publishing || (needsAck && !ack);

  return (
    <div
      data-testid="listings-drawer"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col border-l border-border bg-background shadow-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Property drawer"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <ListingWorkflowPill status={listing.listingWorkflowStatus} />
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close drawer"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="relative aspect-video bg-muted">
        {listing.images[0] ? (
          <Image
            src={listing.images[0]}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No photos yet
          </div>
        )}
        <span className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-0.5 text-xs">
          {listing.images.length} photo{listing.images.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="space-y-1 border-b border-border px-4 py-3">
        <h2 className="text-lg font-semibold">{listing.title}</h2>
        <p className="text-sm text-muted-foreground">
          {formatBrokerMetric(listing.address)} · {listing.neighborhood}
        </p>
        <p className="text-sm">
          {listing.bedrooms ?? "—"} BR · {listing.bathrooms ?? "—"} BA ·{" "}
          {formatBrokerMonthlyRent(listing.priceMonthly, listing.currency)}
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => handleTabChange(v as DrawerTab)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsList className="mx-4 mt-2 w-auto justify-start overflow-x-auto">
          <TabsTrigger value="overview" data-testid="lx-tab-overview">
            Overview
          </TabsTrigger>
          <TabsTrigger value="leads" data-testid="lx-tab-leads">
            Leads
          </TabsTrigger>
          <TabsTrigger value="viewings" data-testid="lx-tab-viewings">
            Viewings
          </TabsTrigger>
          <TabsTrigger value="marketing" data-testid="lx-tab-marketing">
            Marketing
          </TabsTrigger>
          <TabsTrigger value="performance" data-testid="lx-tab-performance">
            Perf
          </TabsTrigger>
        </TabsList>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <TabsContent value="overview" className="mt-0 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Completeness</span>
                <span>{completeness}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <ul className="mt-2 space-y-1 text-xs">
                {checks.map((check) => (
                  <li
                    key={check.key}
                    className={cn(
                      check.complete ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {check.complete ? "✓" : "○"} {check.label}
                    {!check.complete ? ` (+${check.gain}%)` : ""}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Description
              </label>
              <Textarea
                readOnly
                value={listing.description ?? ""}
                placeholder="Add a description in listing editor (coming soon)."
                className="mt-1 min-h-[100px]"
              />
            </div>

            {needsAck ? (
              <label className="flex items-start gap-2 text-sm" htmlFor="r2-publish-ack">
                <input
                  type="checkbox"
                  data-testid="listings-publish-ack"
                  id="r2-publish-ack"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                  className="mt-1 size-4 rounded border-border"
                />
                <span>I confirm I can publish this listing accurately.</span>
              </label>
            ) : null}

            {actionLabel ? (
              <Button
                type="button"
                data-testid="lx-publish"
                disabled={publishDisabled}
                onClick={() => void onPublish(listing)}
                className="w-full"
              >
                {publishing ? "Working…" : actionLabel}
              </Button>
            ) : null}

            {publishError ? (
              <p className="text-sm text-destructive" role="alert">
                {publishError}
              </p>
            ) : null}
          </TabsContent>

          <TabsContent value="leads" className="mt-0">
            {detailLoading ? (
              <p className="text-sm text-muted-foreground">Loading leads…</p>
            ) : detailError ? (
              <p className="text-sm text-destructive">{detailError}</p>
            ) : leads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leads yet for this unit.</p>
            ) : (
              <ul className="space-y-2">
                {leads.map((lead) => (
                  <li key={lead.id} className="rounded-lg border border-border p-2 text-sm">
                    <p className="font-medium">{formatBrokerMetric(lead.name)}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.status} · {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="viewings" className="mt-0">
            {detailLoading ? (
              <p className="text-sm text-muted-foreground">Loading viewings…</p>
            ) : detailError ? (
              <p className="text-sm text-destructive">{detailError}</p>
            ) : showings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No viewings scheduled.</p>
            ) : (
              <ul className="space-y-2">
                {showings.map((showing) => (
                  <li key={showing.id} className="rounded-lg border border-border p-2 text-sm">
                    <p className="font-medium">
                      {new Date(showing.scheduledAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{showing.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="marketing" className="mt-0">
            <p className="text-sm text-muted-foreground">
              Marketing drafts live in Concierge — nothing posts without your approval.
            </p>
          </TabsContent>

          <TabsContent value="performance" className="mt-0">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Views</dt>
                <dd>{DATA_PENDING_LABEL}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Inquiries</dt>
                <dd>{DATA_PENDING_LABEL}</dd>
              </div>
            </dl>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
