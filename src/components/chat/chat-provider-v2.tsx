"use client";

/** SAN-901 approved exception: v2 subpath only on gated /chat spike path. */
import "@copilotkit/react-core/v2/styles.css";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { useState, type ReactNode } from "react";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";
import { reportConciergeError } from "@/lib/concierge-error-store";

/**
 * SAN-890 · CK-V2-004 — v2 subpath provider for /chat (flag on).
 * Fresh threadId per mount — ThreadNav wiring follows in later SAN-890 slices.
 *
 * `@copilotkit/react-core/v2` re-exports the v1 CopilotKit provider (1.55.2),
 * which still supplies CopilotContext — useCopilotChat / useCoAgent stay valid here.
 */
export function ChatProviderV2({ children }: { children: ReactNode }) {
  const [threadId] = useState(() => crypto.randomUUID());

  return (
    <CopilotKit
      {...getCopilotKitClientProps("conciergeAgent")}
      threadId={threadId}
      enableInspector={false}
      onError={reportConciergeError}
    >
      {children}
    </CopilotKit>
  );
}
