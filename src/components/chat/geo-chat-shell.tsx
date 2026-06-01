"use client";

import { AuthStatus } from "@/components/auth/auth-status";
import { ChatCanvas } from "@/components/chat/chat-canvas";
import { ChatNavDrawer } from "@/components/chat/chat-nav-drawer";
import { ChatWorkflowProvider } from "@/components/chat/chat-workflow-context";
import { RentalUiProvider } from "@/components/chat/rental-ui-context";
import { RentalFastPathProvider } from "@/components/chat/rental-fast-path-context";
import { EventFastPathProvider } from "@/components/chat/event-fast-path-context";
import { RestaurantFastPathProvider } from "@/components/chat/restaurant-fast-path-context";
import { EventSearchResultsProvider } from "@/components/chat/event-search-results-context";
import { RichCardResultsProvider } from "@/components/chat/rich-card-results-context";
import { EventLocalChatProvider } from "@/components/chat/event-local-chat-context";
import { FocusMapPinAction } from "@/components/copilot/focus-map-pin-action";
import { MapUiSync } from "@/components/copilot/map-ui-sync";
import { SearchToolRenders } from "@/components/copilot/search-tool-renders";
import { EventWebCitationFetch } from "@/components/copilot/event-web-citation-fetch";
import { EventWebCitationSync } from "@/components/copilot/event-web-citation-sync";
import { LeadConfirmationBanner } from "@/components/chat/lead-confirmation-banner";
import { ScheduleViewingModal } from "@/components/modals/schedule-viewing-modal";
import { VenueDetailSheet } from "@/components/sheets/venue-detail-sheet";
import { CafeBookingSheet } from "@/components/sheets/cafe-booking-sheet";
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

/** SCREEN-001 — Mindtrip shell: nav | center CopilotChat | map. */
export function GeoChatShell() {
  return (
    <ChatWorkflowProvider>
      <RentalUiProvider>
        <RentalFastPathProvider>
          <EventFastPathProvider>
          <RestaurantFastPathProvider>
          <EventSearchResultsProvider>
            <RichCardResultsProvider>
              <EventLocalChatProvider>
              <div className="flex min-h-screen flex-col">
                <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <ChatNavDrawer />
                    <div className="min-w-0">
                      <h1 className="text-lg font-semibold sm:text-xl">mdeai</h1>
                      <p className="truncate text-xs text-muted-foreground sm:text-sm">
                        Concierge — rentals, events, food, map
                      </p>
                    </div>
                  </div>
                  <AuthStatus />
                </header>
                <MapsShell>
                  <SearchToolRenders />
                  <EventWebCitationSync />
                  <EventWebCitationFetch />
                  <MapUiSync />
                  <FocusMapPinAction />
                  <div className="flex min-h-0 flex-1 flex-col">
                    <LeadConfirmationBanner />
                    <ChatCanvas />
                  </div>
                </MapsShell>
                <ScheduleViewingModal />
                <VenueDetailSheet />
                <CafeBookingSheetMount />
              </div>
              </EventLocalChatProvider>
            </RichCardResultsProvider>
          </EventSearchResultsProvider>
          </RestaurantFastPathProvider>
          </EventFastPathProvider>
        </RentalFastPathProvider>
      </RentalUiProvider>
    </ChatWorkflowProvider>
  );
}
