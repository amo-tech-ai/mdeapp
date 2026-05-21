"use client";

import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { SignOutButton } from "@/components/auth/sign-out-button";

export function AuthStatus() {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Checking session…
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-xs text-muted-foreground">
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
        {" · "}
        <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span className="font-mono truncate max-w-[14rem]">{user.email}</span>
      <SignOutButton />
    </div>
  );
}
