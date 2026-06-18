"use client";

import { useState } from "react";
import { HostRentalsNav } from "@/components/host/rentals/host-rentals-nav";
import { RentalsConciergeCenter } from "@/components/host/rentals/rentals-concierge-center";
import { RentalsConversationHistory } from "@/components/host/rentals/rentals-conversation-history";
import {
  RentalsDynamicWorkspace,
  type RentalsWorkspaceMode,
} from "@/components/host/rentals/rentals-dynamic-workspace";
import { cn } from "@/lib/utils";

type MobilePane = "feed" | "chat" | "workspace";

export type RentalsConciergeShellProps = {
  workspaceMode?: RentalsWorkspaceMode;
};

/**
 * SAN-1093 · RE-DES-002 Phase A — broker three-panel shell (kit: RentalsConcierge.jsx).
 * CopilotChat + brokerAgent wire in SAN-1124 / SAN-1035.
 */
// skipcq: JS-0067 - ES module export; not browser global scope
export function RentalsConciergeShell({
  workspaceMode = "concierge",
}: RentalsConciergeShellProps) {
  const [mobilePane, setMobilePane] = useState<MobilePane>("chat");

  return (
    <div
      data-testid="rentals-concierge"
      className="flex min-h-[calc(100dvh-7rem)] flex-col gap-3 md:min-h-[calc(100dvh-5rem)]"
    >
      <HostRentalsNav />

      <div
        className={cn(
          "grid min-h-0 flex-1 gap-4",
          "max-lg:flex max-lg:flex-col",
          "lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)_minmax(300px,340px)]",
        )}
      >
        <div
          className={cn(
            "min-h-0",
            mobilePane !== "feed" && "max-lg:hidden",
            "lg:block",
          )}
        >
          <RentalsConversationHistory />
        </div>

        <div
          className={cn(
            "min-h-0 min-w-0",
            mobilePane !== "chat" && "max-lg:hidden",
            "lg:block",
          )}
        >
          <RentalsConciergeCenter mode={workspaceMode} />
        </div>

        <div
          className={cn(
            "min-h-0",
            mobilePane !== "workspace" && "max-lg:hidden",
            "lg:block",
          )}
        >
          <RentalsDynamicWorkspace mode={workspaceMode} />
        </div>
      </div>

      <nav
        className="flex shrink-0 gap-1 border-t border-border pt-2 lg:hidden"
        aria-label="Concierge mobile panes"
      >
        {(
          [
            { id: "feed" as const, label: "Feed" },
            { id: "chat" as const, label: "Chat" },
            { id: "workspace" as const, label: "Workspace" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobilePane(tab.id)}
            className={cn(
              "flex-1 rounded-md py-2 text-sm font-medium",
              mobilePane === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
