"use client";

import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useCoAgent } from "@copilotkit/react-core";
import { AuthStatus } from "@/components/auth/auth-status";
import type { MdeState } from "@/lib/types";

export default function HomePage() {
  return (
    <main
      style={
        {
          "--copilot-kit-primary-color": "var(--primary)",
        } as CopilotKitCSSProperties
      }
    >
      <CopilotSidebar
        defaultOpen
        clickOutsideToClose={false}
        labels={{
          title: "mdeai concierge",
          initial:
            "👋 Hi — I'm the mdeai assistant. Day-1 echo mode. Type anything to test the connection.",
        }}
      >
        <Shell />
      </CopilotSidebar>
    </main>
  );
}

function Shell() {
  const { state } = useCoAgent<MdeState>({
    name: "pingAgent",
    initialState: { lastQuery: "", hint: "" },
  });
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background text-foreground">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-semibold mb-2">mdeai-app — day 1</h1>
        <p className="text-sm text-muted-foreground mb-2">
          CopilotKit 1.55.2 + Mastra + Gemini 3.5 Flash.
        </p>
        <div className="mb-6">
          <AuthStatus />
        </div>
        <pre className="text-xs bg-card border border-border rounded p-3 overflow-x-auto">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  );
}
