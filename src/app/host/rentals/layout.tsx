import { redirect } from "next/navigation";
import { HostRentalsNav } from "@/components/host/rentals/host-rentals-nav";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Rentals host · mdeai",
};

/** RE-WIRE-001 — shared shell for `/host/rentals/*`. */
export default async function HostRentalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/host/rentals/listings");

  return (
    <div data-testid="host-rentals-layout" className="mx-auto min-h-screen max-w-7xl px-4 py-6">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Rentals OS
        </p>
        <HostRentalsNav />
      </div>
      {children}
    </div>
  );
}
