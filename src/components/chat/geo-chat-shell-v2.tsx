"use client";

import { AuthStatus } from "@/components/auth/auth-status";
import { ChatCanvasV2 } from "@/components/chat/chat-canvas-v2";
import { ChatNavDrawer } from "@/components/chat/chat-nav-drawer";
import { ChatWorkflowProvider } from "@/components/chat/chat-workflow-context";
import { ConciergeCopilotBridgeV2 } from "@/components/chat/concierge-copilot-bridge-v2";
import { EventLocalChatProvider } from "@/components/chat/event-local-chat-context";
import { EventSearchResultsProvider } from "@/components/chat/event-search-results-context";
import { GroundedFastPathProvider } from "@/components/chat/grounded-fast-path-context";
import { EventFastPathProvider } from "@/components/chat/event-fast-path-context";
import { LeadConfirmationBanner } from "@/components/chat/lead-confirmation-banner";
import { RentalFastPathProvider } from "@/components/chat/rental-fast-path-context";
import { RentalUiProvider } from "@/components/chat/rental-ui-context";
import { RestaurantFastPathProvider } from "@/components/chat/restaurant-fast-path-context";
import { RichCardResultsProvider } from "@/components/chat/rich-card-results-context";
import { VenueBookingConfirmationBanner } from "@/components/chat/venue-booking-confirmation-banner";
import { VenueBookingDirectHitlProvider } from "@/components/chat/venue-booking-direct-hitl-context";
import { MapUiSync } from "@/components/copilot/map-ui-sync";
import { ScheduleViewingModal } from "@/components/modals/schedule-viewing-modal";
import { CafeBookingSheet } from "@/components/sheets/cafe-booking-sheet";
import { EventProposalShell } from "@/components/sheets/event-proposal-shell";
import { EventVenueOfferingsSheet } from "@/components/sheets/event-venue-offerings-sheet";
import { NightlifeBookingSheet } from "@/components/sheets/nightlife-booking-sheet";
import { RestaurantBookingSheet } from "@/components/sheets/restaurant-booking-sheet";
import { VenueDetailSheet } from "@/components/sheets/venue-detail-sheet";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { MapsShell } from "@/components/maps/MapProvider";

function CafeBookingSheetMount() {
  const { cafeBookingTarget, cafeBookingOpen, closeCafeBooking } = useRentalUi();
  return (
    <CafeBookingSheet
      target={cafeBookingTarget}
      open={cafeBookingOpen}
      onOpenChange={(open) => {
        if (!open) closeCafeBooking();
      }}
    />
  );
}

function EventVenueOfferingsSheetMount() {
  const {
    eventVenueOfferingsTarget,
    eventVenueOfferingsOpen,
    closeEventVenueOfferings,
  } = useRentalUi();
  return (
    <EventVenueOfferingsSheet
      target={eventVenueOfferingsTarget}
      open={eventVenueOfferingsOpen}
      onOpenChange={(open) => {
        if (!open) closeEventVenueOfferings();
      }}
    />
  );
}

function EventProposalShellMount() {
  const {
    eventProposalShellTarget,
    eventProposalShellOpen,
    closeEventProposalShell,
  } = useRentalUi();
  return (
    <EventProposalShell
      target={eventProposalShellTarget}
      open={eventProposalShellOpen}
      onOpenChange={(open) => {
        if (!open) closeEventProposalShell();
      }}
    />
  );
}

function RestaurantBookingSheetMount() {
  const {
    restaurantBookingTarget,
    restaurantBookingOpen,
    closeRestaurantBooking,
  } = useRentalUi();
  return (
    <RestaurantBookingSheet
      target={restaurantBookingTarget}
      open={restaurantBookingOpen}
      onOpenChange={(open) => {
        if (!open) closeRestaurantBooking();
      }}
    />
  );
}

function NightlifeBookingSheetMount() {
  const {
    nightlifeBookingTarget,
    nightlifeBookingOpen,
    closeNightlifeBooking,
  } = useRentalUi();
  return (
    <NightlifeBookingSheet
      target={nightlifeBookingTarget}
      open={nightlifeBookingOpen}
      onOpenChange={(open) => {
        if (!open) closeNightlifeBooking();
      }}
    />
  );
}

/**
 * SAN-890 · CK-V2-004 — full /chat v2 shell (flag on).
 * v1 geo-chat-shell.tsx unchanged for flag-off rollback.
 */
export function GeoChatShellV2() {
  return (
    <ConciergeCopilotBridgeV2>
      <ChatWorkflowProvider>
        <RentalUiProvider>
          <RentalFastPathProvider>
            <EventFastPathProvider>
              <RestaurantFastPathProvider>
                <GroundedFastPathProvider>
                  <EventSearchResultsProvider>
                    <RichCardResultsProvider>
                      <EventLocalChatProvider>
                        <VenueBookingDirectHitlProvider>
                          <div
                            data-testid="geo-chat-shell-v2"
                            className="flex min-h-screen flex-col"
                          >
                            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
                              <div className="flex min-w-0 items-center gap-3">
                                <ChatNavDrawer />
                                <div className="min-w-0">
                                  <h1 className="text-lg font-semibold sm:text-xl">
                                    mdeai
                                  </h1>
                                  <p className="truncate text-xs text-muted-foreground sm:text-sm">
                                    Concierge — rentals, events, food, map
                                  </p>
                                </div>
                              </div>
                              <AuthStatus />
                            </header>
                            <MapsShell>
                              <MapUiSync />
                              <div className="flex min-h-0 flex-1 flex-col">
                                <LeadConfirmationBanner />
                                <VenueBookingConfirmationBanner />
                                <ChatCanvasV2 />
                              </div>
                            </MapsShell>
                            <ScheduleViewingModal />
                            <VenueDetailSheet />
                            <CafeBookingSheetMount />
                            <RestaurantBookingSheetMount />
                            <NightlifeBookingSheetMount />
                            <EventVenueOfferingsSheetMount />
                            <EventProposalShellMount />
                          </div>
                        </VenueBookingDirectHitlProvider>
                      </EventLocalChatProvider>
                    </RichCardResultsProvider>
                  </EventSearchResultsProvider>
                </GroundedFastPathProvider>
              </RestaurantFastPathProvider>
            </EventFastPathProvider>
          </RentalFastPathProvider>
        </RentalUiProvider>
      </ChatWorkflowProvider>
    </ConciergeCopilotBridgeV2>
  );
}
