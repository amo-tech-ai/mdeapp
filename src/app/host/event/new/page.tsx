import Link from "next/link";
import { getServerUser } from "@/lib/auth/session";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function HostEventNewPage() {
  const { user } = await getServerUser();

  return (
    <main className="min-h-screen p-8 bg-background text-foreground">
      <div className="max-w-xl mx-auto space-y-4">
        <p className="text-xs text-muted-foreground">W3 placeholder — auth gate only</p>
        <h1 className="text-2xl font-semibold">Host event (protected)</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as <span className="font-mono">{user?.email ?? "unknown"}</span>
        </p>
        <div className="flex gap-3">
          <SignOutButton />
          <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
