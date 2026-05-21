"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { sendMagicLink, type AuthActionResult } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthEmailFormProps = {
  mode: "login" | "signup";
  nextPath: string;
  authError?: string | null;
};

export function AuthEmailForm({ mode, nextPath, authError }: AuthEmailFormProps) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<AuthActionResult | null>(null);

  const title = mode === "login" ? "Sign in" : "Create account";
  const description =
    mode === "login"
      ? "Roberto, Camila, and hosts use the same Supabase project as legacy mdeai. No password — we email a magic link."
      : "New here? Enter your email and we will send a magic link. First click creates your account.";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {authError ? (
          <p className="mb-4 text-sm text-destructive" role="alert">
            {authError}
          </p>
        ) : null}
        {result?.ok ? (
          <p className="text-sm text-muted-foreground" role="status">
            {result.message}
          </p>
        ) : (
          <form
            className="space-y-4"
            action={(formData) => {
              setResult(null);
              startTransition(async () => {
                const res = await sendMagicLink(formData);
                setResult(res);
              });
            }}
          >
            <input type="hidden" name="next" value={nextPath} />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={pending}
              />
            </div>
            {result && !result.ok ? (
              <p className="text-sm text-destructive" role="alert">
                {result.error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Sending…" : "Email magic link"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
        {mode === "login" ? (
          <p>
            New to mdeai?{" "}
            <Link
              href={`/signup${nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href={`/login${nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        )}
        <Link href="/" className="text-primary underline-offset-4 hover:underline">
          Back to home
        </Link>
      </CardFooter>
    </Card>
  );
}
