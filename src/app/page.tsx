"use client";

import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useCoAgent } from "@copilotkit/react-core";
import type { MdeState } from "@/lib/types";

export default function HomePage() {
  return (
    <main
      style={
        {
          "--copilot-kit-primary-color": "#0f766e",
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
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50 text-slate-900">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-semibold mb-2">mdeai-app — day 1</h1>
        <p className="text-sm text-slate-600 mb-6">
          CopilotKit 1.55.2 + Mastra + Gemini 3.5 Flash.
        </p>
        <pre className="text-xs bg-white border border-slate-200 rounded p-3 overflow-x-auto">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  );
}
