import { CopilotKit } from "@copilotkit/react-core";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";

export default function HostEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CopilotKit {...getCopilotKitClientProps("hostEventAgent")}>
      {children}
    </CopilotKit>
  );
}
