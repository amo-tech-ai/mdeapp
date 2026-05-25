import { HostEventShell } from "@/components/host/host-event-shell";
import { getServerUser } from "@/lib/auth/session";

export const metadata = {
  title: "Create event · mdeai",
};

export default async function HostEventNewPage() {
  const { user } = await getServerUser();

  return <HostEventShell userEmail={user?.email} />;
}
