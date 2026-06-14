"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { AuthStatus } from "@/components/auth/auth-status";
import { ConciergeCopilotBridgeV2 } from "@/components/chat/concierge-copilot-bridge-v2";

const SPIKE_LABELS = {
  modalHeaderTitle: "Medellín concierge (v2 spike)",
  welcomeMessageText:
    'Hi — v2 spike path. Try: "1BR in Laureles under $80/night" for a rental card, or ask to book a café table for HITL.',
};

/**
 * SAN-901 · CK-V2-004A — minimal /chat v2 shell (flag on).
 * Full GeoChatShell unchanged for flag-off parity.
 */
export function ChatSpikeShellV2() {
  return (
    <ConciergeCopilotBridgeV2>
      <div
        data-testid="chat-spike-shell-v2"
        className="flex min-h-screen flex-col bg-background text-foreground"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold sm:text-xl">mdeai · chat v2 spike</h1>
            <p className="truncate text-xs text-muted-foreground sm:text-sm">
              SAN-901 — useAgent · 1 tool · 1 HITL
            </p>
          </div>
          <AuthStatus />
        </header>

        <section
          aria-label="Concierge chat v2 spike"
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          <div
            id="copilot-chat-region"
            data-testid="copilot-chat-region"
            aria-live="polite"
            aria-relevant="additions"
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-2 pb-2 pt-1 sm:px-4"
          >
            <CopilotChat
              agentId="conciergeAgent"
              className="copilotKitChat--center mde-center-copilot-chat min-h-0 flex-1"
              labels={SPIKE_LABELS}
            />
          </div>
        </section>
      </div>
    </ConciergeCopilotBridgeV2>
  );
}
