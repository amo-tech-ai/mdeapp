import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthExistingSessionProps = {
  email: string;
  nextPath: string;
  mode: "login" | "signup";
};

export function AuthExistingSession({
  email,
  nextPath,
  mode,
}: AuthExistingSessionProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Already signed in</CardTitle>
        <CardDescription>
          Your browser already has an active session for this email.{" "}
          {mode === "signup"
            ? "That email is already registered — use Sign in, or sign out to use a different account."
            : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm font-mono truncate">{email}</p>
        <Link
          href={nextPath}
          className={cn(buttonVariants(), "w-full")}
        >
          Continue to {nextPath === "/" ? "home" : nextPath}
        </Link>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <SignOutButton />
        <p className="text-xs text-muted-foreground">
          Sign out first if you need a different Google account or email.
        </p>
      </CardFooter>
    </Card>
  );
}
